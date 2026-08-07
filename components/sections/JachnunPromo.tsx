/**
 * The jachnun band on the home page.
 *
 * Replaces an earlier scroll-pinned version: three viewport-heights of
 * sticky scroll to reveal three lines of text, with nothing in it that
 * actually pushed a visitor toward ordering. This version is a single
 * ordinary section — deadline and CTA sit together in one card because
 * that pairing (what you get, and the clock you're on) is what moves
 * someone from reading to ordering. The three steps become supporting
 * proof underneath, not the whole show.
 *
 * All copy comes from `content/home.ts`. Entrances are plain `<Reveal>` /
 * `<Stagger>` — server-rendered content, motion only changes when it
 * paints in.
 */
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CafeImage } from "@/components/ui/CafeImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { IconArrow, IconClock } from "@/components/ui/icons";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { homeJachnun } from "@/content/home";

export function JachnunPromo() {
  return (
    <Section id="jachnun" tone="jachnun" spacing="lg">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow tone="cream" withRule>
              {homeJachnun.eyebrow}
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 type-title text-4xl md:text-5xl lg:text-6xl text-cream">
              {homeJachnun.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 type-lede text-base md:text-lg text-cream/80 max-w-lg">
              {homeJachnun.body}
            </p>
          </Reveal>

          {/* Deadline and CTA share one card on purpose — the clock a
              visitor is on and the button that beats it belong in the
              same glance, not three scroll-steps apart. */}
          <Reveal delay={0.18}>
            <Card
              tone="cream"
              elevation="floating"
              padding="md"
              className="mt-8 flex flex-wrap items-center gap-4 md:gap-6"
            >
              <span className="inline-flex items-center gap-2.5 text-espresso">
                <IconClock className="w-5 h-5 shrink-0 text-jachnun" />
                <span className="text-sm md:text-base font-medium">{homeJachnun.urgency}</span>
              </span>
              <Button
                as="a"
                href="/jachnun"
                variant="primary"
                icon={<IconArrow />}
                className="me-auto"
              >
                {homeJachnun.cta}
              </Button>
            </Card>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <ImageReveal className="rounded-card">
            <CafeImage
              variant="jachnun"
              src="/images/jachnun-band.jpg"
              alt="מגש ג'חנון תימני עם ביצה קשה, רסק עגבניות, סחוג, זיתים ומלפפונים חמוצים - כפי שמוגש בשבת בקפה הכרם"
              tone="jachnun"
              ratio="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </ImageReveal>
        </div>
      </div>

      <Stagger className="mt-14 md:mt-20 grid sm:grid-cols-3 gap-4 md:gap-5" stagger={0.09}>
        {homeJachnun.steps.map((step) => (
          <StaggerItem key={step.n} variant="tile">
            <Card tone="cream" padding="lg" className="h-full">
              <span className="type-index text-jachnun/70">
                {step.n}
              </span>
              <h3 className="mt-3 type-sub text-lg md:text-xl text-espresso">{step.title}</h3>
              <p className="mt-1.5 text-sm md:text-base leading-relaxed text-espresso-soft">
                {step.body}
              </p>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
