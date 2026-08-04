/**
 * Menu content for /menu.
 *
 * Filled 2026-08-03 at the café's explicit instruction, overriding the
 * original "structure only, never invent prices" policy this file used to
 * carry. See the Decision Log in CLAUDE.md. Prices are a realistic 2026
 * boutique-café schedule for גני תקווה and must be confirmed against the
 * counter board before the site goes live.
 *
 * Categories are ordered the way they should appear on /menu. Each `id` is
 * a live `#fragment` target and an IntersectionObserver key in
 * `MenuCategoryRail` — do not rename one without updating both.
 *
 * `price` is a display string ("₪32"). The JSON-LD builder in
 * app/(site)/menu/page.tsx strips it to digits for `Offer.price`, so the
 * shekel glyph here never reaches the schema.
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
    blurb: "תערובת בית של ערביקה מקלייה בינונית, נטחנת טרי לכל כוס. חלב שקדים, שיבולת שועל או סויה ללא תוספת תשלום.",
    items: [
      { name: "אספרסו", price: "₪10" },
      { name: "אספרסו כפול", price: "₪12" },
      { name: "מקיאטו", price: "₪11" },
      { name: "קפה הפוך קטן", price: "₪14" },
      { name: "קפה הפוך גדול", price: "₪16" },
      { name: "קפוצ'ינו", price: "₪15" },
      { name: "אמריקנו", price: "₪13" },
      { name: "קורטדו", price: "₪13" },
      { name: "פלאט וייט", price: "₪16" },
      { name: "אייס קפה", description: "אספרסו כפול על קרח, עם או בלי חלב", price: "₪16" },
      { name: "אייס לאטה", price: "₪18" },
      { name: "מאצ'ה לאטה", price: "₪19", badges: ["vegetarian", "new"] },
      { name: "צ'אי לאטה", price: "₪17", badges: ["vegetarian"] },
      { name: "שוקו חם", description: "שוקולד מריר מומס בחלב מוקצף", price: "₪16", badges: ["vegetarian"] },
      { name: "תה צמחים", description: "נענע, לואיזה, קמומיל או תערובת הבית", price: "₪12", badges: ["vegan", "gluten-free"] },
    ],
  },
  {
    id: "breakfast",
    title: { he: "ארוחות בוקר" },
    blurb: "מוגשות מהפתיחה ועד 12:30, ובסופי שבוע עד 13:00. כל ארוחה מגיעה עם לחם הבית וסלט ירקות קצוץ.",
    items: [
      {
        name: "ארוחת בוקר הכרם",
        description: "שתי ביצים כרצונכם, גבינות, סלט ירקות, ממרחים, לחם הבית ושתייה חמה",
        price: "₪62",
        badges: ["vegetarian"],
      },
      {
        name: "בוקר זוגי",
        description: "ארוחת הכרם לשניים, עם מגוון גבינות מורחב ושתי שתייה חמה",
        price: "₪118",
        badges: ["vegetarian"],
      },
      {
        name: "שקשוקה",
        description: "ברוטב עגבניות של הבית, עם פטה ולחם הבית",
        price: "₪56",
        badges: ["vegetarian", "spicy"],
      },
      {
        name: "בוקר טבעוני",
        description: "טופו מוקפץ, אבוקדו, טחינה, ירקות העונה ולחם מחמצת",
        price: "₪58",
        badges: ["vegan"],
      },
      {
        name: "יוגורט וגרנולה",
        description: "יוגורט כבשים, גרנולה של הבית, פירות העונה ודבש",
        price: "₪38",
        badges: ["vegetarian"],
      },
      {
        name: "לחם, ביצים ומטבל",
        description: "ביצת עין, טחינה גולמית, זעתר ושמן זית",
        price: "₪42",
        badges: ["vegetarian"],
      },
    ],
  },
  {
    id: "sandwiches",
    title: { he: "כריכים וטוסטים" },
    blurb: "על לחם מחמצת או לחמנייה של הבית, לאכול כאן או לקחת.",
    items: [
      { name: "טוסט גבינות", description: "מוצרלה, קשקבל ועגבנייה", price: "₪38", badges: ["vegetarian"] },
      { name: "כריך סלמון", description: "סלמון מעושן, גבינת שמנת, בצל סגול וצלפים", price: "₪56" },
      { name: "כריך טונה", description: "טונה, ביצה קשה, מלפפון חמוץ וחסה", price: "₪42" },
      { name: "כריך אבוקדו", description: "אבוקדו, טחינה, עגבנייה וירקות העונה", price: "₪44", badges: ["vegan"] },
      { name: "קרואסון גבינה", description: "קרואסון חמאה עם גבינת שמנת וירקות", price: "₪38", badges: ["vegetarian"] },
      { name: "לחם הבית עם ממרחים", description: "טחינה, מטבוחה וחמאת עשבים", price: "₪34", badges: ["vegetarian"] },
    ],
  },
  {
    id: "salads",
    title: { he: "סלטים" },
    blurb: "ירקות מהשוק, נחתכים בבוקר. אפשר להוסיף ביצה קשה, אבוקדו או פטה.",
    items: [
      {
        name: "סלט הכרם",
        description: "ירקות קצוצים דק, נענע, גרעיני חמנייה ולימון",
        price: "₪52",
        badges: ["vegan", "gluten-free"],
      },
      {
        name: "סלט קיסר",
        description: "חסה רומאית, קרוטונים, פרמזן ורוטב הבית",
        price: "₪54",
        badges: ["vegetarian"],
      },
      {
        name: "סלט עדשים",
        description: "עדשים שחורות, בטטה צלויה, רוקט וויניגרט הדרים",
        price: "₪48",
        badges: ["vegan", "gluten-free"],
      },
      {
        name: "סלט יווני",
        description: "מלפפון, עגבנייה, פלפל, זיתי קלמטה ופטה",
        price: "₪50",
        badges: ["vegetarian", "gluten-free"],
      },
    ],
  },
  {
    id: "pastries",
    title: { he: "מאפים ובורקסים" },
    blurb: "נאפים אצלנו כל בוקר. מי שמגיע מוקדם תופס אותם חמים מהתנור.",
    items: [
      { name: "בורקס גבינה", price: "₪18", badges: ["vegetarian"] },
      { name: "בורקס תפוחי אדמה", price: "₪18", badges: ["vegan"] },
      { name: "קרואסון חמאה", price: "₪14", badges: ["vegetarian"] },
      { name: "קרואסון שוקולד", price: "₪16", badges: ["vegetarian"] },
      { name: "מאפה קינמון", price: "₪16", badges: ["vegetarian"] },
      { name: "רוגלך", description: "יחידה", price: "₪8", badges: ["vegetarian"] },
    ],
  },
  {
    id: "kids",
    title: { he: "תפריט ילדים" },
    blurb: "מנות קטנות לגילאי עשר ומטה, מגיעות עם מיץ או מים.",
    items: [
      { name: "טוסט ילדים", description: "גבינה צהובה בלחם לבן", price: "₪26", badges: ["vegetarian"] },
      { name: "פסטה חמאה או רוטב עגבניות", price: "₪32", badges: ["vegetarian"] },
      { name: "פנקייק ילדים", description: "שתי יחידות עם סילאן או ריבה", price: "₪28", badges: ["vegetarian"] },
    ],
  },
  {
    id: "desserts",
    title: { he: "קינוחים" },
    blurb: "אפויים במטבח שלנו, משתנים לפי מה שיצא באותו יום.",
    items: [
      { name: "עוגת גבינה אפויה", price: "₪28", badges: ["vegetarian"] },
      { name: "בראוני שוקולד", price: "₪26", badges: ["vegetarian"] },
      { name: "עוגת שוקולד חמה", description: "מוגשת עם כדור גלידת וניל", price: "₪28", badges: ["vegetarian"] },
      { name: "מלבי", description: "מי ורדים, פיסטוק וסילאן", price: "₪24", badges: ["vegetarian", "gluten-free"] },
      { name: "פאי תפוחים", price: "₪28", badges: ["vegetarian"] },
    ],
  },
];

/**
 * Signature dishes for the home-page bento.
 *
 * The bento used to re-list the menu *categories*, which the split-flap
 * board directly above it already enumerates in full. Categories are that
 * section's job; this one shows what's actually on the plate. Each entry
 * names a real item from the list above — `resolveHighlights()` below reads
 * its live price out of `menuCategories`, so a price change in one place
 * can't leave the home page quoting an old number.
 */
export const menuHighlights: { categoryId: string; itemName: string }[] = [
  { categoryId: "breakfast", itemName: "ארוחת בוקר הכרם" },
  { categoryId: "breakfast", itemName: "שקשוקה" },
  { categoryId: "coffee", itemName: "פלאט וייט" },
  { categoryId: "sandwiches", itemName: "כריך סלמון" },
  { categoryId: "salads", itemName: "סלט הכרם" },
  { categoryId: "pastries", itemName: "בורקס גבינה" },
];

export type ResolvedHighlight = MenuItem & { categoryId: string; categoryTitle: string };

export function resolveHighlights(): ResolvedHighlight[] {
  return menuHighlights.flatMap(({ categoryId, itemName }) => {
    const category = menuCategories.find((c) => c.id === categoryId);
    const item = category?.items.find((i) => i.name === itemName);
    // A rename in menuCategories drops the highlight rather than rendering
    // a blank tile or a stale price.
    if (!category || !item) return [];
    return [{ ...item, categoryId: category.id, categoryTitle: category.title.he }];
  });
}

/**
 * Short blurb shown at the top of /menu, above the sticky nav.
 * 2–3 sentences. Names "קפה הכרם" once. No prices.
 */
export const menuIntro = {
  eyebrow: "התפריט",
  title: "מה אופים ומגישים בקפה הכרם",
  body:
    "התפריט של קפה הכרם נבנה סביב חומרי גלם טריים, קפה שנטחן במקום ומאפים שנאפים אצלנו כל בוקר. " +
    "המנות מתחלפות עם העונה, לפי מה שמגיע מהשוק ומה שיוצא טוב באותו שבוע.",
};
