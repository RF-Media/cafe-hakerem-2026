"use client";

/**
 * Shared interaction shell for the three mega-menu-style nav items (Menu,
 * Jachnun, Catering). The trigger is always a real `<Link>` — clicking or
 * pressing Enter navigates regardless of JS; the panel is a hover/focus
 * preview layered on top, never the only way to reach the page.
 *
 * Hover-intent timers (short open delay, longer close delay) stop a fast
 * pass across the bar from flashing every panel open, and let the pointer
 * travel diagonally down into the panel without reading as "left the
 * trigger". Keyboard focus skips the delay entirely — there's no hover
 * grace period to approximate for a Tab press.
 */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { dropdownPanel } from "@/lib/motion";
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
  children: React.ReactNode;
};

export function NavDropdown({
  id,
  label,
  href,
  active,
  open,
  onOpenChange,
  children,
}: NavDropdownProps) {
  const liRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const panelId = `nav-panel-${id}`;

  const clearTimers = () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  };

  useEffect(() => clearTimers, []);

  // Only attached while this panel is open — at most one listener live at
  // a time across all three dropdowns, since only one can be open.
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
  // descendant losing focus — relatedTarget tells us where focus is going.
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
          (active ? "text-espresso" : "text-espresso-soft hover:text-espresso")
        }
      >
        {active ? (
          <m.span
            aria-hidden
            className="absolute inset-x-3 -bottom-px h-[2px] bg-brass-ink"
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : null}
        <span className="relative">{label}</span>
        <IconChevron
          className={
            "w-3.5 h-3.5 transition-transform duration-fast ease-out-soft " +
            (open ? "rotate-180" : "")
          }
        />
      </Link>

      <AnimatePresence>
        {open ? (
          <m.div
            id={panelId}
            role="region"
            aria-label={label}
            className="absolute top-full start-0 mt-2 z-10"
            variants={dropdownPanel}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {children}
          </m.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}
