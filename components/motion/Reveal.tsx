"use client";

/**
 * The workhorse entrance. Fades and translates its children into view, and
 * reverses the same way when scrolled back out (see `VIEWPORT` in
 * `lib/motion.ts`).
 *
 * Takes `children`, never copy — the content is server-rendered and simply
 * passes through, so the text in the HTML payload is identical with or
 * without this wrapper.
 */
import { m } from "framer-motion";
import { VIEWPORT, revealVariants, type Direction } from "@/lib/motion";

export type RevealProps = {
  children: React.ReactNode;
  direction?: Direction;
  distance?: number;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
};

export function Reveal({
  children,
  direction = "up",
  distance = 24,
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const Tag = m[as];
  return (
    <Tag
      data-motion="reveal"
      className={className}
      variants={revealVariants(direction, distance)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}
