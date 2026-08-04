"use client";

/**
 * The kiosk counter — a big − / value / + control.
 *
 * Sized for a thumb on a phone held one-handed: 56px targets at the small
 * size and 64px at the large one, well past the 44px floor in CLAUDE.md §6.
 * The value is `tabular-nums` so it does not jitter horizontally as it counts
 * past 9, which would move the + button under the user's finger — the one
 * thing §7 forbids outright.
 *
 * A visually-hidden `<input type="number">` carries the same value so screen
 * readers and autofill see a real form control, while the buttons announce
 * changes through `aria-live`.
 */

type QuantityStepperProps = {
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  /** Accessible name for the control as a whole, e.g. "כמות ג'חנון". */
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
  size?: "md" | "lg";
  /** Rendered under the value, e.g. "₪38 ליחידה". */
  caption?: string;
  name?: string;
};

const sizes = {
  md: {
    button: "h-14 w-14",
    glyph: "text-2xl",
    value: "text-4xl min-w-[3ch]",
  },
  lg: {
    button: "h-16 w-16 md:h-[4.5rem] md:w-[4.5rem]",
    glyph: "text-3xl md:text-4xl",
    value: "text-6xl md:text-7xl min-w-[2.5ch]",
  },
};

export function QuantityStepper({
  value,
  min,
  max,
  onChange,
  label,
  decreaseLabel,
  increaseLabel,
  size = "md",
  caption,
  name,
}: QuantityStepperProps) {
  const s = sizes[size];
  const atMin = value <= min;
  const atMax = value >= max;

  const button =
    "inline-flex items-center justify-center rounded-full border border-stroke bg-cream-3 " +
    "text-espresso shadow-sm transition-[background-color,border-color,transform,box-shadow] " +
    "duration-fast ease-out-soft hover:border-brass-ink/55 hover:shadow-md active:scale-[0.96] " +
    "disabled:opacity-35 disabled:hover:border-stroke disabled:hover:shadow-sm " +
    "disabled:active:scale-100 disabled:cursor-not-allowed";

  return (
    <div role="group" aria-label={label} className="inline-flex flex-col items-center gap-2">
      <div className="flex items-center gap-5 md:gap-7">
        {/* RTL: the − sits at the reading start (right), + at the end. */}
        <button
          type="button"
          className={`${button} ${s.button}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={atMin}
          aria-label={decreaseLabel}
        >
          <span aria-hidden className={`${s.glyph} leading-none -mt-0.5`}>
            −
          </span>
        </button>

        <div className="text-center">
          <output
            aria-live="polite"
            className={`type-display block tabular-nums text-espresso ${s.value}`}
          >
            {value}
          </output>
          <input type="hidden" name={name} value={value} readOnly />
        </div>

        <button
          type="button"
          className={`${button} ${s.button}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={atMax}
          aria-label={increaseLabel}
        >
          <span aria-hidden className={`${s.glyph} leading-none -mt-0.5`}>
            +
          </span>
        </button>
      </div>

      {caption ? (
        <span className="text-sm text-espresso-soft tabular-nums">{caption}</span>
      ) : null}
    </div>
  );
}
