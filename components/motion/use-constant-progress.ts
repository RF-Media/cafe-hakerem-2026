"use client";

import { useMotionValue, type MotionValue } from "framer-motion";

/**
 * A MotionValue frozen at a constant. Used to feed scene render props a
 * valid progress value when the scene is unpinned (mobile, reduced motion)
 * so consumers never need a null check.
 */
export function useConstantProgress(value = 0): MotionValue<number> {
  return useMotionValue(value);
}
