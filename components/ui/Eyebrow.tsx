import type { ReactNode } from "react";

export type EyebrowProps = {
  tone?: "olive" | "jachnun";
  withRule?: boolean;
  children: ReactNode;
  className?: string;
};

const tones = {
  olive:   "text-olive",
  jachnun: "text-jachnun",
};

export function Eyebrow({ tone = "olive", withRule = false, children, className = "" }: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] ${tones[tone]} ${className}`}
    >
      {withRule ? <span aria-hidden className="block w-8 h-px bg-stroke" /> : null}
      <span className="font-latin italic text-sm normal-case tracking-normal">
        {children}
      </span>
    </span>
  );
}
