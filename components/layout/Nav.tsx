"use client";

/**
 * Floating pill nav.
 *
 * Scroll state is scroll-linked rather than a binary toggle: the pill
 * tightens, the blur deepens and a brass hairline fades in continuously as
 * you leave the hero, so the chrome settles instead of snapping.
 *
 * The mobile sheet is a real dialog — focus trap, Escape, scroll lock and
 * close-on-navigate. A `role="dialog"` without those is worse than no role
 * at all, because it tells assistive tech to expect behaviour that isn't
 * there.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll } from "framer-motion";
import { business } from "@/content/business";
import { IconClose, IconMenu, IconPhone } from "@/components/ui/icons";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

const links = [
  { href: "/",         label: "בית" },
  { href: "/menu",     label: "התפריט" },
  { href: "/jachnun",  label: "ג'חנון" },
  { href: "/catering", label: "מגשי אירוח" },
  { href: "/about",    label: "עלינו" },
  { href: "/contact",  label: "צור קשר" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 8));

  const close = useCallback(() => setOpen(false), []);

  // Close on navigation — otherwise the sheet stays open over the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape, focus trap, and scroll lock. All three, or none — a half-modal
  // strands keyboard users behind content they can't see.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // The close button lives in the nav pill, outside the sheet element, so
    // it is prepended by hand — otherwise Tab could never reach it.
    const focusables = () => {
      const inSheet = Array.from(
        sheetRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      return triggerRef.current ? [triggerRef.current, ...inSheet] : inSheet;
    };

    focusables()[1]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-container px-4 md:px-10 lg:px-16 pt-3 md:pt-4">
        <nav
          aria-label="ניווט ראשי"
          className={
            "pointer-events-auto relative flex items-center justify-between gap-4 " +
            "rounded-pill border px-4 md:px-6 " +
            "transition-[background-color,box-shadow,border-color,padding,backdrop-filter] " +
            "duration-[250ms] ease-out-soft " +
            (scrolled
              ? "py-2.5 bg-cream/90 backdrop-blur-xl border-brass/25 shadow-md"
              : "py-3.5 bg-cream/55 backdrop-blur-sm border-stroke/70")
          }
        >
          <Link
            href="/"
            className="font-display font-black text-xl md:text-2xl tracking-tight text-espresso hover:text-olive transition-colors"
          >
            {business.name.he}
          </Link>

          <ul className="hidden md:flex items-center gap-1 lg:gap-2">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href} className="relative">
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      "relative block rounded-pill px-3 py-1.5 text-sm font-medium transition-colors " +
                      (active ? "text-espresso" : "text-espresso-soft hover:text-espresso")
                    }
                  >
                    {/* Deliberately not a `layoutId` slide: shared-layout
                        projection needs Framer's `domMax` feature bundle,
                        which is ~19kb more on every page. A fade-in is the
                        same information for a fraction of the cost. */}
                    {active ? (
                      <m.span
                        aria-hidden
                        className="absolute inset-0 rounded-pill bg-brass/15 ring-1 ring-brass/30"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      />
                    ) : null}
                    <span className="relative">{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <a
            href={`tel:${business.phone.tel}`}
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-olive hover:text-espresso transition-colors"
          >
            <IconPhone className="w-4 h-4" />
            {business.phone.display}
          </a>

          <button
            ref={triggerRef}
            type="button"
            className="md:hidden grid place-items-center w-11 h-11 -me-2 rounded-full text-espresso hover:bg-cream-2 transition-colors"
            aria-label={open ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
          </button>

          <div className="pointer-events-none absolute inset-x-6 -bottom-px overflow-hidden rounded-full">
            <ScrollProgress className={scrolled ? "opacity-100" : "opacity-0"} />
          </div>
        </nav>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="תפריט ניווט"
          className="pointer-events-auto md:hidden fixed inset-0 top-0 z-40 bg-cream flex flex-col"
        >
          <div className="h-[76px] shrink-0" />
          <nav aria-label="ניווט נייד" className="flex-1 overflow-y-auto px-6 pb-10">
            <ul className="flex flex-col">
              {links.map((l, i) => (
                <li key={l.href} className="border-b border-stroke/60">
                  <Link
                    href={l.href}
                    onClick={close}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={
                      "hero-fade flex items-baseline gap-4 py-4 type-display text-3xl " +
                      (isActive(l.href) ? "text-olive" : "text-espresso")
                    }
                    style={{ ["--d" as never]: 40 + i * 45 }}
                  >
                    <span className="font-latin text-xs tracking-[0.2em] text-brass">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <a
              href={`tel:${business.phone.tel}`}
              onClick={close}
              className="hero-fade mt-8 inline-flex items-center gap-3 text-lg font-medium text-olive"
              style={{ ["--d" as never]: 320 }}
            >
              <IconPhone />
              {business.phone.display}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
