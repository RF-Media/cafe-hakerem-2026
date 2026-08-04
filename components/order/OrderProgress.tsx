"use client";

/**
 * Step indicator.
 *
 * Two presentations of the same list: a labelled row on `md+`, and on a phone
 * a single line of text plus a filled rail. Cramming five labelled chips into
 * 375px produces five unreadable chips; "שלב 3 מתוך 5 · איסוף" says the same
 * thing and leaves the width for the step itself.
 *
 * Completed steps are links back. Steps ahead of `maxIndex` are disabled
 * rather than hidden, so the customer can see how much is left — knowing the
 * flow is five short screens is what stops them abandoning on screen two.
 */

import { orderCopy } from "@/content/jachnun-order";

type OrderProgressProps = {
  steps: { id: string; label: string }[];
  currentIndex: number;
  /** Furthest step reachable given what has been filled in. */
  maxIndex: number;
  onJump: (index: number) => void;
};

export function OrderProgress({ steps, currentIndex, maxIndex, onJump }: OrderProgressProps) {
  const pct = ((currentIndex + 1) / steps.length) * 100;

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-baseline justify-between gap-3">
          <span className="type-index text-brass-ink">
            {orderCopy.nav.stepOf
              .replace("{current}", String(currentIndex + 1))
              .replace("{total}", String(steps.length))}
          </span>
          <span className="text-sm font-medium text-espresso">{steps[currentIndex]?.label}</span>
        </div>
        <div
          className="mt-2 h-1 w-full rounded-pill bg-stroke overflow-hidden"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={currentIndex + 1}
          aria-label={steps[currentIndex]?.label}
        >
          <div
            className="h-full rounded-pill bg-brass-ink transition-[width] duration-base ease-out-soft"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Desktop */}
      <nav aria-label="שלבי ההזמנה" className="hidden md:block">
        <ol className="flex items-center gap-1">
          {steps.map((step, i) => {
            const isCurrent = i === currentIndex;
            const isDone = i < currentIndex;
            const reachable = i <= maxIndex;

            return (
              <li key={step.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => reachable && onJump(i)}
                  disabled={!reachable}
                  aria-current={isCurrent ? "step" : undefined}
                  className={
                    "inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-sm " +
                    "transition-[background-color,color] duration-fast ease-out-soft " +
                    "disabled:cursor-not-allowed " +
                    (isCurrent
                      ? "bg-espresso text-cream"
                      : reachable
                        ? "text-espresso hover:bg-cream-2"
                        : "text-espresso-soft/50")
                  }
                >
                  <span
                    aria-hidden
                    className={
                      "grid h-5 w-5 place-items-center rounded-full text-[0.6875rem] tabular-nums " +
                      (isCurrent
                        ? "bg-brass text-espresso-deep"
                        : isDone
                          ? "bg-brass-ink text-cream"
                          : "border border-current")
                    }
                  >
                    {isDone ? "✓" : i + 1}
                  </span>
                  {step.label}
                </button>
                {i < steps.length - 1 ? (
                  <span aria-hidden className="block h-px w-4 bg-stroke" />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
