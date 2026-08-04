/**
 * "שלוש סיבות לבוא" — three reason cards, each carrying its own image
 * instead of the identical cream-3/brass-ink tile the section used to
 * repeat three times. All three rest light; the espresso-dark treatment is a
 * hover reveal on every card rather than a permanent state on one of them —
 * a dark card sitting still next to two light ones read as broken, not
 * intentional.
 */
import { Card } from "@/components/ui/Card";
import { CafeImage } from "@/components/ui/CafeImage";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { PlaceholderVariant } from "@/components/ui/placeholders";

type WhyVisitItem = { title: string; body: string; imageAlt: string };

type WhyVisitSectionProps = {
  eyebrow: string;
  title: string;
  items: WhyVisitItem[];
};

const cardStyle: {
  imageVariant: PlaceholderVariant;
  imageTone: "olive" | "brass";
  src?: string;
}[] = [
  { imageVariant: "cup", imageTone: "olive", src: "/images/barista.jpg" },
  { imageVariant: "pastry", imageTone: "brass" },
  { imageVariant: "map", imageTone: "olive", src: "/images/yard.jpg" },
];

export function WhyVisitSection({ eyebrow, title, items }: WhyVisitSectionProps) {
  return (
    <Section tone="cream-2">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <Stagger className="grid md:grid-cols-3 gap-5 md:gap-6" stagger={0.1}>
        {items.map((item, i) => {
          const style = cardStyle[i];
          return (
            <StaggerItem key={item.title} variant="tile">
              <Card
                padding="lg"
                hoverable
                tone="cream-3"
                className="group h-full hover:bg-espresso-deep hover:border-cream/10 hover:text-cream"
              >
                <div className="-mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-5 overflow-hidden rounded-t-card">
                  <ImageReveal>
                    <CafeImage
                      variant={style.imageVariant}
                      tone={style.imageTone}
                      src={style.src}
                      alt={item.imageAlt}
                      ratio="aspect-[4/3]"
                    />
                  </ImageReveal>
                </div>

                <div className="type-sub text-xl md:text-2xl">{item.title}</div>
                <p className="mt-2.5 text-base leading-relaxed text-espresso-soft transition-colors duration-base ease-out-soft group-hover:text-cream/75">
                  {item.body}
                </p>
              </Card>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
