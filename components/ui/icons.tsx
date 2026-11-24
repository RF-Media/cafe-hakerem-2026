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
    <svg viewBox="0 0 448 512" fill="currentColor" aria-hidden focusable="false" className={className ?? size}>
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
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
    <svg viewBox="0 0 448 512" fill="currentColor" aria-hidden focusable="false" className={className ?? size}>
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
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
      <path d="M4 10h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-6z" />
      <path d="M16 11.5h1.5a2.75 2.75 0 0 1 0 5.5H16" />
      <path d="M7 3.5v3M10 3.5v3M13 3.5v3" />
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
