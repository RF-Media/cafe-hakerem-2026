"use client";

/**
 * The running order summary.
 *
 * Visible from step 1 and never recalculated at the end: the total the
 * customer sees on the quantity screen is the total on the pay button. The
 * included add-ons get their own zero-cost lines rather than being left
 * implicit — "4 × רסק עגבניות, כלול" is the line that stops someone paying
 * for extras they already have.
 *
 * One component, two placements: a sticky panel beside the steps on desktop,
 * and the expanded body of the sticky bar on a phone.
 */

import { formatILS } from "@/lib/money";
import type { PricedOrder } from "@/lib/jachnun-pricing";
import { orderCopy } from "@/content/jachnun-order";

/** Hebrew takes the singular after 1: "1 פריט", "3 פריטים". */
export function itemsLabel(count: number): string {
  return `${count} ${count === 1 ? orderCopy.summary.itemsOne : orderCopy.summary.items}`;
}

type OrderSummaryProps = {
  priced: PricedOrder;
  pickupLabel: string | null;
  itemCount: number;
  /** Cash orders are collected at the counter — the total is due, not paid. */
  payLater?: boolean;
  onEditPickup?: () => void;
  /** Drops the heading and tightens spacing for the mobile sheet. */
  compact?: boolean;
};

export function OrderSummary({
  priced,
  pickupLabel,
  itemCount,
  payLater = false,
  onEditPickup,
  compact = false,
}: OrderSummaryProps) {
  return (
    <div className={compact ? "" : "space-y-5"}>
      {!compact ? (
        <h2 className="type-title text-lg text-espresso">{orderCopy.summary.heading}</h2>
      ) : null}

      <ul className={compact ? "space-y-2" : "space-y-2.5"}>
        {priced.lines.map((line) => (
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
              {line.included ? "-" : formatILS(line.totalAgorot)}
            </span>
          </li>
        ))}
      </ul>

      {priced.savingsAgorot > 0 ? (
        <p className="flex items-baseline justify-between gap-4 text-sm text-olive">
          <span>{orderCopy.summary.savings}</span>
          <span className="tabular-nums">{formatILS(priced.savingsAgorot)}</span>
        </p>
      ) : null}

      <div className="mt-4 pt-4 border-t border-stroke">
        <div className="flex items-baseline justify-between gap-4">
          <span className="type-title text-base text-espresso">
            {orderCopy.summary.total}
            <span className="ms-2 text-xs font-normal text-espresso-soft tabular-nums">
              {itemsLabel(itemCount)}
            </span>
          </span>
          <span className="type-display text-2xl text-espresso tabular-nums">
            {formatILS(priced.totalAgorot)}
          </span>
        </div>
        {payLater ? (
          <p className="mt-1 text-end text-xs text-espresso-soft">{orderCopy.summary.payLater}</p>
        ) : null}
      </div>

      <div className="mt-4 pt-4 border-t border-stroke">
        <div className="flex items-baseline justify-between gap-3">
          <span className="type-index text-brass-ink">{orderCopy.summary.pickupHeading}</span>
          {pickupLabel && onEditPickup ? (
            <button
              type="button"
              onClick={onEditPickup}
              className="text-xs text-olive underline underline-offset-4 hover:text-espresso transition-colors"
            >
              {orderCopy.summary.edit}
            </button>
          ) : null}
        </div>
        <p className={"mt-1.5 text-sm " + (pickupLabel ? "text-espresso" : "text-espresso-soft")}>
          {pickupLabel ?? orderCopy.summary.pickupMissing}
        </p>
        <p className="mt-1 text-xs text-espresso-soft">{orderCopy.confirmation.addressLine}</p>
      </div>
    </div>
  );
}
