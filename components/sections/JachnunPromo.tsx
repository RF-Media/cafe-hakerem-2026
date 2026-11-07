/**
 * The jachnun band on the home page: the loudest colour on the site, because
 * it is the café's most distinctive product. Two photos overlap at
 * different speeds. Deadline and CTA share one card on purpose: the clock a
 * visitor is on and the button that beats it belong in the same glance. The
 * three steps below draw a line across as they arrive.
 */
import { Button } from "@/components/ui/Button";
import { CafeImage } from "@/components/ui/CafeImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { IconArrow } from "@/components/ui/icons";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { JachnunCountdown } from "@/components/sections/JachnunCountdown";
import { homeJachnun } from "@/content/home";

export function JachnunPromo() {
  return (
    <Section id="jachnun" tone="jachnun" spacing="lg" className="overflow-hidden">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow tone="cream" withRule>
              {homeJachnun.eyebrow}
            </Eyebrow>
          </Reveal>
          <h2 className="mt-5 type-statement text-5xl md:text-6xl lg:text-7xl text-cream">
            <SplitReveal text={homeJachnun.title} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl type-lede text-lg md:text-xl text-cream">{homeJachnun.body}</p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 inline-flex max-w-full flex-wrap items-center gap-4 rounded-card bg-cream p-4 pe-4 text-espresso shadow-lg md:gap-6 md:p-5">
              <JachnunCountdown
                prefix={homeJachnun.countdownPrefix}
                fallback={homeJachnun.urgency}
                className="text-jachnun"
              />
              <Button as="a" href="/jachnun#order" variant="primary" icon={<IconArrow />}>
                {homeJachnun.cta}
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-4 text-sm font-medium text-cream">{homeJachnun.priceFrom}</p>
          </Reveal>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:col-span-5">
          <Parallax speed={0.1}>
            <ImageReveal className="rounded-card shadow-lg">
              <CafeImage
                variant="jachnun"
                src={homeJachnun.image}
                alt={homeJachnun.imageAlt}
                ratio="aspect-[4/5]"
                className="!rounded-none"
                position="35% 50%"
                sizes="(max-width: 1024px) 90vw, 40vw"
              />
            </ImageReveal>
          </Parallax>
          <Parallax speed={-0.14} className="absolute -bottom-8 -start-6 w-[46%] md:-start-12">
            <Reveal distance={32} delay={0.2} className="rotate-3 transition-transform duration-slow ease-out-soft hover:rotate-0">
              <CafeImage
                variant="pastry"
                src={homeJachnun.imageSecond}
                alt={homeJachnun.imageSecondAlt}
                ratio="aspect-square"
                className="border-4 border-cream shadow-lg"
                sizes="(max-width: 1024px) 45vw, 20vw"
              />
            </Reveal>
          </Parallax>
        </div>
      </div>

      <Stagger className="relative mt-20 grid gap-8 sm:grid-cols-3 md:mt-28" stagger={0.09}>
        {homeJachnun.steps.map((step, i) => (
          <StaggerItem key={step.n} variant="slide" className="relative border-t-2 border-cream/40 pt-5">
            <span className="type-statement text-4xl text-amber tabular-nums">{i + 1}</span>
            <h3 className="mt-2 type-sub text-xl text-cream md:text-2xl">{step.title}</h3>
            <p className="mt-1.5 text-base leading-relaxed text-cream">{step.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
