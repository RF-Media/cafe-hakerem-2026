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
import { JachnunOrderForm } from "@/components/sections/JachnunOrderForm";
import { jachnun } from "@/content/jachnun";
import { jachnunFAQs } from "@/content/faqs";
import { business } from "@/content/business";

export const metadata: Metadata = {
  title: "ג'חנון של שבת להזמנה | קפה הכרם — גני תקווה",
  description:
    "ג'חנון תימני מסורתי להזמנה מראש בקפה הכרם, גני תקווה. אפייה לילה שלם, איסוף בשבת בבוקר. הזמנה דרך האתר עד יום חמישי 18:00.",
};

function productSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "ג'חנון של שבת — קפה הכרם",
    brand: { "@type": "Brand", name: business.name.he },
    description:
      "ג'חנון תימני מסורתי הנאפה במטבח של קפה הכרם בגני תקווה, להזמנה מראש ולאיסוף בשבת בבוקר.",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/PreOrder",
      priceCurrency: "ILS",
      price: jachnun.pricing.perUnit,
    },
  };
}

export default function JachnunPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: "ג'חנון", href: "/jachnun" }]} />
      <JsonLd data={productSchema()} />

      {/* Sub-brand hero — terracotta accents */}
      <section className="bg-cream-2 py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7 space-y-6">
            <Eyebrow tone="jachnun" withRule>{jachnun.hero.eyebrow}</Eyebrow>
            <h1 className="text-4xl md:text-6xl font-display leading-[1.1] text-espresso">
              {jachnun.hero.title}
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-espresso-soft max-w-xl">
              {jachnun.hero.lede}
            </p>
            <div className="text-sm text-jachnun">
              {jachnun.pricing.perUnit}
              {jachnun.pricing.bundleNote ? ` · ${jachnun.pricing.bundleNote}` : ""}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] bg-cream border border-stroke rounded-card flex items-center justify-center text-espresso-soft">
              <span className="text-sm">[TODO: תמונת ג'חנון על מגש]</span>
            </div>
          </div>
        </div>
      </section>

      {/* Three reasons */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16 grid md:grid-cols-3 gap-6">
          {jachnun.threeReasons.map((r, i) => (
            <Card key={i} padding="lg">
              <div className="font-display text-xl text-espresso">{r.title}</div>
              <p className="mt-2 text-base text-espresso-soft leading-relaxed">{r.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Order form + what's included */}
      <section className="bg-cream-2 py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Eyebrow tone="jachnun">מה כלול</Eyebrow>
            <ul className="space-y-2 text-base text-espresso-soft">
              {jachnun.whatsIncluded.map((i, idx) => (
                <li key={idx} className="flex gap-3">
                  <span aria-hidden className="text-jachnun">◆</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <Card padding="md" className="bg-cream">
              <div className="font-display text-lg text-espresso mb-2">{jachnun.reassurance.title}</div>
              <ol className="space-y-2 text-sm text-espresso-soft list-decimal pr-5">
                {jachnun.reassurance.steps.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ol>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <Card padding="lg" className="bg-cream">
              <h2 className="font-display text-2xl text-espresso mb-6">טופס הזמנה</h2>
              <JachnunOrderForm />
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16">
          <FAQBlock items={jachnunFAQs} />
          <FAQSchema items={jachnunFAQs} />
          <FactualParagraph focus="קפה הכרם אופה ג'חנון תימני להזמנה מראש ומציע איסוף בשבת בבוקר. ניתן להזמין דרך האתר עד יום חמישי בשעה 18:00." />
          <div className="mt-10 text-center text-sm text-espresso-soft">
            רוצים לראות עוד? <Link href="/menu" className="text-olive hover:text-espresso">לתפריט המלא</Link>{" · "}
            <Link href="/catering" className="text-olive hover:text-espresso">מגשי אירוח</Link>{" · "}
            <Link href="/about" className="text-olive hover:text-espresso">הסיפור שלנו</Link>
          </div>
        </div>
      </section>
    </>
  );
}
