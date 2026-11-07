import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";

export type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  /** Stack the action under the title at every width, instead of in the corner. */
  actionBelow?: boolean;
  as?: "h2" | "h3";
  /** Set on dark bands so the eyebrow and rule stay legible. `ink` is the amber band. */
  tone?: "light" | "dark" | "ink";
  id?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  actionBelow = false,
  as: Tag = "h2",
  tone = "light",
  id,
  className = "",
}: SectionHeadingProps) {
  const dark = tone === "dark";
  const ink = tone === "ink";

  return (
    <header
      className={
        "flex flex-col gap-6 mb-10 md:mb-14 " +
        (actionBelow ? "" : "md:flex-row md:items-end md:justify-between ") +
        className
      }
    >
      <div className="max-w-3xl">
        <Reveal direction="up" distance={12}>
          <Eyebrow tone={dark ? "brass" : ink ? "ink" : "olive"} withRule>
            {eyebrow}
          </Eyebrow>
        </Reveal>

        {/* `.type-title`, not `.type-display` — display weight (900) is
            reserved for the one <h1> a page is allowed. A section heading at
            900 competes with it and, when two sections sit close together,
            with the next heading down. */}
        <Tag
          id={id}
          className={
            "mt-4 type-statement text-4xl md:text-5xl lg:text-6xl " +
            (dark ? "text-cream" : ink ? "text-cs-ink" : "text-espresso")
          }
        >
          <SplitReveal text={title} />
        </Tag>

        {description ? (
          <Reveal direction="up" distance={14} delay={0.1}>
            <p
              className={
                "mt-5 type-lede text-base md:text-lg max-w-prose-he " +
                (dark ? "text-cream/85" : ink ? "text-cs-ink" : "text-espresso-soft")
              }
            >
              {description}
            </p>
          </Reveal>
        ) : null}
      </div>

      {action ? (
        <Reveal direction="up" distance={12} delay={0.2} className="shrink-0">
          {action}
        </Reveal>
      ) : null}
    </header>
  );
}
