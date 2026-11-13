import { describe, expect, it } from "vitest";
import { preorderAsPackage, preorderLines, preorderTotalAgorot } from "@/lib/preorder";
import { jachnunPreorderSchema } from "@/lib/validation";

describe("pre-order pricing", () => {
  it("prices jachnun at ₪30 and a burekas serving at the menu's ₪36", () => {
    expect(preorderTotalAgorot({ jachnun: 3, burekas: 2 })).toBe(3 * 3000 + 2 * 3600);
  });

  it("drops empty lines", () => {
    expect(preorderLines({ jachnun: 0, burekas: 1 }).map((l) => l.id)).toEqual(["burekas"]);
  });

  it("folds the order into one package line for the email templates", () => {
    expect(preorderAsPackage({ jachnun: 1, burekas: 0 }).title).toBe("ג'חנון");
    expect(preorderAsPackage({ jachnun: 2, burekas: 0 }).title).toBe("ג'חנון × 2");
    const both = preorderAsPackage({ jachnun: 1, burekas: 2 });
    expect(both.title).toBe("ג'חנון × 1 + בורקס תורכי × 2 מנות");
    expect(both.totalAgorot).toBe(3000 + 7200);
  });
});

describe("pre-order schema", () => {
  const base = { name: "ישראל ישראלי", phone: "050-1234567", pickupSlot: "2026-11-14T06:00:00.000Z" };

  it("accepts a submission from before burekas existed", () => {
    const r = jachnunPreorderSchema.safeParse({ ...base, quantity: 2 });
    expect(r.success && r.data.burekas).toBe(0);
  });

  it("accepts burekas only", () => {
    expect(jachnunPreorderSchema.safeParse({ ...base, quantity: 0, burekas: 1 }).success).toBe(true);
  });

  it("rejects an empty order", () => {
    expect(jachnunPreorderSchema.safeParse({ ...base, quantity: 0, burekas: 0 }).success).toBe(false);
  });
});
