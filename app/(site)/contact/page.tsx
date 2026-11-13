export const dynamic = "force-static";
export const revalidate = 86400;

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { Section } from "@/components/ui/Section";
import { IconArrow, IconClock, IconPhone, IconPin, IconWhatsapp } from "@/components/ui/icons";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { HoursList } from "@/components/sections/HoursList";
import { MapFacade } from "@/components/sections/MapFacade";
import { OpenStatusBadge } from "@/components/sections/OpenStatusBadge";
import { PageHero } from "@/components/sections/PageHero";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { business } from "@/content/business";
import { contactFAQs } from "@/content/faqs";
import { homeVisit } from "@/content/home";
import { pageMetadata } from "@/lib/seo";
import { ev } from "@/lib/analytics";

export const metadata = pageMetadata("contact");

function contactSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${business.siteUrl}/contact`,
    inLanguage: "he",
    about: { "@id": `${business.siteUrl}/#cafe` },
    isPartOf: { "@id": `${business.siteUrl}/#website` },
  };
}

const cardTitle = "flex items-center gap-2 type-index text-brass-ink";

export default function ContactPage() {
  const waHref = `https://wa.me/${business.whatsapp.number}?text=${encodeURIComponent(business.whatsapp.prefilledMessage)}`;

  return (
    <>
      <BreadcrumbSchema trail={[{ name: "צור קשר", href: "/contact" }]} />
      <JsonLd data={contactSchema()} />

      <PageHero
        tone="pine"
        crumbs={[{ name: "צור קשר" }]}
        kicker="קפה הכרם, רחוב הכרמל 20, גני תקווה"
        title="איך מגיעים לקפה הכרם"
        lede={homeVisit.body}
        image="/images/storefront_shared.jpg"
        imageAlt="חזית קפה הכרם ברחוב הכרמל 20, שלט הקפה מעל הדלפק"
        imagePosition="50% 12%"
      >
        {/* Height reserved: the status is computed after mount (see OpenStatusBadge),
            and appearing late would otherwise push the buttons down. */}
        <div className="mb-5 min-h-[21px]">
          <OpenStatusBadge />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button as="a" href={`tel:${business.phone.tel}`} variant="onDark" size="lg" icon={<IconPhone className="h-5 w-5" />} iconPosition="start">
            {business.phone.display}
          </Button>
          <Button as="a" href={business.socials.waze} external variant="onDarkGhost" size="lg" icon={<IconPin className="h-5 w-5" />} iconPosition="start">
            נווטו אלינו
          </Button>
        </div>
      </PageHero>

      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:self-start" stagger={0.08}>
            <StaggerItem variant="tile">
              <div className="h-full rounded-card border border-espresso/15 bg-cream-3 p-6">
                <h2 className={cardTitle}>
                  <IconPin className="h-4 w-4" />
                  כתובת
                </h2>
                <address className="mt-3 not-italic leading-relaxed text-espresso">
                  <div className="type-sub text-xl">{business.address.street.he}</div>
                  <div className="text-espresso-soft">
                    {business.address.neighborhood.he}, {business.address.city.he}
                  </div>
                </address>
                <Link href="/map" className="link-draw mt-3 inline-block text-sm font-medium text-olive">
                  {homeVisit.maps}
                </Link>
              </div>
            </StaggerItem>

            <StaggerItem variant="tile">
              <div className="h-full rounded-card border border-espresso/15 bg-cream-3 p-6">
                <h2 className={cardTitle}>
                  <IconPhone className="h-4 w-4" />
                  טלפון ו-WhatsApp
                </h2>
                <a href={`tel:${business.phone.tel}`} className="mt-3 block type-sub text-xl tabular-nums text-espresso transition-colors hover:text-olive">
                  {business.phone.display}
                </a>
                <a href={`mailto:${business.email.public}`} className="link-draw mt-1 inline-block text-sm text-espresso-soft" dir="ltr">
                  {business.email.public}
                </a>
                <div className="mt-4">
                  <Button as="a" href={waHref} variant="primary" size="sm" external icon={<IconWhatsapp className="h-4 w-4" />} iconPosition="start">
                    שלחו הודעה
                  </Button>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem variant="tile" className="sm:col-span-2">
              <div className="rounded-card border border-espresso/15 bg-cream-3 p-6">
                <h2 className={cardTitle}>
                  <IconClock className="h-4 w-4" />
                  שעות פתיחה
                </h2>
                <div className="mt-3">
                  <HoursList />
                </div>
                <p className="mt-3 text-xs text-espresso-soft">{business.hoursFootnote}</p>
              </div>
            </StaggerItem>

            <StaggerItem variant="tile" className="sm:col-span-2">
              <a
                href={business.socials.google}
                {...ev("reviews_click")}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-card bg-olive p-6 text-cream transition-transform duration-fast ease-out-soft hover:-translate-y-0.5"
              >
                <span className="type-sub text-xl">הביקורות של קפה הכרם ב-Google</span>
                <IconArrow className="h-5 w-5 shrink-0 transition-transform duration-fast group-hover:-translate-x-1" />
              </a>
            </StaggerItem>
          </Stagger>

          <div className="lg:sticky lg:top-[calc(var(--nav-h)+24px)] lg:self-start">
            <Reveal distance={32}>
              <div className="aspect-square md:aspect-[4/3] lg:aspect-square">
                <MapFacade label="הצגת המפה" imageAlt="חזית קפה הכרם ברחוב הכרמל 20, גני תקווה" />
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="cream-2">
        <FAQBlock items={contactFAQs} heading="שאלות על ההגעה והיצירת קשר" />
        <FAQSchema items={contactFAQs} />
        <FactualParagraph focus="ניתן ליצור קשר עם קפה הכרם בטלפון, בוואטסאפ, או בהגעה ישירה לרחוב הכרמל 20 בגני תקווה." />
        <div className="mt-10 text-center text-sm text-espresso-soft">
          <Link href="/menu" className="text-olive hover:text-espresso">לתפריט</Link>{" · "}
          <Link href="/jachnun" className="text-olive hover:text-espresso">ג'חנון</Link>{" · "}
          <Link href="/catering" className="text-olive hover:text-espresso">מגשי אירוח</Link>{" · "}
          <Link href="/coffee-club" className="text-olive hover:text-espresso">מועדון</Link>{" · "}
          <Link href="/about" className="text-olive hover:text-espresso">הסיפור שלנו</Link>
        </div>
      </Section>
    </>
  );
}
