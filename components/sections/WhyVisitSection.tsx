/**
 * "שלוש סיבות לבוא" — three reason cards, each carrying its own image
 * instead of the identical cream-3/brass-ink tile the section used to
 * repeat three times. Hover is the plain `<Card hoverable>` lift only —
 * no color inversion.
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
  { imageVariant: "pastry", imageTone: "brass", src: "/images/bread.jpg" },
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
              <Card padding="lg" hoverable tone="cream-3" className="h-full">
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
                <p className="mt-2.5 text-base leading-relaxed text-espresso-soft">
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
