/**
 * Token values that have to exist outside CSS.
 *
 * `viewport.themeColor` is consumed by the browser chrome before any
 * stylesheet is parsed, so it cannot read `var(--cream)`. Deriving it here
 * from the same HSL channels keeps the two in step — the value was
 * previously a bare `#f1ebdf` literal with nothing tying it to the token.
 */

/** Must match `--cream` in app/globals.css. */
export const CREAM_HSL = { h: 36, s: 35, l: 94 } as const;

function hslToHex({ h, s, l }: { h: number; s: number; l: number }): string {
  const sat = s / 100;
  const lum = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(lum, 1 - lum);
  const f = (n: number) => lum - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to255 = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${to255(f(0))}${to255(f(8))}${to255(f(4))}`;
}

export const CREAM_HEX = hslToHex(CREAM_HSL);
