import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/ratelimit";
import { getAvailableSlots } from "@/lib/jachnun-cutoff";
import { generateReference, jachnunPreorderSchema } from "@/lib/validation";
import { escapeHtml, isEmailConfigured, rtlEmail, sendNotification } from "@/lib/resend";
import { formatILS } from "@/lib/money";
import { jachnunPackages } from "@/content/jachnun";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Phase-1 jachnun pre-order: the one-step form on /jachnun. Pay at pickup,
 * no database — the café's notification email IS the order.
 *
 * That inverts CLAUDE.md §13 step 4. Elsewhere the email is fire-and-forget
 * because the row is already persisted; here there is no row, so the send is
 * awaited and a failure is reported to the customer with the phone number.
 * Telling someone their jachnun is ordered when it reached nobody is the one
 * outcome this route must never produce.
 */

type ErrorCode = "rate_limited" | "bad_request" | "validation" | "slot_unavailable" | "send_failed";

function err(message: string, status: number, code: ErrorCode, headers?: Record<string, string>) {
  return NextResponse.json({ ok: false, error: message, code }, { status, headers });
}

// The form renders the café's number as a tel: link under every error.
const SEND_FAILED = "לא הצלחנו לשלוח את ההזמנה.";

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

  const parsed = jachnunPreorderSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const msg = !first?.message || first.message === "Required" ? "אחד מהשדות החובה לא מולא." : first.message;
    return err(msg, 400, "validation");
  }
  const data = parsed.data;

  // Re-derived from the server clock: the Thursday 18:00 cutoff can pass
  // while the form is open.
  const slot = getAvailableSlots().find((s) => s.iso === data.pickupSlot);
  if (!slot) {
    return err("חלון האיסוף שבחרתם כבר לא זמין. בחרו חלון אחר ושלחו שוב.", 409, "slot_unavailable");
  }

  const pkg = jachnunPackages.find((p) => p.id === data.packageId)!;
  const reference = generateReference("JCH");
  const subject = `הזמנת ג'חנון ${reference} · ${slot.label} · ${data.name}`;

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 10px;vertical-align:top;"><strong>${label}</strong></td><td style="padding:6px 10px;">${value}</td></tr>`;

  const html = rtlEmail(
    `הזמנת ג'חנון חדשה - ${reference}`,
    `
      <p>התקבלה הזמנת ג'חנון חדשה דרך האתר. <strong>התשלום באיסוף</strong> - לא שולם מראש.</p>
      <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        ${row("מספר הזמנה", escapeHtml(reference))}
        ${row("איסוף", `${escapeHtml(slot.day)} · <span dir="ltr">${escapeHtml(slot.window)}</span>`)}
        ${row("חבילה", `${escapeHtml(pkg.title)} (${pkg.units} יח׳)`)}
        ${row("לתשלום באיסוף", formatILS(pkg.totalAgorot))}
        ${row("שם", escapeHtml(data.name))}
        ${row("טלפון", `<a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a>`)}
        ${data.email ? row("אימייל", `<a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>`) : ""}
        ${data.notes ? row("בקשות מיוחדות", escapeHtml(data.notes).replace(/\n/g, "<br>")) : ""}
      </table>
    `,
  );

  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[jachnun-preorder] Resend not configured — order logged, not sent (dev only):", {
        reference,
        slot: slot.label,
        package: pkg.title,
        name: data.name,
        phone: data.phone,
      });
      return NextResponse.json({ ok: true, reference });
    }
    console.error("[jachnun-preorder] Resend not configured — order NOT delivered:", reference);
    return err(SEND_FAILED, 503, "send_failed");
  }

  const sent = await sendNotification({ subject, html, replyTo: data.email });
  if (!sent) return err(SEND_FAILED, 502, "send_failed");

  return NextResponse.json({ ok: true, reference });
}
