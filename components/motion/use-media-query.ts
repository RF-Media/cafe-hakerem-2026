"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query hook. Returns `fallback` during SSR and on the first
 * client render, then the real value after mount — so the server and client
 * markup always agree and nothing flashes.
 */
export function useMediaQuery(query: string, fallback = false): boolean {
  const [matches, setMatches] = useState(fallback);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Tailwind's `md` breakpoint. Gates every pinned / parallax treatment. */
export const useIsDesktop = () => useMediaQuery("(min-width: 768px)");

/** True only for real pointers — mouse and trackpad, never touch. */
export const useHasFinePointer = () => useMediaQuery("(pointer: fine)");
