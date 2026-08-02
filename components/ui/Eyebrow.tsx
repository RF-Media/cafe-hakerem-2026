import type { ReactNode } from "react";

export type EyebrowProps = {
  /** `jachnun` is for terracotta text on a light ground. On the terracotta
   *  BAND itself use `cream` — `jachnun` there is invisible. */
  tone?: "olive" | "jachnun" | "brass" | "cream";
  withRule?: boolean;
  children: ReactNode;
  className?: string;
};

const tones = {
  olive: { text: "text-olive", rule: "bg-olive/40" },
  jachnun: { text: "text-jachnun", rule: "bg-jachnun/40" },
  brass: { text: "text-brass", rule: "bg-brass/50" },
  cream: { text: "text-cream/80", rule: "bg-cream/40" },
} as const;

export function Eyebrow({
  tone = "olive",
  withRule = false,
  children,
  className = "",
}: EyebrowProps) {
  const t = tones[tone];
  return (
    <span className={`inline-flex items-center gap-3 ${t.text} ${className}`}>
      {withRule ? <span aria-hidden className={`block w-8 h-px ${t.rule}`} /> : null}
      {/* No italic: --font-latin is Noto Sans Hebrew, which has no italic
          cut, so the browser would synthesise a slanted fake. Uppercase +
          wide tracking carries the eyebrow role instead. */}
      <span className="font-latin text-xs uppercase tracking-[0.22em] font-medium">
        {children}
      </span>
    </span>
  );
}
