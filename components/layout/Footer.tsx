import Link from "next/link";
import { business } from "@/content/business";

const linkGroups: { title: string; items: { href: string; label: string }[] }[] = [
  {
    title: "האתר",
    items: [
      { href: "/menu",     label: "התפריט" },
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

export function Footer() {
  const ig = socialHref(business.socials.instagram);
  const fb = socialHref(business.socials.facebook);
  const gm = socialHref(business.socials.googleMaps);

  return (
    <footer className="mt-24 border-t border-stroke bg-cream-2">
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16 py-16 grid gap-12 md:grid-cols-3">
        <div className="space-y-3">
          <div className="font-display text-2xl text-espresso">{business.name.he}</div>
          <p className="text-sm text-espresso-soft leading-relaxed">
            {business.tagline.he}
          </p>
          <address className="not-italic text-sm text-espresso-soft leading-relaxed">
            <div>{business.address.street.he}, {business.address.neighborhood.he}</div>
            <div>{business.address.city.he}, {business.address.country.he}</div>
            <div>
              <a href={`tel:${business.phone.tel}`} className="hover:text-espresso transition-colors">
                {business.phone.display}
              </a>
            </div>
          </address>
        </div>

        {linkGroups.map((g) => (
          <nav key={g.title} aria-label={g.title} className="space-y-3">
            <div className="text-xs uppercase tracking-[0.25em] text-olive">{g.title}</div>
            <ul className="space-y-2">
              {g.items.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-espresso hover:text-olive transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.25em] text-olive">עקבו אחרינו</div>
          <ul className="space-y-2 text-sm">
            {ig ? <li><a href={ig} target="_blank" rel="noopener noreferrer" className="text-espresso hover:text-olive transition-colors">אינסטגרם</a></li> : null}
            {fb ? <li><a href={fb} target="_blank" rel="noopener noreferrer" className="text-espresso hover:text-olive transition-colors">פייסבוק</a></li> : null}
            {gm ? <li><a href={gm} target="_blank" rel="noopener noreferrer" className="text-espresso hover:text-olive transition-colors">Google Maps</a></li> : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-stroke">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-espresso-soft">
          <div>© {new Date().getFullYear()} {business.name.he}. כל הזכויות שמורות.</div>
          <Link href="/privacy" className="hover:text-espresso transition-colors">
            פרטיות
          </Link>
        </div>
      </div>
    </footer>
  );
}
