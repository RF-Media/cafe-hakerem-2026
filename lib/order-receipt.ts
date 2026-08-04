/**
 * The receipt model for a jachnun order.
 *
 * One serializable shape, three consumers:
 *   • today — the confirmation screen renders it, and `@media print` turns
 *     that screen into a printable/saveable receipt;
 *   • phase 2 — a PDF renderer at `/api/jachnun-order/[receiptToken]/receipt`;
 *   • phase 2 — the customer confirmation email, via `rtlEmail()` in
 *     lib/resend.ts.
 *
 * It is built on the **server** from the persisted row and returned in the
 * API response, so the confirmation screen shows the numbers that were
 * actually stored and charged rather than the ones the browser calculated.
 * Every field the PDF and the email will need is already here — that is the
 * whole point of building it now.
 */

import { business } from "@/content/business";
import { orderCopy, type PaymentMethod } from "@/content/jachnun-order";
import type { PriceLine } from "@/lib/jachnun-pricing";

export type ReceiptPaymentStatus = "paid" | "due_at_pickup";

export type Receipt = {
  reference: string;
  /** Opaque, unguessable id — the future PDF route keys off this, not the id. */
  receiptToken: string;
  issuedAt: string;

  business: {
    name: string;
    address: string;
    phoneDisplay: string;
    phoneTel: string;
    siteUrl: string;
  };

  customer: {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
  };

  pickup: {
    iso: string;
    label: string;
    address: string;
  };

  lines: PriceLine[];
  savingsAgorot: number;
  totalAgorot: number;

  payment: {
    method: PaymentMethod;
    methodLabel: string;
    status: ReceiptPaymentStatus;
    /** Card brand and last four, when a card was involved. Never the number. */
    brand?: string;
    last4?: string;
  };
};

export type ReceiptSource = {
  reference: string;
  receiptToken: string;
  createdAt: Date;
  name: string;
  phone: string;
  email?: string | null;
  notes?: string | null;
  pickupSlot: Date;
  pickupLabel: string;
  lines: PriceLine[];
  savingsAgorot: number;
  totalAgorot: number;
  paymentMethod: PaymentMethod;
  paymentStatus: ReceiptPaymentStatus;
  cardBrand?: string | null;
  cardLast4?: string | null;
};

function fullAddress(): string {
  return `${business.address.street.he}, ${business.address.city.he}`;
}

export function buildReceipt(order: ReceiptSource): Receipt {
  return {
    reference: order.reference,
    receiptToken: order.receiptToken,
    issuedAt: order.createdAt.toISOString(),

    business: {
      name: business.name.he,
      address: fullAddress(),
      phoneDisplay: business.phone.display,
      phoneTel: business.phone.tel,
      siteUrl: business.siteUrl,
    },

    customer: {
      name: order.name,
      phone: order.phone,
      email: order.email ?? undefined,
      notes: order.notes ?? undefined,
    },

    pickup: {
      iso: order.pickupSlot.toISOString(),
      label: order.pickupLabel,
      address: fullAddress(),
    },

    lines: order.lines,
    savingsAgorot: order.savingsAgorot,
    totalAgorot: order.totalAgorot,

    payment: {
      method: order.paymentMethod,
      methodLabel: orderCopy.methods[order.paymentMethod].label,
      status: order.paymentStatus,
      brand: order.cardBrand ?? undefined,
      last4: order.cardLast4 ?? undefined,
    },
  };
}
