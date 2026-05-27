/**
 * Edge-time tests for the Thursday 18:00 Asia/Jerusalem cutoff.
 *
 * Vercel runs UTC, so we construct each "now" as a UTC instant whose
 * Jerusalem wall-clock falls just on either side of the cutoff. Israel
 * is UTC+3 in May (IDT), so 18:00 Jerusalem = 15:00 UTC.
 */
import { describe, it, expect } from "vitest";
import { getAvailableSlots, targetSaturday } from "../jachnun-cutoff";

// May 28, 2026 is a Thursday. IDT = UTC+3.
const thursdayBeforeCutoff = new Date("2026-05-28T14:59:00Z"); // 17:59 IDT
const thursdayAfterCutoff  = new Date("2026-05-28T15:01:00Z"); // 18:01 IDT
const fridayNoon            = new Date("2026-05-29T09:00:00Z"); // 12:00 IDT
const saturdayMorning       = new Date("2026-05-30T05:00:00Z"); // 08:00 IDT

describe("jachnun cutoff", () => {
  it("Thursday 17:59 IDT — upcoming Saturday is bookable (May 30)", () => {
    const sat = targetSaturday(thursdayBeforeCutoff);
    expect(sat).toEqual({ year: 2026, month: 5, day: 30 });
  });

  it("Thursday 18:01 IDT — skips to the following Saturday (June 6)", () => {
    const sat = targetSaturday(thursdayAfterCutoff);
    expect(sat).toEqual({ year: 2026, month: 6, day: 6 });
  });

  it("Friday noon IDT — past cutoff, books next Saturday (June 6)", () => {
    const sat = targetSaturday(fridayNoon);
    expect(sat).toEqual({ year: 2026, month: 6, day: 6 });
  });

  it("Saturday morning IDT — past cutoff, skips the same-day Shabbat and the next, books June 13", () => {
    // On Sat May 30, the upcoming Saturday in 7 days is June 6, but
    // we're already past the Thursday 18:00 cutoff for it — so the
    // bookable date is the one after, June 13.
    const sat = targetSaturday(saturdayMorning);
    expect(sat).toEqual({ year: 2026, month: 6, day: 13 });
  });

  it("getAvailableSlots returns a non-empty list with ISO + Hebrew label", () => {
    const slots = getAvailableSlots(thursdayBeforeCutoff);
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0]!.iso).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(slots[0]!.label).toContain("שבת");
  });
});
