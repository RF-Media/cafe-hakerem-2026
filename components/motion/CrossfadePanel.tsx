"use client";

/**
 * Fixed-footprint hover/focus/tap reveal: a `base` layer (e.g. a poster
 * image) sits under an `active` layer (e.g. a video) that crossfades in
 * with a subtle scale, capped at the site's general hover-scale ceiling
 * (§7: ≤ 1.02–1.03). The panel's own width/height never change — only
 * `transform` and `opacity` animate, so this needs no exception to the
 * compositor-properties-only rule in CLAUDE.md §7.
 *
 * Purely presentational: `isActive` is fully controlled by the caller, so
 * hover-vs-touch-vs-reduced-motion decisions live in one place (the
 * component that owns the trigger), not duplicated here.
 */
import { m } from "framer-motion";
import { DUR, EASE_OUT_SOFT } from "@/lib/motion";

const scaleVariants = {
  rest: { scale: 1 },
  active: { scale: 1.03 },
};

export function CrossfadePanel({
  base,
  active,
  isActive,
  className,
}: {
  /** Rest-state layer — always mounted. */
  base: React.ReactNode;
  /** Active-state layer — crossfades in over `base`. */
  active: React.ReactNode;
  isActive: boolean;
  className?: string;
}) {
  return (
    <m.div
      data-motion="crossfade-panel"
      className={`absolute inset-0 will-change-transform ${className ?? ""}`}
      animate={isActive ? "active" : "rest"}
      variants={scaleVariants}
      transition={{ duration: DUR.base, ease: EASE_OUT_SOFT }}
    >
      <div className="absolute inset-0">{base}</div>
      <m.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: DUR.base, ease: EASE_OUT_SOFT }}
      >
        {active}
      </m.div>
    </m.div>
  );
}
