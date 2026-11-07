/**
 * Draws the neighbourhood map on /map from OpenStreetMap data.
 *
 *   npx tsx scripts/build-map.ts [cached-overpass.json]
 *
 * Writes two files, both committed, so nothing here runs at build or request time:
 *   public/images/neighbourhood-map_map.svg  the sheet: land, buildings, roads, coffee ring
 *   content/map-sheet.ts                     street labels and parking marks, set as real text
 *
 * Re-run when the café's pin in content/business.ts moves. The sheet is always
 * centred on that pin, which is what lets the page position its marker at 50%/50%.
 *
 * Map data © OpenStreetMap contributors (ODbL). The page carries the credit.
 */
import { readFileSync, writeFileSync } from "fs";
import { business } from "../content/business";

const WIDTH = 1500; // Metres, and SVG units: 1 unit is 1m.
const HEIGHT = 1200;
const MARGIN = 60;
const WALK_RADIUS = 400; // Five minutes at 80m a minute.
const SOURCE = process.argv[2];

/* ─── Palette: keep in step with the tokens in app/globals.css ─────────── */

const hsl = (h: number, s: number, l: number, a?: number) =>
  a === undefined ? `hsl(${h} ${s}% ${l}%)` : `hsl(${h} ${s}% ${l}% / ${a})`;

const ink = {
  paper: hsl(38, 32, 95), // --cream
  roadFill: hsl(42, 46, 99), // --cream-3, a touch lifted
  casing: hsl(24, 12, 44), // --espresso-soft, opened up
  footpath: hsl(24, 10, 38), // --espresso-soft
  building: hsl(34, 20, 85),
  buildingEdge: hsl(30, 14, 70),
  park: hsl(140, 22, 84),
  parkDot: hsl(152, 22, 34, 0.42), // --olive-soft
  orchard: hsl(70, 22, 89),
  orchardDot: hsl(95, 18, 42, 0.38),
  pitch: hsl(140, 20, 79),
  parking: hsl(36, 14, 89),
  parkingEdge: hsl(30, 12, 68),
  pool: hsl(186, 34, 76),
  pine: hsl(156, 38, 17), // --olive
  cafe: hsl(152, 24, 36), // --olive-soft, so the pin stays the darkest thing here
  stain: "24 58% 26%",
};

/* ─── OSM ──────────────────────────────────────────────────────────────── */

type Pt = [number, number];
type OsmEl = {
  type: string;
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
  geometry?: { lat: number; lon: number }[];
  members?: { role: string; geometry?: { lat: number; lon: number }[] }[];
};

const { latitude: lat0, longitude: lon0 } = business.geo;
const kx = Math.cos((lat0 * Math.PI) / 180) * 111320;
const ky = 110574;
const project = (lat: number, lon: number): Pt => [(lon - lon0) * kx + WIDTH / 2, -(lat - lat0) * ky + HEIGHT / 2];

async function loadOsm(): Promise<OsmEl[]> {
  if (SOURCE) return JSON.parse(readFileSync(SOURCE, "utf8")).elements;
  const dLat = (HEIGHT / 2 + MARGIN) / ky;
  const dLon = (WIDTH / 2 + MARGIN) / kx;
  const bbox = [lat0 - dLat, lon0 - dLon, lat0 + dLat, lon0 + dLon].join(",");
  const query = `[out:json][timeout:80][bbox:${bbox}];(way[highway];way[building];way[leisure];way[landuse];way[natural];way[amenity];);out geom tags;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "User-Agent": "cafe-site-map-build/1.0" },
    body: new URLSearchParams({ data: query }),
  });
  if (!res.ok) throw new Error(`Overpass answered ${res.status}. Try again, or pass a cached response.`);
  return (await res.json()).elements;
}

/* ─── Geometry ─────────────────────────────────────────────────────────── */

const inWindow = ([x, y]: Pt, m = MARGIN) => x > -m && x < WIDTH + m && y > -m && y < HEIGHT + m;

function simplify(pts: Pt[], tol: number): Pt[] {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  let far = 0;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs((b[0] - a[0]) * (a[1] - pts[i][1]) - (a[0] - pts[i][0]) * (b[1] - a[1])) / len;
    if (d > far) [far, idx] = [d, i];
  }
  if (far <= tol) return [a, b];
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)];
}

/** A ring starts and ends on one point, so measuring against that chord would
 *  collapse it. Split it at its far side and simplify the two halves. */
function simplifyRing(pts: Pt[], tol: number): Pt[] {
  let idx = 1;
  let far = 0;
  pts.forEach((p, i) => {
    const d = Math.hypot(p[0] - pts[0][0], p[1] - pts[0][1]);
    if (d > far) [far, idx] = [d, i];
  });
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)];
}

/** A long way usually leaves the sheet: keep only the runs on it. */
function clipRuns(pts: Pt[]): Pt[][] {
  const runs: Pt[][] = [];
  let run: Pt[] = [];
  pts.forEach((p, i) => {
    const near = inWindow(p) || (i > 0 && inWindow(pts[i - 1])) || (i < pts.length - 1 && inWindow(pts[i + 1]));
    if (near) run.push(p);
    else if (run.length) {
      runs.push(run);
      run = [];
    }
  });
  if (run.length) runs.push(run);
  return runs.filter((r) => r.length > 1);
}

const area = (pts: Pt[]) =>
  Math.abs(pts.reduce((s, p, i) => s + p[0] * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * p[1], 0)) / 2;

const centroid = (pts: Pt[]): Pt => [
  pts.reduce((s, p) => s + p[0], 0) / pts.length,
  pts.reduce((s, p) => s + p[1], 0) / pts.length,
];

function contains([x, y]: Pt, poly: Pt[]) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

const num = (n: number) => String(Math.round(n * 10) / 10).replace(/^(-?)0\./, "$1.");

function pathOf(pts: Pt[], closed = false): string {
  const round = (v: number) => Math.round(v * 10) / 10;
  let [px, py] = [round(pts[0][0]), round(pts[0][1])];
  let d = `M${num(px)} ${num(py)}l`;
  const parts: string[] = [];
  for (const p of pts.slice(1, closed ? -1 : undefined)) {
    const [x, y] = [round(p[0]), round(p[1])];
    parts.push(`${num(x - px)} ${num(y - py)}`);
    [px, py] = [x, y];
  }
  d += parts.join(" ").replace(/ -/g, "-");
  return closed ? `${d}z` : d;
}

const polylineLength = (pts: Pt[]) =>
  pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

/* ─── The coffee ring ──────────────────────────────────────────────────── */

function mulberry(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function wobble(rand: () => number, harmonics: number[]) {
  const waves = harmonics.map((k) => ({ k, phase: rand() * Math.PI * 2, amp: rand() * 0.6 + 0.4 }));
  const total = waves.reduce((s, w) => s + w.amp / Math.sqrt(w.k), 0);
  return (t: number) => waves.reduce((s, w) => s + (w.amp / Math.sqrt(w.k)) * Math.sin(w.k * t + w.phase), 0) / total;
}

/** Hand-wobbled band rather than an SVG filter: a filter this size would be a
 *  long paint on a phone, for a shape a few hundred points can draw. */
function coffeeRing(cx: number, cy: number, r: number): string {
  const rand = mulberry(20);
  const outer = wobble(rand, [2, 3, 5, 9, 17, 31]);
  const thick = wobble(rand, [3, 7, 13, 29, 47]);
  const heavy = 2.3; // Radians: the side the cup leaned on, lower-left.
  const N = 260;
  const at = (t: number, rad: number): Pt => [cx + Math.cos(t) * rad, cy + Math.sin(t) * rad];
  const band = (width: (t: number) => number) => {
    const out: Pt[] = [];
    const inner: Pt[] = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      const R = r + 7 * outer(t);
      out.push(at(t, R));
      inner.push(at(t, R - Math.max(0.6, width(t))));
    }
    return `${pathOf(out, true)}${pathOf(inner.reverse(), true)}`;
  };
  const lean = (t: number) => Math.pow(0.5 + 0.5 * Math.cos(t - heavy), 2);

  const wash = band((t) => 26 + 26 * lean(t) + 7 * thick(t));
  const core = band((t) => 4 + 17 * lean(t) + 4 * thick(t));
  const edgePts: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2;
    edgePts.push(at(t, r + 7 * outer(t)));
  }
  // The cup was set down twice: a fainter arc, slightly off the first.
  const secondPts: Pt[] = [];
  for (let i = 0; i <= 92; i++) {
    const t = heavy + 0.55 + (i / 92) * 2.5;
    secondPts.push([cx - 15 + Math.cos(t) * (r - 3 + 5 * outer(t + 1)), cy + 12 + Math.sin(t) * (r - 3 + 5 * outer(t + 1))]);
  }
  const drops: string[] = [];
  for (let i = 0; i < 9; i++) {
    const t = heavy + (rand() - 0.5) * 1.5;
    const [x, y] = at(t, r + 16 + rand() * 66);
    const size = 1.4 + rand() * rand() * 6.5;
    drops.push(`<ellipse cx="${num(x)}" cy="${num(y)}" rx="${num(size)}" ry="${num(size * (0.72 + rand() * 0.28))}"/>`);
  }

  const stop = (o: number, a: number) => `<stop offset="${o}" stop-color="hsl(${ink.stain})" stop-opacity="${a}"/>`;
  const gradient = (id: string, from: number, to: number) =>
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${num(cx - r * 0.8)}" y1="${num(cy + r * 0.72)}" x2="${num(cx + r * 0.8)}" y2="${num(cy - r * 0.72)}">${stop(0, from)}${stop(1, to)}</linearGradient>`;

  return `<defs>${gradient("w", 0.13, 0.035)}${gradient("c", 0.38, 0.09)}${gradient("e", 0.5, 0.16)}${gradient("s", 0.2, 0.04)}</defs>
<g style="mix-blend-mode:multiply">
<path fill="url(#w)" fill-rule="evenodd" d="${wash}"/>
<path fill="url(#c)" fill-rule="evenodd" d="${core}"/>
<path fill="none" stroke="url(#e)" stroke-width="1.7" d="${pathOf(edgePts, true)}"/>
<path fill="none" stroke="url(#s)" stroke-width="2.4" stroke-linecap="round" d="${pathOf(secondPts)}"/>
<g fill="hsl(${ink.stain} / .26)">${drops.join("")}</g>
</g>`;
}

/* ─── Street labels ────────────────────────────────────────────────────── */

type Label = { text: string; x: number; y: number; angle: number; kind: "carmel" | "major" | "street"; minor: boolean };

const FONT = { carmel: 26, major: 21, street: 19 } as const;
const textLength = (text: string, size: number) => text.length * size * 0.58 + 8;

/** Where the marker and the ring's own label sit. Streets there go unlabelled. */
const KEEP_OUT: { x0: number; y0: number; x1: number; y1: number }[] = [
  { x0: WIDTH / 2 - 230, y0: HEIGHT / 2 - 330, x1: WIDTH / 2 + 90, y1: HEIGHT / 2 + 26 },
  { x0: WIDTH / 2 - 190, y0: HEIGHT / 2 + WALK_RADIUS - 70, x1: WIDTH / 2 + 190, y1: HEIGHT / 2 + WALK_RADIUS + 30 },
  { x0: 0, y0: 0, x1: 300, y1: 300 }, // Title block
  { x0: 0, y0: HEIGHT - 300, x1: 190, y1: HEIGHT }, // Compass
];

function pointAt(pts: Pt[], s: number): Pt {
  let left = s;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (left <= seg) {
      const f = seg ? left / seg : 0;
      return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f];
    }
    left -= seg;
  }
  return pts[pts.length - 1];
}

function placeLabels(streets: Map<string, { runs: Pt[][]; major: boolean }>): Label[] {
  const pin: Pt = [WIDTH / 2, HEIGHT / 2];
  const placed: { x: number; y: number; r: number }[] = [];
  const out: Label[] = [];
  const dist = (p: Pt) => Math.hypot(p[0] - pin[0], p[1] - pin[1]);

  const order = [...streets.entries()]
    .map(([name, s]) => ({ name, ...s, near: Math.min(...s.runs.flat().map(dist)), total: s.runs.reduce((t, r) => t + polylineLength(r), 0) }))
    .filter((s) => s.total > 90)
    .sort((a, b) => (a.name === "הכרמל" ? -1 : b.name === "הכרמל" ? 1 : a.near - b.near));

  for (const street of order) {
    const carmel = street.name === "הכרמל";
    const kind: Label["kind"] = carmel ? "carmel" : street.major ? "major" : "street";
    const text = carmel ? "רחוב הכרמל" : street.name;
    const L = textLength(text, FONT[kind]);
    let best: { score: number; c: Pt; angle: number } | null = null;

    for (const run of street.runs) {
      const total = polylineLength(run);
      for (let s = L / 2; s < total - L / 2; s += 14) {
        const a = pointAt(run, s - L / 2);
        const b = pointAt(run, s + L / 2);
        const c = pointAt(run, s);
        // Straight enough to carry a straight line of type.
        const chord = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const dev = Math.abs((b[0] - a[0]) * (a[1] - c[1]) - (a[0] - c[0]) * (b[1] - a[1])) / (chord || 1);
        if (dev > 8 || chord < L * 0.9) continue;
        const angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
        const corners: Pt[] = [a, b, c];
        // Wide frames crop the top and bottom, so type stays out of those bands.
        if (!corners.every((p) => inWindow(p, -46) && p[1] > 170 && p[1] < HEIGHT - 170)) continue;
        const zones = carmel ? [{ x0: WIDTH / 2 - 230, y0: HEIGHT / 2 - 330, x1: WIDTH / 2 + 34, y1: HEIGHT / 2 - 8 }] : KEEP_OUT;
        if (corners.some(([x, y]) => zones.some((k) => x > k.x0 && x < k.x1 && y > k.y0 && y < k.y1))) continue;
        const beads: Pt[] = [a, pointAt(run, s - L / 4), c, pointAt(run, s + L / 4), b];
        if (beads.some((p) => placed.some((q) => Math.hypot(p[0] - q.x, p[1] - q.y) < q.r + 16))) continue;
        const score = dist(c) + Math.abs(Math.sin(angle)) * (carmel ? 900 : 170);
        if (!best || score < best.score) best = { score, c, angle };
      }
    }
    if (!best) continue;

    let [x, y] = best.c;
    // Carmel is drawn solid, so its name sits beside the line, on the open side.
    if (carmel) {
      const side = Math.sin(best.angle + Math.PI / 2) > 0 ? 1 : -1;
      x += Math.cos(best.angle + Math.PI / 2) * side * 25;
      y += Math.sin(best.angle + Math.PI / 2) * side * 25;
    }
    for (let t = -L / 2; t <= L / 2; t += 14) {
      placed.push({ x: x + Math.cos(best.angle) * t, y: y + Math.sin(best.angle) * t, r: 12 });
    }
    let deg = (best.angle * 180) / Math.PI;
    if (deg > 90) deg -= 180;
    if (deg <= -90) deg += 180;
    // Dropped on phones: off the closer crop, or behind the marker, which is sized
    // in pixels and so covers more of the map there.
    const [dx, dy] = [x - pin[0], y - pin[1]];
    const minor = Math.abs(dx) > 340 || Math.abs(dy) > 350 || (dx > -300 && dx < 190 && dy > -480 && dy < -40);
    out.push({ text, x: Math.round(x), y: Math.round(y), angle: Math.round(deg * 10) / 10, kind, minor });
    if (out.length >= 30) break;
  }
  return out;
}

/* ─── Sheet ────────────────────────────────────────────────────────────── */

const ROAD: Record<string, { casing: number; fill: number; tier: number }> = {
  motorway: { casing: 20, fill: 17, tier: 3 },
  trunk: { casing: 20, fill: 17, tier: 3 },
  primary: { casing: 17, fill: 14, tier: 3 },
  secondary: { casing: 15, fill: 12.5, tier: 3 },
  tertiary: { casing: 13, fill: 10.6, tier: 2 },
  tertiary_link: { casing: 11, fill: 9, tier: 2 },
  residential: { casing: 9.5, fill: 7.6, tier: 1 },
  unclassified: { casing: 9.5, fill: 7.6, tier: 1 },
  living_street: { casing: 8.5, fill: 6.8, tier: 1 },
  construction: { casing: 8, fill: 6.4, tier: 1 },
  service: { casing: 5.4, fill: 3.9, tier: 0 },
};
const FOOT = new Set(["footway", "path", "cycleway", "pedestrian", "track", "steps"]);

async function main() {
  const els = await loadOsm();
  const roads = new Map<number, { casing: number; fill: number; d: string[] }>();
  const foot: string[] = [];
  const carmel: string[] = [];
  const buildings: string[] = [];
  const parks: string[] = [];
  const orchards: string[] = [];
  const pitches: string[] = [];
  const pools: string[] = [];
  const lots: string[] = [];
  const lotMarks: { c: Pt; a: number }[] = [];
  const streets = new Map<string, { runs: Pt[][]; major: boolean }>();
  let cafeBuilding = "";
  const pin: Pt = [WIDTH / 2, HEIGHT / 2];

  for (const el of els) {
    const t = el.tags ?? {};
    const geoms = el.geometry ? [el.geometry] : (el.members ?? []).filter((m) => m.role === "outer" && m.geometry).map((m) => m.geometry!);
    for (const g of geoms) {
      const pts = g.map((p) => project(p.lat, p.lon));
      if (!pts.some((p) => inWindow(p))) continue;
      const closed = pts.length > 3 && g[0].lat === g[g.length - 1].lat && g[0].lon === g[g.length - 1].lon;

      if (t.highway) {
        if (t.highway === "proposed" || t.area === "yes") continue;
        const he = t["name:he"] ?? t.name;
        for (const run of clipRuns(pts)) {
          const s = simplify(run, 0.8);
          if (FOOT.has(t.highway)) {
            foot.push(pathOf(s));
            continue;
          }
          const style = ROAD[t.highway];
          if (!style || (t.highway === "service" && polylineLength(run) < 25)) continue;
          if (he === "הכרמל") carmel.push(pathOf(s));
          if (!roads.has(style.tier)) roads.set(style.tier, { casing: style.casing, fill: style.fill, d: [] });
          roads.get(style.tier)!.d.push(pathOf(s));
          if (he && t.highway !== "service" && t.highway !== "construction") {
            if (!streets.has(he)) streets.set(he, { runs: [], major: false });
            const street = streets.get(he)!;
            street.runs.push(run);
            street.major = street.major || style.tier >= 2;
          }
        }
        continue;
      }
      if (!closed) continue;

      if (t.building) {
        if (area(pts) < 22) continue;
        const d = pathOf(simplifyRing(pts, 0.7), true);
        buildings.push(d);
        if (contains(pin, pts)) cafeBuilding = d;
      } else if (t.leisure === "swimming_pool" || t.natural === "water") {
        pools.push(pathOf(simplifyRing(pts, 0.7), true));
      } else if (t.leisure === "pitch") {
        pitches.push(pathOf(simplifyRing(pts, 1), true));
      } else if (["park", "garden", "playground", "dog_park", "sports_centre"].includes(t.leisure ?? "") || ["forest", "grass", "meadow", "cemetery", "village_green"].includes(t.landuse ?? "")) {
        parks.push(pathOf(simplifyRing(pts, 1.2), true));
      } else if (["orchard", "farmland", "vineyard"].includes(t.landuse ?? "")) {
        orchards.push(pathOf(simplifyRing(pts, 1.5), true));
      } else if (t.amenity === "parking") {
        lots.push(pathOf(simplifyRing(pts, 1), true));
        lotMarks.push({ c: centroid(pts.slice(0, -1)), a: area(pts) });
      }
    }
  }

  const tiers = [...roads.entries()].sort((a, b) => a[0] - b[0]).map(([, r]) => r);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" preserveAspectRatio="xMidYMid slice">
<defs>
<pattern id="pk" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><circle cx="6" cy="7" r="1.5" fill="${ink.parkDot}"/><circle cx="19" cy="19" r="1.5" fill="${ink.parkDot}"/></pattern>
<pattern id="or" width="15" height="15" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><circle cx="7.5" cy="7.5" r="1.25" fill="${ink.orchardDot}"/></pattern>
</defs>
<rect width="${WIDTH}" height="${HEIGHT}" fill="${ink.paper}"/>
<path fill="${ink.orchard}" d="${orchards.join("")}"/><path fill="url(#or)" d="${orchards.join("")}"/>
<path fill="${ink.park}" d="${parks.join("")}"/><path fill="url(#pk)" d="${parks.join("")}"/>
<path fill="${ink.pitch}" d="${pitches.join("")}"/>
<path fill="${ink.parking}" stroke="${ink.parkingEdge}" stroke-width=".7" d="${lots.join("")}"/>
<path fill="${ink.building}" stroke="${ink.buildingEdge}" stroke-width=".6" d="${buildings.join("")}"/>
<path fill="${ink.pool}" d="${pools.join("")}"/>
<g fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="${ink.footpath}" stroke-width="1.3" stroke-dasharray="4 5" opacity=".6" d="${foot.join("")}"/>
${tiers.map((r) => `<path stroke="${ink.casing}" stroke-width="${r.casing}" d="${r.d.join("")}"/>`).join("\n")}
${tiers.map((r) => `<path stroke="${ink.roadFill}" stroke-width="${r.fill}" d="${r.d.join("")}"/>`).join("\n")}
<path stroke="${ink.pine}" stroke-width="7" d="${carmel.join("")}"/>
</g>
<path fill="${ink.cafe}" d="${cafeBuilding}"/>
${coffeeRing(pin[0], pin[1], WALK_RADIUS)}
</svg>
`;

  const labels = placeLabels(streets);
  const parking = lotMarks
    .filter((l) => Math.hypot(l.c[0] - pin[0], l.c[1] - pin[1]) < 140 && Math.hypot(l.c[0] - pin[0], l.c[1] - pin[1]) > 34 && l.c[1] > pin[1])
    .sort((a, b) => b.a - a.a)
    .slice(0, 2)
    .map((l) => ({ x: Math.round(l.c[0]), y: Math.round(l.c[1]) }));

  const sheet = `/**
 * Generated by scripts/build-map.ts from OpenStreetMap. Edit the script, not this file.
 * Coordinates are in the viewBox of /images/neighbourhood-map_map.svg, 1 unit = 1m,
 * with the café's pin at the exact centre.
 */

export const mapSheet = ${JSON.stringify({ width: WIDTH, height: HEIGHT, walkRadius: WALK_RADIUS, streets: labels, parking }, null, 2)} as const;
`;

  writeFileSync("public/images/neighbourhood-map_map.svg", svg);
  writeFileSync("content/map-sheet.ts", sheet);
  console.log(`sheet ${(svg.length / 1024).toFixed(0)}KB, ${buildings.length} buildings, ${labels.length} labels, ${parking.length} parking marks, café building ${cafeBuilding ? "found" : "NOT FOUND"}`);
}

main();
