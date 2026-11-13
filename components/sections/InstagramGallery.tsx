"use client";

/**
 * The photo grid, on porcelain, because these photos are the colour. Filter
 * chips re-key the grid, so each set cascades in instead of swapping abruptly.
 */
import { useState } from "react";
import { CafeImage } from "@/components/ui/CafeImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { IconArrow, IconInstagram } from "@/components/ui/icons";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Section } from "@/components/ui/Section";
import { instagramCategories, instagramSection, type InstagramPost } from "@/content/instagram";
import { business } from "@/content/business";
import { ev } from "@/lib/analytics";

type InstagramGalleryProps = {
  items: InstagramPost[];
  eyebrow: string;
  title: string;
  lede: string;
  ctaLabel: string;
};

/** Twelve photos fill a 12-column grid exactly: one large, nine tiles, and one
 *  wide slot for the landscape shot. A filtered set is short, so it just gets
 *  equal tiles. Every photo is portrait except the wide one, which is why the
 *  tiles are close to square rather than letterboxed. */
function span(i: number, count: number) {
  if (count <= 4) return "md:col-span-4 md:row-span-3";
  if (i === 0) return "md:col-span-6 md:row-span-4";
  if (i === 9) return "md:col-span-6 md:row-span-2";
  return "md:col-span-3 md:row-span-2";
}

export function InstagramGallery({ items, eyebrow, title, lede, ctaLabel }: InstagramGalleryProps) {
  const [active, setActive] = useState<string>(instagramCategories[0]);
  const filtered = active === instagramCategories[0] ? items : items.filter((p) => p.category === active);

  return (
    <Section tone="cream-3">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <Eyebrow tone="brass-ink" withRule>
            {eyebrow}
          </Eyebrow>
          <h2 className="mt-4 type-statement text-4xl md:text-6xl text-espresso">{title}</h2>
          <p className="mt-5 type-lede text-base md:text-lg text-espresso-soft">{lede}</p>
        </div>

        <a
          href={business.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="group/ig inline-flex min-h-[44px] shrink-0 items-center gap-2 self-start rounded-full
                     bg-espresso py-2.5 ps-4 pe-3 text-sm text-cream
                     transition-colors duration-fast hover:bg-olive
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive
                     focus-visible:ring-offset-2 focus-visible:ring-offset-cream-3 md:self-end"
        >
          <IconInstagram className="h-4 w-4" />
          <span>{ctaLabel}</span>
          <IconArrow className="h-3.5 w-3.5 transition-transform duration-fast group-hover/ig:-translate-x-0.5" />
        </a>
      </div>

      <div role="group" aria-label="סינון לפי קטגוריה" className="mt-8 flex flex-wrap gap-2.5 md:mt-10">
        {instagramCategories.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(cat)}
              {...ev("gallery_filter", { gallery_category: cat })}
              className={
                "min-h-[44px] cursor-pointer rounded-full px-5 text-sm transition-colors duration-fast " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive " +
                "focus-visible:ring-offset-2 focus-visible:ring-offset-cream-3 " +
                (isActive
                  ? "bg-olive font-medium text-cream"
                  : "border border-espresso/20 text-espresso-soft hover:border-espresso/50 hover:text-espresso")
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      <Stagger
        key={active}
        stagger={0.05}
        className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-flow-row-dense md:grid-cols-12 md:auto-rows-[150px] md:gap-4"
      >
        {filtered.map((post, i) => (
          <StaggerItem key={post.alt} variant="tile" className={span(i, filtered.length)}>
            <a
              href={post.href ?? business.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={post.alt}
              className="group relative block aspect-square h-full overflow-hidden rounded-card
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive
                         focus-visible:ring-offset-2 focus-visible:ring-offset-cream-3 md:aspect-auto"
            >
              <span className="zoom-frame absolute inset-0 block">
                <CafeImage
                  variant={post.variant}
                  src={post.src}
                  alt={post.alt}
                  ratio=""
                  className="!absolute inset-0 h-full w-full"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </span>
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-espresso-deep/85 to-transparent opacity-0 transition-opacity duration-base group-hover:opacity-100"
              />
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 translate-y-1 p-4 text-sm leading-snug text-cream opacity-0 transition-[opacity,transform] duration-base group-hover:translate-y-0 group-hover:opacity-100"
              >
                {post.alt}
              </span>
            </a>
          </StaggerItem>
        ))}
      </Stagger>

      <p className="mt-6 text-sm text-espresso-soft">{instagramSection.countLabel(items.length)}</p>
    </Section>
  );
}
