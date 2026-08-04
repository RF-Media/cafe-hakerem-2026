"use client";

/**
 * Mobile action bar: the running total, an expandable summary, and the one
 * primary action for the current step.
 *
 * This owns the bottom of the phone screen, which is why the checkout route
 * group drops MobileBar — two `fixed bottom-0` bars at `z-40` would stack.
 *
 * The summary expands *upward* into an absolutely-positioned panel rather
 * than growing the bar: §7 forbids animating `height`, and a bar that grows
 * under a thumb already resting on the CTA moves the tap target mid-tap.
 */

import { AnimatePresence, m } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { itemsLabel } from "@/components/order/OrderSummary";
import { formatILS } from "@/lib/money";
import { DUR, EASE_OUT_SOFT } from "@/lib/motion";
import { orderCopy } from "@/content/jachnun-order";

type StickyActionBarProps = {
  totalAgorot: number;
  itemCount: number;
  ctaLabel: string;
  onCta: () => void;
  ctaDisabled?: boolean;
  /** Summary body, rendered inside the expandable panel. */
  children: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
};

export function StickyActionBar({
  totalAgorot,
  itemCount,
  ctaLabel,
  onCta,
  ctaDisabled = false,
  children,
  expanded,
  onToggle,
}: StickyActionBarProps) {
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-stroke
                 bg-cream-3/95 backdrop-blur shadow-lg pb-[env(safe-area-inset-bottom)]"
      role="region"
      aria-label={orderCopy.summary.heading}
    >
      <AnimatePresence>
        {expanded ? (
          <m.div
            data-motion="order-summary-sheet"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: DUR.base, ease: EASE_OUT_SOFT }}
            className="absolute bottom-full inset-x-0 max-h-[55svh] overflow-y-auto
                       border-t border-stroke bg-cream-3 px-5 py-5 shadow-lg"
          >
            {children}
          </m.div>
        ) : null}
      </AnimatePresence>

      <div className="px-5 pt-3 pb-3 space-y-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex w-full items-baseline justify-between gap-3 min-h-[44px] text-start"
        >
          <span className="flex items-baseline gap-2">
            <span className="type-index text-brass-ink">{orderCopy.summary.total}</span>
            <span className="text-xs text-espresso-soft tabular-nums">
              {itemsLabel(itemCount)}
            </span>
          </span>
          <span className="flex items-baseline gap-2">
            <span className="type-display text-2xl text-espresso tabular-nums">
              {formatILS(totalAgorot)}
            </span>
            <span
              aria-hidden
              className={
                "text-espresso-soft transition-transform duration-fast ease-out-soft " +
                (expanded ? "rotate-180" : "")
              }
            >
              ⌃
            </span>
          </span>
          <span className="sr-only">
            {expanded ? orderCopy.summary.closeAria : orderCopy.summary.openAria}
          </span>
        </button>

        <Button
          variant="primary"
          size="xl"
          className="w-full"
          onClick={onCta}
          disabled={ctaDisabled}
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
