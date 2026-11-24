import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPhoneLimit, checkRateLimit, ipFromRequest } from "@/lib/ratelimit";
import { verifyTurnstile } from "@/lib/turnstile";
import { cateringInquirySchema, generateReference } from "@/lib/validation";
import { cateringInquiryRecipients, escapeHtml, rtlEmail, sendCustomerEmail, sendNotification } from "@/lib/resend";
import { waitUntil } from "@vercel/functions";
import { cateringConfirmationEmail, cateringInquiryTicket, eventDateLabel } from "@/lib/email-templates";
import { cateringConfirmationHtml, pdfAttachment } from "@/lib/confirmation-pdf";
import { catering } from "@/content/catering";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// The customer's PDF is rendered by Chromium after the response, under waitUntil.
export const maxDuration = 60;

/** A person needs longer than this to get through three steps. */
const MIN_FILL_MS = 4000;

function err(message: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json({ ok: false, error: message }, { status, headers });
}

/** Same double guard as jachnun-order: only skips the DB outside production. */
function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL) || process.env.NODE_ENV === "production";
}

/**
 * Bots that fill the hidden field, or post faster than anyone could type, get
 * a normal-looking success and nothing else: no row, no email, and no signal
 * that tells them what tripped. A payload without `elapsedMs` (a tab opened
 * before this check existed) is let through to Turnstile as before.
 */
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
    return err("יותר מדי בקשות. נסו שוב בעוד דקה.", 429, {
      "Retry-After": String(rl.retryAfterSeconds || 60),
    });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return err("הבקשה אינה תקינה.", 400);
  }

  const bot = looksAutomated(raw);
  if (bot) {
    console.warn(`[catering-inquiry] dropped (${bot}) from ${ipFromRequest(req)}`);
    return NextResponse.json({ ok: true, reference: generateReference("CAT") });
  }

  // Turnstile gates every submission before any work. Degrades to allow-all
  // when TURNSTILE_SECRET_KEY is unset (lib/turnstile.ts).
  const turnstileToken =
    raw && typeof raw === "object" && typeof (raw as { turnstileToken?: unknown }).turnstileToken === "string"
      ? (raw as { turnstileToken: string }).turnstileToken
      : undefined;
  const turnstile = await verifyTurnstile(turnstileToken, ipFromRequest(req));
  if (!turnstile.ok) {
    return err("אימות האבטחה נכשל. רעננו את הדף ונסו שוב.", 403);
  }

  const parsed = cateringInquirySchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const msg = !first?.message || first.message === "Required"
      ? "אחד מהשדות החובה לא מולא."
      : first.message;
    return err(msg, 400);
  }
  const data = parsed.data;

  // Per-phone limit, same bucket the jachnun pre-order uses, so a single
  // phone can't ping-pong between the two forms to bypass the cap.
  const phoneLimit = await checkPhoneLimit(data.phone);
  if (!phoneLimit.ok) {
    return err("כבר התקבלו פניות מהמספר הזה לאחרונה. נסו שוב בעוד שעה או התקשרו אלינו.", 429, {
      "Retry-After": String(phoneLimit.retryAfterSeconds || 3600),
    });
  }
  const reference = generateReference("CAT");

  // Unknown ids are dropped, not echoed: only real tray names reach an email.
  const trays = data.trays
    .map((id) => catering.options.find((o) => o.id === id)?.title.he)
    .filter((t): t is string => Boolean(t));
  const fulfilment = catering.inquiry.when.options.find((o) => o.id === data.fulfilment)?.label;

  // The DB row has one free-text column; the structured choices go at its top.
  const stored = [
    `מגשים: ${trays.length ? trays.join(", ") : "להמליץ"}`,
    fulfilment ? `איך: ${fulfilment}` : "",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  if (hasDatabase()) {
    try {
      await prisma.cateringInquiry.create({
        data: {
          reference,
          name: data.name,
          phone: data.phone,
          email: data.email,
          eventDate: data.eventDate ? new Date(data.eventDate) : null,
          guestCount: data.guestCount,
          message: stored,
        },
      });
    } catch (e) {
      console.error("[catering-inquiry] db error:", e);
      return err("לא הצלחנו לשלוח את הפנייה. נסו שוב או התקשרו לקפה.", 500);
    }
  } else {
    console.warn("[catering-inquiry] DATABASE_URL unset — inquiry not persisted (dev only).", { reference, ...data });
  }

  const html = rtlEmail(
    `פנייה חדשה למגשי אירוח - ${reference}`,
    `
      <p>התקבלה פנייה חדשה למגשי אירוח דרך האתר.</p>
      <table cellspacing="0" cellpadding="6" style="border-collapse:collapse;">
        <tr><td><strong>מספר פנייה</strong></td><td>${escapeHtml(reference)}</td></tr>
        <tr><td><strong>שם</strong></td><td>${escapeHtml(data.name)}</td></tr>
        <tr><td><strong>טלפון</strong></td><td><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></td></tr>
        ${data.email ? `<tr><td><strong>אימייל</strong></td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>` : ""}
        ${data.eventDate ? `<tr><td><strong>תאריך אירוע</strong></td><td>${escapeHtml(eventDateLabel(data.eventDate))}</td></tr>` : ""}
        ${data.guestCount ? `<tr><td><strong>מספר אורחים</strong></td><td>${data.guestCount}</td></tr>` : ""}
        <tr><td><strong>מגשים</strong></td><td>${escapeHtml(trays.length ? trays.join(", ") : "להמליץ")}</td></tr>
        ${fulfilment ? `<tr><td><strong>איסוף/משלוח</strong></td><td>${escapeHtml(fulfilment)}</td></tr>` : ""}
        ${data.message ? `<tr><td valign="top"><strong>הערות</strong></td><td>${escapeHtml(data.message).replace(/\n/g, "<br>")}</td></tr>` : ""}
      </table>
    `,
  );
  // waitUntil, not bare promises: on Vercel a function can be frozen the
  // moment it returns, and the inquiry is already saved, so these must finish.
  waitUntil(
    sendNotification({ subject: `פנייה חדשה למגשי אירוח - ${reference}`, html, replyTo: data.email }).catch((e) =>
      console.error("[catering-inquiry] notify failed:", e),
    ),
  );

  const confirmationInput = {
    reference,
    name: data.name,
    phone: data.phone,
    email: data.email,
    eventDate: data.eventDate,
    guestCount: data.guestCount,
    trays,
    fulfilment,
    message: data.message,
  };
  if (data.email) {
    const to = data.email;
    waitUntil(
      (async () => {
        const attachments = await pdfAttachment(reference, cateringConfirmationHtml(confirmationInput));
        await sendCustomerEmail({ to, attachments, ...cateringConfirmationEmail(confirmationInput) });
      })().catch((e) => console.error("[catering-inquiry] confirmation failed:", e)),
    );
  }
  // The inquiry itself, to the caterer and CoffeeStream (CATERING_INQUIRY_EMAILS).
  const team = cateringInquiryRecipients();
  if (team.length) {
    waitUntil(
      sendCustomerEmail({ to: team, replyTo: data.email, ...cateringInquiryTicket(confirmationInput) }).catch((e) =>
        console.error("[catering-inquiry] inquiry ticket failed:", e),
      ),
    );
  } else {
    console.error("[catering-inquiry] no CATERING_INQUIRY_EMAILS / ORDER_COPY_EMAILS — ticket not sent");
  }

  return NextResponse.json({ ok: true, reference });
}
