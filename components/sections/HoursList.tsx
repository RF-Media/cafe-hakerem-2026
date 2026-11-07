"use client";

/**
 * Opening hours, with today's row picked out.
 *
 * "Today" is resolved after mount, never during render: the server renders
 * in UTC and the visitor is in Asia/Jerusalem, so a server-computed weekday
 * would be wrong for several hours a day and would mismatch on hydration.
 * The list is complete and correct before that runs — the highlight is an
 * enhancement, not the content.
 */
import { useEffect, useState } from "react";
import { business } from "@/content/business";
import { todayInJerusalem } from "@/lib/hours-status";

export function HoursList({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    setToday(todayInJerusalem());
  }, []);

  return (
    <ul className={dark ? "text-cream" : "text-espresso"}>
      {business.hours.map((h) => {
        const isToday = today === h.day;
        const closed = !h.open || !h.close;
        return (
          <li
            key={h.day}
            className={
              "flex justify-between gap-4 rounded-input px-2 py-1.5 -mx-2 " +
              "transition-colors duration-base " +
              (isToday ? (dark ? "bg-cream/10 font-medium" : "bg-brass-ink/10 font-medium") : "")
            }
          >
            <span className="flex items-center gap-2">
              {h.label.he}
              {isToday ? (
                <span className={`type-index text-[0.625rem] ${dark ? "text-brass" : "text-brass-ink"}`}>
                  היום
                </span>
              ) : null}
            </span>
            <span className={`${dark ? "text-cream/85" : "text-espresso-soft"} ${closed ? "" : "tabular-nums"}`}>
              {/* <bdi>: an en dash is a bidi neutral, so a bare "07:00–20:00" in an
                  RTL run displays as closing time first. */}
              {closed ? "סגור" : <bdi dir="ltr">{`${h.open}–${h.close}`}</bdi>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
