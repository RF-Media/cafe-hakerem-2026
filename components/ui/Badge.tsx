import type { MenuItem } from "@/content/menu";

/**
 * Dietary / novelty markers on menu items. `menu.ts` has carried a `badges`
 * field since the content model was written and nothing has ever rendered
 * it — this is that field finally showing up on the page.
 *
 * Colour is never the only signal: each badge carries its own Hebrew label.
 */

type BadgeKey = NonNullable<MenuItem["badges"]>[number];

const labels: Record<BadgeKey, string> = {
  vegan: "טבעוני",
  vegetarian: "צמחוני",
  "gluten-free": "ללא גלוטן",
  spicy: "חריף",
  new: "חדש",
};

// Badges only ever sit on light grounds (menu rows, cards), so the metal
// one takes `brass-ink`.
const tones: Record<BadgeKey, string> = {
  vegan: "border-olive/40 text-olive",
  vegetarian: "border-olive/40 text-olive",
  "gluten-free": "border-brass-ink/45 text-brass-ink",
  spicy: "border-jachnun/40 text-jachnun",
  new: "border-espresso/25 text-espresso",
};

export function Badge({ kind }: { kind: BadgeKey }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill border px-2 py-0.5 text-[0.6875rem] leading-none ${tones[kind]}`}
    >
      {labels[kind]}
    </span>
  );
}

export function BadgeRow({ badges }: { badges?: MenuItem["badges"] }) {
  if (!badges?.length) return null;
  return (
    <span className="inline-flex flex-wrap gap-1.5 align-middle">
      {badges.map((b) => (
        <Badge key={b} kind={b} />
      ))}
    </span>
  );
}
