"use client";

/**
 * Sticky category rail for /menu: highlights the section being read and keeps
 * its chip in view.
 *
 * The rule of this file: nothing here may move the window. The chips are plain
 * `<a href="#id">` anchors, so the browser owns the jump, and they still work
 * with JS off. The rail only ever scrolls itself, with `scrollBy` on its own
 * list. `scrollIntoView` on a chip also acts on every scrollable ancestor,
 * which cancelled the page's smooth scroll mid-flight (2026-11-07 Decision Log).
 */
import { useEffect, useRef, useState } from "react";
import { container } from "@/components/ui/Section";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ev } from "@/lib/analytics";

export type RailItem = { id: string; label: string };

/** This long without a scroll event means a jump has landed. */
const SETTLE_MS = 180;

export function MenuCategoryRail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const railRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const placed = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const rail = railRef.current;
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!rail || sections.length === 0) return;

    let frame = 0;
    let settle: ReturnType<typeof setTimeout> | undefined;
    // While a jump is in flight the clicked chip holds, rather than the
    // highlight running through every category the page passes on the way.
    let jumping = false;

    // Read from where the sections are now, never from what changed since last
    // time, so it can't go stale when the direction reverses. The line is where
    // the rail's bottom edge sits once stuck, so nothing is current up in the
    // hero, where the rail hasn't reached it yet.
    const read = () => {
      frame = 0;
      if (jumping) return;
      const line = parseFloat(getComputedStyle(rail).top) + rail.offsetHeight;
      let current: string | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top > line + 1) break;
        current = section.id;
      }
      setActive(current);
    };

    const land = () => {
      jumping = false;
      read();
    };

    const onScroll = () => {
      if (jumping) {
        clearTimeout(settle);
        settle = setTimeout(land, SETTLE_MS);
      } else if (!frame) {
        frame = requestAnimationFrame(read);
      }
    };

    // On the document, so the nav's own /menu#… links get the same treatment.
    const onClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>("a[href*='#']") : null;
      if (!link || link.pathname !== window.location.pathname) return;
      const id = decodeURIComponent(link.hash.slice(1));
      if (!sections.some((s) => s.id === id)) return;
      jumping = true;
      setActive(id);
      clearTimeout(settle);
      settle = setTimeout(land, SETTLE_MS);
    };

    // Grabbing the page mid-jump hands the highlight straight back.
    const onGrab = () => {
      if (jumping) land();
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onGrab, { passive: true });
    window.addEventListener("touchstart", onGrab, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onGrab);
      window.removeEventListener("touchstart", onGrab);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
  }, [items]);

  // Centre the chip. On a phone the rail overflows well past the screen, so
  // without this the highlight is usually off it. The first placement is
  // instant: nothing should be seen sliding on arrival.
  useEffect(() => {
    const list = listRef.current;
    const chip = active ? list?.querySelector<HTMLElement>(`[data-chip="${active}"]`) : null;
    if (!list || !chip) return;
    const c = chip.getBoundingClientRect();
    const l = list.getBoundingClientRect();
    list.scrollBy({
      left: c.left + c.width / 2 - (l.left + l.width / 2),
      behavior: placed.current && !reduced ? "smooth" : "auto",
    });
    placed.current = true;
  }, [active, reduced]);

  return (
    <nav
      ref={railRef}
      aria-label="ניווט בתפריט"
      className="sticky top-[var(--nav-h)] z-30 h-[var(--menu-rail-h)] border-b border-stroke bg-cream"
    >
      <div className={`${container} flex h-full items-center`}>
        {/* Bleeds through the gutter, so a chip cut off at the screen's edge
            reads as "there's more" rather than as a clipped box.

            Chromium aligns a focused element in a sticky bar to html's
            scroll-padding edge, even when it's already in view. A chip's top is
            nav + 14px and that edge is nav + 16px, so without the -2px margin
            every Tab moves the page 2px. */}
        <ul
          ref={listRef}
          className="-mx-6 flex min-w-0 flex-1 gap-2 overflow-x-auto overscroll-x-contain whitespace-nowrap px-6 py-1 [scrollbar-width:none] md:-mx-10 md:px-10 lg:-mx-16 lg:px-16 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((c) => {
            const isActive = active === c.id;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  data-chip={c.id}
                  {...ev("menu_category_click", { menu_category: c.id, ui_location: "menu_rail" })}
                  aria-current={isActive ? "true" : undefined}
                  className={
                    "inline-flex items-center min-h-[40px] scroll-mt-[-2px] rounded-pill border px-4 text-sm " +
                    "transition-[background-color,border-color,color] duration-fast ease-out-soft " +
                    (isActive
                      ? "bg-espresso text-cream border-espresso"
                      : "bg-transparent text-espresso-soft border-stroke hover:border-brass-ink/45 hover:text-espresso")
                  }
                >
                  {c.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
