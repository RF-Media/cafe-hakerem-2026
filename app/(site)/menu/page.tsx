export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FAQBlock } from "@/components/ui/FAQBlock";
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

      <section className="mx-auto max-w-container px-6 md:px-10 lg:px-16 pt-16 md:pt-24 pb-12">
        <Eyebrow withRule>{menuIntro.eyebrow}</Eyebrow>
        <h1 className="mt-3 text-4xl md:text-6xl font-display leading-[1.1] text-espresso">
          {menuIntro.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-espresso-soft">
          {menuIntro.body}
        </p>
      </section>

      {/* Sticky in-page nav */}
      <nav
        aria-label="ניווט בתפריט"
        className="sticky top-20 z-30 bg-cream/85 backdrop-blur border-y border-stroke"
      >
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16 py-3 overflow-x-auto">
          <ul className="flex gap-5 whitespace-nowrap text-sm">
            {menuCategories.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} className="text-espresso-soft hover:text-espresso transition-colors">
                  {c.title.he}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16 py-12 space-y-20">
        {menuCategories.map((c) => (
          <section key={c.id} id={c.id} className="scroll-mt-40">
            <header className="mb-6">
              <h2 className="text-3xl md:text-4xl font-display leading-tight text-espresso">
                {c.title.he}
              </h2>
              {c.blurb ? (
                <p className="mt-2 text-base text-espresso-soft max-w-2xl">{c.blurb}</p>
              ) : null}
            </header>
            <ul className="divide-y divide-stroke">
              {c.items.map((item, i) => (
                <li key={i} className="py-4 flex items-baseline gap-6">
                  <div className="flex-1">
                    <div className="font-display text-lg md:text-xl text-espresso">{item.name}</div>
                    {item.description ? (
                      <div className="text-sm text-espresso-soft mt-1">{item.description}</div>
                    ) : null}
                  </div>
                  <div className="font-medium text-espresso shrink-0">{item.price}</div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="bg-cream-2 py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16">
          <FAQBlock items={menuFAQs} />
          <FAQSchema items={menuFAQs} />
          <FactualParagraph focus="התפריט כולל קפה שנטחן במקום, ארוחות בוקר, כריכים, סלטים, בורקסים ומאפים טריים, וכן מגשי אירוח וג'חנון של שבת להזמנה." />
          <div className="mt-12 text-center text-sm text-espresso-soft">
            רוצים להזמין מראש? <Link href="/jachnun" className="text-olive hover:text-espresso">ג'חנון של שבת</Link>{" · "}
            <Link href="/catering" className="text-olive hover:text-espresso">מגשי אירוח</Link>{" · "}
            <Link href="/contact" className="text-olive hover:text-espresso">פרטי הקפה</Link>
          </div>
        </div>
      </section>

      <span className="sr-only">{business.name.he}</span>
    </>
  );
}
