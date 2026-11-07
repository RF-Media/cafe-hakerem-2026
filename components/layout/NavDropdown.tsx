"use client";

/**
 * Shared interaction shell for the mega-menu nav items. The trigger is always
 * a real `<Link>`: clicking or pressing Enter navigates regardless of JS; the
 * panel is a hover/focus preview layered on top, never the only way to reach
 * the page.
 *
 * Hover-intent timers (short open delay, longer close delay) stop a fast pass
 * across the bar from flashing every panel open, and let the pointer travel
 * diagonally down into the panel without reading as "left the trigger".
 * Keyboard focus skips the delay entirely.
 *
 * The panel mounts on first open: the menu panel holds ten thumbnails, and
 * nobody should download them for a menu they never opened. After that it stays
 * mounted and hidden with `invisible`, so it transitions in both directions
 * without a library and its links are unreachable while closed.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconChevron } from "@/components/ui/icons";

const OPEN_DELAY = 80;
const CLOSE_DELAY = 220;

export type NavDropdownProps = {
  id: string;
  label: string;
  href: string;
  active?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Cream type while the bar sits transparent over the home hero. */
  overHero?: boolean;
  children: React.ReactNode;
};

export function NavDropdown({
  id,
  label,
  href,
  active,
  open,
  onOpenChange,
  overHero,
  children,
}: NavDropdownProps) {
  const liRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const panelId = `nav-panel-${id}`;
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    if (open) setWanted(true);
  }, [open]);

  const clearTimers = () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  };

  useEffect(() => clearTimers, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!liRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onOpenChange]);

  const scheduleOpen = () => {
    clearTimers();
    if (open) return;
    openTimer.current = setTimeout(() => onOpenChange(true), OPEN_DELAY);
  };

  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => onOpenChange(false), CLOSE_DELAY);
  };

  const handleFocus = () => {
    clearTimers();
    onOpenChange(true);
  };

  // React's onBlur is delegated (focusout), so this fires for any
  // descendant losing focus; relatedTarget tells us where focus is going.
  const handleBlur = (e: React.FocusEvent<HTMLLIElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && liRef.current?.contains(next)) return;
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key !== "Escape" || !open) return;
    e.preventDefault();
    onOpenChange(false);
    triggerRef.current?.focus();
  };

  return (
    <li
      ref={liRef}
      className="relative"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <Link
        ref={triggerRef}
        href={href}
        aria-current={active ? "page" : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        className={
          "relative flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-sm " +
          (overHero
            ? "text-cream hover:text-brass"
            : active
              ? "text-espresso"
              : "text-espresso-soft hover:text-espresso")
        }
      >
        <span
          aria-hidden
          className={
            "absolute inset-x-3 -bottom-px h-[2px] origin-right transition-transform duration-base ease-out-soft " +
            (overHero ? "bg-brass " : "bg-brass-ink ") +
            (active ? "scale-x-100" : "scale-x-0")
          }
        />
        <span className="relative">{label}</span>
        <IconChevron
          className={"w-3.5 h-3.5 transition-transform duration-fast ease-out-soft " + (open ? "rotate-180" : "")}
        />
      </Link>

      <div
        id={panelId}
        role="region"
        aria-label={label}
        className={
          "absolute top-full start-0 mt-2 z-10 transition-[opacity,transform,visibility] duration-fast ease-out-soft " +
          (open ? "visible opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-1.5")
        }
      >
        {wanted ? children : null}
      </div>
    </li>
  );
}
