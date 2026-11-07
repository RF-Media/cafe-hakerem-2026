/**
 * Scroll-linked drift, `translateY` only. Runs on the compositor through a CSS
 * scroll-driven animation (`animation-timeline: view()`), so it uses no JS and
 * never touches the main thread. Browsers without support, and reduced motion,
 * get a static layout: parallax here is decoration, never content.
 *
 * `speed` is capped at ±0.4 (§7) and halved below `md` in CSS.
 */
import { PARALLAX_RANGE } from "@/lib/motion";

export function Parallax({
  children,
  speed = 0.15,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const capped = Math.max(-0.4, Math.min(0.4, speed));
  return (
    <div
      data-parallax=""
      className={className}
      style={{ "--px": `${Math.round(capped * PARALLAX_RANGE)}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
