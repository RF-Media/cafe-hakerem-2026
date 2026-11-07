export const dynamic = "force-static";
export const revalidate = 86400;

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BadgeRow } from "@/components/ui/Badge";
import { CafeImage } from "@/components/ui/CafeImage";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { IconArrow, IconStamp } from "@/components/ui/icons";
import { Section, container } from "@/components/ui/Section";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { MenuCategoryRail } from "@/components/sections/MenuCategoryRail";
import { PageHero } from "@/components/sections/PageHero";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { menuCategories, menuIntro } from "@/content/menu";
import { menuFAQs } from "@/content/faqs";
import { business, clubJoinUrl } from "@/content/business";
import { club } from "@/content/club";
import { jachnun } from "@/content/jachnun";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("menu");

/** `Offer.price` is a number in schema.org terms, and `priceCurrency` already
 *  carries the ILS. Strip the display string to digits here rather than making
 *  content/menu.ts hold two shapes of the same price. */
function schemaPrice(display: string): number {
  return Number(display.replace(/[^\d.]/g, ""));
}

function menuSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${business.siteUrl}/menu#menu`,
    name: "התפריט של קפה הכרם",
    url: `${business.siteUrl}/menu`,
    inLanguage: "he",
    hasMenuSection: menuCategories.map((c) => ({
      "@type": "MenuSection",
      name: c.title.he,
      description: c.blurb,
      image: c.image ? `${business.siteUrl}${c.image}` : undefined,
      hasMenuItem: c.items.map((i) => ({
        "@type": "MenuItem",
        name: i.name,
        description: i.description,
        offers: { "@type": "Offer", price: schemaPrice(i.price), priceCurrency: "ILS" },
      })),
    })),
  };
}

/** Opening hours, read out of business.ts so they can never drift from /contact
 *  or the JSON-LD. One line per run of days: a single joined string wrapped
 *  badly on phones and mixed directions in RTL. */
const hoursLines = business.hours
  .filter((h) => h.day === 0 || h.day === 5 || h.day === 6)
  .map((h) => ({ days: h.day === 0 ? "א׳-ה׳" : h.label.he, time: `${h.open}-${h.close}` }));

const facts = [
  { term: "להזמנה", desc: "איסוף עצמי · ישיבה במקום" },
  { term: "סימון בתפריט", desc: "טבעוני, צמחוני, ללא גלוטן וחריף" },
];

/** A terracotta beat between the sandwiches and the salads, where someone is
 *  already reading about food rather than at the foot of the page. */
function JachnunInterlude() {
  return (
    <section className="bg-jachnun text-cream">
      <div className={`${container} grid items-center gap-8 py-14 md:grid-cols-12 md:py-16`}>
        <div className="md:col-span-8">
          <Eyebrow tone="cream" withRule>שבת בבוקר</Eyebrow>
          <h2 className="mt-4 type-statement text-4xl md:text-5xl">
            <SplitReveal text="ג'חנון של שבת, להזמנה מראש" />
          </h2>
          <p className="mt-4 max-w-prose-he type-lede text-lg">
            {jachnun.hero.lede} ההזמנות נסגרות ביום חמישי בשעה 18:00.
          </p>
        </div>
        <div className="md:col-span-4 md:text-end">
          <Button as="a" href="/jachnun#order" variant="onDark" size="lg" icon={<IconArrow />}>
            להזמנת ג'חנון
          </Button>
        </div>
      </div>
    </section>
  );
}

/** And an amber one further down, for the people ordering every week anyway. */
function ClubInterlude() {
  return (
    <section className="cs-panel">
      <div className={`${container} grid items-center gap-6 py-12 md:grid-cols-12 md:py-14`}>
        <div className="flex items-center gap-5 md:col-span-8">
          <span className="sticker hidden h-16 w-16 shrink-0 -rotate-6 place-items-center rounded-[18px] bg-amber sm:grid">
            <IconStamp className="h-8 w-8" />
          </span>
          <div>
            <h2 className="type-statement text-3xl md:text-4xl">{club.band.title}</h2>
            <p className="mt-2 max-w-prose-he text-base md:text-lg">{club.perks.items[1].body}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:col-span-4 md:justify-end">
          <Button as="a" href={clubJoinUrl("menu_interlude")} external variant="ink" icon={<IconArrow />}>
            {club.band.primary}
          </Button>
          <Link href="/coffee-club" className="inline-flex min-h-[44px] items-center text-sm font-medium underline underline-offset-4">
            {club.band.secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function MenuPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: "התפריט", href: "/menu" }]} />
      <JsonLd data={menuSchema()} />

      <PageHero
        tone="espresso"
        crumbs={[{ name: "התפריט" }]}
        kicker="התפריט של קפה הכרם, גני תקווה"
        title={menuIntro.title}
        lede={menuIntro.body}
        image="/images/burekas-golden_shared.jpg"
        imageAlt="בורקסים תורכיים מוזהבים בתבנית, ישר מהתנור של קפה הכרם"
      >
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-3">
          <div>
            <dt className="type-index text-brass">שעות</dt>
            <dd className="mt-1 space-y-0.5 text-sm text-cream/90">
              {hoursLines.map((line) => (
                <span key={line.days} className="flex justify-between gap-3 sm:justify-start">
                  <span>{line.days}</span>
                  <bdi dir="ltr" className="tabular-nums">{line.time}</bdi>
                </span>
              ))}
            </dd>
          </div>
          {facts.map((fact) => (
            <div key={fact.term}>
              <dt className="type-index text-brass">{fact.term}</dt>
              <dd className="mt-1 text-sm text-cream/90">{fact.desc}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <MenuCategoryRail items={menuCategories.map((c) => ({ id: c.id, label: c.title.he }))} />

      {menuCategories.map((c, ci) => (
        <div key={c.id}>
          {/* A jump lands the content 24px under the rail. `html` already adds
              scroll-padding of nav + 16px, and the margin takes back the
              section's own top padding (py-14, md:py-20), so what shows under
              the rail is this category and not the tail of the one before it. */}
          <section
            id={c.id}
            className="scroll-mt-[calc(var(--menu-rail-h)+8px-3.5rem)] py-14 md:scroll-mt-[calc(var(--menu-rail-h)+8px-5rem)] md:py-20"
          >
            <div className={`${container} grid gap-8 lg:grid-cols-12 lg:gap-14`}>
              {/* The category's photo holds still while a long list scrolls,
                  pinned at the height a jump lands it, so it never shifts. */}
              <div className={`lg:col-span-4 ${ci % 2 === 1 ? "lg:order-last" : ""}`}>
                <div className="lg:sticky lg:top-[calc(var(--nav-h)+var(--menu-rail-h)+24px)]">
                  <ImageReveal className="rounded-card">
                    <CafeImage
                      variant="pastry"
                      src={c.image}
                      alt={c.imageAlt ?? c.title.he}
                      position={c.imagePosition}
                      ratio="aspect-[16/10] lg:aspect-[4/5]"
                      sizes="(max-width: 1024px) 100vw, 30vw"
                    />
                  </ImageReveal>
                </div>
              </div>

              <div className="lg:col-span-8">
                <Reveal>
                  <header className="mb-6 flex items-baseline gap-5">
                    <span
                      aria-hidden
                      data-n={String(ci + 1).padStart(2, "0")}
                      className="type-statement text-4xl tabular-nums text-brass-ink/40 before:content-[attr(data-n)] md:text-6xl"
                    />
                    <div>
                      <h2 className="type-statement text-3xl text-espresso md:text-5xl">{c.title.he}</h2>
                      {c.blurb ? <p className="mt-3 max-w-prose-he text-base text-espresso-soft md:text-lg">{c.blurb}</p> : null}
                    </div>
                  </header>
                </Reveal>

                <Stagger as="ul" stagger={0.04}>
                  {c.items.map((item, i) => (
                    <StaggerItem
                      key={i}
                      as="li"
                      className="group/row -mx-3 flex items-baseline gap-4 rounded-input border-b border-stroke px-3 py-4 transition-colors duration-fast hover:bg-cream-2 md:gap-5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <span className="type-sub text-lg text-espresso md:text-xl">{item.name}</span>
                          <BadgeRow badges={item.badges} />
                        </div>
                        {item.description ? <div className="mt-1 text-sm text-espresso-soft md:text-base">{item.description}</div> : null}
                      </div>
                      <div className="shrink-0 text-lg font-medium tabular-nums text-brass-ink transition-transform duration-fast ease-out-soft group-hover/row:-translate-x-1">
                        {item.price}
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </div>
          </section>

          {ci === 1 ? <JachnunInterlude /> : null}
          {ci === 5 ? <ClubInterlude /> : null}
        </div>
      ))}

      <Section tone="cream-2">
        <FAQBlock items={menuFAQs} heading="שאלות על התפריט" />
        <FAQSchema items={menuFAQs} />
        <FactualParagraph focus="התפריט של קפה הכרם כולל בורקס תורכי בעבודת יד, כריכים ופוקאצ'ות, סלטים, מאפים, עוגות, קפה קר, מיצים סחוטים ומוצרי קפה לבית, וכן מגשי אירוח וג'חנון של שבת להזמנה." />
        <div className="mt-12 text-center text-sm text-espresso-soft">
          רוצים להזמין מראש? <Link href="/jachnun" className="text-olive hover:text-espresso">ג'חנון של שבת</Link>{" · "}
          <Link href="/catering" className="text-olive hover:text-espresso">מגשי אירוח</Link>{" · "}
          <Link href="/contact" className="text-olive hover:text-espresso">פרטי הקפה</Link>
        </div>
      </Section>
    </>
  );
}
