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
  photoPosition?: string; // object-position for the home page's 16:9 card
  popular?: boolean;     // shows a "מומלץ!" ribbon
};

export const catering = {
  hero: {
    eyebrow: "מגשי אירוח",
    kicker: "מגשי אירוח של קפה הכרם, גני תקווה",
    title: "אתם מארחים. אנחנו נדאג לשולחן.",
    image: "/images/burekas-table_shared.jpg",
    imageAlt: "מגש בורקס תורכי ומטבלים על שולחן בחצר של קפה הכרם, ויד שמתקרבת לקחת",
    cta: "לטופס הפנייה",
    lede:
      "מגשי האירוח של הכרם מתאימים לישיבות במשרד, אירוח בבית, ימי הולדת, אירועים קטנים, " +
      "בר/בת מצווה, שבת חתן, או כל אירוע משמח אחר - טריים, יפים ומוכנים להגשה.",
  },

  /* What people host with these trays. Only the occasions the café's own copy
     names, so nobody orders for something the kitchen never said it does. */
  occasions: {
    eyebrow: "למה מזמינים",
    title: "כל שולחן שצריך למלא",
    items: [
      { title: "ישיבות במשרד", body: "מגש כריכונים במרכז השולחן, וכולם ממשיכים לעבוד.", image: "/images/sandwich-close_catering.jpg", alt: "כריכוני ביס במילוי עגבנייה וחסה, צפופים במגש של קפה הכרם" },
      { title: "אירוח בבית", body: "בורקס חם, מטבלים וזיתים, בלי לעמוד במטבח.", image: "/images/burekas-dish_catering.jpg", alt: "תבנית בורקס תורכי אפוי במבט מלמעלה עם מטבלים וזיתים של קפה הכרם" },
      { title: "ימי הולדת ואירועים קטנים", body: "מגש מתוק ליד הקפה, ואף אחד לא הולך הביתה רעב.", image: "/images/cinnamon-rolls_shared.jpg", alt: "סינבונים עם זילוף לבן ישר מהתנור של קפה הכרם" },
    ],
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
      serves: "10-15 איש",
      includes: [
        "מבחר בורקסים טורקיים במילוי גבינה, תפוחי אדמה או תרד",
        "לצד ביצים, זיתים ורוטב הבית שלנו",
      ],
      photo: "/images/burekas-dips_catering.jpg",
      photoPosition: "50% 12%",
      popular: true,
    },
    {
      id: "sandwich-tray",
      title: { he: "מגש כריכוני ביס" },
      serves: "15 יח' במגש",
      includes: [
        "במגוון סוגים וטעמים",
        "טונה",
        "סלט ביצים",
        "גאודה",
        "קפרזה",
        "אבוקדו ביצה קשה",
      ],
      fromPrice: "החל מ-₪320",
      photo: "/images/sandwich-box_catering.jpg",
    },
    {
      id: "sweet-tray",
      title: { he: "מגש מתוק" },
      serves: "10-12 איש",
      includes: [
        "מאפים מתוקים, עוגיות וכל מה שכיף להגיש ליד הקפה",
      ],
      fromPrice: "מ-₪280",
      photo: "/images/sweet-box_catering.jpg",
    },
  ] as CateringOption[],

  /* Lead time, payment, cancellation policy. */
  fineprint: {
    leadTime: "מומלץ להזמין לפחות 48 שעות מראש. להזמנות מעל 20 איש - שבוע מראש.",
    payment: "התשלום מתבצע בעת אישור ההזמנה הסופי, במזומן, באשראי או בהעברה.",
    // [TODO: לאחד את שתי הגרסאות למדיניות הביטול - "תלוי בגודל ותאריך" ו"שאל
    // את הנציג" - לנוסח סופי אחד]. מוזג זמנית לפי ההצעה בבקשה, עד לאישור רועי.
    // סופרסד את הניסוח הקודם ("ביטול ללא עלות עד 24 שעות לפני מועד האיסוף").
    cancellation: "מדיניות הביטול משתנה בהתאם לגודל ההזמנה ותאריך האירוע - שאלו את הנציג בעת ההזמנה.",
    minimumOrder: "מינימום הזמנה - ₪280.",
  },

  /* Form hint above the inquiry form. */
  formIntro:
    "השאירו כמה פרטים ונחזור אליכם עם הצעה שמתאימה לאירוח שלכם.",
};
