import type { ReactNode } from "react";

/**
 * Page section wrapper. Owns the container width, the horizontal gutters
 * and the vertical rhythm — the `mx-auto max-w-container px-6 md:px-10
 * lg:px-16` string was hand-repeated on roughly forty elements before this
 * existed, which is how gutters drift out of alignment between pages.
 */

export type SectionProps = {
  children: ReactNode;
  tone?: "cream" | "cream-2" | "cream-3" | "espresso" | "jachnun";
  spacing?: "none" | "sm" | "md" | "lg";
  /** Full-bleed background with the container applied to the inner wrapper. */
  bleed?: boolean;
  className?: string;
  innerClassName?: string;
  as?: "section" | "div" | "footer" | "header";
  id?: string;
  ariaLabelledby?: string;
};

const toneClasses = {
  cream: "bg-cream text-espresso",
  "cream-2": "bg-cream-2 text-espresso",
  "cream-3": "bg-cream-3 text-espresso",
  espresso: "bg-espresso-deep text-cream",
  jachnun: "bg-jachnun text-cream",
} as const;

const spacingClasses = {
  none: "",
  sm: "py-12 md:py-16",
  md: "py-20 md:py-28",
  lg: "py-24 md:py-36",
} as const;

export const container = "mx-auto max-w-container px-6 md:px-10 lg:px-16";

export function Section({
  children,
  tone = "cream",
  spacing = "md",
  bleed = true,
  className = "",
  innerClassName = "",
  as: Tag = "section",
  id,
  ariaLabelledby,
}: SectionProps) {
  const inner = `${container} ${spacingClasses[spacing]} ${innerClassName}`;

  if (!bleed) {
    return (
      <Tag id={id} aria-labelledby={ariaLabelledby} className={`${inner} ${className}`}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledby}
      className={`${toneClasses[tone]} ${className}`}
    >
      <div className={inner}>{children}</div>
    </Tag>
  );
}
