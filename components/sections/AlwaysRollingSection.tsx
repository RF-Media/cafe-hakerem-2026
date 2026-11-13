/**
 * "מה בא לכם היום?": the category index, as a photographic bento. Every one of
 * the ten categories has a real photo and links to its anchor on /menu.
 *
 * The photo stays clear at rest rather than behind a dark curtain: food sells
 * on sight, and the title gets its legibility from a gradient at the foot of
 * the tile alone. Hover zooms the photo, lifts in the category's line and turns
 * the arrow chip. Touch shows the same tile without the extras.
 */
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { IconArrow } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { imageTone } from "@/lib/image-meta";
import { ev } from "@/lib/analytics";
import type { MenuCategory } from "@/content/menu";

type AlwaysRollingSectionProps = {
  categories: MenuCategory[];
  eyebrow: string;
  title: string;
  cta: string;
  caption: string;
};

/** By position. `grid-flow-dense` packs them; 12 columns, 5 rows on desktop. */
const spans = [
  { cls: "col-span-2 aspect-[16/10] md:aspect-auto md:col-span-5 md:row-span-2", sizes: "(max-width: 768px) 100vw, 42vw" },
  { cls: "aspect-square md:aspect-auto md:col-span-3 md:row-span-2", sizes: "(max-width: 768px) 50vw, 25vw" },
  { cls: "aspect-square md:aspect-auto md:col-span-4", sizes: "(max-width: 768px) 50vw, 33vw" },
  { cls: "aspect-square md:aspect-auto md:col-span-4", sizes: "(max-width: 768px) 50vw, 33vw" },
  { cls: "aspect-square md:aspect-auto md:col-span-4 md:row-span-2", sizes: "(max-width: 768px) 50vw, 33vw" },
  { cls: "aspect-square md:aspect-auto md:col-span-4 md:row-span-2", sizes: "(max-width: 768px) 50vw, 33vw" },
  { cls: "aspect-square md:aspect-auto md:col-span-4", sizes: "(max-width: 768px) 50vw, 33vw" },
  { cls: "aspect-square md:aspect-auto md:col-span-4", sizes: "(max-width: 768px) 50vw, 33vw" },
  { cls: "aspect-square md:aspect-auto md:col-span-4", sizes: "(max-width: 768px) 50vw, 33vw" },
  { cls: "col-span-2 aspect-[16/9] md:aspect-auto md:col-span-8", sizes: "(max-width: 768px) 100vw, 66vw" },
];

export function AlwaysRollingSection({ categories, eyebrow, title, cta, caption }: AlwaysRollingSectionProps) {
  const menuButton = (
    <Button as="a" href="/menu" variant="primary" icon={<IconArrow />}>
      {cta}
    </Button>
  );

  return (
    <Section tone="cream" spacing="md">
      <SectionHeading eyebrow={eyebrow} title={title} action={menuButton} actionBelow />

      <Stagger
        className="grid grid-flow-dense grid-cols-2 gap-3 md:grid-cols-12 md:auto-rows-[200px] md:gap-4 lg:auto-rows-[220px]"
        stagger={0.05}
      >
        {categories.map((cat, i) => {
          const span = spans[i % spans.length];
          return (
            <StaggerItem key={cat.id} variant="tile" className={span.cls}>
              <Link
                href={`/menu#${cat.id}`}
                data-spot=""
                {...ev("menu_category_click", { menu_category: cat.id, ui_location: "home_categories" })}
                className="group relative block h-full overflow-hidden rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                style={{ backgroundColor: imageTone(cat.image) }}
              >
                <span className="zoom-frame absolute inset-0 block">
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.imageAlt ?? ""} fill sizes={span.sizes} quality={75} className="object-cover" style={cat.imagePosition ? { objectPosition: cat.imagePosition } : undefined} />
                  ) : null}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-espresso-deep/90 via-espresso-deep/25 to-transparent transition-opacity duration-base"
                />

                <span
                  aria-hidden
                  className="absolute end-3 top-3 hidden h-10 w-10 -translate-x-1 translate-y-1 place-items-center rounded-full bg-cream text-espresso opacity-0 shadow-sm
                             transition-[transform,opacity] duration-base ease-out-soft md:grid
                             group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <IconArrow className="h-4 w-4" />
                </span>

                <span className="absolute inset-x-0 bottom-0 block p-4 md:p-5">
                  <span aria-hidden className="type-index block text-brass">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-2 flex items-center gap-2 type-sub text-lg text-cream md:text-2xl">
                    {cat.title.he}
                    {cat.id === "pastries" ? <span aria-hidden>🔥</span> : null}
                  </span>
                  {cat.blurb ? (
                    <span
                      className="hidden max-w-sm text-sm leading-snug text-cream/90 md:block md:max-h-0 md:translate-y-2 md:overflow-hidden md:opacity-0
                                 md:transition-[max-height,opacity,transform,margin] md:duration-base md:ease-out-soft
                                 md:group-hover:mt-1.5 md:group-hover:max-h-16 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                    >
                      {cat.blurb}
                    </span>
                  ) : null}
                </span>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>

      <Reveal className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        {menuButton}
        <p className="text-sm text-espresso-soft">{caption}</p>
      </Reveal>
    </Section>
  );
}
