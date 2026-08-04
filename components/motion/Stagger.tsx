"use client";

/**
 * Container / child orchestration. `Stagger` sets the rhythm, `StaggerItem`
 * inherits it — children need no delay props of their own.
 */
import { m } from "framer-motion";
import { VIEWPORT, staggerContainer, staggerItem, tileItem, flapItem } from "@/lib/motion";

type Tag = "div" | "ul" | "ol" | "section" | "dl";

export function Stagger({
  children,
  stagger = 0.09,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  as?: Tag;
}) {
  const Component = m[as];
  return (
    <Component
      data-motion="stagger"
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </Component>
  );
}

type ItemTag = "div" | "li" | "article" | "span" | "dt" | "dd";

export function StaggerItem({
  children,
  className,
  as = "div",
  variant = "slide",
}: {
  children: React.ReactNode;
  className?: string;
  as?: ItemTag;
  /** `slide` fades up; `tile` also scales 0.96 → 1, for cards; `flap`
   *  rotates down from a top hinge, for departure-board rows. */
  variant?: "slide" | "tile" | "flap";
}) {
  const Component = m[as];
  const variants = variant === "tile" ? tileItem : variant === "flap" ? flapItem : staggerItem;
  return (
    <Component data-motion="stagger-item" className={className} variants={variants}>
      {children}
    </Component>
  );
}
