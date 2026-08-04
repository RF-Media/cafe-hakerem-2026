/**
 * "Open now / closed" status for the hero's Visit card.
 *
 * Same Asia/Jerusalem technique as `jachnun-cutoff.ts` but a separate,
 * self-contained helper — that file's date-parts logic isn't exported,
 * and this is a different concern (instantaneous open/closed vs.
 * Shabbat slot windows), so duplicating ~15 lines beats coupling them.
 *
 * Always called client-side (see `OpenStatusBadge`): this page is
 * force-static with a 24h revalidate, so a server-computed status would
 * go stale until the next revalidation.
 */

import type { Business } from "@/content/business";

const TZ = "Asia/Jerusalem";

export type OpenStatus = { isOpen: boolean; label: string };

function partsInJerusalem(instant: Date): { hour: number; minute: number; weekday: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(instant).map((p) => [p.type, p.value]),
  ) as Record<string, string>;

  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return {
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    weekday: weekdayMap[parts.weekday] ?? 0,
  };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function getOpenStatus(hours: Business["hours"], now: Date = new Date()): OpenStatus {
  const p = partsInJerusalem(now);
  const today = hours.find((h) => h.day === p.weekday);
  const nowMinutes = p.hour * 60 + p.minute;

  if (today?.open && today.close) {
    const openMinutes = toMinutes(today.open);
    const closeMinutes = toMinutes(today.close);
    if (nowMinutes < openMinutes) {
      return { isOpen: false, label: `נפתח היום ב-${today.open}` };
    }
    if (nowMinutes < closeMinutes) {
      return { isOpen: true, label: `פתוח עכשיו · עד ${today.close}` };
    }
  }
  return { isOpen: false, label: "סגור כרגע" };
}
