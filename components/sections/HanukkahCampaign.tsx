/**
 * The temporary Hanukkah campaign: a compact card and the section it links to.
 * Both render only while `hanukkahCampaign.enabled` is on (see content/holidays.ts).
 */
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { IconArrow } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { hanukkahCampaign as c } from "@/content/holidays";

export function HanukkahCard() {
  return (
    <div className="relative flex items-center gap-4 rounded-card border border-brass/30 bg-espresso-deep p-4 text-cream shadow-md md:gap-5 md:p-5">
      <div className="min-w-0 flex-1">
        <p className="type-sub text-lg text-cream md:text-xl">{c.card.title}</p>
        <p className="mt-1 text-sm text-cream/85">{c.card.line}</p>
        <Button as="a" href={`#${c.anchor}`} variant="onDark" size="sm" icon={<IconArrow />} className="mt-3">
          {c.card.cta}
        </Button>
      </div>
      <div className="relative h-24 w-24 shrink-0 md:h-28 md:w-28">
        <Image src={c.image} alt="" fill sizes="112px" quality={80} className="object-contain drop-shadow-lg" />
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
