/**
 * Clip-path wipe with an inner counter-scale. The mask opens from the RTL
 * start edge (visual right) while the image settles from 1.12 → 1, so the
 * picture appears to be uncovered rather than to slide in.
 *
 * `clip-path` and `transform` are both compositor properties, so no layout is
 * recalculated during the reveal. CSS-only: see "Reveals" in globals.css.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      data-rv=""
      data-rv-kind="wipe"
      className={`overflow-hidden ${className ?? ""}`}
      suppressHydrationWarning
      style={{ "--rd": `${Math.round(delay * 1000)}ms` } as React.CSSProperties}
    >
      <div data-rv-inner="" className="h-full w-full">
        {children}
      </div>
    </div>
  );
}
