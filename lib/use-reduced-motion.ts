"use client";

/**
 * Reduced-motion hook. Wraps the browser API and returns `false`
 * during SSR (motion enabled by default; user preference takes over
 * after hydration).
 *
 * Components use this to short-circuit Framer Motion entrance
 * animations and to disable hover scale.
 */
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefers(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return prefers;
}
