"use client";

/**
 * Step 1 — which package.
 *
 * Jachnun is sold as four fixed-size packages (see content/jachnun.ts), not a
 * continuous quantity, so there is no free-quantity pricing here. Two ways to
 * land on the same selection: a +/- stepper that cycles the four packages by
 * unit count (1 → 2 → 5 → 10), and a row of price cards below it — native
 * radio inputs under styled `<label>`s, so arrow keys and screen-reader group
 * announcements ("1 of 4") come from the platform for free. Both drive the
 * one `selectedId`, so picking a card moves the stepper's number and vice
 * versa. Cards are single-row and caption-only (no long description) to keep
 * the whole step, stepper included, inside one viewport fold.
 */

import { jachnun, jachnunPackages, jachnunStartingPriceAgorot } from "@/content/jachnun";
import { formatILS } from "@/lib/money";
import type { PackageId } from "@/lib/jachnun-pricing";
import { orderCopy } from "@/content/jachnun-order";

type Props = {
  selectedId: PackageId | null;
  onSelect: (id: PackageId) => void;
};

export function OrderStepQuantity({ selectedId, onSelect }: Props) {
  const copy = orderCopy.steps.quantity;

  const currentIndex = selectedId ? jachnunPackages.findIndex((p) => p.id === selectedId) : -1;
  const displayPkg = jachnunPackages[currentIndex === -1 ? 0 : currentIndex];
  const atFirst = currentIndex === 0;
  const atLast = currentIndex === jachnunPackages.length - 1;

  function stepBy(direction: 1 | -1) {
    const nextIndex =
      currentIndex === -1 ? 0 : Math.min(jachnunPackages.length - 1, Math.max(0, currentIndex + direction));
    onSelect(jachnunPackages[nextIndex].id);
  }

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="sr-only">{copy.title}</legend>

        {/* Stepper — an alternate, always-in-sync control for the same 4
            packages. Cycles by unit count rather than free integers. */}
        <div className="flex items-center justify-between gap-3 rounded-card border border-stroke bg-cream-3 px-4 py-3.5 shadow-xs sm:px-5 sm:py-4">
          <div className="min-w-0">
            <p className="type-index text-brass-ink">{copy.stepperLabel}</p>
            <p className="type-sub text-base sm:text-lg text-espresso truncate">{displayPkg.title}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => stepBy(-1)}
              disabled={atFirst}
              aria-label={copy.decreaseAria}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-stroke bg-cream text-xl leading-none text-espresso transition-colors duration-fast hover:border-espresso disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>
            <span className="w-9 text-center type-display text-2xl text-espresso tabular-nums">
              {displayPkg.units}
            </span>
            <button
              type="button"
              onClick={() => stepBy(1)}
              disabled={atLast}
              aria-label={copy.increaseAria}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-stroke bg-cream text-xl leading-none text-espresso transition-colors duration-fast hover:border-espresso disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>

          <span className="type-display text-xl sm:text-2xl text-espresso tabular-nums shrink-0">
            {formatILS(displayPkg.totalAgorot)}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {jachnunPackages.map((pkg) => {
            const selected = pkg.id === selectedId;
            const perUnitAgorot = Math.round(pkg.totalAgorot / pkg.units);
            const savingsAgorot = Math.max(0, pkg.units * jachnunStartingPriceAgorot - pkg.totalAgorot);

            return (
              <label
                key={pkg.id}
                className={
                  "group relative flex cursor-pointer flex-col items-center gap-1 rounded-card border px-3 py-3.5 text-center " +
                  "shadow-sm transition-[border-color,box-shadow,background-color] duration-base ease-out-soft " +
                  (selected
                    ? "border-olive bg-olive/[0.06] ring-2 ring-olive/25"
                    : "border-stroke bg-cream-3 hover:border-brass-ink/45 hover:shadow-md")
                }
              >
                <input
                  type="radio"
                  name="jachnun-package"
                  value={pkg.id}
                  checked={selected}
                  onChange={() => onSelect(pkg.id)}
                  aria-label={copy.selectAria.replace("{title}", pkg.title)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-card ring-2 ring-transparent peer-focus-visible:ring-olive"
                />
                {/* Sighted users get the compact card; the full description
                    (what's included) still reaches screen readers. */}
                <span className="sr-only">{pkg.description}</span>

                {pkg.popular ? (
                  <span className="rounded-pill bg-brass-ink px-1.5 py-0.5 text-[0.5625rem] leading-none text-cream">
                    {copy.popularBadge}
                  </span>
                ) : (
                  <span aria-hidden className="h-[1.0625rem]" />
                )}
                <span className="type-sub text-sm text-espresso">{pkg.title}</span>

                <span className="type-display text-xl text-espresso tabular-nums">
                  {formatILS(pkg.totalAgorot)}
                </span>

                {pkg.units > 1 ? (
                  <span className="text-[0.6875rem] text-espresso-soft tabular-nums">
                    {formatILS(perUnitAgorot)} {copy.perUnit}
                  </span>
                ) : null}

                {savingsAgorot > 0 ? (
                  <span className="text-[0.6875rem] text-olive">
                    {copy.savingsShort.replace("{savings}", formatILS(savingsAgorot))}
                  </span>
                ) : null}
              </label>
            );
          })}
        </div>
      </fieldset>

      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-sm text-espresso-soft">
        {jachnun.whatsIncluded.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span aria-hidden className="text-brass-ink text-[0.625rem]">
              ◆
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
