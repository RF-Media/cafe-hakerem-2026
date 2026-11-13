/**
 * The home hero. The h1 reveal is CSS keyframes (`.hero-word`), not JS: it
 * paints from the SSR HTML, so the largest text on the page never waits on a
 * bundle (§7 hard rule 1).
 *
 * Runs up under the transparent nav bar. Portrait screens get their own photo
 * and stack the text below it on solid espresso, so the cups stay visible; wide
 * screens lay the text over the photo with a scrim from the reading edge.
 */
import Image, { getImageProps } from "next/image";
import { Button } from "@/components/ui/Button";
import { IconArrow, IconPhone, IconPin, IconWhatsapp } from "@/components/ui/icons";
import { container } from "@/components/ui/Section";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitText } from "@/components/motion/SplitText";
import { OpenStatusBadge } from "@/components/sections/OpenStatusBadge";
import { business } from "@/content/business";
import { homeHero } from "@/content/home";

export function HomeHero() {
  const shared = { alt: homeHero.imageAlt, fill: true, priority: true, quality: 80 };
  const { props: landscape } = getImageProps({
    ...shared,
    src: homeHero.image,
    sizes: "100vw",
    className: "object-cover object-[35%_50%]",
  });
  const { props: portrait } = getImageProps({ ...shared, src: homeHero.imageMobile, sizes: "100vw" });
  const firstWords = homeHero.headlineA.split(/\s+/).length;
  const whatsapp = `https://wa.me/${business.whatsapp.number}?text=${encodeURIComponent(business.whatsapp.prefilledMessage)}`;

  return (
    <section data-track-area="home_hero" className="relative isolate -mt-[var(--nav-h)] flex min-h-[100svh] flex-col justify-end overflow-hidden bg-espresso-deep text-cream">
      <div className="absolute inset-x-0 top-0 -z-10 h-[50svh] overflow-hidden md:h-full">
        <picture className="hero-settle absolute inset-0 block">
          <source media="(orientation: portrait)" srcSet={portrait.srcSet} sizes={portrait.sizes} />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt arrives through getImageProps */}
          <img {...landscape} />
        </picture>
        {/* Top ramp for the nav, foot ramp to seat the text. */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-espresso-deep/70 via-transparent via-40% to-espresso-deep md:via-espresso-deep/5 md:via-50% md:to-espresso-deep/85" />
        {/* Reading edge: visual right in RTL. */}
        <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-l from-espresso-deep/90 via-espresso-deep/45 to-transparent md:block" />
      </div>

      <div className={`${container} relative w-full pb-6 pt-[43svh] md:pb-8 md:pt-28`}>
        <div className="max-w-4xl">
          <h1 className="type-display">
            <span className="hero-fade mb-3 block type-index text-brass md:mb-5 md:!text-sm" style={{ ["--d" as never]: 0 }}>
              {homeHero.kicker}
            </span>{" "}
            <span className="block text-[clamp(2rem,9vw,2.75rem)] leading-[1.08] md:text-6xl lg:text-7xl xl:text-[5.25rem]">
              <SplitText text={homeHero.headlineA} delay={80} />
            </span>{" "}
            <span className="block text-[2.75rem] leading-[1.05] text-brass md:text-6xl lg:text-7xl xl:text-[5.25rem]">
              <SplitText text={homeHero.headlineB} delay={80 + firstWords * 90} />
            </span>
          </h1>

          <p
            className="hero-fade mt-4 max-w-xl type-lede text-base text-cream/90 md:mt-6 md:text-xl"
            style={{ ["--d" as never]: 420 }}
          >
            {homeHero.lede}
          </p>

          <div className="hero-fade mt-5 flex flex-wrap gap-3 md:mt-8" style={{ ["--d" as never]: 560 }}>
            <Magnetic>
              <Button as="a" href="/menu" variant="onDark" size="lg" icon={<IconArrow />}>
                {homeHero.primaryCta}
              </Button>
            </Magnetic>
            <Magnetic>
              <Button as="a" href="/jachnun" variant="onDarkGhost" size="lg">
                {homeHero.secondaryCta}
              </Button>
            </Magnetic>
          </div>
        </div>

        {/* The visit bar: the answers to "are they open, where, how do I get
            there", without leaving the first screen. */}
        <div
          className="hero-fade mt-10 grid gap-4 rounded-card border border-cream/15 bg-espresso-deep/70 p-4 md:mt-12 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 md:bg-espresso-deep/75 md:px-6"
          style={{ ["--d" as never]: 700 }}
        >
          <Image
            src="/images/logo_cream.png"
            alt=""
            width={1251}
            height={574}
            sizes="130px"
            className="hidden h-14 w-auto md:block"
          />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="min-h-[21px] min-w-[150px]">
              <OpenStatusBadge />
            </span>
            <span className="inline-flex items-center gap-2 text-sm">
              <IconPin className="h-4 w-4 shrink-0 text-brass" />
              {business.address.street.he}, {business.address.neighborhood.he}, {business.address.city.he}
            </span>
            <a
              href={`tel:${business.phone.tel}`}
              className="inline-flex min-h-[44px] items-center gap-2 text-sm tabular-nums transition-colors duration-fast hover:text-brass md:min-h-0"
            >
              <IconPhone className="h-4 w-4 shrink-0 text-brass" />
              {business.phone.display}
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              as="a"
              href={business.socials.waze}
              external
              variant="onDarkGhost"
              size="sm"
              icon={<IconPin className="h-4 w-4" />}
              iconPosition="start"
            >
              {homeHero.navigate}
            </Button>
            <Button
              as="a"
              href={whatsapp}
              external
              variant="onDarkGhost"
              size="sm"
              icon={<IconWhatsapp className="h-4 w-4" />}
              iconPosition="start"
            >
              {homeHero.whatsapp}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
