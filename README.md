# קפה הכרם — Website

A Next.js 14+ App Router site for קפה הכרם, a boutique neighborhood
café in גני תקווה. Hebrew, RTL, light/warm. Six public pages plus
a jachnun pre-order backend and a catering inquiry backend.

**The canonical specification lives in [`CLAUDE.md`](./CLAUDE.md).**
That document wins all ties — read it before changing anything
non-trivial.

---

## Quickstart

```bash
npm install
cp .env.example .env
# fill DATABASE_URL (Postgres — Neon free tier recommended),
# RESEND_API_KEY, RESEND_FROM, CAFE_NOTIFICATION_EMAIL,
# NEXT_PUBLIC_SITE_URL, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN.

npx prisma migrate dev --name init   # applies schema to your Postgres
npm run dev                          # http://localhost:3000
```

## Env vars

| Name                       | What                                                            |
|----------------------------|-----------------------------------------------------------------|
| `DATABASE_URL`             | Postgres connection string (Neon free tier recommended)          |
| `RESEND_API_KEY`           | Resend API key (transactional email)                             |
| `RESEND_FROM`              | Verified sender, e.g. `Cafe Hakerem <orders@your-domain>`        |
| `CAFE_NOTIFICATION_EMAIL`  | Internal inbox where orders + inquiries are delivered            |
| `NEXT_PUBLIC_SITE_URL`     | Canonical absolute origin, e.g. `https://cafehakerem.co.il`      |
| `UPSTASH_REDIS_REST_URL`   | Upstash Redis REST URL (rate limiting)                           |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token (rate limiting)                         |

If `RESEND_API_KEY` is unset, orders still persist to the DB; the
notification email is silently skipped. This is intentional: an email
outage should not lose orders.

## Prisma

Schema: [`prisma/schema.prisma`](./prisma/schema.prisma) — two models,
`JachnunOrder` and `CateringInquiry`.

```bash
npx prisma migrate dev          # apply schema during development
npx prisma migrate deploy       # production deploys
npx prisma studio               # browse rows
```

`schema.prisma` is set to `postgresql` for both local and production —
sign up for a free Neon database and put its connection string in
`DATABASE_URL`.

## Resend

1. Create a Resend account, verify the sending domain.
2. Generate an API key, set `RESEND_API_KEY`.
3. Set `RESEND_FROM` to the verified sender.
4. Set `CAFE_NOTIFICATION_EMAIL` to the café's internal inbox.

Emails are sent in Hebrew with `dir="rtl"`.

## Content

All copy lives in [`/content/`](./content/) — typed `.ts` modules.
Components import from there; never put copy inline.

- `business.ts` — NAP, hours, geo, socials, site URL. Single source of truth.
- `faqs.ts` — FAQs per page.
- `menu.ts`, `about.ts`, `jachnun.ts`, `catering.ts`, `instagram.ts` — per-page content.

Any value the café must provide is marked `[TODO: short description]`.
The build script runs `npm run check:todos` before `next build` and
**fails** until every `[TODO]` is resolved. See "TODO report" below
for what's currently outstanding.

## Build & verify

```bash
npm run typecheck        # tsc --noEmit
npm run check:todos      # fails until [TODO]s are replaced
npm run preflight        # check:todos → next build (run before pushing)
npm run build            # next build (what Vercel runs)
npm test                 # vitest run (unit tests, incl. jachnun cutoff)
```

## Deploy (Vercel)

1. Push to a Git repo, connect to Vercel.
2. Set the env vars above (Production environment), including
   `DATABASE_URL` (Neon Postgres) and the two Upstash variables.
3. Vercel runs `npm run build` (`next build`). Run `npm run preflight`
   locally before pushing — that's where `check:todos` lives now.
4. Run `prisma migrate deploy` from Vercel's build command or a
   one-off `vercel build` locally.
5. Verify schema rendering via [Rich Results Test](https://search.google.com/test/rich-results)
   on the home page (`CafeOrCoffeeShop`) and `/jachnun` (`Product` + `FAQPage`).

## Outstanding TODO report

Run `npm run check:todos` for the live list. Grouped by category:

### Business facts the café must provide

- Opening hours per day (`content/business.ts`)
- Postal code (`content/business.ts`)
- Exact geo coordinates (`content/business.ts`)
- Kashrut status + certifying body (`content/faqs.ts`)
- Outdoor seating, family-friendliness, parking (`content/faqs.ts`)
- Jachnun price per unit + bundle pricing (`content/jachnun.ts`)
- Jachnun pickup windows in HH:MM (`content/jachnun.ts`)
- Catering lead times, sizes, prices, delivery policy (`content/catering.ts`)
- Menu prices and item names per category (`content/menu.ts`)
- Founding year + founder names/bios (`content/about.ts`)
- Resend verified sender domain + notification inbox
- Public email address (or confirmation that there isn't one)

### Photos needed (drop in `/public/images/...`)

- Hero image (16:9 desktop, 4:5 mobile)
- Founders photo (`content/about.ts → founders[].photo`)
- About-page gallery (`content/about.ts → gallery`)
- Jachnun product photo
- Instagram grid: 6 square posts (`content/instagram.ts`)
- Interior photo for home About-preview block

### Copy needed (café writes in their voice)

- About-page hero title + lede + 4 body paragraphs (`content/about.ts`)
- Three "why us" reason titles for jachnun (`content/jachnun.ts`)
- Three catering promise blurbs (`content/catering.ts`)
- Menu category blurbs (`content/menu.ts`)
- Privacy policy "last updated" date (`app/(site)/privacy/page.tsx`)
- Real social profile URLs (Instagram, Google, Waze) (`content/business.ts`)

## Architecture cheat sheet

```
app/
  (site)/                public pages share root layout
  api/                   route handlers — Zod → Prisma → Resend
  sitemap.ts, robots.ts  generated from business.siteUrl
  layout.tsx             RTL <html>, fonts, global CafeOrCoffeeShop JSON-LD
components/
  ui/                    Button, Card, Eyebrow, SectionHeading, FormField, FAQBlock
  layout/                Nav, Footer, MobileBar
  seo/                   JsonLd, FAQSchema, BreadcrumbSchema
  sections/              FactualParagraph, JachnunOrderForm, CateringInquiryForm
content/                 typed copy — single source of truth
lib/                     prisma, resend, validation (Zod), jachnun-cutoff, rate-limit, use-reduced-motion
prisma/schema.prisma     JachnunOrder + CateringInquiry
scripts/check-todos.ts   pre-build TODO guard (already wired)
```
