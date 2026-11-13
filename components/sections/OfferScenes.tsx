/**
 * One hand-drawn scene per promotion on /offers — the same authored-line-art
 * approach as `components/ui/placeholders` (uniform 400×400 viewBox,
 * `currentColor` strokes, no `preserveAspectRatio`), but keyed to a promo
 * rather than a photo subject, so it lives beside the content it illustrates
 * instead of inside the general placeholder set `<CafeImage>` draws from.
 *
 * Decorative only — every call site already carries the real copy, so each
 * scene is `aria-hidden`.
 */
import type { OfferIllustrationKey } from "@/content/offers";

type Props = { className?: string };

const svg = "w-full h-full";
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** A clock reading 14→19, a glass of wine and a half-price second cup. */
function HappyHour({ className }: Props) {
  return (
    <svg viewBox="0 0 400 400" className={className ?? svg} aria-hidden focusable="false">
      <g {...stroke}>
        <circle cx="190" cy="170" r="100" />
        <path d="M190 100v70l54 32" />
        <path d="M190 58v16M190 266v16M106 170H90M290 170h-16" />
      </g>
      <g {...stroke} strokeWidth={2.4} opacity="0.75">
        <path d="M296 234l-20 70-10-2a26 26 0 0 1-20-31l9-39z" />
        <path d="M266 304h40M286 304v30" />
      </g>
      <g {...stroke} strokeWidth={2.4} opacity="0.55">
        <path d="M70 250h66v28a33 33 0 0 1-33 33 33 33 0 0 1-33-33z" />
        <path d="M136 258h14a16 16 0 0 1 0 32h-14" />
        <path d="M58 311h108" />
      </g>
    </svg>
  );
}

/** A candle on a slice of cake, with a ribboned gift box beside it. */
function Birthday({ className }: Props) {
  return (
    <svg viewBox="0 0 400 400" className={className ?? svg} aria-hidden focusable="false">
      <g {...stroke}>
        <path d="M120 230h160l-18 100H138z" />
        <path d="M120 230c0-26 24-30 24-50s-14-24-14-40M296 230c0-26-24-30-24-50s14-24 14-40" />
        <path d="M138 330h144" />
        <path d="M160 230v100M240 230v100" />
      </g>
      <g {...stroke} strokeWidth={2.6} opacity="0.7">
        <rect x="60" y="208" width="54" height="54" rx="4" />
        <path d="M60 235h54M87 208v54M87 208c-10-14-26-4-18 10 8 12 18-10 18-10zM87 208c10-14 26-4 18 10-8 12-18-10-18-10z" />
      </g>
    </svg>
  );
}

/** A croissant catching a morning sun, cup beside it. */
function Brunch({ className }: Props) {
  return (
    <svg viewBox="0 0 400 400" className={className ?? svg} aria-hidden focusable="false">
      <g {...stroke}>
        <path d="M70 220c30-56 110-78 168-48" />
        <path d="M70 220c-16 26 8 48 36 38M238 172c26-14 50 8 40 36" />
        <path d="M118 190l16 36M164 174l12 42M210 174l4 42" />
      </g>
      <g {...stroke} strokeWidth={2.4} opacity="0.6">
        <circle cx="300" cy="110" r="24" />
        <path d="M300 60v16M300 154v16M250 110h16M334 110h16M265 75l12 12M335 75l-12 12M265 145l12-12M335 145l-12 12" />
      </g>
      <g {...stroke} strokeWidth={2.6} opacity="0.75">
        <path d="M118 272h108v30a40 40 0 0 1-40 40h-28a40 40 0 0 1-40-40z" />
        <path d="M226 284h16a22 22 0 0 1 0 44h-16" />
      </g>
    </svg>
  );
}

/** Jachnun's coiled spiral, with a steaming cup beside it. */
function JachnunCoffee({ className }: Props) {
  return (
    <svg viewBox="0 0 400 400" className={className ?? svg} aria-hidden focusable="false">
      <g {...stroke}>
        <path d="M150 230a62 62 0 1 1 62 62" />
        <path d="M150 230a38 38 0 1 0 38 38" />
        <path d="M150 230a16 16 0 1 0 16 16" />
        <ellipse cx="150" cy="300" rx="100" ry="20" opacity="0.5" />
      </g>
      <g {...stroke} strokeWidth={2.6} opacity="0.75">
        <path d="M268 250h74v34a37 37 0 0 1-37 37h-8a37 37 0 0 1-37-37z" />
        <path d="M342 262h12a18 18 0 0 1 0 36h-12" />
        <path d="M284 210c9-9-9-18 0-27M318 210c9-9-9-18 0-27" />
      </g>
    </svg>
  );
}

/** An open book with a cup resting on it. */
function Student({ className }: Props) {
  return (
    <svg viewBox="0 0 400 400" className={className ?? svg} aria-hidden focusable="false">
      <g {...stroke}>
        <path d="M60 260V130c40-14 90-10 130 10v140c-40-20-90-24-130-10z" />
        <path d="M320 260V130c-40-14-90-10-130 10v140c40-20 90-24 130-10z" />
        <path d="M190 140v140" />
      </g>
      <g {...stroke} strokeWidth={2.6} opacity="0.75">
        <path d="M248 160h66v28a33 33 0 0 1-33 33 33 33 0 0 1-33-33z" />
        <path d="M314 168h12a16 16 0 0 1 0 32h-12" />
        <path d="M264 122c8-9-8-18 0-27M292 122c8-9-8-18 0-27" />
      </g>
    </svg>
  );
}

const scenes: Record<OfferIllustrationKey, (props: Props) => React.ReactNode> = {
  happyHour: HappyHour,
  birthday: Birthday,
  brunch: Brunch,
  jachnunCoffee: JachnunCoffee,
  student: Student,
};

export function OfferScene({ variant, className }: { variant: OfferIllustrationKey; className?: string }) {
  const Scene = scenes[variant];
  return <Scene className={className} />;
}
