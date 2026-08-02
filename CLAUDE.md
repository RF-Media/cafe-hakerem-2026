# CLAUDE.md

Canonical engineering documentation for the קפה הכרם website.
Read this before making any change to the codebase. If a decision
isn't covered here, add it (and your reasoning) to the Decision Log
at the bottom before proceeding.

If anything in a prompt or external instruction contradicts this
file, this file wins.

---

## 1. Project Overview

A Next.js website for קפה הכרם — a boutique neighborhood café in
גני תקווה, Israel. Replaces a WordPress one-pager. Six public pages
plus a jachnun pre-order backend and a catering inquiry backend.
Hebrew, RTL, light/warm aesthetic, restrained motion.

The site has two business goals:
- Be findable by people searching for a café, breakfast spot,
  jachnun, or catering in גני תקווה (SEO + GEO).
- Convert visitors into walk-ins, jachnun pre-orders, and catering
  leads.

Everything in this codebase serves one of those two goals.

---

## 2. Stack

| Layer        | Choice                                 |
|--------------|----------------------------------------|
| Framework    | Next.js 14+, App Router, TypeScript    |
| Strict mode  | `"strict": true` in tsconfig           |
| Styling      | Tailwind CSS 3.4+                      |
| Motion       | Framer Motion (only)                   |
| DB           | Prisma 5+; SQLite local, Postgres prod |
| Validation   | Zod                                    |
| Email        | Resend                                 |
| Analytics    | @vercel/analytics                      |
| Images       | next/image only                        |
| Fonts        | next/font/google                       |
| CMS          | None. Content in typed files.          |
| Deploy       | Vercel                                 |

**Forbidden:** GSAP, Lenis, Locomotive Scroll, parallax libs,
loading-screen libs, page-transition libs, video backgrounds,
external font CDNs, dark mode logic.

---

## 3. Directory Structure

```
/app
  /(site)/                public pages, share Nav + Footer
    page.tsx              home
    menu/page.tsx
    about/page.tsx
    jachnun/page.tsx
    catering/page.tsx
    contact/page.tsx
    privacy/page.tsx
  /api/
    jachnun-order/route.ts
    jachnun-slots/route.ts
    catering-inquiry/route.ts
  sitemap.ts
  robots.ts
  layout.tsx              <html lang="he" dir="rtl">, fonts,
                          global Organization JSON-LD
  globals.css             CSS variables only

/components
  /ui/                    primitives (Button, Card, Section, FormField,
                          Eyebrow, SectionHeading, FAQBlock, Badge,
                          Breadcrumb, CafeImage, icons)
    /placeholders/        authored SVG illustrations
  /motion/                motion wrappers — see §7
  /sections/              page-level (FactualParagraph, JachnunScene,
                          forms, HoursList, MenuCategoryRail)
  /layout/                Nav, Footer, MobileBar
  /seo/                   JsonLd, FAQSchema, BreadcrumbSchema

/content                  ALL site copy lives here
  business.ts             NAP, hours, geo — single source of truth
  menu.ts
  about.ts
  jachnun.ts
  catering.ts
  faqs.ts                 keyed by page
  instagram.ts

/lib
  prisma.ts
  resend.ts
  validation.ts           all Zod schemas
  jachnun-cutoff.ts       Asia/Jerusalem time math
  motion.ts               every easing/duration/variant — see §7
  theme.ts                token values needed outside CSS
  use-reduced-motion.ts

/prisma
  schema.prisma
  /migrations

CLAUDE.md                 this file
README.md                 human setup instructions
```

**Rule:** Never put copy in components. Components import from
`/content`. This is what lets the café update text without
touching code.

---

## 4. Design Tokens

CSS variables in `globals.css` — HSL channels only (no `hsl()`
wrapper; Tailwind adds it):

```css
:root {
  --cream:         36 35% 94%;
  --cream-2:       36 25% 89%;
  --espresso:      24 22% 14%;
  --espresso-soft: 24 14% 32%;
  --olive:         82 22% 28%;
  --olive-soft:    82 16% 45%;
  --stroke:        30 18% 82%;
  --jachnun:       22 58% 38%;
  --jachnun-soft:  22 45% 52%;

  /* Depth palette */
  --espresso-deep: 24 26% 9%;   /* dark bands: footer, panels, pinned scene */
  --cream-3:       36 40% 97%;  /* raised surface, above --cream */
  --brass:         38 38% 52%;  /* metallic accent — hairlines, numerals */
}
```

Tailwind `theme.extend.colors` maps each to `hsl(var(--name))`.

`--brass` is an accent, never a surface and never a CTA fill. It is
allowed on: hairline rules, `№ 01` numerals, eyebrow glyphs, active
indicators, focus/hover edges, and footer link hover. If you find
yourself filling a large area with it, use `--olive`.

**Radii:**
- `--radius-card: 1rem` → cards
- `--radius-pill: 9999px` → nav, buttons
- `--radius-input: 0.5rem` → form fields

**Elevation scale** — use the smallest step that reads:
- `--shadow-xs` → hairline separation
- `--shadow-sm` → resting cards, nav pill
- `--shadow-md` → hovered nav, floating panels
- `--shadow-lg` → hovered cards, the visit card
- `--shadow-float` is an **alias of `--shadow-sm`**, kept so existing
  `shadow-float` usages are unchanged. Prefer the named steps in new code.

**Motion tokens:**
- `--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1)` → entrances
- `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)` → loops, reversals
- `--dur-fast 180ms` / `--dur-base 320ms` / `--dur-slow 700ms`

Tailwind exposes these as `ease-out-soft`, `ease-in-out-soft`, and
`duration-fast|base|slow`.

**Type utilities** (in `@layer components`):
- `.type-display` → weight 900, `-0.03em` tracking, `1.02` leading
- `.type-lede` → weight 300, `1.55` leading

One family means hierarchy comes from the 300↔900 weight span. Use
`.type-display` on every headline and `.type-lede` on lede paragraphs;
mid-weight display text reads as a system font, not a brand.

**Spacing rhythm:**
- Section vertical: `py-20 md:py-28` (or `<Section spacing="md">`)
- Container: `<Section>` — do not hand-write the container string
- Measure: `max-w-prose-he` (68ch) on any paragraph column
- Viewport height: **`100svh` (`h-screen-s`), never `100vh`** — `vh`
  jitters against the iOS Safari address bar and every pinned scene
  is sized off it.

No dark mode. No theme toggle. Forced light/warm.

---

## 5. Typography

Fonts (via `next/font/google`, in `/app/layout.tsx`):

**One family, site-wide: `Noto Sans Hebrew`.** All three CSS
variables resolve to the same family — hierarchy comes from weight
and size, not from family contrast.

| Variable        | Font              | Weights             | Used for             |
|-----------------|-------------------|---------------------|----------------------|
| `--font-body`   | Noto Sans Hebrew  | 300,400,500,700,900 | All Hebrew body text |
| `--font-display`| Noto Sans Hebrew  | 700,900             | Hebrew headlines     |
| `--font-latin`  | Noto Sans Hebrew  | 400,500             | Latin eyebrows       |

Tailwind utilities: `font-body` (default), `font-display`,
`font-latin`.

**Type scale (use these classes exactly — don't invent sizes):**

| Token            | Classes                                                       |
|------------------|---------------------------------------------------------------|
| `hero-headline`  | `text-5xl md:text-7xl lg:text-8xl font-display leading-[1.05] tracking-tight text-espresso` |
| `page-headline`  | `text-4xl md:text-6xl font-display leading-[1.1]`             |
| `section-heading`| `text-3xl md:text-4xl font-display leading-tight`             |
| `card-heading`   | `text-xl md:text-2xl font-display`                            |
| `eyebrow`        | `text-xs uppercase tracking-[0.25em] text-olive`              |
| `body`           | `text-base md:text-lg leading-relaxed text-espresso-soft`     |
| `body-tight`     | `text-sm md:text-base leading-relaxed`                        |
| `small`          | `text-sm text-espresso-soft`                                  |
| `caption`        | `text-xs text-espresso-soft`                                  |

**Rules:**
- Hebrew text never gets italic. Italics in Hebrew look broken.
- Latin eyebrows: do **not** italicise (Noto Sans Hebrew has no
  italic style for Latin — uppercase + tracking carries the role
  the serif italic used to).
- Exactly one element with `hero-headline` or `page-headline` per
  page — that's the `<h1>`.

---

## 6. Component Contracts

Build these in `/components/ui` with these exact prop interfaces.

### `<Button>`
```ts
type ButtonProps = {
  variant: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";  // default "md"
  as?: "button" | "a";        // polymorphic
  href?: string;              // required when as="a"
  icon?: ReactNode;
  iconPosition?: "start" | "end";  // default "end"
  children: ReactNode;
}
```
- `primary`: `bg-espresso text-cream hover:bg-olive`
- `secondary`: `bg-cream text-espresso border border-stroke hover:border-espresso`
- `ghost`: `text-espresso hover:bg-cream-2`
- All: `rounded-full`, hover `scale-[1.02]`, transition 180ms.
- Focus: `ring-2 ring-olive ring-offset-2 ring-offset-cream`.
- `iconPosition: "end"` puts the icon at the **block-end** edge,
  which in RTL is the visual left — the natural "forward"
  direction in Hebrew.

### `<Card>`
```ts
type CardProps = {
  padding?: "sm" | "md" | "lg";
  hoverable?: boolean;
  elevation?: "flat" | "raised" | "floating";       // default "flat"
  tone?: "cream" | "cream-3" | "espresso" | "jachnun";  // default "cream"
  children: ReactNode;
}
```
- Always: `border rounded-card` + the tone's surface and border.
- `hoverable`: lifts 4px and steps up to `shadow-lg`. Implies
  `elevation="raised"` at rest, so a hoverable card never appears to
  fall when the pointer leaves.
- `tone="espresso" | "jachnun"` exist so dark sections stop being
  hand-rolled with one-off class strings.

### `<Section>`
```ts
type SectionProps = {
  tone?: "cream" | "cream-2" | "cream-3" | "espresso" | "jachnun";
  spacing?: "none" | "sm" | "md" | "lg";  // default "md"
  bleed?: boolean;                        // default true
  children: ReactNode;
}
```
Owns the container width, gutters and vertical rhythm. **Never
hand-write `mx-auto max-w-container px-6 md:px-10 lg:px-16`** — that
string was repeated on ~40 elements before this existed, which is how
gutters drift out of alignment between pages. `bleed` keeps the
background full-width with the container applied inside. The bare
string is exported as `container` for the rare full-bleed case where
only part of a section is constrained.

### `<Eyebrow>`
```ts
type EyebrowProps = {
  tone?: "olive" | "jachnun" | "brass" | "cream";  // default "olive"
  withRule?: boolean;
  children: ReactNode;
}
```
Renders the eyebrow type scale. `withRule` prepends a tone-matched
`w-8 h-px` rule.

**On a coloured band, match the tone to the ground, not to the brand:**
`tone="jachnun"` on `bg-jachnun` is terracotta on terracotta and is
invisible. Dark bands take `tone="cream"`.

No italic — `--font-latin` is Noto Sans Hebrew, which has no italic
cut, so the browser would synthesise a slanted fake. Uppercase plus
`0.22em` tracking carries the role.

### `<CafeImage>`
```ts
type CafeImageProps = {
  variant: PlaceholderVariant;  // interior | cup | pastry | tray |
                                // jachnun | founder | instagram | map
  alt: string;                  // Hebrew, required even with no src
  src?: string;
  priority?: boolean;
  ratio?: string;               // Tailwind aspect class
  sizes?: string;
  tone?: "olive" | "espresso" | "jachnun" | "brass" | "cream";
}
```
The single image slot on the site. With `src` it renders `next/image`
under the CLAUDE.md §8 rules; without one it renders authored line art,
`aria-hidden`, with no misleading alt. **`alt` is required either way**
so swapping in real photography can never ship an unlabelled image.
Never use a bare `<img>` or a `[TODO: תמונה]` box.

### `<SectionHeading>`
```ts
type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;  // typically a Button
  as?: "h2" | "h3";    // default "h2"
}
```
On `md+`, if `action` is provided, it renders in the row-opposite
corner from the title.

### `<FormField>`
```ts
type FormFieldProps = {
  label: string;
  name: string;
  type: "text" | "tel" | "email" | "number" | "date" | "select" | "textarea";
  required?: boolean;
  error?: string;
  hint?: string;
  options?: { value: string; label: string }[];  // for "select"
}
```
- Label on top, right-aligned (RTL start).
- Required: red asterisk after label.
- Input: `bg-cream border border-stroke rounded-input px-4 py-3 focus:border-olive focus:ring-2 focus:ring-olive/20`.
- **`min-h-[48px]`** on every field — below that a thumb misses it.
- Error: `text-jachnun text-sm mt-1` (terracotta as warning), plus an
  `aria-[invalid=true]` border/ring so the state is visible without
  reading the message.
- Hint: `text-espresso-soft text-sm mt-1`.

**Touch targets:** every interactive element clears 44px on mobile.
`<Button>` enforces this per size; anything hand-rolled must too.

### `<FAQBlock>` and `<FAQSchema>`
Two paired components — render together on every FAQ page.

```ts
type FAQItem = { q: string; a: string };
type FAQBlockProps = { items: FAQItem[]; heading?: string; id?: string };
type FAQSchemaProps = { items: FAQItem[] };
```

`<FAQBlock>` uses native `<details>`/`<summary>` (zero JS,
accessible by default).
`<FAQSchema>` emits `FAQPage` JSON-LD with the same items.
Pages compose them — never bundle the schema into the block.

Pass `id` when a page renders two blocks; the default `"faq-heading"`
would otherwise appear twice and break `aria-labelledby`.

**Never wrap an FAQ answer, or `<FactualParagraph>`, in `<SplitReveal>`
or any per-word component.** Those strings are exactly what AI engines
quote; they stay plain text nodes in one container.

---

## 7. Motion Rules

The site runs a **cinematic** motion treatment. This section was
rewritten in 2026-08-02 — it previously forbade most of what is now
required. See the Decision Log for why.

Never invent a variant inline. Every easing, duration and distance
lives in `/lib/motion.ts`; every effect has a component in
`/components/motion/`.

### Three hard rules

**1. The `<h1>` is never gated behind hydration.**
Hero reveals use **CSS `@keyframes`** (`.hero-word`, `.hero-fade` in
`globals.css`), which paint from the SSR HTML before JS loads. A Framer
`initial={{ opacity: 0 }}` on an `<h1>` ships the largest text on the
page at zero opacity and holds it there until the bundle arrives —
that is an LCP regression dressed as a design decision. Framer Motion
is for **below the fold only**.

**2. Pinning is CSS `position: sticky`. Never a JS scroll hijack.**
`<PinnedScene>` is a tall spacer with a sticky child. Scroll stays 1:1
with page distance; wheel, trackpad, find-in-page and the scrollbar all
keep their normal meaning. No `wheel` listener, no `preventDefault`,
no scroll libraries (§2 still forbids Lenis and Locomotive).

**3. Reduced motion is a kill switch, not a slowdown.**
`<MotionProvider>` sets `reducedMotion="user"`; `globals.css` clamps
animation duration and delay. Anything that exists *only* as motion
(the scroll cue, rail travel, the ticker) is removed, not sped up.
Pinning and parallax fall back to static layout. Verify by emulating
the preference — do not assume.

### Allowed

| Effect | Component | Constraint |
|---|---|---|
| Entrance fade/translate | `<Reveal>` | `once: true`, `-80px` margin |
| Staggered groups | `<Stagger>` / `<StaggerItem>` | ≤ 0.1s between children |
| Parallax | `<Parallax>` | `translateY` only, ≤ ±0.4 speed, halved below `md` |
| Pinned scene | `<PinnedScene>` | sticky only; unpinned below `md` |
| Horizontal rail | `<HorizontalRail>` | native snap-swipe below `md` |
| Hero word reveal | `<SplitText>` | CSS keyframes, server component |
| Heading word reveal | `<SplitReveal>` | `h2`/`h3` only, never body copy |
| Image wipe | `<ImageReveal>` | `clip-path` + `scale` |
| Magnetic hover | `<Magnetic>` | ≤ 6px, `(pointer: fine)` only |
| Ticker | `<Ticker>` | duplicate is `aria-hidden`, pauses on hover |
| Counter | `<Counter>` | final value in the SSR HTML |
| Scroll progress | `<ScrollProgress>` | `aria-hidden`, `scaleX` |
| Hover | — | ≤ 4px lift or ≤ 1.02 scale, `--dur-fast` |
| Nav scroll state | `Nav` | scroll-linked, `--dur-base` |

### Forbidden

- **JS scroll hijacking** of any kind, and scroll-smoothing libraries.
- Animating `width`, `height`, `top`, `left`, `margin` — compositor
  properties (`transform`, `opacity`, `clip-path`, `filter`) only.
- Motion on an `<h1>` that delays first paint.
- Loading screens, page-transition delays, typewriter effects.
- Per-word splitting of body copy, FAQ answers, or
  `<FactualParagraph>`.
- Motion that moves a tap target under the user's finger.

### Splitting Hebrew text

`<SplitText>` and `<SplitReveal>` split on **whitespace only**, so
`ג'חנון` is never broken at the gershayim. Each span holds a real text
node — nothing duplicated, nothing `aria-hidden` — so the accessibility
tree and any crawler's `textContent` are identical to plain markup.
The word separator sits **outside** the masked span: that span is an
`inline-block` with `overflow: hidden` and would swallow a trailing
space, running the words together.

### Budget

Home page, 4× CPU throttle, full scroll: no long task > 50ms.
Lighthouse mobile on `/` and `/jachnun`: **LCP < 2.5s, CLS < 0.1**.
Pinned scenes and reveals are the classic way to wreck both — measure
after adding one.

---

## 8. Image Rules

- All imagery via `next/image`.
- Hero image: `priority`, `quality={85}`, sized to viewport.
- Below-fold images: lazy by default, `quality={75}`.
- Every image has Hebrew `alt` text describing the content
  ("כריך גבינה צהובה במגש כסוף לארוחת בוקר"). Decorative-only
  images: `alt=""`.
- Aspect ratios:
  - Hero: `aspect-[16/9]` desktop, `aspect-[4/5]` mobile
  - Cards: `aspect-square` or `aspect-[4/3]`, consistent within
    a section
  - Instagram grid: `aspect-square`
- Subtle grain overlay allowed on hero only:
  `opacity-[0.04]`, no higher.

---

## 9. Content Rules

Voice: warm, neighborhood, slightly literary. Not corporate,
not casual-trendy. Reference: the existing site's tone.

**Placeholder convention.** Every value a human must fill in is
marked `[TODO: short description]`. Examples:
- `[TODO: real menu prices]`
- `[TODO: founder names and photo]`
- `[TODO: exact opening hours per day]`

**Single source of truth:** `/content/business.ts` exports NAP,
hours, geo. Every component that needs this info imports from
there. Never duplicate.

**Never invent:** prices, dates, specific people, awards,
certifications, kashrut status. Use `[TODO]`.

---

## 10. SEO Conventions

**Title format:** `"<Page topic> | קפה הכרם — בית קפה בגני תקווה"`

| Route       | Title                                                    |
|-------------|----------------------------------------------------------|
| `/`         | `קפה הכרם — בית קפה בוטיקי בגני תקווה`                   |
| `/menu`     | `התפריט שלנו \| קפה הכרם — בית קפה בגני תקווה`           |
| `/about`    | `הסיפור שלנו \| קפה הכרם — בית קפה בגני תקווה`           |
| `/jachnun`  | `ג'חנון של שבת להזמנה \| קפה הכרם — גני תקווה`           |
| `/catering` | `מגשי אירוח להזמנה \| קפה הכרם — גני תקווה`              |
| `/contact`  | `צור קשר, שעות וכתובת \| קפה הכרם — גני תקווה`           |

**Meta descriptions:** 140–160 chars, Hebrew, factual, include
one location keyword + one offering keyword. No fluff.

**URLs:** Lowercase Latin slugs. Hebrew for content, Latin for
routes. Better for sharing, analytics, redirects.

**Schema (JSON-LD):**
- Global in `/app/layout.tsx`: `CafeOrCoffeeShop` with NAP, geo,
  openingHours, telephone, priceRange, servesCuisine, sameAs.
- Per-page additions:
  - `/menu`: `Menu` + `MenuSection` + `MenuItem`
  - `/jachnun`: `Product` + `FAQPage`
  - `/catering`: `Service` + `FAQPage`
  - `/about`: `AboutPage`
  - `/contact`: `ContactPage` + `LocalBusiness`
  - All: `BreadcrumbList`

**H1:** Exactly one per page, contains the primary local keyword
(neighborhood + offering).

**Internal linking:** Each page links to ≥3 other internal pages
in context.

**Redirects (in `next.config.js`):**
- Old WordPress URLs with backlinks → new equivalent pages (301).
- Enumerate from Search Console once available.

---

## 11. GEO Conventions

GEO = Generative Engine Optimization. Goal: when ChatGPT,
Perplexity, Google AI Overviews, or Claude is asked "best café
in גני תקווה", "where to get ג'חנון near Tel Aviv", they have
extractable, factual, quotable content to cite.

### Rule 1: FAQ blocks on every page
Use `<FAQBlock>` + `<FAQSchema>` paired. Questions in natural
Hebrew (how a person would actually ask). Answers: 1–3
declarative sentences, factual, self-contained.

FAQ data lives in `/content/faqs.ts` keyed by page.

### Rule 2: Factual-statement paragraph
Every page contains one short paragraph of "boring" declarative
sentences with the subject ("קפה הכרם") named explicitly. Example
for home:

> קפה הכרם הוא בית קפה בוטיקי בגני תקווה, ברחוב הכרמל 20. הקפה
> פתוח בימים [TODO] בין השעות [TODO]. הקפה מציע ארוחות בוקר,
> כריכים, מאפים, מגשי אירוח וג'חנון של שבת להזמנה מראש. הטלפון
> של קפה הכרם הוא 053-557-4194.

Visually subtle (placed low on page, small text). Functionally
critical for AI extraction.

### Rule 3: Entity consistency
Always exact same form:
- `קפה הכרם` — never `הכרם`, never `Cafe Hakerem` inside Hebrew
  prose, never `קפה־הכרם`
- `גני תקווה` — never `ג"ת`, never `גני־תקווה`
- `ג'חנון` — never with curly gershayim, never `ג'אחנון`
- `מגשי אירוח` — never `קייטרינג`

### Rule 4: Authorship & trust signals
- About and Contact pages contain a small footer block naming
  who runs the café and how long it's been operating
  (`[TODO]` both for now).
- Link to Google reviews from Contact.

### Rule 5: Structured-data redundancy
Same fact (e.g. phone number) appears in: visible text, JSON-LD,
FAQ answers, `tel:` link. Don't avoid the repetition — AI engines
reward concurrence across formats.

---

## 12. Accessibility

- Color contrast: WCAG AA minimum on every text/bg pair.
  Verify `espresso-soft` on `cream`.
- Focus states on every interactive element (the olive ring).
- Form labels associated via `htmlFor`/`id`; errors via
  `aria-describedby`.
- Skip-to-content link, visually hidden until focused.
- Native `<details>` for FAQs handles keyboard accessibility.
- Map iframe has a Hebrew `title`.
- Decorative images: `alt=""`. Meaningful images: Hebrew alt.
- All pages render usable HTML without JS (test by disabling
  JS in DevTools).
- RTL specifics:
  - Layout mirroring verified at mobile width (375px).
  - Arrows pointing "forward" point LEFT visually (Hebrew reads
    right-to-left).
  - Form labels right-aligned (RTL start).
  - Numerals: Western digits.
  - Currency: `₪28` (RTL renders correctly).

---

## 13. Backend Conventions

### API routes
All under `/app/api/`. Pattern for every route:

1. Parse body with a Zod schema imported from `/lib/validation.ts`.
2. Apply business logic (cutoff checks for jachnun, etc.).
3. Persist via Prisma.
4. Send notification email via Resend.
5. Return JSON: `{ ok: true, reference?: string }` or
   `{ ok: false, error: string }` with appropriate status code.
6. Errors return **Hebrew** messages (these are user-facing).

### Validation
All Zod schemas in `/lib/validation.ts`. Phone validation must
accept Israeli mobile formats: `05X-XXXXXXX`, `05XXXXXXXX`,
`+9725XXXXXXXX`.

### Jachnun cutoff (`/lib/jachnun-cutoff.ts`)
- Timezone: `Asia/Jerusalem`.
- Orders open for the upcoming Shabbat until Thursday 18:00.
- After Thursday 18:00: only the *following* Shabbat's slots
  are offered.
- `getAvailableSlots()` returns the slots for whichever window
  is currently open.

### Email templates
HTML email with `dir="rtl"` and Hebrew content. Send to
`process.env.CAFE_NOTIFICATION_EMAIL`. From address: a verified
Resend sender (set up at deploy time).

### Rate limiting
v1: in-memory per-IP, 5 requests/min per endpoint. **Not
production-grade at scale.** Upgrade to Upstash Ratelimit before
real traffic. Tracked in Decision Log.

### No admin dashboard in v1
Café sees orders via email. A read-only `/admin` route behind
basic auth can come in v1.5 if needed.

---

## 14. Decision Log

A running list of choices and why. Append, don't rewrite.

**2026-05-28 — Next.js over Vite SPA.**
We need SSR for SEO and a real backend for jachnun orders.
Vite would force a separate backend service. Next.js does both
in one repo.

**2026-05-28 — No CMS (no Sanity, no headless WP).**
Content volume is low (~6 pages of mostly static copy). A CMS
adds hosting, auth, schema modeling, and a UI the café doesn't
need. Content in typed files is version-controlled, free, and
faster to ship. Trade-off: copy edits require a code change and
deploy. Acceptable for this scale.

**2026-05-28 — Subdirectory (`/jachnun`), not subdomain.**
Jachnun is a sub-brand but not a separate business. A subdomain
would split domain authority for no benefit. A dedicated section
on the main domain lets jachnun rank independently while
inheriting the parent's authority.

**2026-05-28 — Cream + olive palette, terracotta sub-brand.**
The existing site's cream/olive works for boutique-neighborhood
positioning. We sharpened it (deeper espresso text, deeper olive
accent) for more contrast and character. Terracotta on jachnun
gives the sub-brand a distinct identity without breaking the
parent palette.

**2026-05-28 — No video, no loading screen, no parallax.**
Brief is "quiet boutique," not "dramatic studio." Restrained
motion reads as confident; heavy motion reads as compensating.
Also: no source video assets available, and motion budget should
go to fast LCP, not animation.

**2026-05-28 — Frank Ruhl Libre + Heebo over Assistant/Rubik.**
Frank Ruhl Libre is a serif — adds the "bakery/boutique" warmth
the brief wants. Heebo is the cleanest neutral Hebrew sans on
Google Fonts. Avoided Rubik (too playful) and Assistant (too
generic-tech).

**2026-05-28 — GEO as a first-class concern.**
FAQ blocks paired with FAQPage schema, factual-statement
paragraphs, entity consistency. Without these, AI engines have
nothing extractable; with them, the site becomes citable in
ChatGPT/Perplexity/AI Overviews for "café in גני תקווה" and
"ג'חנון" queries.

**2026-05-28 — No online payment in v1 for jachnun.**
Stripe (or Israeli equivalent) adds compliance, settlement,
and refund logic. v1 ships pre-orders only; pay on pickup. Add
payment in v2 if order volume justifies.

**2026-05-28 — In-memory rate limiting in v1.**
Good enough for launch traffic. Upgrade to Upstash before any
marketing push that could drive volume.

**2026-05-28 — `content/business.ts` extended with hours, socials, siteUrl.**
The initial file scaffold was truncated mid-`geo` and did not include
`hours`, `socials`, `priceRange`, `servesCuisine`, or `siteUrl`. These
are all referenced by the global schema, the Contact page, sitemap,
and robots — so the file was extended in place, every new field
marked `[TODO]`. The single-source-of-truth rule (§9) is preserved.

**2026-05-28 — Home page section sequence.**
CLAUDE.md calls for "all 8 sections in order" but doesn't enumerate
them. Adopted sequence: (1) Hero, (2) Three values, (3) Menu preview
strip, (4) Jachnun promo (terracotta band), (5) Catering promo,
(6) About preview, (7) Instagram grid, (8) FAQ + factual paragraph.
This ordering follows brand → product → trust → social → extraction.

**2026-05-28 — Static hand-curated Instagram grid (no Meta API).**
Live Instagram API requires Meta auth, refresh tokens, and rate-limit
handling. For a 6-page boutique site that updates IG infrequently,
the cost dominates the benefit. Posts live in `/content/instagram.ts`
and are updated whenever the café asks.

**2026-05-28 — `dynamic = "force-dynamic"` on API routes.**
Jachnun slots shift across the Thursday 18:00 cutoff. Caching at the
edge would serve stale "this Shabbat" slots to customers ordering for
next Shabbat. Order/inquiry routes are also marked dynamic to ensure
the in-memory rate limiter sees real per-request state.

**2026-05-28 — Resend client lazy + non-fatal.**
The order/inquiry flow persists to Prisma first; the email is a
notification. If `RESEND_API_KEY` is missing in dev (or Resend errors
transiently), the order still succeeds. Otherwise a 500 here would
lose customer orders the café could otherwise rescue from the DB.

**2026-05-28 — Native `<details>` for FAQs.**
Per CLAUDE.md §6, the FAQ block uses the platform's accordion — zero
JS, accessible-by-default with keyboard navigation, and works with
JS disabled. The schema component is decoupled (under `/seo/`) so
pages compose them rather than getting them bundled together.

**2026-05-28 — Postgres (Neon) for local and production.**
Original spec had SQLite local / Postgres prod. Killed: Vercel's
read-only filesystem can't run SQLite, and dual-provider risks
schema drift. Single provider, one mental model.

**2026-05-28 — Upstash Ratelimit from day one.**
Vercel's serverless model invalidates in-memory rate limiting.
Upstash free tier is more than enough for this scale; shipping
it now avoids a v1.5 migration on broken code.

**2026-05-28 — Timezone math via Intl.DateTimeFormat.**
Vercel runs UTC. Raw Date arithmetic for the jachnun cutoff
appears correct locally and miscalculates on production.
Intl.DateTimeFormat with timeZone: "Asia/Jerusalem" is the
only safe pattern. Verified by unit tests at edge times.

**2026-05-28 — check:todos is local-only.**
Vercel runs `next build`. The TODO check is a developer
guardrail (`npm run preflight`), not a deploy gate. Catches
content gaps where the developer is, not where the deploy is.

**2026-05-28 — All content pages force-static with 24h revalidate.**
A café site is read-mostly. Static rendering eliminates per-
request function invocations for normal traffic. Revalidation
refreshes content daily without manual deploy. Only the two
form-submission API routes remain dynamic.

**2026-05-28 — Slot computation moved client-side.**
/api/jachnun-slots was a function invocation that computed a
pure function over static data. Moved to a client-side import
of getAvailableSlots() from /lib/jachnun-cutoff.ts. The API
route is deleted. Eliminates one function invocation per page
load on /jachnun.

**2026-05-28 — Unified type system on Noto Sans Hebrew.**
Replaced the original Heebo / Frank Ruhl Libre / Instrument Serif
trio with a single family, Noto Sans Hebrew, bound to all three CSS
variables (`--font-body`, `--font-display`, `--font-latin`). Reasons:
(1) consistent baseline + metrics across body/headlines/eyebrows;
(2) Noto's wide weight range (300→900) carries hierarchy without
needing family contrast; (3) one font payload instead of three —
smaller LCP. Variable names kept so all existing `font-body` /
`font-display` / `font-latin` utilities still work — they just point
at the same family now. Latin eyebrows lose their italic-serif
treatment; uppercase + 0.25em tracking + olive color does the work.

**2026-05-28 — Image optimization device list trimmed.**
next/image's default device list is wide; the design only uses
breakpoints up to 1200px. Trimmed deviceSizes/imageSizes to
match the design, reducing optimization invocations.

**2026-05-28 — Home page adopts two design-lab moments.**
After reviewing the three `/design-lab/*` variants, the merge is:
(1) the bento menu block ("מה אופים השבוע.") from the *bento*
variant replaces the thin menu-preview strip in section 3, and
(2) the "כשמגיעים אורחים." catering block from the *editorial*
variant replaces the thin catering-promo strip in section 5. Both
are composed inline in `app/(site)/page.tsx` using only existing
tokens and the §6 primitives — no new components, no new tokens.
The bento variant's horizontal marquee is a §7 violation
("Forbidden: marquees"), so the main home ships only the static
pill-wrap form of that tile (the same form the bento variant
renders under `prefers-reduced-motion`). This keeps the home a
server component and stays within §7.

**2026-07-06 — Breadcrumbs + state-of-the-art GEO audit.**
Added visible breadcrumb navigation on all inner pages (light, RTL-
correct, semantic `<ol>`). Breadcrumbs pair with existing
BreadcrumbSchema JSON-LD for redundancy across visual + structured
data — a key GEO signal. Simultaneously added two pre-deploy
validation scripts: `npm run check:todos` (content completeness) and
`npm run check:geo` (AI search visibility). The latter checks: (1)
entity consistency (קפה הכרם vs הכרם, etc.); (2) FAQ answer quality
(named-entity reference + length); (3) metadata structure (title <70ch,
desc 140–160ch); (4) schema completeness (BreadcrumbSchema, page-
specific schema, FactualParagraph on all content pages); (5) internal
linking. Pre-flight gate (`npm run preflight`) runs both checks +
build. Updated FactualParagraph component to open with explicit
neighborhood reference (גבעת סביון) for AI extraction accuracy.

**2026-08-02 — Cinematic motion, overriding the old §7.**
§7 previously forbade parallax, scroll-pinning, marquees, counters and
scroll-progress bars. The café asked for the opposite: an extreme,
art-directed treatment. Rather than ship code that contradicts this
file, §7 was rewritten around what the site now does, with each effect
carrying its own performance and accessibility constraint.

The original ban was not wrong for its reason — it was protecting LCP,
scroll integrity and reduced-motion users. Those three concerns are
preserved as the *hard rules* at the top of the new §7 rather than
being dropped: CSS-keyframe heroes, `position: sticky` instead of
scroll hijacking, and reduced motion as a genuine kill switch. What
changed is the conclusion, not the priorities.

Practical shape: `lib/motion.ts` holds every constant;
`components/motion/` holds thirteen wrappers plus two hooks. All wrappers
take `children`, so pages stay server components and the rendered text
is unchanged. Framer is loaded through `LazyMotion` + `domAnimation` +
the `m` namespace with `strict` — ~6kb instead of ~34kb, and a stray
`motion.*` import fails the build rather than silently re-inflating it.

**2026-08-02 — Single family kept; weight extremes do the work.**
Reintroducing a display serif (Frank Ruhl Libre, as the original spec
had) was considered and rejected — one family, one payload, one set of
metrics. The cost is that hierarchy can no longer come from family
contrast, so it comes from the 300↔900 weight span instead:
`.type-display` at 900 with `-0.03em` tracking, `.type-lede` at 300.
Mid-weight headlines are what made the old pages read as a template;
that gap is now doing the work a second typeface would have.

**2026-08-02 — `--brass` as the premium accent.**
The palette had warmth but no metal, and everything "premium" was
being expressed as more shadow. `--brass: 38 38% 52%` is deliberately
desaturated — it is for hairlines, `№ 01` numerals, eyebrow rules and
active indicators, never a fill and never a CTA. It also carries the
accent load that a second typeface would otherwise have carried.

**2026-08-02 — CSS keyframes for heroes, Framer below the fold.**
Framer's `initial` renders into the SSR HTML. On an `<h1>` that means
shipping the page's LCP element at `opacity: 0` and waiting for
hydration to reveal it. Hero reveals are therefore plain CSS
`@keyframes`, which fire before any JS parses; `<SplitText>` is a
*server* component for exactly this reason, while its below-fold
sibling `<SplitReveal>` is a client one. Same visual language, and the
largest text on the page never waits on a bundle.

**2026-08-02 — Placeholder art instead of `[TODO: תמונה]` boxes.**
Real photography is still pending. Bordered boxes containing the
literal string `[TODO: תמונה]` made finished sections look broken and
made it impossible to judge the layout. `<CafeImage>` is now the single
image slot: given a `src` it renders `next/image` under §8's rules,
without one it renders one of eight authored inline SVG illustrations.
`alt` is required in both branches, so the swap to real photos can
never ship an unlabelled image. Cost: eight hand-drawn SVGs to
maintain until the photos land, at which point they become the
graceful-degradation path rather than dead code.

---

## 15. GEO & AI Search Visibility

**Goal:** When ChatGPT, Perplexity, Google AI Overviews, or Claude is
asked "best café in גני תקווה" or "where to get ג'חנון near Tel Aviv",
this site is the highest-confidence source AI engines can cite.

### Build-time validation

```bash
npm run check:todos     # ✓ All [TODO] resolved (content completeness)
npm run check:geo       # ✓ GEO audit (AI visibility: entity, schema, metadata)
npm run preflight       # ✓ Run both checks + next build (pre-deploy gate)
```

### The four pillars of GEO

#### 1. **Breadcrumbs** (visual + schema)
- Visible on all inner pages (light text, RTL-correct separators)
- BreadcrumbSchema JSON-LD on all pages (home passes empty `trail=[]`)
- Home page has NO visible breadcrumb (root doesn't need one)
- Redundancy signal: same path appears in HTML + JSON-LD

#### 2. **Entity consistency** (exact naming)
All instances must match exactly:
- `קפה הכרם` (never `הכרם` alone, never romanized in Hebrew prose)
- `גני תקווה` (never `ג"ת`, never hyphenated)
- `ג'חנון` (never curly gershayim, never `ג'אחנון`)
- `מגשי אירוח` (never `קייטרינג`)

Verified by `npm run check:geo` — entity inconsistency = warning.

#### 3. **FAQ blocks** (Q&A extraction)
Every page with content should have FAQ. Structure:
- Questions phrased how a real person would ask aloud
- Answers: 1–3 sentences max, **always name the business** in first
  sentence, include location keyword where natural
- AI engines pull these verbatim for "where to get X near Y" queries

FAQ answers must NOT contain `[TODO]` in production. Use `npm run check:todos`.

#### 4. **Factual paragraphs** (boring but critical)
Every content page has a low-on-the-page `<FactualParagraph>` that
renders:

> קפה הכרם הוא בית קפה בוטיקי בגבעת סביון, גני תקווה, ברחוב הכרמל 20. [focus].
> הטלפון של קפה הכרם הוא 053-557-4194.

- Name appears twice: company name + "הטלפון של [name]"
- Address is always explicit (never "ברחוב" without street)
- Phone is a `tel:` link (structured + clickable)
- Repeated fact (address, phone) across visual text + schema = trust
  signal for AI

#### Metadata structure

| Element | Min | Max | Placement | Example |
|---------|-----|-----|-----------|---------|
| Title | — | 70ch | `"[Topic] \| קפה הכרם — בית קפה בגני תקווה"` | "התפריט שלנו \| קפה הכרם — בית קפה בגני תקווה" |
| Description | 140ch | 160ch | `<meta name="description">` | Include location + offering keywords |

#### Schema checklist per page

| Page | BreadcrumbSchema | Page Schema | FAQSchema | FactualParagraph |
|------|------------------|------------|-----------|------------------|
| Home | ✓ (empty trail) | Organization | ✓ | ✓ |
| Menu | ✓ | Menu | ✓ | ✓ |
| About | ✓ | AboutPage | ✓ | ✓ |
| Jachnun | ✓ | Product | ✓ | ✓ |
| Catering | ✓ | Service | ✓ | ✓ |
| Contact | ✓ | ContactPage | ✓ | ✓ |
| Privacy | ✓ | — | — | — |

### Before shipping v1

- [ ] All `[TODO]` resolved in `/content` (run `npm run check:todos`)
- [ ] All FAQ answers complete (no placeholders, entity-named, <300ch)
- [ ] Metadata: all titles <70ch, all descriptions 140–160ch
- [ ] Breadcrumbs: verify visual render on all inner pages
- [ ] FactualParagraph: spot-check 2–3 pages (visible + correct)
- [ ] Schema: validate 1–2 pages with Google's Rich Results Test
- [ ] GEO audit passes (run `npm run check:geo`)
- [ ] Internal linking: verify ≥3 links from each page
- [ ] Entity consistency: no mixing of naming variants

### After launch

Monitor ChatGPT/Perplexity/Google AI Overviews for:
- Does the café appear when you ask "בית קפה בגני תקווה"?
- Is the phone number extracted correctly?
- Do FAQs appear in the response?
- Is the address cited?

If yes: GEO is working. If no: audit the page that should rank.

---

## How to use this file

- Before any non-trivial change: re-read sections 4–13.
- Before adding a new pattern: check if a contract already exists
  in section 6. Extend it, don't fork it.
- Before making a design or architecture choice not covered:
  add it to the Decision Log with reasoning, then implement.
- If you ship something that contradicts this file, either fix
  the code or update this file — never let them drift.