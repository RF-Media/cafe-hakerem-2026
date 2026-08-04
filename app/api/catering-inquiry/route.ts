import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/ratelimit";
import { cateringInquirySchema, generateReference } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function err(message: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json({ ok: false, error: message }, { status, headers });
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

  let inquiry;
  try {
    inquiry = await prisma.cateringInquiry.create({
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

  const { rtlEmail, sendNotification } = await import("@/lib/resend");
  const html = rtlEmail(
    `פנייה חדשה למגשי אירוח — ${reference}`,
    `
      <p>התקבלה פנייה חדשה למגשי אירוח דרך האתר.</p>
      <table cellspacing="0" cellpadding="6" style="border-collapse:collapse;">
        <tr><td><strong>מספר פנייה</strong></td><td>${inquiry.reference}</td></tr>
        <tr><td><strong>שם</strong></td><td>${data.name}</td></tr>
        <tr><td><strong>טלפון</strong></td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>
        ${data.email ? `<tr><td><strong>אימייל</strong></td><td>${data.email}</td></tr>` : ""}
        ${data.eventDate ? `<tr><td><strong>תאריך אירוע</strong></td><td>${data.eventDate}</td></tr>` : ""}
        ${data.guestCount ? `<tr><td><strong>מספר אורחים</strong></td><td>${data.guestCount}</td></tr>` : ""}
        <tr><td valign="top"><strong>הודעה</strong></td><td>${data.message.replace(/\n/g, "<br>")}</td></tr>
      </table>
    `,
  );
  sendNotification({
    subject: `פנייה חדשה למגשי אירוח — ${reference}`,
    html,
  }).catch((e) => console.error("[catering-inquiry] notify failed:", e));

  return NextResponse.json({ ok: true, reference });
}
