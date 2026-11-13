/**
 * The hero every inner page shares, one per colour world.
 *
 * The <h1> holds a small kicker with the entity and location, then the line
 * people actually read, so every page's main heading carries its local keyword
 * (§10) without the headline turning into a keyword string. Its reveal is CSS
 * keyframes, so it paints from the SSR HTML (§7 hard rule 1).
 *
 * Deliberately short: a menu or a form sits right below it, and a hero taller
 * than the screen pushes the reason someone came below the fold.
 */
import NextImage from "next/image";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { CafeImage } from "@/components/ui/CafeImage";
import { container } from "@/components/ui/Section";
import { SplitText } from "@/components/motion/SplitText";
import { imageTone } from "@/lib/image-meta";

export type PageHeroTone = "espresso" | "pine" | "jachnun" | "sage";

const tones: Record<PageHeroTone, { ground: string; text: string; lede: string; kicker: string; dark: boolean }> = {
  espresso: { ground: "bg-espresso-deep", text: "text-cream", lede: "text-cream/85", kicker: "text-brass", dark: true },
  pine: { ground: "bg-olive", text: "text-cream", lede: "text-cream/85", kicker: "text-brass", dark: true },
  jachnun: { ground: "bg-jachnun", text: "text-cream", lede: "text-cream", kicker: "text-cream", dark: true },
  sage: { ground: "bg-sage", text: "text-espresso", lede: "text-espresso", kicker: "text-olive", dark: false },
};

export function PageHero({
  tone,
  crumbs,
  kicker,
  title,
  lede,
  image,
  imageAlt,
  imagePosition,
  bleed,
  children,
}: {
  tone: PageHeroTone;
  crumbs: BreadcrumbItem[];
  kicker: string;
  title: string;
  lede: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  /** Runs the one photo full-bleed against the section's own edge, split
   *  evenly with the text, instead of boxed inside the shared container like
   *  every other page's hero. The photo itself is never cut into separate
   *  crops — just the one image, `imagePosition` picking what survives the
   *  responsive crop (e.g. `"50% 0%"` to always keep the top in frame). */
  bleed?: boolean;
  /** Buttons, chips, facts: whatever the page needs under the lede. */
  children?: React.ReactNode;
}) {
  const t = tones[tone];

  const textBlock = (
    <>
      <h1 className="type-display">
        <span className={`hero-fade mb-5 block type-index ${t.kicker}`} style={{ ["--d" as never]: 0 }}>
          {kicker}
        </span>{" "}
        <span className="block text-[2.75rem] leading-[1.03] md:text-6xl lg:text-7xl">
          <SplitText text={title} delay={70} />
        </span>
      </h1>
      <p
        className={`hero-fade mt-6 max-w-prose-he type-lede text-sm md:text-lg ${t.lede}`}
        style={{ ["--d" as never]: 340 }}
      >
        {lede}
      </p>
      {children ? (
        <div className="hero-fade mt-7" style={{ ["--d" as never]: 480 }}>
          {children}
        </div>
      ) : null}
    </>
  );

  // A one-off layout for a page whose photo is the point: the single image
  // runs full-bleed against the section's own edge, split evenly with the
  // text, rather than boxed inside the shared container like every other
  // page's hero.
  if (bleed) {
    return (
      <section data-track-area="page_hero" className={`relative isolate overflow-hidden ${t.ground} ${t.text}`}>
        <div className="grid md:grid-cols-2 md:items-stretch">
          <div className="order-2 px-6 pb-10 pt-8 md:order-1 md:px-10 md:py-14 lg:px-16 lg:py-20">
            <Breadcrumb items={crumbs} tone={t.dark ? "dark" : "light"} bare />
            <div className="mt-8 md:mt-10">{textBlock}</div>
          </div>

          <div
            className="relative order-1 min-h-[320px] md:order-2 md:min-h-[480px]"
            style={{ backgroundColor: imageTone(image) }}
          >
            <NextImage
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="50vw"
              quality={80}
              className="hero-fade object-cover"
              style={{ ["--d" as never]: 200, ...(imagePosition ? { objectPosition: imagePosition } : {}) }}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-track-area="page_hero" className={`relative isolate overflow-hidden ${t.ground} ${t.text}`}>
      <div className={`${container} pt-6`}>
        <Breadcrumb items={crumbs} tone={t.dark ? "dark" : "light"} bare />
        <div className="mt-8 grid items-end gap-10 md:mt-6 md:grid-cols-12 lg:gap-16">
          <div className="pb-2 md:col-span-7 md:pb-16 lg:pb-20">{textBlock}</div>

          {/* Shown at every width. Hidden on phones it would still be preloaded,
              because `priority` doesn't know about `display: none`. */}
          <div className="flex justify-center self-end pb-6 md:col-span-5 md:pb-2">
            <div className="hero-fade w-full md:max-w-[420px]" style={{ ["--d" as never]: 200 }}>
              <CafeImage
                variant="interior"
                src={image}
                alt={imageAlt}
                priority
                position={imagePosition}
                ratio="aspect-[16/10] md:aspect-[4/5]"
                className="!rounded-b-none shadow-lg"
                sizes="(max-width: 768px) 92vw, 420px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
