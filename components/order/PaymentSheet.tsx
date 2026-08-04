"use client";

/**
 * The mock wallet / 3-D-Secure sheet.
 *
 * Stands in for the system sheet Apple Pay, Google Pay and Bit would present,
 * and for the bank's 3-DS challenge window. It exists so both branches of
 * those flows are reachable by hand: approve **and** cancel. A checkout demo
 * that can only succeed is not a demo of a checkout.
 *
 * Marked with a "הדמיה" badge so nobody mistakes it for the real thing.
 */

import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { formatILS } from "@/lib/money";
import { DUR, EASE_OUT_SOFT } from "@/lib/motion";
import { orderCopy } from "@/content/jachnun-order";

type PaymentSheetProps = {
  open: boolean;
  title: string;
  body?: string;
  amountAgorot: number;
  approveLabel: string;
  cancelLabel: string;
  busy: boolean;
  busyLabel: string;
  onApprove: () => void;
  onCancel: () => void;
};

export function PaymentSheet({
  open,
  title,
  body,
  amountAgorot,
  approveLabel,
  cancelLabel,
  busy,
  busyLabel,
  onApprove,
  onCancel,
}: PaymentSheetProps) {
  const approveRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    approveRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      // Escape is the sheet's cancel path, same as the real system sheets.
      if (e.key === "Escape" && !busy) onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          data-motion="payment-sheet"
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center
                     bg-espresso-deep/45 backdrop-blur-sm p-0 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR.fast }}
        >
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            data-motion="payment-sheet-panel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: DUR.base, ease: EASE_OUT_SOFT }}
            className="w-full md:max-w-md rounded-t-card md:rounded-card border border-stroke
                       bg-cream-3 p-6 md:p-8 shadow-lg pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="type-title text-xl text-espresso">{title}</h2>
              <span className="type-index shrink-0 rounded-pill border border-brass-ink/40 px-2 py-1 text-[0.5625rem] text-brass-ink">
                {orderCopy.wallet.mockBadge}
              </span>
            </div>

            {body ? <p className="mt-3 text-sm text-espresso-soft">{body}</p> : null}

            <p className="mt-6 type-display text-4xl text-espresso tabular-nums text-center">
              {formatILS(amountAgorot)}
            </p>

            <div className="mt-8 space-y-3">
              <Button
                ref={approveRef}
                variant="primary"
                size="xl"
                className="w-full"
                onClick={onApprove}
                disabled={busy}
              >
                {busy ? busyLabel : approveLabel}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="w-full"
                onClick={onCancel}
                disabled={busy}
              >
                {cancelLabel}
              </Button>
            </div>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
