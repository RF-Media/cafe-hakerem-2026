/**
 * Placeholder illustrations.
 *
 * These stand in until real photography arrives. They are deliberately
 * authored line art in the site palette rather than grey boxes, so an
 * unfinished section still reads as designed rather than broken — and they
 * are pure inline SVG, so they cost no request and no layout shift.
 *
 * Every one draws on `currentColor` for its strokes; the wrapper picks the
 * ink colour. `viewBox` is uniform 400×400 with `preserveAspectRatio="none"`
 * left off, so they letterbox gracefully inside any aspect ratio.
 */

export type PlaceholderVariant =
  | "interior"
  | "cup"
  | "pastry"
  | "tray"
  | "jachnun"
  | "founder"
  | "instagram"
  | "map"
  | "testimonial";

type Props = { className?: string };

const svg = "w-full h-full";
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Café interior — counter, pendant lights, stools, window. */
function Interior({ className }: Props) {
  return (
    <svg viewBox="0 0 400 400" className={className ?? svg} aria-hidden focusable="false">
      <g {...stroke}>
        <path d="M40 300h320" />
        <path d="M70 300v-70h150v70" />
        <path d="M70 250h150" />
        <path d="M250 300v-46a26 26 0 0 1 52 0v46" />
        <path d="M250 268h52" />
        <circle cx="120" cy="120" r="22" />
        <path d="M120 60v38M120 142v34" />
        <circle cx="196" cy="96" r="16" />
        <path d="M196 60v20M196 112v22" />
        <rect x="266" y="70" width="86" height="110" rx="4" />
        <path d="M309 70v110M266 125h86" />
        <path d="M96 300v40M194 300v40" />
      </g>
      <g opacity="0.35" {...stroke} strokeWidth={2}>
        <path d="M40 340h320" />
      </g>
    </svg>
  );
}

/** Cup on a saucer with steam. */
function Cup({ className }: Props) {
  return (
    <svg viewBox="0 0 400 400" className={className ?? svg} aria-hidden focusable="false">
      <g {...stroke}>
        <path d="M120 190h130v58a58 58 0 0 1-58 58h-14a58 58 0 0 1-58-58z" />
        <path d="M250 208h18a28 28 0 0 1 0 56h-18" />
        <path d="M104 320h180" />
        <path d="M120 190h130" />
      </g>
      <g {...stroke} strokeWidth={2.5} opacity="0.6">
        <path d="M156 150c14-14-14-28 0-42" />
        <path d="M192 150c14-14-14-28 0-42" />
        <path d="M228 150c14-14-14-28 0-42" />
      </g>
    </svg>
  );
}

/** Croissant + a slice of cake on a plate. */
function Pastry({ className }: Props) {
  return (
    <svg viewBox="0 0 400 400" className={className ?? svg} aria-hidden focusable="false">
      <g {...stroke}>
        <path d="M84 214c26-46 92-64 138-40" />
        <path d="M84 214c-14 22 6 40 30 32M222 174c22-12 42 6 34 30" />
        <path d="M124 190l14 30M160 178l10 34M196 178l4 34" />
        <path d="M232 300h108l-18-92h-72z" />
        <path d="M214 208h126" />
        <path d="M250 236h72M250 264h72" />
      </g>
      <g opacity="0.35" {...stroke} strokeWidth={2}>
        <ellipse cx="200" cy="322" rx="130" ry="14" />
      </g>
    </svg>
  );
}

/** Catering platter, seen from above. */
function Tray({ className }: Props) {
  return (
    <svg viewBox="0 0 400 400" className={className ?? svg} aria-hidden focusable="false">
      <g {...stroke}>
        <rect x="52" y="96" width="296" height="208" rx="22" />
        <rect x="76" y="120" width="248" height="160" rx="14" opacity="0.55" />
        <circle cx="136" cy="168" r="24" />
        <circle cx="200" cy="168" r="24" />
        <circle cx="264" cy="168" r="24" />
        <path d="M112 236h48v32h-48zM176 236h48v32h-48zM240 236h48v32h-48z" />
        <path d="M52 200H30M370 200h-22" />
      </g>
    </svg>
  );
}

/** Rolled jachnun with an egg and a tomato — the Saturday plate. */
function Jachnun({ className }: Props) {
  return (
    <svg viewBox="0 0 400 400" className={className ?? svg} aria-hidden focusable="false">
      <g {...stroke}>
        <path d="M86 196c0-26 26-42 58-42s58 16 58 42-26 42-58 42-58-16-58-42z" />
        <path d="M104 178c18 14 58 16 90 4M100 212c22 14 62 14 92 0" />
        <ellipse cx="272" cy="182" rx="40" ry="46" />
        <circle cx="272" cy="184" r="17" />
        <path d="M176 288c0-24 20-42 46-42s46 18 46 42" />
        <path d="M222 246v-16M222 230c14-4 20-14 20-24" />
        <path d="M92 300h216" />
      </g>
    </svg>
  );
}

/** A person behind the counter — used for the founder portrait slot. */
function Founder({ className }: Props) {
  return (
    <svg viewBox="0 0 400 400" className={className ?? svg} aria-hidden focusable="false">
      <g {...stroke}>
        <circle cx="200" cy="150" r="52" />
        <path d="M104 320v-16c0-46 43-72 96-72s96 26 96 72v16" />
        <path d="M148 124c22-30 82-30 104 0" />
        <path d="M168 254l32 30 32-30" />
      </g>
      <g opacity="0.35" {...stroke} strokeWidth={2}>
        <path d="M60 320h280" />
      </g>
    </svg>
  );
}

/** Generic square social tile — frame with a coffee mark inside. */
function Instagram({ className }: Props) {
  return (
    <svg viewBox="0 0 400 400" className={className ?? svg} aria-hidden focusable="false">
      <g {...stroke}>
        <rect x="76" y="76" width="248" height="248" rx="52" />
        <circle cx="200" cy="200" r="58" />
        <circle cx="272" cy="128" r="9" />
        <path d="M172 176h44v28a22 22 0 0 1-44 0z" />
        <path d="M216 184h8a11 11 0 0 1 0 22h-8" />
      </g>
    </svg>
  );
}

/** Street map fragment with a pin. */
function Map({ className }: Props) {
  return (
    <svg viewBox="0 0 400 400" className={className ?? svg} aria-hidden focusable="false">
      <g {...stroke} opacity="0.4" strokeWidth={2.5}>
        <path d="M20 120h360M20 268h360" />
        <path d="M116 20v360M284 20v360" />
        <path d="M20 200h96M284 200h96" />
      </g>
      <g {...stroke}>
        <path d="M200 316s62-62 62-108a62 62 0 0 0-124 0c0 46 62 108 62 108z" />
        <circle cx="200" cy="204" r="22" />
      </g>
    </svg>
  );
}

/** Vertical (9:16) clip frame with a centered play mark — the video-
 *  testimonial slot before a real clip is uploaded. */
function Testimonial({ className }: Props) {
  return (
    <svg viewBox="0 0 400 400" className={className ?? svg} aria-hidden focusable="false">
      <g {...stroke}>
        <rect x="130" y="44" width="140" height="312" rx="26" />
        <path d="M184 44h32" strokeWidth={5} opacity="0.5" />
      </g>
      <g {...stroke} opacity="0.7">
        <circle cx="200" cy="204" r="48" />
      </g>
      <path d="M186 180l54 24-54 24z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const registry: Record<PlaceholderVariant, (p: Props) => JSX.Element> = {
  interior: Interior,
  cup: Cup,
  pastry: Pastry,
  tray: Tray,
  jachnun: Jachnun,
  founder: Founder,
  instagram: Instagram,
  map: Map,
  testimonial: Testimonial,
};

export function Placeholder({
  variant,
  className,
}: {
  variant: PlaceholderVariant;
  className?: string;
}) {
  const Art = registry[variant];
  return <Art className={className} />;
}
