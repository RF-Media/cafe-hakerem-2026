export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { CafeImage } from "@/components/ui/CafeImage";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { Section, container } from "@/components/ui/Section";
import { IconArrow, IconClock, IconPhone, IconPin } from "@/components/ui/icons";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { HoursList } from "@/components/sections/HoursList";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { business } from "@/content/business";
import { contactFAQs } from "@/content/faqs";

export const metadata: Metadata = {
  title: "צור קשר, שעות וכתובת | קפה הכרם - בית קפה בגני תקווה",
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

      <Breadcrumb items={[{ name: "צור קשר" }]} />

      <section className="relative flex items-center min-h-[70svh] md:min-h-[78svh]">
        <div className={`${container} w-full grid lg:grid-cols-2 gap-10 lg:gap-14`}>
        <div>
          <div className="hero-fade" style={{ ["--d" as never]: 0 }}>
            <Eyebrow withRule>Visit</Eyebrow>
          </div>
          <h1 className="mt-5 type-display text-[2.75rem] leading-[1.03] md:text-7xl lg:text-8xl text-espresso">
            <SplitText text="איך מגיעים לקפה הכרם" delay={70} />
          </h1>

          <Stagger className="mt-9 space-y-5" stagger={0.09}>
            <StaggerItem variant="tile">
              <Card padding="lg" tone="cream-3" elevation="raised">
                <Eyebrow tone="brass-ink">
                  <IconPin className="w-4 h-4" />
                  כתובת
                </Eyebrow>
                <address className="mt-3 not-italic text-espresso leading-relaxed">
                  <div className="type-sub text-xl">{business.address.street.he}</div>
                  <div className="text-espresso-soft">
                    {business.address.neighborhood.he}, {business.address.city.he}
                  </div>
                </address>
              </Card>
            </StaggerItem>

            <StaggerItem variant="tile">
              <Card padding="lg" tone="cream-3" elevation="raised">
                <Eyebrow tone="brass-ink">
                  <IconPhone className="w-4 h-4" />
                  טלפון ו-WhatsApp
                </Eyebrow>
                <div className="mt-3 space-y-4 text-espresso">
                  <div>
                    <a href={`tel:${business.phone.tel}`} className="text-lg hover:text-olive transition-colors">
                      {business.phone.display}
                    </a>
                  </div>
                  <Button as="a" href={waHref} variant="primary" external icon={<IconArrow />}>
                    שלחו הודעה ב-WhatsApp
                  </Button>
                </div>
              </Card>
            </StaggerItem>

            <StaggerItem variant="tile">
              <Card padding="lg" tone="cream-3" elevation="raised">
                <Eyebrow tone="brass-ink">
                  <IconClock className="w-4 h-4" />
                  שעות פתיחה
                </Eyebrow>
                <div className="mt-3">
                  <HoursList />
                </div>
              </Card>
            </StaggerItem>

            {reviews ? (
              <StaggerItem variant="tile">
                <Card padding="lg" tone="cream-3" elevation="raised">
                  <Eyebrow tone="brass-ink">ביקורות</Eyebrow>
                  <a
                    href={reviews}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link mt-3 inline-flex items-center gap-2 text-olive hover:text-espresso transition-colors"
                  >
                    לקריאת הביקורות שלנו ב-Google
                    <IconArrow className="w-4 h-4 transition-transform duration-fast group-hover/link:-translate-x-1" />
                  </a>
                </Card>
              </StaggerItem>
            ) : null}
          </Stagger>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <ImageReveal className="rounded-card border border-stroke bg-cream-2 aspect-square">
            {business.geo.latitude && business.geo.longitude ? (
              <iframe
                title={`מפה - ${business.name.he}`}
                src={`https://www.google.com/maps?q=${business.geo.latitude},${business.geo.longitude}&hl=he&z=16&output=embed`}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full relative">
                <CafeImage
                  variant="map"
                  alt={`מפת ההגעה ל${business.name.he}`}
                  ratio="aspect-square"
                  tone="olive"
                />
                {/* Fallback only — `business.geo` is populated, so the map
                    above renders. This branch survives in case the
                    coordinates are ever blanked rather than corrected. */}
                <span className="absolute inset-x-0 bottom-4 text-center text-xs text-espresso-soft px-4">
                  {business.address.street.he}, {business.address.neighborhood.he},{" "}
                  {business.address.city.he}
                </span>
              </div>
            )}
          </ImageReveal>
          <p className="mt-4 text-sm text-espresso-soft">
            לחיצה על המפה תפתח את Google Maps עם מסלול לקפה הכרם.
          </p>
        </div>
        </div>
      </section>

      <Section tone="cream-2">
        <FAQBlock items={contactFAQs} />
        <FAQSchema items={contactFAQs} />
        <FactualParagraph focus="ניתן ליצור קשר עם קפה הכרם בטלפון, בוואטסאפ, או בהגעה ישירה לרחוב הכרמל 20 בגני תקווה." />
        <div className="mt-10 text-center text-sm text-espresso-soft">
          <Link href="/menu" className="text-olive hover:text-espresso">לתפריט</Link>{" · "}
          <Link href="/jachnun" className="text-olive hover:text-espresso">ג'חנון</Link>{" · "}
          <Link href="/catering" className="text-olive hover:text-espresso">מגשי אירוח</Link>{" · "}
          <Link href="/about" className="text-olive hover:text-espresso">עלינו</Link>
        </div>
      </Section>
    </>
  );
}
