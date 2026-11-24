---
created: 2026-11-18T20:22:14.134Z
title: Add aggregateRating + review schema (Merchant listings / Products)
area: seo
files:
  - app/(site)/jachnun/page.tsx
  - content/faqs.ts
---

## Problem

Search Console "Enhancements" only lists Breadcrumbs. `/jachnun` emits a valid
`Product` with a flat `Offer` (2026-11-13), which qualifies it for the
Merchant listings / Product snippet enhancement — but Google rarely renders
the snippet without `aggregateRating` or `review`.

## Solution (TBD)

1. Source real reviews — likely a Google-reviews embed on `/about` or
   `/contact`, not invented ratings (§9 forbids inventing).
2. Add `aggregateRating` (ratingValue, reviewCount) to the `Product` on
   `/jachnun`, and optionally to the global `CafeOrCoffeeShop` node in
   `app/layout.tsx`.
3. Add individual `Review` items if we can display them.
4. Re-run Rich Results Test; watch Search Console Enhancements over 2–4 weeks
   for a new "Merchant listings" or "Review snippets" row.

Requires café input: which review source (Google Business Profile reviews
are the obvious one) and sign-off that displayed reviews are real customer
reviews, not curated.
