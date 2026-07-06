export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { business } from "@/content/business";
import { contactFAQs } from "@/content/faqs";

export const metadata: Metadata = {
  title: "צור קשר, שעות וכתובת | קפה הכרם — בית קפה בגני תקווה",
  description:
    "קפה הכרם, רחוב הכרמל 20, גני תקווה. טלפון, וואטסאפ, שעות פתיחה ומפה. בית קפה בוטיקי בגבעת סביון. ניתן לפנות גם להזמנת ג'חנון או מגשי אירוח.",
};

function contactSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    about: { "@id": `${business.siteUrl}/#cafe` },
  };
}

export default function ContactPage() {
  const waMessage = encodeURIComponent(business.whatsapp.prefilledMessage);
  const waHref = `https://wa.me/${business.whatsapp.number}?text=${waMessage}`;
  const reviews = !business.socials.google.startsWith("[TODO") ? business.socials.google : null;

  return (
    <>
      <BreadcrumbSchema trail={[{ name: "צור קשר", href: "/contact" }]} />
      <JsonLd data={contactSchema()} />

      <section className="mx-auto max-w-container px-6 md:px-10 lg:px-16 pt-16 md:pt-24 pb-16 grid md:grid-cols-2 gap-10">
        <div>
          <Eyebrow withRule>Visit</Eyebrow>
          <h1 className="mt-3 text-4xl md:text-6xl font-display leading-[1.1] text-espresso">
            איך מגיעים לקפה הכרם
          </h1>
          <div className="mt-8 space-y-6">
            <Card padding="lg" className="bg-cream-2">
              <div className="text-xs uppercase tracking-[0.25em] text-olive mb-2">כתובת</div>
              <address className="not-italic text-espresso leading-relaxed">
                <div className="font-display text-xl">{business.address.street.he}</div>
                <div>{business.address.neighborhood.he}, {business.address.city.he}</div>
              </address>
            </Card>

            <Card padding="lg" className="bg-cream-2">
              <div className="text-xs uppercase tracking-[0.25em] text-olive mb-2">טלפון ו-WhatsApp</div>
              <div className="space-y-2 text-espresso">
                <div>
                  <a href={`tel:${business.phone.tel}`} className="text-lg hover:text-olive transition-colors">
                    {business.phone.display}
                  </a>
                </div>
                <Button as="a" href={waHref} variant="primary" external>שלחו הודעה ב-WhatsApp</Button>
              </div>
            </Card>

            <Card padding="lg" className="bg-cream-2">
              <div className="text-xs uppercase tracking-[0.25em] text-olive mb-2">שעות פתיחה</div>
              <ul className="text-espresso space-y-1">
                {business.hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-4">
                    <span>{h.label.he}</span>
                    <span className="text-espresso-soft">
                      {h.open && h.close ? `${h.open}–${h.close}` : "סגור"}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            {reviews ? (
              <Card padding="lg" className="bg-cream-2">
                <div className="text-xs uppercase tracking-[0.25em] text-olive mb-2">ביקורות</div>
                <a href={reviews} target="_blank" rel="noopener noreferrer" className="text-olive hover:text-espresso">
                  לקריאת הביקורות שלנו ב-Google ←
                </a>
              </Card>
            ) : null}
          </div>
        </div>

        <div>
          <div className="aspect-square rounded-card overflow-hidden border border-stroke bg-cream-2">
            {business.geo.latitude && business.geo.longitude ? (
              <iframe
                title={`מפה — ${business.name.he}`}
                src={`https://www.google.com/maps?q=${business.geo.latitude},${business.geo.longitude}&hl=he&z=16&output=embed`}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-espresso-soft text-sm">
                [TODO: קואורדינטות ל-Google Maps ב-/content/business.ts]
              </div>
            )}
          </div>
          <p className="mt-4 text-sm text-espresso-soft">
            לחיצה על המפה תפתח את Google Maps עם מסלול לקפה הכרם.
          </p>
        </div>
      </section>

      <section className="bg-cream-2 py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16">
          <FAQBlock items={contactFAQs} />
          <FAQSchema items={contactFAQs} />
          <FactualParagraph focus="ניתן ליצור קשר עם קפה הכרם בטלפון, בוואטסאפ, או בהגעה ישירה לרחוב הכרמל 20 בגני תקווה." />
          <div className="mt-10 text-center text-sm text-espresso-soft">
            <Link href="/menu" className="text-olive hover:text-espresso">לתפריט</Link>{" · "}
            <Link href="/jachnun" className="text-olive hover:text-espresso">ג'חנון</Link>{" · "}
            <Link href="/catering" className="text-olive hover:text-espresso">מגשי אירוח</Link>{" · "}
            <Link href="/about" className="text-olive hover:text-espresso">עלינו</Link>
          </div>
        </div>
      </section>
    </>
  );
}
