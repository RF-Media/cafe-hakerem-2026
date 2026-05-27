/**
 * Catering-page content for /catering.
 *
 * "מגשי אירוח" — never "קייטרינג" (entity-consistency rule, §11.3).
 *
 * Options listed are scaffolding only; sizes, contents and prices
 * are [TODO]. The form on this page just opens a conversation —
 * it doesn't quote, doesn't book, doesn't charge.
 */

export type CateringOption = {
  id: string;
  title: { he: string };
  serves: string;        // "5–8 איש"
  includes: string[];    // bullet list
  fromPrice?: string;    // "מ-₪XXX" — optional, [TODO]
  photo?: string;        // /public path
};

export const catering = {
  hero: {
    eyebrow: "מגשי אירוח",
    title: "מגשי אירוח מקפה הכרם — לכל אירוע",
    lede:
      "מגשי אירוח שמתאימים לישיבת עבודה, ברית, יום הולדת או כנס. " +
      "כל מגש נארז ביום האירוע משחומרי גלם טריים של קפה הכרם.",
  },

  /* Three trust signals shown under the hero. */
  promises: [
    {
      title: "[TODO: למשל: 'הכנה ביום האירוע']",
      body: "[TODO: 1–2 משפטים שמסבירים מה זה אומר.]",
    },
    {
      title: "[TODO: למשל: 'התאמה אישית']",
      body: "[TODO: 1–2 משפטים שמסבירים את אפשרויות ההתאמה.]",
    },
    {
      title: "[TODO: למשל: 'משלוח באזור']",
      body: "[TODO: 1–2 משפטים על משלוחים — אזור, עלות, זמני הגעה.]",
    },
  ],

  /* Catalogue of trays. Render as a grid on the page. */
  options: [
    {
      id: "breakfast-tray",
      title: { he: "מגש בוקר" },
      serves: "[TODO: לדוגמה: '6–8 איש']",
      includes: [
        "[TODO: כריכי בוקר]",
        "[TODO: מאפים]",
        "[TODO: סלטים קטנים]",
        "[TODO: פירות העונה]",
      ],
      fromPrice: "[TODO: מ-₪XXX]",
    },
    {
      id: "sandwich-tray",
      title: { he: "מגש כריכים" },
      serves: "[TODO: לדוגמה: '8–10 איש']",
      includes: [
        "[TODO: מגוון כריכים]",
        "[TODO: סלסות]",
        "[TODO: ירקות חתוכים]",
      ],
      fromPrice: "[TODO: מ-₪XXX]",
    },
    {
      id: "sweet-tray",
      title: { he: "מגש מתוק" },
      serves: "[TODO: לדוגמה: '10–12 איש']",
      includes: [
        "[TODO: עוגיות הבית]",
        "[TODO: מיני-קישים מתוקים]",
        "[TODO: פירות יבשים ואגוזים]",
      ],
      fromPrice: "[TODO: מ-₪XXX]",
    },
  ] as CateringOption[],

  /* Lead time, payment, cancellation policy. */
  fineprint: {
    leadTime: "[TODO: למשל: 'מומלץ להזמין לפחות 48 שעות מראש.']",
    payment: "[TODO: למשל: 'התשלום מתבצע בעת אישור ההזמנה הסופי.']",
    cancellation: "[TODO: מדיניות ביטולים, אם יש.]",
    minimumOrder: "[TODO: סכום מינימום להזמנה, אם יש.]",
  },

  /* Form hint above the inquiry form. */
  formIntro:
    "ספרו לנו על האירוע ונחזור אליכם בהצעה תוך [TODO: 24 שעות].",
};
