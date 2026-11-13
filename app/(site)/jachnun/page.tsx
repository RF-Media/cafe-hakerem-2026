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
import { jachnun, jachnunUnitPriceAgorot } from "@/content/jachnun";
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
      "@type": "Offer",
      availability: "https://schema.org/PreOrder",
      priceCurrency: "ILS",
      // Schema.org wants a bare number, never a display string.
      price: (jachnunUnitPriceAgorot / 100).toFixed(2),
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
            להזמנה לשבת
          </Button>
          <span className="rounded-pill bg-cream/15 px-4 py-2 text-sm font-medium">{jachnun.pricing.perUnit}</span>
        </div>
        <div className="mt-4">
          <JachnunCountdown prefix={homeJachnun.countdownPrefix} fallback={homeJachnun.urgency} className="text-cream" />
        </div>
      </PageHero>

      {/* Pre-order, straight under the hero: the page exists to convert, so
          nothing stands between "להזמנה" and the form. Phase 1 is this
          three-step form (jachnun + burekas, a rep calls to take payment);
          the checkout at /jachnun/order is phase 2 and gated off (see
          CHECKOUT_ENABLED). One card, full width: on desktop it holds its own
          summary column, so a side column here would only push it below the
          fold. Its terracotta header, the no-JS phone fallback and everything
          else live in the form component. No overflow-hidden on the card: it
          would stop the phone summary bar from sticking (see 2026-08-06). */}
      <Section tone="cream-2" spacing="sm">
        <div
          id="order"
          data-hide-mobile-bar=""
          data-track-area="jachnun_order"
          className="mx-auto max-w-5xl rounded-card border border-stroke bg-cream-3 shadow-md"
        >
          <JachnunPreorderForm />
        </div>
      </Section>

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
        <FactualParagraph focus="קפה הכרם אופה ג'חנון תימני להזמנה מראש ומציע איסוף בשבת בבוקר. ניתן להזמין דרך האתר עד יום שישי בשעה 16:00." />
        <div className="mt-10 text-center text-sm text-espresso-soft">
          רוצים לראות עוד? <Link href="/menu" className="text-olive hover:text-espresso">לתפריט המלא</Link>{" · "}
          <Link href="/catering" className="text-olive hover:text-espresso">מגשי אירוח</Link>{" · "}
          <Link href="/about" className="text-olive hover:text-espresso">הסיפור שלנו</Link>
        </div>
      </Section>
    </>
  );
}
