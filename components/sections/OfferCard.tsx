/**
 * The coupon shapes on /offers.
 *
 * `HappyHourCoupon` is the hero: the one real headline promotion, printed as a
 * ticket with the three values big enough to read from across the room and a
 * tear-off stub that holds the join button. `OfferTicket` is the same idea at
 * tile size for every other promotion: body on the start side, value on a
 * stub at the end. The stub's colour is the legend: amber is the club's,
 * pine is open to everyone.
 */
import Link from "next/link";
import { clubJoinUrl } from "@/content/business";
import { offers, type Offer } from "@/content/offers";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { IconArrow, IconClock, IconStamp } from "@/components/ui/icons";
import { HappyHourBadge } from "./HappyHourBadge";
import { OfferScene } from "./OfferScenes";

const TIME_RANGE = /(\d{1,2}:\d{2}–\d{1,2}:\d{2})/;

/** Wraps only the time ranges in LTR isolation. An en dash is a bidi neutral,
 *  so "14:00–19:00" reverses inside RTL text, while isolating the whole string
 *  would push the Hebrew words to the wrong end. */
export function TimeText({ children }: { children: string }) {
  return (
    <>
      {children.split(TIME_RANGE).map((part, i) =>
        i % 2 ? (
          <bdi key={i} dir="ltr">
            {part}
          </bdi>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** "50%" or "₪30" with the sign set small and high, the way a shelf tag prints
 *  it. Anything else ("חינם") renders as is. */
export function PromoValue({ value, className = "" }: { value: string; className?: string }) {
  const m = value.match(/^(₪?)(\d+)(%?)$/);
  if (!m) return <span className={className}>{value}</span>;
  const sign = "inline-block align-top text-[0.5em] leading-none mt-[0.14em]";
  return (
    <bdi dir="ltr" className={`whitespace-nowrap tabular-nums ${className}`}>
      {m[1] ? <span className={`${sign} me-[0.04em]`}>₪</span> : null}
      {m[2]}
      {m[3] ? <span className={`${sign} ms-[0.04em]`}>%</span> : null}
    </bdi>
  );
}

const BURST_POINTS = Array.from({ length: 36 }, (_, i) => {
  const r = i % 2 ? 43 : 50;
  const a = (i / 36) * Math.PI * 2;
  return `${(50 + r * Math.sin(a)).toFixed(2)},${(50 - r * Math.cos(a)).toFixed(2)}`;
}).join(" ");

/** A starburst price sticker. Decorative: what it says is also said in text. */
export function Burst({ big, small, className = "" }: { big: string; small: string; className?: string }) {
  return (
    <span aria-hidden className={`grid place-items-center ${className}`}>
      <svg viewBox="-4 -4 108 108" className="col-start-1 row-start-1 h-full w-full overflow-visible">
        <polygon points={BURST_POINTS} className="fill-cs-ink stroke-amber" strokeWidth={3} strokeLinejoin="round" />
      </svg>
      <span className="col-start-1 row-start-1 flex flex-col items-center leading-none text-amber">
        <span className="text-[0.7rem] font-medium md:text-xs">{small}</span>
        <span className="mt-0.5 type-sub text-lg font-bold md:text-xl">{big}</span>
      </span>
    </span>
  );
}

function OfferLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const cls =
    "group/link mt-4 inline-flex min-h-[44px] cursor-pointer items-center gap-2 self-start text-sm font-medium text-olive hover:text-espresso md:text-base";
  const body = (
    <>
      {label}
      <IconArrow className="h-4 w-4 transition-transform duration-fast ease-out-soft group-hover/link:-translate-x-1" />
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {body}
    </Link>
  );
}

function ExclusivityChip({ exclusivity }: { exclusivity: Offer["exclusivity"] }) {
  if (exclusivity === "club") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-cs-ink px-2.5 py-1 text-xs font-medium text-amber">
        <IconStamp className="h-3.5 w-3.5" />
        {offers.legend.club}
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center rounded-pill bg-olive px-2.5 py-1 text-xs font-medium text-cream">
      {offers.legend.all}
    </span>
  );
}

export function HappyHourCoupon({ offer }: { offer: Offer }) {
  const c = offers.heroCoupon;
  return (
    <div className="coupon-drop relative -rotate-1">
      <div className="ticket-y lg:ticket-x flex flex-col overflow-hidden rounded-[22px] bg-amber text-cs-ink [--tear:9rem] lg:flex-row lg:[--tear:12.5rem]">
        <div className="min-w-0 flex-1 p-6 pt-7 md:p-8">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-cs-ink px-3 py-1 text-xs font-medium text-amber">
            <IconStamp className="h-3.5 w-3.5" />
            {c.tag}
          </span>
          <h2 className="mt-4 type-title text-2xl md:text-3xl">{offer.title}</h2>
          <p className="mt-2 flex min-h-[1.5rem] flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium">
            <span className="inline-flex items-center gap-1.5">
              <IconClock className="h-4 w-4 shrink-0" />
              <TimeText>{offer.window}</TimeText>
            </span>
            <HappyHourBadge dotClassName="bg-olive" />
          </p>
          {offer.perks ? (
            <ul className="mt-6 grid grid-cols-3 divide-x-2 divide-x-reverse divide-dashed divide-cs-ink/30">
              {offer.perks.map((perk) => (
                <li key={perk.label} className="px-2 text-center">
                  <PromoValue value={perk.value} className="block type-statement text-[2.6rem] leading-none md:text-6xl lg:text-[3.4rem]" />
                  <span className="mt-2 block text-sm font-medium md:text-base">{perk.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex h-[var(--tear)] shrink-0 flex-col items-center justify-center gap-2 border-t-2 border-dashed border-cs-ink/30 bg-cs-cream px-5 text-center lg:h-auto lg:w-[var(--tear)] lg:border-s-2 lg:border-t-0">
          <span className="type-sub text-base">{c.stubLabel}</span>
          <Button as="a" href={clubJoinUrl("offers_hero")} external variant="ink" icon={<IconArrow />}>
            {c.stubCta}
          </Button>
          <span className="text-xs text-cs-ink/80">{c.stubNote}</span>
        </div>
      </div>

      <Burst
        big={c.burstBig}
        small={c.burstSmall}
        className="absolute -top-10 end-2 h-[4.75rem] w-[4.75rem] rotate-12 lg:-end-5 lg:-top-9 lg:h-[5.75rem] lg:w-[5.75rem]"
      />
    </div>
  );
}

export function OfferTicket({ offer }: { offer: Offer }) {
  const isClub = offer.exclusivity === "club";
  const cta = offer.cta
    ? { ...offer.cta, external: false }
    : isClub
      ? { label: "להצטרפות ולהטבה", href: clubJoinUrl(`offers_${offer.id}`), external: true }
      : null;

  return (
    <article data-track-area={`offer_${offer.id}`} className="ticket-shadow group h-full transition-transform duration-base ease-out-soft hover:-translate-y-1">
      <div className="ticket-x flex h-full overflow-hidden rounded-[18px] bg-cream-3 [--tear:6.75rem] md:[--tear:8.75rem]">
        <div className="flex min-w-0 flex-1 flex-col p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <span
              className={`grid h-16 w-16 shrink-0 place-items-center rounded-full transition-transform duration-base ease-out-soft group-hover:-rotate-6 md:h-20 md:w-20 ${
                isClub ? "bg-amber-wash text-cs-ink" : "bg-sage text-olive"
              }`}
            >
              <OfferScene variant={offer.illustration} className="h-[82%] w-[82%]" />
            </span>
            <ExclusivityChip exclusivity={offer.exclusivity} />
          </div>

          <Eyebrow tone="olive" className="mt-4" withRule>
            {offer.eyebrow}
          </Eyebrow>
          <h3 className="mt-2 type-sub text-xl text-espresso md:text-2xl">{offer.title}</h3>
          <p className="mt-2 inline-flex items-start gap-1.5 text-sm font-medium text-espresso-soft">
            <IconClock className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <TimeText>{offer.window}</TimeText>
            </span>
          </p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-espresso-soft md:text-base">{offer.lede}</p>
          {cta ? <OfferLink href={cta.href} label={cta.label} external={cta.external} /> : null}
        </div>

        <div
          className={`flex w-[var(--tear)] shrink-0 flex-col items-center justify-center border-s-2 border-dashed px-2 py-6 text-center ${
            isClub ? "border-cs-ink/30 bg-amber text-cs-ink" : "border-cream/40 bg-olive text-cream"
          }`}
        >
          <PromoValue value={offer.value.big} className="block type-statement text-[2rem] leading-none md:text-[2.75rem]" />
          <span className="mt-2 block text-xs font-medium leading-snug md:text-sm">{offer.value.small}</span>
        </div>
      </div>
    </article>
  );
}
