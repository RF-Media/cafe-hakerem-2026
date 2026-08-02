"use client";

/**
 * Scroll-linked vertical parallax. Translate only — never `top`, never
 * `height` — so it stays on the compositor.
 *
 * Below `md` the speed is halved: full-strength parallax on a phone reads
 * as jitter, not depth.
 */
import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { PARALLAX_RANGE } from "@/lib/motion";
import { useIsDesktop } from "./use-media-query";

export function Parallax({
  children,
  speed = 0.2,
  className,
}: {
  children: React.ReactNode;
  /** Positive drifts with the scroll, negative against it. ±0.4 is plenty. */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const effective = reduced ? 0 : isDesktop ? speed : speed * 0.5;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [PARALLAX_RANGE * effective, -PARALLAX_RANGE * effective],
  );

  return (
    <div ref={ref} className={className}>
      <m.div style={{ y }} className="will-change-transform">
        {children}
      </m.div>
    </div>
  );
}
