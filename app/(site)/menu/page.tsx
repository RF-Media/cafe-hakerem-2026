export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BadgeRow } from "@/components/ui/Badge";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { IconArrow } from "@/components/ui/icons";
import { Section, container } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { MenuCategoryRail } from "@/components/sections/MenuCategoryRail";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { menuCategories, menuIntro } from "@/content/menu";
import { menuFAQs } from "@/content/faqs";
import { business } from "@/content/business";
import { jachnun } from "@/content/jachnun";

export const metadata: Metadata = {
  title: "התפריט שלנו | קפה הכרם — בית קפה בגני תקווה",
  description:
    "התפריט המלא של קפה הכרם: קפה איכותי, ארוחות בוקר, כריכים, סלטים, מאפים ובורקסים. בית קפה בוטיקי ברחוב הכרמל 20, גני תקווה.",
};

/** `Offer.price` is a number in schema.org terms, and `priceCurrency` already
 *  carries the ILS. Passing the display string through put a ₪ glyph in a
 *  numeric field — strip it to digits here rather than making content/menu.ts
 *  hold two shapes of the same price. */
function schemaPrice(display: string): number {
  return Number(display.replace(/[^\d.]/g, ""));
}

function menuSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "התפריט של קפה הכרם",
    hasMenuSection: menuCategories.map((c) => ({
      "@type": "MenuSection",
      name: c.title.he,
      description: c.blurb,
      hasMenuItem: c.items.map((i) => ({
        "@type": "MenuItem",
        name: i.name,
        description: i.description,
        offers: {
          "@type": "Offer",
          price: schemaPrice(i.price),
          priceCurrency: "ILS",
        },
      })),
    })),
  };
}

/** Weekday opening line for the masthead, read out of business.ts so it can
 *  never drift from the hours block on /contact or the JSON-LD in the root
 *  layout. Groups the run of identical weekdays and names Friday separately. */
const weekdayHours = (() => {
  const open = business.hours.filter((h) => h.open && h.close);
  if (open.length === 0) return "לפי הודעה";
  const first = open[0];
  const last = open[open.length - 1];
  const sameAsFirst = open.filter((h) => h.open === first.open && h.close === first.close);
  const run = `${sameAsFirst[0].label.he}–${sameAsFirst[sameAsFirst.length - 1].label.he} ${first.open}–${first.close}`;
  return last === sameAsFirst[sameAsFirst.length - 1]
    ? run
    : `${run} · ${last.label.he} ${last.open}–${last.close}`;
})();

/** Cheapest and dearest thing on the menu, for the at-a-glance strip. */
const priceBand = (() => {
  const values = menuCategories
    .flatMap((c) => c.items)
    .map((i) => Number(i.price.replace(/[^\d.]/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);
  return `₪${Math.min(...values)}–₪${Math.max(...values)}`;
})();

/** The one dark beat on a long light page. Contained rather than full-bleed:
 *  it sits inside the page's container, between two category sections. */
function MenuInterlude() {
  return (
    <Reveal>
      <aside className="mt-16 md:mt-20 rounded-card bg-espresso-deep text-cream px-6 py-10 md:px-10 md:py-12">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Eyebrow tone="brass">שבת בבוקר</Eyebrow>
            <h2 className="mt-4 type-title text-2xl md:text-3xl">
              ג'חנון של שבת, להזמנה מראש
            </h2>
            <p className="mt-4 type-lede text-base text-cream/75 max-w-prose-he">
              {jachnun.hero.lede} ההזמנות נסגרות ביום חמישי בשעה 18:00.
            </p>
          </div>
          <div className="md:col-span-4 md:text-start">
            <Button as="a" href="/jachnun" variant="onDark" icon={<IconArrow />}>
              להזמנת ג'חנון
            </Button>
          </div>
        </div>
      </aside>
    </Reveal>
  );
}

export default function MenuPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: "התפריט", href: "/menu" }]} />
      <JsonLd data={menuSchema()} />

      <Breadcrumb items={[{ name: "התפריט" }]} />

      {/* Masthead. The page used to open on a bare heading sitting directly
          on the page ground, which read as starting mid-document. The
          at-a-glance strip gives it a threshold and puts the three facts
          people scan a menu page for — hours, band, dietary marking — above
          the fold in extractable form. */}
      <header className={`${container} pt-12 md:pt-20 pb-10 md:pb-14`}>
        <div className="hero-fade" style={{ ["--d" as never]: 0 }}>
          <Eyebrow withRule>{menuIntro.eyebrow}</Eyebrow>
        </div>
        <h1 className="mt-4 type-display text-4xl md:text-6xl text-espresso max-w-4xl">
          <SplitText text={menuIntro.title} delay={70} />
        </h1>
        <p
          className="hero-fade mt-6 max-w-prose-he type-lede text-base md:text-lg text-espresso-soft"
          style={{ ["--d" as never]: 340 }}
        >
          {menuIntro.body}
        </p>

        <dl
          className="hero-fade mt-10 grid gap-px overflow-hidden rounded-card border border-stroke
                     bg-stroke sm:grid-cols-3"
          style={{ ["--d" as never]: 480 }}
        >
          {[
            { term: "שעות", desc: weekdayHours },
            { term: "טווח מחירים", desc: `${business.priceRange} · ${priceBand}` },
            { term: "סימון בתפריט", desc: "טבעוני, צמחוני, ללא גלוטן וחריף" },
          ].map((fact) => (
            <div key={fact.term} className="bg-cream-3 px-5 py-4">
              <dt className="type-index text-brass-ink">{fact.term}</dt>
              <dd className="mt-2 text-sm text-espresso-soft">{fact.desc}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* Sticky in-page nav */}
      <nav
        aria-label="ניווט בתפריט"
        className="sticky top-14 z-30 bg-cream/90 backdrop-blur-lg border-b border-stroke"
      >
        <div className={`${container} py-2.5`}>
          <MenuCategoryRail
            items={menuCategories.map((c) => ({ id: c.id, label: c.title.he }))}
          />
        </div>
      </nav>

      <div className={`${container} py-14 md:py-16 space-y-20 md:space-y-24`}>
        {menuCategories.map((c, ci) => (
          <section key={c.id} id={c.id} className="scroll-mt-40">
            <Reveal>
              <header className="mb-6 md:mb-8 flex items-baseline gap-5">
                {/* Ghost numeral — the running order of a printed menu. */}
                <span
                  aria-hidden
                  className="type-display text-3xl md:text-5xl text-brass-ink/25 tabular-nums shrink-0"
                >
                  {String(ci + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="type-title text-3xl md:text-4xl text-espresso">
                    {c.title.he}
                  </h2>
                  <span aria-hidden className="mt-4 block h-px w-12 bg-brass-ink/45" />
                  {c.blurb ? (
                    <p className="mt-4 text-base text-espresso-soft max-w-prose-he">
                      {c.blurb}
                    </p>
                  ) : null}
                </div>
              </header>
            </Reveal>

            {/* Two columns on md+, the way a printed menu sets a long list.
                `grid`, not CSS `columns` — Framer writes `transform` onto
                each StaggerItem and multi-column fragmentation breaks it. */}
            <Stagger
              as="ul"
              className="md:grid md:grid-cols-2 md:gap-x-14"
              stagger={0.04}
            >
              {c.items.map((item, i) => (
                <StaggerItem
                  key={i}
                  as="li"
                  className="group/row flex items-baseline gap-4 md:gap-5 border-b border-stroke py-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      {/* Weight 500. This was the site's third heading system
                          — `font-display font-bold` at 700, matching nothing
                          else — and is now the shared `.type-sub` register. */}
                      <span className="type-sub text-lg md:text-xl text-espresso">
                        {item.name}
                      </span>
                      <BadgeRow badges={item.badges} />
                    </div>
                    {item.description ? (
                      <div className="text-sm text-espresso-soft mt-1">{item.description}</div>
                    ) : null}
                  </div>
                  {/* Leader dots tie the name to its price across the gap —
                      the reason printed menus have used them for a century. */}
                  <span
                    aria-hidden
                    className="hidden md:block flex-1 min-w-[1.5rem] border-b border-dotted
                               border-stroke translate-y-[-0.25rem]"
                  />
                  <div className="shrink-0 tabular-nums text-brass-ink font-medium">
                    {item.price}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            {/* One dark beat partway down, so seven light sections in a row
                get a break — and the jachnun cross-link lands where someone
                is already reading about food rather than at the page foot. */}
            {ci === 1 ? <MenuInterlude /> : null}
          </section>
        ))}
      </div>

      <Section tone="cream-2">
        <FAQBlock items={menuFAQs} />
        <FAQSchema items={menuFAQs} />
        <FactualParagraph focus="התפריט כולל קפה שנטחן במקום, ארוחות בוקר, כריכים, סלטים, בורקסים ומאפים טריים, וכן מגשי אירוח וג'חנון של שבת להזמנה." />
        <div className="mt-12 text-center text-sm text-espresso-soft">
          רוצים להזמין מראש? <Link href="/jachnun" className="text-olive hover:text-espresso">ג'חנון של שבת</Link>{" · "}
          <Link href="/catering" className="text-olive hover:text-espresso">מגשי אירוח</Link>{" · "}
          <Link href="/contact" className="text-olive hover:text-espresso">פרטי הקפה</Link>
        </div>
      </Section>

      <span className="sr-only">{business.name.he}</span>
    </>
  );
}
