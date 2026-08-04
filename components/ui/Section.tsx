import type { ReactNode } from "react";

/**
 * Page section wrapper. Owns the container width, the horizontal gutters
 * and the vertical rhythm — the `mx-auto max-w-container px-6 md:px-10
 * lg:px-16` string was hand-repeated on roughly forty elements before this
 * existed, which is how gutters drift out of alignment between pages.
 */

export type SectionTone = "cream" | "cream-2" | "cream-3" | "espresso" | "jachnun";

export type SectionProps = {
  children: ReactNode;
  tone?: SectionTone;
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

/** Light grounds get a paper tooth; dark ones are already textured by the
 *  photography and grain that sit on them, and noise on espresso-deep just
 *  reads as banding. */
const papered: Record<SectionTone, boolean> = {
  cream: true,
  "cream-2": true,
  "cream-3": true,
  espresso: false,
  jachnun: false,
};

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
      className={`relative ${toneClasses[tone]} ${papered[tone] ? "paper" : ""} ${className}`}
    >
      {/* `relative z-10` so the paper ::before, which sits at z-index 0,
          stays behind the content rather than multiplying over the text. */}
      <div className={`relative z-10 ${inner}`}>{children}</div>
    </Tag>
  );
}
