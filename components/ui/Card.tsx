import type { ReactNode } from "react";

export type CardProps = {
  padding?: "sm" | "md" | "lg";
  /** Adds a lift + shadow step on hover. Implies `elevation="raised"`. */
  hoverable?: boolean;
  elevation?: "flat" | "raised" | "floating";
  tone?: "cream" | "cream-3" | "espresso" | "jachnun";
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
};

const paddingClasses = { sm: "p-4", md: "p-6", lg: "p-6 md:p-8" } as const;

const elevationClasses = {
  flat: "",
  raised: "shadow-sm",
  floating: "shadow-md",
} as const;

const toneClasses = {
  cream: "bg-cream-2 border-stroke text-espresso",
  "cream-3": "bg-cream-3 border-stroke text-espresso",
  espresso: "bg-espresso-deep border-cream/10 text-cream",
  jachnun: "bg-jachnun border-cream/15 text-cream",
} as const;

export function Card({
  padding = "md",
  hoverable = false,
  elevation = "flat",
  tone = "cream",
  children,
  className = "",
  as: Tag = "div",
}: CardProps) {
  const classes =
    `border rounded-card ${toneClasses[tone]} ${paddingClasses[padding]} ` +
    `${elevationClasses[hoverable && elevation === "flat" ? "raised" : elevation]} ` +
    (hoverable
      ? "transition-[box-shadow,transform,border-color] duration-base ease-out-soft " +
        "hover:shadow-lg hover:-translate-y-1 "
      : "") +
    className;

  return <Tag className={classes}>{children}</Tag>;
}
