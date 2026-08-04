/**
 * Israeli mobile-number normalisation, in its own module so the checkout can
 * validate on blur without pulling Zod into the client bundle. `lib/validation.ts`
 * builds `phoneSchema` on top of these, so the browser and the API apply
 * exactly one rule.
 *
 * Accepts `05X-XXXXXXX`, `05XXXXXXXX` and `+9725XXXXXXXX`; spaces, dashes and
 * the parentheses people paste out of contact apps are stripped first.
 */

const ISRAELI_MOBILE = /^(?:\+9725\d{8}|05\d{8})$/;

/**
 * Issued Israeli mobile prefixes. The checkout's prefix dropdown is built
 * from this list, so the UI and `isValidIsraeliMobile` below can never
 * disagree about what counts as a valid prefix.
 */
export const ISRAELI_MOBILE_PREFIXES = [
  "050",
  "051",
  "052",
  "053",
  "054",
  "055",
  "058",
] as const;

export function normalizePhone(value: string): string {
  return (value ?? "").trim().replace(/[\s\-()]/g, "");
}

export function isValidIsraeliMobile(value: string): boolean {
  return ISRAELI_MOBILE.test(normalizePhone(value));
}
