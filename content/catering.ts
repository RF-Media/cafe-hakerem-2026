/**
 * Catering-page content for /catering.
 *
 * "מגשי אירוח" — never "קייטרינג" (entity-consistency rule, §11.3).
 *
 * The form on this page just opens a conversation — it doesn't quote,
 * doesn't book, doesn't charge. Sizes and prices below are quoted to
 * customers, so confirm them against the café's own sheet before launch.
 */

export type CateringOption = {
  id: string;
  title: { he: string };
  serves: string;        // "5–8 איש"
  includes: string[];    // bullet list
  fromPrice?: string;    // "מ-₪320" — optional
  photo?: string;        // /public path
  popular?: boolean;     // shows a "מומלץ!" ribbon
};

export const catering = {
  hero: {
    eyebrow: "מגשי אירוח",
    title: "אתם מארחים. אנחנו נדאג לשולחן.",
    lede:
      "מגשי האירוח של הכרם מתאימים לישיבות במשרד, אירוח בבית, ימי הולדת ואירועים קטנים - " +
      "טריים, יפים ומוכנים להגשה.",
  },

  /* Three trust signals shown under the hero. */
  promises: [
    {
      title: "מוכנים בדיוק לזמן שלכם",
      body: "מתאמים מראש ודואגים שהכול יהיה מוכן בזמן שקבעתם.",
    },
    {
      title: "מתאימים את ההזמנה אליכם",
      body: "בוחרים את המגשים והכמויות לפי סוג האירוח ומספר האורחים.",
    },
    {
      title: "איסוף או משלוח",
      body: "אוספים מקפה הכרם או מתאמים משלוח באזור.",
    },
  ],

  /* Catalogue of trays. Render as a grid on the page. */
  options: [
    {
      id: "burekas-tray",
      title: { he: "מגש בורקס טורקי" },
      // CONFIRM BEFORE LAUNCH: serves count is a plausible placeholder, not
      // sourced from the café's own sheet — same treatment as the 2026-08-03
      // "§9 exception: demo prices" entry. `includes` is the café's own
      // copy (2026-10-20 copywriting doc). No fromPrice (§9 forbids
      // inventing prices; the field is optional and the UI renders without it).
      serves: "10–15 איש",
      includes: [
        "מבחר בורקסים טורקיים במילוי גבינה, תפוחי אדמה או תרד",
        "לצד ביצים, זיתים ורוטב הבית שלנו",
      ],
      photo: "/images/burekas-tray_catering.jpg",
      popular: true,
    },
    {
      id: "breakfast-tray",
      title: { he: "מגש בוקר" },
      serves: "6–8 איש",
      includes: [
        "כריכי בוקר על לחם הבית",
        "בורקסים ומאפים חמים",
        "סלט ירקות קצוץ וממרחים",
        "פירות העונה חתוכים",
      ],
      fromPrice: "מ-₪320",
    },
    {
      id: "sandwich-tray",
      title: { he: "מגש כריכים" },
      serves: "8–10 איש",
      includes: [
        "מגוון כריכים - סלמון, טונה, אבוקדו וגבינות",
        "סלסות וממרחי הבית",
        "ירקות חתוכים ומלפפונים חמוצים",
      ],
      fromPrice: "מ-₪420",
      photo: "/images/sandwich-tray_catering.jpg",
    },
    {
      id: "sweet-tray",
      title: { he: "מגש מתוק" },
      serves: "10–12 איש",
      includes: [
        "מאפים מתוקים, עוגיות וכל מה שכיף להגיש ליד הקפה",
      ],
      fromPrice: "מ-₪280",
      photo: "/images/sweet-tray_catering.jpg",
    },
  ] as CateringOption[],

  /* Lead time, payment, cancellation policy. */
  fineprint: {
    leadTime: "מומלץ להזמין לפחות 48 שעות מראש. להזמנות מעל 20 איש - שבוע מראש.",
    payment: "התשלום מתבצע בעת אישור ההזמנה הסופי, במזומן, באשראי או בהעברה.",
    cancellation: "ביטול ללא עלות עד 24 שעות לפני מועד האיסוף או המשלוח.",
    minimumOrder: "מינימום הזמנה - ₪280.",
  },

  /* Form hint above the inquiry form. */
  formIntro:
    "השאירו כמה פרטים ונחזור אליכם עם הצעה שמתאימה לאירוח שלכם.",
};
