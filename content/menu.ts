/**
 * Menu content for /menu.
 *
 * Structure only. Every price, every item name, and every
 * description is a [TODO]. The café will fill these in.
 *
 * Why we don't pre-fill: a menu with invented prices that get
 * published is actively damaging — it sets customer expectations
 * the café will have to honour or apologise for.
 *
 * Categories are ordered the way they should appear on /menu. The
 * sticky in-page nav uses each category's `id`.
 */

export type MenuItem = {
  name: string;          // Hebrew item name
  description?: string;  // optional one-line description
  price: string;         // formatted as "₪28" — string so "מ-₪28" is allowed
  badges?: ("vegan" | "vegetarian" | "gluten-free" | "spicy" | "new")[];
};

export type MenuCategory = {
  id: string;            // URL-safe Latin slug, used in #fragment links
  title: { he: string }; // Section heading
  blurb?: string;        // 1-line Hebrew intro shown under the heading
  items: MenuItem[];
};

export const menuCategories: MenuCategory[] = [
  {
    id: "coffee",
    title: { he: "קפה ושתייה חמה" },
    blurb: "[TODO: 1 משפט קצר על תערובת הקפה והספק.]",
    items: [
      { name: "[TODO: שם פריט]", price: "[TODO: ₪XX]" },
      { name: "[TODO: שם פריט]", price: "[TODO: ₪XX]" },
      { name: "[TODO: שם פריט]", price: "[TODO: ₪XX]" },
    ],
  },
  {
    id: "breakfast",
    title: { he: "ארוחות בוקר" },
    blurb: "[TODO: שעות הגשת ארוחות בוקר, האם כל היום או רק בוקר.]",
    items: [
      { name: "[TODO: שם ארוחה]", description: "[TODO: תיאור קצר של מה כלול]", price: "[TODO: ₪XX]" },
      { name: "[TODO: שם ארוחה]", description: "[TODO: תיאור קצר של מה כלול]", price: "[TODO: ₪XX]" },
    ],
  },
  {
    id: "sandwiches",
    title: { he: "כריכים וטוסטים" },
    items: [
      { name: "[TODO: שם כריך]", price: "[TODO: ₪XX]" },
      { name: "[TODO: שם כריך]", price: "[TODO: ₪XX]" },
    ],
  },
  {
    id: "salads",
    title: { he: "סלטים" },
    items: [
      { name: "[TODO: שם סלט]", price: "[TODO: ₪XX]" },
      { name: "[TODO: שם סלט]", price: "[TODO: ₪XX]" },
    ],
  },
  {
    id: "pastries",
    title: { he: "מאפים ובורקסים" },
    blurb: "[TODO: ציון שעות אפייה / מאיפה המאפים, אם רלוונטי.]",
    items: [
      { name: "[TODO: שם מאפה]", price: "[TODO: ₪XX]" },
      { name: "[TODO: שם מאפה]", price: "[TODO: ₪XX]" },
    ],
  },
  {
    id: "kids",
    title: { he: "תפריט ילדים" },
    items: [
      { name: "[TODO: שם פריט ילדים]", price: "[TODO: ₪XX]" },
    ],
  },
  {
    id: "desserts",
    title: { he: "קינוחים" },
    items: [
      { name: "[TODO: שם קינוח]", price: "[TODO: ₪XX]" },
    ],
  },
];

/**
 * Short blurb shown at the top of /menu, above the sticky nav.
 * 2–3 sentences. Names "קפה הכרם" once. No prices.
 */
export const menuIntro = {
  eyebrow: "התפריט",
  title: "מה אופים ומגישים בקפה הכרם",
  body:
    "התפריט של קפה הכרם נבנה סביב חומרי גלם טריים, קפה שנטחן במקום ומאפים שנאפים [TODO: יומית / מספר פעמים בשבוע]. " +
    "השף [TODO: שם השף, אם רלוונטי] בוחר את המנות לפי העונה.",
};
