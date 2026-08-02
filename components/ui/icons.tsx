/**
 * The site's icon set — hand-authored, one consistent 24×24 grid,
 * `currentColor` throughout. Small enough to inline; a library would add a
 * dependency for eight glyphs.
 */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
};

const size = "w-5 h-5";

export function IconMenu({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** Points visually LEFT — the "forward" direction in Hebrew. */
export function IconArrow({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? "w-4 h-4"}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function IconPhone({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />
    </svg>
  );
}

export function IconPin({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function IconWhatsapp({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <path d="M3.5 20.5l1.3-4a8 8 0 1 1 3 2.9z" />
      <path d="M9 9.2c.2 1.2.7 2.3 1.6 3.2.9.9 2 1.4 3.2 1.6" />
    </svg>
  );
}

export function IconClock({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

export function IconCup({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <path d="M5 9h11v5.5A4.5 4.5 0 0 1 11.5 19h-2A4.5 4.5 0 0 1 5 14.5z" />
      <path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 6c1-1-1-2 0-3M12 6c1-1-1-2 0-3" />
    </svg>
  );
}
