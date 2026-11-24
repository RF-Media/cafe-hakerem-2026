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
    cta: "לבחירת מגשים",
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

  /* The call band straight under the hero: most catering is closed on the phone. */
  call: {
    eyebrow: "הדרך הכי מהירה",
    title: "מעדיפים לסגור את זה בשיחה?",
    body: "ספרו לנו כמה אורחים ומתי, ונבנה איתכם את המגשים בטלפון.",
    callLabel: "חייגו לקפה הכרם",
    whatsapp: "כתבו לנו בוואטסאפ",
    whatsappMessage: "שלום, אשמח לשמוע על מגשי האירוח",
    formLink: "או השאירו פרטים ונחזור אליכם",
  },

  /* The tray catalogue and the card under it that flips into the inquiry. */
  planner: {
    eyebrow: "המגשים",
    title: "בוחרים מגשים, ואנחנו דואגים לשאר",
    description: "סמנו את המגשים שמתאימים לאירוח שלכם, והם יחכו לכם בטופס הפנייה.",
    pick: "להוסיף לפנייה",
    picked: "בפנייה",
    pickAria: (tray: string) => `להוסיף את ${tray} לפנייה`,
    noPrice: "מחיר לפי בקשה",
    popular: "מומלץ",
    front: {
      eyebrow: "לפני שמזמינים",
      title: "כל מה שצריך לדעת",
      rows: { leadTime: "זמן הזמנה מוקדם", payment: "תשלום", cancellation: "ביטולים", minimumOrder: "סכום מינימום" },
      chosenNone: "עוד לא סימנתם מגשים. אפשר גם לבקש המלצה.",
      chosen: (n: number) => (n === 1 ? "מגש אחד מחכה בפנייה:" : `${n} מגשים מחכים בפנייה:`),
      cta: "להשאיר פרטים ולקבל הצעה",
      ctaNote: "שלושה צעדים קצרים, בלי התחייבות.",
    },
    close: "חזרה לפרטים",
  },

  /* Three trust signals, low on the page above the FAQs. */
  promisesHeading: { eyebrow: "איך זה עובד", title: "שלושה דברים שאפשר לסמוך עליהם" },
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
    // Final wording (2026-11-14). The catering FAQ quotes the same sentence; keep them in step.
    cancellation: "מדיניות הביטול משתנה בהתאם לגודל ההזמנה ותאריך האירוע - שאלו את הנציג בעת ההזמנה.",
    minimumOrder: "מינימום הזמנה - ₪280.",
  },

  /* The three-step inquiry card (components/sections/CateringInquiryForm.tsx). */
  inquiry: {
    eyebrow: "טופס פנייה",
    title: "בואו נדבר על האירוח",
    lede: "שלושה צעדים קצרים, בלי התחייבות. נחזור אליכם עם הצעה.",
    steps: [
      { id: "event", short: "מה", title: "מה מגישים?" },
      { id: "when", short: "מתי", title: "מתי ואיך?" },
      { id: "details", short: "פרטים", title: "איך נחזור אליכם?" },
    ],
    progressLabel: "שלבי הפנייה",
    stepOf: (n: number, total: number) => `שלב ${n} מתוך ${total}:`,
    back: "חזרה",
    backTo: (title: string, chosen: string) => `שינוי ${title} (${chosen})`,
    next: { event: "להמשיך למועד", when: "להמשיך לפרטים" },
    submit: "שליחת הפנייה",
    submitting: "שולחים…",
    note: "לא מחייב ולא גובים כלום. נחזור אליכם עם הצעת מחיר.",

    trays: {
      legend: "אילו מגשים מעניינים אתכם?",
      optional: "לא חובה. אפשר לבחור כמה, או שנמליץ.",
      none: "נשמח להמלצה",
    },
    guests: {
      label: "כמה אורחים בערך?",
      unit: "אורחים",
      step: 5,
      min: 5,
      max: 300,
      start: 15,
      decrease: "פחות אורחים",
      increase: "יותר אורחים",
      more: "יותר מ-300? כתבו לנו בהערות בשלב האחרון.",
    },
    when: {
      dateLabel: "תאריך האירוע",
      dateHint: "אם כבר יודעים.",
      dateTooSoon: "התאריך כבר עבר.",
      fulfilmentLegend: "איסוף או משלוח?",
      fulfilmentRequired: "בחרו איסוף או משלוח.",
      options: [
        { id: "pickup", label: "איסוף מהקפה", hint: "מקפה הכרם בגני תקווה" },
        { id: "delivery", label: "משלוח", hint: "באזור, בתיאום מראש" },
      ],
    },
    details: {
      name: { label: "שם מלא", placeholder: "איך קוראים לך?" },
      phone: { label: "טלפון", placeholder: "050-1234567", hint: "נחזור אליך למספר הזה." },
      email: { label: "אימייל (לא חובה)", placeholder: "name@example.com", hint: "נשלח אישור שהפנייה התקבלה." },
      notes: { label: "משהו שכדאי שנדע?", hint: "סוג האירוע, שעה, אלרגיות, העדפות." },
      notesToggle: "+ להוסיף הערות",
    },

    summary: {
      heading: "הפנייה שלכם",
      trays: "מגשים",
      guests: "אורחים",
      date: "תאריך",
      fulfilment: "איך",
      pending: "טרם נבחר",
      recommend: "המלצה מהקפה",
    },
    minimumNote: "מינימום הזמנה ₪280.",

    callPrefix: "אפשר גם להתקשר:",
    generic: "לא הצלחנו לשלוח את הפנייה. נסו שוב.",
    network: "שגיאת רשת. בדקו את החיבור ונסו שוב.",
    turnstilePending: "אימות האבטחה טרם הושלם. רעננו את הדף ונסו שוב.",

    success: {
      title: "תודה! הפנייה אצלנו.",
      referenceLabel: "מספר הפנייה",
      body: "נעבור על הפרטים ונחזור אליכם בטלפון בהקדם עם הצעה.",
      emailed: (email: string) => `אישור נשלח ל-${email}.`,
      questions: "שאלות בינתיים?",
      again: "פנייה חדשה",
    },
  },
};
