"use client";

/**
 * Count-up on scroll into view.
 *
 * The FINAL value is what renders in the SSR HTML and what stays in the
 * accessibility tree. The animation only ever replaces it visually, after
 * hydration, in a sibling marked `aria-hidden`. A crawler, a screen reader, or
 * a browser with JS off all see the real number, never a `0`.
 */
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

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
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / (duration * 1000));
          // easeOutExpo: fast off the mark, long settle
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setDisplay(Math.round(eased * value));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduced, value, duration]);

  const animating = !reduced && display !== null && display !== value;

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
