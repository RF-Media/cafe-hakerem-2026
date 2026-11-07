/**
 * The club's illustration, redrawn from CoffeeStream's sign-in screen
 * (coffeestream/components/auth/LoginIllustration.tsx): a sticker-edged stamp
 * card, the till code on a phone, a reward sticker and two sparkles.
 *
 * One inline SVG, so the whole scene scales with its column and its text never
 * reflows. No state and no hooks: the server renders `<ClubScene>` on the home
 * band and the club hero, and `<PunchCalculator>` drives `<RewardScene>`. Nothing
 * here moves on its own. The only motion is a punch pressing in, or a sticker
 * landing, when the slider asks for one.
 */
import type { ComponentType, ReactNode } from "react";
import { business } from "@/content/business";
import type { ClubPerk } from "@/content/club";
import { IconCake, IconCookie, IconCup, IconGift, IconSpark } from "@/components/ui/icons";

const TOTAL = business.coffeestream.punchesRequired;
const SHADOW = { x: -5, y: 5 };

export const PERK_ICONS: Record<"gift" | "cookie" | "cake" | "cup", ComponentType<{ className?: string }>> = {
  gift: IconGift,
  cookie: IconCookie,
  cake: IconCake,
  cup: IconCup,
};

function Glyph({
  icon: Icon,
  cx,
  cy,
  size,
  className = "",
}: {
  icon: ComponentType<{ className?: string }>;
  cx: number;
  cy: number;
  size: number;
  className?: string;
}) {
  return (
    <svg x={cx - size / 2} y={cy - size / 2} width={size} height={size} className={className}>
      <Icon className="[stroke-width:2.2]" />
    </svg>
  );
}

/** What a perk shows inside a punch or on a sticker: its icon, or a mark like "20%". */
function PerkMark({ perk, cx, cy, size, className = "" }: { perk: ClubPerk; cx: number; cy: number; size: number; className?: string }) {
  if ("mark" in perk) {
    return (
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        direction="ltr"
        fontSize={size * 0.68}
        className={`fill-current font-black ${className}`}
      >
        {perk.mark}
      </text>
    );
  }
  return <Glyph icon={PERK_ICONS[perk.icon]} cx={cx} cy={cy} size={size} className={className} />;
}

function Stamp({ cx, cy, r, on, perk, fresh }: { cx: number; cy: number; r: number; on: boolean; perk?: ClubPerk; fresh: boolean }) {
  return (
    <g className={fresh ? "stamp-new" : undefined}>
      <circle
        cx={cx}
        cy={cy}
        r={r - 1.5}
        strokeWidth={on ? 3 : 2.5}
        strokeDasharray={on ? undefined : "5 5"}
        className={on ? `stroke-cs-ink ${perk ? "fill-cs-ink" : "fill-amber"}` : "fill-none stroke-cs-ink/35"}
      />
      {perk ? (
        <PerkMark perk={perk} cx={cx} cy={cy} size={r * 1.12} className={on ? "text-amber" : "text-cs-ink/30"} />
      ) : on ? (
        <Glyph icon={IconCup} cx={cx} cy={cy} size={r * 1.12} className="text-cs-ink" />
      ) : null}
    </g>
  );
}

function StampCard({
  x,
  y,
  width,
  rotate,
  filled,
  title,
  caption,
  perks = [],
  fresh,
}: {
  x: number;
  y: number;
  width: number;
  rotate: number;
  filled: number;
  title: string;
  caption: string;
  perks?: ClubPerk[];
  fresh?: number;
}) {
  const pad = 24;
  const gap = 10;
  const cols = TOTAL / 2;
  const d = (width - pad * 2 - gap * (cols - 1)) / cols;
  const gridTop = y + pad + 44 + 20;
  const height = gridTop - y + d * 2 + gap + pad;
  const right = x + width - pad;

  return (
    <g transform={`rotate(${rotate} ${x + width / 2} ${y + height / 2})`}>
      <rect x={x + SHADOW.x} y={y + SHADOW.y} width={width} height={height} rx={26} className="fill-cs-ink" />
      <rect x={x} y={y} width={width} height={height} rx={26} strokeWidth={3} className="fill-cs-cream stroke-cs-ink" />

      <rect x={right - 44} y={y + pad} width={44} height={44} rx={12} strokeWidth={3} className="fill-amber stroke-cs-ink" />
      <Glyph icon={IconCup} cx={right - 22} cy={y + pad + 22} size={22} className="text-cs-ink" />
      <text x={right - 56} y={y + pad + 18} className="fill-cs-ink text-[15px] font-bold">
        {title}
      </text>
      <text x={right - 56} y={y + pad + 38} className="fill-cs-ink text-[12px]">
        {caption}
      </text>
      <text x={x + pad} y={y + pad + 28} direction="ltr" className="fill-cs-ink text-[15px] font-black tabular-nums">
        {`${filled}/${TOTAL}`}
      </text>

      {/* Stamp 1 sits at the top right, the way the customer's own card runs. */}
      {Array.from({ length: TOTAL }, (_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <Stamp
            key={i}
            cx={right - d / 2 - col * (d + gap)}
            cy={gridTop + d / 2 + row * (d + gap)}
            r={d / 2}
            on={i < filled}
            perk={perks.find((p) => p.position === i + 1)}
            fresh={fresh !== undefined && i >= fresh && i < filled}
          />
        );
      })}
    </g>
  );
}

function Phone({
  x,
  y,
  width,
  height,
  rotate,
  ringY,
  progress,
  children,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  ringY: number;
  progress: number;
  children: ReactNode;
}) {
  const cx = x + width / 2;
  return (
    <g transform={`rotate(${rotate} ${cx} ${y + height / 2})`}>
      <rect x={x + SHADOW.x} y={y + SHADOW.y} width={width} height={height} rx={28} className="fill-cs-ink" />
      <rect x={x} y={y} width={width} height={height} rx={28} className="fill-cs-ink" />
      <rect x={x + 10} y={y + 10} width={width - 20} height={height - 20} rx={19} className="fill-cs-cream" />
      <rect x={cx - 20} y={y + 18} width={40} height={6} rx={3} className="fill-cs-ink/20" />
      <circle cx={cx} cy={ringY} r={23} strokeWidth={5} className="fill-none stroke-cs-ink/15" />
      <circle
        cx={cx}
        cy={ringY}
        r={23}
        strokeWidth={5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={`${progress} 1`}
        transform={`rotate(-90 ${cx} ${ringY})`}
        className="fill-none stroke-amber"
      />
      <Glyph icon={IconCup} cx={cx} cy={ringY} size={22} className="text-cs-ink" />
      {children}
    </g>
  );
}

/** A tile that lands when earned. Its dashed outline holds the spot until then. */
function Sticker({
  cx,
  cy,
  width,
  height,
  radius = 20,
  rotate,
  on = true,
  children,
}: {
  cx: number;
  cy: number;
  width: number;
  height: number;
  radius?: number;
  rotate: number;
  on?: boolean;
  children: ReactNode;
}) {
  const x = cx - width / 2;
  const y = cy - height / 2;
  return (
    <g transform={`rotate(${rotate} ${cx} ${cy})`}>
      <g className="text-cs-ink/30">
        <rect x={x} y={y} width={width} height={height} rx={radius} strokeWidth={2.5} strokeDasharray="5 5" className="fill-none stroke-cs-ink/35" />
        {children}
      </g>
      <g className="perk-sticker text-cs-ink" data-on={on ? "" : undefined}>
        <rect x={x + SHADOW.x} y={y + SHADOW.y} width={width} height={height} rx={radius} className="fill-cs-ink" />
        <rect x={x} y={y} width={width} height={height} rx={radius} strokeWidth={3} className="fill-amber stroke-cs-ink" />
        {children}
      </g>
    </g>
  );
}

function Spark({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <svg x={x} y={y} width={size} height={size} className="text-cs-ink">
      <IconSpark className="" />
    </svg>
  );
}

/** The login illustration itself, with the café's name on the card. Fixed at 7 of 10. */
export function ClubScene({
  title,
  caption,
  label,
  className = "",
}: {
  title: string;
  caption: string;
  label: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 440 440" role="img" aria-label={label} className={`h-auto w-full overflow-visible ${className}`}>
      <StampCard x={88} y={78} width={330} rotate={-3} filled={7} title={title} caption={caption} />
      <Phone x={34} y={226} width={150} height={196} rotate={6} ringY={304} progress={0.65}>
        <text
          x={109}
          y={366}
          textAnchor="middle"
          direction="ltr"
          letterSpacing="0.12em"
          className="fill-cs-ink text-[26px] font-black tabular-nums"
        >
          4827
        </text>
      </Phone>
      <Sticker cx={82} cy={60} width={84} height={84} radius={24} rotate={-10}>
        <Glyph icon={IconGift} cx={82} cy={60} size={36} />
      </Sticker>
      <Spark x={18} y={118} size={22} />
      <Spark x={380} y={328} size={16} />
    </svg>
  );
}

/* Where each perk's sticker lands, in the order they're earned: right to left,
   top row first. The last one is wide, because it's the point of the card. */
const SLOTS = [
  { cx: 390, cy: 318, width: 74, rotate: 6 },
  { cx: 302, cy: 314, width: 74, rotate: -7 },
  { cx: 214, cy: 320, width: 74, rotate: 5 },
  { cx: 390, cy: 408, width: 74, rotate: -5 },
  { cx: 262, cy: 408, width: 156, rotate: 3 },
];

/** The calculator's scene: the same parts, larger, and every result lands in it. */
export function RewardScene({
  filled,
  fresh,
  perks,
  title,
  caption,
  rewardLabel,
  yearly,
  yearlyLabel,
  everyLabel,
  label,
  className = "",
}: {
  filled: number;
  fresh?: number;
  perks: ClubPerk[];
  title: string;
  caption: string;
  rewardLabel: string;
  yearly: number;
  yearlyLabel: string;
  everyLabel: string;
  label: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 440 462" role="img" aria-label={label} className={`h-auto w-full overflow-visible ${className}`}>
      <StampCard x={14} y={14} width={412} rotate={-2} filled={filled} title={title} caption={caption} perks={perks} fresh={fresh} />

      <Phone x={20} y={262} width={136} height={186} rotate={5} ringY={321} progress={filled / TOTAL}>
        <text x={88} y={382} textAnchor="middle" direction="ltr" className="fill-cs-ink text-[32px] font-black tabular-nums">
          {yearly}
        </text>
        <text x={88} y={401} textAnchor="middle" className="fill-cs-ink text-[12px] font-medium">
          {yearlyLabel}
        </text>
        <text x={88} y={417} textAnchor="middle" className="fill-cs-ink text-[12px]">
          {everyLabel}
        </text>
      </Phone>

      {perks.map((perk, i) => {
        const slot = SLOTS[i];
        const wide = slot.width > 74;
        return (
          <Sticker
            key={perk.position}
            cx={slot.cx}
            cy={slot.cy}
            width={slot.width}
            height={74}
            rotate={slot.rotate}
            on={filled >= perk.position}
          >
            <PerkMark perk={perk} cx={wide ? slot.cx + 50 : slot.cx} cy={slot.cy} size={wide ? 32 : 36} />
            {wide ? (
              <text x={slot.cx + 26} y={slot.cy} dominantBaseline="central" className="fill-current text-[18px] font-bold">
                {rewardLabel}
              </text>
            ) : null}
          </Sticker>
        );
      })}

      <Spark x={2} y={0} size={18} />
      <Spark x={166} y={270} size={14} />
    </svg>
  );
}
