"use client";

/**
 * "רגעים מהשטח" — a row of fixed-footprint vertical (9:16) panels that
 * crossfade from a poster frame to a muted, looping video preview on
 * hover (desktop), focus (keyboard) or tap (touch). Built from scratch —
 * no accordion/testimonial component existed in this codebase before this
 * one; `<FAQBlock>`'s native `<details>` is the only prior accordion, and
 * it's an unrelated zero-JS pattern.
 *
 * This is foreground, user-initiated video, not the "video backgrounds"
 * CLAUDE.md §2 forbids — see the 2026-08-09 decision log entry for the
 * distinction. Concretely: muted, `preload="none"`, never plays until an
 * explicit interaction, paused via `IntersectionObserver` the instant the
 * section leaves the viewport, and inert under `prefers-reduced-motion`
 * (a static frame + a persistent tap-to-play affordance instead of
 * hover/focus-triggered playback).
 *
 * Deliberately a real `<button>` per panel rather than a `div role=button`
 * — a native button gets focus, `:focus-visible` and Enter/Space
 * activation for free, and a coarse pointer's tap naturally fires `click`
 * rather than `mouseenter`, so the same element serves mouse, keyboard and
 * touch without three parallel code paths.
 */
import { useEffect, useRef, useState } from "react";
import { CrossfadePanel } from "@/components/motion/CrossfadePanel";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { useHasFinePointer } from "@/components/motion/use-media-query";
import { CafeImage } from "@/components/ui/CafeImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { IconPlay } from "@/components/ui/icons";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { CateringTestimonial } from "@/content/testimonials";

export type VideoTestimonialAccordionProps = {
  eyebrow: string;
  title: string;
  lede?: string;
  items: CateringTestimonial[];
};

export function VideoTestimonialAccordion({
  eyebrow,
  title,
  lede,
  items,
}: VideoTestimonialAccordionProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const isFine = useHasFinePointer();
  const reducedMotion = useReducedMotion();
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Pause every clip the moment the section leaves the viewport. A plain
  // IntersectionObserver, not a scroll listener — §7 forbids the latter
  // (scroll hijacking) but not the former; <HorizontalRail> already uses
  // a ResizeObserver elsewhere in this codebase for the same "let the
  // browser own it" reason.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setActiveId(null);
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    for (const [id, video] of Object.entries(videoRefs.current)) {
      if (!video) continue;
      if (id === activeId) video.play().catch(() => {});
      else video.pause();
    }
  }, [activeId]);

  // Under prefers-reduced-motion, hover/focus become inert — only the
  // explicit play button (rendered below) may start playback.
  const open = (id: string) => {
    if (reducedMotion) return;
    setActiveId(id);
  };
  const close = (id: string) => {
    if (reducedMotion) return;
    setActiveId((cur) => (cur === id ? null : cur));
  };
  const toggle = (id: string) => setActiveId((cur) => (cur === id ? null : id));

  return (
    <Section tone="cream-3" spacing="sm">
      <Reveal>
        <Eyebrow tone="olive" withRule>
          {eyebrow}
        </Eyebrow>
      </Reveal>
      {/* `.type-title`, a full size register below the catering section's
          `.type-title` heading above it — §5's "supporting section drops a
          register" rule. */}
      <Reveal delay={0.05}>
        <h2 className="mt-3 type-title text-2xl md:text-3xl text-espresso">{title}</h2>
      </Reveal>
      {lede ? (
        <Reveal delay={0.1}>
          <p className="mt-2 max-w-prose-he text-sm md:text-base text-espresso-soft">{lede}</p>
        </Reveal>
      ) : null}

      <div ref={wrapperRef} className="mt-8 md:mt-10">
        <Stagger
          as="ul"
          className="flex gap-3 md:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          stagger={0.07}
        >
          {items.map((item) => {
            const isActive = activeId === item.id;
            const hasVideo = Boolean(item.videoSrc);
            return (
              <StaggerItem key={item.id} as="li" className="shrink-0 snap-start">
                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-disabled={!hasVideo}
                  aria-label={
                    hasVideo
                      ? `${item.eventType} - ${item.caption}`
                      : `${item.eventType} - ${item.caption} - הצילום בדרך`
                  }
                  onMouseEnter={() => isFine && hasVideo && open(item.id)}
                  onMouseLeave={() => isFine && hasVideo && close(item.id)}
                  onFocus={() => hasVideo && open(item.id)}
                  onBlur={() => hasVideo && close(item.id)}
                  onClick={() => hasVideo && toggle(item.id)}
                  className={
                    "group relative block w-[42vw] sm:w-[200px] md:w-[220px] aspect-[9/16] " +
                    "rounded-card overflow-hidden border border-stroke text-start " +
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive " +
                    "focus-visible:ring-offset-2 focus-visible:ring-offset-cream-3 " +
                    (hasVideo ? "cursor-pointer" : "cursor-default")
                  }
                >
                  <CrossfadePanel
                    isActive={isActive}
                    base={
                      <CafeImage
                        variant="testimonial"
                        src={item.posterPhoto}
                        alt={item.posterAlt}
                        ratio="aspect-[9/16]"
                        tone="olive"
                        className="h-full w-full"
                        sizes="(max-width: 768px) 42vw, 220px"
                      />
                    }
                    active={
                      hasVideo ? (
                        <video
                          ref={(el) => {
                            videoRefs.current[item.id] = el;
                          }}
                          src={item.videoSrc}
                          aria-label={item.videoAlt}
                          muted
                          loop
                          playsInline
                          preload="none"
                          className="h-full w-full object-cover"
                        />
                      ) : null
                    }
                  />

                  {/* Caption overlay — always visible, not gated by hover. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 p-3
                               bg-gradient-to-t from-espresso-deep/85 to-transparent"
                  >
                    <div className="type-index text-cream/70 text-[0.65rem]">
                      {item.eventType}
                    </div>
                    <p className="mt-1 text-sm text-cream leading-snug">{item.caption}</p>
                  </div>

                  {hasVideo ? (
                    reducedMotion ? (
                      <span
                        aria-hidden
                        className="absolute inset-0 grid place-items-center bg-espresso-deep/0
                                   group-hover:bg-espresso-deep/20 transition-colors duration-fast"
                      >
                        <span className="grid place-items-center w-11 h-11 rounded-full bg-cream/90 text-espresso">
                          <IconPlay className="w-4 h-4" />
                        </span>
                      </span>
                    ) : null
                  ) : (
                    <span
                      aria-hidden
                      className="absolute top-2 end-2 rounded-pill bg-espresso-deep/70 text-cream/80
                                 text-[0.65rem] px-2 py-0.5"
                    >
                      בקרוב בווידאו
                    </span>
                  )}
                </button>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
