"use client";

/**
 * Cursor-following offset for hero CTAs. Capped at 6px — enough to feel
 * responsive, small enough that the button never leaves the place the user
 * aimed at, which is what makes most magnetic buttons annoying.
 *
 * Gated behind `(pointer: fine)`: on touch there is no cursor to follow,
 * and the handlers would only cost work on every tap.
 */
import { useRef } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { MAGNET } from "@/lib/motion";
import { useHasFinePointer } from "./use-media-query";

export function Magnetic({
  children,
  className,
  strength = MAGNET.maxOffset,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useHasFinePointer();
  const reduced = useReducedMotion();
  const active = fine && !reduced;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, MAGNET.spring);
  const y = useSpring(my, MAGNET.spring);

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    mx.set(Math.max(-1, Math.min(1, dx)) * strength);
    my.set(Math.max(-1, Math.min(1, dy)) * strength);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <m.span
      ref={ref}
      className={`inline-flex ${className ?? ""}`}
      style={active ? { x, y } : undefined}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </m.span>
  );
}
