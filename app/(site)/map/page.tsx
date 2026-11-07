export const dynamic = "force-static";
export const revalidate = 86400;

import Link from "next/link";
import { NeighbourhoodMap } from "@/components/map/NeighbourhoodMap";
import { WeekHours } from "@/components/map/WeekHours";
import { SplitText } from "@/components/motion/SplitText";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { OpenStatusBadge } from "@/components/sections/OpenStatusBadge";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { Section } from "@/components/ui/Section";
import { IconArrow, IconPin } from "@/components/ui/icons";
import { business } from "@/content/business";
import { mapFAQs } from "@/content/faqs";
import { mapPage } from "@/content/map";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("map");

function mapSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${business.siteUrl}/map`,
    inLanguage: "he",
    about: { "@id": `${business.siteUrl}/#cafe` },
    isPartOf: { "@id": `${business.siteUrl}/#website` },
  };
}

const rowLabel = "type-index text-brass";

export default function MapPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: mapPage.crumb, href: "/map" }]} />
      <JsonLd data={mapSchema()} />

      {/* On a phone this stacks address, map, details, so the DOM keeps that
          order and the grid moves the map into its own column on desktop. The
          first column is the right one, since the page is RTL. */}
      <section className="bg-olive text-cream lg:grid lg:min-h-[calc(100svh-var(--nav-h))] lg:grid-cols-[minmax(390px,33%)_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
        <header className="px-6 pt-6 md:px-10 lg:col-start-1 lg:row-start-1 lg:pe-8 lg:ps-12 lg:pt-8">
          <Breadcrumb items={[{ name: mapPage.crumb }]} tone="dark" bare />
          <h1 className="type-display mt-5 lg:mt-10">
            <span className="hero-fade mb-4 block type-index text-brass" style={{ ["--d" as never]: 0 }}>
              {mapPage.kicker}
            </span>{" "}
            <span className="block text-[3.25rem] leading-[1.03] md:text-7xl">
              <SplitText text={mapPage.title} delay={70} />
            </span>
          </h1>
          <p className="hero-fade mt-3 type-lede text-xl text-cream/85 md:text-2xl" style={{ ["--d" as never]: 240 }}>
            {mapPage.landmark}
          </p>
          {/* Height reserved: the status is computed after mount. */}
          <div className="hero-fade mt-4 min-h-[21px]" style={{ ["--d" as never]: 340 }}>
            <OpenStatusBadge />
          </div>
        </header>

        <div className="mt-5 flex flex-col gap-3 px-3 md:px-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:py-5 lg:pe-5 lg:ps-0">
          <NeighbourhoodMap className="aspect-square sm:aspect-[16/11] lg:aspect-auto lg:min-h-[440px] lg:flex-1" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              as="a"
              href={business.socials.googleMaps}
              external
              variant="onDark"
              size="lg"
              className="sm:flex-1"
              icon={<IconArrow className="h-5 w-5" />}
            >
              {mapPage.openInMaps}
            </Button>
            <Button
              as="a"
              href={business.socials.waze}
              external
              variant="onDarkGhost"
              size="lg"
              icon={<IconPin className="h-5 w-5" />}
              iconPosition="start"
            >
              {mapPage.waze}
            </Button>
          </div>
        </div>

        <div className="px-6 pb-12 pt-9 md:px-10 lg:col-start-1 lg:row-start-2 lg:self-end lg:pb-6 lg:pe-8 lg:ps-12 lg:pt-8">
          <div className="border-t border-cream/20 py-5">
            <h2 className={`${rowLabel} mb-3`}>{mapPage.hoursTitle}</h2>
            <WeekHours />
          </div>
          <dl>
            <div className="border-t border-cream/20 py-4">
              <dt className={`${rowLabel} flex items-center gap-2`}>
                <span aria-hidden className="grid h-[18px] w-[18px] place-items-center rounded-full bg-cream text-[0.6875rem] font-bold leading-none tracking-normal text-olive">
                  P
                </span>
                {mapPage.parkingLabel}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed md:text-base">{mapPage.parking}</dd>
            </div>
            <div className="border-t border-cream/20 py-4">
              <dt className={rowLabel}>{mapPage.outsideLabel}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed md:text-base">{mapPage.outside}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-cream/20 pt-3">
              <dt className={rowLabel}>{mapPage.phoneLabel}</dt>
              <dd>
                <a
                  href={`tel:${business.phone.tel}`}
                  className="inline-flex min-h-[44px] items-center type-sub text-xl tabular-nums transition-colors duration-fast hover:text-brass"
                >
                  {business.phone.display}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <Section tone="cream">
        <FAQBlock items={mapFAQs} heading={mapPage.faqHeading} />
        <FAQSchema items={mapFAQs} />
        <FactualParagraph focus={mapPage.factual} />
        <div className="mt-10 text-center text-sm text-espresso-soft">
          <Link href="/menu" className="text-olive hover:text-espresso">לתפריט</Link>{" · "}
          <Link href="/jachnun" className="text-olive hover:text-espresso">ג'חנון</Link>{" · "}
          <Link href="/catering" className="text-olive hover:text-espresso">מגשי אירוח</Link>{" · "}
          <Link href="/contact" className="text-olive hover:text-espresso">צור קשר</Link>
        </div>
      </Section>
    </>
  );
}
