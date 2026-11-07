/**
 * Titles, descriptions and share images for every public route, in one file so
 * `npm run check:geo` can audit their lengths and `/llms.txt` can list them.
 *
 * Titles stay under 70 characters; descriptions 140-160 (§10).
 */

export type PageSeo = { path: string; title: string; description: string; image: string; imageAlt: string };

export const pages = {
  home: {
    path: "/",
    title: "קפה הכרם - בית קפה בוטיקי בגני תקווה",
    description:
      "קפה הכרם, בית קפה בוטיקי ברחוב הכרמל 20 בגני תקווה: קפה שנטחן במקום, בורקס תורכי, מאפים חמים, מגשי אירוח, ג'חנון של שבת ומועדון לקוחות. פתוח גם בשבת.",
    image: "/images/og_home.jpg",
    imageAlt: "בריסטה של קפה הכרם ליד מכונת האספרסו, גני תקווה",
  },
  menu: {
    path: "/menu",
    title: "התפריט שלנו | קפה הכרם - בית קפה בגני תקווה",
    description:
      "התפריט המלא של קפה הכרם בגני תקווה עם מחירים: בורקס תורכי בעבודת יד, כריכים ופוקאצ'ות, סלטים, מאפים, עוגות, קפה קר, מיצים סחוטים ומוצרי קפה לבית.",
    image: "/images/og_menu.jpg",
    imageAlt: "בורקס תורכי מוזהב של קפה הכרם בגני תקווה",
  },
  about: {
    path: "/about",
    title: "הסיפור שלנו | קפה הכרם - בית קפה בגני תקווה",
    description:
      "הסיפור של קפה הכרם בגני תקווה: איך עגלת ג'חנון ובורקס של סוף שבוע הפכה לבית קפה שכונתי ברחוב הכרמל 20, עם קפה שנטחן במקום, מאפים חמים וחצר לשבת בה.",
    image: "/images/og_about.jpg",
    imageAlt: "החצר של קפה הכרם בגני תקווה, שמשיות ועצי דקל",
  },
  jachnun: {
    path: "/jachnun",
    title: "ג'חנון של שבת להזמנה | קפה הכרם - גני תקווה",
    description:
      "ג'חנון תימני של קפה הכרם בגני תקווה: נאפה לילה שלם, מגיע עם ביצה, רסק וסחוג, מ-₪35 ליחידה. מזמינים באתר עד חמישי 18:00, אוספים ומשלמים בשבת בבוקר.",
    image: "/images/og_jachnun.jpg",
    imageAlt: "ג'חנון תימני של קפה הכרם עם רסק עגבניות וביצה קשה",
  },
  catering: {
    path: "/catering",
    title: "מגשי אירוח להזמנה | קפה הכרם - גני תקווה",
    description:
      "מגשי אירוח של קפה הכרם בגני תקווה: בורקס טורקי, כריכוני ביס ומגשים מתוקים לישיבות, אירוח בבית וימי הולדת. איסוף או משלוח באזור, הזמנה בטופס הפנייה.",
    image: "/images/og_catering.jpg",
    imageAlt: "מגש בורקס תורכי ומטבלים של קפה הכרם",
  },
  club: {
    path: "/coffee-club",
    title: "מועדון הלקוחות | קפה הכרם - בית קפה בגני תקווה",
    description:
      "מועדון הלקוחות של קפה הכרם בגני תקווה: כרטיסיית ניקובים דיגיטלית בחינם, ניקוב ראשון במתנה, קפה חינם בניקוב העשירי, ומתנה ליום ההולדת. בלי אפליקציה.",
    image: "/images/og_coffee-club.jpg",
    imageAlt: "שתי כוסות קפה ממותגות של קפה הכרם וקרואסון",
  },
  contact: {
    path: "/contact",
    title: "צור קשר, שעות וכתובת | קפה הכרם - גני תקווה",
    description:
      "קפה הכרם, רחוב הכרמל 20, גבעת סביון, גני תקווה. טלפון 053-557-4194, וואטסאפ, שעות פתיחה, חניה ומפה. פתוח שבעה ימים בשבוע, וגם בשבת בין 08:00 ל-21:00.",
    image: "/images/og_contact.jpg",
    imageAlt: "חזית קפה הכרם ברחוב הכרמל 20, גני תקווה",
  },
  map: {
    path: "/map",
    title: "מפה והגעה | קפה הכרם - בית קפה בגני תקווה",
    description:
      "מפה והגעה לקפה הכרם: רחוב הכרמל 20, מרכז הבמה, גבעת סביון, גני תקווה. שעות פתיחה, חניה ברחוב ובחניון תת-קרקעי, וניווט ישיר ב-Google Maps או ב-Waze.",
    image: "/images/og_contact.jpg",
    imageAlt: "חזית קפה הכרם ברחוב הכרמל 20, גני תקווה",
  },
  privacy: {
    path: "/privacy",
    title: "מדיניות פרטיות | קפה הכרם",
    description:
      "מדיניות הפרטיות של אתר קפה הכרם בגני תקווה: אילו פרטים נאספים בהזמנות ובטפסים, למה הם משמשים, מה קורה בהרשמה למועדון, ואיך מבקשים למחוק אותם.",
    image: "/images/og_home.jpg",
    imageAlt: "קפה הכרם, גני תקווה",
  },
  accessibility: {
    path: "/accessibility",
    title: "הצהרת נגישות | קפה הכרם",
    description:
      "הצהרת הנגישות של אתר קפה הכרם בגני תקווה: מה נבדק באתר, איך משתמשים בתפריט הנגישות, ואיך פונים אלינו בטלפון או בדוא\"ל אם משהו לא נגיש עבורכם.",
    image: "/images/og_home.jpg",
    imageAlt: "קפה הכרם, גני תקווה",
  },
} satisfies Record<string, PageSeo>;

export type PageKey = keyof typeof pages;
