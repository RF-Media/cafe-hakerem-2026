/**
 * The two card shapes on /offers.
 *
 * `FeaturedOfferCard` renders the one headline promotion in CoffeeStream's own
 * sticker language (ink outline, hard offset shadow, cream-on-amber-adjacent
 * palette) — the same treatment `<ClubScene>` and the club page's cards use —
 * so the page's biggest moment reads as "this lives on your club card," not as
 * a generic discount banner. `OfferTile` is the plain-card shape for every
 * other promotion, light enough that five of them don't compete with it.
 */
import Link from "next/link";
import { clubJoinUrl } from "@/content/business";
import type { Offer } from "@/content/offers";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { IconArrow, IconCheck, IconClock, IconStamp } from "@/components/ui/icons";
import { OfferScene } from "./OfferScenes";

/** Time/day text is almost always a digit range with an en dash, which is a
 *  bidi neutral — "14:00–19:00" reverses inside RTL prose without this. */
function TimeWindow({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-cs-ink/80">
      <IconClock className="h-4 w-4 shrink-0" />
      <bdi dir="ltr">{children}</bdi>
    </span>
  );
}

function ExclusivityChip({ exclusivity }: { exclusivity: Offer["exclusivity"] }) {
  if (exclusivity === "club") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-pill border border-brass-ink/35 bg-cream-2 px-2.5 py-1 text-xs font-medium text-brass-ink">
        <IconStamp className="h-3.5 w-3.5" />
        לחברי המועדון
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-pill border border-stroke bg-cream-2 px-2.5 py-1 text-xs font-medium text-espresso-soft">
      לכולם
    </span>
  );
}

export function FeaturedOfferCard({ offer }: { offer: Offer }) {
  return (
    <div className="sticker relative overflow-hidden rounded-[22px] bg-cs-cream p-7 text-cs-ink md:p-10">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-3">
            <Eyebrow tone="ink" withRule>
              {offer.eyebrow}
            </Eyebrow>
          </div>
          <h2 className="mt-4 type-statement text-3xl md:text-5xl">{offer.title}</h2>
          <div className="mt-3">
            <TimeWindow>{offer.window}</TimeWindow>
          </div>
          <p className="mt-5 max-w-xl text-base leading-relaxed md:text-lg">{offer.lede}</p>

          {offer.perks ? (
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {offer.perks.map((perk) => (
                <li key={perk.label} className="rounded-[14px] border-2 border-cs-ink/70 bg-cs-cream px-4 py-3">
                  <span className="block text-sm text-cs-ink/75">{perk.label}</span>
                  <span className="type-sub text-xl tabular-nums">{perk.detail}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Button as="a" href={clubJoinUrl(`offers_${offer.id}`)} external variant="ink" size="lg" icon={<IconArrow />}>
              להצטרפות למועדון בחינם
            </Button>
            <Link
              href="/coffee-club"
              className="inline-flex min-h-[44px] items-center px-1 text-sm font-medium underline decoration-2 underline-offset-4 transition-[text-underline-offset] duration-fast hover:underline-offset-8"
            >
              איך המועדון עובד
            </Link>
          </div>

          {offer.note ? <p className="mt-5 text-sm text-cs-ink/70">{offer.note}</p> : null}
        </div>

        <div className="mx-auto w-full max-w-[220px] text-cs-ink/85 lg:col-span-5 lg:max-w-[260px]">
          <OfferScene variant={offer.illustration} />
        </div>
      </div>
    </div>
  );
}

export function OfferTile({ offer }: { offer: Offer }) {
  return (
    <div className="group flex h-full flex-col rounded-card border border-espresso/15 bg-cream p-6 transition-[transform,box-shadow] duration-base ease-out-soft hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <span className="h-16 w-16 shrink-0 text-olive/70 transition-transform duration-base ease-out-soft group-hover:-rotate-6">
          <OfferScene variant={offer.illustration} />
        </span>
        <ExclusivityChip exclusivity={offer.exclusivity} />
      </div>

      <Eyebrow tone="olive" className="mt-5" withRule>
        {offer.eyebrow}
      </Eyebrow>
      <h3 className="mt-2 type-sub text-xl text-espresso">{offer.title}</h3>
      <div className="mt-2">
        <TimeWindow>{offer.window}</TimeWindow>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-espresso-soft md:text-base">{offer.lede}</p>

      {offer.cta ? (
        <Link
          href={offer.cta.href}
          className="group/link mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-olive"
        >
          {offer.cta.label}
          <IconArrow className="h-4 w-4 transition-transform duration-fast ease-out-soft group-hover/link:-translate-x-1" />
        </Link>
      ) : offer.exclusivity === "club" ? (
        <Link
          href="/coffee-club"
          className="group/link mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-olive"
        >
          להצטרפות למועדון
          <IconArrow className="h-4 w-4 transition-transform duration-fast ease-out-soft group-hover/link:-translate-x-1" />
        </Link>
      ) : null}
    </div>
  );
}

export function ClubPointerTile({
  eyebrow,
  title,
  body,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <Link
      href="/coffee-club"
      className="group flex h-full flex-col justify-between rounded-card bg-amber p-6 text-cs-ink transition-[transform,background-color] duration-base ease-out-soft hover:-translate-y-1 hover:bg-amber-soft"
    >
      <div>
        <Eyebrow tone="ink" withRule>
          {eyebrow}
        </Eyebrow>
        <h3 className="mt-2 type-sub text-xl">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed md:text-base">{body}</p>
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
        <IconCheck className="h-4 w-4" />
        {cta}
        <IconArrow className="h-4 w-4 transition-transform duration-base ease-out-soft group-hover:-translate-x-1" />
      </span>
    </Link>
  );
}
