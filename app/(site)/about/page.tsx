export const dynamic = "force-static";
export const revalidate = 86400;

import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { CafeImage } from "@/components/ui/CafeImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconArrow, IconClock, IconCup, IconSpark } from "@/components/ui/icons";
import { Counter } from "@/components/motion/Counter";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { PageHero } from "@/components/sections/PageHero";
import { about } from "@/content/about";
import { business } from "@/content/business";
import { aboutFAQs } from "@/content/faqs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("about");

function aboutSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "הסיפור של קפה הכרם",
    url: `${business.siteUrl}/about`,
    inLanguage: "he",
    about: { "@id": `${business.siteUrl}/#cafe` },
    isPartOf: { "@id": `${business.siteUrl}/#website` },
  };
}

/** One colour per chapter: terracotta for where it began, the dark of coffee
 *  for the craft, sage for the place. The story reads as moving between rooms. */
const chapterTones = [
  { tone: "jachnun" as const, eyebrow: "amber" as const, body: "text-cream", numeral: "text-cream/25" },
  { tone: "espresso" as const, eyebrow: "brass" as const, body: "text-cream/90", numeral: "text-brass/30" },
  { tone: "sage" as const, eyebrow: "olive" as const, body: "text-espresso", numeral: "text-olive/25" },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: "הסיפור שלנו", href: "/about" }]} />
      <JsonLd data={aboutSchema()} />

      <PageHero
        tone="pine"
        crumbs={[{ name: "הסיפור שלנו" }]}
        kicker={about.hero.kicker}
        title={about.hero.title}
        lede={about.hero.lede}
        image="/images/storefront_shared.jpg"
        imageAlt="חזית קפה הכרם ברחוב הכרמל 20, השלט מעל הדלפק והמדפים"
        imagePosition="50% 0%"
        bleed
      />

      {/* The story, in chapters. The photo holds still beside the text on wide
          screens, so a long chapter never scrolls away from its picture. */}
      {about.story.map((chapter, i) => {
        const t = chapterTones[i];
        return (
          <Section key={chapter.heading} tone={t.tone} spacing="lg">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-last" : ""}`}>
                <div className="lg:sticky lg:top-[calc(var(--nav-h)+32px)]">
                  <ImageReveal className="rounded-card">
                    <CafeImage
                      variant="interior"
                      src={chapter.image}
                      alt={chapter.imageAlt}
                      ratio="aspect-[4/5]"
                      className="!rounded-none"
                      sizes="(max-width: 1024px) 90vw, 40vw"
                    />
                  </ImageReveal>
                </div>
              </div>
              <div className="lg:col-span-7">
                <Reveal>
                  <div className="flex items-center gap-4">
                    <span
                      aria-hidden
                      data-n={chapter.n}
                      className={`type-statement text-6xl tabular-nums before:content-[attr(data-n)] md:text-8xl ${t.numeral}`}
                    />
                    <Eyebrow tone={t.eyebrow === "amber" ? "cream" : t.eyebrow} withRule>
                      {chapter.eyebrow}
                    </Eyebrow>
                  </div>
                </Reveal>
                <h2 className="mt-6 type-statement text-4xl md:text-6xl">
                  <SplitReveal text={chapter.heading} />
                </h2>
                <div className={`mt-7 max-w-prose-he space-y-5 text-lg leading-relaxed md:text-xl ${t.body}`}>
                  {chapter.paragraphs.map((p, pi) => (
                    <Reveal key={p} delay={pi * 0.06}>
                      <p>{p}</p>
                    </Reveal>
                  ))}
                </div>
                {chapter.link ? (
                  <Reveal className="mt-8" delay={chapter.paragraphs.length * 0.06}>
                    <Button as="a" href={chapter.link.href} variant="onDark" icon={<IconArrow />}>
                      {chapter.link.label}
                    </Button>
                  </Reveal>
                ) : null}
              </div>
            </div>
          </Section>
        );
      })}

      {/* A few true numbers, counted up. Pine, not a brass fill — brass stays
          an accent (hairlines, icons, the rule under each figure) per §4. */}
      <Section tone="pine" spacing="md" className="overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 start-1/2 h-80 w-80 -translate-x-1/2 rounded-full
                     bg-[radial-gradient(circle,hsl(var(--brass)/0.16),transparent_65%)] blur-2xl"
        />
        <div className="text-center">
          <Reveal>
            <Eyebrow tone="brass" withRule>
              {about.stats.eyebrow}
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mx-auto mt-4 max-w-xl type-title text-3xl text-cream md:text-4xl">
              {about.stats.title}
            </h2>
          </Reveal>
        </div>

        <Stagger as="dl" className="mt-14 grid gap-12 sm:grid-cols-3 sm:gap-6" stagger={0.1}>
          {about.stats.items.map((stat, i) => {
            const Icon = [IconClock, IconCup, IconSpark][i] ?? IconSpark;
            return (
              <StaggerItem
                key={stat.label}
                as="div"
                variant="tile"
                className="group relative text-center sm:border-s sm:border-cream/15 sm:first:border-s-0"
              >
                <div className="sm:px-6">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-brass/40 text-brass transition-colors duration-base group-hover:bg-brass group-hover:text-espresso-deep">
                    <Icon className="h-5 w-5" />
                  </span>
                  <dd className="mt-5 type-statement text-5xl text-cream tabular-nums md:text-6xl">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </dd>
                  <span aria-hidden className="mx-auto mt-4 block h-px w-10 bg-brass/50" />
                  <dt className="mt-4 type-sub text-lg text-cream">{stat.label}</dt>
                  <p className="mt-1 text-sm text-cream/70">{stat.detail}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Section>

      {/* The courtyard, full width, carrying the café's own sign-off. */}
      <section className="relative isolate flex min-h-[70svh] items-center justify-center overflow-hidden bg-espresso-deep text-cream">
        <Parallax speed={0.2} className="absolute -inset-y-16 inset-x-0 -z-10">
          <Image src="/images/yard_shared.jpg" alt="החצר של קפה הכרם, שמשיות לבנות ואורחים יושבים בין עצי דקל" fill sizes="100vw" quality={80} className="object-cover" />
        </Parallax>
        <div aria-hidden className="absolute inset-0 -z-10 bg-espresso-deep/55" />
        <p className="type-statement px-6 text-center text-5xl md:text-8xl">
          <SplitReveal text={about.signoff} />
        </p>
      </section>

      {/* A day here, in four scenes. Swipes on phones. */}
      <Section tone="cream">
        <SectionHeading eyebrow={about.day.eyebrow} title={about.day.title} />
        {/* tabIndex: a scrolling region has to be reachable without a pointer. */}
        <div
          role="region"
          aria-label={about.day.title}
          tabIndex={0}
          className="-mx-6 snap-x snap-mandatory scroll-px-6 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
        >
        <Stagger as="ol" className="flex w-max gap-4 md:grid md:w-auto md:grid-cols-4 md:gap-5" stagger={0.09}>
          {about.day.scenes.map((scene) => (
            <StaggerItem key={scene.when} as="li" variant="tile" className="w-[72vw] shrink-0 snap-start md:w-auto">
              <article className="group">
                <div className="zoom-frame rounded-card">
                  <CafeImage
                    variant="cup"
                    src={scene.image}
                    alt={scene.alt}
                    ratio="aspect-[3/4]"
                    sizes="(max-width: 768px) 72vw, 25vw"
                  />
                </div>
                <p className="mt-5 w-fit rounded-pill bg-olive px-4 py-1.5 text-sm font-medium text-cream md:text-base">{scene.when}</p>
                <h3 className="mt-3 type-sub text-xl text-espresso md:text-2xl">{scene.title}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-espresso-soft">{scene.body}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
        </div>
      </Section>

      {/* The album: real empty frames for photos the café is still looking for.
          Give an entry a `src` in content/about.ts and the frame becomes it. */}
      <Section tone="cream-2">
        <SectionHeading eyebrow={about.album.eyebrow} title={about.album.title} description={about.album.lede} />
        <Stagger className="grid gap-8 sm:grid-cols-3 sm:gap-6" stagger={0.1}>
          {about.album.photos.map((photo, i) => (
            <StaggerItem key={photo.caption} variant="tile">
              <figure
                className={
                  "mx-auto max-w-xs rounded-[6px] bg-cream-3 p-3 pb-5 shadow-md transition-[transform,box-shadow] duration-base ease-out-soft hover:rotate-0 hover:shadow-lg " +
                  (i === 0 ? "-rotate-2" : i === 1 ? "rotate-1" : "-rotate-1")
                }
              >
                <CafeImage
                  variant={photo.variant}
                  src={photo.src}
                  alt={photo.alt}
                  ratio="aspect-square"
                  tone="espresso"
                  className="!rounded-[3px]"
                  sizes="(max-width: 640px) 80vw, 30vw"
                />
                <figcaption className="mt-4 text-center">
                  <span className="block type-sub text-base text-espresso">{photo.caption}</span>
                  {!photo.src ? <span className="mt-1 block text-xs text-espresso-soft">{about.album.pendingNote}</span> : null}
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="pine">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="type-statement text-4xl md:text-6xl">
            <SplitReveal text={about.cta.title} />
          </h2>
          <Reveal delay={0.08}>
            <p className="mt-4 type-lede text-lg text-cream/90">{about.cta.body}</p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button as="a" href="/contact" variant="onDark" icon={<IconArrow />}>
                {about.cta.contact}
              </Button>
              <Button as="a" href="/menu" variant="onDarkGhost">
                {about.cta.menu}
              </Button>
            </div>
            <p className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
              <Link href="/jachnun" className="link-draw">{about.cta.jachnun}</Link>
              <Link href="/coffee-club" className="link-draw">{about.cta.club}</Link>
            </p>
          </Reveal>
        </div>
      </Section>

      <Section tone="cream">
        <FAQBlock items={aboutFAQs} heading="שאלות על קפה הכרם" />
        <FAQSchema items={aboutFAQs} />
        <FactualParagraph focus="קפה הכרם התחיל מעגלת ג'חנון ובורקס של סוף שבוע, ופועל היום כבית קפה שכונתי שמגיש קפה שנטחן במקום, מאפים, כריכים וג'חנון של שבת להזמנה." />
      </Section>
    </>
  );
}
