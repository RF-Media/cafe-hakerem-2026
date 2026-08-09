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
  lede: "קפה טוב, מאפים טריים, כריכים ואוכל שעושים במקום. ובסוף השבוע - הג׳חנון והבורקס שהתחילו את הכול.",
  primaryCta: "לתפריט",
  secondaryCta: "להזמנת ג'חנון",
  visitEyebrow: "Visit",
  scrollCue: "גללו",
  /** The storefront photograph behind the hero. Full-bleed, so it is the
   *  LCP element — served `priority` at quality 85 per CLAUDE.md §8. */
  image: "/images/hero-storefront.jpg",
  imageAlt:
    "חזית קפה הכרם ברחוב הכרמל 20, גני תקווה - הדלפק, ויטרינת המאפים ושלט הקפה מעל הכניסה",
};

export const homeValues = {
  eyebrow: "למה הכרם",
  title: "שלוש סיבות לקפוץ לקפה הכרם",
  items: [
    {
      title: "קפה שטוחנים במקום",
      body: "פולים איכותיים, טחינה במקום ובריסטות שיודעות בדיוק איך הקפה שלכם צריך לצאת.",
      imageAlt: "בריסטה של קפה הכרם מכין קפה במכונת האספרסו של בית הקפה",
    },
    {
      title: "אופים כל בוקר",
      body: "מאפים, בורקסים ועוד דברים טובים שיוצאים מהתנור לאורך הבוקר.",
      imageAlt: "באגטים ולחמים טריים מהאפייה של קפה הכרם, ארוזים בשקיות נייר עם לוגו בית הקפה",
    },
    {
      title: "הקפה של השכונה",
      body: "מקום לעצור בו לקפה של בוקר, להיפגש, לאכול משהו טוב או פשוט לשבת קצת.",
      imageAlt: "ישיבה בחצר החיצונית של קפה הכרם בין עצי דקל, אורחים סביב שולחנות מתחת למטריות",
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
  subtitle:
    "התפריט שלנו משתנה עם העונה וממה שטרי זה מספקים. הקטגוריות שלנו זורמות כמו קפה חם - תמיד משהו חדש להנות.",
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
  body: "הג'חנון שלנו מחכה לכם חם בשבת בבוקר, עם כל מה שצריך ליד. מזמינים מראש, אוספים בכרם ומתחילים את השבת כמו שצריך.",
  reassurance: "רוצים להיות בטוחים שיש? מומלץ להזמין מראש.",
  urgency: "ההזמנות לשבת הקרובה נסגרות ביום חמישי, 18:00",
  cta: "להזמנת ג'חנון",
  steps: [
    { n: "01", title: "מזמינים עד חמישי", body: "טופס קצר באתר, עד יום חמישי בשעה 18:00." },
    { n: "02", title: "אנחנו אופים בלילה", body: "הג'חנון נכנס לתנור בליל שבת ואופה לאט עד הבוקר." },
    { n: "03", title: "אוספים בשבת בבוקר", body: "מגיעים לקפה הכרם ברחוב הכרמל 20 ואוספים חם." },
  ],
};

export const homeCatering = {
  eyebrow: "מגשי אירוח",
  title: "מגשי האירוח של קפה הכרם",
  body:
    "מגשים לבוקר, לישיבה, לאירוע משפחתי. כל מגש נבנה לפי הקבוצה, במטבח " +
    "של קפה הכרם - מחצר בית קטנה ועד אולם, מ-15 עד 120 איש.",
  capacityStat: {
    lowValue: "15",
    lowLabel: "איש, בחצר בית",
    highValue: "120",
    highLabel: "איש, באולם קטן",
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
  imageAlt: "פנים בית הקפה של קפה הכרם - שולחנות עץ, תאורה חמה ודלפק המאפים",
  paragraphs: [
    "קפה הכרם הוא הרבה יותר מבית קפה – הוא פינה שקטה בלב גני תקווה, מקום מפגש לשכנים, חברים ומשפחות, עם קפה משובח, אוכל מפנק ואווירה ביתית שאין בשום מקום אחר.",
    "אנחנו כאן כבר שנים, עם צוות חם ומקצועי, תפריט טרי שמתעדכן ואהבה אמיתית למה שאנחנו עושים. בין אם אתם קופצים לקפה של בוקר, לארוחת צהריים קלה, למפגש עם חברים או אפילו לאירוח קטן – תדעו שתמיד יש לכם מקום אצלנו.",
    "אנחנו מאמינים בקפה טוב, באוכל איכותי וביחס אישי – וזה מה שתמצאו כאן, בכל ביקור.",
  ],
};

export const homeFactualFocus =
  "הקפה מציע ארוחות בוקר, כריכים, מאפים, מגשי אירוח וג'חנון של שבת להזמנה מראש.";
