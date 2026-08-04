"use client";

/**
 * Card fields.
 *
 * Deliberately conventional — a card form is the worst possible place to be
 * inventive. Number/holder/expiry/CVV in that order, real `autocomplete`
 * tokens so the browser's saved card fills all four in one tap, numeric
 * keypads on mobile, brand-aware grouping and CVV length, Luhn on blur.
 *
 * State is local and lives for one payment attempt: card details are never
 * lifted into the draft and never touch `sessionStorage`.
 */

import { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import {
  brandLabel,
  cardNumberValid,
  checkExpiry,
  cvcLengthFor,
  cvcValid,
  detectBrand,
  digitsOnly,
  formatCardNumber,
  formatExpiry,
  maxDigitsFor,
} from "@/lib/card";
import { orderCopy } from "@/content/jachnun-order";

export type CardValues = { number: string; holder: string; expiry: string; cvc: string };
export type CardErrors = Partial<Record<keyof CardValues, string>>;

export const EMPTY_CARD: CardValues = { number: "", holder: "", expiry: "", cvc: "" };

/** Shared by the form and the flow, so the pay button and the fields agree. */
export function validateCard(values: CardValues): CardErrors {
  const e = orderCopy.fieldErrors;
  const errors: CardErrors = {};
  const brand = detectBrand(values.number);

  if (!digitsOnly(values.number)) errors.number = e.cardNumberRequired;
  else if (!cardNumberValid(values.number)) errors.number = e.cardNumberInvalid;

  if (!values.holder.trim()) errors.holder = e.cardHolderRequired;

  if (!digitsOnly(values.expiry)) errors.expiry = e.expiryRequired;
  else {
    const check = checkExpiry(values.expiry);
    if (!check.ok) errors.expiry = check.reason === "past" ? e.expiryPast : e.expiryInvalid;
  }

  if (!digitsOnly(values.cvc)) errors.cvc = e.cvcRequired;
  else if (!cvcValid(values.cvc, brand)) errors.cvc = e.cvcInvalid;

  return errors;
}

type Props = {
  values: CardValues;
  onChange: (values: CardValues) => void;
  /** Errors raised by the flow (e.g. after a failed submit attempt). */
  errors: CardErrors;
  onErrorsChange: (errors: CardErrors) => void;
  disabled?: boolean;
};

export function CardForm({ values, onChange, errors, onErrorsChange, disabled }: Props) {
  const copy = orderCopy.card;
  const [touched, setTouched] = useState<Partial<Record<keyof CardValues, boolean>>>({});
  const brand = detectBrand(values.number);

  function set<K extends keyof CardValues>(key: K, value: string) {
    onChange({ ...values, [key]: value });
    // Clear an error the moment the field is being corrected — leaving it up
    // while someone retypes reads as "still wrong".
    if (errors[key]) onErrorsChange({ ...errors, [key]: undefined });
  }

  function blur(key: keyof CardValues) {
    setTouched((t) => ({ ...t, [key]: true }));
    const next = validateCard(values);
    onErrorsChange({ ...errors, [key]: next[key] });
  }

  const shown = (key: keyof CardValues) => (touched[key] || errors[key] ? errors[key] : undefined);

  return (
    <div className="space-y-5">
      <div className="relative">
        <FormField
          label={copy.number.label}
          name="cardNumber"
          type="text"
          required
          disabled={disabled}
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder={copy.number.placeholder}
          maxLength={maxDigitsFor(brand) + 4}
          value={values.number}
          onChange={(v) => set("number", formatCardNumber(v))}
          onBlur={() => blur("number")}
          error={shown("number")}
        />
        {brandLabel(brand) ? (
          <span
            aria-hidden
            className="pointer-events-none absolute top-[3.25rem] end-4 -translate-y-1/2
                       type-index text-[0.625rem] text-brass-ink"
          >
            {brandLabel(brand)}
          </span>
        ) : null}
      </div>

      <FormField
        label={copy.holder.label}
        name="cardHolder"
        type="text"
        required
        disabled={disabled}
        autoComplete="cc-name"
        placeholder={copy.holder.placeholder}
        maxLength={80}
        value={values.holder}
        onChange={(v) => set("holder", v)}
        onBlur={() => blur("holder")}
        error={shown("holder")}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={copy.expiry.label}
          name="cardExpiry"
          type="text"
          required
          disabled={disabled}
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder={copy.expiry.placeholder}
          maxLength={5}
          value={values.expiry}
          onChange={(v) => set("expiry", formatExpiry(v))}
          onBlur={() => blur("expiry")}
          error={shown("expiry")}
        />
        <FormField
          label={copy.cvc.label}
          name="cardCvc"
          type="text"
          required
          disabled={disabled}
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder={copy.cvc.placeholder}
          maxLength={cvcLengthFor(brand)}
          value={values.cvc}
          onChange={(v) => set("cvc", digitsOnly(v).slice(0, cvcLengthFor(brand)))}
          onBlur={() => blur("cvc")}
          error={shown("cvc")}
        />
      </div>
    </div>
  );
}
