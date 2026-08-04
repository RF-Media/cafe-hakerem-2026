"use client";

/**
 * Step 3 — pickup window.
 *
 * Large radio cards, not a `<select>`. A dropdown on a phone opens an OS
 * wheel that covers the screen and shows one option at a time; four windows
 * fit at once and can be compared.
 *
 * The slots themselves are computed by `OrderFlow` after mount — never during
 * render, because the server runs in UTC and the visitor is in Asia/Jerusalem,
 * and around the Thursday 18:00 cutoff the two disagree about which Shabbat
 * is on offer. That is a hydration mismatch on the one field where being
 * wrong costs a real order.
 */

import type { Slot } from "@/lib/jachnun-cutoff";
import { orderCopy } from "@/content/jachnun-order";

type Props = {
  slots: Slot[] | null;
  selectedIso: string | null;
  onSelect: (iso: string) => void;
  error?: string;
};

export function OrderStepPickup({ slots, selectedIso, onSelect, error }: Props) {
  const copy = orderCopy.steps.pickup;
  const loading = slots === null;

  return (
    <div className="space-y-6">
      {error ? (
        <p
          role="alert"
          className="rounded-card border border-jachnun/40 bg-jachnun/[0.07] px-5 py-4 text-sm text-jachnun"
        >
          {error}
        </p>
      ) : null}

      <fieldset>
        <legend className="sr-only">{copy.legend}</legend>

        {loading ? (
          <ul className="space-y-3" aria-busy="true" aria-label={copy.loading}>
            {[0, 1, 2, 3].map((i) => (
              <li
                key={i}
                className="h-[76px] rounded-card border border-stroke bg-cream-2/60"
                aria-hidden
              />
            ))}
          </ul>
        ) : slots.length === 0 ? (
          <p className="rounded-card border border-stroke bg-cream-3 px-5 py-6 text-espresso-soft">
            {copy.empty}
          </p>
        ) : (
          <ul className="space-y-3">
            {slots.map((slot) => {
              const selected = slot.iso === selectedIso;
              return (
                <li key={slot.iso}>
                  <label
                    className={
                      "flex items-center gap-4 min-h-[76px] cursor-pointer rounded-card border-2 " +
                      "px-5 py-4 shadow-sm transition-[border-color,background-color,box-shadow] " +
                      "duration-base ease-out-soft " +
                      (selected
                        ? "border-espresso bg-cream-3 shadow-md"
                        : "border-stroke bg-cream-3 hover:border-brass-ink/45")
                    }
                  >
                    <input
                      type="radio"
                      name="pickupSlot"
                      value={slot.iso}
                      checked={selected}
                      onChange={() => onSelect(slot.iso)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className={
                        "grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 " +
                        "transition-colors duration-fast " +
                        (selected ? "border-espresso bg-espresso text-cream" : "border-stroke")
                      }
                    >
                      {selected ? <span className="text-xs leading-none">✓</span> : null}
                    </span>
                    <span className="type-title text-base md:text-xl text-espresso tabular-nums">
                      {slot.label}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </fieldset>

      <p className="rounded-card border border-stroke bg-cream-2 px-5 py-4 text-sm text-espresso-soft">
        {copy.cutoffNote}
      </p>
    </div>
  );
}
