/**
 * Continuous horizontal ticker — a server component, driven entirely by a
 * CSS keyframe.
 *
 * The item list is rendered twice and the track travels exactly 50%, so the
 * second copy lands where the first started and the loop is seamless. The
 * duplicate is `aria-hidden` so screen readers hear the list once.
 *
 * Pauses on hover, and `prefers-reduced-motion` stops it dead (the global
 * rule in globals.css sets `animation-iteration-count: 1` and a ~0ms
 * duration, which parks it at the start frame).
 */

export function Ticker({
  items,
  className,
  itemClassName,
  duration = 40,
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
  /** Seconds for one full pass. Longer = calmer. */
  duration?: number;
}) {
  const row = (hidden: boolean) => (
    <ul
      className="flex shrink-0 items-center gap-3 pe-3"
      aria-hidden={hidden || undefined}
    >
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className={itemClassName}>
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`group overflow-hidden ${className ?? ""}`}>
      <div
        className="flex w-max will-change-transform group-hover:[animation-play-state:paused]"
        style={{ animation: `ticker-rtl ${duration}s linear infinite` }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
