export const dynamic = "force-static";
export const revalidate = 86400;

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CafeImage } from "@/components/ui/CafeImage";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { IconArrow, IconPhone, IconWhatsapp } from "@/components/ui/icons";
import { Section, container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { CateringPlanner, InquiryFlip, TrayPick } from "@/components/sections/CateringPlanner";
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
        // Service, not Product: a Product without a price is an invalid
        // "Product snippets" item in Search Console, and trays are priced on request.
        itemOffered: { "@type": "Service", name: o.title.he, description: o.includes.join(", ") },
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
        <Button as="a" href="#trays" variant="primary" size="lg" icon={<IconArrow />}>
          {catering.hero.cta}
        </Button>
      </PageHero>

      {/* Call band: most catering is closed on the phone, so the number comes
          before the catalogue. Pine, the café's own ground for reaching it. */}
      <section className="bg-olive text-cream" data-track-area="catering_call" aria-labelledby="call-heading">
        <div className={`${container} grid items-center gap-8 py-12 md:py-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16`}>
          <Reveal>
            <Eyebrow tone="cream" withRule>{catering.call.eyebrow}</Eyebrow>
            <h2 id="call-heading" className="mt-3 type-statement text-3xl md:text-5xl">{catering.call.title}</h2>
            <p className="mt-3 max-w-prose-he type-lede text-base text-cream md:text-lg">{catering.call.body}</p>
          </Reveal>
          <Reveal delay={0.08} className="flex flex-col items-stretch gap-3 sm:items-start lg:items-end">
            <a
              href={`tel:${business.phone.tel}`}
              aria-label={`${catering.call.callLabel}: ${business.phone.display}`}
              className="group flex min-h-[72px] items-center gap-4 rounded-pill bg-cream py-3 pe-8 ps-3 text-espresso shadow-lg
                         transition-[transform,background-color] duration-fast ease-out-soft hover:scale-[1.02] hover:bg-cream-3
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2
                         focus-visible:ring-offset-olive"
            >
              <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-olive text-cream md:h-14 md:w-14">
                <IconPhone className="h-6 w-6" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm text-espresso-soft">{catering.call.callLabel}</span>
                <span dir="ltr" className="type-statement text-3xl leading-none tabular-nums md:text-4xl">
                  {business.phone.display}
                </span>
              </span>
            </a>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-base sm:ps-3 lg:justify-end lg:pe-3 lg:ps-0">
              <a
                href={`https://wa.me/${business.whatsapp.number}?text=${encodeURIComponent(catering.call.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 font-medium text-cream underline-offset-4 hover:underline"
              >
                <IconWhatsapp className="h-5 w-5" />
                {catering.call.whatsapp}
              </a>
              <a href="#inquiry" className="inline-flex min-h-[44px] items-center text-cream underline underline-offset-4 hover:text-cream-2">
                {catering.call.formLink}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trays: the page's main event. Picks on the cards feed the inquiry,
          and the card under them turns over into the form (CateringPlanner). */}
      <Section id="trays" tone="cream-2">
        <CateringPlanner>
          <SectionHeading eyebrow={catering.planner.eyebrow} title={catering.planner.title} description={catering.planner.description} />
          <Stagger className="grid gap-6 md:grid-cols-3" stagger={0.08}>
            {catering.options.map((o) => (
              <StaggerItem key={o.id} id={o.id} variant="tile" className="scroll-mt-28">
                <article
                  className="group flex h-full flex-col overflow-hidden rounded-card bg-cream-3 shadow-sm ring-olive
                             transition-[transform,box-shadow] duration-base ease-out-soft hover:-translate-y-1 hover:shadow-lg
                             has-[[aria-pressed=true]]:ring-2"
                >
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
                      <span className="absolute end-3 top-3 rounded-pill bg-olive px-3 py-1.5 text-sm font-medium text-cream">
                        {catering.planner.popular}
                      </span>
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
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-stroke pt-4">
                      {o.fromPrice ? (
                        <span className="type-sub text-xl text-brass-ink">{o.fromPrice}</span>
                      ) : (
                        <span className="text-base text-espresso-soft">{catering.planner.noPrice}</span>
                      )}
                      <TrayPick id={o.id} title={o.title.he} />
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mx-auto mt-12 max-w-5xl md:mt-14">
            <InquiryFlip
              front={
                <>
                  <div className="relative overflow-hidden rounded-t-card bg-sage px-5 py-5 sm:px-6 lg:px-8">
                    <Eyebrow tone="olive" withRule>{catering.planner.front.eyebrow}</Eyebrow>
                    <h3 tabIndex={-1} data-flip-focus className="mt-2 type-title text-2xl text-espresso focus:outline-none md:text-3xl">
                      {catering.planner.front.title}
                    </h3>
                  </div>
                  <dl className="grid gap-x-8 gap-y-5 px-5 py-6 text-base text-espresso sm:px-6 md:grid-cols-2 lg:px-8">
                    {(["leadTime", "payment", "cancellation", "minimumOrder"] as const).map((k) => (
                      <div key={k} className="border-t border-espresso/20 pt-3">
                        <dt className="font-medium">{catering.planner.front.rows[k]}</dt>
                        <dd className="mt-1 text-espresso-soft">{catering.fineprint[k]}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              }
            />
          </div>
        </CateringPlanner>
      </Section>

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

      {/* Promises: how it works, just above the questions. */}
      <Section tone="sage" spacing="sm">
        <SectionHeading as="h2" eyebrow={catering.promisesHeading.eyebrow} title={catering.promisesHeading.title} />
        <Stagger className="grid gap-8 md:grid-cols-3" stagger={0.09}>
          {catering.promises.map((p, i) => (
            <StaggerItem key={p.title} className="border-t-2 border-olive/40 pt-4">
              <span aria-hidden className="type-statement text-3xl text-brass-ink tabular-nums">{i + 1}</span>
              <h3 className="mt-2 type-sub text-xl text-espresso">{p.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-espresso-soft">{p.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
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
