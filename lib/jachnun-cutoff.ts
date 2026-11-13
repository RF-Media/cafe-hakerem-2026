/**
 * Asia/Jerusalem timezone math for jachnun pre-orders.
 *
 * Rules (CLAUDE.md §13):
 *   - Orders open for the upcoming Shabbat until Friday 16:00 Jerusalem time.
 *   - After Friday 16:00, only the FOLLOWING Shabbat's slots are offered.
 *   - `getAvailableSlots()` returns the slots for whichever window is open.
 *
 * Implementation notes:
 *   - All comparisons go through `now()` (injectable for tests).
 *   - Slot windows are configured in /content/jachnun.ts, but the
 *     specific windows there are [TODO]s. For the server, the slot
 *     start times below are the bookable anchors — the labels shown
 *     to the user come from /content/jachnun.ts. We expose the slot
 *     as an ISO string of its absolute UTC start.
 */

const TZ = "Asia/Jerusalem";

/**
 * Half-hour slot start times across the café's Saturday pickup window,
 * 08:00–15:00 local Jerusalem clock (see CLAUDE.md §13).
 */
function buildSaturdaySlotHours(startHour: number, endHour: number): { hour: number; minute: number; label: string }[] {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const slots: { hour: number; minute: number; label: string }[] = [];
  for (let totalMin = startHour * 60; totalMin < endHour * 60; totalMin += 30) {
    const hour = Math.floor(totalMin / 60);
    const minute = totalMin % 60;
    const endMin = totalMin + 30;
    const endLabel = `${pad(Math.floor(endMin / 60))}:${pad(endMin % 60)}`;
    slots.push({ hour, minute, label: `${pad(hour)}:${pad(minute)}–${endLabel}` });
  }
  return slots;
}

const SATURDAY_SLOT_HOURS = buildSaturdaySlotHours(8, 15);

export type Slot = {
  /** Absolute UTC ISO timestamp of slot start — what gets submitted/stored. */
  iso: string;
  /** Hebrew label shown in the dropdown (Saturday date + window). */
  label: string;
  /** The two halves of `label`, for pickers that show the date once. */
  day: string;
  window: string;
};

/**
 * Returns the date parts of `instant` interpreted in Asia/Jerusalem.
 * Used so we can do "is it past Friday 16:00?" arithmetic in local time
 * without pulling in a heavy date library.
 */
function partsInJerusalem(instant: Date): {
  year: number; month: number; day: number;
  hour: number; minute: number; weekday: number; // 0=Sun..6=Sat
} {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
    weekday: "short",
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(instant).map((p) => [p.type, p.value]),
  ) as Record<string, string>;

  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour) % 24, // 24 -> 0
    minute: Number(parts.minute),
    weekday: weekdayMap[parts.weekday] ?? 0,
  };
}

/**
 * Converts a Jerusalem local wall clock (year/month/day/hour/minute) to
 * an absolute UTC `Date`. Handles DST by trial: build a candidate UTC,
 * see what its Jerusalem wall clock is, then nudge by the difference.
 */
function jerusalemLocalToUtc(y: number, m: number, d: number, h: number, min: number): Date {
  // First guess: treat the wall clock as if it were UTC, then correct.
  const guess = new Date(Date.UTC(y, m - 1, d, h, min));
  const seen = partsInJerusalem(guess);
  const deltaMin =
    ((seen.year - y) * 525600) +
    ((seen.month - m) * 43800) + // rough; only used for shift sign
    ((seen.day - d) * 1440) +
    ((seen.hour - h) * 60) +
    (seen.minute - min);
  return new Date(guess.getTime() - deltaMin * 60_000);
}

/**
 * Days to add (in Jerusalem calendar) to reach the next Saturday,
 * given the current Jerusalem weekday. If today is Saturday: 7.
 */
function daysToNextSaturday(weekday: number): number {
  // weekday: 0=Sun..6=Sat. Next Saturday is at weekday=6.
  const diff = (6 - weekday + 7) % 7;
  return diff === 0 ? 7 : diff;
}

/**
 * Is the current moment past Friday 16:00 Jerusalem time?
 * If yes, the upcoming Shabbat is closed for new orders — move to the next.
 */
function isPastFridayCutoff(p: ReturnType<typeof partsInJerusalem>): boolean {
  // Past cutoff if: today is Friday and hour >= 16, OR today is Saturday.
  if (p.weekday === 5 && p.hour >= 16) return true;
  if (p.weekday === 6) return true;
  return false;
}

/**
 * Returns the bookable Saturday's date (Jerusalem calendar) given `now`.
 */
export function targetSaturday(now: Date = new Date()): { year: number; month: number; day: number } {
  const p = partsInJerusalem(now);
  let add = daysToNextSaturday(p.weekday);
  if (isPastFridayCutoff(p)) add += 7;

  // Add `add` days to (year, month, day) via a date math helper.
  const base = new Date(Date.UTC(p.year, p.month - 1, p.day));
  base.setUTCDate(base.getUTCDate() + add);
  return {
    year: base.getUTCFullYear(),
    month: base.getUTCMonth() + 1,
    day: base.getUTCDate(),
  };
}

/**
 * Available pickup slots for the currently-open Shabbat.
 */
export function getAvailableSlots(now: Date = new Date()): Slot[] {
  const sat = targetSaturday(now);
  const dateLabel = `${sat.day.toString().padStart(2, "0")}/${sat.month
    .toString()
    .padStart(2, "0")}`;
  const day = `שבת ${dateLabel}`;
  return SATURDAY_SLOT_HOURS.map(({ hour, minute, label }) => ({
    iso: jerusalemLocalToUtc(sat.year, sat.month, sat.day, hour, minute).toISOString(),
    label: `${day} · ${label}`,
    day,
    window: label,
  }));
}

/**
 * Server-side validation: does this ISO string match one of the
 * currently-available slots?
 */
export function isAvailableSlot(iso: string, now: Date = new Date()): boolean {
  return getAvailableSlots(now).some((s) => s.iso === iso);
}
