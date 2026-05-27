/**
 * Resend client — lazily instantiated so the build doesn't fail
 * when RESEND_API_KEY is absent (CI, local dev without email).
 *
 * Callers should `await sendNotification(...)` and treat a `false`
 * return as "email skipped, not fatal" — order persistence is the
 * source of truth.
 */
import { Resend } from "resend";

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
};

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
    await c.emails.send({
      from,
      to,
      subject: payload.subject,
      html: payload.html,
    });
    return true;
  } catch (err) {
    console.error("[resend] send failed:", err);
    return false;
  }
}

/**
 * Wraps an HTML body in an RTL Hebrew email shell.
 */
export function rtlEmail(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="he" dir="rtl">
  <head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
  <body style="font-family: -apple-system, 'Heebo', Arial, sans-serif; background:#f1ebdf; color:#1f1a14; padding:24px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background:#fffaf0;border:1px solid #e0d7c5;border-radius:12px;padding:24px;">
      <tr><td>
        <h1 style="font-family:'Frank Ruhl Libre', Georgia, serif;font-size:22px;margin:0 0 16px;">${escapeHtml(title)}</h1>
        ${bodyHtml}
      </td></tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
