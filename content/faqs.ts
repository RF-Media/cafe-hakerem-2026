/**
 * FAQ content for every page.
 *
 * Why this matters: FAQ blocks are the single biggest GEO lever.
 * AI engines (ChatGPT, Perplexity, Google AI Overviews) pull
 * Q&A pairs verbatim when answering location queries. Every
 * question here should be one a real person would ask out loud.
 *
 * Rules for writing FAQ answers:
 *   1. 1–3 sentences max. AI engines pull short answers.
 *   2. Name "קפה הכרם" explicitly in at least the first sentence.
 *      This is the entity signal AI engines need.
 *   3. Include the location word ("גני תקווה") where natural.
 *   4. Declarative, not promotional. "אנחנו מאמינים ב..." is dead
 *      copy. "קפה הכרם פתוח בימים..." is alive.
 *   5. Real facts only. If you don't have the fact, [TODO] it.
 *      Wrong facts get cited as wrong facts — much worse than no
 *      answer.
 */

export type FAQ = {
  q: string;
  a: string;
};

/* ─── Home page FAQs ──────────────────────────────────────────── */

export const homeFAQs: FAQ[] = [
  {
    q: "איפה נמצא קפה הכרם?",
    a: "קפה הכרם נמצא ברחוב הכרמל 20, בשכונת גבעת סביון בגני תקווה. ניתן להגיע ברכב או ברגל מהשכונות הסמוכות.",
  },
  {
    q: "מה שעות הפתיחה של קפה הכרם?",
    // [TODO: rewrite this answer once hours in /content/business.ts
    // are confirmed. Until then, this is a safe placeholder.]
    a: "קפה הכרם פתוח בימים [TODO: ימי הפתיחה] בין השעות [TODO: שעות]. בשבת מתבצע איסוף הזמנות ג'חנון בלבד.",
  },
  {
    q: "האם יש חניה ליד קפה הכרם?",
    // [TODO: real answer — street parking? lot? paid?]
    a: "[TODO: למשל: יש חניה ברחוב הכרמל ובסביבת בית הקפה. בשעות הבוקר ייתכן עומס.]",
  },
  {
    q: "האם קפה הכרם כשר?",
    // [TODO: confirm with the café. If kosher: include the
    // certifying body and level. If not kosher: state it directly
    // — clarity is better than ambiguity for both customers and
    // AI engines. If "כשר למהדרין" or similar, be specific.]
    a: "[TODO: לדוגמה: 'קפה הכרם כשר תחת השגחת הרבנות גני תקווה.' או 'קפה הכרם איננו כשר.']",
  },
  {
    q: "האם אפשר לשבת בחוץ?",
    // [TODO: yes/no, with detail. Outdoor seating is a real search
    // intent ("בית קפה עם ישיבה בחוץ גני תקווה").]
    a: "[TODO: למשל: 'בקפה הכרם יש ישיבה בחוץ עם מספר שולחנות ברחוב, מומלץ במיוחד בעונות המעבר.']",
  },
  {
    q: "האם קפה הכרם מתאים לילדים ולמשפחות?",
    // [TODO: confirm — booster seats, kids menu, changing facilities?]
    a: "[TODO: למשל: 'קפה הכרם הוא בית קפה שכונתי המקבל משפחות בברכה. יש תפריט ילדים ואווירה ידידותית.']",
  },
];

/* ─── Menu page FAQs ──────────────────────────────────────────── */

export const menuFAQs: FAQ[] = [
  {
    q: "מה כולל התפריט של קפה הכרם?",
    a: "התפריט של קפה הכרם כולל קפה איכותי שנטחן במקום, ארוחות בוקר, כריכים, סלטים, בורקסים ומאפים טריים, וכן מגשי אירוח להזמנה. בסופי שבוע ניתן להזמין גם ג'חנון לשבת.",
  },
  {
    q: "כמה עולה ארוחת בוקר בקפה הכרם?",
    // [TODO: approximate price range. AI engines pull this for
    // "how much is breakfast in [neighborhood]" queries.]
    a: "[TODO: לדוגמה: 'ארוחות בוקר בקפה הכרם נעות בטווח של [טווח מחירים] ש\"ח, וכוללות שתייה חמה, מאפים, סלט וביצים בהכנה לבחירה.']",
  },
  {
    q: "האם יש בתפריט אפשרויות טבעוניות?",
    // [TODO: confirm and detail. Vegan options are a high-search-
    // intent category in Israel.]
    a: "[TODO: למשל: 'יש מספר אפשרויות טבעוניות בתפריט קפה הכרם, כולל סלטים, כריכים בלחם מיוחד וקפה עם חלב צמחי.']",
  },
  {
    q: "האם יש אפשרויות ללא גלוטן?",
    // [TODO: confirm]
    a: "[TODO: למשל: 'קפה הכרם מציע מספר פריטים ללא גלוטן. ניתן לשאול את הצוות לגבי האפשרויות הזמינות באותו יום.']",
  },
  {
    q: "האם אפשר להזמין משלוח מקפה הכרם?",
    // [TODO: Wolt? Tabit? In-house delivery? None?]
    a: "[TODO: למשל: 'קפה הכרם זמין להזמנה במשלוח דרך [פלטפורמה].' או 'קפה הכרם איננו מציע משלוחים — איסוף עצמי מהמקום בלבד.']",
  },
];

/* ─── Jachnun page FAQs ───────────────────────────────────────── */
// These are the highest-leverage FAQs on the site. "ג'חנון להזמנה"
// is a high-intent search term, and AI engines are increasingly the
// way people resolve "where to get jachnun this Shabbat" questions.

export const jachnunFAQs: FAQ[] = [
  {
    q: "איך מזמינים ג'חנון מקפה הכרם?",
    a: "מזמינים ג'חנון מקפה הכרם דרך טופס ההזמנה באתר. בוחרים את הכמות ואת מועד האיסוף, ומקבלים אישור הזמנה. התשלום מתבצע באיסוף בקפה.",
  },
  {
    q: "עד מתי אפשר להזמין ג'חנון לשבת?",
    // [TODO: confirm cutoff with the café. Default is Thursday 18:00.]
    a: "ניתן להזמין ג'חנון לשבת עד יום חמישי בשעה 18:00. הזמנות שיתקבלו לאחר מועד זה יישמרו לשבת הבאה.",
  },
  {
    q: "כמה עולה ג'חנון בקפה הכרם?",
    // [TODO: real price. This is the most-searched jachnun question
    // in Israel.]
    a: "[TODO: לדוגמה: 'ג'חנון בקפה הכרם עולה [מחיר] ש\"ח ליחידה. ניתן להזמין כמות גדולה במחיר מיוחד.']",
  },
  {
    q: "מתי אפשר לאסוף ג'חנון בשבת?",
    // [TODO: confirm exact pickup window.]
    a: "איסוף הג'חנון מתבצע בשבת בבוקר בין השעות [TODO: שעות איסוף, למשל 08:00–10:00]. בעת ההזמנה בוחרים את חלון האיסוף המועדף.",
  },
  {
    q: "האם הג'חנון מגיע עם תוספות?",
    // [TODO: traditional pairings — eggs, tomato dip, schug?]
    a: "[TODO: למשל: 'הג'חנון של קפה הכרם מגיע עם ביצה קשה, רסק עגבניות וסחוג, כמיטב המסורת התימנית.']",
  },
  {
    q: "האם הג'חנון של קפה הכרם כשר?",
    // [TODO: critical for many customers. Confirm and be specific.]
    a: "[TODO: למשל: 'הג'חנון של קפה הכרם נאפה במטבח כשר תחת השגחת [גוף ההשגחה].']",
  },
  {
    q: "האם אפשר להזמין ג'חנון לאמצע השבוע?",
    // [TODO: most cafés are Shabbat-only — confirm.]
    a: "[TODO: למשל: 'הג'חנון של קפה הכרם מוגש לאיסוף בשבת בלבד. להזמנות מיוחדות לאירועים — ניתן לפנות דרך עמוד מגשי האירוח.']",
  },
];

/* ─── Catering page FAQs ──────────────────────────────────────── */

export const cateringFAQs: FAQ[] = [
  {
    q: "כמה זמן מראש צריך להזמין מגש אירוח מקפה הכרם?",
    // [TODO: confirm lead time — 24h? 48h? a week for large orders?]
    a: "[TODO: למשל: 'מומלץ להזמין מגשי אירוח מקפה הכרם לפחות 48 שעות מראש. להזמנות גדולות — פנייה מוקדמת ככל האפשר.']",
  },
  {
    q: "מה כולל מגש האירוח של קפה הכרם?",
    // [TODO: list actual contents]
    a: "[TODO: למשל: 'מגשי האירוח של קפה הכרם כוללים מבחר כריכים טריים, מאפים, סלטים וקינוחים. ניתן להתאים את התכולה לפי בקשה.']",
  },
  {
    q: "האם יש משלוחים של מגשי אירוח?",
    // [TODO: delivery? area? cost?]
    a: "[TODO: למשל: 'קפה הכרם מספק מגשי אירוח באיסוף עצמי וכן במשלוח באזור גני תקווה והסביבה. עלות המשלוח תלויה במרחק.']",
  },
  {
    q: "לכמה אנשים מתאים מגש אירוח של קפה הכרם?",
    // [TODO: serving sizes — small/medium/large?]
    a: "[TODO: למשל: 'מגשי האירוח של קפה הכרם זמינים בגדלים שונים, החל ממגש ל-5 איש ועד למגשים לאירועים של 30 איש ומעלה.']",
  },
  {
    q: "האם יש מגשי אירוח כשרים?",
    // [TODO: kosher certification details]
    a: "[TODO: למשל: 'כל מגשי האירוח של קפה הכרם מגיעים ממטבח כשר תחת השגחת [גוף ההשגחה].']",
  },
];

/* ─── Contact page FAQs ───────────────────────────────────────── */

export const contactFAQs: FAQ[] = [
  {
    q: "מה הטלפון של קפה הכרם?",
    a: "הטלפון של קפה הכרם הוא 053-557-4194. ניתן להתקשר לבירורים, להזמנות ולתיאומים.",
  },
  {
    q: "האם אפשר לשלוח הודעה לקפה הכרם בוואטסאפ?",
    a: "כן, ניתן לפנות לקפה הכרם דרך וואטסאפ במספר 053-557-4194. זמן התגובה הוא בדרך כלל במהלך שעות הפתיחה.",
  },
  {
    q: "איפה הכתובת המדויקת של קפה הכרם?",
    a: "כתובת קפה הכרם היא הכרמל 20, גבעת סביון, גני תקווה. ניתן לנווט דרך Waze או Google Maps.",
  },
];

/* ─── Aggregator (used by /sitemap.ts and /app/api routes) ─────── */

export const allFAQs = {
  home: homeFAQs,
  menu: menuFAQs,
  jachnun: jachnunFAQs,
  catering: cateringFAQs,
  contact: contactFAQs,
} as const;

export type FAQPage = keyof typeof allFAQs;