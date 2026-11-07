"use client";

/**
 * "How fast does your habit fill the card?" The interactive centre of
 * /coffee-club: it answers the one question someone actually has before signing
 * up, which is whether the card is worth it at the rate they drink coffee. Every
 * result lands in the illustration: punches, stickers, and the numbers on the phone.
 *
 * A native range input, so keyboard and screen readers work with nothing added.
 * The sums rely only on ten punches to a free coffee. The perks come from
 * `club.calculator.perks`.
 */
import { useRef, useState, type ReactNode } from "react";
import { business, clubJoinUrl } from "@/content/business";
import { club } from "@/content/club";
import { Button } from "@/components/ui/Button";
import { IconArrow } from "@/components/ui/icons";
import { PERK_ICONS, RewardScene } from "@/components/club/StampScene";

const TOTAL = business.coffeestream.punchesRequired;
const MIN = 1;
const MAX = 14;
const c = club.calculator;

export function PunchCalculator({ heading }: { heading: ReactNode }) {
  const [cups, setCups] = useState(5);
  const previous = useRef(5);

  const days = Math.max(1, Math.round((TOTAL / cups) * 7));
  const perYear = Math.floor((cups * 52) / TOTAL);
  const filled = Math.min(cups, TOTAL);
  const fresh = cups > previous.current ? previous.current : undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-8">
      <div className="lg:col-span-5">{heading}</div>

      {/* Pinned, and capped to the viewport, so the whole scene stays in view
          while the slider moves. Stacked above the slider on a phone. */}
      <div className="mx-auto w-full max-w-[480px] lg:sticky lg:top-24 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:max-w-[calc((100svh-7rem)*0.95)] lg:self-start">
        <RewardScene
          filled={filled}
          fresh={fresh}
          perks={c.perks}
          title={club.band.cardTitle}
          caption={c.cardCaption(TOTAL - filled, cups - filled)}
          rewardLabel={business.coffeestream.reward.he}
          yearly={perYear}
          yearlyLabel={c.phoneYear}
          everyLabel={c.phoneEvery(c.every(days))}
          label={c.sceneLabel(filled, TOTAL)}
        />
      </div>

      <div className="lg:col-span-5 lg:row-start-2">
        <label htmlFor="cups" className="block type-sub text-2xl md:text-3xl">
          {c.perWeek(cups)}
        </label>
        <input
          id="cups"
          type="range"
          min={MIN}
          max={MAX}
          step={1}
          value={cups}
          aria-valuetext={c.perWeek(cups)}
          style={{ ["--fill" as never]: `${((cups - MIN) / (MAX - MIN)) * 100}%` }}
          onChange={(e) => {
            previous.current = cups;
            setCups(Number(e.target.value));
          }}
          className="cs-range mt-3 w-full"
        />

        <dl aria-live="polite" className="mt-5 divide-y divide-cs-ink/20 border-y border-cs-ink/20">
          <div className="flex items-baseline justify-between gap-4 py-3.5">
            <dt className="text-sm font-medium">{c.everyLabel}</dt>
            <dd className="type-statement text-3xl tabular-nums md:text-4xl">{c.every(days)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-3.5">
            <dt className="text-sm font-medium">{c.yearLabel}</dt>
            <dd className="type-statement text-3xl tabular-nums md:text-4xl">{c.year(perYear)}</dd>
          </div>
        </dl>

        <h3 className="mt-6 type-index text-sm">{c.perksLabel}</h3>
        <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
          {c.perks.map((perk) => {
            const on = filled >= perk.position;
            const Icon = "icon" in perk ? PERK_ICONS[perk.icon] : null;
            return (
              <li key={perk.position} className={`flex items-center gap-2.5 text-sm leading-snug ${on ? "font-bold" : ""}`}>
                <span
                  aria-hidden
                  className={
                    "grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-xs font-black transition-colors duration-fast " +
                    (on ? "bg-cs-ink text-amber" : "border-2 border-dashed border-cs-ink/45 text-cs-ink/70")
                  }
                >
                  {Icon ? <Icon className="h-5 w-5" /> : "mark" in perk ? <span dir="ltr">{perk.mark}</span> : null}
                </span>
                <span>
                  <span className="sr-only">{on ? c.perkOn : c.perkOff}: </span>
                  {perk.label}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="mt-5 text-sm leading-relaxed">{c.note}</p>

        <div className="mt-6">
          <Button as="a" href={clubJoinUrl("club_calculator")} external variant="ink" size="lg" icon={<IconArrow />}>
            {c.cta}
          </Button>
        </div>
      </div>
    </div>
  );
}
