/**
 * Resend client — lazily instantiated so the build doesn't fail
 * when RESEND_API_KEY is absent (CI, local dev without email).
 *
 * Callers should `await sendNotification(...)` and treat a `false`
 * return as "email skipped, not fatal" — order persistence is the
 * source of truth.
 */
import { Resend } from "resend";
import { business } from "@/content/business";

let client: Resend | null = null;

function getClient(): Resend | null {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client = new Resend(key);
  return client;
}

export type EmailPayload = {
  subject: string;
  html: string;
  /** Lets the café answer a customer straight from the notification. */
  replyTo?: string;
};

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY && process.env.RESEND_FROM && process.env.CAFE_NOTIFICATION_EMAIL,
  );
}

export async function sendNotification(payload: EmailPayload): Promise<boolean> {
  const c = getClient();
  const to = process.env.CAFE_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM;

  if (!c || !to || !from) {
    // Loud in dev, silent in prod (so a missing env doesn't break orders).
    if (process.env.NODE_ENV !== "production") {
      console.warn("[resend] skipping send — missing API key, from, or to.");
    }
    return false;
  }

  try {
    // resend@4 reports API rejections (unverified domain, bad key) in
    // `error` rather than throwing, so a bare await would report success.
    const { error } = await c.emails.send({
      from,
      to,
      subject: payload.subject,
      html: payload.html,
      replyTo: payload.replyTo,
    });
    if (error) {
      console.error("[resend] send failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[resend] send failed:", err);
    return false;
  }
}

/**
 * A confirmation to the customer. Callers never await this in a way that can
 * fail the request: the order or inquiry has already succeeded by the time it
 * runs, and a missing confirmation is a nuisance, not a lost order.
 */
export async function sendCustomerEmail(
  payload: EmailPayload & { to: string | string[]; attachments?: { filename: string; content: Buffer }[] },
): Promise<boolean> {
  const c = getClient();
  const from = process.env.RESEND_FROM;

  if (!c || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[resend] skipping customer email — missing API key or from.");
    }
    return false;
  }

  try {
    const { error } = await c.emails.send({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      replyTo: payload.replyTo ?? business.email.public,
      attachments: payload.attachments,
    });
    if (error) {
      console.error("[resend] customer send failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[resend] customer send failed:", err);
    return false;
  }
}

/**
 * Who gets the internal copy of every confirmation (CoffeeStream now, the
 * seller later). Comma-separated in ORDER_COPY_EMAILS, so adding someone is an
 * env change, not a deploy of new code.
 */
export function orderCopyRecipients(): string[] {
  return (process.env.ORDER_COPY_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Wraps an HTML body in an RTL Hebrew email shell.
 */
export function rtlEmail(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="he" dir="rtl">
  <head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
  <body style="font-family: -apple-system, 'Noto Sans Hebrew', Arial, sans-serif; background:#f6f3ee; color:#241d19; padding:24px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background:#fdfbf6;border:1px solid #dcd7d0;border-radius:12px;padding:24px;">
      <tr><td>
        <h1 style="font-family:inherit;font-weight:700;font-size:22px;letter-spacing:-0.02em;margin:0 0 16px;">${escapeHtml(title)}</h1>
        ${bodyHtml}
      </td></tr>
    </table>
  </body>
</html>`;
}

/**
 * Exported because callers build the email body, and anything a customer
 * typed — a name, a phone, a special request — must be escaped before it is
 * interpolated into that HTML. Notification emails are read in a mail client
 * that renders markup.
 */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
