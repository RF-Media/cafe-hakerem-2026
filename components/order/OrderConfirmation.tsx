"use client";

/**
 * The confirmation screen.
 *
 * Rendered from the `Receipt` the **server** returned, not from the local
 * draft: what the customer sees here is what was stored and charged.
 *
 * It doubles as the printable receipt (see the `@media print` block in
 * globals.css) — the phase-2 PDF renders the same `Receipt` model, so the
 * layout below is the reference for it.
 */

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatILS } from "@/lib/money";
import type { Receipt } from "@/lib/order-receipt";
import { orderCopy } from "@/content/jachnun-order";

type Props = {
  receipt: Receipt;
  onOrderAgain: () => void;
};

export function OrderConfirmation({ receipt, onOrderAgain }: Props) {
  const copy = orderCopy.confirmation;
  const dueAtPickup = receipt.payment.status === "due_at_pickup";

  return (
    <div className="mx-auto max-w-2xl" data-receipt>
      <div className="text-center">
        <p className="type-index text-olive">{copy.eyebrow}</p>
        <h1 className="mt-4 type-display text-3xl md:text-5xl text-espresso">{copy.title}</h1>
      </div>

      <div className="mt-8 rounded-card border-2 border-espresso bg-cream-3 px-6 py-6 text-center shadow-md">
        <p className="type-index text-brass-ink">{copy.referenceLabel}</p>
        <p className="mt-2 type-display text-4xl md:text-5xl text-espresso tabular-nums tracking-tight">
          {receipt.reference}
        </p>
        <p className="mt-3 text-sm text-espresso-soft">{copy.referenceHint}</p>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <section className="rounded-card border border-stroke bg-cream-3 px-5 py-5">
          <h2 className="type-index text-brass-ink">{copy.pickupHeading}</h2>
          <p className="mt-2 type-title text-base text-espresso tabular-nums">
            {receipt.pickup.label}
          </p>
          <p className="mt-1 text-sm text-espresso-soft">{receipt.pickup.address}</p>
        </section>

        <section className="rounded-card border border-stroke bg-cream-3 px-5 py-5">
          <h2 className="type-index text-brass-ink">{copy.paidHeading}</h2>
          <p className="mt-2 type-title text-base text-espresso tabular-nums">
            {formatILS(receipt.totalAgorot)}
          </p>
          <p className="mt-1 text-sm text-espresso-soft">
            {copy.paidWith} {receipt.payment.methodLabel}
            {receipt.payment.last4 ? ` · •••• ${receipt.payment.last4}` : ""}
          </p>
          {dueAtPickup ? (
            <p className="mt-2 text-sm text-olive">{orderCopy.cashGuarantee.confirmedNote}</p>
          ) : null}
        </section>
      </div>

      <section className="mt-6 rounded-card border border-stroke bg-cream-3 px-5 py-5">
        <h2 className="type-index text-brass-ink">{copy.orderHeading}</h2>
        <ul className="mt-3 space-y-2">
          {receipt.lines.map((line) => (
            <li
              key={line.key}
              className={
                "flex items-baseline justify-between gap-4 text-sm " +
                (line.included ? "text-espresso-soft" : "text-espresso")
              }
            >
              <span className="flex items-baseline gap-2">
                <span className="tabular-nums text-espresso-soft">{line.qty}×</span>
                <span>{line.label}</span>
                {line.note ? (
                  <span className="type-index text-[0.625rem] text-brass-ink">{line.note}</span>
                ) : null}
              </span>
              <span className="tabular-nums shrink-0">
                {line.included ? "—" : formatILS(line.totalAgorot)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-4 border-t border-stroke flex items-baseline justify-between gap-4">
          <span className="type-title text-base text-espresso">{orderCopy.summary.total}</span>
          <span className="type-display text-2xl text-espresso tabular-nums">
            {formatILS(receipt.totalAgorot)}
          </span>
        </div>

        {receipt.customer.notes ? (
          <p className="mt-4 pt-4 border-t border-stroke text-sm text-espresso-soft">
            <span className="text-espresso">{orderCopy.steps.details.notes.label}: </span>
            {receipt.customer.notes}
          </p>
        ) : null}
      </section>

      <p className="mt-6 text-center text-sm text-espresso-soft">{copy.smsNote}</p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 print:hidden">
        <Button variant="primary" size="lg" className="w-full sm:w-auto" onClick={onOrderAgain}>
          {copy.again}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => window.print()}
          ariaLabel={copy.printAria}
        >
          {copy.print}
        </Button>
        <Button as="a" href="/jachnun" variant="ghost" size="lg" className="w-full sm:w-auto">
          {copy.home}
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-espresso-soft print:hidden">
        {copy.questions}{" "}
        <a
          href={`tel:${receipt.business.phoneTel}`}
          className="text-olive underline underline-offset-4 hover:text-espresso transition-colors"
        >
          {receipt.business.phoneDisplay}
        </a>
        {" · "}
        <Link href="/contact" className="text-olive hover:text-espresso transition-colors">
          צור קשר
        </Link>
      </p>
    </div>
  );
}
