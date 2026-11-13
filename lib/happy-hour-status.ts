/**
 * Live status for the happy-hour window on /offers — same Asia/Jerusalem
 * technique as `hours-status.ts`, duplicated rather than imported for the
 * same reason that file gives: a different concern, under 20 lines, not
 * worth coupling two files over.
 *
 * START/END must match the "window" text on the happy-hour entry in
 * content/offers.ts — there's no single source of truth across a free-text
 * string and a time comparison, so keep the two in sync by hand.
 */
const TZ = "Asia/Jerusalem";
const START_MINUTES = 14 * 60;
const END_MINUTES = 19 * 60;

export type HappyHourStatus = { isActive: boolean; label: string };

function minutesNowInJerusalem(now: Date): number {
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false });
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value])) as Record<string, string>;
  return (Number(parts.hour) % 24) * 60 + Number(parts.minute);
}

export function getHappyHourStatus(now: Date = new Date()): HappyHourStatus {
  const minutes = minutesNowInJerusalem(now);
  if (minutes < START_MINUTES) return { isActive: false, label: "מתחיל היום ב-14:00" };
  if (minutes < END_MINUTES) return { isActive: true, label: "פעיל עכשיו · עד 19:00" };
  return { isActive: false, label: "יתחיל מחר ב-14:00" };
}
