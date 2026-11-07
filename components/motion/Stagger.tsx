/**
 * Container / child orchestration. `Stagger` is the observed element and sets
 * the rhythm; each `StaggerItem` gets its position from `Stagger`, so children
 * need no delay props of their own. CSS-only, like `Reveal`.
 */
import { Children, cloneElement, isValidElement } from "react";

type Tag = "div" | "ul" | "ol" | "section" | "dl";

export function Stagger({
  children,
  stagger = 0.09,
  delay = 0,
  className,
  as: Component = "div",
}: {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  as?: Tag;
}) {
  // Position is capped in CSS, so a long list never waits on its last row.
  const items = Children.toArray(children).map((child, index) =>
    isValidElement(child) ? cloneElement(child as React.ReactElement<{ index?: number }>, { index }) : child,
  );
  return (
    <Component
      data-rv-group=""
      className={className}
      suppressHydrationWarning
      style={
        {
          "--rs": `${Math.round(Math.min(stagger, 0.1) * 1000)}ms`,
          "--rd": `${Math.round(delay * 1000)}ms`,
        } as React.CSSProperties
      }
    >
      {items}
    </Component>
  );
}

type ItemTag = "div" | "li" | "article" | "span" | "dt" | "dd";

export function StaggerItem({
  children,
  className,
  as: Component = "div",
  variant = "slide",
  index = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  as?: ItemTag;
  /** `slide` fades up; `tile` also scales 0.96 → 1, for cards. */
  variant?: "slide" | "tile";
  /** Injected by `Stagger`. */
  index?: number;
  id?: string;
}) {
  return (
    <Component
      id={id}
      data-rv-item={variant}
      className={className}
      style={{ "--i": index } as React.CSSProperties}
    >
      {children}
    </Component>
  );
}
