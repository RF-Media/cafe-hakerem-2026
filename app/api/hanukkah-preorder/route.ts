import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { checkPhoneLimit, checkRateLimit, ipFromRequest } from "@/lib/ratelimit";
import { verifyTurnstile } from "@/lib/turnstile";
import { generateReference, hanukkahPreorderSchema } from "@/lib/validation";
import {
  escapeHtml,
  isEmailConfigured,
  orderCopyRecipients,
  rtlEmail,
  sendCustomerEmail,
  sendNotification,
} from "@/lib/resend";
import { bundlePrice, hanukkahBundles } from "@/content/hanukkah";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Hanukkah bundle pre-order (/hanukkah). Name and phone only; a rep calls to
 * confirm and take payment, exactly like the jachnun pre-order. No database:
 * the café's notification email IS the order, so the send is awaited and a
 * failure is reported to the customer with the café's number rather than a
 * reference for an order nobody received (see /api/jachnun-preorder).
 *
 * The price is derived here from tier + size. The browser sends neither a price
 * nor a total.
 *
 * Abuse: Turnstile, the per-IP and per-phone limits, a hidden field (`hp`) and
 * a minimum fill time (`elapsedMs`). A bot caught by the last two gets a
 * normal-looking success and nothing else: no email, no signal.
 */

type ErrorCode = "rate_limited" | "bad_request" | "validation" | "send_failed" | "turnstile";

const MIN_FILL_MS = 2500;

function err(message: string, status: number, code: ErrorCode, headers?: Record<string, string>) {
  return NextResponse.json({ ok: false, error: message, code }, { status, headers });
}

const SEND_FAILED = "לא הצלחנו לשלוח את ההזמנה.";

function looksAutomated(raw: unknown): string | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as { hp?: unknown; elapsedMs?: unknown };
  if (typeof r.hp === "string" && r.hp.trim()) return "honeypot";
  if (typeof r.elapsedMs === "number" && r.elapsedMs < MIN_FILL_MS) return "too_fast";
  return null;
}

export async function POST(req: Request) {
  const rl = await checkRateLimit(req);
  if (!rl.ok) {
    return err("יותר מדי בקשות. נסו שוב בעוד דקה.", 429, "rate_limited", {
      "Retry-After": String(rl.retryAfterSeconds || 60),
    });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return err("הבקשה אינה תקינה.", 400, "bad_request");
  }

  const bot = looksAutomated(raw);
  if (bot) {
    console.warn("[hanukkah-preorder] dropped:", bot);
    return NextResponse.json({ ok: true, reference: generateReference("HNK") });
  }

  const turnstileToken =
    raw && typeof raw === "object" && typeof (raw as { turnstileToken?: unknown }).turnstileToken === "string"
      ? (raw as { turnstileToken: string }).turnstileToken
      : undefined;
  const turnstile = await verifyTurnstile(turnstileToken, ipFromRequest(req));
  if (!turnstile.ok) {
    return err("אימות האבטחה נכשל. רעננו את הדף ונסו שוב.", 403, "turnstile");
  }

  const parsed = hanukkahPreorderSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const msg = !first?.message || first.message === "Required" ? "אחד מהשדות החובה לא מולא." : first.message;
    return err(msg, 400, "validation");
  }
  const data = parsed.data;

  const phoneLimit = await checkPhoneLimit(data.phone);
  if (!phoneLimit.ok) {
    return err("כבר התקבלו הזמנות מהמספר הזה לאחרונה. נסו שוב בעוד שעה או התקשרו אלינו.", 429, "rate_limited", {
      "Retry-After": String(phoneLimit.retryAfterSeconds || 3600),
    });
  }

  const size = data.size as 6 | 12 | 20;
  const total = bundlePrice(data.tier, size);
  const bundle = `${hanukkahBundles[data.tier].label}, ${size} סופגניות`;
  const reference = generateReference("HNK");
  const subject = `הזמנת סופגניות ${reference} · ${bundle} · ₪${total} · ${data.name}`;

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 10px;vertical-align:top;"><strong>${label}</strong></td><td style="padding:6px 10px;">${value}</td></tr>`;

  const html = rtlEmail(
    `הזמנת סופגניות חדשה - ${reference}`,
    `
      <p>התקבלה הזמנת מארז סופגניות חדשה דרך האתר. <strong>לא שולם מראש</strong> - יש להתקשר ללקוח לאישור ההזמנה, תיאום האיסוף וגביית התשלום.</p>
      <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        ${row("מספר הזמנה", escapeHtml(reference))}
        ${row("מארז", escapeHtml(bundle))}
        ${row("סכום לתשלום", `₪${total}`)}
        ${row("שם", escapeHtml(data.name))}
        ${row("טלפון", `<a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a>`)}
        ${data.notes ? row("טעמים מועדפים / בקשות", escapeHtml(data.notes).replace(/\n/g, "<br>")) : ""}
      </table>
    `,
  );

  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[hanukkah-preorder] Resend not configured — order logged, not sent (dev only):", {
        reference,
        bundle,
        total,
        name: data.name,
        phone: data.phone,
      });
      return NextResponse.json({ ok: true, reference });
    }
    console.error("[hanukkah-preorder] Resend not configured — order NOT delivered:", reference);
    return err(SEND_FAILED, 503, "send_failed");
  }

  const sent = await sendNotification({ subject, html });
  if (!sent) return err(SEND_FAILED, 502, "send_failed");

  // The internal copy follows the same rule as every other order: after the
  // café has it, never awaited, under waitUntil so Vercel can't freeze it.
  const copyTo = orderCopyRecipients();
  if (copyTo.length) {
    waitUntil(
      sendCustomerEmail({ to: copyTo, subject, html }).catch((e) =>
        console.error("[hanukkah-preorder] order copy failed:", e),
      ),
    );
  }

  return NextResponse.json({ ok: true, reference });
}
