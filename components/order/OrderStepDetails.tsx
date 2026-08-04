"use client";

/**
 * Step 4 — who to hand the bag to.
 *
 * Four fields, two of them optional, and nothing asked for that the café does
 * not need at 8am on a Saturday. Errors surface on blur rather than on every
 * keystroke: flagging "invalid phone" while someone is still typing the third
 * digit is the fastest way to make a form feel like it is arguing.
 */

import { FormField, inputClasses } from "@/components/ui/FormField";
import { orderCopy } from "@/content/jachnun-order";
import { ISRAELI_MOBILE_PREFIXES } from "@/lib/phone";
import type { DetailsErrors, DetailsField, OrderDraft } from "@/components/order/state";

type Props = {
  draft: OrderDraft;
  errors: DetailsErrors;
  onChange: (key: DetailsField, value: string) => void;
  onBlur: (key: DetailsField) => void;
};

/** Splits a composed "05XXXXXXXX" phone back into the two fields the UI
 * shows. Falls back to the first prefix when the draft is empty or came
 * from before the split existed — the subscriber field just stays empty. */
function splitPhone(phone: string): { prefix: string; subscriber: string } {
  const digits = phone.replace(/\D/g, "");
  for (const prefix of ISRAELI_MOBILE_PREFIXES) {
    if (digits.startsWith(prefix)) {
      return { prefix, subscriber: digits.slice(prefix.length, prefix.length + 7) };
    }
  }
  return { prefix: ISRAELI_MOBILE_PREFIXES[0], subscriber: "" };
}

export function OrderStepDetails({ draft, errors, onChange, onBlur }: Props) {
  const copy = orderCopy.steps.details;
  const { prefix, subscriber } = splitPhone(draft.phone);

  /* Recomposed into the one `phone` string the draft, reducer and
     lib/phone.ts validation already understand — no schema or state changes
     needed for the split UI. Empty subscriber composes to "" so an
     untouched field still reads as "missing", not a half-formed number. */
  function setPhone(nextPrefix: string, nextSubscriber: string) {
    const digits = nextSubscriber.replace(/\D/g, "").slice(0, 7);
    onChange("phone", digits ? `${nextPrefix}${digits}` : "");
  }

  return (
    <div className="space-y-5">
      <FormField
        label={copy.name.label}
        name="name"
        type="text"
        required
        autoComplete="name"
        placeholder={copy.name.placeholder}
        maxLength={80}
        value={draft.name}
        onChange={(v) => onChange("name", v)}
        onBlur={() => onBlur("name")}
        error={errors.name}
      />

      <div className="w-full">
        <span id="phone-legend" className="block text-sm font-medium text-espresso mb-2 text-start">
          {copy.phone.label}
          <span aria-hidden className="text-jachnun"> *</span>
        </span>
        <div className="flex gap-3" role="group" aria-labelledby="phone-legend">
          <select
            id="f-phone-prefix"
            aria-label="קידומת"
            value={prefix}
            onChange={(e) => setPhone(e.target.value, subscriber)}
            onBlur={() => onBlur("phone")}
            className={`${inputClasses.replace("w-full", "w-24")} shrink-0`}
          >
            {ISRAELI_MOBILE_PREFIXES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <input
            id="f-phone-number"
            name="phone"
            type="tel"
            inputMode="numeric"
            required
            autoComplete="tel-national"
            placeholder="1234567"
            maxLength={7}
            value={subscriber}
            onChange={(e) => setPhone(prefix, e.target.value)}
            onBlur={() => onBlur("phone")}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "f-phone-err" : "f-phone-hint"}
            className={`${inputClasses.replace("w-full", "flex-1")}`}
          />
        </div>
        <div className="mt-1 min-h-[1.25rem] text-sm">
          {errors.phone ? (
            <p id="f-phone-err" role="alert" className="text-jachnun">{errors.phone}</p>
          ) : copy.phone.hint ? (
            <p id="f-phone-hint" className="text-espresso-soft">{copy.phone.hint}</p>
          ) : null}
        </div>
      </div>

      <FormField
        label={copy.email.label}
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder={copy.email.placeholder}
        hint={copy.email.hint}
        maxLength={120}
        value={draft.email}
        onChange={(v) => onChange("email", v)}
        onBlur={() => onBlur("email")}
        error={errors.email}
      />

      <FormField
        label={copy.notes.label}
        name="notes"
        type="textarea"
        rows={3}
        hint={copy.notes.hint}
        maxLength={500}
        value={draft.notes}
        onChange={(v) => onChange("notes", v)}
        onBlur={() => onBlur("notes")}
        error={errors.notes}
      />
    </div>
  );
}
