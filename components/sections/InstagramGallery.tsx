"use client";

import { useState } from "react";
import { CafeImage } from "@/components/ui/CafeImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { IconArrow, IconInstagram } from "@/components/ui/icons";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Section } from "@/components/ui/Section";
import { instagramCategories, type InstagramPost } from "@/content/instagram";
import { business } from "@/content/business";

type InstagramGalleryProps = {
  items: InstagramPost[];
  eyebrow: string;
  title: string;
  lede: string;
  ctaLabel: string;
};

/** Bento span pattern, keyed by position in the *filtered* list so the grid
 *  stays balanced no matter which category chip is active. `md:grid-flow-
 *  row-dense` packs around whatever spans are present, so a filtered list
 *  shorter than the pattern never leaves a hole. */
const SPAN_PATTERN = [
  "md:col-span-3 md:row-span-2",
  "md:col-span-3 md:row-span-1",
  "md:col-span-3 md:row-span-1",
  "md:col-span-2 md:row-span-1",
  "md:col-span-2 md:row-span-1",
  "md:col-span-2 md:row-span-1",
];

export function InstagramGallery({
  items,
  eyebrow,
  title,
  lede,
  ctaLabel,
}: InstagramGalleryProps) {
  const [active, setActive] = useState<string>(instagramCategories[0]);

  const tagged = items.map((post, originalIndex) => ({ ...post, originalIndex }));
  const filtered =
    active === instagramCategories[0] ? tagged : tagged.filter((p) => p.category === active);

  return (
    <Section tone="espresso">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <Eyebrow tone="brass">{eyebrow}</Eyebrow>
          <h2 className="mt-4 type-title text-4xl md:text-5xl">{title}</h2>
          <p className="mt-5 type-lede text-base md:text-lg text-cream/80">{lede}</p>
        </div>

        <a
          href={business.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="group/ig inline-flex shrink-0 items-center gap-2 self-start rounded-full
                     border border-cream/20 py-2.5 ps-4 pe-3 text-sm text-cream
                     transition-colors duration-fast hover:border-brass/50 hover:text-brass
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass
                     focus-visible:ring-offset-2 focus-visible:ring-offset-espresso-deep md:self-end"
        >
          <IconInstagram className="w-4 h-4" />
          <span className="font-latin tracking-wide">{ctaLabel}</span>
          <IconArrow className="w-3.5 h-3.5 transition-transform duration-fast group-hover/ig:-translate-x-0.5" />
        </a>
      </div>

      {/* Category filter — reads instagramCategories directly, so a new
          category added in content/instagram.ts shows up here with no
          component change. */}
      <div
        role="group"
        aria-label="סינון לפי קטגוריה"
        className="mt-8 md:mt-10 flex flex-wrap gap-2.5"
      >
        {instagramCategories.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(cat)}
              className={
                "min-h-[40px] rounded-full px-4 text-sm transition-colors duration-fast " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass " +
                "focus-visible:ring-offset-2 focus-visible:ring-offset-espresso-deep " +
                (isActive
                  ? "bg-brass text-espresso-deep font-medium"
                  : "border border-cream/20 text-cream/70 hover:border-brass/40 hover:text-cream")
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Bento gallery — restaggers on every filter change since `active`
          keys the container, giving each new set its own cascade-in rather
          than an abrupt swap. */}
      <Stagger
        key={active}
        stagger={0.06}
        className="mt-8 md:mt-10 grid grid-cols-2 md:grid-cols-6 md:auto-rows-[170px]
                   gap-4 md:gap-5 md:grid-flow-row-dense"
      >
        {filtered.map((post, i) => (
          <StaggerItem
            key={post.originalIndex}
            variant="tile"
            className={SPAN_PATTERN[i % SPAN_PATTERN.length]}
          >
            <a
              href={post.href ?? business.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={post.alt}
              className="group/tile relative block h-full aspect-square md:aspect-auto
                         overflow-hidden rounded-card border border-cream/15
                         transition-colors duration-base hover:border-brass/50
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass
                         focus-visible:ring-offset-2 focus-visible:ring-offset-espresso-deep"
            >
              <div className="absolute inset-0 transition-transform duration-slow ease-out-soft group-hover/tile:scale-105">
                <CafeImage
                  variant={post.variant}
                  src={post.src}
                  alt={post.alt}
                  ratio=""
                  className="h-full w-full"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t
                           from-espresso-deep/85 via-espresso-deep/0 to-transparent
                           opacity-0 transition-opacity duration-base group-hover/tile:opacity-100"
              />

              <span
                aria-hidden
                className="absolute top-3 end-3 font-latin text-xs tracking-[0.2em] text-brass
                           opacity-80"
              >
                № {String(i + 1).padStart(2, "0")}
              </span>

              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 p-4 text-xs leading-relaxed text-cream/90
                           opacity-0 translate-y-1 transition-[opacity,transform] duration-base
                           group-hover/tile:opacity-100 group-hover/tile:translate-y-0"
              >
                {post.alt}
              </span>
            </a>
          </StaggerItem>
        ))}
      </Stagger>

      <p className="mt-6 md:mt-8 text-xs md:text-sm text-cream/40">
        {items.length} רגעים אחרונים מהדלפק, מהמטבח ומהשולחנות בחוץ.
      </p>
    </Section>
  );
}
