export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BadgeRow } from "@/components/ui/Badge";
import { FAQBlock } from "@/components/ui/FAQBlock";
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

export const metadata: Metadata = {
  title: "התפריט שלנו | קפה הכרם — בית קפה בגני תקווה",
  description:
    "התפריט המלא של קפה הכרם: קפה איכותי, ארוחות בוקר, כריכים, סלטים, מאפים ובורקסים. בית קפה בוטיקי ברחוב הכרמל 20, גני תקווה.",
};

function menuSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "התפריט של קפה הכרם",
    hasMenuSection: menuCategories.map((c) => ({
      "@type": "MenuSection",
      name: c.title.he,
      hasMenuItem: c.items
        .filter((i) => !i.name.startsWith("[TODO"))
        .map((i) => ({
          "@type": "MenuItem",
          name: i.name,
          description: i.description,
          offers: { "@type": "Offer", price: i.price, priceCurrency: "ILS" },
        })),
    })),
  };
}

export default function MenuPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: "התפריט", href: "/menu" }]} />
      <JsonLd data={menuSchema()} />

      <Breadcrumb items={[{ name: "התפריט" }]} />

      <section className={`${container} pt-12 md:pt-20 pb-10 md:pb-14`}>
        <div className="hero-fade" style={{ ["--d" as never]: 0 }}>
          <Eyebrow withRule>{menuIntro.eyebrow}</Eyebrow>
        </div>
        <h1 className="mt-4 type-display text-4xl md:text-6xl text-espresso">
          <SplitText text={menuIntro.title} delay={70} />
        </h1>
        <p
          className="hero-fade mt-6 max-w-prose-he type-lede text-base md:text-lg text-espresso-soft"
          style={{ ["--d" as never]: 340 }}
        >
          {menuIntro.body}
        </p>
      </section>

      {/* Sticky in-page nav */}
      <nav
        aria-label="ניווט בתפריט"
        className="sticky top-[72px] md:top-20 z-30 bg-cream/90 backdrop-blur-lg border-y border-stroke"
      >
        <div className={`${container} py-2.5`}>
          <MenuCategoryRail
            items={menuCategories.map((c) => ({ id: c.id, label: c.title.he }))}
          />
        </div>
      </nav>

      <div className={`${container} py-14 md:py-16 space-y-20 md:space-y-28`}>
        {menuCategories.map((c) => (
          <section key={c.id} id={c.id} className="scroll-mt-40">
            <Reveal>
              <header className="mb-6 md:mb-8">
                <h2 className="type-display text-3xl md:text-4xl text-espresso">
                  {c.title.he}
                </h2>
                <span aria-hidden className="mt-4 block h-px w-12 bg-brass/55" />
                {c.blurb ? (
                  <p className="mt-4 text-base text-espresso-soft max-w-prose-he">{c.blurb}</p>
                ) : null}
              </header>
            </Reveal>

            <Stagger as="ul" className="divide-y divide-stroke" stagger={0.05}>
              {c.items.map((item, i) => (
                <StaggerItem
                  key={i}
                  as="li"
                  className="group/row py-4 flex items-baseline gap-4 md:gap-6
                             transition-colors duration-fast hover:text-espresso"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <span className="font-display font-bold text-lg md:text-xl text-espresso">
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
                    className="hidden md:block flex-1 border-b border-dotted border-stroke translate-y-[-0.25rem]"
                  />
                  <div className="font-medium text-espresso shrink-0 tabular-nums">
                    {item.price}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
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
