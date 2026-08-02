"use client";

/**
 * Mounted once in the root layout.
 *
 * `LazyMotion` + `domAnimation` with the `m` namespace ships ~6kb of Framer
 * instead of the ~34kb the full `motion` bundle costs — which matters a lot
 * given how many pages now animate. `strict` makes any stray `motion.*`
 * import throw at build time rather than silently re-inflating the bundle.
 *
 * `reducedMotion="user"` is the global kill switch: with the OS preference
 * set, Framer holds every animated value at its target instead of playing
 * the transition.
 */
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
