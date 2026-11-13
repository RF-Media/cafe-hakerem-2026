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

/** Filled triangle — the explicit tap-to-play control shown under
 *  `prefers-reduced-motion`, where hover/focus no longer auto-trigger
 *  video playback. */
export function IconPlay({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" className={className ?? size}>
      <path d="M7 5.5v13l12-6.5z" fill="currentColor" stroke="none" />
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

/** A round punch mark, for the loyalty club. */
export function IconStamp({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <circle cx="12" cy="12" r="8.5" strokeDasharray="2.6 2.4" />
      <path d="M8.2 10.4h7v3.1a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3v-3.1zM15.2 11.2c1.5 0 1.5 2.6 0 2.6" />
    </svg>
  );
}

export function IconEdit({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? "w-4 h-4"}>
      <path d="M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17v3z" />
      <path d="M13.5 7.5l3 3" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function IconGift({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <path d="M4 11h16v9H4zM3 7.5h18V11H3zM12 7.5V20M12 7.5S10.5 3.5 8 3.5 5.5 7.5 12 7.5zM12 7.5s1.5-4 4-4 2.5 4-4 4z" />
    </svg>
  );
}

export function IconCookie({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01M16 15.5v.01M12 12v.01M11 17v.01M7 14v.01" />
    </svg>
  );
}

export function IconCake({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
      <path d="M2 21h20M7 8v3M12 8v3M17 8v3M7 4h.01M12 4h.01M17 4h.01" />
    </svg>
  );
}

export function IconQr({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2.5v2.5H14zM20 14v2.5M14 20h2.5M20 20h0M18 17.5V20" />
    </svg>
  );
}

export function IconPhoneCard({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

export function IconSpark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className ?? size}>
      <path d="M12 0c1 6.5 5.5 11 12 12-6.5 1-11 5.5-12 12-1-6.5-5.5-11-12-12C6.5 11 11 6.5 12 0z" />
    </svg>
  );
}

export function IconWine({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <path d="M7 3.5h10l-1 8a4 4 0 0 1-8 0z" />
      <path d="M12 15.5V21M8.5 21h7" />
    </svg>
  );
}

/** The "universal access" figure-in-a-circle, not the wheelchair pictogram. */
export function IconUniversalAccess({ className }: IconProps) {
  return (
    <svg {...base} className={className ?? size}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="7.3" r="1.3" fill="currentColor" stroke="none" />
      <path d="M7 10.2h10M12 10.2v5.3M12 15.5l-3 4.3M12 15.5l3 4.3" />
    </svg>
  );
}
