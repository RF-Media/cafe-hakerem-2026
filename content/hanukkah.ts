/**
 * /hanukkah — the sufganiyot collection, the bundles and the pre-order.
 *
 * Prices are whole shekels. Sources: the collection price sheet (flavours and
 * single prices) and the café's brief (bundles, afternoon deal). The server
 * prices every order from `hanukkahBundles`, never from what the browser sends.
 *
 * CONFIRM BEFORE LAUNCH:
 *  - what separates a regular bundle from a premium one (flavours? box?). The
 *    brief gives the two price ladders only, so the copy names the tiers and
 *    claims nothing about what is inside. A premium 6-pack (₪99) costs more than
 *    six singles (₪84-₪90), which suggests the box or the selection differs.
 *  - that a rep phoning to confirm and take payment is the process here, as it
 *    is for the jachnun pre-order.
 */
import { business } from "@/content/business";

export const BUNDLE_SIZES = [6, 12, 20] as const;
export type BundleSize = (typeof BUNDLE_SIZES)[number];

export const BUNDLE_TIERS = ["regular", "premium"] as const;
export type BundleTier = (typeof BUNDLE_TIERS)[number];

export const hanukkahBundles: Record<BundleTier, { label: string; prices: Record<BundleSize, number> }> = {
  regular: { label: "מארז רגיל", prices: { 6: 50, 12: 99, 20: 165 } },
  premium: { label: "מארז פרימיום", prices: { 6: 99, 12: 199, 20: 330 } },
};

export const bundlePrice = (tier: BundleTier, size: BundleSize) => hanukkahBundles[tier].prices[size];

export type Flavor = {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
};

const img = (slug: string) => `/images/sufganiyah-${slug}_hanukkah.jpg`;

/** Price-sheet order: the two classics, then ₪15, then ₪14. */
export const flavors: Flavor[] = [
  { id: "dulce-de-leche", name: "ריבת חלב", price: 7, image: img("dulce-de-leche"), alt: "סופגניית ריבת חלב עם אבקת סוכר ופקעת ריבת חלב בגוון קרמל בראש, על צלחת זכוכית" },
  { id: "strawberry-jam", name: "ריבת תות", price: 7, image: img("strawberry-jam"), alt: "סופגנייה קלאסית עם אבקת סוכר וטיפת ריבת תות אדומה בראש" },
  { id: "blueberry-cream", name: "אוכמניות שמנת", price: 15, image: img("blueberry-cream"), alt: "סופגניית אוכמניות ושמנת עם קרם סגלגל, אוכמנית טרייה ופיסות שוקולד לבן" },
  { id: "lemon-lime-mascarpone", name: "לימון ליים מסקרפונה", price: 15, image: img("lemon-lime-mascarpone"), alt: "סופגניית לימון ליים עם מערבולת קרם מסקרפונה ופירורי מרנג לבן" },
  { id: "espresso-chocolate", name: "שוקולד אספרסו", price: 15, image: img("espresso-chocolate"), alt: "סופגניית שוקולד אספרסו עם פירורי שוקולד, קרם ושבב שוקולד בראש" },
  { id: "chai-masala", name: "צ'אי מסאלה", price: 15, image: img("chai-masala"), alt: "סופגניית צ'אי מסאלה עם קרם לבן, כוכב אניס ופרוסת וופל קריספית" },
  { id: "pecan-caramel", name: "פקאן קרמל", price: 15, image: img("pecan-caramel"), alt: "סופגניית פקאן קרמל עם ציפוי שוקולד, קרם ופקאן מקורמל בראש" },
  { id: "marshmallow-popping-candy", name: "מרשמלו וסוכריות קופצות", price: 15, image: img("marshmallow-popping-candy"), alt: "סופגנייה עם ציפוי שוקולד, סוכריות קופצות בורדו וקובייה של מרשמלו שרוף" },
  { id: "pretzel", name: "בייגלה", price: 14, image: img("pretzel"), alt: "סופגניית בייגלה עם ציפוי שוקולד, אגוזים, קרם ובייגלה קטן בראש" },
  { id: "cookie-cream", name: "קרם עוגיות", price: 14, image: img("cookie-cream"), alt: "סופגנייה עם קרם לבן, פירורי עוגיית שוקולד ופקעת קרם בראש" },
  { id: "millefeuille", name: "מילפיי", price: 14, image: img("millefeuille"), alt: "סופגניית מילפיי עם פירורי בצק עלים זהוב ואבקת סוכר" },
  { id: "crunch", name: "קליק", price: 14, image: img("crunch"), alt: "סופגנייה מצופה בכדורי שוקולד קריספיים בחום ולבן" },
  { id: "raspberry", name: "פטל", price: 14, image: img("raspberry"), alt: "סופגניית פטל עם ציפוי שוקולד לבן, פירורי פטל מיובש וקרם בראש" },
  { id: "saint-honore", name: "סנט אנורה", price: 14, image: img("saint-honore"), alt: "סופגניית סנט אנורה עם ציפוי קרמל מבריק בגוון כתום" },
  { id: "peanut-butter", name: "חמאת בוטנים", price: 14, image: img("peanut-butter"), alt: "סופגניית חמאת בוטנים עם קרם לבן ופירורי בוטנים מקורמלים" },
];

/** Distinct single prices, cheapest first, each with its flavours: the price list. */
export const priceGroups = [...new Set(flavors.map((f) => f.price))]
  .sort((a, b) => a - b)
  .map((price) => ({ price, flavors: flavors.filter((f) => f.price === price) }));

export const afternoonDeal = {
  days: "ימים א׳-ה׳",
  from: "14:00",
  to: "18:00",
  offer: "ברכישת 2 סופגניות ומעלה, הפוך קטן ב-₪10",
};

/**
 * The bundle builder (`<HanukkahBundleBuilder>` + /api/hanukkah-preorder) is
 * hidden while the café reviews it. False removes the #order section and the
 * builder from the schema; bundles are then ordered by phone from the price
 * list. True brings the builder back as it was. See CLAUDE.md 2026-11-24.
 */
export const hanukkahBuilderEnabled = false;

type Photo = { src: string; alt: string };
const atm = (slug: string) => `/images/${slug}_hanukkah.jpg`;

/**
 * The hero donuts: the enhanced cut-outs from the café's print rollup, in the
 * rollup's 3-3-3-1 arrangement. Each was cropped from the print file and baked
 * onto --cream, so it sits on the hero's ground without a visible edge.
 * They are retouched images, hence the "להמחשה בלבד" note under them, as on the print.
 */
const heroIds = ["pretzel", "espresso-chocolate", "blueberry-cream", "marshmallow-popping-candy", "cookie-cream", "pecan-caramel", "strawberry-jam", "saint-honore", "raspberry", "crunch"];
export const heroDonuts = heroIds.map((id) => {
  const f = flavors.find((x) => x.id === id)!;
  return { id, src: `/images/sufganiyah-${id}-cutout_hanukkah.jpg`, alt: `סופגניית ${f.name}` };
});

/** Atmosphere photos for the gallery under the coffee strip. */
export const atmosphere: Photo[] = [
  { src: atm("sufganiyot-tea-table"), alt: "סופגניית בייגלה בציפוי שוקולד עם קרם ובייגלה קטן בראש, על מגש לבן ליד קנקן תה" },
  { src: atm("sufganiyot-garnish"), alt: "יד בכפפה שחורה מפזרת קישוט על מגש סופגניות טריות, לפני שהן יוצאות לוויטרינה" },
  { src: atm("marshmallow-sufganiyah-stand"), alt: "סופגניית מרשמלו שרוף ופירורי פטל על מעמד עוגה ורוד" },
  { src: atm("jam-sufganiyot-pyramid"), alt: "פירמידה של סופגניות ריבה באבקת סוכר על מעמד לבן, וקנקן זכוכית של תה נענע לידה" },
  { src: atm("sufganiyot-cake-stand"), alt: "חמש סופגניות מהקולקציה על מעמד עוגה ליד חלון, עם כוסות תה קטנות" },
  { src: atm("millefeuille-sufganiyah"), alt: "סופגניית מילפיי מכוסה פירורי בצק עלים זהוב, ומאחוריה קנקן תה וסופגניות נוספות" },
  { src: atm("sufganiyot-brass-tray"), alt: "סופגניות אוכמניות, מרשמלו וקרם עוגיות על מגש נחושת, ומעליהן סופגניית בייגלה" },
  { src: atm("sufganiyot-window-plate"), alt: "צלחת סופגניות פטל וצ'אי מסאלה ליד חלון באור אחר הצהריים" },
  { src: atm("sufganiyot-spread"), alt: "שולחן חנוכה מלמעלה: מעמדי זכוכית, סופגניות קליק, בייגלה ומרשמלו ומגש סופגניות ריבה" },
  { src: atm("raspberry-sufganiyah-closeup"), alt: "סופגניית פטל בציפוי שוקולד לבן ופירורי פטל מיובש, על צלחת לבנה גלית" },
  { src: atm("pecan-sufganiyah"), alt: "סופגניית פקאן קרמל בציפוי שוקולד ופקאן מקורמל בראש, על מעמד עוגה" },
  { src: atm("sufganiyot-table"), alt: "מעמד עוגה עמוס סופגניות מהקולקציה, וברקע קנקן זכוכית וסופגניות ריבה" },
];

/** Shown on the page and sent as dateModified: prices and the deal are time-sensitive. */
export const updated = { iso: "2026-11-24", he: "24 בנובמבר 2026" };

export const hanukkah = {
  hero: {
    kicker: "קולקציית",
    title: "הסופגניות",
    subtitle: `חנוכה ב${business.name.he}, ${business.address.city.he}`,
    illustrative: "* התמונות להמחשה בלבד",
    lede: `${business.name.he} מגיש בחנוכה קולקציה של ${flavors.length} טעמי סופגניות, מריבת חלב ב-₪${priceGroups[0].price} ועד סנט אנורה ומילפיי. באים לרחוב הכרמל 20, בוחרים מהוויטרינה, ואחר הצהריים מוסיפים הפוך קטן ב-₪10.`,
    cta: "לכל 15 הטעמים",
    ctaOrder: "לבניית המארז",
    ctaPhone: "מארזים בטלפון",
  },
  /**
   * The club pill, as on the print rollup. CONFIRM BEFORE LAUNCH: the 10% comes
   * from the rollup design, not from content/club.ts or the café's CoffeeStream
   * settings. Confirm what it applies to before it goes live.
   */
  clubPill: {
    value: "10%",
    title: "הנחה לחברי מועדון הקפה",
    body: "לחברי המועדון",
    cta: "להצטרפות בחינם",
  },
  stories: {
    eyebrow: "הקולקציה",
    title: `${flavors.length} טעמים, אחד אחרי השני`,
    handle: "cafehakerem",
    badge: "חנוכה",
    each: "ליחידה",
    prev: "לסופגנייה הקודמת",
    next: "לסופגנייה הבאה",
    pause: "עצירת ההחלפה האוטומטית",
    play: "הפעלת ההחלפה האוטומטית",
    position: (i: number, n: number) => `${i} מתוך ${n}`,
  },
  gallery: {
    eyebrow: "מהשולחן",
    title: "חנוכה בקפה הכרם",
    description: "הצילומים של הקולקציה, על השולחנות והמעמדים של הקפה.",
  },
  prices: {
    eyebrow: "מחירון",
    title: "כמה זה עולה",
    singles: "סופגניות בודדות",
    bundles: "מארזים להזמנה מראש",
    bundlesNote: `מזמינים מארז בטלפון ${business.phone.display}, ואוספים מהקפה ברחוב הכרמל 20.`,
    tierNote: "מארז רגיל או פרימיום, של 6, 12 או 20 סופגניות.",
  },
  builder: {
    eyebrow: "הזמנה מראש",
    title: "ממלאים מארז סופגניות",
    description: "גוררים את הסליידר ורואים את המארז מתמלא. השם והטלפון הם כל מה שצריך להשאיר.",
    tierLabel: "סוג המארז",
    sizeLabel: "כמה סופגניות במארז",
    sizeHint: "גררו או השתמשו בחצים",
    boxCaption: "להמחשה: הטעמים במארז משתנים",
    fields: {
      name: "שם מלא",
      phone: "טלפון נייד",
      phoneHint: "לדוגמה 053-557-4194",
      notes: "טעמים מועדפים או בקשות",
      notesHint: "לא חובה",
    },
    submit: "שלחו הזמנה",
    submitting: "שולחים…",
    payNote: `נציג של ${business.name.he} יחזור אליכם בטלפון לאישור ההזמנה, תיאום האיסוף ותשלום. בשליחת הטופס לא מחויב כרטיס אשראי.`,
    successTitle: "ההזמנה התקבלה",
    successBody: "תודה! נציג יחזור אליכם בטלפון לאישור ההזמנה, תיאום האיסוף ותשלום. מספר ההזמנה הוא לא אישור סופי עד השיחה.",
    successRef: "מספר הזמנה",
    again: "להזמנה נוספת",
    errors: {
      generic: "משהו השתבש בשליחה.",
      network: "אין חיבור. נסו שוב בעוד רגע.",
      turnstile: "אימות האבטחה עוד לא הסתיים. נסו שוב בעוד רגע.",
      callPrefix: "אפשר גם להתקשר:",
    },
  },
  deal: {
    price: "₪10",
    priceNote: "להפוך קטן",
    title: "2 סופגניות, והפוך קטן ב-₪10",
    body: "בכל קנייה של 2 סופגניות ומעלה. לשבת בחצר או לקחת איתכם.",
    image: "/images/latte-cinnamon_shared.jpg",
    donuts: ["/images/sufganiyah-strawberry-jam-cutout_hanukkah.jpg", "/images/sufganiyah-pretzel-cutout_hanukkah.jpg"],
  },
  links: {
    eyebrow: "עוד מקפה הכרם",
    title: "בזמן שאתם כאן",
    items: [
      { href: "/menu", label: "התפריט המלא", note: "בורקס, כריכים, מאפים וקפה", image: "/images/burekas-golden_shared.jpg" },
      { href: "/offers", label: "מבצעים", note: "Happy Hour והטבות לחברי המועדון", image: "/images/latte-cinnamon_shared.jpg" },
      { href: "/coffee-club", label: "מועדון הלקוחות", note: "כרטיסיית ניקובים דיגיטלית בחינם", image: "/images/cup-pastry_coffee-club.jpg" },
      { href: "/catering", label: "מגשי אירוח", note: "לישיבות, אירוח בבית וימי הולדת", image: "/images/burekas-dish_catering.jpg" },
      { href: "/map", label: "מפה והגעה", note: "רחוב הכרמל 20, חניה ושעות", image: "/images/courtyard-tall_shared.jpg" },
    ],
  },
  factual: `בחנוכה קפה הכרם מגיש ${flavors.length} טעמי סופגניות במחיר של ₪7 עד ₪15 ליחידה, ומארזים רגילים ומארזי פרימיום של 6, 12 ו-20 סופגניות להזמנה מראש. בימים א׳-ה׳ בין 14:00 ל-18:00, ברכישת 2 סופגניות ומעלה, הפוך קטן ב-₪10.`,
};
