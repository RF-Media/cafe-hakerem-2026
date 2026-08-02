"use client";

/**
 * Count-up on scroll into view.
 *
 * The FINAL value is what renders in the SSR HTML and what stays in the
 * accessibility tree — the animation only ever replaces it visually, after
 * hydration, in a sibling marked `aria-hidden`. A crawler, a screen reader,
 * or a browser with JS off all see the real number, never a `0` and never
 * a half-counted intermediate.
 */
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export function Counter({
  value,
  className,
  suffix = "",
  duration = 1.2,
}: {
  value: number;
  className?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || reduced) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      // easeOutExpo — fast off the mark, long settle
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(Math.round(eased * value));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value, duration]);

  const animating = display !== null && display !== value;

  return (
    <span ref={ref} className={className}>
      <span className={animating ? "sr-only" : undefined}>
        {value}
        {suffix}
      </span>
      {animating ? (
        <span aria-hidden>
          {display}
          {suffix}
        </span>
      ) : null}
    </span>
  );
}
