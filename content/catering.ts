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
};

export const catering = {
  hero: {
    eyebrow: "מגשי אירוח",
    title: "מגשי אירוח מקפה הכרם - לכל אירוע",
    lede:
      "מגשי אירוח שמתאימים לישיבת עבודה, ברית, יום הולדת או כנס. " +
      "כל מגש נארז ביום האירוע משחומרי גלם טריים של קפה הכרם.",
  },

  /* Three trust signals shown under the hero. */
  promises: [
    {
      title: "הכנה ביום האירוע",
      body: "כל מגש נארז בבוקר האירוע. הלחם נאפה אצלנו באותו יום והירקות נחתכים טרי.",
    },
    {
      title: "התאמה אישית",
      body: "אפשר להחליף פריטים, להוסיף אפשרויות טבעוניות או ללא גלוטן, ולהתאים כמויות לקבוצה.",
    },
    {
      title: "משלוח באזור",
      body: "משלוחים בגני תקווה והסביבה, בתיאום שעה מראש. איסוף עצמי מרחוב הכרמל 20 ללא עלות.",
    },
  ],

  /* Catalogue of trays. Render as a grid on the page. */
  options: [
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
    },
    {
      id: "sweet-tray",
      title: { he: "מגש מתוק" },
      serves: "10–12 איש",
      includes: [
        "עוגיות ורוגלך של הבית",
        "פרוסות עוגת גבינה ובראוני",
        "פירות יבשים ואגוזים",
      ],
      fromPrice: "מ-₪280",
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
    "ספרו לנו על האירוע ונחזור אליכם בהצעה תוך 24 שעות.",
};
