import { describe, expect, it } from "vitest";
import {
  clampExtras,
  itemCount,
  maxExtrasFor,
  packageById,
  packageForUnits,
  priceOrder,
  unitsForPackage,
} from "@/lib/jachnun-pricing";
import { formatILS } from "@/lib/money";
import { jachnun, jachnunPackages, jachnunPricing, jachnunStartingPriceAgorot } from "@/content/jachnun";

const NO_EXTRAS = { tomato: 0, olives: 0, egg: 0 };
const { addons, maxExtraPerUnit } = jachnunPricing;

describe("formatILS", () => {
  it("drops the decimals on whole shekels", () => {
    expect(formatILS(3800)).toBe("₪38");
    expect(formatILS(0)).toBe("₪0");
  });

  it("keeps two digits when there are agorot", () => {
    expect(formatILS(3850)).toBe("₪38.50");
    expect(formatILS(105)).toBe("₪1.05");
  });
});

describe("packages", () => {
  it("charges exactly the package's price with no extras", () => {
    for (const pkg of jachnunPackages) {
      const priced = priceOrder({ packageId: pkg.id, extras: NO_EXTRAS });
      expect(priced.units).toBe(pkg.units);
      expect(priced.totalAgorot).toBe(pkg.totalAgorot);
    }
  });

  it("has no savings on the solo package", () => {
    const priced = priceOrder({ packageId: "solo", extras: NO_EXTRAS });
    expect(priced.savingsAgorot).toBe(0);
  });

  it("shows savings on a multi-unit package versus buying singles", () => {
    const duo = packageById("duo");
    const priced = priceOrder({ packageId: "duo", extras: NO_EXTRAS });
    expect(priced.savingsAgorot).toBe(duo.units * jachnunStartingPriceAgorot - duo.totalAgorot);
    expect(priced.savingsAgorot).toBeGreaterThan(0);
  });

  it("returns an empty priced order when nothing is selected", () => {
    const priced = priceOrder({ packageId: null, extras: NO_EXTRAS });
    expect(priced.units).toBe(0);
    expect(priced.lines).toHaveLength(0);
    expect(priced.totalAgorot).toBe(0);
  });

  it("resolves a package by its unit count (receipt reconstruction)", () => {
    for (const pkg of jachnunPackages) {
      expect(packageForUnits(pkg.units)?.id).toBe(pkg.id);
    }
    expect(packageForUnits(9999)).toBeUndefined();
  });

  it("keeps unit counts unique across packages", () => {
    const seen = new Set(jachnunPackages.map((p) => p.units));
    expect(seen.size).toBe(jachnunPackages.length);
  });
});

describe("included add-ons", () => {
  it("gives every unit its free portion and charges nothing for it", () => {
    const priced = priceOrder({ packageId: "quintet", extras: NO_EXTRAS });
    const included = priced.lines.filter((l) => l.included);

    expect(included).toHaveLength(2);
    for (const line of included) {
      expect(line.qty).toBe(priced.units);
      expect(line.totalAgorot).toBe(0);
    }
    expect(priced.totalAgorot).toBe(packageById("quintet").totalAgorot);
  });
});

describe("paid extras", () => {
  it("adds each extra at its own price on top of the package price", () => {
    const duo = packageById("duo");
    const priced = priceOrder({ packageId: "duo", extras: { tomato: 2, olives: 1, egg: 0 } });
    expect(priced.totalAgorot).toBe(
      duo.totalAgorot + 2 * addons.tomato.extraAgorot + 1 * addons.olives.extraAgorot,
    );
  });

  it("keeps the total equal to the sum of its own lines", () => {
    const priced = priceOrder({ packageId: "deca", extras: { tomato: 3, olives: 5, egg: 2 } });
    const sum = priced.lines.reduce((acc, l) => acc + l.totalAgorot, 0);
    expect(priced.totalAgorot).toBe(sum);
  });

  it("never lists a not-included-by-default addon (egg) as included, only as a paid line", () => {
    const priced = priceOrder({ packageId: "quintet", extras: { tomato: 0, olives: 0, egg: 2 } });
    const included = priced.lines.filter((l) => l.included);
    expect(included.every((l) => l.label !== addons.egg.label)).toBe(true);
    const eggLine = priced.lines.find((l) => l.key === "egg-extra");
    expect(eggLine?.totalAgorot).toBe(2 * addons.egg.extraAgorot);
  });
});

describe("caps and clamping", () => {
  it("caps extras at maxExtraPerUnit per unit", () => {
    expect(maxExtrasFor(2)).toBe(2 * maxExtraPerUnit);
    const clamped = clampExtras(2, { tomato: 999, olives: 999, egg: 999 });
    expect(clamped.tomato).toBe(2 * maxExtraPerUnit);
    expect(clamped.olives).toBe(2 * maxExtraPerUnit);
    expect(clamped.egg).toBe(2 * maxExtraPerUnit);
  });

  it("re-clamps extras when the package shrinks", () => {
    // The duo package allows 6 extras; dropping to solo must not leave 5 behind.
    const clamped = clampExtras(unitsForPackage("solo"), { tomato: 12, olives: 0, egg: 0 });
    expect(clamped.tomato).toBe(maxExtraPerUnit);
  });

  it("rejects negative extras", () => {
    expect(clampExtras(2, { tomato: -5, olives: -1, egg: -3 })).toEqual({
      tomato: 0,
      olives: 0,
      egg: 0,
    });
  });
});

describe("itemCount", () => {
  it("counts jachnun plus paid extras, not the included ones", () => {
    expect(itemCount(3, { tomato: 2, olives: 1, egg: 1 })).toBe(7);
  });
});

describe("display strings", () => {
  it("keeps the marketing copy in step with the numbers", () => {
    expect(jachnun.pricing.perUnit).toContain(formatILS(jachnunStartingPriceAgorot));
  });
});
