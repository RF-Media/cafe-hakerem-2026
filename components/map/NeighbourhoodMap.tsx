/**
 * A folded paper map of the café's streets, drawn from OpenStreetMap by
 * scripts/build-map.ts. No iframe, no tiles, no third-party cookies: a static
 * sheet, so the page paints immediately and stays a server component.
 *
 * The sheet is an <img> and the labels are inline SVG over it, because every
 * server-rendered element is sent twice (HTML and RSC payload) and the 40KB of
 * geometry shouldn't be. Both share a viewBox and `slice`, so they crop alike at
 * every frame shape, and the pin is the exact centre of that viewBox, which is
 * why the marker can sit at 50%/50% with no measuring.
 */
import Image from "next/image";
import { CafeImage } from "@/components/ui/CafeImage";
import { business } from "@/content/business";
import { mapPage } from "@/content/map";
import { mapSheet } from "@/content/map-sheet";

const { width, height, walkRadius, streets, parking } = mapSheet;
const cx = width / 2;
const cy = height / 2;

export function NeighbourhoodMap({ className = "" }: { className?: string }) {
  return (
    <div className={`map-sheet ${className}`}>
      <div className="map-art">
        <Image
          src="/images/neighbourhood-map_map.svg"
          alt={mapPage.mapAlt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
        {/* The alt above already describes the map; a list of street names read
            aloud would add nothing. */}
        <svg
          aria-hidden
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
        >
          {streets.map((s) => (
            <text
              key={s.text}
              transform={`translate(${s.x} ${s.y}) rotate(${s.angle})`}
              className={`map-label map-label--${s.kind}${s.minor ? " map-label--minor" : ""}`}
            >
              {s.text}
            </text>
          ))}
          {/* Straight, not on a <textPath>: Safari scrambles Hebrew along a curve.
              At the bottom of the ring the arc is nearly flat anyway. */}
          <text x={cx} y={cy + walkRadius - 16} className="map-ring-label">
            {mapPage.ring}
          </text>
          {parking.map((p) => (
            <g key={`${p.x}-${p.y}`} transform={`translate(${p.x} ${p.y})`}>
              <circle r="14" className="map-p-disc" />
              <text className="map-p-glyph">P</text>
            </g>
          ))}
        </svg>
      </div>

      <div aria-hidden className="map-neatline" />

      <div className="map-title">
        <div className="type-sub text-base text-espresso md:text-lg">{mapPage.sheetTitle}</div>
        <div className="text-xs text-espresso-soft">{mapPage.sheetSubtitle}</div>
        <div dir="ltr" className="mt-1 hidden text-[0.6875rem] tabular-nums text-espresso-soft md:block">
          {business.geo.latitude.toFixed(4)}°N {business.geo.longitude.toFixed(4)}°E
        </div>
      </div>

      <svg aria-hidden viewBox="0 0 44 58" className="map-compass">
        <circle cx="22" cy="36" r="20" fill="hsl(var(--cream))" stroke="currentColor" strokeWidth="1" />
        <path d="M22 20l6 16-6-3.4-6 3.4z" fill="currentColor" />
        <path d="M22 52l6-16-6 3.4-6-3.4z" fill="none" stroke="currentColor" strokeWidth="1" />
        <text x="22" y="10" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">
          {mapPage.north}
        </text>
      </svg>

      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        dir="ltr"
        className="map-credit"
      >
        {mapPage.credit}
      </a>

      {/* The pin itself: two ripples, a dot, and the storefront taped to the sheet. */}
      <span aria-hidden className="map-ripple" />
      <span aria-hidden className="map-ripple map-ripple--late" />
      <span aria-hidden className="map-leader" />
      <span aria-hidden className="map-dot" />
      <figure className="map-polaroid">
        <CafeImage
          variant="interior"
          src="/images/storefront_shared.jpg"
          alt={mapPage.photoAlt}
          ratio="aspect-square"
          className="!rounded-[2px]"
          position="50% 0%"
          sizes="160px"
        />
        <figcaption className="pt-2.5 text-center md:pt-3 text-xs font-medium text-espresso md:text-sm">
          {mapPage.caption}
        </figcaption>
      </figure>
    </div>
  );
}
