export const dynamic = "force-static";
export const revalidate = 86400;

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CafeImage } from "@/components/ui/CafeImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { IconArrow, IconPin, IconSpark } from "@/components/ui/icons";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Ticker } from "@/components/motion/Ticker";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { AlwaysRollingSection } from "@/components/sections/AlwaysRollingSection";
import { CateringEditorialSplit } from "@/components/sections/CateringEditorialSplit";
import { ClubBand } from "@/components/sections/ClubBand";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { HomeHero } from "@/components/sections/HomeHero";
import { HoursList } from "@/components/sections/HoursList";
import { InstagramGallery } from "@/components/sections/InstagramGallery";
import { JachnunPromo } from "@/components/sections/JachnunPromo";
import { WhyVisitSection } from "@/components/sections/WhyVisitSection";
import { business } from "@/content/business";
import { catering } from "@/content/catering";
import { homeFAQs } from "@/content/faqs";
import { homeHolidays } from "@/content/holidays";
import {
  homeAbout,
  homeAlwaysRolling,
  homeCatering,
  homeFactualFocus,
  homeTicker,
  homeValues,
  homeVisit,
} from "@/content/home";
import { instagram, instagramSection } from "@/content/instagram";
import { menuCategories } from "@/content/menu";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("home");

export default function HomePage() {
  return (
    <>
      <BreadcrumbSchema trail={[]} />

      {/* Colour runs the page: espresso, brass, porcelain, pine, terracotta,
          sage, amber, espresso, porcelain, pine. Each topic has one ground, so
          a scroll past it still tells you where you are. */}
      <HomeHero />

      <div className="relative z-10 bg-brass py-3 text-espresso-deep">
        <Ticker
          items={homeTicker}
          duration={46}
          itemClassName="type-sub whitespace-nowrap text-base md:text-lg"
          separator={<IconSpark className="h-3 w-3" />}
        />
      </div>

      <AlwaysRollingSection
        categories={menuCategories}
        eyebrow={homeAlwaysRolling.eyebrow}
        title={homeAlwaysRolling.title}
        cta={homeAlwaysRolling.cta}
        caption={homeAlwaysRolling.caption}
      />

      {/* Holiday promotions band — copy pending, see content/holidays.ts. */}
      <Section tone="cream-3">
        <Reveal>
          <SectionHeading eyebrow={homeHolidays.eyebrow} title={homeHolidays.title} />
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-4 max-w-prose-he text-base text-espresso-soft md:text-lg">{homeHolidays.body}</p>
        </Reveal>
      </Section>

      <WhyVisitSection eyebrow={homeValues.eyebrow} title={homeValues.title} items={homeValues.items} />

      <JachnunPromo />

      <CateringEditorialSplit
        eyebrow={homeCatering.eyebrow}
        title={homeCatering.title}
        body={homeCatering.body}
        cta={homeCatering.cta}
        options={catering.options}
        featuredOptionId={homeCatering.featuredOptionId}
      />

      <ClubBand />

      {/* The story, in the dark: three photos at three speeds beside the text. */}
      <Section tone="espresso" spacing="lg" className="overflow-hidden">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow tone="brass" withRule>
                {homeAbout.eyebrow}
              </Eyebrow>
            </Reveal>
            <h2 className="mt-5 type-statement text-4xl md:text-6xl">
              <SplitReveal text={homeAbout.title} />
            </h2>
            <div className="mt-6 max-w-prose-he space-y-4 text-base leading-relaxed text-cream/85 md:text-lg">
              {homeAbout.paragraphs.map((p, i) => (
                <Reveal key={i} delay={0.06 + i * 0.06}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.26}>
              <div className="mt-8">
                <Button as="a" href="/about" variant="onDark" icon={<IconArrow />}>
                  {homeAbout.cta}
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-5 items-end gap-4 lg:col-span-6">
            <Parallax speed={0.14} className="col-span-3">
              <ImageReveal className="rounded-card">
                <CafeImage
                  variant="interior"
                  src={homeAbout.image}
                  alt={homeAbout.imageAlt}
                  ratio="aspect-[4/5]"
                  position="50% 15%"
                  className="!rounded-none"
                  sizes="(max-width: 1024px) 60vw, 30vw"
                />
              </ImageReveal>
            </Parallax>
            <div className="col-span-2 space-y-4">
              <Parallax speed={-0.12}>
                <ImageReveal delay={0.1} className="rounded-card">
                  <CafeImage
                    variant="pastry"
                    src={homeAbout.imageSecond}
                    alt={homeAbout.imageSecondAlt}
                    ratio="aspect-[4/5]"
                    sizes="(max-width: 1024px) 40vw, 20vw"
                  />
                </ImageReveal>
              </Parallax>
              <Parallax speed={0.08}>
                <ImageReveal delay={0.18} className="rounded-card">
                  <CafeImage
                    variant="founder"
                    src={homeAbout.imageThird}
                    alt={homeAbout.imageThirdAlt}
                    ratio="aspect-square"
                    sizes="(max-width: 1024px) 40vw, 20vw"
                  />
                </ImageReveal>
              </Parallax>
            </div>
          </div>
        </div>
      </Section>

      <InstagramGallery
        items={instagram}
        eyebrow={instagramSection.eyebrow}
        title={instagramSection.title}
        lede={instagramSection.body}
        ctaLabel={instagramSection.ctaLabel}
      />

      <Section tone="cream-2">
        <FAQBlock items={homeFAQs} heading="שאלות נפוצות על קפה הכרם" />
        <FAQSchema items={homeFAQs} />
        <FactualParagraph focus={homeFactualFocus} />
      </Section>

      {/* The last thing before the footer is how to actually get here. */}
      <Section tone="pine" spacing="lg" className="overflow-hidden">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow tone="brass" withRule>
                {homeVisit.eyebrow}
              </Eyebrow>
            </Reveal>
            <h2 className="mt-5 type-statement text-4xl md:text-6xl">
              <SplitReveal text={homeVisit.title} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl type-lede text-lg text-cream/90">{homeVisit.body}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  as="a"
                  href={business.socials.waze}
                  external
                  variant="onDark"
                  icon={<IconPin className="h-4 w-4" />}
                  iconPosition="start"
                >
                  {homeVisit.navigate}
                </Button>
                <Button as="a" href="/map" variant="onDarkGhost">
                  {homeVisit.maps}
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.22}>
              <Link href="/contact" className="link-draw mt-5 inline-block text-sm text-cream">
                {homeVisit.contact}
              </Link>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal distance={32}>
              <div className="overflow-hidden rounded-card bg-espresso-deep/40">
                <div className="zoom-frame">
                  <CafeImage
                    variant="interior"
                    src={homeVisit.image}
                    alt={homeVisit.imageAlt}
                    ratio="aspect-[16/9]"
                    className="!rounded-none"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="type-index text-brass">{homeVisit.hoursTitle}</h3>
                  <div className="mt-3">
                    <HoursList tone="dark" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
