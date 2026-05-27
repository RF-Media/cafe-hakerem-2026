import Link from "next/link";
import { forwardRef, type ReactNode } from "react";

/**
 * Button — the single button primitive on the site.
 *
 * `iconPosition: "end"` places the icon at the block-end edge, which
 * in RTL is the visual LEFT — the natural "forward" direction in
 * Hebrew (per CLAUDE.md §6).
 */

export type ButtonProps = {
  variant: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  as?: "button" | "a";
  href?: string;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
  // Allows external links to opt out of the in-app router
  external?: boolean;
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const variantClasses: Record<ButtonProps["variant"], string> = {
  primary:   "bg-espresso text-cream hover:bg-olive",
  secondary: "bg-cream text-espresso border border-stroke hover:border-espresso",
  ghost:     "text-espresso hover:bg-cream-2",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-medium " +
  "transition-[transform,background-color,border-color,color] duration-[180ms] ease-out " +
  "hover:scale-[1.02] active:scale-100 " +
  "disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed";

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    variant,
    size = "md",
    as = "button",
    href,
    icon,
    iconPosition = "end",
    children,
    className = "",
    onClick,
    type = "button",
    disabled,
    ariaLabel,
    external,
  },
  ref,
) {
  const classes = `${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  const content =
    iconPosition === "end" ? (
      <>
        <span>{children}</span>
        {icon ? <span aria-hidden className="inline-flex">{icon}</span> : null}
      </>
    ) : (
      <>
        {icon ? <span aria-hidden className="inline-flex">{icon}</span> : null}
        <span>{children}</span>
      </>
    );

  if (as === "a") {
    if (!href) {
      throw new Error("<Button as='a'> requires an href.");
    }
    if (external || /^(https?:|tel:|mailto:|waze:)/.test(href)) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          aria-label={ariaLabel}
          {...(external && href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
});
