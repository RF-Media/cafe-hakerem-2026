"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CafeImage } from "@/components/ui/CafeImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HorizontalRail } from "@/components/motion/HorizontalRail";
import { Reveal } from "@/components/motion/Reveal";
import { container } from "@/components/ui/Section";
import type { InstagramPost } from "@/content/instagram";

type InstagramGalleryProps = {
  items: InstagramPost[];
  eyebrow: string;
  title: string;
  lede: string;
  ctaLabel: string;
  instagramHandle?: string;
};

export function InstagramGallery({
  items,
  eyebrow,
  title,
  lede,
  ctaLabel,
  instagramHandle = "cafe.hakerem",
}: InstagramGalleryProps) {
  const itemCount = items.length;

  return (
    <div className="bg-espresso-deep text-cream py-20 md:py-28 relative overflow-hidden">
      {/* Intro section — contained, not full-bleed */}
      <div className={`${container} mb-12 md:mb-16`}>
        <Reveal>
          <Eyebrow tone="brass">{eyebrow}</Eyebrow>
        </Reveal>

        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start mt-6 md:mt-8">
          <div className="md:col-span-7">
            <Reveal delay={0.05}>
              <h2 className="type-title text-4xl md:text-5xl">{title}</h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-5 type-lede text-base md:text-lg text-cream/85 max-w-md">
                {lede}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-8 flex items-center gap-6">
                <a
                  href={`https://instagram.com/${instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/ig flex items-center gap-2 text-cream hover:text-brass transition-colors duration-fast"
                >
                  <span className="text-sm font-latin tracking-wide">{ctaLabel}</span>
                  <svg
                    className="w-4 h-4 group-hover/ig:translate-x-0.5 transition-transform duration-fast"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 12H5m7-7l-7 7 7 7"
                    />
                  </svg>
                </a>

                {/* Badge: "6 moments" */}
                <div className="text-xs font-latin tracking-[0.15em] text-cream/50">
                  {itemCount} {itemCount === 1 ? "moment" : "moments"}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Visual flourish: brass accent rule + a hairline box on desktop.
              It used to repeat `instagramSection.body` verbatim, which the
              lede two columns over already renders — the count is the one
              piece of information this corner can add. */}
          <div className="hidden md:block md:col-span-5">
            <Reveal delay={0.1}>
              <div className="flex flex-col items-end gap-4">
                <div className="h-px w-16 bg-brass/40" />
                <div className="rounded-card border border-cream/15 bg-cream/5 px-6 py-5 text-sm text-cream/60">
                  <div className="type-index text-brass mb-2">Gallery</div>
                  <p>
                    <span className="tabular-nums text-cream/80">{itemCount}</span> רגעים
                    אחרונים מהדלפק, מהמטבח ומהשולחנות בחוץ.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Carousel gallery — full-bleed, massive presence */}
      <HorizontalRail length={2.8} className="md:-mx-[calc((100vw_-_100%)/2)]">
        {items.map((post, i) => (
          <div key={i} className="shrink-0 snap-start">
            <a
              href={post.href ?? "#"}
              target={post.href ? "_blank" : undefined}
              rel={post.href ? "noopener noreferrer" : undefined}
              className="group/card block focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-espresso-deep rounded-card"
            >
              <div className="relative w-[70vw] sm:w-[45vw] md:w-[28vw] lg:w-[22vw]">
                {/* Border frame — elevated look */}
                <div className="absolute -inset-1 rounded-card border border-brass/20 group-hover/card:border-brass/40 transition-colors duration-base" />

                {/* Image */}
                <div className="relative rounded-card overflow-hidden bg-espresso-soft aspect-square">
                  <CafeImage
                    variant="instagram"
                    src={post.src}
                    alt={post.alt}
                    ratio="aspect-square"
                    sizes="(max-width: 768px) 70vw, 22vw"
                    className="opacity-90 group-hover/card:opacity-100 transition-opacity duration-base"
                  />

                  {/* Hover overlay — number + subtle scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso-deep/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-base flex items-end justify-start p-4">
                    <span className="font-latin text-xs tracking-[0.2em] text-brass">
                      № 0{i + 1}
                    </span>
                  </div>
                </div>

                {/* Caption below (optional metadata) — visible on hover desktop, always on mobile */}
                <div className="mt-3 opacity-0 group-hover/card:opacity-100 md:opacity-60 md:group-hover/card:opacity-100 transition-opacity duration-base">
                  <p className="text-xs text-cream/70 leading-relaxed">{post.alt}</p>
                </div>
              </div>
            </a>
          </div>
        ))}
      </HorizontalRail>

      {/* Mobile swipe hint — disappears after first scroll */}
      <MobileSwipeHint />
    </div>
  );
}

/** Hebrew, and the arrow points the way the rail actually travels — the
 *  previous version read "swipe" with a left-to-right arrow on an RTL page,
 *  pointing at the content the reader has already passed. */
function MobileSwipeHint() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShow(false);
    window.addEventListener("scroll", handleScroll, { once: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden
      className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-cream/70 flex items-center gap-1.5"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m9 7H4" />
      </svg>
      <span>החליקו לצדדים</span>
    </div>
  );
}
