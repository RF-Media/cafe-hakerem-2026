"use client";

/**
 * Live clock to Friday 16:00, because a deadline you can see moves people and
 * a sentence about one doesn't. Everything is computed after mount (the page is
 * force-static and the server runs in UTC). Until then, and with JS off, the
 * plain sentence stands in.
 */
import { useEffect, useState } from "react";
import { getAvailableSlots } from "@/lib/jachnun-cutoff";
import { IconClock } from "@/components/ui/icons";

/** Saturday's first pickup slot is 08:00; Friday 16:00 is 16 hours before it. */
const CUTOFF_BEFORE_FIRST_SLOT_MS = 16 * 60 * 60 * 1000;

function remaining(now: Date): string | null {
  const first = getAvailableSlots(now)[0];
  if (!first) return null;
  const ms = new Date(first.iso).getTime() - CUTOFF_BEFORE_FIRST_SLOT_MS - now.getTime();
  if (ms <= 0) return null;
  const totalMinutes = Math.ceil(ms / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const parts = [
    days ? (days === 1 ? "יום" : days === 2 ? "יומיים" : `${days} ימים`) : null,
    hours ? (hours === 1 ? "שעה" : hours === 2 ? "שעתיים" : `${hours} שעות`) : null,
    !days && minutes ? `${minutes} דק'` : null,
  ].filter(Boolean);
  // "יומיים ושעה", but "6 ימים ו-17 שעות": a digit takes the hyphen.
  return parts.reduce<string>(
    (text, part, i) => (i === 0 ? String(part) : `${text} ו${/^\d/.test(String(part)) ? "-" : ""}${part}`),
    "",
  );
}

export function JachnunCountdown({
  prefix,
  fallback,
  className = "",
}: {
  prefix: string;
  fallback: string;
  className?: string;
}) {
  const [left, setLeft] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setLeft(remaining(new Date()));
    tick();
    const timer = setInterval(tick, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <IconClock className="h-5 w-5 shrink-0" />
      <span className="text-sm font-medium md:text-base">
        {left ? (
          <>
            {prefix} <span className="font-bold tabular-nums">{left}</span>
          </>
        ) : (
          fallback
        )}
      </span>
    </span>
  );
}
