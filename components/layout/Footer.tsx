import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { cookieSettingsLabel } from "@/content/cookies";
import { CookieSettingsButton } from "@/components/cookiestream/CookieSettingsButton";
import { IconPhone, IconPin, IconStamp } from "@/components/ui/icons";
import { container } from "@/components/ui/Section";

/**
 * The dark closing chord. Every link a visitor might still want, the address
 * and phone for the ones who scrolled here looking for them, and one last door
 * into the club.
 */

const linkGroups: { title: string; items: { href: string; label: string }[] }[] = [
  {
    title: "האתר",
    items: [
      { href: "/menu", label: "התפריט" },
      { href: "/offers", label: "מבצעים" },
      { href: "/jachnun", label: "ג'חנון של שבת" },
      { href: "/catering", label: "מגשי אירוח" },
      { href: "/coffee-club", label: "מועדון הלקוחות" },
      { href: "/about", label: "הסיפור שלנו" },
      { href: "/contact", label: "צור קשר" },
    ],
  },
];

const linkClass = "link-draw text-sm text-cream/85 hover:text-brass transition-colors duration-fast";
const groupTitle = "type-index text-brass";

export function Footer() {
  const socials = [
    { href: business.socials.instagram, label: "אינסטגרם" },
    { href: business.socials.facebook, label: "פייסבוק" },
    { href: "/map", label: "Google Maps" },
    { href: business.socials.waze, label: "Waze" },
  ];

  return (
    <footer className="bg-espresso-deep text-cream">
      <div className={`${container} grid gap-12 py-16 md:grid-cols-12 md:py-20`}>
        <div className="space-y-5 md:col-span-5">
          <Image
            src="/images/logo_cream.png"
            alt={business.name.he}
            width={1251}
            height={574}
            sizes="200px"
            className="h-auto w-[180px] md:w-[200px]"
          />
          <p className="max-w-xs text-sm leading-relaxed text-cream/85">{business.tagline.he}</p>
          <address className="space-y-2 text-sm not-italic text-cream/85">
            <Link href="/map" className="flex items-center gap-2 transition-colors hover:text-brass">
              <IconPin className="h-4 w-4 shrink-0 text-brass" />
              {business.address.street.he}, {business.address.neighborhood.he}, {business.address.city.he}
            </Link>
            <a href={`tel:${business.phone.tel}`} className="flex items-center gap-2 tabular-nums transition-colors hover:text-brass">
              <IconPhone className="h-4 w-4 shrink-0 text-brass" />
              {business.phone.display}
            </a>
          </address>
        </div>

        {linkGroups.map((g) => (
          <nav key={g.title} aria-label={g.title} className="space-y-4 md:col-span-3">
            <div className={groupTitle}>{g.title}</div>
            <ul className="space-y-2.5">
              {g.items.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="space-y-4 md:col-span-4">
          <div className={groupTitle}>עקבו אחרינו</div>
          <ul className="space-y-2.5">
            {socials.map((s) => (
              <li key={s.href}>
                {s.href.startsWith("/") ? (
                  <Link href={s.href} className={linkClass}>
                    {s.label}
                  </Link>
                ) : (
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {s.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/coffee-club"
            className="group mt-2 inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-amber px-4 text-sm font-medium text-cs-ink transition-[transform,background-color] duration-fast ease-out-soft hover:-translate-y-px hover:bg-amber-soft active:translate-y-0"
          >
            <IconStamp className="h-4 w-4 shrink-0 transition-transform duration-base ease-out-soft group-hover:-rotate-12" />
            להצטרפות למועדון
          </Link>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className={`${container} flex flex-col gap-3 py-6 text-xs text-cream/80 md:flex-row md:items-center md:justify-between`}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} {business.name.he}. כל הזכויות שמורות.</span>
            <a href="https://coffeestream.co.il" target="_blank" rel="noopener noreferrer" dir="ltr" className="transition-colors hover:text-brass">
              Powered by CoffeeStream ♡
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/accessibility" className="transition-colors hover:text-brass">
              הצהרת נגישות
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-brass">
              פרטיות
            </Link>
            <CookieSettingsButton className="cursor-pointer transition-colors hover:text-brass">
              {cookieSettingsLabel}
            </CookieSettingsButton>
          </div>
        </div>
      </div>
    </footer>
  );
}
