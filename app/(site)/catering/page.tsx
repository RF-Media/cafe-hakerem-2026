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
import { CateringInquiryForm } from "@/components/sections/CateringInquiryForm";
import { catering } from "@/content/catering";
import { cateringFAQs } from "@/content/faqs";
import { business } from "@/content/business";

export const metadata: Metadata = {
  title: "מגשי אירוח להזמנה | קפה הכרם — גני תקווה",
  description:
    "מגשי אירוח של קפה הכרם — מגשי בוקר, כריכים ומתוקים לישיבות עבודה, אירועים משפחתיים וברית באזור גני תקווה. הזמנה דרך טופס הפנייה.",
};

function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Catering",
    name: "מגשי אירוח — קפה הכרם",
    provider: { "@id": `${business.siteUrl}/#cafe` },
    areaServed: { "@type": "Place", name: `${business.address.city.he} והסביבה` },
  };
}

export default function CateringPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: "מגשי אירוח", href: "/catering" }]} />
      <JsonLd data={serviceSchema()} />

      <section className="mx-auto max-w-container px-6 md:px-10 lg:px-16 pt-16 md:pt-24 pb-16">
        <Eyebrow withRule>{catering.hero.eyebrow}</Eyebrow>
        <h1 className="mt-3 text-4xl md:text-6xl font-display leading-[1.1] text-espresso max-w-3xl">
          {catering.hero.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-espresso-soft">
          {catering.hero.lede}
        </p>
      </section>

      {/* Promises */}
      <section className="bg-cream-2 py-16 md:py-20">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16 grid md:grid-cols-3 gap-6">
          {catering.promises.map((p, i) => (
            <Card key={i} padding="lg">
              <div className="font-display text-xl text-espresso">{p.title}</div>
              <p className="mt-2 text-base text-espresso-soft leading-relaxed">{p.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Options grid */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16">
          <h2 className="text-3xl md:text-4xl font-display text-espresso mb-10">
            סוגי מגשים
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {catering.options.map((o) => (
              <Card key={o.id} padding="lg" hoverable>
                <div className="font-display text-xl text-espresso">{o.title.he}</div>
                <div className="mt-1 text-sm text-olive">{o.serves}</div>
                <ul className="mt-4 space-y-1 text-base text-espresso-soft">
                  {o.includes.map((it, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden className="text-olive">·</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                {o.fromPrice ? (
                  <div className="mt-4 text-sm font-medium text-espresso">{o.fromPrice}</div>
                ) : null}
              </Card>
            ))}
          </div>
          <dl className="mt-10 grid md:grid-cols-2 gap-4 text-sm text-espresso-soft max-w-3xl">
            <div><dt className="font-medium text-espresso">זמן הזמנה מוקדם</dt><dd>{catering.fineprint.leadTime}</dd></div>
            <div><dt className="font-medium text-espresso">תשלום</dt><dd>{catering.fineprint.payment}</dd></div>
            <div><dt className="font-medium text-espresso">ביטולים</dt><dd>{catering.fineprint.cancellation}</dd></div>
            <div><dt className="font-medium text-espresso">סכום מינימום</dt><dd>{catering.fineprint.minimumOrder}</dd></div>
          </dl>
        </div>
      </section>

      {/* Inquiry form */}
      <section className="bg-cream-2 py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-display text-espresso">בואו נדבר</h2>
          <p className="mt-3 text-base md:text-lg text-espresso-soft">{catering.formIntro}</p>
          <div className="mt-8">
            <Card padding="lg" className="bg-cream">
              <CateringInquiryForm />
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16">
          <FAQBlock items={cateringFAQs} />
          <FAQSchema items={cateringFAQs} />
          <FactualParagraph focus="קפה הכרם מספק מגשי אירוח לאירועים פרטיים ועסקיים באזור גני תקווה, באיסוף מהמקום או במשלוח." />
          <div className="mt-10 text-center text-sm text-espresso-soft">
            <Link href="/menu" className="text-olive hover:text-espresso">לתפריט</Link>{" · "}
            <Link href="/jachnun" className="text-olive hover:text-espresso">ג'חנון של שבת</Link>{" · "}
            <Link href="/contact" className="text-olive hover:text-espresso">פרטי הקפה</Link>
          </div>
        </div>
      </section>
    </>
  );
}
