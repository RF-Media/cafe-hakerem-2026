/**
 * The temporary Hanukkah campaign: a compact card and the section it links to.
 * Both render only while `hanukkahCampaign.enabled` is on (see content/holidays.ts).
 */
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { IconArrow, IconSpark } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { hanukkahCampaign as c } from "@/content/holidays";

/** Nine lights, the shamash raised in the middle, set as the eyebrow's glyph.
 *  They light once on load, from the shamash outwards (`.candle-lit`), then
 *  hold still; both kill switches show them lit. */
function Hanukkiah({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 30" aria-hidden className={className}>
      <path d="M2 29.25h126" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
      {Array.from({ length: 9 }, (_, i) => {
        const cx = 9 + i * 14;
        const top = i === 4 ? 15 : 19.5;
        const delay = 400 + Math.abs(i - 4) * 130;
        return (
          <g key={i}>
            <rect x={cx - 1.25} y={top} width="2.5" height={29.25 - top} rx="0.75" fill="hsl(var(--cream))" fillOpacity="0.8" />
            <g className="candle-lit" style={{ animationDelay: `${delay}ms` }}>
              <circle cx={cx} cy={top - 5} r="5.5" fill="currentColor" fillOpacity="0.22" />
              <path
                d={`M${cx} ${top - 11} C${cx + 3.4} ${top - 6}, ${cx + 3} ${top - 1.2}, ${cx} ${top - 1.2} C${cx - 3} ${top - 1.2}, ${cx - 3.4} ${top - 6}, ${cx} ${top - 11} Z`}
                fill="currentColor"
              />
              <path
                d={`M${cx} ${top - 6.5} C${cx + 1.4} ${top - 4.2}, ${cx + 1.2} ${top - 2.2}, ${cx} ${top - 2.2} C${cx - 1.2} ${top - 2.2}, ${cx - 1.4} ${top - 4.2}, ${cx} ${top - 6.5} Z`}
                fill="hsl(var(--cream-3))"
              />
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Text on the start side, the sufganiyah centred in a lit halo on the end side,
 * fully inside the card. From `lg` the heading beside it is centred against it.
 */
export function HanukkahCard() {
  return (
    <div className="group relative isolate flex overflow-hidden rounded-card bg-espresso-deep text-cream shadow-lg">
      {/* Night: pine at the start corner, warmth gathering toward the halo. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_100%_0%,hsl(var(--olive)/0.55),transparent_60%),linear-gradient(to_left,transparent_35%,hsl(var(--brass)/0.08))]" />
      <div aria-hidden className="pointer-events-none absolute inset-1.5 rounded-[calc(var(--radius-card)-4px)] border border-brass/25" />

      <div className="flex w-full items-center gap-2 p-5 sm:gap-4 md:p-6 lg:py-4 lg:pe-3">
        <div className="min-w-0 flex-1">
          <p className="flex items-end gap-2.5 type-index text-xs text-brass">
            <span className="whitespace-nowrap">{c.section.eyebrow}</span>
            <Hanukkiah className="h-4 w-auto shrink-0 sm:h-5 md:h-6" />
          </p>
          <p className="type-title mt-2 text-balance text-[1.4rem] text-cream sm:text-2xl xl:text-[1.7rem]">{c.card.title}</p>
          <p className="mt-1 text-sm text-cream/85 md:text-base">{c.card.line}</p>
          <Button as="a" href={`#${c.anchor}`} variant="onDark" size="sm" icon={<IconArrow />} className="mt-4 lg:mt-3">
            {c.card.cta}
          </Button>
        </div>

        <div aria-hidden className="relative grid h-28 w-28 shrink-0 place-items-center sm:h-36 sm:w-36 xl:h-40 xl:w-40">
          <div className="absolute -inset-8 rounded-full bg-[radial-gradient(closest-side,hsl(var(--brass)/0.55),hsl(var(--brass)/0.16)_55%,transparent)]" />
          <div className="absolute inset-0 rounded-full border border-brass/30" />
          <div className="absolute inset-[11%] rounded-full border border-brass/15" />
          <IconSpark className="absolute end-[4%] top-[6%] h-3 w-3 text-brass" />
          <IconSpark className="absolute bottom-[10%] start-[2%] h-2 w-2 text-cream/80" />
          <IconSpark className="absolute start-[10%] top-[14%] h-1.5 w-1.5 text-brass/80" />
          <div className="relative h-[82%] w-[82%] transition-transform duration-base ease-out-soft group-hover:-translate-y-1 group-hover:-rotate-3">
            <Image
              src={c.image}
              alt=""
              fill
              sizes="(min-width: 1280px) 132px, (min-width: 640px) 118px, 92px"
              quality={80}
              className="object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HanukkahSection() {
  return (
    <Section tone="cream-3" id={c.anchor}>
      <div className="grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-14">
        <div>
          <Reveal>
            <SectionHeading eyebrow={c.section.eyebrow} title={c.section.title} className="!mb-0" />
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-4 max-w-prose-he text-base text-espresso-soft md:text-lg">{c.section.body}</p>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="relative mx-auto h-48 w-48 md:h-64 md:w-64">
          <Image src={c.image} alt={c.imageAlt} fill sizes="(max-width: 768px) 192px, 256px" quality={75} className="object-contain" />
        </Reveal>
      </div>
    </Section>
  );
}
