"use client";

/**
 * Payment method selection.
 *
 * Express wallets sit above the fold and above a divider, because a customer
 * who can pay with a fingerprint should never have to scroll past a card form
 * to find out. Everything else is a radio list — Bit, card, and cash at
 * pickup — with the card fields revealed inline under the two options that
 * need them.
 *
 * Wallet order follows the device: an Apple Pay button first on Apple
 * hardware, Google Pay first elsewhere. Both stay visible, because the
 * detection is a heuristic and hiding someone's only wallet is worse than
 * showing one they cannot use.
 */

import { useEffect, useState } from "react";
import { orderCopy, type PaymentMethod } from "@/content/jachnun-order";

const INLINE_METHODS: PaymentMethod[] = ["bit", "card", "cash"];

type Props = {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  /** Starts an express payment immediately — the wallet sheet is the confirm. */
  onExpress: (method: PaymentMethod) => void;
  disabled?: boolean;
  /** Card fields, rendered under `card` and `cash`. */
  cardSlot?: React.ReactNode;
  /** The cash-specific "we will not charge you" explainer. */
  cashSlot?: React.ReactNode;
};

function useApplePlatform(): boolean {
  const [isApple, setIsApple] = useState(false);
  useEffect(() => {
    // After mount only — `navigator` does not exist during SSR, and reading it
    // during render would make the first paint differ from the server's.
    const ua = navigator.userAgent;
    setIsApple(/iPhone|iPad|iPod|Macintosh/.test(ua));
  }, []);
  return isApple;
}

export function PaymentMethodPicker({
  selected,
  onSelect,
  onExpress,
  disabled,
  cardSlot,
  cashSlot,
}: Props) {
  const copy = orderCopy.steps.payment;
  const isApple = useApplePlatform();
  const wallets: PaymentMethod[] = isApple
    ? ["apple_pay", "google_pay"]
    : ["google_pay", "apple_pay"];

  const walletButton =
    "flex w-full items-center justify-center gap-2 min-h-[56px] rounded-pill " +
    "bg-espresso-deep text-cream text-lg font-medium shadow-sm " +
    "transition-[transform,box-shadow,background-color] duration-fast ease-out-soft " +
    "hover:-translate-y-px hover:shadow-md hover:bg-espresso " +
    "active:translate-y-0 active:scale-[0.98] " +
    "disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed";

  return (
    <div className="space-y-6">
      <section aria-label={copy.expressHeading} className="space-y-3">
        <h3 className="type-index text-brass-ink">{copy.expressHeading}</h3>
        {wallets.map((method) => (
          <button
            key={method}
            type="button"
            className={walletButton}
            onClick={() => onExpress(method)}
            disabled={disabled}
          >
            {orderCopy.methods[method].label}
          </button>
        ))}
      </section>

      <div className="flex items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-stroke" />
        <span className="type-index text-espresso-soft">{copy.divider}</span>
        <span className="h-px flex-1 bg-stroke" />
      </div>

      <section aria-label={copy.otherHeading} className="space-y-3">
        <h3 className="type-index text-brass-ink">{copy.otherHeading}</h3>

        <fieldset className="space-y-3" disabled={disabled}>
          <legend className="sr-only">{copy.otherHeading}</legend>

          {INLINE_METHODS.map((method) => {
            const info = orderCopy.methods[method];
            const isSelected = selected === method;

            return (
              <div key={method}>
                <label
                  className={
                    "flex items-start gap-4 min-h-[64px] cursor-pointer rounded-card border-2 " +
                    "px-5 py-4 shadow-sm transition-[border-color,box-shadow] " +
                    "duration-base ease-out-soft " +
                    (isSelected
                      ? "border-espresso bg-cream-3 shadow-md"
                      : "border-stroke bg-cream-3 hover:border-brass-ink/45")
                  }
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={isSelected}
                    onChange={() => onSelect(method)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={
                      "mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 " +
                      "transition-colors duration-fast " +
                      (isSelected ? "border-espresso bg-espresso text-cream" : "border-stroke")
                    }
                  >
                    {isSelected ? <span className="text-xs leading-none">✓</span> : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block type-title text-base md:text-lg text-espresso">
                      {info.label}
                    </span>
                    <span className="mt-1 block text-sm text-espresso-soft">
                      {info.description}
                    </span>
                  </span>
                </label>

                {isSelected && method === "cash" ? (
                  <div className="mt-4">{cashSlot}</div>
                ) : null}
                {isSelected && (method === "card" || method === "cash") ? (
                  <div className="mt-4">{cardSlot}</div>
                ) : null}
              </div>
            );
          })}
        </fieldset>
      </section>
    </div>
  );
}
