import { describe, expect, it } from "vitest";
import {
  bundleNudge,
  clampExtras,
  clampUnits,
  itemCount,
  maxExtrasFor,
  priceOrder,
  unitPriceFor,
} from "@/lib/jachnun-pricing";
import { formatILS } from "@/lib/money";
import { jachnun, jachnunPricing } from "@/content/jachnun";

const NO_EXTRAS = { tomato: 0, olives: 0, egg: 0 };
const { unitAgorot, bundleUnitAgorot, bundleThreshold, addons, maxExtraPerUnit } = jachnunPricing;

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

describe("bundle threshold", () => {
  it("charges the full price one unit below the threshold", () => {
    const units = bundleThreshold - 1;
    const priced = priceOrder({ units, extras: NO_EXTRAS });
    expect(priced.bundleApplied).toBe(false);
    expect(priced.unitPriceAgorot).toBe(unitAgorot);
    expect(priced.totalAgorot).toBe(units * unitAgorot);
    expect(priced.savingsAgorot).toBe(0);
  });

  it("applies the bundle price to the whole order at the threshold", () => {
    const priced = priceOrder({ units: bundleThreshold, extras: NO_EXTRAS });
    expect(priced.bundleApplied).toBe(true);
    expect(priced.unitPriceAgorot).toBe(bundleUnitAgorot);
    expect(priced.totalAgorot).toBe(bundleThreshold * bundleUnitAgorot);
    expect(priced.savingsAgorot).toBe(bundleThreshold * (unitAgorot - bundleUnitAgorot));
  });

  it("keeps the bundle price above the threshold", () => {
    expect(unitPriceFor(bundleThreshold + 3)).toBe(bundleUnitAgorot);
  });
});

describe("bundleNudge", () => {
  it("names the gap and the saving below the threshold", () => {
    const nudge = bundleNudge(bundleThreshold - 1);
    expect(nudge).not.toBeNull();
    expect(nudge!.unitsAway).toBe(1);
    expect(nudge!.savingsAgorot).toBe(bundleThreshold * (unitAgorot - bundleUnitAgorot));
  });

  it("goes quiet once the bundle already applies", () => {
    expect(bundleNudge(bundleThreshold)).toBeNull();
    expect(bundleNudge(bundleThreshold + 5)).toBeNull();
  });
});

describe("included add-ons", () => {
  it("gives every unit its free portion and charges nothing for it", () => {
    const units = 3;
    const priced = priceOrder({ units, extras: NO_EXTRAS });
    const included = priced.lines.filter((l) => l.included);

    expect(included).toHaveLength(2);
    for (const line of included) {
      expect(line.qty).toBe(units);
      expect(line.totalAgorot).toBe(0);
    }
    expect(priced.totalAgorot).toBe(units * unitAgorot);
  });
});

describe("paid extras", () => {
  it("adds each extra at its own price", () => {
    const priced = priceOrder({ units: 2, extras: { tomato: 2, olives: 1, egg: 0 } });
    expect(priced.totalAgorot).toBe(
      2 * unitAgorot + 2 * addons.tomato.extraAgorot + 1 * addons.olives.extraAgorot,
    );
  });

  it("keeps the total equal to the sum of its own lines", () => {
    const priced = priceOrder({ units: 7, extras: { tomato: 3, olives: 5, egg: 2 } });
    const sum = priced.lines.reduce((acc, l) => acc + l.totalAgorot, 0);
    expect(priced.totalAgorot).toBe(sum);
  });

  it("never lists a not-included-by-default addon (egg) as included, only as a paid line", () => {
    const priced = priceOrder({ units: 3, extras: { tomato: 0, olives: 0, egg: 2 } });
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

  it("re-clamps extras when the unit count drops", () => {
    // 5 units allow 15 extras; dropping to 1 unit must not leave 12 behind.
    const clamped = clampExtras(1, { tomato: 12, olives: 0, egg: 0 });
    expect(clamped.tomato).toBe(maxExtraPerUnit);
  });

  it("clamps units to the configured order bounds", () => {
    expect(clampUnits(0)).toBe(jachnun.form.minQuantity);
    expect(clampUnits(9999)).toBe(jachnun.form.maxQuantity);
    expect(clampUnits(Number.NaN)).toBe(jachnun.form.minQuantity);
    expect(clampUnits(3.4)).toBe(3);
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
    expect(jachnun.pricing.perUnit).toContain(formatILS(unitAgorot));
    expect(jachnun.pricing.bundleNote).toContain(formatILS(bundleUnitAgorot));
    expect(jachnun.pricing.bundleNote).toContain(String(bundleThreshold));
  });
});
