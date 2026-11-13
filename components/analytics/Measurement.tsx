"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track, trackClick } from "@/lib/analytics";

const SCROLL_MARKS = [25, 50, 75, 90];
const TIME_MARKS = [15, 30, 60, 120, 300];

/**
 * Site-wide behaviour events: clicks, FAQ opens, scroll depth and visible time.
 * Renders nothing; component-specific events (forms, the club calculator) are
 * sent where they happen. All of it waits for consent (lib/analytics.ts).
 */
export function Measurement() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => trackClick(e.target);
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Once per page view. A hash jump on /menu stays the same page view.
  useEffect(() => {
    const reached = new Set<number>();
    let frame = 0;
    const measure = () => {
      frame = 0;
      const height = document.documentElement.scrollHeight;
      if (height <= 0) return;
      const seen = ((window.scrollY + window.innerHeight) / height) * 100;
      for (const mark of SCROLL_MARKS) {
        if (seen >= mark && !reached.has(mark)) {
          reached.add(mark);
          track("scroll_depth", { percent_scrolled: mark });
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Counts only while the tab is visible, so a page left open in the background doesn't inflate it.
    let seconds = 0;
    let next = 0;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      seconds += 1;
      if (seconds === TIME_MARKS[next]) {
        track("time_on_page", { engaged_seconds: seconds });
        next += 1;
        if (next === TIME_MARKS.length) window.clearInterval(timer);
      }
    }, 1000);

    if (document.querySelector("[data-not-found]")) track("page_not_found");

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      window.clearInterval(timer);
    };
  }, [pathname]);

  return null;
}
