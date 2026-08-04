export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { IconArrow } from "@/components/ui/icons";
import { Card } from "@/components/ui/Card";
import { CafeImage } from "@/components/ui/CafeImage";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { Section, container } from "@/components/ui/Section";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { formatILS } from "@/lib/money";
import { jachnun, jachnunPricing } from "@/content/jachnun";
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
      // Schema.org wants a bare number. This used to be handed the display
      // string "₪38 ליחידה", which Google rejects outright.
      price: (jachnunPricing.unitAgorot / 100).toFixed(2),
      url: `${business.siteUrl}/jachnun`,
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export default function JachnunPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: "ג'חנון", href: "/jachnun" }]} />
      <JsonLd data={productSchema()} />

      <Breadcrumb items={[{ name: "ג'חנון" }]} />

      {/* Sub-brand hero — terracotta accents */}
      <section className="relative bg-cream-2 overflow-hidden pt-12 md:pt-20 pb-16 md:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -end-32 w-[34rem] h-[34rem] rounded-full
                     bg-[radial-gradient(circle,hsl(var(--jachnun)/0.12),transparent_65%)] blur-2xl"
        />
        <div className={`${container} grid lg:grid-cols-12 gap-10 lg:gap-14 items-end`}>
          <div className="lg:col-span-7">
            <div className="hero-fade" style={{ ["--d" as never]: 0 }}>
              <Eyebrow tone="jachnun" withRule>{jachnun.hero.eyebrow}</Eyebrow>
            </div>
            <h1 className="mt-4 type-display text-4xl md:text-6xl text-espresso">
              <SplitText text={jachnun.hero.title} delay={70} />
            </h1>
            <p
              className="hero-fade mt-6 type-lede text-base md:text-xl text-espresso-soft max-w-prose-he"
              style={{ ["--d" as never]: 380 }}
            >
              {jachnun.hero.lede}
            </p>
            <div
              className="hero-fade mt-6 inline-flex items-center gap-2 rounded-pill border border-jachnun/30
                         bg-jachnun/5 px-4 py-2 text-sm text-jachnun"
              style={{ ["--d" as never]: 500 }}
            >
              {jachnun.pricing.perUnit}
              {jachnun.pricing.bundleNote ? ` · ${jachnun.pricing.bundleNote}` : ""}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Parallax speed={0.14}>
              <ImageReveal className="rounded-card">
                <CafeImage
                  variant="jachnun"
                  alt="ג'חנון של שבת מקפה הכרם, מוגש עם ביצה קשה ורסק עגבניות"
                  ratio="aspect-[4/5]"
                  tone="jachnun"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </ImageReveal>
            </Parallax>
          </div>
        </div>
      </section>

      {/* Three reasons */}
      <Section>
        <Stagger className="grid md:grid-cols-3 gap-5 md:gap-6" stagger={0.1}>
          {jachnun.threeReasons.map((r, i) => (
            <StaggerItem key={i} variant="tile">
              <Card padding="lg" tone="cream-3" hoverable className="group h-full">
                <span className="type-index text-jachnun-soft">
                  № 0{i + 1}
                </span>
                <div className="mt-3 type-sub text-xl text-espresso">{r.title}</div>
                <p className="mt-2 text-base text-espresso-soft leading-relaxed">{r.body}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Order form + what's included */}
      <Section tone="cream-2">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Reveal>
              <Eyebrow tone="jachnun" withRule>מה כלול</Eyebrow>
            </Reveal>
            <Stagger as="ul" className="space-y-2.5 text-base text-espresso-soft" stagger={0.06}>
              {jachnun.whatsIncluded.map((i, idx) => (
                <StaggerItem key={idx} as="li" className="flex gap-3">
                  <span aria-hidden className="text-jachnun pt-1 text-xs">◆</span>
                  <span>{i}</span>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.12}>
              <Card padding="md" tone="cream-3" elevation="raised">
                <div className="type-sub text-lg text-espresso mb-3">
                  {jachnun.reassurance.title}
                </div>
                <ol className="space-y-2 text-sm text-espresso-soft list-decimal pe-5">
                  {jachnun.reassurance.steps.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ol>
              </Card>
            </Reveal>
          </div>

          <div className="lg:col-span-3">
            {/* The order panel follows the reading column on desktop — the
                left rail is short, so pinning keeps the CTA in reach through
                the whole section. */}
            <div className="lg:sticky lg:top-28">
              <Card padding="lg" tone="cream-3" elevation="floating">
                <h2 className="type-title text-2xl text-espresso">להזמנה</h2>
                <p className="mt-3 text-base text-espresso-soft">
                  בוחרים כמות ותוספות, חלון איסוף ואמצעי תשלום. ההזמנה מאושרת מיד במסך.
                </p>

                <div className="mt-6 flex items-baseline gap-3">
                  <span className="type-display text-4xl text-espresso tabular-nums">
                    {formatILS(jachnunPricing.unitAgorot)}
                  </span>
                  <span className="text-sm text-espresso-soft">ליחידה</span>
                </div>
                <p className="mt-1 text-sm text-jachnun">{jachnun.pricing.bundleNote}</p>

                <ol className="mt-6 space-y-2.5 text-sm text-espresso-soft">
                  {jachnun.reassurance.steps.map((s, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span aria-hidden className="type-index text-brass-ink pt-1">
                        {idx + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-8">
                  <Button
                    as="a"
                    href="/jachnun/order"
                    variant="primary"
                    size="xl"
                    className="w-full"
                    icon={<IconArrow />}
                  >
                    {jachnun.cta.label}
                  </Button>
                  <p className="mt-3 text-center text-xs text-espresso-soft">
                    {jachnun.cta.supporting}
                  </p>
                </div>

                {/*
                  The checkout is a five-step client flow and cannot work
                  without JavaScript. Rather than ship a form that silently
                  fails, the no-JS path is the one the café has always had —
                  the phone. CLAUDE.md §12 asks that every page stay usable
                  without JS; usable, not identical.
                */}
                <noscript>
                  <div className="mt-6 rounded-card border border-stroke bg-cream-2 px-5 py-4 text-sm text-espresso-soft">
                    טופס ההזמנה דורש JavaScript. אפשר להזמין ג&apos;חנון מקפה הכרם גם בטלפון:{" "}
                    <a
                      href={`tel:${business.phone.tel}`}
                      className="text-olive underline underline-offset-4"
                    >
                      {business.phone.display}
                    </a>
                    .
                  </div>
                </noscript>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <FAQBlock items={jachnunFAQs} />
        <FAQSchema items={jachnunFAQs} />
        <FactualParagraph focus="קפה הכרם אופה ג'חנון תימני להזמנה מראש ומציע איסוף בשבת בבוקר. ניתן להזמין דרך האתר עד יום חמישי בשעה 18:00." />
        <div className="mt-10 text-center text-sm text-espresso-soft">
          רוצים לראות עוד? <Link href="/menu" className="text-olive hover:text-espresso">לתפריט המלא</Link>{" · "}
          <Link href="/catering" className="text-olive hover:text-espresso">מגשי אירוח</Link>{" · "}
          <Link href="/about" className="text-olive hover:text-espresso">הסיפור שלנו</Link>
        </div>
      </Section>
    </>
  );
}
