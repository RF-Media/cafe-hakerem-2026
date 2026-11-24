---
created: 2026-11-18T20:22:14.134Z
title: New business favicon + app icon from the real café logo
area: branding
files:
  - app/icon.svg
  - app/apple-icon.png
  - app/favicon.ico
  - public/icons/icon-192.png
  - public/icons/icon-512.png
  - app/manifest.ts
  - app/layout.tsx:98
---

## Problem

The site's icon pipeline uses a generic coffee-cup glyph (`app/icon.svg`,
`app/apple-icon.png`, `app/favicon.ico`), not the actual café mark. The
Organization JSON-LD `logo` points at `logo_dark.png` (1200×532 wordmark) —
Google accepts it but a square mark reads better in the Logo rich result.

Source asset: the square card image the café provided (arch mark + "קפה הכרם"
wordmark inside a rounded card). Also uploaded at
<https://app.coffeestream.co.il/admin/businesses/cafehakerem/settings>.

## Solution

Mirror CoffeeStream's convention (see `coffeestream/lib/app-icon.ts`):

| File                      | Size   | Shape    | Reason                                          |
|---------------------------|--------|----------|-------------------------------------------------|
| `app/apple-icon.png`      | 180    | square   | iOS masks the tile; transparent pixels → black  |
| `public/icons/icon-192.png` | 192  | square   | Android home-screen                             |
| `public/icons/icon-512.png` | 512  | square   | PWA install, app-switcher                       |
| `public/icons/maskable-512.png` (new) | 512 | maskable | Android adaptive icon; keep art inside central 80% circle |
| `app/icon.svg` or `favicon.png` | 64 | **rounded (rx ≈ 22.5%)** | Browser tab draws as-is; CoffeeStream rounds it |

Rules:
- Home-screen icons are **square and opaque** — pad the mark with the cream
  brand background, don't ship a transparent PNG (iOS repaints alpha black).
- Only the **favicon** is pre-rounded (iOS squircle, `rx = 0.225 × size`).
- Add `maskable-512.png` with `purpose: "maskable"` to `app/manifest.ts`.
- Consider adding a dedicated square `logo_square.png` and pointing the
  Organization `logo` field (`app/layout.tsx:98`) at it, to unlock the
  Logo enhancement row in Search Console with a cleaner thumbnail.

Steps:
1. Download the uploaded asset from the CoffeeStream admin settings page
   (or export from the brand file).
2. Generate the five PNGs above with sharp/ImageMagick at the required sizes.
3. Replace `app/apple-icon.png`, both `public/icons/*.png`, add
   `maskable-512.png`, and either replace `app/icon.svg` with a square
   SVG of the real mark or add a 64×64 `favicon.png`.
4. Update `app/manifest.ts` to include the maskable entry.
5. Update `app/layout.tsx:98` if a square logo is added.
6. Add a Decision Log entry noting the shape/rounding rule and the
   CoffeeStream parity.
