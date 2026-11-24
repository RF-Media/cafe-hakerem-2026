---
created: 2026-11-24T00:00:00.000Z
title: Reconcile phase-2 checkout before CHECKOUT_ENABLED goes true
area: jachnun
files:
  - content/jachnun.ts
  - content/jachnun-order.ts
  - lib/jachnun-pricing.ts
  - components/order/
---

## Problem

The gated phase-2 checkout still prices the old packages
(₪35/₪67/₪170/₪339), while the live phase-1 pre-order is ₪30/unit plus
burekas (CLAUDE.md 2026-11-13). The extra-egg add-on (`extraAgorot: 400`) is a
demo value marked CONFIRM BEFORE LAUNCH.

## Solution (TBD)

Before flipping `CHECKOUT_ENABLED`: move the checkout to the phase-1 pricing
model (or get the café's decision on packages), confirm the add-on prices, and
replace `lib/mock-payment.ts` with a real processor.
