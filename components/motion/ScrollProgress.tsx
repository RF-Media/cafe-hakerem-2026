"use client";

/**
 * Hairline reading-progress bar. Purely decorative — `aria-hidden`, no
 * role, no value — because a scrollbar already conveys this to assistive
 * tech and a second announcement is noise.
 *
 * Scales a fixed-width element on the X axis rather than animating `width`,
 * so it never triggers layout.
 */
import { m, useScroll, useSpring } from "framer-motion";

export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scale = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });

  return (
    <m.div
      aria-hidden
      style={{ scaleX: scale }}
      className={
        "h-px w-full origin-right bg-brass/70 will-change-transform " + (className ?? "")
      }
    />
  );
}
