import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";

export type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  as?: "h2" | "h3";
  /** Set on dark bands so the eyebrow and rule stay legible. */
  tone?: "light" | "dark";
  id?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  as: Tag = "h2",
  tone = "light",
  id,
  className = "",
}: SectionHeadingProps) {
  const dark = tone === "dark";

  return (
    <header
      className={
        "flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14 " +
        className
      }
    >
      <div className="max-w-2xl">
        <Reveal direction="up" distance={12}>
          <Eyebrow tone={dark ? "cream" : "olive"} withRule>
            {eyebrow}
          </Eyebrow>
        </Reveal>

        <Tag
          id={id}
          className={
            "mt-4 type-display text-3xl md:text-[2.75rem] " +
            (dark ? "text-cream" : "text-espresso")
          }
        >
          <SplitReveal text={title} />
        </Tag>

        <Reveal direction="up" distance={10} delay={0.15}>
          <span
            aria-hidden
            className={"mt-6 block h-px w-16 " + (dark ? "bg-cream/30" : "bg-brass/55")}
          />
        </Reveal>

        {description ? (
          <Reveal direction="up" distance={14} delay={0.1}>
            <p
              className={
                "mt-5 type-lede text-base md:text-lg max-w-prose-he " +
                (dark ? "text-cream/75" : "text-espresso-soft")
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
