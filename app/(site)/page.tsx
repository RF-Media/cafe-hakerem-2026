export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import nextDynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CafeImage } from "@/components/ui/CafeImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section, container } from "@/components/ui/Section";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { IconArrow, IconPin, IconPhone, IconWhatsapp } from "@/components/ui/icons";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { JachnunPromo } from "@/components/sections/JachnunPromo";
import { PatisserieSpecial } from "@/components/sections/PatisserieSpecial";
import { AlwaysRollingSection } from "@/components/sections/AlwaysRollingSection";
import { CateringEditorialSplit } from "@/components/sections/CateringEditorialSplit";
import { WhyVisitSection } from "@/components/sections/WhyVisitSection";
import { OpenStatusBadge } from "@/components/sections/OpenStatusBadge";
import { business } from "@/content/business";
import { catering } from "@/content/catering";
import { homeFAQs } from "@/content/faqs";
import {
  homeAbout,
  homeAlwaysRolling,
  homeCatering,
  homeFactualFocus,
  homeHero,
  homeMenu,
  homeValues,
} from "@/content/home";
import { instagram, instagramSection } from "@/content/instagram";
import { menuCategories, resolveHighlights } from "@/content/menu";

const highlights = resolveHighlights();

// Deferred to its own chunk: it's the furthest-down section and owns its
// own ResizeObserver (HorizontalRail) on top of several Reveal instances.
// Still SSR'd (no `ssr: false`) — GEO extraction and no-JS usability both
// need the HTML present — this only keeps its hydration JS out of the
// homepage's initial bundle. Placeholder height approximates the real
// section (intro copy + one row of square cards) to keep the CLS budget.
const InstagramGallery = nextDynamic(() =>
  import("@/components/sections/InstagramGallery").then((mod) => mod.InstagramGallery),
  {
    loading: () => (
      <div className="bg-espresso-deep min-h-[720px] md:min-h-[820px]" aria-hidden />
    ),
  },
);

export const metadata: Metadata = {
  title: "קפה הכרם - בית קפה בוטיקי בגני תקווה",
  description:
    "קפה הכרם - בית קפה בוטיקי ברחוב הכרמל 20, גני תקווה. ארוחות בוקר, קפה איכותי, מאפים טריים, מגשי אירוח וג'חנון של שבת להזמנה מראש.",
};

export default function HomePage() {
  return (
    <>
      <BreadcrumbSchema trail={[]} />

      {/* 1 — Hero.
          The h1 reveal is CSS keyframes (`.hero-word`), not Framer: it paints
          straight from the SSR HTML, so the largest text on the page never
          waits on the JS bundle. Everything below the fold uses Framer. */}
      <section className="relative isolate flex min-h-[70svh] md:min-h-[78svh] items-center overflow-hidden bg-espresso-deep">
        {/* The storefront photograph, full-bleed. `fill` rather than a ratio
            box: the frame here is the viewport, not the file's own 16:9. */}
        <Image
          src={homeHero.image}
          alt={homeHero.imageAlt}
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-[center_68%]"
        />

        {/* Scrim. The photo is bright and warm — cream wall along the top,
            a lit interior through the middle — so cream text can't sit on it
            unmediated. Three cheap layers instead of one heavy one: a flat
            wash for the baseline, a vertical ramp that seats the band against
            the section below it, and a start-side ramp (visual RIGHT in RTL)
            that darkens specifically under the headline column. Lightened
            from the original pass so more of the counter/shelf photo reads
            through — the text keeps its legibility from the per-line
            text-shadow below, not from a heavy wash. */}
        <div aria-hidden className="absolute inset-0 bg-espresso-deep/30" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-espresso-deep via-espresso-deep/45 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-l from-espresso-deep/55 via-espresso-deep/10 to-transparent"
        />

        <Parallax speed={-0.35} className="pointer-events-none absolute inset-0">
          <div className="hero-grain" aria-hidden />
        </Parallax>

        {/* Warm bloom, sitting behind the visit card on the end side rather
            than in the corner — the card then reads as backlit signage
            instead of the gradient reading as a stray light leak. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -end-32 w-[38rem] h-[38rem] rounded-full
                     bg-[radial-gradient(circle,hsl(var(--brass)/0.20),transparent_65%)] blur-2xl"
        />

        <div
          className={`${container} relative w-full py-20 md:py-24 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center`}
        >
          <div className="lg:col-span-7">
            <div className="hero-fade" style={{ ["--d" as never]: 0 }}>
              <Eyebrow withRule tone="cream">
                {homeHero.eyebrow}
              </Eyebrow>
            </div>

            {/* Cream, not pure white — `--cream` is the site's off-white and
                keeps the headline in the same warm family as the photograph.
                The text-shadow is insurance: the scrim handles today's crop,
                a re-crop or a swapped photo shouldn't be able to break the
                h1's legibility. */}
            <h1
              className="mt-5 type-display text-[2.75rem] leading-[1.03] md:text-7xl lg:text-8xl text-cream
                         [text-shadow:0_2px_28px_hsl(var(--espresso-deep)/0.55)]"
            >
              <SplitText text={homeHero.headline} delay={80} />
            </h1>

            <p
              className="hero-fade mt-6 type-lede text-base md:text-xl text-cream/85 max-w-xl
                         [text-shadow:0_1px_16px_hsl(var(--espresso-deep)/0.5)]"
              style={{ ["--d" as never]: 420 }}
            >
              {homeHero.lede}
            </p>

            <div
              className="hero-fade mt-8 flex flex-wrap gap-3"
              style={{ ["--d" as never]: 560 }}
            >
              <Magnetic>
                <Button as="a" href="/menu" variant="onDark" size="xl" icon={<IconArrow />}>
                  {homeHero.primaryCta}
                </Button>
              </Magnetic>
              <Magnetic>
                <Button as="a" href="/jachnun" variant="onDarkGhost" size="xl">
                  {homeHero.secondaryCta}
                </Button>
              </Magnetic>
            </div>
          </div>

          {/* The visit card, standing alone now that the wordmark lives in
              the nav.

              No explicit `order` here: mobile stacking follows DOM order,
              and the headline column above is already first in the JSX —
              headline, lede and both CTAs render before the Visit card on
              every viewport. The `<h1>` never moves regardless (CLAUDE.md
              §7, hard rule 1). */}
          <div className="lg:col-span-5">
            <Parallax speed={0.12}>
              <div
                className="hero-fade flex flex-col items-center lg:items-stretch"
                style={{ ["--d" as never]: 500 }}
              >
                <div className="w-full max-w-[380px]">
                  {/* Espresso, not cream-3: a bright card here would be the
                      only light object on a dark hero and would pull focus off
                      the headline. Dark card, cream ink, brass for the phone —
                      olive on this ground is nearly black. */}
                  <Card
                    padding="lg"
                    tone="espresso"
                    elevation="floating"
                    className="ring-1 ring-cream/10"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Eyebrow tone="brass">{homeHero.visitEyebrow}</Eyebrow>
                      <OpenStatusBadge />
                    </div>

                    <div className="mt-5 flex items-start gap-3">
                      <IconPin className="w-5 h-5 mt-0.5 text-brass shrink-0" />
                      <div>
                        <div className="type-sub text-2xl text-cream">
                          {business.address.street.he}
                        </div>
                        <div className="text-cream/70">
                          {business.address.neighborhood.he}, {business.address.city.he}
                        </div>
                      </div>
                    </div>

                    {/* The whole row is the tel: link, not just the number —
                        a bigger tap target on mobile. Icon and text share one
                        `text-brass` ancestor so the icon (stroke="currentColor")
                        inherits the same hover color for free. */}
                    <a
                      href={`tel:${business.phone.tel}`}
                      className="mt-4 pt-4 border-t border-cream/15 flex items-center gap-3
                                 text-brass hover:text-cream transition-colors"
                    >
                      <IconPhone className="w-5 h-5 shrink-0" />
                      <span>{business.phone.display}</span>
                    </a>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button
                        as="a"
                        href={business.socials.waze}
                        external
                        variant="onDarkGhost"
                        size="sm"
                        icon={<IconPin className="w-4 h-4" />}
                        iconPosition="start"
                      >
                        נווטו אלינו
                      </Button>
                      <Button
                        as="a"
                        href={`https://wa.me/${business.whatsapp.number}?text=${encodeURIComponent(business.whatsapp.prefilledMessage)}`}
                        external
                        variant="onDarkGhost"
                        size="sm"
                        icon={<IconWhatsapp className="w-4 h-4" />}
                        iconPosition="start"
                      >
                        וואטסאפ
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </Parallax>
          </div>
        </div>

        <div
          aria-hidden
          className="hidden md:block absolute bottom-8 start-6 md:start-10 lg:start-16 h-16"
        >
          <div className="scroll-cue h-full w-px" />
        </div>
      </section>

      {/* 2 — Three values */}
      <WhyVisitSection eyebrow={homeValues.eyebrow} title={homeValues.title} items={homeValues.items} />

      {/* 3 — "מה חדש": the category rail. Owns the category index. */}
      <AlwaysRollingSection
        categories={menuCategories}
        eyebrow={homeAlwaysRolling.eyebrow}
        title={homeAlwaysRolling.title}
        subtitle={homeAlwaysRolling.subtitle}
        caption={homeAlwaysRolling.caption}
      />

      {/* 4 — Menu bento. Dishes, not categories: the board above already
          enumerates every category, and re-listing them here (as the old
          ticker panel and category tiles did) said the same thing three
          times in one scroll. Prices resolve live out of content/menu.ts. */}
      <Section spacing="lg">
        <Stagger
          className="grid grid-cols-6 gap-4 md:gap-5 md:auto-rows-[minmax(150px,auto)]"
          stagger={0.06}
        >
          <StaggerItem
            variant="tile"
            className="col-span-6 md:col-span-2 md:row-span-2 flex flex-col justify-between gap-8 py-2"
          >
            <Eyebrow withRule>{homeMenu.eyebrow}</Eyebrow>
            <div>
              {/* A full register above the board's heading. Same weight —
                  the size gap is what establishes which one leads. */}
              <h2 className="type-title text-3xl md:text-5xl text-espresso">
                {homeMenu.title}
              </h2>
              <div className="mt-6">
                <Button variant="secondary" as="a" href="/menu" icon={<IconArrow />}>
                  {homeMenu.cta}
                </Button>
              </div>
            </div>
          </StaggerItem>

          {highlights.map((item, i) => (
            <StaggerItem
              key={`${item.categoryId}-${item.name}`}
              variant="tile"
              className="col-span-6 sm:col-span-3 md:col-span-2"
            >
              <Link
                href={`/menu#${item.categoryId}`}
                className={
                  "group/dish flex h-full flex-col justify-between gap-6 rounded-card " +
                  "border border-stroke p-6 md:p-7 min-h-[150px] " +
                  "transition-[transform,box-shadow,border-color] duration-base ease-out-soft " +
                  "hover:-translate-y-1 hover:shadow-lg hover:border-brass-ink/35 " +
                  (i % 2 === 0 ? "bg-cream-2" : "bg-cream-3")
                }
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="type-index text-brass-ink">{item.categoryTitle}</span>
                  <span className="text-sm text-espresso-soft tabular-nums">{item.price}</span>
                </div>

                <div>
                  <h3 className="type-sub text-xl md:text-2xl text-espresso">{item.name}</h3>
                  {item.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-espresso-soft line-clamp-2">
                      {item.description}
                    </p>
                  ) : null}
                  <span
                    aria-hidden
                    className="mt-3 block h-px w-8 bg-brass-ink/40 transition-all
                               duration-base ease-out-soft group-hover/dish:w-16"
                  />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* 5 — Patisserie special: sweet Friday, chapter one of the weekend
          (chapter two is the Jachnun band directly below). */}
      <PatisserieSpecial />

      {/* 6 — Jachnun: chapter two, salty Saturday. */}
      <JachnunPromo />

      {/* 7 — Catering: editorial split (featured tray + compact list). */}
      <CateringEditorialSplit
        eyebrow={homeCatering.eyebrow}
        title={homeCatering.title}
        body={homeCatering.body}
        capacityStat={homeCatering.capacityStat}
        cta={homeCatering.cta}
        options={catering.options}
        featuredOptionId={homeCatering.featuredOptionId}
      />

      {/* 8 — About preview */}
      <Section tone="cream">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <Reveal>
              <Eyebrow withRule>{homeAbout.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 type-title text-3xl md:text-4xl text-espresso">
                {homeAbout.title}
              </h2>
            </Reveal>
            <div className="mt-6 space-y-4 text-base md:text-lg leading-relaxed text-espresso-soft max-w-prose-he">
              {homeAbout.paragraphs.map((p, i) => (
                <Reveal key={i} delay={0.08 + i * 0.06}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.3}>
              <div className="mt-7">
                <Link
                  href="/about"
                  className="group/link inline-flex items-center gap-2 text-olive hover:text-espresso transition-colors"
                >
                  {homeAbout.cta}
                  <IconArrow className="w-4 h-4 transition-transform duration-fast group-hover/link:-translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>

          <Parallax speed={0.18}>
            <ImageReveal className="rounded-card">
              <CafeImage
                variant="interior"
                src="/images/hakerem.jpg"
                alt={homeAbout.imageAlt}
                ratio="aspect-[4/5]"
                tone="olive"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </ImageReveal>
          </Parallax>
        </div>
      </Section>

      {/* 9 — Instagram Gallery. A curated lookbook moments experience. */}
      {instagram.length > 0 ? (
        <InstagramGallery
          items={instagram}
          eyebrow={instagramSection.eyebrow}
          title={instagramSection.title}
          lede={instagramSection.body}
          ctaLabel={instagramSection.ctaLabel}
        />
      ) : null}

      {/* 10 — FAQ + factual paragraph */}
      <Section tone="cream">
        <FAQBlock items={homeFAQs} />
        <FAQSchema items={homeFAQs} />
        <FactualParagraph focus={homeFactualFocus} />
      </Section>
    </>
  );
}
