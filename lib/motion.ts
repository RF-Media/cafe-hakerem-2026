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

/** Shared `whileInView` viewport config — fires slightly early, and
 *  reverses through the same trigger margin when the item scrolls back out
 *  of view (scrolling up un-reveals in the same way it revealed).
 *
 *  Margin capped at -20px: anything past roughly -40px reliably fails to
 *  fire below the `md` breakpoint (confirmed at 375–767px — the reveal
 *  never triggers even scrolled dead-center through the viewport, while
 *  the identical setup fires normally at 768px+). Below that threshold it
 *  is reliable at every width tested, 375–1440px. */
export const VIEWPORT = { once: false, margin: "-20px" } as const;

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

/** Split-flap board entrance — rotates down from a top hinge, like a
 *  departure-board row dropping into place. Replays in reverse (flaps back
 *  up) on scroll-out via the shared `VIEWPORT`; pair with `origin-top` on
 *  the element (transform-origin isn't animatable). */
export const flapItem = {
  hidden: { opacity: 0, rotateX: -90, transformPerspective: 600 },
  visible: {
    opacity: 1,
    rotateX: 0,
    transformPerspective: 600,
    transition: { duration: DUR.slow, ease: EASE_OUT_SOFT },
  },
};

/** Nav dropdown panel — open/close, not an entrance. Both states carry a
 *  transition (unlike the one-directional reveal variants above) because
 *  `AnimatePresence` plays the `hidden` transition on exit, and this one
 *  genuinely animates in both directions. `DUR.fast` + a small 6px lift:
 *  this is a UI-chrome toggle, not a cinematic reveal — it must feel
 *  instant, closer to a hover response than a scroll entrance. */
export const dropdownPanel = {
  hidden: { opacity: 0, y: -6, transition: { duration: DUR.fast, ease: EASE_OUT_SOFT } },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.fast, ease: EASE_OUT_SOFT } },
};

/** Filterable grid tile — click-triggered (category chips), not a scroll
 *  reveal, so it doesn't read `VIEWPORT`; `AnimatePresence` drives enter/exit
 *  directly off `hidden`/`visible`/`exit`. Exit is quicker than entrance —
 *  clearing space for the new filter should feel snappier than the reveal. */
export const filterTileItem = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DUR.base, ease: EASE_OUT_SOFT },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    transition: { duration: DUR.fast, ease: EASE_OUT_SOFT },
  },
};

/** Magnetic hover — spring config and the hard cap on travel. */
export const MAGNET = {
  maxOffset: 6,
  spring: { stiffness: 200, damping: 18, mass: 0.4 },
} as const;

/** Parallax translate range, in px, before the `speed` multiplier. */
export const PARALLAX_RANGE = 100;
