/**
 * The phase-1 pre-order's items and money, shared by the form and
 * /api/jachnun-preorder so the total on screen is the total in the café's
 * email. Integer agorot throughout (lib/money.ts).
 */

import { burekasServing, jachnun, jachnunUnitPriceAgorot, type JachnunPackage } from "@/content/jachnun";

export const PREORDER_ITEM_IDS = ["jachnun", "burekas"] as const;
export type PreorderItemId = (typeof PREORDER_ITEM_IDS)[number];
export type PreorderQuantities = Record<PreorderItemId, number>;

export const PREORDER_MAX: PreorderQuantities = { jachnun: 50, burekas: 30 };

const UNIT_AGOROT: PreorderQuantities = {
  jachnun: jachnunUnitPriceAgorot,
  burekas: burekasServing.priceAgorot,
};

export type PreorderLine = {
  id: PreorderItemId;
  name: string;
  qty: number;
  unitAgorot: number;
  totalAgorot: number;
};

export const unitAgorot = (id: PreorderItemId) => UNIT_AGOROT[id];

export function preorderLines(q: PreorderQuantities): PreorderLine[] {
  return PREORDER_ITEM_IDS.filter((id) => q[id] > 0).map((id) => ({
    id,
    name: jachnun.preorder.items[id].name,
    qty: q[id],
    unitAgorot: UNIT_AGOROT[id],
    totalAgorot: q[id] * UNIT_AGOROT[id],
  }));
}

export const preorderUnits = (q: PreorderQuantities) => q.jachnun + q.burekas;

export const preorderTotalAgorot = (q: PreorderQuantities) =>
  preorderLines(q).reduce((sum, line) => sum + line.totalAgorot, 0);

/**
 * The email, ticket and PDF templates render one `JachnunPackage`. Folding the
 * order into that shape lets them show jachnun and burekas without changing.
 */
export function preorderAsPackage(q: PreorderQuantities): JachnunPackage {
  return {
    id: "solo",
    title: jachnun.preorder.orderTitle(q.jachnun, q.burekas),
    description: "",
    units: preorderUnits(q),
    totalAgorot: preorderTotalAgorot(q),
    popular: false,
  };
}
