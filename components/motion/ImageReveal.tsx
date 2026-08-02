"use client";

/**
 * Clip-path wipe with an inner counter-scale. The mask opens from the RTL
 * start edge (visual right) while the image settles from 1.12 → 1, so the
 * picture appears to be uncovered rather than to slide in.
 *
 * `clip-path` and `transform` are both compositor properties — no layout
 * is recalculated during the reveal.
 */
import { m } from "framer-motion";
import { EASE_OUT_SOFT, VIEWPORT } from "@/lib/motion";

export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      data-motion="image-reveal"
      className={`overflow-hidden ${className ?? ""}`}
      initial={{ clipPath: "inset(0 0 0 100%)" }}
      whileInView={{ clipPath: "inset(0 0 0 0%)" }}
      viewport={VIEWPORT}
      transition={{ duration: 1, ease: EASE_OUT_SOFT, delay }}
    >
      <m.div
        data-motion="image-reveal-inner"
        className="h-full w-full will-change-transform"
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.2, ease: EASE_OUT_SOFT, delay }}
      >
        {children}
      </m.div>
    </m.div>
  );
}
