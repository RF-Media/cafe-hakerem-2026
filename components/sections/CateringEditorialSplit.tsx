/**
 * "מגשי אירוח" on the home page: the sage band, in the colour of the fluted
 * tile on the café's counter. Three equal 16:9 trays with title, description
 * and price lined up across the row, driven directly by `catering.options`, so
 * home and /catering share one catalog permanently (see the 2026-08-09 Decision Log).
 */
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CafeImage } from "@/components/ui/CafeImage";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconArrow } from "@/components/ui/icons";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { CateringOption } from "@/content/catering";

export type CateringEditorialSplitProps = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  options: CateringOption[];
  featuredOptionId: string;
};

export function CateringEditorialSplit({
  eyebrow,
  title,
  body,
  cta,
  options,
  featuredOptionId,
}: CateringEditorialSplitProps) {
  const featured = options.find((o) => o.id === featuredOptionId) ?? options[0];
  const ordered = [featured, ...options.filter((o) => o.id !== featured.id)];

  return (
    <Section id="catering" tone="sage" spacing="md" ariaLabelledby="catering-heading">
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

      <Stagger className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12" stagger={0.08}>
        {ordered.map((o) => (
          <StaggerItem key={o.id} variant="tile">
            <Link
              href={`/catering#${o.id}`}
              className="group flex h-full flex-col rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-sage"
            >
              <span className="zoom-frame block rounded-card">
                <CafeImage
                  variant="tray"
                  src={o.photo}
                  alt={`${o.title.he} - מגש אירוח של קפה הכרם`}
                  ratio="aspect-video"
                  position={o.photoPosition}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </span>
              <span className="mt-6 flex items-start justify-between gap-3">
                <span className="type-sub text-xl text-espresso transition-colors duration-fast group-hover:text-olive md:text-2xl">
                  {o.title.he}
                </span>
                <IconArrow className="mt-1.5 h-5 w-5 shrink-0 text-espresso transition-transform duration-base ease-out-soft group-hover:-translate-x-1" />
              </span>
              <span className="mt-2.5 block text-base leading-relaxed text-espresso-soft">
                {o.includes.join(", ")}
              </span>
              <span className="mt-auto flex flex-wrap items-center gap-2 pt-4 text-sm">
                <span className="rounded-pill bg-olive px-3 py-1 text-cream">{o.serves}</span>
                {o.fromPrice ? <span className="font-medium text-espresso">{o.fromPrice}</span> : null}
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
