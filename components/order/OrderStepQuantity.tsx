"use client";

/**
 * Step 1 — how many jachnun.
 *
 * The whole screen is one decision, at kiosk scale. The bundle nudge appears
 * only when it is genuinely true and genuinely close (one to three units
 * short) and states the saving in shekels rather than "save more!" — a number
 * a customer can check is the only kind of urgency worth printing.
 */

import { QuantityStepper } from "@/components/order/QuantityStepper";
import { formatILS } from "@/lib/money";
import { bundleNudge, type PricedOrder } from "@/lib/jachnun-pricing";
import { jachnun } from "@/content/jachnun";
import { orderCopy } from "@/content/jachnun-order";

type Props = {
  units: number;
  onChange: (units: number) => void;
  priced: PricedOrder;
};

export function OrderStepQuantity({ units, onChange, priced }: Props) {
  const copy = orderCopy.steps.quantity;
  const nudge = bundleNudge(units);
  const { minQuantity, maxQuantity } = jachnun.form;

  return (
    <div className="space-y-8">
      <div className="rounded-card border border-stroke bg-cream-3 px-6 py-8 md:py-14 text-center shadow-sm">
        <QuantityStepper
          value={units}
          min={minQuantity}
          max={maxQuantity}
          onChange={onChange}
          size="lg"
          label={`${copy.shortLabel} ${copy.unitLabel}`}
          decreaseLabel={copy.decreaseAria}
          increaseLabel={copy.increaseAria}
          caption={`${formatILS(priced.unitPriceAgorot)} ${copy.perUnit}`}
        />

        <p className="mt-6 type-title text-lg text-espresso">
          {units} × {units === 1 ? copy.unitLabel : copy.unitLabelPlural}
        </p>

        {/* Reserved even when empty, so hitting/leaving a bound doesn't
            mount or unmount an element and shift the "what's included"
            list below it. */}
        <p className="mt-3 min-h-[1.5rem] text-sm text-espresso-soft">
          {units >= maxQuantity ? copy.maxReached : units <= minQuantity ? copy.minReached : ""}
        </p>
      </div>

      {/* Nudge and bundle-applied are mutually exclusive once units >= 1 —
          one reserved slot that swaps content, rather than two blocks that
          independently mount/unmount and push the page below them. */}
      <div className="min-h-[4.5rem]">
        {nudge ? (
          <p
            className="flex items-start gap-3 rounded-card border border-brass-ink/35 bg-brass-ink/[0.06]
                       px-5 py-4 text-sm text-espresso"
            role="status"
          >
            <span aria-hidden className="text-brass-ink pt-0.5">
              ◆
            </span>
            <span>
              {copy.nudge
                .replace(
                  "{units}",
                  nudge.unitsAway === 1
                    ? `${copy.unitLabel} אחד`
                    : `${nudge.unitsAway} ${copy.unitLabelPlural}`,
                )
                .replace("{savings}", formatILS(nudge.savingsAgorot))}
            </span>
          </p>
        ) : priced.bundleApplied ? (
          <p
            className="flex items-start gap-3 rounded-card border border-olive/30 bg-olive/[0.06]
                       px-5 py-4 text-sm text-olive"
            role="status"
          >
            <span aria-hidden className="pt-0.5">
              ✓
            </span>
            <span>{copy.bundleApplied.replace("{savings}", formatILS(priced.savingsAgorot))}</span>
          </p>
        ) : null}
      </div>

      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-espresso-soft">
        {jachnun.whatsIncluded.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden className="text-brass-ink pt-1 text-[0.625rem]">
              ◆
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
