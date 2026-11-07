/**
 * Magnetic hover, ≤ 6px, `(pointer: fine)` only. The behaviour lives in the
 * delegated listener in lib/motion-runtime.ts; this just marks the element.
 */
export function Magnetic({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span data-magnetic="" suppressHydrationWarning className={`inline-block ${className ?? ""}`}>
      {children}
    </span>
  );
}
