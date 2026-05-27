import type { ReactNode } from "react";

export type CardProps = {
  padding?: "sm" | "md" | "lg";
  hoverable?: boolean;
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
};

const paddingClasses = { sm: "p-4", md: "p-6", lg: "p-8" } as const;

export function Card({
  padding = "md",
  hoverable = false,
  children,
  className = "",
  as: Tag = "div",
}: CardProps) {
  const classes =
    `bg-cream-2 border border-stroke rounded-2xl ${paddingClasses[padding]} ` +
    `${hoverable ? "transition-shadow duration-200 hover:shadow-float" : ""} ${className}`;

  return <Tag className={classes}>{children}</Tag>;
}
