/**
 * "הסופ״ש של הכרם": the general weekend teaser, on the home page.
 *
 * Covers both weekend staples — burekas (baked daily, not weekend-only)
 * and jachnun (genuinely Saturday-only, pre-order). This section sits
 * directly above `<JachnunPromo>`, which owns the jachnun-specific detail
 * (steps, deadline). The two chips read as "what's always here" / "what's
 * Saturday" rather than a numbered chapter sequence — the café's brief
 * explicitly asked to drop "Chapter A / Chapter B" framing. The second
 * chip is a real anchor into the Jachnun band below, not just a label.
 *
 * `tone="cream-3"` plus a low-opacity brass bloom (same technique as the
 * hero's) keep this visually distinct from the terracotta Jachnun band
 * immediately after it — brass is the site's "premium accent" per
 * CLAUDE.md §4, which fits a limited weekend special.
 */
import { Button } from "@/components/ui/Button";
import { CafeImage } from "@/components/ui/CafeImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { IconArrow, IconChevron } from "@/components/ui/icons";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { homePatisserie } from "@/content/home";

export function PatisserieSpecial() {
  return (
    <Section tone="cream-3" spacing="lg">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -start-16 w-72 h-72 rounded-full
                   bg-[radial-gradient(circle,hsl(var(--brass)/0.20),transparent_65%)] blur-2xl"
      />

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow tone="brass-ink" withRule>
              {homePatisserie.eyebrow}
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 type-title text-4xl md:text-5xl text-espresso">
              {homePatisserie.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 type-lede text-base md:text-lg text-espresso-soft max-w-lg">
              {homePatisserie.body}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-pill border border-brass-ink/40 bg-brass-ink/5 px-3 py-1 text-xs text-brass-ink font-medium tracking-wide">
                {homePatisserie.chapterCurrent}
              </span>
              <a
                href="#jachnun"
                className="group/next inline-flex items-center gap-1.5 rounded-pill border border-stroke px-3 py-1 text-xs text-espresso-soft
                           transition-colors duration-fast hover:text-jachnun hover:border-jachnun/40"
              >
                {homePatisserie.chapterNext}
                <IconChevron className="w-3.5 h-3.5 transition-transform duration-fast group-hover/next:translate-y-0.5" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8">
              <Button variant="secondary" as="a" href="/jachnun" icon={<IconArrow />}>
                {homePatisserie.cta}
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <ImageReveal className="rounded-card">
            <CafeImage
              variant="pastry"
              alt={homePatisserie.imageAlt}
              tone="brass"
              ratio="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </ImageReveal>
        </div>
      </div>
    </Section>
  );
}
