"use client";

/**
 * The week at a glance: one bar per day from opening to closing, so the short
 * Friday and the open Saturday show without reading a number. The numbers sit
 * beside it, and they are what a screen reader gets.
 *
 * Today is resolved after mount for the same reason as `HoursList`: the page is
 * static and the visitor is in another timezone from the server. It only changes
 * a colour, so nothing moves when it lands.
 */
import { useEffect, useState } from "react";
import { business } from "@/content/business";
import { mapPage } from "@/content/map";
import { todayInJerusalem } from "@/lib/hours-status";

/* The bars' vertical axis, in hours. */
const AXIS_FROM = 6;
const AXIS_TO = 22;

const hoursOf = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h + m / 60;
};

function groupedHours() {
  const groups: { first: string; last?: string; range: string | null }[] = [];
  for (const h of business.hours) {
    const range = h.open && h.close ? `${h.open}–${h.close}` : null;
    const prev = groups[groups.length - 1];
    if (prev && prev.range === range) prev.last = h.label.he;
    else groups.push({ first: h.label.he, range });
  }
  return groups;
}

export function WeekHours() {
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    setToday(todayInJerusalem());
  }, []);

  return (
    <div className="flex items-end justify-between gap-6">
      <ul className="min-w-0 flex-1 space-y-1 text-sm md:text-base">
        {groupedHours().map((g) => (
          <li key={g.first} className="flex flex-wrap justify-between gap-x-3">
            <span className="text-cream/85">{g.last ? `${g.first}–${g.last}` : g.first}</span>
            {/* <bdi>: an en dash is a bidi neutral, so a bare range in an RTL run
                displays closing time first. */}
            <bdi dir="ltr" className="tabular-nums">
              {g.range ?? "סגור"}
            </bdi>
          </li>
        ))}
      </ul>

      <div aria-hidden className="flex shrink-0 gap-[5px]">
        {business.hours.map((h) => {
          const isToday = today === h.day;
          const start = h.open ? hoursOf(h.open) : AXIS_FROM;
          const end = h.close ? hoursOf(h.close) : AXIS_FROM;
          return (
            <div key={h.day} className="flex flex-col items-center gap-1">
              <div className="relative h-16 w-[9px] rounded-full bg-cream/10">
                <span
                  className={`absolute inset-x-0 rounded-full transition-colors duration-base ${isToday ? "bg-brass" : "bg-cream/50"}`}
                  style={{
                    top: `${((start - AXIS_FROM) / (AXIS_TO - AXIS_FROM)) * 100}%`,
                    height: `${((end - start) / (AXIS_TO - AXIS_FROM)) * 100}%`,
                  }}
                />
              </div>
              <span className={`text-[0.6875rem] leading-none ${isToday ? "font-bold text-brass" : "text-cream/85"}`}>
                {mapPage.dayLetters[h.day]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
