import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/ratelimit";
import { getAvailableSlots, isAvailableSlot } from "@/lib/jachnun-cutoff";
import { generateReceiptToken, generateReference, jachnunOrderSchema } from "@/lib/validation";
import { priceOrder } from "@/lib/jachnun-pricing";
import { verifyMockPaymentToken } from "@/lib/mock-payment";
import { buildReceipt, type Receipt, type ReceiptPaymentStatus } from "@/lib/order-receipt";
import { formatILS } from "@/lib/money";
import type { PaymentMethod } from "@/content/jachnun-order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Machine-readable failure kinds. The checkout uses these to decide where to
 * send the customer next — a taken pickup slot goes back to step 3, a
 * declined card stays on the payment step — which a Hebrew sentence cannot
 * be parsed for.
 */
type ErrorCode =
  | "rate_limited"
  | "bad_request"
  | "validation"
  | "slot_unavailable"
  | "total_mismatch"
  | "payment_invalid"
  | "server_error";

function err(
  message: string,
  status: number,
  code: ErrorCode,
  headers?: Record<string, string>,
) {
  return NextResponse.json({ ok: false, error: message, code }, { status, headers });
}

/**
 * In production the answer is always yes — a deploy without DATABASE_URL is a
 * broken deploy and must fail loudly rather than silently not saving orders.
 * Locally, a missing URL switches the route to the in-memory path below so
 * the checkout is demoable end to end before Neon is wired up.
 */
function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL) || process.env.NODE_ENV === "production";
}

/** Prisma's unique-constraint violation. */
function isUniqueViolation(e: unknown, target?: string): boolean {
  const code = (e as { code?: string })?.code;
  if (code !== "P2002") return false;
  if (!target) return true;
  const fields = (e as { meta?: { target?: string[] | string } })?.meta?.target;
  const list = Array.isArray(fields) ? fields : [fields];
  return list.includes(target);
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

  const parsed = jachnunOrderSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const msg =
      !first?.message || first.message === "Required"
        ? "אחד מהשדות החובה לא מולא."
        : first.message;
    return err(msg, 400, "validation");
  }
  const data = parsed.data;

  /* ── Idempotency ──
     A double-tapped pay button, a retried request after a flaky response, or
     a browser that replays the POST all arrive with the same key. Returning
     the original order is the only correct answer; creating a second one
     means the café bakes twice and the customer is charged twice. */
  if (hasDatabase()) {
    const existing = await prisma.jachnunOrder
      .findUnique({ where: { idempotencyKey: data.idempotencyKey } })
      .catch(() => null);
    if (existing) {
      return NextResponse.json({
        ok: true,
        reference: existing.reference,
        receipt: receiptFromRow(existing),
      });
    }
  }

  /* ── Pickup slot ──
     Re-derived from the server clock, not trusted from the payload. The
     Thursday 18:00 cutoff can pass while a customer is filling the form. */
  if (!isAvailableSlot(data.pickupSlot)) {
    return err(
      "חלון האיסוף שנבחר אינו זמין יותר. בחרו חלון אחר ונשלים את ההזמנה.",
      409,
      "slot_unavailable",
    );
  }
  const slot = getAvailableSlots().find((s) => s.iso === data.pickupSlot);
  if (!slot) {
    return err(
      "חלון האיסוף שנבחר אינו זמין יותר. בחרו חלון אחר ונשלים את ההזמנה.",
      409,
      "slot_unavailable",
    );
  }

  /* ── Money ──
     Recomputed from the selection. `data.totalAgorot` is only ever compared
     against, never used. */
  const priced = priceOrder({ units: data.quantity, extras: data.extras });
  if (priced.totalAgorot !== data.totalAgorot) {
    return err("המחירים התעדכנו בזמן ההזמנה. בדקו את הסיכום ואשרו שוב.", 409, "total_mismatch");
  }

  /* ── Payment ──
     Cash orders are authorised for ₪0 and charged at the counter; every other
     method is charged up front. The expected amount is the server's number. */
  const isCash = data.paymentMethod === "cash";
  const expectedAmount = isCash ? 0 : priced.totalAgorot;
  const payment = verifyMockPaymentToken(data.paymentToken, {
    method: data.paymentMethod,
    amountAgorot: expectedAmount,
  });
  if (!payment.ok) {
    return err("אישור התשלום אינו תקין. נסו לשלם שוב.", 402, "payment_invalid");
  }
  const paymentStatus: ReceiptPaymentStatus =
    payment.status === "authorized_only" ? "due_at_pickup" : "paid";

  /* ── Dev without a database ──
     The checkout is meant to be demoable end to end before Neon is wired up,
     and a 500 at the last step of a five-step flow demonstrates nothing.
     Double-guarded: this can only ever run outside production AND with no
     DATABASE_URL set, so a production deploy that loses its env var fails
     loudly instead of quietly not saving orders. */
  if (!hasDatabase()) {
    const seen = devOrders.get(data.idempotencyKey);
    if (seen) {
      return NextResponse.json({ ok: true, reference: seen.reference, receipt: receiptFromRow(seen) });
    }
    const row = {
      id: `dev_${Date.now()}`,
      createdAt: new Date(),
      reference: generateReference("JCH"),
      receiptToken: generateReceiptToken(),
      name: data.name,
      phone: data.phone,
      email: data.email ?? null,
      quantity: data.quantity,
      extraTomato: data.extras.tomato,
      extraOlives: data.extras.olives,
      extraEgg: data.extras.egg,
      pickupSlot: new Date(data.pickupSlot),
      pickupLabel: slot.label,
      notes: data.notes ?? null,
      totalAgorot: priced.totalAgorot,
      paymentMethod: data.paymentMethod,
      paymentStatus,
      paymentRef: data.paymentToken.slice(0, 64),
      cardBrand: payment.brand === "unknown" ? null : payment.brand,
      cardLast4: payment.last4 || null,
      idempotencyKey: data.idempotencyKey,
    } satisfies OrderRow;

    devOrders.set(data.idempotencyKey, row);
    console.warn("[jachnun-order] DATABASE_URL unset — order not persisted (dev only).");
    const devReceipt = receiptFromRow(row);
    await notifyCafe(devReceipt);
    return NextResponse.json({ ok: true, reference: row.reference, receipt: devReceipt });
  }

  /* ── Persist ──
     `generateReference` draws 4 characters at random against a unique column,
     so a collision is unlikely but not impossible. Retry the code rather than
     failing an order that is already paid for. */
  let order: Awaited<ReturnType<typeof prisma.jachnunOrder.create>> | null = null;
  for (let attempt = 0; attempt < 5 && !order; attempt++) {
    try {
      order = await prisma.jachnunOrder.create({
        data: {
          reference: generateReference("JCH"),
          receiptToken: generateReceiptToken(),
          name: data.name,
          phone: data.phone,
          email: data.email,
          quantity: data.quantity,
          extraTomato: data.extras.tomato,
          extraOlives: data.extras.olives,
          extraEgg: data.extras.egg,
          pickupSlot: new Date(data.pickupSlot),
          pickupLabel: slot.label,
          notes: data.notes,
          totalAgorot: priced.totalAgorot,
          paymentMethod: data.paymentMethod,
          paymentStatus,
          paymentRef: data.paymentToken.slice(0, 64),
          cardBrand: payment.brand === "unknown" ? null : payment.brand,
          cardLast4: payment.last4 || null,
          idempotencyKey: data.idempotencyKey,
        },
      });
    } catch (e) {
      // Lost the race against a concurrent request with the same key —
      // that request's order is the canonical one.
      if (isUniqueViolation(e, "idempotencyKey")) {
        const winner = await prisma.jachnunOrder
          .findUnique({ where: { idempotencyKey: data.idempotencyKey } })
          .catch(() => null);
        if (winner) {
          return NextResponse.json({
            ok: true,
            reference: winner.reference,
            receipt: receiptFromRow(winner),
          });
        }
      }
      if (isUniqueViolation(e, "reference")) continue;
      console.error("[jachnun-order] db error:", e);
      return err("לא הצלחנו לשמור את ההזמנה. נסו שוב או התקשרו לקפה.", 500, "server_error");
    }
  }

  if (!order) {
    console.error("[jachnun-order] exhausted reference retries");
    return err("לא הצלחנו לשמור את ההזמנה. נסו שוב או התקשרו לקפה.", 500, "server_error");
  }

  const receipt = receiptFromRow(order);
  notifyCafe(receipt).catch((e) => console.error("[jachnun-order] notify failed:", e));

  return NextResponse.json({ ok: true, reference: order.reference, receipt });
}

/* ── Receipt ─────────────────────────────────────────────────────────── */

type OrderRow = Awaited<ReturnType<typeof prisma.jachnunOrder.create>>;

/**
 * Idempotency store for the no-database dev path above. Per-process and
 * deliberately unbounded-but-tiny: it exists so a double-tapped pay button
 * behaves the same in a local demo as it does against Postgres.
 */
const devOrders = new Map<string, OrderRow>();

/**
 * Line items are re-derived from the stored selection rather than stored as
 * a blob, so a price change never rewrites the history of an order that was
 * already priced — `totalAgorot` on the row remains the number that was
 * charged, and the receipt shows it.
 */
function receiptFromRow(order: OrderRow): Receipt {
  const priced = priceOrder({
    units: order.quantity,
    extras: { tomato: order.extraTomato, olives: order.extraOlives, egg: order.extraEgg },
  });

  return buildReceipt({
    reference: order.reference,
    receiptToken: order.receiptToken,
    createdAt: order.createdAt,
    name: order.name,
    phone: order.phone,
    email: order.email,
    notes: order.notes,
    pickupSlot: order.pickupSlot,
    pickupLabel: order.pickupLabel,
    lines: priced.lines,
    savingsAgorot: priced.savingsAgorot,
    totalAgorot: order.totalAgorot,
    paymentMethod: order.paymentMethod as PaymentMethod,
    paymentStatus: order.paymentStatus as ReceiptPaymentStatus,
    cardBrand: order.cardBrand,
    cardLast4: order.cardLast4,
  });
}

/* ── Notification ────────────────────────────────────────────────────── */

/**
 * Fire-and-forget by contract: the order is already persisted, and a Resend
 * outage must not turn a paid order into a 500. Everything the customer typed
 * is escaped — this HTML is rendered by a mail client.
 */
async function notifyCafe(receipt: Receipt): Promise<void> {
  const { rtlEmail, sendNotification, escapeHtml } = await import("@/lib/resend");

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 10px;"><strong>${label}</strong></td><td style="padding:6px 10px;">${value}</td></tr>`;

  const itemRows = receipt.lines
    .map(
      (l) =>
        `<tr><td style="padding:4px 10px;">${escapeHtml(l.label)}${
          l.note ? ` (${escapeHtml(l.note)})` : ""
        }</td><td style="padding:4px 10px;">× ${l.qty}</td><td style="padding:4px 10px;">${
          l.included ? "—" : formatILS(l.totalAgorot)
        }</td></tr>`,
    )
    .join("");

  const paymentLine =
    receipt.payment.status === "due_at_pickup"
      ? `לתשלום במקום — ${formatILS(receipt.totalAgorot)} (${escapeHtml(receipt.payment.methodLabel)})`
      : `שולם — ${formatILS(receipt.totalAgorot)} (${escapeHtml(receipt.payment.methodLabel)}${
          receipt.payment.last4 ? `, •••• ${escapeHtml(receipt.payment.last4)}` : ""
        })`;

  const html = rtlEmail(
    `הזמנת ג'חנון חדשה — ${receipt.reference}`,
    `
      <p>התקבלה הזמנת ג'חנון חדשה דרך האתר.</p>
      <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        ${row("מספר הזמנה", escapeHtml(receipt.reference))}
        ${row("שם", escapeHtml(receipt.customer.name))}
        ${row(
          "טלפון",
          `<a href="tel:${escapeHtml(receipt.customer.phone)}">${escapeHtml(receipt.customer.phone)}</a>`,
        )}
        ${receipt.customer.email ? row("אימייל", escapeHtml(receipt.customer.email)) : ""}
        ${row("חלון איסוף", escapeHtml(receipt.pickup.label))}
        ${row("תשלום", paymentLine)}
        ${receipt.customer.notes ? row("בקשות מיוחדות", escapeHtml(receipt.customer.notes)) : ""}
      </table>
      <h2 style="font-size:16px;margin:20px 0 6px;">פירוט ההזמנה</h2>
      <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${itemRows}</table>
    `,
  );

  await sendNotification({ subject: `הזמנת ג'חנון חדשה — ${receipt.reference}`, html });
}
