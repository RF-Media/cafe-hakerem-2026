export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { CafeImage } from "@/components/ui/CafeImage";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { Section, container } from "@/components/ui/Section";
import { HorizontalRail } from "@/components/motion/HorizontalRail";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { CateringInquiryForm } from "@/components/sections/CateringInquiryForm";
import { catering } from "@/content/catering";
import { cateringFAQs } from "@/content/faqs";
import { business } from "@/content/business";

export const metadata: Metadata = {
  title: "מגשי אירוח להזמנה | קפה הכרם - גני תקווה",
  description:
    "מגשי אירוח של קפה הכרם - מגשי בוקר, כריכים ומתוקים לישיבות עבודה, אירועים משפחתיים וברית באזור גני תקווה. הזמנה דרך טופס הפנייה.",
};

function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Catering",
    name: "מגשי אירוח - קפה הכרם",
    provider: { "@id": `${business.siteUrl}/#cafe` },
    areaServed: { "@type": "Place", name: `${business.address.city.he} והסביבה` },
  };
}

export default function CateringPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: "מגשי אירוח", href: "/catering" }]} />
      <JsonLd data={serviceSchema()} />

      <Breadcrumb items={[{ name: "מגשי אירוח" }]} />

      <section className="relative flex items-center min-h-[70svh] md:min-h-[78svh]">
        <div className={`${container} w-full grid lg:grid-cols-12 gap-10 items-center`}>
          <div className="lg:col-span-7">
            <div className="hero-fade" style={{ ["--d" as never]: 0 }}>
              <Eyebrow withRule>{catering.hero.eyebrow}</Eyebrow>
            </div>
            <h1 className="mt-5 type-display text-[2.75rem] leading-[1.03] md:text-7xl lg:text-8xl text-espresso">
              <SplitText text={catering.hero.title} delay={70} />
            </h1>
            <p
              className="hero-fade mt-6 max-w-prose-he type-lede text-base md:text-xl text-espresso-soft"
              style={{ ["--d" as never]: 380 }}
            >
              {catering.hero.lede}
            </p>
          </div>
          <div className="lg:col-span-5 hero-fade" style={{ ["--d" as never]: 520 }}>
            <CafeImage
              variant="tray"
              alt="מגש אירוח של קפה הכרם - כריכים, מאפים וסלטים"
              ratio="aspect-[5/3]"
              tone="olive"
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </section>

      {/* Promises */}
      <Section tone="cream-2" spacing="sm">
        <Stagger className="grid md:grid-cols-3 gap-5 md:gap-6" stagger={0.09}>
          {catering.promises.map((p, i) => (
            <StaggerItem key={i} variant="tile">
              <Card padding="lg" tone="cream-3" className="h-full">
                <span aria-hidden className="block h-px w-8 bg-brass-ink/45" />
                <div className="mt-4 type-sub text-xl text-espresso">{p.title}</div>
                <p className="mt-2 text-base text-espresso-soft leading-relaxed">{p.body}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Options — a rail on desktop, a swipe carousel on a phone. */}
      <section className="py-20 md:py-28">
        <div className={container}>
          <Reveal>
            <h2 className="type-title text-3xl md:text-4xl text-espresso mb-10">
              סוגי מגשים
            </h2>
          </Reveal>
        </div>

        <HorizontalRail length={2} trackClassName="gap-5 px-6 md:ps-10 lg:ps-16">
          {catering.options.map((o) => (
            <div
              key={o.id}
              id={o.id}
              className="shrink-0 snap-start scroll-mt-40 w-[80vw] sm:w-[55vw] md:w-[32vw] lg:w-[27vw]"
            >
              <Card padding="lg" tone="cream-3" hoverable elevation="raised" className="h-full">
                <CafeImage
                  variant="tray"
                  alt={`${o.title.he} - מגש אירוח של קפה הכרם`}
                  ratio="aspect-[5/3]"
                  tone="brass"
                  className="mb-5"
                  sizes="(max-width: 768px) 80vw, 27vw"
                />
                <div className="type-sub text-xl text-espresso">{o.title.he}</div>
                <div className="mt-1 text-sm text-olive">{o.serves}</div>
                <ul className="mt-4 space-y-1.5 text-base text-espresso-soft">
                  {o.includes.map((it, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden className="text-brass-ink">·</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                {o.fromPrice ? (
                  <div className="mt-5 pt-4 border-t border-stroke text-sm font-medium text-espresso">
                    {o.fromPrice}
                  </div>
                ) : null}
              </Card>
            </div>
          ))}
        </HorizontalRail>

        <div className={`${container} mt-12`}>
          <Stagger
            as="dl"
            className="grid md:grid-cols-2 gap-x-8 gap-y-5 text-sm text-espresso-soft max-w-3xl"
            stagger={0.07}
          >
            {[
              { t: "זמן הזמנה מוקדם", d: catering.fineprint.leadTime },
              { t: "תשלום", d: catering.fineprint.payment },
              { t: "ביטולים", d: catering.fineprint.cancellation },
              { t: "סכום מינימום", d: catering.fineprint.minimumOrder },
            ].map((row) => (
              <StaggerItem key={row.t} className="border-t border-stroke pt-3">
                <dt className="font-medium text-espresso">{row.t}</dt>
                <dd className="mt-1">{row.d}</dd>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Inquiry form.
          The narrow column is its own nested element: putting `max-w-3xl`
          alongside the container's `max-w-container` left two competing
          max-widths on one node, decided only by CSS source order. */}
      <Section tone="cream-2">
        <div className="max-w-3xl">
          <Reveal>
            <h2 className="type-title text-3xl md:text-4xl text-espresso">בואו נדבר</h2>
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
        <FAQBlock items={cateringFAQs} />
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
