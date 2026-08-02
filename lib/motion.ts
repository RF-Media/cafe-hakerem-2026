/**
 * Motion constants. Every easing, duration, distance and variant used by
 * `components/motion/*` lives here so no component carries magic numbers.
 *
 * Values mirror the CSS custom properties in `globals.css` — the CSS side
 * drives hero reveals (which must fire before hydration), this side drives
 * everything below the fold.
 */

export const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DUR = {
  fast: 0.18,
  base: 0.32,
  slow: 0.7,
} as const;

/** Shared `whileInView` viewport config — fire once, slightly early. */
export const VIEWPORT = { once: true, margin: "-80px" } as const;

export type Direction = "up" | "down" | "start" | "end" | "none";

/** Translate offset for a given direction, in px. RTL-aware: "end" is the
 *  visual left in Hebrew, which is the natural forward direction. */
export function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case "up":    return { y: distance };
    case "down":  return { y: -distance };
    case "start": return { x: -distance };
    case "end":   return { x: distance };
    default:      return {};
  }
}

export const revealVariants = (direction: Direction, distance: number) => ({
  hidden: { opacity: 0, ...offsetFor(direction, distance) },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: DUR.slow, ease: EASE_OUT_SOFT },
  },
});

export const staggerContainer = (stagger: number, delay: number) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.slow, ease: EASE_OUT_SOFT },
  },
};

/** Card / tile entrance — scales up fractionally as it fades in. */
export const tileItem = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DUR.slow, ease: EASE_OUT_SOFT },
  },
};

/** Magnetic hover — spring config and the hard cap on travel. */
export const MAGNET = {
  maxOffset: 6,
  spring: { stiffness: 200, damping: 18, mass: 0.4 },
} as const;

/** Parallax translate range, in px, before the `speed` multiplier. */
export const PARALLAX_RANGE = 100;
