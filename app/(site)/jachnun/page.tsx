export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { IconArrow } from "@/components/ui/icons";
import { Card } from "@/components/ui/Card";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { Section, container } from "@/components/ui/Section";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { formatILS } from "@/lib/money";
import { jachnun, jachnunStartingPriceAgorot } from "@/content/jachnun";
import { jachnunFAQs } from "@/content/faqs";
import { business } from "@/content/business";

export const metadata: Metadata = {
  title: "ג'חנון של שבת להזמנה | קפה הכרם - גני תקווה",
  description:
    "ג'חנון תימני מסורתי להזמנה מראש בקפה הכרם, גני תקווה. אפייה לילה שלם, איסוף בשבת בבוקר. הזמנה דרך האתר עד יום חמישי 18:00.",
};

function productSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "ג'חנון של שבת - קפה הכרם",
    brand: { "@type": "Brand", name: business.name.he },
    description:
      "ג'חנון תימני מסורתי הנאפה במטבח של קפה הכרם בגני תקווה, להזמנה מראש ולאיסוף בשבת בבוקר.",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/PreOrder",
      priceCurrency: "ILS",
      // Schema.org wants a bare number. This used to be handed the display
      // string "₪38 ליחידה", which Google rejects outright.
      price: (jachnunStartingPriceAgorot / 100).toFixed(2),
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

      {/* Sub-brand hero — full-bleed photo behind cream text, same
          treatment as the home hero (§7 hard rule 1: the h1 reveal is CSS
          keyframes, never gated behind hydration). Terracotta accents
          throughout instead of the home hero's brass, per the jachnun
          sub-brand palette. */}
      <section className="relative isolate flex min-h-[70svh] md:min-h-[78svh] items-center overflow-hidden bg-espresso-deep">
        <Image
          src={jachnun.hero.image}
          alt={jachnun.hero.imageAlt}
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover"
        />

        <div aria-hidden className="absolute inset-0 bg-espresso-deep/35" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-espresso-deep via-espresso-deep/50 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-l from-espresso-deep/60 via-espresso-deep/15 to-transparent"
        />

        <Parallax speed={-0.35} className="pointer-events-none absolute inset-0">
          <div className="hero-grain" aria-hidden />
        </Parallax>

        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -end-32 w-[34rem] h-[34rem] rounded-full
                     bg-[radial-gradient(circle,hsl(var(--jachnun)/0.25),transparent_65%)] blur-2xl"
        />

        <div className={`${container} relative w-full py-16 md:py-20`}>
          <div className="max-w-2xl">
            <div className="hero-fade" style={{ ["--d" as never]: 0 }}>
              <Eyebrow tone="jachnun" withRule>{jachnun.hero.eyebrow}</Eyebrow>
            </div>
            <h1 className="mt-5 type-display text-[2.75rem] leading-[1.03] md:text-7xl lg:text-8xl text-cream">
              <SplitText text={jachnun.hero.title} delay={70} />
            </h1>
            <p
              className="hero-fade mt-6 type-lede text-base md:text-xl text-cream/85 max-w-prose-he"
              style={{ ["--d" as never]: 380 }}
            >
              {jachnun.hero.lede}
            </p>
            <div
              className="hero-fade mt-6 inline-flex items-center gap-2 rounded-pill border border-jachnun-soft/40
                         bg-cream/10 px-4 py-2 text-sm text-cream"
              style={{ ["--d" as never]: 500 }}
            >
              {jachnun.pricing.perUnit}
              {jachnun.pricing.bundleNote ? ` · ${jachnun.pricing.bundleNote}` : ""}
            </div>
            <div className="hero-fade mt-6" style={{ ["--d" as never]: 620 }}>
              <Button as="a" href="/jachnun/order" variant="onDark" size="lg" icon={<IconArrow />}>
                להזמנה
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Three reasons */}
      <Section>
        <Stagger className="grid md:grid-cols-3 gap-5 md:gap-6" stagger={0.1}>
          {jachnun.threeReasons.map((r, i) => (
            <StaggerItem key={i} variant="tile">
              <Card padding="lg" tone="cream-3" hoverable className="group h-full">
                <div className="type-sub text-xl text-espresso">{r.title}</div>
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
          </div>

          <div className="lg:col-span-3">
            {/* The order panel follows the reading column on desktop — the
                left rail is short, so pinning keeps the CTA in reach through
                the whole section. Terracotta fill (tone="jachnun") on
                purpose: this is the one card on the page whose entire job
                is to convert, so it gets the sub-brand's own colour instead
                of blending into the surrounding cream-3 cards. */}
            <div className="lg:sticky lg:top-28">
              <Card padding="lg" tone="jachnun" elevation="floating" className="relative overflow-hidden">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-24 -end-24 w-72 h-72 rounded-full
                             bg-[radial-gradient(circle,hsl(var(--cream)/0.12),transparent_65%)]"
                />
                <div className="relative">
                  <Eyebrow tone="cream" withRule>הזמנה מראש</Eyebrow>
                  <h2 className="mt-4 type-title text-2xl md:text-3xl text-cream">
                    להזמין ג&apos;חנון לשבת
                  </h2>
                  <p className="mt-3 text-base text-cream/80">
                    בוחרים חבילה ותוספות, מזמינים באתר ואוספים חם בשבת בבוקר.
                  </p>
                  <p className="mt-1.5 text-sm text-cream/60">
                    רוצים להיות בטוחים שיש? מומלץ להזמין מראש.
                  </p>

                  <div className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="type-display text-4xl md:text-5xl text-cream tabular-nums">
                      {formatILS(jachnunStartingPriceAgorot)}
                    </span>
                    <span className="text-sm text-cream/70">ליחידה</span>
                  </div>
                  <span className="mt-2 inline-flex items-center rounded-pill bg-cream/15 px-3 py-1 text-xs text-cream">
                    {jachnun.pricing.bundleNote}
                  </span>

                  <ul className="mt-7 space-y-2.5 border-t border-cream/15 pt-6 text-sm text-cream/85">
                    <li className="flex gap-2.5">
                      <span aria-hidden className="text-cream/50">✓</span>
                      <span>אישור הזמנה מיידי במסך</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span aria-hidden className="text-cream/50">✓</span>
                      <span>תשלום מאובטח - אשראי, Apple Pay, Google Pay או ביט</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span aria-hidden className="text-cream/50">✓</span>
                      <span>ניתן לבטל עד יום חמישי, 18:00</span>
                    </li>
                  </ul>

                  <div className="mt-8">
                    <Button
                      as="a"
                      href="/jachnun/order"
                      variant="onDark"
                      size="xl"
                      className="w-full"
                      icon={<IconArrow />}
                    >
                      {jachnun.cta.label}
                    </Button>
                    <p className="mt-3 text-center text-xs text-cream/60">
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
                    <div className="mt-6 rounded-card border border-cream/20 bg-cream/10 px-5 py-4 text-sm text-cream/85">
                      טופס ההזמנה דורש JavaScript. אפשר להזמין ג&apos;חנון מקפה הכרם גם בטלפון:{" "}
                      <a
                        href={`tel:${business.phone.tel}`}
                        className="text-cream underline underline-offset-4 hover:text-brass"
                      >
                        {business.phone.display}
                      </a>
                      .
                    </div>
                  </noscript>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* How it works — a standalone walkthrough. Previously the same four
          steps were rendered twice on this page (a small card beside the
          order form, and again inside it); this is the one place they
          live now. */}
      <Section tone="cream-3">
        <div className="text-center max-w-xl mx-auto">
          <Reveal>
            <Eyebrow tone="jachnun">{jachnun.reassurance.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 type-title text-3xl md:text-4xl text-espresso">
              {jachnun.reassurance.title}
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 relative">
          <div
            aria-hidden
            className="hidden md:block absolute top-6 inset-x-[12.5%] h-px bg-stroke"
          />
          <Stagger className="relative grid gap-10 md:grid-cols-4 md:gap-6" stagger={0.1}>
            {jachnun.reassurance.steps.map((step, idx) => (
              <StaggerItem key={idx} variant="tile">
                <div className="flex flex-col items-center text-center">
                  <span className="relative z-10 flex items-center justify-center w-12 h-12 shrink-0 rounded-full border border-jachnun/40 bg-cream type-index text-base text-jachnun">
                    {idx + 1}
                  </span>
                  <span className="mt-4 type-sub text-lg text-espresso">{step.title}</span>
                  <p className="mt-1.5 text-sm text-espresso-soft leading-relaxed max-w-[22ch]">
                    {step.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
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
