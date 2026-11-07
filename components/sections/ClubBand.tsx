/**
 * The home page's ramp into the club: CoffeeStream's amber panel holding the
 * illustration from its sign-in screen. The illustration holds still.
 */
import Link from "next/link";
import { clubJoinUrl } from "@/content/business";
import { club } from "@/content/club";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { IconArrow, IconCheck } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { CoffeeStreamMark } from "@/components/club/CoffeeStreamMark";
import { ClubScene } from "@/components/club/StampScene";

export function ClubBand() {
  return (
    <Section id="club" tone="amber" spacing="lg" className="overflow-hidden">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow tone="ink" withRule>
              {club.band.eyebrow}
            </Eyebrow>
          </Reveal>
          <h2 className="mt-5 type-statement text-5xl md:text-7xl">
            <SplitReveal text={club.band.title} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl type-lede text-lg md:text-xl">{club.band.body}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
              {club.hero.trust.map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <IconCheck className="h-4 w-4" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button as="a" href={clubJoinUrl("home_band")} external variant="ink" size="lg" icon={<IconArrow />}>
                {club.band.primary}
              </Button>
              <Link
                href="/coffee-club"
                className="inline-flex min-h-[44px] items-center px-1 font-medium underline decoration-2 underline-offset-4 transition-[text-underline-offset] duration-fast hover:underline-offset-8"
              >
                {club.band.secondary}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="mt-8 flex flex-wrap items-center gap-3 text-sm font-medium">
              <span>{club.hero.poweredBy}</span>
              <CoffeeStreamMark />
            </p>
          </Reveal>
        </div>

        <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <ClubScene title={club.band.cardTitle} caption={club.band.cardLeft(3)} label={club.band.imageAlt} />
        </div>
      </div>
    </Section>
  );
}
