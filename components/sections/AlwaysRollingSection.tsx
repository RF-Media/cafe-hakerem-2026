/**
 * "מה חדש" — the menu categories as a split-flap departure board.
 *
 * The board itself is the point and stays: rows that flip into place on
 * scroll, each one a real link into its section of /menu. What changed on
 * 2026-08-03 is the *weight*, because this section was fighting the menu
 * bento directly beneath it —
 *
 *   1. rows sat at `.type-display` (900) / 30px, one step off the bento's
 *      own headings, so two adjacent sections read at the same volume;
 *   2. the frame stacked a brass radial bloom, a 2px brass gradient cap, a
 *      `bg-black/20` fill, a per-row hinge rule, a per-row gradient sheen
 *      and five hover transitions — decoration on top of the one effect
 *      that was actually doing the work;
 *   3. the bento repeated the same seven categories in a ticker and the
 *      words "Always rolling" in its eyebrow.
 *
 * So: rows drop to `.type-sub` (500), the heading drops a register below
 * the bento's, the decoration comes off, and the bento no longer lists
 * categories at all — it shows dishes now. The flap stays.
 */
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { IconArrow, IconFlame } from "@/components/ui/icons";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { container } from "@/components/ui/Section";
import type { MenuCategory } from "@/content/menu";

type AlwaysRollingSectionProps = {
  categories: MenuCategory[];
  eyebrow: string;
  title: string;
  subtitle: string;
  itemsLabel: string;
  caption: string;
};

export function AlwaysRollingSection({
  categories,
  eyebrow,
  title,
  subtitle,
  itemsLabel,
  caption,
}: AlwaysRollingSectionProps) {
  return (
    <section className="relative bg-espresso-deep text-cream py-20 md:py-28 overflow-hidden">
      <div className={`${container} relative z-10`}>
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-start">
          {/* Intro — sits beside the board on desktop, above it on mobile */}
          <div className="md:col-span-4">
            <Reveal>
              <Eyebrow tone="brass">{eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              {/* One register below the bento heading that follows. This
                  section supports; that one leads. */}
              <h2 className="mt-4 type-title text-2xl md:text-3xl">{title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 type-lede text-base text-cream/75 max-w-sm">{subtitle}</p>
            </Reveal>
          </div>

          {/* The board */}
          <div className="md:col-span-8">
            <Reveal delay={0.1}>
              <div className="rounded-card border border-cream/10 overflow-hidden [perspective:800px]">
                <Stagger as="ul" stagger={0.07}>
                  {categories.map((cat, i) => (
                    <StaggerItem key={cat.id} as="li" variant="flap" className="origin-top block">
                      <Link
                        href={`/menu#${cat.id}`}
                        className="group/row grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6
                                   px-5 md:px-8 py-4 md:py-5
                                   transition-colors duration-fast
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass
                                   focus-visible:ring-offset-2 focus-visible:ring-offset-espresso-deep
                                   [&:not(:last-child)]:border-b [&:not(:last-child)]:border-cream/10"
                      >
                        <span className="type-index text-brass/70 w-8 md:w-10 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        {/* Weight 500, not 900 — the flip is what makes this a
                            board; the type doesn't also have to shout. */}
                        <span className="type-sub text-lg md:text-2xl text-cream transition-colors duration-fast group-hover/row:text-brass inline-flex items-center gap-2">
                          {cat.title.he}
                          {cat.id === "pastries" && (
                            <IconFlame className="flame-flicker w-5 h-5 md:w-6 md:h-6 shrink-0" />
                          )}
                        </span>

                        <span className="flex items-center gap-3 shrink-0">
                          <span className="hidden md:inline text-xs text-cream/40 tabular-nums">
                            {cat.items.length} {itemsLabel}
                          </span>
                          <IconArrow className="w-4 h-4 text-brass opacity-0 transition-opacity duration-fast group-hover/row:opacity-100" />
                        </span>
                      </Link>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-4 text-xs md:text-sm text-cream/40 px-1">{caption}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
