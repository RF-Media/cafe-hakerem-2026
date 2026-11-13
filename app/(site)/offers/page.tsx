export const dynamic = "force-static";
export const revalidate = 86400;

import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { CafeImage } from "@/components/ui/CafeImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { Section, container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconArrow } from "@/components/ui/icons";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { CoffeeStreamMark } from "@/components/club/CoffeeStreamMark";
import { FeaturedOfferCard, OfferTile, ClubPointerTile } from "@/components/sections/OfferCard";
import { HappyHourBadge } from "@/components/sections/HappyHourBadge";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { business, clubJoinUrl } from "@/content/business";
import { club } from "@/content/club";
import { offers } from "@/content/offers";
import { offersFAQs } from "@/content/faqs";
import { pages } from "@/content/seo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("offers");

function offersSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: pages.offers.title,
    url: `${business.siteUrl}/offers`,
    itemListElement: offers.items.map((offer) => ({
      "@type": "Offer",
      name: offer.title,
      description: offer.lede,
      availability: "https://schema.org/InStock",
      eligibleCustomerType: offer.exclusivity === "club" ? "https://schema.org/LoyaltyProgramMembers" : undefined,
    })),
  };
}

const [featured, ...rest] = offers.items;

export default function OffersPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: "מבצעים", href: "/offers" }]} />
      <JsonLd data={offersSchema()} />

      {/* Hero: espresso ground (the general brand world), not the club's own
          amber — this page is wider than the club, so it earns its own
          identity before the CoffeeStream tie-in shows up below. */}
      <section className="relative isolate overflow-hidden bg-espresso-deep text-cream">
        <div className={`${container} pb-14 pt-6 md:pb-20`}>
          <Breadcrumb items={[{ name: "מבצעים" }]} tone="dark" bare />
          <div className="mt-8 max-w-3xl md:mt-10">
            <h1 className="type-display">
              <span className="hero-fade mb-5 block type-index text-brass" style={{ ["--d" as never]: 0 }}>
                {offers.intro.kicker}
              </span>{" "}
              <span className="block text-[2.75rem] leading-[1.03] md:text-6xl lg:text-7xl">
                <SplitText text={offers.intro.title} delay={70} />
              </span>
            </h1>
            <p className="hero-fade mt-6 max-w-prose-he type-lede text-base md:text-xl text-cream/85" style={{ ["--d" as never]: 340 }}>
              {offers.intro.lede}
            </p>

            <div className="hero-fade mt-6" style={{ ["--d" as never]: 420 }}>
              <HappyHourBadge className="text-cream/90" />
            </div>

            <div className="hero-fade mt-7 flex flex-wrap items-center gap-4" style={{ ["--d" as never]: 480 }}>
              <Magnetic>
                <Button as="a" href={clubJoinUrl("offers_hero")} external variant="onDark" size="lg" icon={<IconArrow />}>
                  {offers.intro.primary}
                </Button>
              </Magnetic>
              <Link
                href="/coffee-club"
                className="inline-flex min-h-[44px] items-center px-1 font-medium text-cream/90 underline decoration-2 underline-offset-4 transition-[text-underline-offset] duration-fast hover:underline-offset-8"
              >
                {offers.intro.secondary}
              </Link>
            </div>

            <p className="hero-fade mt-8 flex flex-wrap items-center gap-3 text-sm font-medium text-cream/80" style={{ ["--d" as never]: 560 }}>
              <span>{club.hero.poweredBy}</span>
              <CoffeeStreamMark />
            </p>
          </div>
        </div>
      </section>

      {/* The grid: one featured promo, then the rest. */}
      <Section tone="cream" id="offers-grid">
        <SectionHeading
          eyebrow="המבצעים"
          title="מבצעים חמים בקפה הכרם"
          description="כל ההטבות בעמוד הזה אמיתיות ברגע שהקפה מאשר אותן — חלקן פתוחות לכולם, וחלקן שמורות לחברי המועדון."
        />

        <Reveal>
          <FeaturedOfferCard offer={featured} />
        </Reveal>

        <Stagger className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {rest.map((offer) => (
            <StaggerItem key={offer.id} variant="tile">
              <OfferTile offer={offer} />
            </StaggerItem>
          ))}
          <StaggerItem variant="tile">
            <ClubPointerTile
              eyebrow={offers.clubTile.eyebrow}
              title={offers.clubTile.title}
              body={offers.clubTile.body}
              cta={offers.clubTile.cta}
            />
          </StaggerItem>
        </Stagger>
      </Section>

      {/* Who actually runs the club mechanics behind these offers — the same
          explanation the club page gives, reused rather than rewritten. */}
      <Section tone="sage" spacing="md">
        <div className="grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal distance={32}>
              <CafeImage
                variant="cup"
                src="/images/cup-pastry_coffee-club.jpg"
                alt="כוס קפה ממותגת של קפה הכרם ומאפה על נייר, על דלפק עץ"
                ratio="aspect-[4/5]"
                sizes="(max-width: 768px) 90vw, 40vw"
              />
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <Reveal>
              <Eyebrow tone="olive" withRule>
                {club.platform.eyebrow}
              </Eyebrow>
            </Reveal>
            <h2 className="mt-4 type-statement text-4xl md:text-5xl text-espresso">
              <SplitReveal text={club.platform.title} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-prose-he text-base leading-relaxed text-espresso md:text-lg">{club.platform.body}</p>
              <div className="mt-5">
                <CoffeeStreamMark className="text-cs-ink" />
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="cream-2">
        <FAQBlock items={offersFAQs} heading="שאלות על המבצעים" id="offers-faq-heading" />
        <FAQSchema items={offersFAQs} />
        <FactualParagraph focus="קפה הכרם מפעיל Happy Hour לחברי מועדון הלקוחות בין השעות 14:00 ל-19:00, עם 50% הנחה על קפה שני, 10% הנחה על התפריט וכוס יין ב-30 ש״ח, ועוד הטבות שמתחלפות." />
        <div className="mt-10 text-center text-sm text-espresso-soft">
          <Link href="/coffee-club" className="text-olive hover:text-espresso">מועדון הלקוחות</Link>{" · "}
          <Link href="/menu" className="text-olive hover:text-espresso">לתפריט</Link>{" · "}
          <Link href="/jachnun" className="text-olive hover:text-espresso">ג'חנון של שבת</Link>{" · "}
          <Link href="/contact" className="text-olive hover:text-espresso">איך מגיעים</Link>
        </div>
      </Section>

      {/* Final ask, same shape as the club page's own closing band. */}
      <section className="cs-panel overflow-hidden py-20 md:py-28">
        <div className={`${container} grid items-center gap-10 md:grid-cols-12`}>
          <div className="md:col-span-8">
            <h2 className="type-statement text-4xl md:text-6xl">
              <SplitReveal text={offers.finalCta.title} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl type-lede text-lg md:text-xl">{offers.finalCta.body}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Magnetic>
                  <Button as="a" href={clubJoinUrl("offers_final")} external variant="ink" size="xl" icon={<IconArrow />}>
                    {offers.finalCta.button}
                  </Button>
                </Magnetic>
                <Link
                  href="/coffee-club"
                  className="inline-flex min-h-[44px] items-center px-1 font-medium underline decoration-2 underline-offset-4 transition-[text-underline-offset] duration-fast hover:underline-offset-8"
                >
                  {offers.finalCta.secondary}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
