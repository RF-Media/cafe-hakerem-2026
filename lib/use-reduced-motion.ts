"use client";

/**
 * Reduced-motion hook. True when the OS asks for reduced motion OR the
 * visitor turned on "עצירת אנימציות" in the accessibility widget (which
 * sets `a11y-motion` on <html>). Returns `false` during SSR (motion enabled
 * by default; the preference takes over after hydration).
 *
 * Every motion wrapper reads this rather than Framer's own hook, so the
 * widget toggle hits the same kill switch as the OS setting (CLAUDE.md §7
 * hard rule 3) — pinning, parallax and hover-triggered video included.
 */
import { useEffect, useState } from "react";

export const A11Y_MOTION_CLASS = "a11y-motion";

export function useReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const html = document.documentElement;
    const sync = () => setPrefers(mq.matches || html.classList.contains(A11Y_MOTION_CLASS));
    sync();
    mq.addEventListener("change", sync);
    const observer = new MutationObserver(sync);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => {
      mq.removeEventListener("change", sync);
      observer.disconnect();
    };
  }, []);

  return prefers;
}
