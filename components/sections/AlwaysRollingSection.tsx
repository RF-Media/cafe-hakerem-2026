/**
 * "מה חדש" — the menu categories as a static, evenly-arranged card grid.
 *
 * Replaces the vertical split-flap board (2026-08-02/08-03): ten rows
 * stacked in a single column ran well below the fold at typical viewport
 * heights. A `<HorizontalRail>` pin-scroll pass was tried and reverted the
 * same day — for ten short text cards it burned far more scroll distance
 * than it needed to and left them stranded at the bottom edge of a mostly
 * empty section. A plain wrapping grid shows every category at once with
 * no scroll interaction at all — see CLAUDE.md's Decision Log for the full
 * reasoning. The content role is unchanged: this section still owns the
 * category index, distinct from the menu bento's dishes below it.
 */
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { IconArrow } from "@/components/ui/icons";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { container } from "@/components/ui/Section";
import type { MenuCategory } from "@/content/menu";

type AlwaysRollingSectionProps = {
  categories: MenuCategory[];
  eyebrow: string;
  title: string;
  subtitle: string;
  caption: string;
};

export function AlwaysRollingSection({
  categories,
  eyebrow,
  title,
  subtitle,
  caption,
}: AlwaysRollingSectionProps) {
  return (
    <section className="relative bg-espresso-deep text-cream py-20 md:py-28 overflow-hidden">
      <div className={container}>
        <Reveal>
          <Eyebrow tone="brass">{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 type-title text-3xl md:text-4xl max-w-xl">{title}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 type-lede text-base md:text-lg text-cream/75 max-w-md">{subtitle}</p>
        </Reveal>

        <Stagger
          className="mt-10 md:mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
          stagger={0.05}
        >
          {categories.map((cat, i) => (
            <StaggerItem key={cat.id} variant="tile">
              <Link
                href={`/menu#${cat.id}`}
                className={`group/card relative block h-full min-h-[132px] md:min-h-[152px]
                           overflow-hidden rounded-card border border-cream/15
                           transition-[border-color,transform] duration-fast
                           hover:border-brass/40 hover:-translate-y-1
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass
                           focus-visible:ring-offset-2 focus-visible:ring-offset-espresso-deep
                           ${cat.image ? "" : "bg-cream/5 hover:bg-cream/10"}`}
              >
                {cat.image && (
                  <>
                    <Image
                      src={cat.image}
                      alt={cat.imageAlt ?? ""}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                      quality={75}
                      className="object-cover"
                    />
                    {/* Dark curtain, at rest. Wipes away on hover/focus — the "swipe"
                        reveal — in the same right-to-left direction ImageReveal uses
                        for scroll reveals, so it reads as one house style. Reverses
                        on mouse-leave: the curtain redraws and the photo darkens. */}
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-b from-espresso-deep/85 to-espresso-deep/55
                                 [clip-path:inset(0_0_0_0)]
                                 transition-[clip-path] duration-slow ease-out-soft
                                 group-hover/card:[clip-path:inset(0_100%_0_0)]
                                 group-focus-visible/card:[clip-path:inset(0_100%_0_0)]"
                    />
                    {/* Permanent soft vignette behind the text only, independent of the
                        curtain above — once the curtain wipes fully clear, this is what
                        keeps the title readable against a bright, busy photo. */}
                    <span
                      aria-hidden
                      className="absolute inset-6 rounded-2xl bg-espresso-deep/50 blur-xl"
                    />
                  </>
                )}

                <div className="relative flex flex-col items-center justify-center gap-2 text-center h-full p-5">
                  <span
                    className={`type-index text-brass/70 transition-colors duration-fast
                               group-hover/card:text-brass
                               ${cat.image ? "[text-shadow:0_1px_6px_rgba(0,0,0,0.7)]" : ""}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={`type-sub text-base md:text-lg text-cream inline-flex items-center gap-2
                               transition-colors duration-fast group-hover/card:text-brass
                               ${cat.image ? "[text-shadow:0_1px_6px_rgba(0,0,0,0.7)]" : ""}`}
                  >
                    {cat.title.he}
                    {cat.id === "pastries" && (
                      <span aria-hidden="true" className="shrink-0">
                        🔥
                      </span>
                    )}
                  </span>

                  <IconArrow
                    className="w-4 h-4 text-brass opacity-0 transition-opacity duration-fast
                               group-hover/card:opacity-100"
                  />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.15}>
          <p className="mt-6 md:mt-8 text-xs md:text-sm text-cream/40">{caption}</p>
        </Reveal>
      </div>
    </section>
  );
}
