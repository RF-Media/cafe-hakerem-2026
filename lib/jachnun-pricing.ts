/**
 * Jachnun order pricing — pure functions over `jachnunPackages`.
 *
 * Imported by both the checkout UI and `/api/jachnun-order`. The API
 * recomputes the total from the selection and compares it to the number the
 * browser sent; a mismatch is rejected rather than charged. Nothing here
 * touches the clock, the network or React, so it is trivially testable and
 * the two sides can never disagree about what an order costs.
 *
 * All amounts are integer agorot (see lib/money.ts).
 */

import { jachnunPackages, jachnunPricing, type AddonKey, type JachnunPackage, type PackageId } from "@/content/jachnun";

export type { AddonKey, PackageId };

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
  packageId: PackageId | null;
  /** Jachnun units in the selected package. `0` when nothing is selected yet. */
  units: number;
  lines: PriceLine[];
  /** What the package saves versus buying `units` singles at the solo price. `0` for the solo package or an empty order. */
  savingsAgorot: number;
  totalAgorot: number;
};

const EMPTY_PRICED: PricedOrder = {
  packageId: null,
  units: 0,
  lines: [],
  savingsAgorot: 0,
  totalAgorot: 0,
};

export const EMPTY_EXTRAS: Extras = { tomato: 0, olives: 0, egg: 0 };

export const ADDON_KEYS = Object.keys(jachnunPricing.addons) as AddonKey[];

export function packageById(id: PackageId): JachnunPackage {
  const pkg = jachnunPackages.find((p) => p.id === id);
  if (!pkg) throw new Error(`Unknown jachnun package id: ${id}`);
  return pkg;
}

/** Reverse lookup for reconstructing a receipt from a stored unit count (see content/jachnun.ts). */
export function packageForUnits(units: number): JachnunPackage | undefined {
  return jachnunPackages.find((p) => p.units === units);
}

export function unitsForPackage(id: PackageId | null): number {
  return id ? packageById(id).units : 0;
}

/** Ceiling on paid extras of one kind, given the number of units in the selected package. */
export function maxExtrasFor(units: number): number {
  return Math.max(0, units) * jachnunPricing.maxExtraPerUnit;
}

/**
 * Bring extras back inside the cap. Called whenever the selected package
 * shrinks — otherwise switching from the ten-pack to a solo would leave 30
 * paid tomato portions silently attached to a one-jachnun order.
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

/** The solo package IS the per-unit reference every other package's saving is measured against. */
function soloUnitAgorot(): number {
  return packageForUnits(1)?.totalAgorot ?? 0;
}

/**
 * The whole order in line items. The included add-ons get their own zero-cost
 * lines on purpose: "you are getting 4 tomato portions, free" is a stronger
 * summary than silence, and it stops customers paying for extras they already
 * have.
 */
export function priceOrder(input: { packageId: PackageId | null; extras: Extras }): PricedOrder {
  if (!input.packageId) return EMPTY_PRICED;

  const pkg = packageById(input.packageId);
  const units = pkg.units;
  const extras = clampExtras(units, input.extras ?? EMPTY_EXTRAS);

  const lines: PriceLine[] = [
    {
      key: "package",
      label: pkg.title,
      qty: 1,
      unitAgorot: pkg.totalAgorot,
      totalAgorot: pkg.totalAgorot,
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
  const savingsAgorot = Math.max(0, units * soloUnitAgorot() - pkg.totalAgorot);

  return { packageId: pkg.id, units, lines, savingsAgorot, totalAgorot };
}

/** Total number of physical items, for the "X פריטים" summary line. */
export function itemCount(units: number, extras: Extras): number {
  const e = clampExtras(units, extras);
  return units + ADDON_KEYS.reduce((sum, k) => sum + e[k], 0);
}
