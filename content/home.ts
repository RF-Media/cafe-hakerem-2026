/**
 * Home page copy.
 *
 * Extracted out of `app/(site)/page.tsx`, where it had been written inline.
 * CLAUDE.md §3: copy never lives in components — that rule is what lets the
 * café change wording without anyone touching JSX.
 */

export const homeHero = {
  eyebrow: "Your neighborhood café",
  headline: "הקפה של השכונה. והג'חנון של הסופ״ש.",
  /** Appended after the business tagline. */
  lede: "קפה טוב, מאפים חמים, כריכים שמכינים במקום ואווירה שעושה חשק להישאר. ובסוף השבוע? הג'חנון והבורקס שאיתם הכל התחיל.",
  primaryCta: "לתפריט",
  secondaryCta: "להזמנת ג'חנון",
  visitEyebrow: "Visit",
  scrollCue: "גללו",
  /** The storefront photograph behind the hero. Full-bleed, so it is the
   *  LCP element — served `priority` at quality 85 per CLAUDE.md §8. */
  image: "/images/cafe-counter_home.jpg",
  /** Portrait screens get their own photo: the hero box is taller than it is
   *  wide there, and `object-cover` would blow a thin slice of the landscape
   *  shot up ~4.7×. One <img>, so one alt covers both photos. */
  imageMobile: "/images/takeaway-cup_home.jpg",
  imageAlt:
    "קפה הכרם ברחוב הכרמל 20, גני תקווה - הדלפק וויטרינת המאפים, וכוס קפה ממותגת על שולחן בחוץ",
};

export const homeValues = {
  eyebrow: "למה הכרם",
  title: "שלוש סיבות לקפוץ לקפה הכרם",
  items: [
    {
      title: "קפה אמיתי",
      body: "פולי ערביקה ורובוסטה מובחרים, בקלייה איטית לשמירה על טעם עמוק וארומה עשירה. בדיוק כמו שאנחנו מאמינים שקפה צריך להיות.",
      imageAlt: "פולי קפה קלויים מקרוב - תערובת הערביקה והרובוסטה של קפה הכרם",
    },
    {
      title: "100% טריות, חם מהתנור",
      body: "מאפים ובורקסים שנאפים מדי בוקר, כריכים שמכינים במקום וכל הדברים הטובים שכיף לפתוח איתם את היום.",
      imageAlt: "חתך של קרואסון חמאה טרי בקפה הכרם, שכבות הבצק המדופדף נראות מבפנים",
    },
    {
      title: "הקפה של השכונה",
      body: "מקום לעצור בו לקפה של בוקר, למפגש עם חברים או פשוט לשבת קצת. שיחות שמתארכות ואווירה שעושה חשק להישאר.",
      imageAlt: "אורחות יושבות לקפה בחצר החיצונית של קפה הכרם, בין עציצים ושולחנות שחורים",
    },
  ],
};

export const homeMenu = {
  eyebrow: "המומלצים",
  title: "הנבחרים שלנו.",
  cta: "לתפריט המלא",
  categoriesLabel: "קטגוריות",
};

export const homeAlwaysRolling = {
  eyebrow: "מה אוכלים?",
  title: "מה בא לכם היום?",
  /** Sits under the board. Previously hardcoded inside the component. */
  caption: "התפריט מתחדש לפי העונה. לחצו על קטגוריה למעבר ישיר בתפריט המלא.",
};


export const homePatisserie = {
  eyebrow: "הסופ״ש של הכרם",
  title: "ג'חנון של שבת, בורקס כל השבוע.",
  body:
    "ג'חנון חם לשבת בבוקר, ובורקס טרי שאופים אצלנו כל יום. מגיעים לאסוף, " +
    "או מזמינים ג'חנון מראש.",
  cta: "להזמנה לסופ״ש",
  chapterCurrent: "בורקס · כל השבוע",
  chapterNext: "שבת · ג'חנון",
  imageAlt:
    "מגש קינוחים ומאפים מתוקים טריים מהפטיסרי של קפה הכרם, ספיישל סוף השבוע",
};

export const homeJachnun = {
  eyebrow: "Saturday morning",
  title: "השבת מתחילה בג'חנון של הכרם",
  body: "יש דברים ששווה לחכות להם כל השבוע. הג'חנון שלנו הוא אחד מהם: חם, טעים ועם כל התוספות הנכונות. מזמינים מראש, עוצרים בכרם ומתחילים את השבת.",
  urgency: "ההזמנות לשבת הקרובה נסגרות ביום חמישי, 18:00",
  cta: "להזמנת ג'חנון",
  steps: [
    { n: "01", title: "מזמינים עד חמישי", body: "טופס קצר באתר, עד יום חמישי בשעה 18:00." },
    { n: "02", title: "דברים טובים לוקחים זמן", body: "הג'חנון נכנס לתנור בשישי ונאפה לאט לאורך הלילה." },
    { n: "03", title: "אוספים בשבת בבוקר", body: "מגיעים לקפה הכרם ואוספים את הג'חנון חם." },
  ],
};

export const homeCatering = {
  eyebrow: "מגשי אירוח",
  title: "מגשי האירוח של קפה הכרם",
  body:
    "מארחים? את החלק הטעים תשאירו לנו. מגשי אירוח טריים, מגוונים ומוקפדים, " +
    "עם כל הטעמים שאתם אוהבים. ממפגש אינטימי של 15 איש ועד לאירוע של 120 " +
    "אורחים באולם - תמיד יש סיבה טובה להתכנס.",
  capacityStat: {
    lowValue: "15",
    lowLabel: "איש, מפגש אינטימי",
    highValue: "120",
    highLabel: "אורחים, באולם",
  },
  cta: "להזמנת מגש",
  /** Which `catering.options[].id` is the featured card in the editorial-
   *  split layout (falls back to the first option if this id ever drifts
   *  from the catalog, so the section can never point at nothing). */
  featuredOptionId: "sandwich-tray",
};

export const homeAbout = {
  eyebrow: "קצת עלינו",
  title: "הסיפור של קפה הכרם",
  cta: "לקריאת הסיפור המלא",
  imageAlt: "חזית קפה הכרם ברחוב הכרמל 20, גני תקווה - שלט הקפה מעל הדלפק, המדפים וויטרינת המאפים",
  paragraphs: [
    "קפה הכרם הוא הרבה יותר מבית קפה. הוא פינה שקטה בלב גני תקווה, מקום מפגש לשכנים, לחברים ולמשפחות, עם קפה משובח, אוכל מפנק ואווירה ביתית שאין בשום מקום אחר. מקום שכיף לעצור בו לרגע ולפעמים גם להישאר לקצת יותר.",
    "הסיפור שלנו התחיל מעגלת ג'חנון ובורקס שהפכה עם הזמן להרבה יותר מרעיון של סוף שבוע. ההצלחה שלה הובילה אותנו לקחת את האהבה לאוכל צעד אחד קדימה וכך נולד קפה הכרם.",
    "מאז ועד היום, אנחנו מאמינים בקפה איכותי, אוכל משובח וביחס חם ואישי וזה מה שתפגשו כאן בכל ביקור.",
  ],
};

export const homeFactualFocus =
  "הקפה מציע ארוחות בוקר, כריכים, מאפים, מגשי אירוח וג'חנון של שבת להזמנה מראש.";
