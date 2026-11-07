/**
 * Reading-progress hairline. A CSS scroll-driven animation on the root
 * scroller, so it costs nothing on the main thread; where unsupported it is
 * simply absent (globals.css). `aria-hidden`: it only exists as motion.
 */
export function ScrollProgress({ className }: { className?: string }) {
  return <div aria-hidden data-scroll-progress="" className={`h-[2px] w-full bg-brass ${className ?? ""}`} />;
}
