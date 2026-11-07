export const dynamic = "force-static";
export const revalidate = 86400;

import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { CafeImage } from "@/components/ui/CafeImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { Section, container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  IconArrow,
  IconCheck,
  IconCup,
  IconGift,
  IconPhoneCard,
  IconQr,
  IconSpark,
  IconStamp,
} from "@/components/ui/icons";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { CoffeeStreamMark } from "@/components/club/CoffeeStreamMark";
import { PunchCalculator } from "@/components/club/PunchCalculator";
import { ClubScene } from "@/components/club/StampScene";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { business, clubJoinUrl } from "@/content/business";
import { club } from "@/content/club";
import { clubFAQs } from "@/content/faqs";
import { pages } from "@/content/seo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("club");

const ICONS = {
  qr: IconQr,
  phone: IconPhoneCard,
  stamp: IconStamp,
  cup: IconCup,
  gift: IconGift,
  spark: IconSpark,
};

function clubSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pages.club.title,
    description: pages.club.description,
    url: `${business.siteUrl}/coffee-club`,
    inLanguage: "he",
    about: { "@id": `${business.siteUrl}/#club` },
    isPartOf: { "@id": `${business.siteUrl}/#website` },
  };
}

export default function ClubPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: "מועדון הלקוחות", href: "/coffee-club" }]} />
      <JsonLd data={clubSchema()} />

      {/* The ramp's first screen: CoffeeStream's amber panel, the illustration
          from its sign-in screen, and the two buttons that are the whole point
          of the page. */}
      <section className="cs-panel overflow-hidden">
        <div className={`${container} pb-14 pt-6 md:pb-20`}>
          <Breadcrumb items={[{ name: "מועדון הלקוחות" }]} bare />
          <div className="mt-8 grid items-center gap-12 lg:mt-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h1 className="type-display">
                <span className="hero-fade mb-5 block type-index" style={{ ["--d" as never]: 0 }}>
                  {club.hero.kicker}
                </span>{" "}
                <span className="block text-[3.25rem] leading-[1.02] md:text-7xl lg:text-8xl">
                  <SplitText text={club.hero.title} delay={70} />
                </span>
              </h1>
              <p className="hero-fade mt-6 max-w-xl type-lede text-lg md:text-xl" style={{ ["--d" as never]: 340 }}>
                {club.hero.lede}
              </p>

              <div className="hero-fade mt-8 flex flex-wrap gap-3" style={{ ["--d" as never]: 460 }}>
                <Magnetic>
                  <Button as="a" href={clubJoinUrl("club_hero")} external variant="ink" size="xl" icon={<IconArrow />}>
                    {club.hero.primary}
                  </Button>
                </Magnetic>
                <Button as="a" href={clubJoinUrl("club_hero_member")} external variant="inkGhost" size="xl">
                  {club.hero.secondary}
                </Button>
              </div>

              <ul className="hero-fade mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium" style={{ ["--d" as never]: 560 }}>
                {club.hero.trust.map((item) => (
                  <li key={item} className="inline-flex items-center gap-1.5">
                    <IconCheck className="h-4 w-4" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="hero-fade mt-8 flex flex-wrap items-center gap-3 text-sm font-medium" style={{ ["--d" as never]: 640 }}>
                <span>{club.hero.poweredBy}</span>
                <CoffeeStreamMark />
              </p>
            </div>

            <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
              <ClubScene title={club.band.cardTitle} caption={club.band.cardLeft(3)} label={club.band.imageAlt} />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <Section tone="cream-3">
        <SectionHeading eyebrow={club.steps.eyebrow} title={club.steps.title} />
        <Stagger as="ol" className="grid gap-5 md:grid-cols-3" stagger={0.09}>
          {club.steps.items.map((step, i) => {
            const Icon = ICONS[step.icon];
            return (
              <StaggerItem key={step.title} as="li" variant="tile">
                <div className="group relative h-full rounded-card border border-espresso/15 bg-cream p-6 transition-[transform,box-shadow] duration-base ease-out-soft hover:-translate-y-1 hover:shadow-lg md:p-8">
                  <div className="flex items-center justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-[14px] border-[3px] border-cs-ink bg-amber text-cs-ink transition-transform duration-base ease-out-soft group-hover:-rotate-6">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span
                      aria-hidden
                      data-n={i + 1}
                      className="type-statement text-6xl text-espresso/15 tabular-nums before:content-[attr(data-n)]"
                    />
                  </div>
                  <h3 className="mt-6 type-sub text-2xl text-espresso">{step.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-espresso-soft">{step.body}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Section>

      {/* The calculator: the interactive heart of the ramp, on CoffeeStream's amber. */}
      <Section tone="amber" spacing="lg">
        <PunchCalculator
          heading={
            <SectionHeading
              eyebrow={club.calculator.eyebrow}
              title={club.calculator.title}
              description={club.calculator.lede}
              tone="ink"
              className="!mb-0"
            />
          }
        />
      </Section>

      {/* What you get */}
      <Section tone="cream">
        <SectionHeading eyebrow={club.perks.eyebrow} title={club.perks.title} />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
          {club.perks.items.map((perk) => {
            const Icon = ICONS[perk.icon];
            return (
              <StaggerItem key={perk.title} variant="tile">
                <div className="group h-full rounded-card bg-cream-2 p-6 transition-[background-color,transform] duration-base ease-out-soft hover:-translate-y-1 hover:bg-amber-soft">
                  <Icon className="h-8 w-8 text-cs-ink transition-transform duration-base ease-out-soft group-hover:-rotate-6" />
                  <h3 className="mt-5 type-sub text-xl text-espresso">{perk.title}</h3>
                  <p className="mt-2 text-base leading-snug text-espresso-soft group-hover:text-espresso">{perk.body}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="sticker flex h-full flex-col rounded-[22px] bg-cs-cream p-6 text-cs-ink md:p-8">
              <Eyebrow tone="ink" withRule>
                {club.deals.eyebrow}
              </Eyebrow>
              <h3 className="mt-3 type-sub text-2xl">{club.deals.title}</h3>
              <ul className="mt-5 flex-1 space-y-3">
                {club.deals.items.map((deal) => (
                  <li key={deal.name} className="flex items-baseline justify-between gap-4 border-b border-cs-ink/15 pb-3">
                    <span>
                      <span className="type-sub text-lg">{deal.name}</span>
                      <span className="ms-2 text-sm text-cs-ink/80">{deal.was}</span>
                    </span>
                    <span className="type-statement text-2xl tabular-nums">{deal.price}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-cs-ink/80">{club.deals.note}</p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="h-full rounded-[22px] bg-olive p-6 text-cream md:p-8">
              <Eyebrow tone="brass" withRule>
                {club.status.eyebrow}
              </Eyebrow>
              <h3 className="mt-3 type-sub text-2xl">{club.status.title}</h3>
              <ol className="mt-6 grid grid-cols-3 gap-3">
                {club.status.tiers.map((tier, i) => (
                  <li key={tier.name} className="border-t-2 border-brass/60 pt-3">
                    <span className="type-statement text-4xl tabular-nums text-brass">{tier.punches}</span>
                    <span className="mt-1 block text-xs text-cream/85">{club.status.unit}</span>
                    <span className={`mt-2 block type-sub ${i === 2 ? "text-lg" : "text-base"}`}>{tier.name}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* A real photo before the last ask, plus who runs it. */}
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
              <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <a href={business.coffeestream.privacyUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-olive">
                  {club.platform.privacy}
                </a>
                <a href={business.coffeestream.termsUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-olive">
                  {club.platform.terms}
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="cream-2">
        <FAQBlock items={clubFAQs} heading="שאלות על המועדון" />
        <FAQSchema items={clubFAQs} />
        <FactualParagraph focus="מועדון הלקוחות של קפה הכרם הוא כרטיסיית ניקובים דיגיטלית בחינם שפועלת על CoffeeStream: ניקוב ראשון במתנה בהצטרפות, קפה חינם בניקוב העשירי, וקפה חינם ו-20% על התפריט ליום ההולדת." />
        <div className="mt-10 text-center text-sm text-espresso-soft">
          <Link href="/menu" className="text-olive hover:text-espresso">לתפריט</Link>{" · "}
          <Link href="/jachnun" className="text-olive hover:text-espresso">ג'חנון של שבת</Link>{" · "}
          <Link href="/catering" className="text-olive hover:text-espresso">מגשי אירוח</Link>{" · "}
          <Link href="/contact" className="text-olive hover:text-espresso">איך מגיעים</Link>
        </div>
      </Section>

      {/* Last step of the ramp: button on phones, QR on a computer. */}
      <section className="cs-panel overflow-hidden py-20 md:py-28">
        <div className={`${container} grid items-center gap-10 md:grid-cols-12`}>
          <div className="md:col-span-8">
            <h2 className="type-statement text-5xl md:text-7xl">
              <SplitReveal text={club.finalCta.title} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl type-lede text-lg md:text-xl">{club.finalCta.body}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-8">
                <Magnetic>
                  <Button as="a" href={clubJoinUrl("club_final")} external variant="ink" size="xl" icon={<IconArrow />}>
                    {club.finalCta.button}
                  </Button>
                </Magnetic>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="hidden md:col-span-4 md:block">
            <div className="sticker mx-auto max-w-[240px] rounded-[22px] bg-cs-cream p-5 text-center text-cs-ink">
              <Image src="/images/club-qr_coffee-club.svg" alt={club.qr.alt} width={200} height={200} unoptimized className="mx-auto w-full" />
              <p className="mt-3 type-sub text-base">{club.qr.title}</p>
              <p className="mt-1 text-sm">{club.qr.body}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
