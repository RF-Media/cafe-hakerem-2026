export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { about } from "@/content/about";
import { homeFAQs } from "@/content/faqs";
import { business } from "@/content/business";

export const metadata: Metadata = {
  title: "הסיפור שלנו | קפה הכרם — בית קפה בגני תקווה",
  description:
    "הסיפור של קפה הכרם — בית קפה בוטיקי בגבעת סביון, גני תקווה. הבעלים, המסורת, והאופן שבו השכונה הפכה לחלק מהמקום.",
};

function aboutSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "הסיפור של קפה הכרם",
    about: { "@id": `${business.siteUrl}/#cafe` },
  };
}

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: "עלינו", href: "/about" }]} />
      <JsonLd data={aboutSchema()} />

      <section className="mx-auto max-w-container px-6 md:px-10 lg:px-16 pt-16 md:pt-24 pb-16">
        <Eyebrow withRule>{about.hero.eyebrow}</Eyebrow>
        <h1 className="mt-3 text-4xl md:text-6xl font-display leading-[1.1] text-espresso max-w-3xl">
          {about.hero.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-espresso-soft">
          {about.hero.lede}
        </p>
      </section>

      <section className="mx-auto max-w-container px-6 md:px-10 lg:px-16 py-12">
        <div className="max-w-3xl space-y-6">
          {about.paragraphs.map((p, i) => (
            <p key={i} className="text-base md:text-lg leading-relaxed text-espresso-soft">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Authorship block — GEO §11.4 */}
      <section className="bg-cream-2 py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16">
          <Eyebrow withRule>מי עומד מאחורי הקפה</Eyebrow>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {about.founders.map((f, i) => (
              <Card key={i} padding="lg">
                <div className="font-display text-xl md:text-2xl text-espresso">{f.name}</div>
                <div className="mt-1 text-sm text-olive">{f.role}</div>
                <p className="mt-3 text-base text-espresso-soft leading-relaxed">{f.bioShort}</p>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-sm text-espresso-soft">
            {business.name.he} פועל ב{business.address.city.he} משנת {about.foundedYear}.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-display text-espresso">{about.cta.title}</h2>
          <p className="mt-4 text-base md:text-lg text-espresso-soft">{about.cta.body}</p>
          <div className="mt-6 flex justify-center gap-4 text-sm">
            <Link href="/menu" className="text-olive hover:text-espresso">לתפריט</Link>
            <Link href="/jachnun" className="text-olive hover:text-espresso">ג'חנון של שבת</Link>
            <Link href="/contact" className="text-olive hover:text-espresso">פרטי הקפה</Link>
          </div>
        </div>
      </section>

      <section className="bg-cream-2 py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16">
          <FAQBlock items={homeFAQs} heading="שאלות נפוצות על הקפה" />
          <FAQSchema items={homeFAQs} />
          <FactualParagraph focus="הקפה מנוהל על ידי הבעלים, ופועל כבית קפה שכונתי המגיש ארוחות בוקר, קפה ומאפים." />
        </div>
      </section>
    </>
  );
}
