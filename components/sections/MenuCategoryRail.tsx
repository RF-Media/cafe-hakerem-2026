"use client";

/**
 * Sticky category rail for /menu.
 *
 * Tracks which section is in view with an IntersectionObserver and scrolls
 * the matching chip into the rail — on a phone the rail overflows well past
 * the viewport, so without this the highlighted chip is frequently off
 * screen and the rail tells you nothing.
 *
 * The chips are plain `<a href="#id">` anchors: with JS off they still jump
 * to the right section, they just don't highlight.
 */
import { useEffect, useRef, useState } from "react";

export type RailItem = { id: string; label: string };

export function MenuCategoryRail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Top band only: a section counts as "current" once its heading is
      // under the nav, not when its tail is still on screen.
      { rootMargin: "-140px 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (!active || !listRef.current) return;
    const chip = listRef.current.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    chip?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  return (
    <ul
      ref={listRef}
      className="flex gap-2 overflow-x-auto whitespace-nowrap py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((c) => {
        const isActive = active === c.id;
        return (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              data-chip={c.id}
              aria-current={isActive ? "true" : undefined}
              className={
                "inline-flex items-center min-h-[40px] rounded-pill border px-4 text-sm " +
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
  );
}
