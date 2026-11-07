/**
 * "שלוש סיבות": the pine band. Three 16:9 photos on one baseline, with a big
 * numeral catching the brass on hover.
 */
import { CafeImage } from "@/components/ui/CafeImage";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImageReveal } from "@/components/motion/ImageReveal";

type WhyVisitItem = {
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
};

type WhyVisitSectionProps = {
  eyebrow: string;
  title: string;
  items: WhyVisitItem[];
};

export function WhyVisitSection({ eyebrow, title, items }: WhyVisitSectionProps) {
  return (
    <Section tone="pine" spacing="md">
      <SectionHeading eyebrow={eyebrow} title={title} tone="dark" className="md:[&>div]:max-w-none" />
      <div className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
        {items.map((item, i) => (
          <article key={item.title} className="group">
            <ImageReveal delay={i * 0.08} className="rounded-card">
              <div className="zoom-frame">
                <CafeImage
                  variant="cup"
                  src={item.image}
                  alt={item.imageAlt}
                  ratio="aspect-video"
                  position={item.imagePosition}
                  className="!rounded-none"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </ImageReveal>
            <div className="mt-6 flex items-baseline gap-4">
              {/* Ghost numerals are CSS content: decoration, not text to read. */}
              <span
                aria-hidden
                data-n={i + 1}
                className="type-statement text-5xl text-cream/30 tabular-nums transition-colors duration-base before:content-[attr(data-n)] group-hover:text-brass"
              />
              <div>
                <h3 className="type-sub text-2xl text-cream">{item.title}</h3>
                <p className="mt-2.5 text-base leading-relaxed text-cream/85">{item.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
