"use client";

/**
 * Step 2 — add-ons.
 *
 * What is already included is stated first and separately, in full, before
 * anything is offered for sale. Selling someone a second tomato portion
 * without telling them four are already in the bag is how a café loses a
 * regular; showing the included ones is also the cheapest way to make the
 * price feel fair.
 */

import { QuantityStepper } from "@/components/order/QuantityStepper";
import { formatILS } from "@/lib/money";
import { ADDON_KEYS, maxExtrasFor, type AddonKey, type Extras } from "@/lib/jachnun-pricing";
import { jachnunPricing } from "@/content/jachnun";
import { orderCopy } from "@/content/jachnun-order";

type Props = {
  units: number;
  extras: Extras;
  onChange: (key: AddonKey, value: number) => void;
};

export function OrderStepAddons({ units, extras, onChange }: Props) {
  const copy = orderCopy.steps.addons;
  const cap = maxExtrasFor(units);

  return (
    <div className="space-y-8">
      <section
        aria-label={copy.includedHeading}
        className="rounded-card border border-olive/25 bg-olive/[0.05] px-5 py-5 md:px-6 md:py-6"
      >
        <h3 className="type-index text-olive">{copy.includedHeading}</h3>
        <ul className="mt-3 space-y-2">
          {/* Only addons that actually ship for free by default — an addon
              added purely as a paid extra (includedPerUnit: 0) belongs only
              in the "extras" section below, never here at "0× …, כלול". */}
          {ADDON_KEYS.filter((key) => jachnunPricing.addons[key].includedPerUnit > 0).map((key) => {
            const addon = jachnunPricing.addons[key];
            const qty = units * addon.includedPerUnit;
            return (
              <li key={key} className="flex items-baseline justify-between gap-4 text-espresso">
                <span className="flex items-baseline gap-2">
                  <span className="tabular-nums text-espresso-soft">{qty}×</span>
                  <span>{addon.label}</span>
                </span>
                <span className="type-index text-[0.625rem] text-olive">{copy.includedNote}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-label={copy.extrasHeading} className="space-y-4">
        <h3 className="type-title text-lg text-espresso">{copy.extrasHeading}</h3>

        {ADDON_KEYS.map((key) => {
          const addon = jachnunPricing.addons[key];
          const value = extras[key] ?? 0;
          const lineTotal = value * addon.extraAgorot;

          return (
            <div
              key={key}
              className={
                "rounded-card border bg-cream-3 px-5 py-5 md:px-6 shadow-sm " +
                "transition-[border-color] duration-base ease-out-soft " +
                (value > 0 ? "border-brass-ink/45" : "border-stroke")
              }
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div className="min-w-0">
                  <div className="type-title text-base md:text-lg text-espresso">
                    {copy.extraPrefix} · {addon.label}
                  </div>
                  <p className="mt-1 text-sm text-espresso-soft">{addon.description}</p>
                  <p className="mt-1 text-sm text-espresso tabular-nums">
                    {formatILS(addon.extraAgorot)} {copy.perItem}
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:shrink-0">
                  <QuantityStepper
                    value={value}
                    min={0}
                    max={cap}
                    onChange={(next) => onChange(key, next)}
                    label={`${copy.extraPrefix} ${addon.label}`}
                    decreaseLabel={copy.decreaseAria.replace("{label}", addon.label)}
                    increaseLabel={copy.increaseAria.replace("{label}", addon.label)}
                  />
                  <span
                    className={
                      "type-display text-xl tabular-nums w-[4.5ch] text-end " +
                      (value > 0 ? "text-espresso" : "text-espresso-soft/40")
                    }
                  >
                    {formatILS(lineTotal)}
                  </span>
                </div>
              </div>

              {value >= cap ? (
                <p className="mt-3 text-sm text-espresso-soft" role="status">
                  {copy.capReached}
                </p>
              ) : null}
            </div>
          );
        })}
      </section>
    </div>
  );
}
