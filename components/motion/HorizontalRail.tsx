"use client";

/**
 * Gallery rail. On desktop it pins and translates horizontally as you
 * scroll; on mobile it degrades to a native swipe carousel with CSS scroll
 * snapping — which is what a thumb actually wants, and costs no JS.
 *
 * RTL: the page reads right-to-left, so the rail must travel from the right
 * edge leftwards. `translateX` is measured in the element's own coordinate
 * space (still LTR), so the desktop travel is negative — moving content to
 * the visual left — while the row itself is laid out `flex-row` inside the
 * `dir="rtl"` document, which already starts it at the right edge.
 */
import { useEffect, useRef, useState } from "react";
import { m, useTransform, type MotionValue } from "framer-motion";
import { PinnedScene } from "./PinnedScene";
import { useIsDesktop } from "./use-media-query";

function Track({
  progress,
  children,
  className,
}: {
  progress: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

  // Travel exactly the overflow width, so the last tile lands flush at the
  // viewport's start edge rather than over- or under-shooting.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setTravel(Math.max(0, el.scrollWidth - el.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  const x = useTransform(progress, [0, 1], [0, -travel]);

  return (
    <div ref={trackRef} className="w-full overflow-hidden">
      <m.div style={{ x }} className={`flex will-change-transform ${className ?? ""}`}>
        {children}
      </m.div>
    </div>
  );
}

export function HorizontalRail({
  children,
  length = 3,
  className,
  trackClassName,
}: {
  children: React.ReactNode;
  length?: number;
  className?: string;
  trackClassName?: string;
}) {
  const isDesktop = useIsDesktop();

  if (!isDesktop) {
    return (
      <div
        className={
          "flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-6 px-6 pb-2 " +
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
          (className ?? "")
        }
      >
        {children}
      </div>
    );
  }

  return (
    <PinnedScene length={length} className={className} innerClassName="flex items-center">
      {(progress: MotionValue<number>) => (
        <Track progress={progress} className={trackClassName}>
          {children}
        </Track>
      )}
    </PinnedScene>
  );
}
