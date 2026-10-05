/**
 * Menu content for /menu.
 *
 * Replaced 2026-08-04 with the café's real menu and pricing, supplied
 * directly by the café — supersedes the 2026-08-03 placeholder set (which
 * had invented prices flagged "confirm before launch"). Categories changed
 * shape along with the prices: the old coffee/breakfast/kids sections are
 * gone because the café's list doesn't include them, replaced by the ten
 * real sections below. See the Decision Log in CLAUDE.md.
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
  /** Optional background photo for the "מה חדש" category tile on the home
   *  page (`AlwaysRollingSection`). Categories without one keep the plain
   *  text tile — this fills in per-category as photography arrives. */
  image?: string;
  imageAlt?: string;
};

export const menuCategories: MenuCategory[] = [
  {
    id: "burekas",
    title: { he: "בורקס הכרם" },
    blurb: "בורקס תורכי בעבודת יד, מוכן במטבח שלנו לפי מתכון מסורתי.",
    items: [
      { name: "בורקס תורכי בעבודת יד", description: "4 יחידות בורקס תורכי בעבודת יד", price: "₪46" },
    ],
    image: "/images/menu/burekas.jpg",
    imageAlt: "מגש בורקסים תורכיים טריים מהתנור של קפה הכרם, מוזהבים ומפוזרים במלח גס",
  },
  {
    id: "sandwiches",
    title: { he: "כריכים" },
    blurb: "טוסטים ופוקאצ'ות אפויות אצלנו, לאכול כאן או לקחת.",
    items: [
      { name: "טוסט ספיישל", description: "לחם קסטן, גבינת גאודה, בצל מקורמל וביצה קשה", price: "₪42", badges: ["vegetarian"] },
      { name: "טוסט בהרכבה", description: "טוסט בלחם קסטן לבן בהרכבה אישית", price: "₪39" },
      {
        name: "פוקאצ'ה קפרזה רומאית",
        description: "פוקאצ'ה דאבל קראסט עם שמנת, פסטו, עגבנייה, רוקט, בלסמי מצומצם ומוצרלה פרסקה",
        price: "₪52",
        badges: ["vegetarian"],
      },
      {
        name: "פוקאצ'ה טוניסאית",
        description: "פוקאצ'ה רומאית עם סלט טונה, לימון כבוש, אריסה פיקנטית, ביצה קשה ועלי רוקט",
        price: "₪49",
        badges: ["spicy"],
      },
      {
        name: "פוקאצ'ה כמהין",
        description: "פוקאצ'ה עם שמנת, מנצ'גו כמהין, רוקט וארטישוק אלה רומנה",
        price: "₪49",
        badges: ["vegetarian"],
      },
      {
        name: "פוקאצ'ת סביח",
        description: "טחינה אסלית, חצילים קלויים, בצל מקורמל, פרוסות עגבנייה ועלי רוקט",
        price: "₪49",
        badges: ["vegan"],
      },
      {
        name: "כריך אבוקדו",
        description: "ממרח אבוקדו, ביצה קשה, עגבנייה, צנונית וחסה לליק, בתיבול \"על הבייגל\", בפוקאצ'ה אישית מחיטה מלאה",
        price: "₪39",
        badges: ["vegetarian"],
      },
      {
        name: "כריך גאודה",
        description: "גבינת שמנת, ממרח עגבניות מיובשות, גאודה הולנדית, חסה לליק ופרוסות עגבנייה בלחם כוסמין",
        price: "₪29",
        badges: ["vegetarian"],
      },
      {
        name: "ביס סלט ביצים ובצל מקורמל",
        description: "סלט ביצים עשיר עם בצל מקורמל, עגבנייה וחסה לליק, בלחמניית ביס מחיטה מלאה",
        price: "₪27",
        badges: ["vegetarian"],
      },
      {
        name: "כריך סלמון",
        description: "גבינת שמנת, סלמון מעושן נורווגי, תיבול \"על הבייגל\", חסה לליק וגפרורי סלק, בלחם כוסמין",
        price: "₪34",
      },
      {
        name: "פוקאצ'ה בטטה",
        description: "פוקאצ'ה רומאית עם גבינת שמנת, בטטה מתקתקה אפויה בתנור, בצל ירוק וגבינת פטה",
        price: "₪49",
        badges: ["vegetarian"],
      },
    ],
    image: "/images/menu/sandwiches.jpg",
    imageAlt: "כריך וטוסט טריים מוגשים על צלחת בקפה הכרם",
  },
  {
    id: "salads",
    title: { he: "סלטים" },
    blurb: "ירקות טריים מהשוק, מוגשים בגודל ארוחה.",
    items: [
      {
        name: "סלט יווני",
        description: "מיקס חסות, מלפפון, עגבנייה, פלפל, זיתי קלמטה, בצל סגול וגבינת פטה, בתיבול שמן זית ולימון טרי",
        price: "₪64",
        badges: ["vegetarian", "gluten-free"],
      },
      {
        name: "סלט קפרזה",
        description: "חסה קראנצ'ית, עלי רוקט, שרי בצבעים, קרעי מוצרלה פרסקה, בצל סגול ובלסמי מצומצם, עם נגיעות פסטו בזיליקום, מוגש עם חומץ בלסמי",
        price: "₪69",
        badges: ["vegetarian", "gluten-free"],
      },
    ],
    image: "/images/salads.jpg",
    imageAlt: "סלט ירקות טרי בקערה עם מלפפון, עגבנייה, בצל סגול, זיתי קלמטה ופלח לימון",
  },
  {
    id: "specials",
    title: { he: "מיוחדים" },
    blurb: "מנות שמצטרפות לתפריט מדי פעם, לפי מה שטרי באותו שבוע.",
    items: [
      {
        name: "מוזלי הבית",
        description: "יוגורט 4%, ענבים ואוכמניות וגרנולת ביתית. הפירות במוזלי עשויים להשתנות לפי העונה - ניתן לבקש דבש או סילאן בהערות",
        price: "₪31",
        badges: ["vegetarian"],
      },
    ],
  },
  {
    id: "pastries",
    title: { he: "מאפים" },
    blurb: "נאפים אצלנו כל בוקר. מי שמגיע מוקדם תופס אותם חמים מהתנור.",
    items: [
      { name: "קרואסון שוקולד", price: "₪18", badges: ["vegetarian"] },
      { name: "קרואסון שקדים", price: "₪22", badges: ["vegetarian"] },
      { name: "קרואסון חמאה", price: "₪18", badges: ["vegetarian"] },
      { name: "פאן סוויס", description: "מאפה חמאה מדופדף במילוי קרם פטיסייר ושוקולד צ'יפס", price: "₪23", badges: ["vegetarian"] },
      { name: "סינבון עננים", description: "רול קינמון בציפוי קרם ריבת חלב וניל", price: "₪34", badges: ["vegetarian"] },
      { name: "3 רוגלך", description: "3 יחידות", price: "₪20", badges: ["vegetarian"] },
      {
        name: "מאפה ריקוטה ותותים",
        description: "מאפה במילוי ריקוטה ותותים. הפרי במאפה משתנה לפי העונה (אוכמניות/תותים)",
        price: "₪32",
        badges: ["vegetarian"],
      },
      {
        name: "ספוליאטלה איטלקי",
        description: "4 יחידות. מאפה מדופדף במילוי ריקוטה מאיטליה, בזילוף קרם פיסטוק או נוטלה לבחירה",
        price: "₪44",
        badges: ["vegetarian"],
      },
    ],
  },
  {
    id: "cakes",
    title: { he: "עוגות ועוגיות" },
    blurb: "אפויות במטבח שלנו, משתנות לפי מה שיצא באותו יום.",
    items: [
      { name: "פרוסת עוגת גבינה באסקית", price: "₪44", badges: ["vegetarian"] },
      { name: "פרוסת עוגת גזר", price: "₪24", badges: ["vegetarian"] },
      { name: "פרוסת עוגת תפוזים", price: "₪23", badges: ["vegetarian"] },
      { name: "כדורי שוקולד", description: "3 יחידות", price: "₪17", badges: ["vegetarian"] },
      { name: "קוביות בראוניז \"חלומות\"", description: "4 יחידות", price: "₪24", badges: ["vegetarian"] },
      { name: "פרוסת עוגת גבינה פירות יער אפויה", price: "₪42", badges: ["vegetarian"] },
    ],
  },
  {
    id: "drinks",
    title: { he: "משקאות" },
    blurb: "קפה קר, תה וצ'אי - מוגשים לאורך כל היום.",
    items: [
      { name: "חליטת תה קר", description: "חליטה קרה, נענע ולימון", price: "₪21", badges: ["vegan", "gluten-free"] },
      { name: "מאצ'ה קרה", description: "מאצ'ה של MIX&MATCHA, מוגש בבקבוק", price: "₪27", badges: ["vegetarian"] },
      {
        name: "צ'אי מסאלה",
        description: "משקה על בסיס תערובת תבלינים הודית מתקתקה, מוגש עם מקל קינמון",
        price: "₪23",
        badges: ["vegetarian"],
      },
      { name: "קפה קר", description: "חלב, קוביות קרח ואספרסו. ניתן לבקש חיזוק אספרסו בהערות", price: "₪22", badges: ["vegetarian"] },
      { name: "אמריקנו קר", description: "מים, קוביות קרח ואספרסו כפול", price: "₪20", badges: ["vegan", "gluten-free"] },
    ],
  },
  {
    id: "juices",
    title: { he: "מיצים סחוטים" },
    blurb: "סחוטים טריים כל בוקר, בלי תוספת סוכר.",
    items: [
      { name: "רימונים", price: "₪25", badges: ["vegan", "gluten-free"] },
      { name: "לימונענע", price: "₪25", badges: ["vegan", "gluten-free"] },
      { name: "תפוחים", price: "₪25", badges: ["vegan", "gluten-free"] },
      { name: "תפוזים", price: "₪25", badges: ["vegan", "gluten-free"] },
      { name: "תפוגזר כורכום", description: "תפוזים, גזר וכורכום", price: "₪25", badges: ["vegan", "gluten-free"] },
    ],
  },
  {
    id: "soft-drinks",
    title: { he: "שתייה קלה" },
    blurb: "בקבוקים קרים, לשולחן או לקחת.",
    items: [
      { name: "קולה", description: "בקבוק זכוכית, 250 מ״ל", price: "₪15" },
      { name: "קולה זירו", description: "בקבוק זכוכית, 250 מ״ל", price: "₪15" },
      { name: "פיוזטי", description: "בקבוק זכוכית, 330 מ״ל", price: "₪15" },
      { name: "מים מינרליים", description: "בקבוק פלסטיק, 500 מ״ל", price: "₪12" },
      { name: "קינלי סודה", description: "בקבוק זכוכית, 250 מ״ל", price: "₪12" },
      { name: "מיץ ענבים", price: "₪14" },
    ],
  },
  {
    id: "coffee-products",
    title: { he: "מוצרי קפה" },
    blurb:
      "מותג קפה איטלקי פרימיום שנוסד ב-1892 בעיר טריאסטה. הקפה נקלה באיטיות במסורת עתיקה, לשמירה על ארומה עשירה וטעם מאוזן. מיובא מאיטליה ומשולב מזני ערביקה ורובוסטה מובחרים.",
    items: [
      { name: "אבקת מאצ'ה MIX&MATCHA", description: "30 גרם", price: "₪139" },
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
 *
 * Picked from the café's own "המוזמנים ביותר" (most-ordered) list, one per
 * category for spread across the bento.
 */
export const menuHighlights: { categoryId: string; itemName: string }[] = [
  { categoryId: "burekas", itemName: "בורקס תורכי בעבודת יד" },
  { categoryId: "sandwiches", itemName: "פוקאצ'ה קפרזה רומאית" },
  { categoryId: "salads", itemName: "סלט קפרזה" },
  { categoryId: "pastries", itemName: "סינבון עננים" },
  { categoryId: "cakes", itemName: "פרוסת עוגת גזר" },
  { categoryId: "drinks", itemName: "קפה קר" },
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
