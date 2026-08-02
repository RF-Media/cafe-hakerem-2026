"use client";

/**
 * Per-word mask reveal driven by scroll position — the below-the-fold
 * counterpart to `<SplitText>`. Use on section headings (`h2`/`h3`), never
 * on body copy, FAQ answers or the factual paragraph: those are the exact
 * strings AI engines extract, and they should stay plain text nodes in one
 * container.
 *
 * Same accessibility contract as `SplitText` — real text nodes, no
 * duplication, no `aria-hidden`. Split on whitespace only.
 */
import { m } from "framer-motion";
import { EASE_OUT_SOFT, VIEWPORT } from "@/lib/motion";

export function SplitReveal({
  text,
  className,
  stagger = 0.055,
}: {
  text: string;
  className?: string;
  stagger?: number;
}) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <m.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden align-bottom">
            <m.span
              data-motion="split-word"
              className="inline-block"
              variants={{
                hidden: { y: "1.1em", opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.75, ease: EASE_OUT_SOFT },
                },
              }}
            >
              {word}
            </m.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </m.span>
  );
}
