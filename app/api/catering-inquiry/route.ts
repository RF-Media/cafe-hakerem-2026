import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/ratelimit";
import { cateringInquirySchema, generateReference } from "@/lib/validation";
import { escapeHtml, orderCopyRecipients, rtlEmail, sendCustomerEmail, sendNotification } from "@/lib/resend";
import { waitUntil } from "@vercel/functions";
import { cateringConfirmationEmail, cateringInquiryTicket } from "@/lib/email-templates";
import { cateringConfirmationHtml, pdfAttachment } from "@/lib/confirmation-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// The customer's PDF is rendered by Chromium after the response, under waitUntil.
export const maxDuration = 60;

function err(message: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json({ ok: false, error: message }, { status, headers });
}

/** Same double guard as jachnun-order: only skips the DB outside production. */
function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL) || process.env.NODE_ENV === "production";
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

  const parsed = cateringInquirySchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const msg = !first?.message || first.message === "Required"
      ? "אחד מהשדות החובה לא מולא."
      : first.message;
    return err(msg, 400);
  }
  const data = parsed.data;
  const reference = generateReference("CAT");

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
          message: data.message,
        },
      });
    } catch (e) {
      console.error("[catering-inquiry] db error:", e);
      return err("לא הצלחנו לשלוח את הפנייה. נסו שוב או התקשרו לקפה.", 500);
    }
  } else {
    console.warn("[catering-inquiry] DATABASE_URL unset — inquiry not persisted (dev only).");
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
        ${data.eventDate ? `<tr><td><strong>תאריך אירוע</strong></td><td>${escapeHtml(data.eventDate.slice(0, 10))}</td></tr>` : ""}
        ${data.guestCount ? `<tr><td><strong>מספר אורחים</strong></td><td>${data.guestCount}</td></tr>` : ""}
        <tr><td valign="top"><strong>הודעה</strong></td><td>${escapeHtml(data.message).replace(/\n/g, "<br>")}</td></tr>
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

  const confirmationInput = { reference, ...data };
  if (data.email) {
    const to = data.email;
    waitUntil(
      (async () => {
        const attachments = await pdfAttachment(reference, cateringConfirmationHtml(confirmationInput));
        await sendCustomerEmail({ to, attachments, ...cateringConfirmationEmail(confirmationInput) });
      })().catch((e) => console.error("[catering-inquiry] confirmation failed:", e)),
    );
  }
  const copyTo = orderCopyRecipients();
  if (copyTo.length) {
    waitUntil(
      sendCustomerEmail({ to: copyTo, replyTo: data.email, ...cateringInquiryTicket(confirmationInput) }).catch((e) =>
        console.error("[catering-inquiry] order ticket failed:", e),
      ),
    );
  }

  return NextResponse.json({ ok: true, reference });
}
