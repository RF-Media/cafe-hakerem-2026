export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CafeImage } from "@/components/ui/CafeImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section, container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { IconArrow } from "@/components/ui/icons";
import { Counter } from "@/components/motion/Counter";
import { HorizontalRail } from "@/components/motion/HorizontalRail";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Ticker } from "@/components/motion/Ticker";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { JachnunScene } from "@/components/sections/JachnunScene";
import { business } from "@/content/business";
import { homeFAQs } from "@/content/faqs";
import {
  homeAbout,
  homeCatering,
  homeFactualFocus,
  homeHero,
  homeInstagramEmpty,
  homeMenu,
  homeValues,
} from "@/content/home";
import { instagram, instagramSection } from "@/content/instagram";
import { menuCategories } from "@/content/menu";

export const metadata: Metadata = {
  title: "קפה הכרם — בית קפה בוטיקי בגני תקווה",
  description:
    "קפה הכרם — בית קפה בוטיקי ברחוב הכרמל 20, גני תקווה. ארוחות בוקר, קפה איכותי, מאפים טריים, מגשי אירוח וג'חנון של שבת להזמנה מראש.",
};

const itemCount = menuCategories.reduce((n, c) => n + c.items.length, 0);

export default function HomePage() {
  return (
    <>
      <BreadcrumbSchema trail={[]} />

      {/* 1 — Hero.
          The h1 reveal is CSS keyframes (`.hero-word`), not Framer: it paints
          straight from the SSR HTML, so the largest text on the page never
          waits on the JS bundle. Everything below the fold uses Framer. */}
      <section className="relative overflow-hidden">
        <Parallax speed={-0.35} className="pointer-events-none absolute inset-0">
          <div className="hero-grain" aria-hidden />
        </Parallax>

        {/* Warm bloom behind the headline — cheap depth, no image weight. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -start-24 w-[36rem] h-[36rem] rounded-full
                     bg-[radial-gradient(circle,hsl(var(--brass)/0.14),transparent_65%)] blur-2xl"
        />

        <div
          className={`${container} pt-14 md:pt-24 pb-16 md:pb-28 grid lg:grid-cols-12 gap-10 lg:gap-12 items-end`}
        >
          <div className="lg:col-span-7">
            <div className="hero-fade" style={{ ["--d" as never]: 0 }}>
              <Eyebrow withRule>{homeHero.eyebrow}</Eyebrow>
            </div>

            <h1 className="mt-5 type-display text-[2.75rem] leading-[1.03] md:text-7xl lg:text-8xl text-espresso">
              <SplitText text={homeHero.headline} delay={80} />
            </h1>

            <p
              className="hero-fade mt-6 type-lede text-base md:text-xl text-espresso-soft max-w-xl"
              style={{ ["--d" as never]: 420 }}
            >
              {business.tagline.he}. {homeHero.lede}
            </p>

            <div
              className="hero-fade mt-8 flex flex-wrap gap-3"
              style={{ ["--d" as never]: 560 }}
            >
              <Magnetic>
                <Button as="a" href="/menu" variant="primary" size="xl" icon={<IconArrow />}>
                  {homeHero.primaryCta}
                </Button>
              </Magnetic>
              <Magnetic>
                <Button as="a" href="/jachnun" variant="secondary" size="xl">
                  {homeHero.secondaryCta}
                </Button>
              </Magnetic>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Parallax speed={0.12}>
              <div className="hero-fade" style={{ ["--d" as never]: 640 }}>
                <Card padding="lg" tone="cream-3" elevation="floating">
                  <Eyebrow tone="brass">{homeHero.visitEyebrow}</Eyebrow>
                  <div className="mt-4 space-y-2 text-espresso">
                    <div className="type-display text-2xl">{business.address.street.he}</div>
                    <div className="text-espresso-soft">
                      {business.address.neighborhood.he}, {business.address.city.he}
                    </div>
                    <div className="pt-3 mt-1 border-t border-stroke">
                      <a
                        href={`tel:${business.phone.tel}`}
                        className="text-olive hover:text-espresso transition-colors"
                      >
                        {business.phone.display}
                      </a>
                    </div>
                  </div>
                </Card>
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
      <Section tone="cream-2">
        <SectionHeading eyebrow={homeValues.eyebrow} title={homeValues.title} />
        <Stagger className="grid md:grid-cols-3 gap-5 md:gap-6" stagger={0.1}>
          {homeValues.items.map((v) => (
            <StaggerItem key={v.title} variant="tile">
              <Card padding="lg" hoverable tone="cream-3" className="group h-full">
                <span
                  aria-hidden
                  className="block h-px w-8 bg-brass/50 transition-all duration-base ease-out-soft group-hover:w-16"
                />
                <div className="mt-5 type-display text-xl md:text-2xl text-espresso">
                  {v.title}
                </div>
                <p className="mt-2.5 text-base leading-relaxed text-espresso-soft">{v.body}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* 3 — Menu bento */}
      <Section>
        <Stagger
          className="grid grid-cols-6 gap-4 md:gap-5 md:auto-rows-[minmax(150px,auto)]"
          stagger={0.08}
        >
          <StaggerItem
            variant="tile"
            className="col-span-6 md:col-span-2 flex flex-col justify-between gap-8 py-2"
          >
            <Eyebrow withRule>{homeMenu.eyebrow}</Eyebrow>
            <div>
              <h2 className="type-display text-3xl md:text-4xl text-espresso">
                {homeMenu.title}
              </h2>
              <div className="mt-6">
                <Button variant="secondary" as="a" href="/menu" icon={<IconArrow />}>
                  {homeMenu.cta}
                </Button>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem
            variant="tile"
            className="col-span-6 md:col-span-4 bg-espresso-deep text-cream rounded-card
                       border border-cream/10 p-6 md:p-8 flex flex-col justify-between gap-6
                       shadow-md overflow-hidden"
          >
            <Eyebrow tone="brass">{homeMenu.panelEyebrow}</Eyebrow>

            <Ticker
              items={menuCategories.map((c) => c.title.he)}
              duration={34}
              className="-mx-6 md:-mx-8 px-6 md:px-8
                         [mask-image:linear-gradient(to_left,transparent,black_8%,black_92%,transparent)]"
              itemClassName="px-4 py-1.5 rounded-pill border border-cream/20 text-sm text-cream/85 whitespace-nowrap"
            />

            <p className="text-sm text-cream/60 font-latin">
              <Counter value={menuCategories.length} /> {homeMenu.categoriesLabel} ·{" "}
              <Counter value={itemCount} /> {homeMenu.itemsLabel}
            </p>
          </StaggerItem>

          {menuCategories.slice(0, 4).map((cat, i) => (
            <StaggerItem
              key={cat.id}
              variant="tile"
              className="col-span-6 sm:col-span-3 md:col-span-3"
            >
              <Link
                href={`/menu#${cat.id}`}
                className={
                  "group/cat block h-full rounded-card border border-stroke p-6 md:p-8 " +
                  "min-h-[150px] transition-[transform,box-shadow,border-color] duration-base " +
                  "ease-out-soft hover:-translate-y-1 hover:shadow-lg hover:border-brass/40 " +
                  (i % 2 === 0 ? "bg-cream-2" : "bg-cream-3")
                }
              >
                <div className="flex h-full items-end justify-between gap-3">
                  <div>
                    <span className="font-latin text-xs tracking-[0.2em] text-brass">
                      № 0{i + 1}
                    </span>
                    <h3 className="mt-2 type-display text-xl md:text-2xl text-espresso">
                      {cat.title.he}
                    </h3>
                  </div>
                  <span
                    aria-hidden
                    className="shrink-0 opacity-0 translate-x-2 group-hover/cat:opacity-100
                               group-hover/cat:translate-x-0 transition-all duration-base ease-out-soft
                               px-3 py-1 rounded-pill bg-olive text-cream text-xs font-latin
                               tracking-wide whitespace-nowrap"
                  >
                    {cat.items.length} items →
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* 4 — Jachnun. Pins on desktop, stacks on mobile. */}
      <JachnunScene />

      {/* 5 — Catering */}
      <Section tone="cream-2" className="border-y border-stroke">
        <div className="grid grid-cols-12 gap-8 md:gap-10 items-center">
          <div className="col-span-12 md:col-span-5">
            <Reveal>
              <Eyebrow withRule>{homeCatering.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 type-display text-4xl md:text-5xl text-espresso">
                {homeCatering.title}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-md type-lede text-base md:text-lg text-espresso-soft">
                {homeCatering.body}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8">
                <Button variant="primary" as="a" href="/catering" icon={<IconArrow />}>
                  {homeCatering.cta}
                </Button>
              </div>
            </Reveal>
          </div>

          <Stagger
            as="ul"
            className="col-span-12 md:col-span-7 grid grid-cols-2 gap-4"
            stagger={0.09}
          >
            {homeCatering.trays.map((k, i) => (
              <StaggerItem key={k} as="li" variant="tile">
                {/* The offset lives on this inner element, not on the
                    StaggerItem — Framer owns `transform` there and a
                    Tailwind translate class would simply be overwritten. */}
                <ImageReveal
                  className={"rounded-card " + (i % 2 === 1 ? "md:mt-6" : "")}
                  delay={i * 0.05}
                >
                  <div className="bg-cream-3 rounded-card border border-stroke p-6 aspect-[5/4] flex flex-col justify-between">
                    <span className="font-latin text-xs tracking-[0.2em] text-brass">
                      № 0{i + 1}
                    </span>
                    <span className="type-display text-xl md:text-2xl text-espresso">
                      מגש {k}
                    </span>
                  </div>
                </ImageReveal>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* 6 — About preview */}
      <Section tone="cream">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <Reveal>
              <Eyebrow withRule>{homeAbout.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 type-display text-3xl md:text-4xl text-espresso">
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
                alt={homeAbout.imageAlt}
                ratio="aspect-[4/5]"
                tone="olive"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </ImageReveal>
          </Parallax>
        </div>
      </Section>

      {/* 7 — Instagram. The rail runs full-bleed, so the container wraps
          only the heading rather than the whole section. */}
      <section className="bg-cream-2 py-20 md:py-28">
        <div className={container}>
          <SectionHeading
            eyebrow={instagramSection.eyebrow}
            title={instagramSection.title}
            description={instagramSection.body}
          />
        </div>

        {instagram.length === 0 ? (
          <div className={container}>
            <Card padding="lg" tone="cream-3" className="text-center text-espresso-soft">
              {homeInstagramEmpty}
            </Card>
          </div>
        ) : (
          <HorizontalRail length={2.5} trackClassName="gap-4 px-6 md:ps-10 lg:ps-16">
            {instagram.map((p, i) => (
              <a
                key={i}
                href={p.href ?? "#"}
                target={p.href ? "_blank" : undefined}
                rel={p.href ? "noopener noreferrer" : undefined}
                className="shrink-0 snap-start w-[70vw] sm:w-[45vw] md:w-[26vw] lg:w-[20vw]
                           rounded-card overflow-hidden hover:opacity-90 transition-opacity"
              >
                <CafeImage
                  variant="instagram"
                  src={p.src}
                  alt={p.alt}
                  ratio="aspect-square"
                  sizes="(max-width: 768px) 70vw, 20vw"
                />
              </a>
            ))}
          </HorizontalRail>
        )}
      </section>

      {/* 8 — FAQ + factual paragraph */}
      <Section tone="cream">
        <FAQBlock items={homeFAQs} />
        <FAQSchema items={homeFAQs} />
        <FactualParagraph focus={homeFactualFocus} />
      </Section>
    </>
  );
}
