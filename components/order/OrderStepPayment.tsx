"use client";

/**
 * Step 5 — payment.
 *
 * Presentational: the attempt itself lives in `use-payment.ts` and the submit
 * lives in `OrderFlow`. This screen composes the method picker, the card
 * fields, the cash explainer, the failure message and the trust row.
 *
 * The trust row sits directly beside the pay button rather than in a footer,
 * and carries the café's phone number: the moment a payment fails is exactly
 * when someone wants a human, and burying that costs the order.
 */

import { Card } from "@/components/ui/Card";
import { CardForm, type CardErrors, type CardValues } from "@/components/order/CardForm";
import { PaymentMethodPicker } from "@/components/order/PaymentMethodPicker";
import { TEST_CARDS, type MockFailureReason } from "@/lib/mock-payment";
import { formatCardNumber } from "@/lib/card";
import { business } from "@/content/business";
import { orderCopy, type PaymentMethod } from "@/content/jachnun-order";

/** Hebrew for each way a payment can fail, with its own recovery. */
export function failureMessage(reason: MockFailureReason): string {
  const e = orderCopy.errors;
  switch (reason) {
    case "declined":
      return e.declined;
    case "insufficient_funds":
      return e.insufficientFunds;
    case "expired_card":
      return e.expiredCard;
    case "processor_error":
      return e.processorError;
    case "cancelled":
      return orderCopy.wallet.cancelled;
  }
}

type Props = {
  method: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  onExpress: (method: PaymentMethod) => void;
  card: CardValues;
  onCardChange: (values: CardValues) => void;
  cardErrors: CardErrors;
  onCardErrorsChange: (errors: CardErrors) => void;
  /** Locked while the processor is working. */
  busy: boolean;
  /** Payment or submit failure, already turned into Hebrew. */
  error?: string;
};

export function OrderStepPayment({
  method,
  onSelectMethod,
  onExpress,
  card,
  onCardChange,
  cardErrors,
  onCardErrorsChange,
  busy,
  error,
}: Props) {
  const copy = orderCopy.steps.payment;
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div className="space-y-6">
      {error ? (
        <p
          role="alert"
          className="rounded-card border border-jachnun/40 bg-jachnun/[0.07] px-5 py-4 text-sm text-jachnun"
        >
          {error}
        </p>
      ) : null}

      <PaymentMethodPicker
        selected={method}
        onSelect={onSelectMethod}
        onExpress={onExpress}
        disabled={busy}
        cashSlot={
          <Card padding="md" tone="cream-3" elevation="raised">
            <div className="flex items-start justify-between gap-3">
              <h4 className="type-title text-base text-espresso">
                {orderCopy.cashGuarantee.heading}
              </h4>
              <span className="type-index shrink-0 rounded-pill border border-olive/40 px-2 py-1 text-[0.5625rem] text-olive">
                {orderCopy.cashGuarantee.badge}
              </span>
            </div>
            <p className="mt-2 text-sm text-espresso-soft">{orderCopy.cashGuarantee.body}</p>
          </Card>
        }
        cardSlot={
          <div className="rounded-card border border-stroke bg-cream-2 px-5 py-5 md:px-6">
            <h4 className="type-index text-brass-ink mb-4">{orderCopy.card.heading}</h4>
            <CardForm
              values={card}
              onChange={onCardChange}
              errors={cardErrors}
              onErrorsChange={onCardErrorsChange}
              disabled={busy}
            />

            {isDev ? (
              <div className="mt-6 border-t border-stroke pt-4">
                <p className="type-index text-espresso-soft">{orderCopy.devPanel.heading}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {TEST_CARDS.map((tc) => (
                    <li key={tc.number}>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          onCardChange({
                            number: formatCardNumber(tc.number),
                            holder: card.holder || "TEST CARD",
                            expiry: "12/30",
                            cvc: "123",
                          })
                        }
                        className="rounded-pill border border-stroke bg-cream px-3 py-1.5 text-xs
                                   text-espresso-soft transition-colors duration-fast
                                   hover:border-brass-ink/50 hover:text-espresso
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {tc.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-espresso-soft">{orderCopy.devPanel.note}</p>
              </div>
            ) : null}
          </div>
        }
      />

      <div className="space-y-2 text-sm text-espresso-soft">
        <p className="flex items-start gap-2">
          <span aria-hidden className="text-brass-ink pt-px">
            ⚿
          </span>
          <span>{copy.trust}</span>
        </p>
        <p>{copy.terms}</p>
        <p>
          {copy.helpPrefix}{" "}
          <a
            href={`tel:${business.phone.tel}`}
            className="text-olive underline underline-offset-4 hover:text-espresso transition-colors"
          >
            {copy.helpCta} {business.phone.display}
          </a>
        </p>
      </div>
    </div>
  );
}
