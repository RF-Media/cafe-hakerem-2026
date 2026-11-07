export const dynamic = "force-static";
export const revalidate = 86400;

import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { IconArrow } from "@/components/ui/icons";
import { CafeImage } from "@/components/ui/CafeImage";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { Section } from "@/components/ui/Section";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { JachnunCountdown } from "@/components/sections/JachnunCountdown";
import { JachnunPreorderForm } from "@/components/sections/JachnunPreorderForm";
import { PageHero } from "@/components/sections/PageHero";
import { formatILS } from "@/lib/money";
import { jachnun, jachnunPackages, jachnunStartingPriceAgorot } from "@/content/jachnun";
import { jachnunFAQs } from "@/content/faqs";
import { business } from "@/content/business";
import { homeJachnun } from "@/content/home";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("jachnun");

function productSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "ג'חנון של שבת - קפה הכרם",
    image: `${business.siteUrl}${jachnun.hero.image}`,
    brand: { "@type": "Brand", name: business.name.he },
    description:
      "ג'חנון תימני מסורתי הנאפה במטבח של קפה הכרם בגני תקווה, להזמנה מראש ולאיסוף בשבת בבוקר.",
    offers: {
      "@type": "AggregateOffer",
      availability: "https://schema.org/PreOrder",
      priceCurrency: "ILS",
      // Schema.org wants bare numbers, never a display string.
      lowPrice: (jachnunStartingPriceAgorot / 100).toFixed(2),
      highPrice: (jachnunPackages[jachnunPackages.length - 1].totalAgorot / 100).toFixed(2),
      offerCount: jachnunPackages.length,
      url: `${business.siteUrl}/jachnun`,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${business.siteUrl}/#cafe` },
    },
  };
}

export default function JachnunPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: "ג'חנון", href: "/jachnun" }]} />
      <JsonLd data={productSchema()} />

      <PageHero
        tone="jachnun"
        crumbs={[{ name: "ג'חנון" }]}
        kicker={jachnun.hero.kicker}
        title={jachnun.hero.title}
        lede={jachnun.hero.lede}
        image={jachnun.hero.image}
        imageAlt={jachnun.hero.imageAlt}
        imagePosition="35% 50%"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button as="a" href="#order" variant="onDark" size="lg" icon={<IconArrow />}>
            להזמנה
          </Button>
          <span className="rounded-pill bg-cream/15 px-4 py-2 text-sm font-medium">{jachnun.pricing.perUnit}</span>
        </div>
        <div className="mt-4">
          <JachnunCountdown prefix={homeJachnun.countdownPrefix} fallback={homeJachnun.urgency} className="text-cream" />
        </div>
      </PageHero>

      {/* Three reasons, each with its own photo */}
      <Section tone="cream">
        <Stagger className="grid gap-8 md:grid-cols-3 md:gap-6" stagger={0.1}>
          {jachnun.threeReasons.map((r, i) => (
            <StaggerItem key={r.title} variant="tile">
              <article className="group">
                <div className="zoom-frame rounded-card">
                  <CafeImage
                    variant="jachnun"
                    src={r.image}
                    alt={r.imageAlt}
                    ratio="aspect-[4/3]"
                    position={i === 2 ? "20% 50%" : undefined}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h2 className="mt-5 type-sub text-2xl text-espresso">{r.title}</h2>
                <p className="mt-2 text-base leading-relaxed text-espresso-soft md:text-lg">{r.body}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Pre-order. Phase 1 is this one-step form, paid at pickup; the
          five-step checkout at /jachnun/order is phase 2 and gated off (see
          CHECKOUT_ENABLED). The terracotta header keeps the sub-brand on the
          one card whose job is to convert; the form itself sits on cream,
          since FormField's espresso labels don't read on terracotta. */}
      <Section tone="cream-2">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-28 lg:self-start">
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

            {/* Picking up on Saturday anyway: the other thing the café is known for. */}
            <Reveal>
              <Link href="/menu#burekas" className="group block overflow-hidden rounded-card bg-cream-3 shadow-sm transition-shadow duration-base hover:shadow-md">
                <div className="zoom-frame">
                  <CafeImage
                    variant="pastry"
                    src="/images/burekas-eggs_shared.jpg"
                    alt="בורקס תורכי מוזהב במגש מתכת לצד ביצים קשות וסחוג"
                    ratio="aspect-[16/9]"
                    className="!rounded-none"
                    sizes="(max-width: 1024px) 100vw, 35vw"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <span className="type-sub text-lg text-espresso">{jachnun.crossSell}</span>
                  <IconArrow className="h-4 w-4 shrink-0 text-espresso transition-transform duration-fast group-hover:-translate-x-1" />
                </div>
              </Link>
            </Reveal>
          </div>

          {/* First on mobile: the hero's "להזמנה" lands here, and the form
              shouldn't sit below a list the hero already summarised. */}
          <div id="order" className="order-first lg:order-none lg:col-span-3 scroll-mt-24">
            <div className="overflow-hidden rounded-card border border-stroke bg-cream-3 shadow-md">
              <div className="relative overflow-hidden bg-jachnun px-5 py-7 sm:px-8 md:p-8 text-cream">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-24 -end-24 w-72 h-72 rounded-full
                             bg-[radial-gradient(circle,hsl(var(--cream)/0.12),transparent_65%)]"
                />
                <div className="relative">
                  <Eyebrow tone="cream" withRule>{jachnun.preorder.eyebrow}</Eyebrow>
                  <h2 className="mt-4 type-statement text-3xl md:text-4xl text-cream">
                    {jachnun.preorder.title}
                  </h2>
                  <p className="mt-3 text-base text-cream">{jachnun.preorder.lede}</p>
                  <p className="mt-1.5 text-sm text-cream">{jachnun.preorder.reassurance}</p>

                  <div className="mt-5 md:mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="type-display text-4xl md:text-5xl text-cream tabular-nums">
                      {formatILS(jachnunStartingPriceAgorot)}
                    </span>
                    <span className="text-sm text-cream">{jachnun.preorder.perUnit}</span>
                  </div>
                  <span className="mt-2 inline-flex items-center rounded-pill bg-cream/15 px-3 py-1 text-sm text-cream">
                    {jachnun.pricing.bundleNote}
                  </span>
                </div>
              </div>

              <div className="px-4 py-7 sm:px-6 md:p-8">
                {/* The form needs JS for its pickup windows and submit; the
                    no-JS path is the one the café has always had — the phone
                    (CLAUDE.md §12: usable, not identical). */}
                <noscript>
                  <div className="mb-6 rounded-card border border-stroke bg-cream px-5 py-4 text-sm text-espresso-soft">
                    טופס ההזמנה דורש JavaScript. אפשר להזמין ג&apos;חנון מקפה הכרם גם בטלפון:{" "}
                    <a
                      href={`tel:${business.phone.tel}`}
                      className="text-olive underline underline-offset-4 hover:text-espresso"
                    >
                      {business.phone.display}
                    </a>
                    .
                  </div>
                </noscript>
                <JachnunPreorderForm />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* How it works — a standalone walkthrough. Previously the same four
          steps were rendered twice on this page (a small card beside the
          order form, and again inside it); this is the one place they
          live now. */}
      <Section tone="jachnun">
        <div className="text-center max-w-2xl mx-auto">
          <Reveal>
            <Eyebrow tone="cream">{jachnun.reassurance.eyebrow}</Eyebrow>
          </Reveal>
          <h2 className="mt-4 type-statement text-4xl md:text-6xl text-cream">
            <SplitReveal text={jachnun.reassurance.title} />
          </h2>
        </div>

        <div className="mt-14 relative">
          <div
            aria-hidden
            className="hidden md:block absolute top-6 inset-x-[12.5%] h-px bg-cream/40"
          />
          <Stagger className="relative grid gap-10 md:grid-cols-4 md:gap-6" stagger={0.1}>
            {jachnun.reassurance.steps.map((step, idx) => (
              <StaggerItem key={idx} variant="tile">
                <div className="flex flex-col items-center text-center">
                  <span className="relative z-10 flex items-center justify-center w-12 h-12 shrink-0 rounded-full bg-cream type-sub text-lg text-jachnun">
                    {idx + 1}
                  </span>
                  <span className="mt-4 type-sub text-xl text-cream">{step.title}</span>
                  <p className="mt-1.5 text-base text-cream leading-relaxed max-w-[24ch]">
                    {step.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section>
        <FAQBlock items={jachnunFAQs} heading="שאלות על הג'חנון" />
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
