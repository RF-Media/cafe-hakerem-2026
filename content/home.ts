/**
 * Home page copy.
 *
 * Extracted out of `app/(site)/page.tsx`, where it had been written inline.
 * CLAUDE.md §3: copy never lives in components — that rule is what lets the
 * café change wording without anyone touching JSX.
 */

export const homeHero = {
  /** Sits inside the <h1>, so the page's main heading carries the entity and
   *  the location (§10) without weighing down the line people actually read. */
  kicker: "קפה הכרם, בית קפה בוטיקי בגני תקווה",
  headlineA: "הקפה של השכונה.",
  headlineB: "והג'חנון של הסופ״ש.",
  /** Appended after the business tagline. */
  lede: "קפה טוב, מאפים חמים, כריכים שמכינים במקום ואווירה שעושה חשק להישאר. ובסוף השבוע? הג'חנון והבורקס שאיתם הכל התחיל.",
  primaryCta: "לתפריט",
  secondaryCta: "להזמנת ג'חנון",
  visitEyebrow: "מחכים לכם ב",
  navigate: "נווטו אלינו",
  whatsapp: "וואטסאפ",
  /** The barista with the logo on his back, full-bleed: the LCP element, served
   *  `priority` at quality 85 per CLAUDE.md §8. */
  image: "/images/barista_shared.jpg",
  /** Portrait screens get their own photo: the hero box is taller than it is
   *  wide there, and `object-cover` would blow a thin slice of the landscape
   *  shot up several times over. One <img>, so one alt covers both photos. */
  imageMobile: "/images/coffee-duo_shared.jpg",
  imageAlt:
    "בריסטה של קפה הכרם בחולצה עם לוגו הבית ליד מכונת האספרסו, וכוסות קפה ממותגות עם קרואסון חמאה",
};

/** The strip under the hero. Facts only, and each one is findable elsewhere. */
export const homeTicker = [
  "קפה שנטחן במקום",
  "בורקס תורכי בעבודת יד",
  "מאפים חמים מהתנור",
  "ג'חנון של שבת להזמנה",
  "מגשי אירוח",
  "פתוח שבעה ימים בשבוע",
  "גבעת סביון, גני תקווה",
];

export const homeValues = {
  eyebrow: "למה הכרם",
  title: "שלוש סיבות לקפוץ לקפה הכרם",
  items: [
    {
      title: "קפה אמיתי",
      body: "פולי ערביקה ורובוסטה מובחרים, בקלייה איטית לשמירה על טעם עמוק וארומה עשירה. בדיוק כמו שאנחנו מאמינים שקפה צריך להיות.",
      image: "/images/portafilter_shared.jpg",
      imageAlt: "ידית אספרסו מלאה בקפה טחון טרי מעל מכונת הקפה של קפה הכרם",
    },
    {
      title: "100% טריות, חם מהתנור",
      body: "מאפים ובורקסים שנאפים מדי בוקר, כריכים ופוקאצ'ות איטלקיות שמכינים במקום וכל הדברים הטובים שכיף לפתוח איתם את היום.",
      image: "/images/croissant-macro_shared.jpg",
      imageAlt: "חתך של קרואסון חמאה טרי בקפה הכרם, שכבות הבצק המדופדף נראות מבפנים",
    },
    {
      title: "הקפה של השכונה",
      body: "מקום לעצור בו לקפה של בוקר, למפגש עם חברים או פשוט לשבת קצת. שיחות שמתארכות ואווירה שעושה חשק להישאר.",
      image: "/images/courtyard-tall_shared.jpg",
      imageAlt: "אורחים יושבים בחצר של קפה הכרם תחת שמשייה לבנה, בין עציצים ועצי דקל",
      imagePosition: "50% 72%",
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
  cta: "לתפריט המלא",
  /** Sits under the board. Previously hardcoded inside the component. */
  caption: "התפריט מתחדש לפי העונה.",
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
  eyebrow: "שבת בבוקר",
  priceFrom: "₪30 ליחידה",
  countdownPrefix: "ההזמנות לשבת הקרובה נסגרות בעוד",
  image: "/images/jachnun-closeup_shared.jpg",
  imageAlt: "ג'חנון תימני מגולגל לצד רסק עגבניות טרי, ביצה קשה וסחוג ירוק, כפי שמוגש בשבת בקפה הכרם",
  imageSecond: "/images/burekas-eggs_shared.jpg",
  imageSecondAlt: "בורקס תורכי מוזהב במגש מתכת לצד ביצים קשות וסחוג, כפי שמוגש בקפה הכרם",
  title: "השבת מתחילה בג'חנון והבורקס של הכרם",
  body: "יש דברים ששווה לחכות להם כל השבוע. הג'חנון שלנו הוא אחד מהם: חם, טעים ועם כל התוספות הנכונות. מזמינים מראש, עוצרים בכרם ומתחילים את השבת.",
  urgency: "ההזמנות לשבת הקרובה נסגרות ביום שישי, 16:00",
  cta: "להזמנת ג'חנון",
  steps: [
    { n: "01", title: "מזמינים עד שישי", body: "טופס קצר באתר, עד יום שישי בשעה 16:00." },
    { n: "02", title: "דברים טובים לוקחים זמן", body: "הג'חנון נכנס לתנור בשישי ונאפה לאט לאורך הלילה." },
    { n: "03", title: "אוספים בשבת בבוקר", body: "מגיעים לקפה הכרם ואוספים את הג'חנון חם." },
  ],
};

export const homeCatering = {
  eyebrow: "מגשי אירוח",
  title: "מגשי האירוח של קפה הכרם",
  body:
    "מארחים? את החלק הטעים תשאירו לנו. מגשי אירוח טריים, מגוונים ומוקפדים, " +
    "עם כל הטעמים שאתם אוהבים. נשמח לקחת חלק בכל אירוע או חגיגה יחד אתכם.",
  cta: "להזמנת מגש",
  /** Which `catering.options[].id` comes first in the row (falls back to the
   *  first option if this id ever drifts from the catalog, so the section can
   *  never point at nothing). */
  featuredOptionId: "sandwich-tray",
};

export const homeAbout = {
  eyebrow: "קצת עלינו",
  title: "הסיפור של קפה הכרם",
  cta: "לקריאת הסיפור המלא",
  imageAlt: "חזית קפה הכרם ברחוב הכרמל 20, גני תקווה - שלט הקפה מעל הדלפק, המדפים וויטרינת המאפים",
  image: "/images/storefront_shared.jpg",
  imageSecond: "/images/bread-bags_about.jpg",
  imageSecondAlt: "לחמים ובאגטים בשקיות נייר ממותגות של קפה הכרם",
  imageThird: "/images/barista-work_about.jpg",
  imageThirdAlt: "בריסטה מכין קפה מאחורי הדלפק של קפה הכרם",
  paragraphs: [
    "קפה הכרם הוא הרבה יותר מבית קפה. הוא פינה שקטה בלב גני תקווה, מקום מפגש לשכנים, לחברים ולמשפחות, עם קפה משובח, אוכל מפנק ואווירה ביתית שאין בשום מקום אחר. מקום שכיף לעצור בו לרגע ולפעמים גם להישאר לקצת יותר.",
    "הסיפור שלנו התחיל מעגלת ג'חנון ובורקס שהפכה עם הזמן להרבה יותר מרעיון של סוף שבוע. ההצלחה שלה הובילה אותנו לקחת את האהבה לאוכל צעד אחד קדימה וכך נולד קפה הכרם.",
    "מאז ועד היום, אנחנו מאמינים בקפה איכותי, אוכל משובח וביחס חם ואישי וזה מה שתפגשו כאן בכל ביקור.",
  ],
};

export const homeFactualFocus =
  "הקפה מציע ארוחות בוקר, כריכים, מאפים, מגשי אירוח וג'חנון של שבת להזמנה מראש.";

/** The closing band: everything needed to actually get here. */
export const homeVisit = {
  eyebrow: "באים לבקר?",
  title: "רחוב הכרמל 20, גבעת סביון",
  body: "פתוחים שבעה ימים בשבוע, גם בשבת. יש ישיבה בחוץ, חניה ברחוב ובחניון תת-קרקעי, וגן שעשועים צמוד לילדים.",
  hoursTitle: "שעות פתיחה",
  navigate: "נווטו אלינו ב-Waze",
  maps: "לצפייה במפה",
  contact: "כל הדרכים ליצור קשר",
  image: "/images/yard_shared.jpg",
  imageAlt: "החצר של קפה הכרם בשעות היום, שמשיות לבנות ואורחים יושבים בין עצי דקל",
};
