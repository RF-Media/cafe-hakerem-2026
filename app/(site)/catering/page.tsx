export const dynamic = "force-static";
export const revalidate = 86400;

import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CafeImage } from "@/components/ui/CafeImage";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { IconArrow } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { CateringInquiryForm } from "@/components/sections/CateringInquiryForm";
import { PageHero } from "@/components/sections/PageHero";
import { catering } from "@/content/catering";
import { cateringFAQs } from "@/content/faqs";
import { business } from "@/content/business";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("catering");

function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Catering",
    name: "מגשי אירוח - קפה הכרם",
    url: `${business.siteUrl}/catering`,
    image: `${business.siteUrl}${catering.hero.image}`,
    provider: { "@id": `${business.siteUrl}/#cafe` },
    areaServed: { "@type": "Place", name: `${business.address.city.he} והסביבה` },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "מגשי אירוח",
      itemListElement: catering.options.map((o) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Product", name: o.title.he, description: o.includes.join(", ") },
      })),
    },
  };
}

export default function CateringPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: "מגשי אירוח", href: "/catering" }]} />
      <JsonLd data={serviceSchema()} />

      <PageHero
        tone="sage"
        crumbs={[{ name: "מגשי אירוח" }]}
        kicker={catering.hero.kicker}
        title={catering.hero.title}
        lede={catering.hero.lede}
        image={catering.hero.image}
        imageAlt={catering.hero.imageAlt}
        imagePosition="50% 70%"
      >
        <Button as="a" href="#inquiry" variant="primary" size="lg" icon={<IconArrow />}>
          {catering.hero.cta}
        </Button>
      </PageHero>

      {/* Promises */}
      <section className="bg-olive text-cream">
        <Stagger className="mx-auto grid max-w-container gap-8 px-6 py-12 md:grid-cols-3 md:px-10 lg:px-16" stagger={0.09}>
          {catering.promises.map((p, i) => (
            <StaggerItem key={p.title} className="border-t-2 border-brass/60 pt-4">
              <span aria-hidden className="type-statement text-3xl text-brass tabular-nums">{i + 1}</span>
              <h2 className="mt-2 type-sub text-xl">{p.title}</h2>
              <p className="mt-2 text-base leading-relaxed text-cream/85">{p.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Occasions */}
      <Section tone="cream">
        <SectionHeading eyebrow={catering.occasions.eyebrow} title={catering.occasions.title} />
        <Stagger className="grid gap-8 md:grid-cols-3 md:gap-6" stagger={0.08}>
          {catering.occasions.items.map((o) => (
            <StaggerItem key={o.title} variant="tile">
              <article className="group">
                <div className="zoom-frame rounded-card">
                  <CafeImage variant="tray" src={o.image} alt={o.alt} ratio="aspect-[4/3]" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <h3 className="mt-5 type-sub text-2xl text-espresso">{o.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-espresso-soft md:text-lg">{o.body}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Options */}
      <Section tone="sage">
        <SectionHeading eyebrow="המגשים" title="סוגי מגשים" />
        <Stagger className="grid gap-6 md:grid-cols-3" stagger={0.08}>
          {catering.options.map((o) => (
            <StaggerItem key={o.id} id={o.id} variant="tile" className="scroll-mt-28">
              <article className="group flex h-full flex-col overflow-hidden rounded-card bg-cream-3 shadow-sm transition-[transform,box-shadow] duration-base ease-out-soft hover:-translate-y-1 hover:shadow-lg">
                <div className="zoom-frame relative">
                  <CafeImage
                    variant="tray"
                    src={o.photo}
                    alt={`${o.title.he} - מגש אירוח של קפה הכרם`}
                    ratio="aspect-video"
                    className="!rounded-none"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {o.popular ? (
                    <span className="absolute end-3 top-3 rounded-pill bg-olive px-3 py-1.5 text-sm font-medium text-cream">מומלץ</span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="type-sub text-2xl text-espresso">{o.title.he}</h3>
                  <p className="mt-1 text-base font-medium text-olive">{o.serves}</p>
                  <ul className="mt-4 flex-1 space-y-1.5 text-base text-espresso-soft">
                    {o.includes.map((it) => (
                      <li key={it} className="flex gap-2">
                        <span aria-hidden className="text-brass-ink">·</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-baseline justify-between border-t border-stroke pt-4">
                    {o.fromPrice ? (
                      <span className="type-sub text-xl text-brass-ink">{o.fromPrice}</span>
                    ) : (
                      <span className="text-base text-espresso-soft">מחיר לפי בקשה</span>
                    )}
                    <a href="#inquiry" className="link-draw text-sm font-medium text-olive">לפנייה</a>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Stagger as="dl" className="mt-12 grid max-w-4xl gap-x-8 gap-y-5 text-base text-espresso md:grid-cols-2" stagger={0.07}>
          {[
            { t: "זמן הזמנה מוקדם", d: catering.fineprint.leadTime },
            { t: "תשלום", d: catering.fineprint.payment },
            { t: "ביטולים", d: catering.fineprint.cancellation },
            { t: "סכום מינימום", d: catering.fineprint.minimumOrder },
          ].map((row) => (
            <StaggerItem key={row.t} className="border-t border-espresso/25 pt-3">
              <dt className="font-medium">{row.t}</dt>
              <dd className="mt-1">{row.d}</dd>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Inquiry form.
          The narrow column is its own nested element: putting `max-w-3xl`
          alongside the container's `max-w-container` left two competing
          max-widths on one node, decided only by CSS source order. */}
      <Section id="inquiry" tone="cream-2" className="scroll-mt-16">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow tone="olive" withRule>טופס פנייה</Eyebrow>
            <h2 className="mt-4 type-statement text-4xl md:text-6xl text-espresso">בואו נדבר</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-3 type-lede text-base md:text-lg text-espresso-soft">
              {catering.formIntro}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-8">
              <Card padding="lg" tone="cream-3" elevation="floating">
                <CateringInquiryForm />
              </Card>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <FAQBlock items={cateringFAQs} heading="שאלות על מגשי האירוח" />
        <FAQSchema items={cateringFAQs} />
        <FactualParagraph focus="קפה הכרם מספק מגשי אירוח לאירועים פרטיים ועסקיים באזור גני תקווה, באיסוף מהמקום או במשלוח." />
        <div className="mt-10 text-center text-sm text-espresso-soft">
          <Link href="/menu" className="text-olive hover:text-espresso">לתפריט</Link>{" · "}
          <Link href="/jachnun" className="text-olive hover:text-espresso">ג'חנון של שבת</Link>{" · "}
          <Link href="/contact" className="text-olive hover:text-espresso">פרטי הקפה</Link>
        </div>
      </Section>
    </>
  );
}
