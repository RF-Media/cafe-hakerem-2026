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

function todayInJerusalem(): number {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jerusalem",
    weekday: "short",
  }).format(new Date());
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

export function HoursList() {
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    setToday(todayInJerusalem());
  }, []);

  return (
    <ul className="text-espresso">
      {business.hours.map((h) => {
        const isToday = today === h.day;
        const closed = !h.open || !h.close;
        return (
          <li
            key={h.day}
            className={
              "flex justify-between gap-4 rounded-input px-2 py-1.5 -mx-2 " +
              "transition-colors duration-base " +
              (isToday ? "bg-brass-ink/10 font-medium" : "")
            }
          >
            <span className="flex items-center gap-2">
              {h.label.he}
              {isToday ? (
                <span className="type-index text-[0.625rem] text-brass-ink">
                  היום
                </span>
              ) : null}
            </span>
            <span className={closed ? "text-espresso-soft" : "text-espresso-soft tabular-nums"}>
              {closed ? "סגור" : `${h.open}–${h.close}`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
