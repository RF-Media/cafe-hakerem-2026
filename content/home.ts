/**
 * Home page copy.
 *
 * Extracted out of `app/(site)/page.tsx`, where it had been written inline.
 * CLAUDE.md §3: copy never lives in components — that rule is what lets the
 * café change wording without anyone touching JSX. Two `[TODO]` markers
 * below were previously shipping into the rendered page as literal text.
 */

export const homeHero = {
  eyebrow: "Boutique neighborhood café",
  headline: "קפה שכונתי בלב גני תקווה",
  /** Appended after the business tagline. */
  lede: "ארוחות בוקר, קפה טוב, ומאפים טריים — ובסוף השבוע, ג'חנון להזמנה.",
  primaryCta: "לתפריט המלא",
  secondaryCta: "להזמנת ג'חנון",
  visitEyebrow: "Visit",
  scrollCue: "גללו",
};

export const homeValues = {
  eyebrow: "למה אנחנו",
  title: "שלוש סיבות לבוא לקפה הכרם",
  items: [
    {
      title: "קפה שנטחן במקום",
      body: "תערובת [TODO] שמגיעה אלינו טרי, נטחנת במכונה לפני כל כוס.",
    },
    {
      title: "אופים בעצמנו",
      body: "מאפים, בורקסים ועוגות — אפייה [TODO: יומית] במטבח שלנו.",
    },
    {
      title: "שכונה אמיתית",
      body: "אנחנו מכירים את הלקוחות בשם. הקפה הוא חלק מהשכונה, לא רשת.",
    },
  ],
};

export const homeMenu = {
  eyebrow: "התפריט",
  title: "מה אופים השבוע.",
  cta: "לתפריט המלא",
  panelEyebrow: "Always rolling",
  categoriesLabel: "קטגוריות",
  itemsLabel: "פריטים",
};

export const homeJachnun = {
  eyebrow: "Saturday morning",
  title: "ג'חנון של שבת — להזמנה מראש",
  body: "קפה הכרם אופה ג'חנון תימני לאיסוף בשבת בבוקר. ההזמנה דרך האתר עד יום חמישי 18:00.",
  cta: "להזמנת ג'חנון",
  steps: [
    { n: "01", title: "מזמינים עד חמישי", body: "טופס קצר באתר, עד יום חמישי בשעה 18:00." },
    { n: "02", title: "אנחנו אופים בלילה", body: "הג'חנון נכנס לתנור בליל שבת ואופה לאט עד הבוקר." },
    { n: "03", title: "אוספים בשבת בבוקר", body: "מגיעים לקפה הכרם ברחוב הכרמל 20 ואוספים חם." },
  ],
};

export const homeCatering = {
  eyebrow: "מגשי אירוח",
  title: "כשמגיעים אורחים.",
  body: "מגשים לבוקר, לישיבה, לאירוע משפחתי. כל מגש נבנה לפי הקבוצה, במטבח של קפה הכרם.",
  cta: "להזמנת מגש",
  trays: ["בוקר", "ישיבה", "מתוק", "קומבינציה"],
};

export const homeAbout = {
  eyebrow: "קצת עלינו",
  title: "הסיפור של קפה הכרם",
  cta: "לקריאת הסיפור המלא",
  imageAlt: "פנים בית הקפה של קפה הכרם — שולחנות עץ, תאורה חמה ודלפק המאפים",
  paragraphs: [
    "קפה הכרם הוא הרבה יותר מבית קפה – הוא פינה שקטה בלב גני תקווה, מקום מפגש לשכנים, חברים ומשפחות, עם קפה משובח, אוכל מפנק ואווירה ביתית שאין בשום מקום אחר.",
    "אנחנו כאן כבר שנים, עם צוות חם ומקצועי, תפריט טרי שמתעדכן ואהבה אמיתית למה שאנחנו עושים. בין אם אתם קופצים לקפה של בוקר, לארוחת צהריים קלה, למפגש עם חברים או אפילו לאירוח קטן – תדעו שתמיד יש לכם מקום אצלנו.",
    "אנחנו מאמינים בקפה טוב, באוכל איכותי וביחס אישי – וזה מה שתמצאו כאן, בכל ביקור.",
  ],
};

export const homeInstagramEmpty = "[TODO: 6 פוסטים מאינסטגרם ב-/content/instagram.ts]";

export const homeFactualFocus =
  "הקפה מציע ארוחות בוקר, כריכים, מאפים, מגשי אירוח וג'חנון של שבת להזמנה מראש.";
