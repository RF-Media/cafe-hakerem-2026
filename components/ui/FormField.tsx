/**
 * FormField — single input primitive used by both /jachnun and /catering.
 *
 * Supports text, tel, email, number, date, select, textarea.
 * Label sits above the field, right-aligned (RTL start). Required
 * markers, hints, and errors render in canonical positions.
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
};

const inputClasses =
  "w-full bg-cream border border-stroke rounded-input px-4 py-3 " +
  "text-espresso placeholder:text-espresso-soft/60 " +
  "focus:border-olive focus:ring-2 focus:ring-olive/20 focus:outline-none " +
  "transition-colors duration-200";

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
}: FormFieldProps) {
  const id = `f-${name}`;
  const describedBy = [
    hint ? `${id}-hint` : null,
    error ? `${id}-err` : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-espresso mb-2 text-start">
        {label}
        {required ? <span aria-hidden className="text-jachnun"> *</span> : null}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          required={required}
          defaultValue={defaultValue as string | undefined}
          placeholder={placeholder}
          rows={rows}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={inputClasses}
        />
      ) : type === "select" ? (
        <select
          id={id}
          name={name}
          required={required}
          defaultValue={defaultValue as string | undefined}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={inputClasses}
        >
          {(options ?? []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue}
          placeholder={placeholder}
          min={min}
          max={max}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={inputClasses}
        />
      )}

      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-espresso-soft">{hint}</p>
      ) : null}
      {error ? (
        <p id={`${id}-err`} role="alert" className="mt-1 text-sm text-jachnun">{error}</p>
      ) : null}
    </div>
  );
}
