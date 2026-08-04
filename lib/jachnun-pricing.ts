/**
 * Jachnun order pricing — pure functions over `jachnunPricing`.
 *
 * Imported by both the checkout UI and `/api/jachnun-order`. The API
 * recomputes the total from the selection and compares it to the number the
 * browser sent; a mismatch is rejected rather than charged. Nothing here
 * touches the clock, the network or React, so it is trivially testable and
 * the two sides can never disagree about what an order costs.
 *
 * All amounts are integer agorot (see lib/money.ts).
 */

import { jachnun, jachnunPricing, type AddonKey } from "@/content/jachnun";

export type { AddonKey };

/** Paid extras, on top of what every unit already includes for free. */
export type Extras = Record<AddonKey, number>;

export type PriceLine = {
  key: string;
  label: string;
  /** Number of items on this line. */
  qty: number;
  /** Price of one item on this line, in agorot. `0` for included items. */
  unitAgorot: number;
  totalAgorot: number;
  /** Short qualifier shown next to the label, e.g. "כלול". */
  note?: string;
  /** Included-with-the-unit line — rendered muted, never adds to the total. */
  included?: boolean;
};

export type PricedOrder = {
  lines: PriceLine[];
  /** Effective per-jachnun price after the bundle rule. */
  unitPriceAgorot: number;
  bundleApplied: boolean;
  /** What the bundle rule saved on this order. `0` when it did not apply. */
  savingsAgorot: number;
  totalAgorot: number;
};

/** How close the order is to the bundle price — drives the step-1 nudge. */
export type BundleNudge = {
  unitsAway: number;
  bundleUnitAgorot: number;
  savingsAgorot: number;
};

export const EMPTY_EXTRAS: Extras = { tomato: 0, olives: 0, egg: 0 };

export const ADDON_KEYS = Object.keys(jachnunPricing.addons) as AddonKey[];

/** Ceiling on paid extras of one kind, given the number of units ordered. */
export function maxExtrasFor(units: number): number {
  return Math.max(0, clampUnits(units) * jachnunPricing.maxExtraPerUnit);
}

export function clampUnits(units: number): number {
  const n = Number.isFinite(units) ? Math.round(units) : jachnun.form.minQuantity;
  return Math.min(jachnun.form.maxQuantity, Math.max(jachnun.form.minQuantity, n));
}

/**
 * Bring extras back inside the cap. Called whenever the unit count drops —
 * otherwise lowering units from 5 to 1 would leave 15 paid tomato portions
 * silently attached to a one-jachnun order.
 */
export function clampExtras(units: number, extras: Extras): Extras {
  const cap = maxExtrasFor(units);
  const out = { ...EMPTY_EXTRAS };
  for (const key of ADDON_KEYS) {
    const n = Number.isFinite(extras?.[key]) ? Math.round(extras[key]) : 0;
    out[key] = Math.min(cap, Math.max(0, n));
  }
  return out;
}

export function unitPriceFor(units: number): number {
  return units >= jachnunPricing.bundleThreshold
    ? jachnunPricing.bundleUnitAgorot
    : jachnunPricing.unitAgorot;
}

/**
 * The whole order in line items. The included add-ons get their own zero-cost
 * lines on purpose: "you are getting 4 tomato portions, free" is a stronger
 * summary than silence, and it stops customers paying for extras they already
 * have.
 */
export function priceOrder(input: { units: number; extras: Extras }): PricedOrder {
  const units = clampUnits(input.units);
  const extras = clampExtras(units, input.extras ?? EMPTY_EXTRAS);

  const unitPriceAgorot = unitPriceFor(units);
  const bundleApplied = unitPriceAgorot === jachnunPricing.bundleUnitAgorot;

  const lines: PriceLine[] = [
    {
      key: "jachnun",
      label: "ג'חנון",
      qty: units,
      unitAgorot: unitPriceAgorot,
      totalAgorot: units * unitPriceAgorot,
    },
  ];

  for (const key of ADDON_KEYS) {
    const addon = jachnunPricing.addons[key];
    const includedQty = units * addon.includedPerUnit;
    if (includedQty > 0) {
      lines.push({
        key: `${key}-included`,
        label: addon.label,
        qty: includedQty,
        unitAgorot: 0,
        totalAgorot: 0,
        note: "כלול",
        included: true,
      });
    }
    if (extras[key] > 0) {
      lines.push({
        key: `${key}-extra`,
        label: `${addon.label} נוסף`,
        qty: extras[key],
        unitAgorot: addon.extraAgorot,
        totalAgorot: extras[key] * addon.extraAgorot,
      });
    }
  }

  const totalAgorot = lines.reduce((sum, l) => sum + l.totalAgorot, 0);
  const savingsAgorot = bundleApplied
    ? units * (jachnunPricing.unitAgorot - jachnunPricing.bundleUnitAgorot)
    : 0;

  return { lines, unitPriceAgorot, bundleApplied, savingsAgorot, totalAgorot };
}

/**
 * The step-1 upsell. Returns null once the bundle already applies, or when
 * the order is empty — a nudge shown to someone who has not chosen anything
 * yet reads as pressure, not help.
 */
export function bundleNudge(units: number): BundleNudge | null {
  const n = clampUnits(units);
  const { bundleThreshold, unitAgorot, bundleUnitAgorot } = jachnunPricing;
  if (n < 1 || n >= bundleThreshold) return null;
  return {
    unitsAway: bundleThreshold - n,
    bundleUnitAgorot,
    savingsAgorot: bundleThreshold * (unitAgorot - bundleUnitAgorot),
  };
}

/** Total number of physical items, for the "X פריטים" summary line. */
export function itemCount(units: number, extras: Extras): number {
  const e = clampExtras(units, extras);
  return clampUnits(units) + ADDON_KEYS.reduce((sum, k) => sum + e[k], 0);
}
