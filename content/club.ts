/**
 * Loyalty club copy for /coffee-club and the home-page band.
 *
 * The club runs on CoffeeStream, so every fact here mirrors the café's public
 * shop settings at app.coffeestream.co.il/s/cafehakerem, read 2026-11-05:
 * 10 punches, reward "קפה חינם", one punch as the sign-up benefit, a birthday
 * email two days ahead with "קפה חינם + 20% על התפריט" valid for 7 days, and
 * status names at 31 and 81 lifetime punches. If the café changes those in
 * CoffeeStream, this file has to follow.
 */

/** Same shape as a milestone on CoffeeStream's card template: a position and what shows in that punch. */
export type ClubPerk =
  | { position: number; label: string; icon: "gift" | "cookie" | "cake" | "cup" }
  | { position: number; label: string; mark: string };

export const club = {
  hero: {
    kicker: "מועדון הלקוחות של קפה הכרם, גני תקווה",
    title: "הקפה העשירי עלינו.",
    lede:
      "כרטיסיית ניקובים דיגיטלית לשכנים של קפה הכרם. מצטרפים בחינם, מקבלים ניקוב ראשון במתנה, " +
      "ובכל קנייה הכרטיס מתמלא עוד קצת, עד שהכוס העשירית מגיעה עלינו.",
    primary: "להצטרפות בחינם",
    secondary: "כבר חברים? לכרטיס שלי",
    trust: ["בלי דמי חבר", "בלי אפליקציה", "ניקוב ראשון במתנה"],
    poweredBy: "מועדון הלקוחות של קפה הכרם פועל על",
  },

  /* The interactive centrepiece: how fast your own habit fills the card. */
  calculator: {
    eyebrow: "מחשבון הקפה",
    title: "כמה קפה אתם שותים בשבוע?",
    lede: "הזיזו את הסמן וראו כמה מהר הכרטיס מתמלא בקצב שלכם, ומה נכנס אליו בדרך.",
    sliderLabel: "כוסות קפה בשבוע",
    perWeek: (n: number) => (n === 1 ? "כוס אחת בשבוע" : `${n} כוסות בשבוע`),
    everyLabel: "קפה חינם כל",
    every: (days: number) => (days === 1 ? "יום" : days === 7 ? "שבוע" : days === 14 ? "שבועיים" : `${days} ימים`),
    yearLabel: "בשנה שלמה",
    year: (n: number) => `${n} כוסות עלינו`,
    /* CONFIRM BEFORE LAUNCH: every label is a real benefit from the facts above,
       but only positions 1 and 10 are real positions. 3, 5 and 7 are the order
       they appear on the illustration, not the café's card, and the note below
       says so. To promise a cookie at a given punch, set that milestone in the
       café's CoffeeStream card template first, then mirror it here. */
    perks: [
      { position: 1, icon: "gift", label: "ניקוב ראשון במתנה" },
      { position: 3, icon: "cookie", label: "מבצעים לחברים" },
      { position: 5, mark: "20%", label: "20% ליום ההולדת" },
      { position: 7, icon: "cake", label: "קפה חינם ליום ההולדת" },
      { position: 10, icon: "cup", label: "הקפה העשירי עלינו" },
    ] as ClubPerk[],
    perksLabel: "מה נכנס לכרטיס",
    perkOn: "בכרטיס",
    perkOff: "בהמשך",
    phoneYear: "קפה חינם בשנה",
    phoneEvery: (every: string) => `כל ${every}`,
    cardCaption: (left: number, extra: number) =>
      left > 1
        ? `עוד ${left} ניקובים לקפה חינם`
        : left === 1
          ? "עוד ניקוב אחד לקפה חינם"
          : extra > 1
            ? `הכרטיס מלא, ועוד ${extra} ניקובים לכרטיס הבא`
            : extra === 1
              ? "הכרטיס מלא, ועוד ניקוב אחד לכרטיס הבא"
              : "הכרטיס מלא, הקפה עלינו",
    sceneLabel: (filled: number, total: number) => `כרטיסיית ניקובים לדוגמה של קפה הכרם, ${filled} ניקובים מתוך ${total}`,
    note: "חישוב לדוגמה: ניקוב אחד לכל קנייה, 52 שבועות בשנה. ההטבות באיור להמחשה: יום ההולדת והמבצעים מגיעים לכל חבר, בכל קצב.",
    cta: "להתחיל למלא",
  },

  steps: {
    eyebrow: "שלושה צעדים",
    title: "דקה אחת, וזה בטלפון",
    items: [
      {
        icon: "qr" as const,
        title: "נכנסים לכרטיס",
        body: "לוחצים על הכפתור בעמוד הזה, או מהמחשב סורקים את קוד ה-QR בטלפון.",
      },
      {
        icon: "phone" as const,
        title: "נרשמים פעם אחת",
        body: "בלחיצה עם Google, או בשלושה שלבים קצרים עם מייל. הניקוב הראשון כבר מחכה בכרטיס.",
      },
      {
        icon: "stamp" as const,
        title: "מציגים קוד בקופה",
        body: "לפני התשלום פותחים את הכרטיס ומציגים את הקוד. הניקוב נכנס, ובניקוב העשירי הקפה עלינו.",
      },
    ],
  },

  perks: {
    eyebrow: "מה מקבלים",
    title: "לא רק קפה חינם",
    items: [
      { icon: "cup" as const, title: "קפה חינם בניקוב העשירי", body: "כל קנייה מוסיפה ניקוב, וההטבה מחכה בכרטיס עד שתבואו לקחת אותה." },
      { icon: "stamp" as const, title: "ניקוב ראשון במתנה", body: "ברגע שמצטרפים, הניקוב הראשון כבר בכרטיס. נשארו רק תשעה." },
      { icon: "gift" as const, title: "מתנה ליום ההולדת", body: "לקראת יום ההולדת מגיע מייל עם קפה חינם ו-20% על התפריט, בתוקף ל-7 ימים." },
      { icon: "spark" as const, title: "מבצעים רק לחברים", body: "מבצעים שעולים לכרטיס ומתחלפים מדי פעם, ומחכים לכם כשאתם פותחים אותו." },
    ],
  },

  /* CONFIRM BEFORE LAUNCH: two live promos read off the café's CoffeeStream
     card on 2026-11-05. They change there without touching this repo, so
     delete this block if the café would rather not name specifics. */
  deals: {
    eyebrow: "רץ עכשיו בכרטיס",
    title: "ככה נראים מבצעים לחברים",
    items: [
      { name: "ארבעה בורקסים", price: "₪36", was: "₪46 בתפריט" },
      { name: "זוג כדורי שוקולד", price: "₪10", was: "עם קוקוס או סוכריות" },
    ],
    note: "המבצעים מתחלפים. מה שמופיע בכרטיס שלכם הוא מה שתקף.",
  },

  status: {
    eyebrow: "כל ניקוב נספר",
    title: "ככל שחוזרים, המעמד עולה",
    tiers: [
      { punches: 0, name: "חבר נאמן" },
      { punches: 31, name: "לקוח מועדף" },
      { punches: 81, name: "לקוח VIP" },
    ],
    unit: "ניקובים",
  },

  qr: {
    title: "במחשב? סרקו עם הטלפון",
    body: "הכרטיס חי בטלפון. סרקו את הקוד ונמשיך שם.",
    alt: "קוד QR שפותח את הכרטיס של קפה הכרם ב-CoffeeStream",
  },

  platform: {
    eyebrow: "מי מפעיל את המועדון",
    title: "קפה הכרם בחר ב-CoffeeStream",
    body:
      "CoffeeStream (קופיסטרים) היא פלטפורמה ישראלית לכרטיסיות ניקובים דיגיטליות של בתי קפה. " +
      "ההרשמה, הכרטיס והפרטים שלכם מנוהלים שם, לפי מדיניות הפרטיות שלה.",
    privacy: "מדיניות הפרטיות של CoffeeStream",
    terms: "תנאי השימוש",
  },

  finalCta: {
    title: "הניקוב הראשון כבר מחכה",
    body: "דקה של הרשמה עכשיו, ובביקור הבא בקפה הכרם אתם כבר בדרך לקפה חינם.",
    button: "להצטרפות בחינם",
  },

  /* Compact version for the home page. */
  band: {
    eyebrow: "מועדון הלקוחות",
    title: "הקפה העשירי עלינו.",
    body:
      "כרטיסיית ניקובים בטלפון, בלי אפליקציה ובלי דמי חבר. ניקוב ראשון במתנה כשמצטרפים, " +
      "וקפה ו-20% על התפריט ליום ההולדת.",
    primary: "להצטרפות בחינם",
    secondary: "איך זה עובד",
    cardTitle: "הכרטיס של קפה הכרם",
    cardLeft: (n: number) => `עוד ${n} ניקובים לקפה חינם`,
    cardReward: "קפה חינם",
    imageAlt: "כרטיסיית ניקובים דיגיטלית לדוגמה של קפה הכרם, 7 ניקובים מתוך 10",
  },
};
