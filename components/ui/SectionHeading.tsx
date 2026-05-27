import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

export type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  as?: "h2" | "h3";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
      <div className="max-w-2xl">
        <Eyebrow withRule>{eyebrow}</Eyebrow>
        <Tag className="mt-3 text-3xl md:text-4xl font-display leading-tight text-espresso">
          {title}
        </Tag>
        {description ? (
          <p className="mt-4 text-base md:text-lg leading-relaxed text-espresso-soft">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
