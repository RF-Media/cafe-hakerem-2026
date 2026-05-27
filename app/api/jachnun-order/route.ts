import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/ratelimit";
import { isAvailableSlot } from "@/lib/jachnun-cutoff";
import { generateReference, jachnunOrderSchema } from "@/lib/validation";

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

  const parsed = jachnunOrderSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const msg = !first?.message || first.message === "Required"
      ? "אחד מהשדות החובה לא מולא."
      : first.message;
    return err(msg, 400);
  }
  const data = parsed.data;

  if (!isAvailableSlot(data.pickupSlot)) {
    return err("חלון האיסוף שנבחר אינו זמין יותר. רעננו את הטופס ונסו שוב.", 409);
  }

  const reference = generateReference("JCH");

  let order;
  try {
    order = await prisma.jachnunOrder.create({
      data: {
        reference,
        name: data.name,
        phone: data.phone,
        quantity: data.quantity,
        pickupSlot: new Date(data.pickupSlot),
        notes: data.notes,
      },
    });
  } catch (e) {
    console.error("[jachnun-order] db error:", e);
    return err("לא הצלחנו לשמור את ההזמנה. נסו שוב או התקשרו לקפה.", 500);
  }

  const { rtlEmail, sendNotification } = await import("@/lib/resend");
  const html = rtlEmail(
    `הזמנת ג'חנון חדשה — ${reference}`,
    `
      <p>התקבלה הזמנת ג'חנון חדשה דרך האתר.</p>
      <table cellspacing="0" cellpadding="6" style="border-collapse:collapse;">
        <tr><td><strong>מספר הזמנה</strong></td><td>${order.reference}</td></tr>
        <tr><td><strong>שם</strong></td><td>${data.name}</td></tr>
        <tr><td><strong>טלפון</strong></td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>
        <tr><td><strong>כמות</strong></td><td>${data.quantity}</td></tr>
        <tr><td><strong>חלון איסוף</strong></td><td>${order.pickupSlot.toISOString()}</td></tr>
        ${data.notes ? `<tr><td><strong>הערות</strong></td><td>${data.notes}</td></tr>` : ""}
      </table>
    `,
  );
  await sendNotification({
    subject: `הזמנת ג'חנון חדשה — ${reference}`,
    html,
  });

  return NextResponse.json({ ok: true, reference });
}
