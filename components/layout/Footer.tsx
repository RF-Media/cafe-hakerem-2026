import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { container } from "@/components/ui/Section";

/**
 * Dark closing chord. Every page above it is cream, so ending on
 * espresso-deep gives the scroll a floor to land on instead of fading out.
 */

const linkGroups: { title: string; items: { href: string; label: string }[] }[] = [
  {
    title: "האתר",
    items: [
      { href: "/menu",     label: "תפריט הכרם" },
      { href: "/jachnun",  label: "ג'חנון של שבת" },
      { href: "/catering", label: "מגשי אירוח" },
      { href: "/about",    label: "עלינו" },
      { href: "/contact",  label: "צור קשר" },
    ],
  },
];

function socialHref(value: string): string | null {
  if (!value || value.startsWith("[TODO")) return null;
  return value;
}

const linkClass =
  "text-sm text-cream/70 hover:text-brass transition-colors duration-fast";
const groupTitle =
  "font-latin text-xs uppercase tracking-[0.22em] text-brass font-medium";

export function Footer() {
  const ig = socialHref(business.socials.instagram);
  const fb = socialHref(business.socials.facebook);
  const gm = socialHref(business.socials.googleMaps);
  const socials = [
    ig ? { href: ig, label: "אינסטגרם" } : null,
    fb ? { href: fb, label: "פייסבוק" } : null,
    gm ? { href: gm, label: "Google Maps" } : null,
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="mt-24 bg-espresso-deep text-cream">
      <div aria-hidden className="h-px w-full bg-gradient-to-l from-transparent via-brass/40 to-transparent" />

      <Stagger className={`${container} py-16 md:py-20 grid gap-12 md:grid-cols-3`} stagger={0.1}>
        <StaggerItem className="space-y-4">
          {/* The closing mark. The artwork is cream on transparency, so the
              dark footer is the one other place besides the hero where it
              works natively — no tinting, no second asset. Quiet on purpose:
              the hero already made the loud statement. */}
          <Image
            src="/images/logo2.png"
            alt={business.name.he}
            width={1251}
            height={574}
            sizes="200px"
            className="w-[180px] md:w-[200px] h-auto opacity-80"
          />
          <p className="text-sm text-cream/65 leading-relaxed max-w-xs">
            {business.tagline.he}
          </p>
          <address className="not-italic text-sm text-cream/65 leading-relaxed">
            <div>{business.address.street.he}, {business.address.neighborhood.he}</div>
            <div>{business.address.city.he}, {business.address.country.he}</div>
            <div className="mt-2">
              <a href={`tel:${business.phone.tel}`} className="text-cream hover:text-brass transition-colors">
                {business.phone.display}
              </a>
            </div>
          </address>
        </StaggerItem>

        {linkGroups.map((g) => (
          <StaggerItem key={g.title}>
            <nav aria-label={g.title} className="space-y-4">
              <div className={groupTitle}>{g.title}</div>
              <ul className="space-y-2.5">
                {g.items.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkClass}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </StaggerItem>
        ))}

        <StaggerItem className="space-y-4">
          <div className={groupTitle}>עקבו אחרינו</div>
          {socials.length ? (
            <ul className="space-y-2.5">
              {socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </StaggerItem>
      </Stagger>

      <div className="border-t border-cream/10">
        <div className={`${container} py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-cream/50`}>
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} {business.name.he}. כל הזכויות שמורות.</span>
            <span dir="ltr">Powered by CoffeeStream ♡</span>
          </div>
          <Link href="/privacy" className="hover:text-brass transition-colors">
            פרטיות
          </Link>
        </div>
      </div>
    </footer>
  );
}
