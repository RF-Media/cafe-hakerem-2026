"use client";

/**
 * Full-width sticky nav bar.
 *
 * On the home page it starts transparent over the hero photograph and settles
 * into the cream bar as you scroll; every other page starts settled. Two items,
 * Menu and Catering, open a hover/focus mega-menu preview via `<NavDropdown>`;
 * the trigger itself is always a real link, so the panel is a preview layered
 * on top of normal navigation, never a replacement for it. The club gets its
 * own amber pill, because it is the one thing here that leaves for another
 * product and earns a return visit.
 *
 * The mobile sheet is a real dialog — focus trap, Escape, scroll lock and
 * close-on-navigate. A `role="dialog"` without those is worse than no role
 * at all, because it tells assistive tech to expect behaviour that isn't
 * there. The same two items become native `<details>` disclosures inside
 * it — same zero-JS, keyboard-free accordion `<FAQBlock>` already uses.
 */
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { business } from "@/content/business";
import { menuCategories } from "@/content/menu";
import { catering } from "@/content/catering";
import { IconArrow, IconChevron, IconClose, IconInstagram, IconMenu, IconPhone, IconStamp } from "@/components/ui/icons";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NavDropdown } from "@/components/layout/NavDropdown";

type NavItem =
  | { type: "link"; href: string; label: string }
  | { type: "dropdown"; id: string; href: string; label: string };

const navItems: NavItem[] = [
  { type: "dropdown", id: "menu", href: "/menu", label: "תפריט" },
  { type: "link", href: "/jachnun", label: "ג'חנון" },
  { type: "dropdown", id: "catering", href: "/catering", label: "מגשי אירוח" },
  { type: "link", href: "/about", label: "עלינו" },
  { type: "link", href: "/contact", label: "צור קשר" },
];

// Panel content, derived once from the same /content exports the pages
// themselves render — never duplicated copy.
const menuRows = menuCategories.map((c) => ({ href: `/menu#${c.id}`, label: c.title.he, image: c.image }));
const cateringRows = catering.options.map((o) => ({
  href: `/catering#${o.id}`,
  label: o.title.he,
  serves: o.serves,
  fromPrice: o.fromPrice,
}));
function MenuPanel() {
  return (
    <Card tone="cream-3" elevation="floating" padding="md" className="w-[460px]">
      <ul className="grid grid-cols-2 gap-1">
        {menuRows.map((row) => (
          <li key={row.href}>
            <Link
              href={row.href}
              className="group flex items-center gap-3 rounded-input p-1.5 text-sm text-espresso-soft hover:text-espresso hover:bg-cream-2 transition-colors"
            >
              {row.image ? (
                <span className="zoom-frame relative block h-10 w-10 shrink-0 rounded-input bg-cream-2">
                  <Image src={row.image} alt="" fill sizes="40px" quality={60} className="object-cover" />
                </span>
              ) : null}
              {row.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-stroke">
        <Button variant="ghost" size="sm" as="a" href="/menu" icon={<IconArrow />}>
          לכל התפריט
        </Button>
      </div>
    </Card>
  );
}

function CateringPanel() {
  return (
    <Card tone="cream-3" elevation="floating" padding="md" className="w-[320px]">
      <ul className="space-y-1">
        {cateringRows.map((row) => (
          <li key={row.href}>
            <Link
              href={row.href}
              className="block rounded-sm px-2.5 py-2 hover:bg-cream-2 transition-colors"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-espresso">{row.label}</span>
                {row.fromPrice ? (
                  <span className="text-xs text-brass-ink shrink-0">{row.fromPrice}</span>
                ) : null}
              </div>
              <div className="text-xs text-olive">{row.serves}</div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-stroke">
        <Button variant="ghost" size="sm" as="a" href="/catering" icon={<IconArrow />}>
          לטופס הפנייה
        </Button>
      </div>
    </Card>
  );
}

const panels: Record<string, () => React.ReactNode> = {
  menu: MenuPanel,
  catering: CateringPanel,
};

// Mobile disclosure rows reuse the same content, minus the Card chrome.
const mobileSubRows: Record<string, { href?: string; label: string; meta?: string }[]> = {
  menu: menuRows,
  catering: cateringRows.map((row) => ({ href: row.href, label: row.label, meta: row.serves })),
};

const mobileCta: Record<string, { href: string; label: string }> = {
  menu: { href: "/menu", label: "לכל התפריט" },
  catering: { href: "/catering", label: "לטופס הפנייה" },
};

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // A stale close timer from a dropdown the pointer already left shouldn't
  // be able to close whichever dropdown opened after it (see NavDropdown's
  // hover-intent timers) — only clear if it's still the one that's open.
  const setMenuOpen = useCallback((id: string, next: boolean) => {
    setOpenMenu((prev) => (next ? id : prev === id ? null : prev));
  }, []);

  // Close on navigation — otherwise the sheet stays open over the new page.
  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
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

  // Only the home hero runs under the bar. Opening a panel or the mobile sheet
  // also settles it, so its dark type has a light ground to sit on.
  const overHero = pathname === "/" && !scrolled && !open && openMenu === null;

  return (
    <header className="sticky top-0 z-50 h-[var(--nav-h)]">
      <nav
        aria-label="ניווט ראשי"
        className={
          "relative w-full h-full border-b transition-[background-color,box-shadow,border-color] " +
          "duration-[250ms] ease-out-soft " +
          (overHero
            ? "bg-transparent border-transparent shadow-none"
            : scrolled
              ? "bg-cream border-stroke/70 shadow-sm"
              : "bg-cream border-stroke/40 shadow-none")
        }
      >
        <div
          className="relative h-full mx-auto max-w-container px-4 md:px-10 lg:px-16 flex items-center justify-between gap-4"
        >
          {/* Both lockups are always present and cross-fade: cream while the
              bar is over the hero photograph, espresso once it has a light
              ground. The cream one is decorative, so only one alt is read. */}
          <Link
            href="/"
            aria-label={`${business.name.he} - דף הבית`}
            className="relative shrink-0 flex items-center transition-opacity duration-fast hover:opacity-80"
          >
            <Image
              src="/images/logo_dark.png"
              alt=""
              width={1200}
              height={532}
              loading="eager"
              sizes="150px"
              className={"h-9 md:h-10 w-auto transition-opacity duration-base " + (overHero ? "opacity-0" : "opacity-100")}
            />
            <Image
              src="/images/logo_cream.png"
              alt=""
              width={1251}
              height={574}
              loading="eager"
              sizes="150px"
              className={"absolute inset-0 h-9 md:h-10 w-auto transition-opacity duration-base " + (overHero ? "opacity-100" : "opacity-0")}
            />
          </Link>

          <ul className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              if (item.type === "dropdown") {
                const Panel = panels[item.id];
                return (
                  <NavDropdown
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    href={item.href}
                    active={isActive(item.href)}
                    open={openMenu === item.id}
                    onOpenChange={(v) => setMenuOpen(item.id, v)}
                    overHero={overHero}
                  >
                    <Panel />
                  </NavDropdown>
                );
              }

              const active = isActive(item.href);
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      "group/nav relative block px-3 py-1.5 text-sm font-medium transition-colors " +
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
                        "group-hover/nav:scale-x-100 " +
                        (overHero ? "bg-brass " : "bg-brass-ink ") +
                        (active ? "scale-x-100" : "scale-x-0")
                      }
                    />
                    <span className="relative">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <a
              href={`tel:${business.phone.tel}`}
              aria-label={`התקשרו אל ${business.name.he}: ${business.phone.display}`}
              className={
                "hidden xl:inline-flex items-center gap-2 text-sm font-medium tabular-nums transition-colors rounded-sm " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-cream " +
                (overHero ? "text-cream hover:text-brass" : "text-olive hover:text-espresso")
              }
            >
              <IconPhone className="w-4 h-4" />
              {business.phone.display}
            </a>
            <a
              href={business.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="אינסטגרם"
              className={
                "inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-cream " +
                (overHero ? "text-cream hover:bg-cream/15" : "text-olive hover:text-espresso hover:bg-cream-2")
              }
            >
              <IconInstagram className="w-4 h-4" />
            </a>
            <Link
              href="/coffee-club"
              aria-current={isActive("/coffee-club") ? "page" : undefined}
              className="group/club inline-flex min-h-[40px] items-center gap-2 rounded-pill bg-amber px-4 text-sm font-medium text-cs-ink
                         transition-[transform,background-color] duration-fast ease-out-soft hover:-translate-y-px hover:bg-amber-soft active:translate-y-0
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              <IconStamp className="w-4 h-4 transition-transform duration-base ease-out-soft group-hover/club:-rotate-12" />
              המועדון
            </Link>
          </div>

          <button
            ref={triggerRef}
            type="button"
            className={
              "md:hidden grid place-items-center w-11 h-11 -me-2 rounded-full transition-colors " +
              (overHero ? "text-cream hover:bg-cream/15" : "text-espresso hover:bg-cream-2")
            }
            aria-label={open ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
          </button>

        </div>

        <div className="pointer-events-none absolute inset-x-0 -bottom-px overflow-hidden">
          <ScrollProgress className={scrolled ? "opacity-100" : "opacity-0"} />
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-nav"
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="תפריט ניווט"
          className="md:hidden fixed inset-0 top-0 z-40 bg-cream flex flex-col"
        >
          <div className="h-[var(--nav-h)] shrink-0" />
          <nav aria-label="ניווט נייד" className="flex-1 overflow-y-auto px-6 pb-10">
            <ul className="flex flex-col">
              {navItems.map((item, i) => {
                const num = String(i + 1).padStart(2, "0");

                if (item.type === "dropdown") {
                  const rows = mobileSubRows[item.id];
                  const cta = mobileCta[item.id];
                  return (
                    <li key={item.id} className="border-b border-stroke/60">
                      <details className="group">
                        <summary
                          className={
                            "hero-fade flex items-center gap-4 py-4 type-title text-3xl cursor-pointer list-none " +
                            "[&::-webkit-details-marker]:hidden " +
                            (isActive(item.href) ? "text-olive" : "text-espresso")
                          }
                          style={{ ["--d" as never]: 40 + i * 45 }}
                        >
                          <span className="type-index text-brass-ink">{num}</span>
                          <span className="flex-1">{item.label}</span>
                          <IconChevron className="w-5 h-5 shrink-0 transition-transform duration-base ease-out-soft group-open:rotate-180" />
                        </summary>

                        <div className="pb-5 ps-[52px]">
                          <ul className="space-y-3">
                            {rows.map((row, ri) =>
                              row.href ? (
                                <li key={row.href}>
                                  <Link
                                    href={row.href}
                                    onClick={close}
                                    className="block type-sub text-lg text-espresso-soft"
                                  >
                                    {row.label}
                                    {row.meta ? (
                                      <span className="ms-2 text-sm text-olive">{row.meta}</span>
                                    ) : null}
                                  </Link>
                                </li>
                              ) : (
                                <li key={ri} className="text-base text-espresso-soft">
                                  {row.label}
                                </li>
                              ),
                            )}
                          </ul>
                          {/* Button's `as="a"` branch renders a plain `<Link>` with
                              no `onClick` wiring — navigation itself already
                              triggers the `pathname` effect above that closes
                              the sheet, so no handler is needed here. */}
                          <div className="mt-5">
                            <Button variant="secondary" size="sm" as="a" href={cta.href}>
                              {cta.label}
                            </Button>
                          </div>
                        </div>
                      </details>
                    </li>
                  );
                }

                return (
                  <li key={item.href} className="border-b border-stroke/60">
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={
                        "hero-fade flex items-baseline gap-4 py-4 type-title text-3xl " +
                        (isActive(item.href) ? "text-olive" : "text-espresso")
                      }
                      style={{ ["--d" as never]: 40 + i * 45 }}
                    >
                      <span className="type-index text-brass-ink">{num}</span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/coffee-club"
              onClick={close}
              className="hero-fade mt-8 flex items-center justify-between gap-3 rounded-card bg-amber px-5 py-4 text-cs-ink"
              style={{ ["--d" as never]: 300 }}
            >
              <span className="flex items-center gap-3 type-sub text-lg">
                <IconStamp className="w-5 h-5" />
                מועדון הלקוחות
              </span>
              <IconArrow className="w-5 h-5" />
            </Link>

            <a
              href={`tel:${business.phone.tel}`}
              onClick={close}
              className="hero-fade mt-6 inline-flex items-center gap-3 text-lg font-medium text-olive"
              style={{ ["--d" as never]: 340 }}
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
