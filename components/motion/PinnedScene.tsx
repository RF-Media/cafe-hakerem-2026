"use client";

/**
 * A section that holds still while the page scrolls past it.
 *
 * Implemented as a tall spacer with a `position: sticky` child — the
 * browser's own mechanism. Scroll stays 1:1 with page distance: nothing is
 * intercepted, no wheel handler, no `preventDefault`. That is the whole
 * reason to do it this way; JS scroll hijacking breaks trackpads, breaks
 * find-in-page, and breaks the scrollbar's relationship to the document.
 *
 * `children` is a render prop receiving progress 0 → 1 across the pin.
 *
 * Below `md`, and under reduced motion, the pin is dropped entirely and the
 * children render as an ordinary block with progress frozen at 0.
 */
import { useRef } from "react";
import { useReducedMotion, useScroll, type MotionValue } from "framer-motion";
import { useIsDesktop } from "./use-media-query";
import { useConstantProgress } from "./use-constant-progress";

export function PinnedScene({
  children,
  /** Scroll distance the scene occupies, as a multiple of the viewport. */
  length = 3,
  className,
  innerClassName,
}: {
  /** Receives scroll progress and whether the scene actually pinned —
   *  consumers need the second to know whether to bind scroll-driven
   *  styles at all. */
  children: (progress: MotionValue<number>, pinned: boolean) => React.ReactNode;
  length?: number;
  className?: string;
  innerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const pinned = isDesktop && !reduced;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const frozen = useConstantProgress(0);

  return (
    <div
      ref={ref}
      className={className}
      style={pinned ? { height: `${length * 100}svh` } : undefined}
    >
      {pinned ? (
        <div className={`sticky top-0 h-screen-s overflow-hidden ${innerClassName ?? ""}`}>
          {children(scrollYProgress, true)}
        </div>
      ) : (
        children(frozen, false)
      )}
    </div>
  );
}
