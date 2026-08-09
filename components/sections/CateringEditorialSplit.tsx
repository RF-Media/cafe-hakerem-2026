/**
 * "מגשי אירוח" on the home page — an editorial split rather than the
 * numbered tile grid it replaces (four `№ 0{i}` tiles with no photo, no
 * capacity, no price, and two names — "מגש ישיבה"/"מגש קומבינציה" — that
 * didn't exist in the real catalog; see CLAUDE.md 2026-08-09 decision
 * log). One large featured tray card sits beside a compact list of the
 * rest, both driven directly by `catering.options` — home and `/catering`
 * now share one catalog, permanently.
 *
 * Server component: nothing here needs client state. Hover/touch/video
 * live entirely in `<VideoTestimonialAccordion>`, composed as its own
 * section right after this one.
 */
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CafeImage } from "@/components/ui/CafeImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconArrow } from "@/components/ui/icons";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { CateringOption } from "@/content/catering";

export type CateringEditorialSplitProps = {
  eyebrow: string;
  title: string;
  body: string;
  capacityStat: { lowValue: string; lowLabel: string; highValue: string; highLabel: string };
  cta: string;
  options: CateringOption[];
  featuredOptionId: string;
};

export function CateringEditorialSplit({
  eyebrow,
  title,
  body,
  capacityStat,
  cta,
  options,
  featuredOptionId,
}: CateringEditorialSplitProps) {
  const featured = options.find((o) => o.id === featuredOptionId) ?? options[0];
  const rest = options.filter((o) => o.id !== featured.id);

  return (
    <Section id="catering" tone="cream-2" spacing="md" ariaLabelledby="catering-heading">
      <SectionHeading
        id="catering-heading"
        eyebrow={eyebrow}
        title={title}
        description={body}
        action={
          <Button variant="primary" as="a" href="/catering" icon={<IconArrow />}>
            {cta}
          </Button>
        }
      />

      {/* Capacity range — redundant with `body`'s prose on purpose (§11
          Rule 5: same fact across formats). Numerals in `.type-sub`, not
          `.type-index` — these are values, not a label register, and not
          `.type-display`, which §5 reserves for the page's one <h1>. */}
      <Reveal>
        <div
          className="mb-6 md:mb-8 flex flex-wrap items-center gap-x-6 gap-y-3
                     rounded-card border border-stroke bg-cream-3 px-5 py-3 md:px-6 md:py-4"
        >
          <div className="flex items-baseline gap-2">
            <span className="type-sub text-3xl md:text-4xl text-espresso">
              {capacityStat.lowValue}
            </span>
            <span className="text-sm text-espresso-soft">{capacityStat.lowLabel}</span>
          </div>
          <span aria-hidden className="h-6 w-px bg-stroke" />
          <div className="flex items-baseline gap-2">
            <span className="type-sub text-3xl md:text-4xl text-espresso">
              {capacityStat.highValue}
            </span>
            <span className="text-sm text-espresso-soft">{capacityStat.highLabel}</span>
          </div>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* Featured tray — first in DOM, which in this RTL document lands
            at the visual right (the reading start). */}
        <Reveal className="md:col-span-7">
          <Link
            href={`/catering#${featured.id}`}
            className="group block rounded-card focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-cream-2"
          >
            <Card
              padding="md"
              tone="cream-3"
              hoverable
              elevation="raised"
              className="relative overflow-hidden"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-12 -start-12 w-72 h-72 rounded-full
                           bg-[radial-gradient(circle,hsl(var(--olive)/0.08),transparent_65%)] blur-2xl"
              />
              <ImageReveal className="rounded-card mb-5">
                <CafeImage
                  variant="tray"
                  src={featured.photo}
                  alt={`${featured.title.he} - מגש אירוח מומלץ של קפה הכרם`}
                  ratio="aspect-[16/9]"
                  tone="olive"
                  sizes="(max-width: 768px) 100vw, 55vw"
                />
              </ImageReveal>
              <Eyebrow tone="olive" withRule>
                המגש המומלץ
              </Eyebrow>
              <h3 className="mt-2 type-sub text-xl md:text-2xl text-espresso">
                {featured.title.he}
              </h3>
              <span
                className="mt-2 inline-flex items-center rounded-pill border border-brass-ink/40
                           bg-cream px-3 py-1 text-sm text-brass-ink"
              >
                {featured.serves}
              </span>
              <ul className="mt-4 space-y-1.5 text-base text-espresso-soft">
                {featured.includes.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span aria-hidden className="text-brass-ink">
                      ·
                    </span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
              {featured.fromPrice ? (
                <div className="mt-4 pt-3 border-t border-stroke flex items-baseline justify-between">
                  <span className="text-sm text-espresso-soft">מחיר</span>
                  <span className="type-sub text-xl text-brass-ink">{featured.fromPrice}</span>
                </div>
              ) : null}
            </Card>
          </Link>
        </Reveal>

        {/* Compact list of the remaining trays. */}
        <Stagger as="ul" className="md:col-span-5 flex flex-col gap-3" stagger={0.07}>
          {rest.map((o) => (
            <StaggerItem key={o.id} as="li">
              <Link
                href={`/catering#${o.id}`}
                className="block rounded-card focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-cream-2"
              >
                <Card
                  tone="cream"
                  padding="md"
                  className="border-r-2 border-r-transparent hover:border-r-olive/60
                             transition-colors duration-base ease-out-soft"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="type-sub text-lg text-espresso">{o.title.he}</div>
                      <p className="mt-1 text-sm text-espresso-soft line-clamp-1">
                        {o.includes[0]}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-pill border border-brass-ink/40 bg-cream-3
                                 px-2.5 py-1 text-xs text-brass-ink whitespace-nowrap"
                    >
                      {o.serves}
                    </span>
                  </div>
                </Card>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
