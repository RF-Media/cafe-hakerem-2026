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
  variant: "primary" | "secondary" | "ghost" | "onDark";
  size?: "sm" | "md" | "lg" | "xl";
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

// Every size clears the 44px touch-target floor on mobile — `sm` used to
// land at ~36px, which is a miss on a phone.
const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "min-h-[44px] md:min-h-0 px-4 py-2.5 text-sm",
  md: "min-h-[48px] md:min-h-0 px-6 py-3 text-base",
  lg: "min-h-[52px] px-8 py-4 text-lg",
  xl: "min-h-[56px] px-9 py-4 text-lg md:text-xl",
};

const variantClasses: Record<ButtonProps["variant"], string> = {
  // The brass ring only appears on hover — a warm metallic edge catching
  // the light, which is the whole point of the accent.
  primary:
    "bg-espresso text-cream shadow-sm hover:bg-olive hover:shadow-md " +
    "hover:ring-1 hover:ring-brass/45",
  secondary:
    "bg-cream text-espresso border border-stroke hover:border-brass/60 hover:bg-cream-3",
  ghost: "text-espresso hover:bg-cream-2",
  onDark:
    "bg-cream text-espresso hover:bg-brass hover:text-espresso-deep shadow-sm hover:shadow-md",
};

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-pill font-medium " +
  "transition-[transform,background-color,border-color,color,box-shadow] " +
  "duration-fast ease-out-soft " +
  "hover:-translate-y-px active:translate-y-0 active:scale-[0.98] " +
  "disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed";

// On hover the trailing icon nudges toward the block-end edge. The document
// is RTL throughout, so block-end is the visual left — the direction Hebrew
// reads forward in.
const iconMotion =
  "inline-flex transition-transform duration-fast ease-out-soft " +
  "group-hover/btn:-translate-x-1";

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
        {icon ? <span aria-hidden className={iconMotion}>{icon}</span> : null}
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
