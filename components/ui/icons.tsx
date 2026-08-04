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

/** Down caret — expandability indicator for dropdown/disclosure triggers.
 *  Not RTL-sensitive (points down, not "forward"); rotate 180° via the
 *  caller's className when open. */
export function IconChevron({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? "w-4 h-4"}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconInstagram({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="16.6" cy="7.4" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Filled, not stroked, and deliberately NOT `currentColor` — a flame only
 *  reads as fire if it's actually red/orange, so it carries its own
 *  gradient rather than the brass/olive accent set in CLAUDE.md §4.
 *  Two tongues (a tall main body + a smaller side wisp, the wisp being the
 *  main body's own path scaled/shifted — not new curve data, so it can't
 *  come out malformed) plus a true cut-out core so whatever sits behind
 *  the icon shows through, matching the reference mark. Pair with the
 *  `.flame-flicker` CSS animation (globals.css) for the idle loop; the
 *  icon alone is a static mark. Single instance on the page today, so the
 *  gradient id is hardcoded rather than generated. */
export function IconFlame({ className }: IconProps) {
  const body =
    "M12.9 2c.6 2.1-.3 3.4-1.7 4.9-1.7 1.8-3 3.6-3 6A3.8 3.8 0 0 0 12 16.7a3.8 3.8 0 0 0 3.8-3.8c0-1-.3-1.7-.7-2.4 1.4 1 2.4 2.7 2.4 4.7A5.5 5.5 0 0 1 12 20.7a5.5 5.5 0 0 1-5.5-5.5c0-2.3.9-3.8 2.1-5.4C10.3 7.4 12 5.7 12.9 2z";
  const core =
    "M12.2 9.6c.3 1-.1 1.7-.8 2.4-.7.7-1.2 1.5-1.2 2.5a1.9 1.9 0 0 0 1.9 1.9 1.9 1.9 0 0 0 1.9-1.9c0-.4-.1-.7-.3-1 .6.5.9 1.2.9 1.9a2.6 2.6 0 0 1-2.6 2.6 2.6 2.6 0 0 1-2.6-2.6c0-1.1.4-1.8 1-2.4.6-.7 1.4-1.5 1.8-3.4z";
  return (
    <svg
      viewBox="0 0 22 22"
      aria-hidden="true"
      focusable="false"
      className={className ?? "w-5 h-5"}
    >
      <defs>
        <linearGradient id="flame-grad" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EA2A1E" />
          <stop offset="100%" stopColor="#FF9A1E" />
        </linearGradient>
      </defs>
      {/* Wisp: the same body curve, scaled down and shifted left. */}
      <path transform="translate(-2 7) scale(0.5)" fill="url(#flame-grad)" d={body} />
      {/* Main tongue, with the core cut out (fill-rule evenodd) rather
          than filled — the hole shows the surface behind the icon. */}
      <path transform="translate(4 0)" fill="url(#flame-grad)" fillRule="evenodd" d={`${body} ${core}`} />
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
