"use client";

/**
 * Floating pill nav. Background opacity shifts on scroll (0.6 → 0.85)
 * with a shadow appearing — the only animation allowed for the nav
 * per CLAUDE.md §7.
 *
 * Mobile: hamburger opens a full-bleed sheet. Hebrew-first RTL.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { business } from "@/content/business";

const links = [
  { href: "/",         label: "בית" },
  { href: "/menu",     label: "התפריט" },
  { href: "/jachnun",  label: "ג'חנון" },
  { href: "/catering", label: "מגשי אירוח" },
  { href: "/about",    label: "עלינו" },
  { href: "/contact",  label: "צור קשר" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-container px-4 md:px-10 lg:px-16 pt-4 pointer-events-none">
        <nav
          aria-label="ניווט ראשי"
          className={
            "pointer-events-auto flex items-center justify-between gap-4 " +
            "rounded-pill border border-stroke px-4 md:px-6 py-3 " +
            "transition-[background-color,box-shadow] duration-[250ms] " +
            (scrolled
              ? "bg-cream/85 backdrop-blur shadow-float"
              : "bg-cream/60 backdrop-blur-sm")
          }
        >
          <Link href="/" className="font-display text-xl md:text-2xl text-espresso hover:text-olive transition-colors">
            {business.name.he}
          </Link>

          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm font-medium text-espresso hover:text-olive transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href={`tel:${business.phone.tel}`}
            className="hidden md:inline-flex text-sm font-medium text-olive hover:text-espresso transition-colors"
          >
            {business.phone.display}
          </a>

          <button
            type="button"
            className="md:hidden p-2 -m-2 text-espresso"
            aria-label={open ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="text-2xl leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </nav>

        {open ? (
          <div
            className="pointer-events-auto md:hidden mt-2 rounded-card bg-cream border border-stroke p-6 shadow-float"
            role="dialog"
            aria-label="תפריט ניווט"
          >
            <ul className="flex flex-col gap-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block text-lg font-display text-espresso hover:text-olive transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`tel:${business.phone.tel}`}
                  className="block text-lg font-medium text-olive"
                >
                  {business.phone.display}
                </a>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </header>
  );
}
