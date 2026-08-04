/**
 * FormField — single input primitive used by /catering and the jachnun
 * checkout.
 *
 * Supports text, tel, email, number, date, select, textarea.
 * Label sits above the field, right-aligned (RTL start). Required
 * markers, hints, and errors render in canonical positions.
 *
 * Uncontrolled by default (`defaultValue`, read back via `FormData`). Pass
 * `value` + `onChange` for the controlled mode the multi-step checkout needs:
 * a step that unmounts loses whatever the DOM was holding, so the draft has
 * to live above the field. The two modes are mutually exclusive — passing
 * `value` switches the field over.
 */

export type FormFieldProps = {
  label: string;
  name: string;
  type: "text" | "tel" | "email" | "number" | "date" | "select" | "textarea";
  required?: boolean;
  error?: string;
  hint?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string | number;
  placeholder?: string;
  min?: number;
  max?: number;
  rows?: number;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric" | "decimal";
  /** Controlled mode. When present, `defaultValue` is ignored. */
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  /** Overrides the derived `f-${name}` id — needed when a name repeats. */
  id?: string;
  maxLength?: number;
  disabled?: boolean;
};

// 48px minimum height: below that, a thumb misses the field on a phone.
// Exported so the checkout's compound phone field (prefix + subscriber
// number, in components/order/OrderStepDetails.tsx) can match this exactly
// instead of hand-copying the string.
export const inputClasses =
  "w-full min-h-[48px] bg-cream border border-stroke rounded-input px-4 py-3 " +
  "text-espresso placeholder:text-espresso-soft/60 " +
  "hover:border-espresso-soft/40 " +
  "focus:border-olive focus:ring-2 focus:ring-olive/20 focus:outline-none " +
  "transition-[border-color,box-shadow,background-color] duration-base ease-out-soft " +
  "disabled:opacity-60 disabled:cursor-not-allowed " +
  "aria-[invalid=true]:border-jachnun aria-[invalid=true]:ring-2 " +
  "aria-[invalid=true]:ring-jachnun/15";

export function FormField({
  label,
  name,
  type,
  required,
  error,
  hint,
  options,
  defaultValue,
  placeholder,
  min,
  max,
  rows = 4,
  autoComplete,
  inputMode,
  value,
  onChange,
  onBlur,
  id: idProp,
  maxLength,
  disabled,
}: FormFieldProps) {
  const id = idProp ?? `f-${name}`;
  const describedBy = [
    hint ? `${id}-hint` : null,
    error ? `${id}-err` : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const controlled = value !== undefined;
  const shared = {
    id,
    name,
    required,
    disabled,
    "aria-describedby": describedBy,
    "aria-invalid": Boolean(error),
    className: inputClasses,
    onBlur,
    ...(controlled
      ? { value, onChange: (e: { target: { value: string } }) => onChange?.(e.target.value) }
      : { defaultValue: defaultValue as string | undefined }),
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-espresso mb-2 text-start">
        {label}
        {required ? <span aria-hidden className="text-jachnun"> *</span> : null}
      </label>

      {type === "textarea" ? (
        <textarea {...shared} placeholder={placeholder} rows={rows} maxLength={maxLength} />
      ) : type === "select" ? (
        <select {...shared}>
          {(options ?? []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input
          {...shared}
          type={type}
          placeholder={placeholder}
          min={min}
          max={max}
          maxLength={maxLength}
          autoComplete={autoComplete}
          inputMode={inputMode}
        />
      )}

      {/* Reserved even when empty, so an error appearing on blur doesn't
          shift every field below it. */}
      <div className="mt-1 min-h-[1.25rem] text-sm">
        {error ? (
          <p id={`${id}-err`} role="alert" className="text-jachnun">{error}</p>
        ) : hint ? (
          <p id={`${id}-hint`} className="text-espresso-soft">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
