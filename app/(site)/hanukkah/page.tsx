export const dynamic = "force-static";
export const revalidate = 86400;

import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { CafeImage } from "@/components/ui/CafeImage";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { Section, container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconArrow, IconClock, IconPhone, IconStamp } from "@/components/ui/icons";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { HanukkahBundleBuilder } from "@/components/sections/HanukkahBundleBuilder";
import { SufganiyahStories } from "@/components/sections/SufganiyahStories";
import { business, clubJoinUrl } from "@/content/business";
import { hanukkahFAQs } from "@/content/faqs";
import {
  afternoonDeal,
  atmosphere,
  BUNDLE_SIZES,
  BUNDLE_TIERS,
  bundlePrice,
  flavors,
  hanukkah,
  hanukkahBuilderEnabled,
  hanukkahBundles,
  heroDonuts,
  priceGroups,
  updated,
} from "@/content/hanukkah";
import { pages } from "@/content/seo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("hanukkah");

const abs = (path: string) => `${business.siteUrl}${path}`;
const cafe = { "@id": `${business.siteUrl}/#cafe` };
const bundleAnchor = hanukkahBuilderEnabled ? "#order" : "#prices";

/**
 * One graph, built from the same content the page renders: the page itself,
 * and an offer catalogue whose every price is visible (singles on the story
 * cards and in the price list, bundles in the price list).
 */
function pageSchema() {
  const singles = flavors.map((f) => ({
    "@type": "Offer",
    price: f.price.toFixed(2),
    priceCurrency: "ILS",
    availability: "https://schema.org/InStock",
    seller: cafe,
    itemOffered: { "@type": "Product", name: `סופגניית ${f.name}`, image: abs(f.image), brand: { "@type": "Brand", name: business.name.he } },
  }));
  const bundles = BUNDLE_TIERS.flatMap((tier) =>
    BUNDLE_SIZES.map((size) => ({
      "@type": "Offer",
      price: bundlePrice(tier, size).toFixed(2),
      priceCurrency: "ILS",
      availability: "https://schema.org/PreOrder",
      url: `${abs("/hanukkah")}${bundleAnchor}`,
      seller: cafe,
      itemOffered: { "@type": "Product", name: `${hanukkahBundles[tier].label} של ${size} סופגניות`, image: abs(flavors[0].image) },
    })),
  );
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${abs("/hanukkah")}#webpage`,
        url: abs("/hanukkah"),
        name: pages.hanukkah.title,
        description: pages.hanukkah.description,
        inLanguage: "he-IL",
        dateModified: updated.iso,
        isPartOf: { "@id": `${business.siteUrl}/#website` },
        about: cafe,
        primaryImageOfPage: { "@type": "ImageObject", url: abs(pages.hanukkah.image), caption: pages.hanukkah.imageAlt },
        image: [...heroDonuts, ...atmosphere].map((p) => abs(p.src)),
      },
      {
        "@type": "OfferCatalog",
        "@id": `${abs("/hanukkah")}#catalog`,
        name: "סופגניות חנוכה של קפה הכרם",
        itemListElement: [...singles, ...bundles],
      },
    ],
  };
}

/** Masonry crops: the same 2:3 photos, cut to different shapes so the columns stagger. */
const galleryRatios = ["aspect-[2/3]", "aspect-[4/5]", "aspect-square", "aspect-[4/5]", "aspect-square", "aspect-[2/3]"];

export default function HanukkahPage() {
  const { hero, deal, prices, links } = hanukkah;
  const telHref = `tel:${business.phone.tel}`;

  return (
    <>
      <BreadcrumbSchema trail={[{ name: "סופגניות חנוכה", href: "/hanukkah" }]} />
      <JsonLd data={pageSchema()} />

      {/* Hero, in the print rollup's language: cream ground with soft beige blobs, the
          collection name set big, gold rules around the subtitle, the club pill, then the
          enhanced donuts in its 3-3-3-1 arrangement (5-5 from md). The headline paints
          from the SSR HTML (§7 rule 1); the donuts settle in by transform only. */}
      <section data-track-area="page_hero" className="relative isolate overflow-hidden bg-cream text-espresso">
        <div aria-hidden className="pointer-events-none absolute -z-10 -start-40 -top-40 h-[26rem] w-[26rem] rounded-full bg-cream-2 md:h-[34rem] md:w-[34rem]" />
        <div aria-hidden className="pointer-events-none absolute -z-10 -end-40 top-40 hidden h-[30rem] w-[30rem] rounded-full bg-cream-2 md:block lg:-end-24 lg:top-24" />
        <div className={`${container} pb-12 pt-6 md:pb-20`}>
          <Breadcrumb items={[{ name: "סופגניות חנוכה" }]} bare />

          <div className="mx-auto mt-6 max-w-3xl text-center md:mt-10">
            <h1>
              <span className="hero-fade block text-3xl font-normal tracking-[0.08em] text-espresso md:text-5xl" style={{ ["--d" as never]: 0 }}>
                {hero.kicker}
              </span>{" "}
              <span className="type-display mt-1 block text-[4rem] leading-[0.95] md:text-8xl lg:text-9xl">
                <SplitText text={hero.title} delay={90} />
              </span>{" "}
              <span className="hero-fade mt-4 flex items-center justify-center gap-3 md:mt-6 md:gap-6" style={{ ["--d" as never]: 260 }}>
                <span aria-hidden className="h-0.5 w-6 shrink-0 rounded-full bg-brass-ink md:w-24" />
                <span className="type-sub whitespace-nowrap text-lg md:text-3xl">{hero.subtitle}</span>
                <span aria-hidden className="h-0.5 w-6 shrink-0 rounded-full bg-brass-ink md:w-24" />
              </span>
            </h1>
            <p className="hero-fade mx-auto mt-6 max-w-prose-he type-lede text-base text-espresso-soft md:text-lg" style={{ ["--d" as never]: 340 }}>
              {hero.lede}
            </p>

            {/* The club offer as a coupon, in /offers' language: amber is the club's
                colour, the value sits on a tear-off stub. */}
            <div className="hero-fade mx-auto mt-8 max-w-md" style={{ ["--d" as never]: 420 }}>
            <a
              href={clubJoinUrl("hanukkah_hero")}
              className="ticket-shadow group block text-start transition-transform duration-base ease-out-soft hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-4 focus-visible:ring-offset-cream rounded-[18px]"
            >
              <span className="ticket-x flex overflow-hidden rounded-[18px] bg-cream-3 [--tear:6.5rem] md:[--tear:8.5rem]">
                <span className="flex min-w-0 flex-1 items-center gap-3 p-4 md:gap-4 md:p-5">
                  <span aria-hidden className="hidden h-12 w-12 shrink-0 place-items-center rounded-full bg-amber-wash sm:grid text-cs-ink transition-transform duration-base ease-out-soft group-hover:-rotate-12 md:h-14 md:w-14">
                    <IconStamp className="h-6 w-6 md:h-7 md:w-7" />
                  </span>
                  <span className="min-w-0">
                    <span className="type-sub block text-base leading-snug md:text-lg">{hanukkah.clubPill.title}</span>
                    <span className="mt-1.5 inline-flex min-h-[32px] items-center gap-1.5 whitespace-nowrap rounded-full bg-espresso px-3.5 text-sm font-medium text-cream transition-colors duration-fast group-hover:bg-olive">
                      {hanukkah.clubPill.cta}
                      <IconArrow className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </span>
                <span className="flex w-[var(--tear)] shrink-0 flex-col items-center justify-center border-s-2 border-dashed border-cs-ink/30 bg-amber px-2 py-4 text-center text-cs-ink">
                  <bdi dir="ltr" className="type-statement block text-[2.25rem] leading-none tabular-nums md:text-[2.75rem]">
                    {hanukkah.clubPill.value}
                  </bdi>
                  <span className="mt-1 block text-xs font-medium">{hanukkah.clubPill.body}</span>
                </span>
              </span>
            </a>
            </div>

            <div className="hero-fade mt-6 flex flex-wrap items-center justify-center gap-3" style={{ ["--d" as never]: 500 }}>
              <Button as="a" href="#flavors" variant="primary" size="lg" icon={<IconArrow />}>
                {hero.cta}
              </Button>
              {hanukkahBuilderEnabled ? (
                <Button as="a" href="#order" variant="secondary" size="lg">
                  {hero.ctaOrder}
                </Button>
              ) : (
                <Button as="a" href={telHref} variant="secondary" size="lg" icon={<IconPhone />} iconPosition="start">
                  {hero.ctaPhone}
                </Button>
              )}
            </div>
          </div>

          <ul className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-x-2 gap-y-1 md:mt-14 md:max-w-5xl md:grid-cols-5 md:gap-x-6">
            {heroDonuts.map((d, i) => (
              <li key={d.id} className={`${i === heroDonuts.length - 1 ? "col-start-2 md:col-start-auto" : ""} ${i % 2 ? "md:translate-y-10" : ""}`}>
                <div className="donut-settle" style={{ ["--i" as never]: i }}>
                  <div className="transition-transform duration-fast ease-out-soft hover:-translate-y-1 [mask-image:radial-gradient(closest-side,#000_84%,transparent)]">
                    <CafeImage variant="pastry" src={d.src} alt={d.alt} ratio="aspect-square" className="!rounded-none" priority={i < 3} sizes="(min-width: 768px) 190px, 32vw" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-xs text-espresso-soft md:mt-12">{hero.illustrative}</p>
        </div>
      </section>

      {/* The 15 flavours as stories, dark cards on the light ground. overflow-x-clip:
          the track is full-bleed (100vw), and clip, unlike hidden, makes no scroll container. */}
      <Section tone="cream-2" id="flavors" className="overflow-x-clip">
        <SectionHeading eyebrow={hanukkah.stories.eyebrow} title={hanukkah.stories.title} />
        <SufganiyahStories />
      </Section>

      {/* The afternoon deal as a ticket, matching the club coupon in the hero. It is open
          to everyone, so its stub is pine, /offers' colour for "everyone" (amber is club only).
          The picture equation says the deal before the copy does. */}
      <Section tone="cream" spacing="sm" ariaLabelledby="deal-heading">
        <div className="ticket-shadow mx-auto max-w-4xl">
          <div className="ticket-x flex overflow-hidden rounded-[22px] bg-cream-3 [--tear:6.5rem] md:[--tear:11rem]">
            <div className="flex min-w-0 flex-1 flex-col gap-5 p-5 md:flex-row md:items-center md:gap-8 md:p-7">
              <div aria-hidden className="flex shrink-0 items-center gap-2 md:gap-3">
                <span className="flex">
                  {deal.donuts.map((src, i) => (
                    <span key={src} className={`block h-14 w-14 md:h-20 md:w-20 [mask-image:radial-gradient(closest-side,#000_80%,transparent)] ${i ? "-ms-4 md:-ms-6" : ""}`}>
                      <CafeImage variant="pastry" src={src} alt="" ratio="aspect-square" className="!rounded-none" sizes="80px" />
                    </span>
                  ))}
                </span>
                <span className="type-title text-2xl text-brass-ink md:text-3xl">+</span>
                <span className="block h-14 w-14 overflow-hidden rounded-full ring-2 ring-cream ring-offset-2 ring-offset-stroke md:h-20 md:w-20">
                  <CafeImage variant="cup" src={deal.image} alt="" ratio="aspect-square" className="!rounded-full" sizes="80px" />
                </span>
              </div>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 type-index text-xs text-brass-ink">
                  <IconClock className="h-4 w-4" />
                  {afternoonDeal.days} · <bdi dir="ltr">{afternoonDeal.from}-{afternoonDeal.to}</bdi>
                </p>
                <h2 id="deal-heading" className="type-title mt-1.5 text-balance text-2xl md:text-3xl">
                  {deal.title}
                </h2>
                <p className="mt-1.5 text-sm text-espresso-soft md:text-base">{deal.body}</p>
              </div>
            </div>
            <p className="flex w-[var(--tear)] shrink-0 flex-col items-center justify-center border-s-2 border-dashed border-cream/40 bg-olive px-2 py-6 text-center text-cream">
              <span className="type-statement block text-[2.5rem] leading-none tabular-nums md:text-6xl">{deal.price}</span>
              <span className="mt-2 block text-xs font-medium md:text-sm">{deal.priceNote}</span>
            </p>
          </div>
        </div>
      </Section>

      {hanukkahBuilderEnabled ? (
        // No overflow-hidden on the card (it stops sticky children working, 2026-08-06).
        <Section tone="cream" spacing="md" id="order">
          <Reveal>
            <SectionHeading eyebrow={hanukkah.builder.eyebrow} title={hanukkah.builder.title} description={hanukkah.builder.description} />
          </Reveal>
          <div
            data-hide-mobile-bar=""
            data-track-area="hanukkah_order"
            className="mx-auto max-w-6xl rounded-card border border-stroke bg-cream-3 shadow-md"
          >
            <HanukkahBundleBuilder />
          </div>
        </Section>
      ) : null}

      {/* The atmosphere set as a masonry wall. */}
      <Section tone="cream-3">
        <SectionHeading eyebrow={hanukkah.gallery.eyebrow} title={hanukkah.gallery.title} description={hanukkah.gallery.description} />
        <div className="columns-2 gap-3 md:columns-3 md:gap-5 xl:columns-4">
          {atmosphere.map((p, i) => (
            <Reveal key={p.src} className="mb-3 break-inside-avoid md:mb-5" delay={(i % 3) * 0.08}>
              <figure className="group">
                <CafeImage
                  variant="pastry"
                  src={p.src}
                  alt={p.alt}
                  ratio={galleryRatios[i % galleryRatios.length]}
                  className="zoom-frame"
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Every price in one place: singles by price, bundles as a table. */}
      <Section tone="cream" id="prices">
        <SectionHeading eyebrow={prices.eyebrow} title={prices.title} />
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h3 className="type-sub text-xl md:text-2xl">{prices.singles}</h3>
            <ul className="mt-4 divide-y divide-stroke border-y border-stroke">
              {priceGroups.map((g) => (
                <li key={g.price} className="flex gap-5 py-4">
                  <p className="type-statement w-16 shrink-0 text-3xl tabular-nums text-brass-ink">₪{g.price}</p>
                  <p className="pt-1 text-espresso-soft">{g.flavors.map((f) => f.name).join(" · ")}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-card bg-espresso-deep p-6 text-cream shadow-lg md:p-8">
              <h3 className="type-sub text-xl md:text-2xl">{prices.bundles}</h3>
              <p className="mt-1 text-sm text-cream/80">{prices.tierNote}</p>
              <table className="mt-5 w-full text-start tabular-nums">
                <thead>
                  <tr className="border-b border-cream/20 text-sm text-cream/80">
                    <th scope="col" className="py-2 text-start font-normal">
                      <span className="sr-only">סוג המארז</span>
                    </th>
                    {BUNDLE_SIZES.map((n) => (
                      <th key={n} scope="col" className="py-2 text-start font-normal">
                        {n} יח׳
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BUNDLE_TIERS.map((t) => (
                    <tr key={t} className="border-b border-cream/10 last:border-0">
                      <th scope="row" className="py-3 text-start font-medium">
                        {hanukkahBundles[t].label}
                      </th>
                      {BUNDLE_SIZES.map((n) => (
                        <td key={n} className="type-sub py-3 text-lg text-brass">
                          ₪{bundlePrice(t, n)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {hanukkahBuilderEnabled ? (
                <Button as="a" href="#order" variant="onDark" size="md" className="mt-6" icon={<IconArrow />}>
                  {hero.ctaOrder}
                </Button>
              ) : (
                <>
                  <p className="mt-5 text-sm text-cream/90">{prices.bundlesNote}</p>
                  <Button as="a" href={telHref} variant="onDark" size="md" className="mt-4" icon={<IconPhone />} iconPosition="start">
                    {business.phone.display}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="cream-2">
        <SectionHeading eyebrow={links.eyebrow} title={links.title} />
        <Stagger as="ul" className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {links.items.map((l, i) => (
            <StaggerItem as="li" key={l.href} variant="tile" className={i === 0 ? "col-span-2 md:col-span-1" : ""}>
              <Link href={l.href} className="group relative block overflow-hidden rounded-card text-cream shadow-sm transition-shadow duration-base hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-cream-2">
                <CafeImage
                  variant="interior"
                  src={l.image}
                  alt=""
                  ratio={i === 0 ? "aspect-[16/9] md:aspect-[3/4]" : "aspect-[3/4]"}
                  className="zoom-frame !rounded-none"
                  sizes="(min-width: 768px) 20vw, 50vw"
                />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-espresso-deep/90 via-espresso-deep/30 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4">
                  <span className="flex items-center justify-between gap-2">
                    <span className="type-sub text-lg md:text-xl">{l.label}</span>
                    <IconArrow className="h-4 w-4 shrink-0 transition-transform duration-fast group-hover:-translate-x-1" />
                  </span>
                  <span className="text-sm text-cream/90">{l.note}</span>
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="cream" spacing="md">
        <FAQBlock items={hanukkahFAQs} id="hanukkah-faq-heading" />
        <FAQSchema items={hanukkahFAQs} />
        <FactualParagraph focus={hanukkah.factual} />
        <p className="mx-auto mt-3 max-w-3xl text-xs text-espresso-soft">
          עודכן לאחרונה: <time dateTime={updated.iso}>{updated.he}</time>
        </p>
      </Section>
    </>
  );
}
