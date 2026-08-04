/**
 * Credit-card input utilities: brand detection, grouping, Luhn, expiry.
 *
 * These are real, not mocked — when the payment processor is swapped in for
 * `lib/mock-payment.ts` this file stays exactly as it is. Everything here is
 * pure and synchronous so the card form can validate on blur without a
 * round trip.
 *
 * Nothing in this module stores, logs or transmits a card number.
 */

export type CardBrand = "visa" | "mastercard" | "amex" | "diners" | "unknown";

type BrandSpec = {
  test: RegExp;
  /** Digit counts accepted for this brand. */
  lengths: number[];
  /** Grouping used when formatting, e.g. `[4,6,5]` → `3782 822463 10005`. */
  groups: number[];
  cvcLength: number;
  label: string;
};

const BRANDS: Record<Exclude<CardBrand, "unknown">, BrandSpec> = {
  visa: { test: /^4/, lengths: [16], groups: [4, 4, 4, 4], cvcLength: 3, label: "Visa" },
  mastercard: {
    test: /^(5[1-5]|2[2-7])/,
    lengths: [16],
    groups: [4, 4, 4, 4],
    cvcLength: 3,
    label: "Mastercard",
  },
  amex: { test: /^3[47]/, lengths: [15], groups: [4, 6, 5], cvcLength: 4, label: "Amex" },
  diners: { test: /^3(?:0[0-5]|[68])/, lengths: [14], groups: [4, 6, 4], cvcLength: 3, label: "Diners" },
};

const FALLBACK: BrandSpec = {
  test: /.^/,
  lengths: [16],
  groups: [4, 4, 4, 4],
  cvcLength: 3,
  label: "",
};

/** Strip everything that is not a digit. Handles pasted numbers with spaces. */
export function digitsOnly(value: string): string {
  return (value ?? "").replace(/\D+/g, "");
}

export function detectBrand(value: string): CardBrand {
  const d = digitsOnly(value);
  if (!d) return "unknown";
  for (const [brand, spec] of Object.entries(BRANDS)) {
    if (spec.test.test(d)) return brand as CardBrand;
  }
  return "unknown";
}

function specFor(brand: CardBrand): BrandSpec {
  return brand === "unknown" ? FALLBACK : BRANDS[brand];
}

export function brandLabel(brand: CardBrand): string {
  return specFor(brand).label;
}

export function cvcLengthFor(brand: CardBrand): number {
  return specFor(brand).cvcLength;
}

export function maxDigitsFor(brand: CardBrand): number {
  return Math.max(...specFor(brand).lengths);
}

/**
 * Group digits for display. Amex is 4-6-5, not 4-4-4-4 — using one grouping
 * for every brand is the small detail that makes a card field feel wrong.
 */
export function formatCardNumber(value: string): string {
  const brand = detectBrand(value);
  const d = digitsOnly(value).slice(0, maxDigitsFor(brand));
  const groups = specFor(brand).groups;
  const out: string[] = [];
  let i = 0;
  for (const size of groups) {
    if (i >= d.length) break;
    out.push(d.slice(i, i + size));
    i += size;
  }
  if (i < d.length) out.push(d.slice(i));
  return out.join(" ");
}

/** Luhn checksum — catches transposed digits before the network round trip. */
export function luhnValid(value: string): boolean {
  const d = digitsOnly(value);
  if (d.length < 12) return false;
  let sum = 0;
  let double = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = d.charCodeAt(i) - 48;
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
}

export function cardNumberValid(value: string): boolean {
  const brand = detectBrand(value);
  const d = digitsOnly(value);
  return specFor(brand).lengths.includes(d.length) && luhnValid(d);
}

export function last4(value: string): string {
  return digitsOnly(value).slice(-4);
}

/** `"1226"` → `"12/26"`. Called on every keystroke, so it must be idempotent. */
export function formatExpiry(value: string): string {
  const d = digitsOnly(value).slice(0, 4);
  if (d.length === 0) return "";
  // A lone "2".."9" can only be a month if padded — 3 means March, not 30.
  if (d.length === 1) return /[2-9]/.test(d) ? `0${d}/` : d;
  const mm = d.slice(0, 2);
  const yy = d.slice(2);
  return yy ? `${mm}/${yy}` : `${mm}/`;
}

export type ExpiryCheck = { ok: true; month: number; year: number } | { ok: false; reason: "invalid" | "past" };

/** `now` is injectable so the tests do not depend on the calendar. */
export function checkExpiry(value: string, now: Date = new Date()): ExpiryCheck {
  const d = digitsOnly(value);
  if (d.length !== 4) return { ok: false, reason: "invalid" };
  const month = Number(d.slice(0, 2));
  const year = 2000 + Number(d.slice(2));
  if (month < 1 || month > 12) return { ok: false, reason: "invalid" };
  // A card is valid through the last day of its expiry month.
  const expiresAfter = new Date(Date.UTC(year, month, 1));
  if (expiresAfter.getTime() <= now.getTime()) return { ok: false, reason: "past" };
  return { ok: true, month, year };
}

export function cvcValid(value: string, brand: CardBrand): boolean {
  return digitsOnly(value).length === cvcLengthFor(brand);
}
