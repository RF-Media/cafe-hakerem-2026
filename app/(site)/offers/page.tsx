export const dynamic = "force-static";
export const revalidate = 86400;

import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { Section, container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconArrow, IconCheck, IconClock, IconPhoneCard, IconQr, IconSpark } from "@/components/ui/icons";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Ticker } from "@/components/motion/Ticker";
import { ClubScene } from "@/components/club/StampScene";
import { CoffeeStreamMark } from "@/components/club/CoffeeStreamMark";
import { HappyHourCoupon, OfferTicket } from "@/components/sections/OfferCard";
import { OfferComparison } from "@/components/sections/OfferComparison";
import { PercentTagArt } from "@/components/sections/OfferScenes";
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

const STEP_ICONS = { phone: IconPhoneCard, clock: IconClock, qr: IconQr };

export default function OffersPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: "מבצעים", href: "/offers" }]} />
      <JsonLd data={offersSchema()} />

      {/* Hero: the headline offer is the hero. On phones the coupon follows the
          <h1> directly, so the first screen holds the deal, not a promise of one. */}
      <section className="relative isolate overflow-hidden bg-espresso-deep text-cream">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_70%_at_22%_55%,hsl(var(--amber)/0.16),transparent_70%)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-[-2rem] -z-10 select-none text-[22rem] font-black leading-none text-brass opacity-[0.07] md:text-[30rem]"
        >
          %
        </span>

        <div className={`${container} pb-14 pt-6 md:pb-20`}>
          <Breadcrumb items={[{ name: "מבצעים" }]} tone="dark" bare />

          <div className="mt-6 grid gap-y-10 lg:mt-10 lg:grid-cols-12 lg:gap-x-14">
            <div className="lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:self-end">
              <h1 className="type-display">
                <span className="hero-fade mb-4 block type-index text-brass" style={{ ["--d" as never]: 0 }}>
                  {offers.intro.kicker}
                </span>{" "}
                <span className="block text-4xl md:text-6xl">
                  <SplitText text={offers.intro.title} delay={70} />
                </span>
              </h1>
            </div>

            <div className="pt-4 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-center lg:pt-0">
              <HappyHourCoupon offer={featured} />
              {featured.note ? <p className="mt-5 text-xs text-cream/70 md:text-sm">{featured.note}</p> : null}
            </div>

            <div className="lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:self-start">
              <p className="hero-fade max-w-prose-he type-lede text-base text-cream/85 md:text-xl" style={{ ["--d" as never]: 340 }}>
                {offers.intro.lede}
              </p>
              <ul className="hero-fade mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-cream/90" style={{ ["--d" as never]: 420 }}>
                {club.hero.trust.map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5">
                    <IconCheck className="h-4 w-4 text-brass" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="hero-fade mt-6 flex flex-wrap items-center gap-x-6 gap-y-2" style={{ ["--d" as never]: 480 }}>
                <Button as="a" href="#offers-grid" variant="onDarkGhost" icon={<IconArrow className="rotate-[-90deg]" />}>
                  {offers.intro.toGrid}
                </Button>
                <Link
                  href="/coffee-club"
                  className="inline-flex min-h-[44px] items-center px-1 font-medium text-cream/90 underline decoration-2 underline-offset-4 transition-[text-underline-offset] duration-fast hover:underline-offset-8"
                >
                  {offers.intro.secondary}
                </Link>
              </div>
              <p className="hero-fade mt-7 flex flex-wrap items-center gap-3 text-sm font-medium text-cream/80" style={{ ["--d" as never]: 560 }}>
                <span>{club.hero.poweredBy}</span>
                <CoffeeStreamMark />
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-amber py-3.5 text-cs-ink">
        <Ticker
          items={offers.ticker}
          itemClassName="type-sub whitespace-nowrap text-base md:text-lg"
          separator={<IconSpark className="h-4 w-4" />}
          duration={45}
        />
      </div>

      {/* Every other offer, as a coupon. The stub carries the value. */}
      <Section tone="cream" id="offers-grid">
        <SectionHeading eyebrow={offers.grid.eyebrow} title={offers.grid.title} description={offers.grid.description} />
        <ul className="-mt-2 mb-8 flex flex-wrap gap-3 text-sm font-medium">
          <li className="inline-flex items-center gap-2">
            <span aria-hidden className="h-3.5 w-6 rounded-sm bg-amber ring-1 ring-cs-ink/20" />
            {offers.legend.club}
          </li>
          <li className="inline-flex items-center gap-2">
            <span aria-hidden className="h-3.5 w-6 rounded-sm bg-olive" />
            {offers.legend.all}
          </li>
        </ul>

        <Stagger className="grid gap-6 lg:grid-cols-2 lg:gap-8" stagger={0.07}>
          {rest.map((offer) => (
            <StaggerItem key={offer.id} variant="tile">
              <OfferTicket offer={offer} />
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* The conversion argument, row by row. */}
      <Section tone="cream-2">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow tone="olive" withRule>
                {offers.comparison.eyebrow}
              </Eyebrow>
            </Reveal>
            <h2 className="mt-4 type-statement text-4xl text-espresso md:text-5xl">
              <SplitReveal text={offers.comparison.title} />
            </h2>
            <Reveal delay={0.08}>
              <p className="mt-5 max-w-prose-he text-base leading-relaxed text-espresso-soft md:text-lg">
                {offers.comparison.description}
              </p>
            </Reveal>
            <Reveal delay={0.14} className="mx-auto mt-8 hidden w-full max-w-[260px] lg:block">
              <PercentTagArt />
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <OfferComparison />
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="cream">
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

      {/* Final ask: three steps from here to the till, and the club card itself. */}
      <section className="amber-panel overflow-hidden py-20 md:py-28">
        <div className={`${container} grid items-center gap-12 lg:grid-cols-12`}>
          <div className="lg:col-span-7">
            <h2 className="type-statement text-4xl md:text-6xl">
              <SplitReveal text={offers.finalCta.title} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl type-lede text-lg md:text-xl">{offers.finalCta.body}</p>
            </Reveal>

            <Stagger as="ol" className="mt-9 grid gap-5 sm:grid-cols-3" stagger={0.08}>
              {offers.steps.map((step, i) => {
                const Icon = STEP_ICONS[step.icon];
                return (
                  <StaggerItem key={step.title} as="li" variant="tile">
                    <div className="sticker h-full rounded-[18px] bg-cs-cream p-5">
                      <div className="flex items-center justify-between">
                        <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-cs-ink text-amber">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span aria-hidden className="type-statement text-3xl text-cs-ink/25 tabular-nums">
                          {i + 1}
                        </span>
                      </div>
                      <h3 className="mt-4 type-sub text-lg">{step.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed">{step.body}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>

            <Reveal delay={0.16}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
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
          <Reveal delay={0.1} className="mx-auto w-full max-w-[440px] lg:col-span-5">
            <ClubScene title={club.band.cardTitle} caption={club.band.cardLeft(3)} label={club.band.imageAlt} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
