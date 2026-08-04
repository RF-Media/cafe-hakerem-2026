/**
 * Money formatting.
 *
 * Every price in the codebase is an integer number of agorot. Floats are
 * banned: `0.1 + 0.2` is the classic way a checkout total ends up one agora
 * off the sum of its own line items, and a customer who can add up four
 * numbers will notice. Shekels exist only at the moment of display.
 *
 * This lives in its own module rather than in `lib/jachnun-pricing.ts` so
 * that `content/jachnun.ts` can derive its display strings from the same
 * formatter the checkout uses without the two files importing each other.
 */

/** `3800` → `"₪38"`, `3850` → `"₪38.50"`. RTL renders ₪ correctly (§12). */
export function formatILS(agorot: number): string {
  const rounded = Math.round(agorot);
  const sign = rounded < 0 ? "−" : "";
  const abs = Math.abs(rounded);
  const shekels = Math.floor(abs / 100);
  const rest = abs % 100;
  const digits = rest === 0 ? String(shekels) : `${shekels}.${String(rest).padStart(2, "0")}`;
  return `${sign}₪${digits}`;
}
