/**
 * Jachnun-page content for /jachnun.
 *
 * The jachnun page is a sub-brand (terracotta accents) but lives on
 * the main domain per the Decision Log. It targets the high-intent
 * query "ג'חנון להזמנה" and converts via the pre-order form.
 *
 * Pricing, what's included, and pickup windows are all real
 * commitments — every one is [TODO] until confirmed.
 */

export const jachnun = {
  hero: {
    eyebrow: "ג'חנון של שבת",
    title: "ג'חנון להזמנה מראש — איסוף בשבת בבוקר",
    lede:
      "קפה הכרם אופה ג'חנון תימני מסורתי לאיסוף בשבת בבוקר. " +
      "ההזמנה מתבצעת מראש, התשלום באיסוף.",
  },

  /* "Why ours" — 3 short reasons. Each ≤ 12 words. */
  threeReasons: [
    {
      title: "[TODO: כותרת — למשל: 'בצק שנערך ביד']",
      body: "[TODO: משפט אחד שמסביר.]",
    },
    {
      title: "[TODO: כותרת — למשל: 'נאפה לילה שלם בתנור']",
      body: "[TODO: משפט אחד שמסביר.]",
    },
    {
      title: "[TODO: כותרת — למשל: 'מגיע עם רסק וסחוג']",
      body: "[TODO: משפט אחד שמסביר.]",
    },
  ],

  /* What's included in a single jachnun order. */
  whatsIncluded: [
    "[TODO: למשל: ג'חנון אחד]",
    "[TODO: למשל: ביצה קשה]",
    "[TODO: למשל: רסק עגבניות]",
    "[TODO: למשל: סחוג]",
  ],

  /* Pricing — string so "₪35 ליחידה" or "מ-₪35" works. [TODO]. */
  pricing: {
    perUnit: "[TODO: ₪XX ליחידה]",
    bundleNote: "[TODO: לדוגמה: 'מ-4 יחידות — ₪XX ליחידה.' או null]",
  },

  /* Order-form configuration. */
  form: {
    minQuantity: 1,
    maxQuantity: 20,
    quantityHint: "מינימום 1, מקסימום 20 יחידות להזמנה אחת.",

    // Pickup slots are generated dynamically by /lib/jachnun-cutoff.ts.
    // The label below introduces the slot dropdown.
    slotLabel: "בחר/י חלון איסוף",
    slotHint:
      "האיסוף מתבצע בשבת בבוקר. ההזמנות נסגרות בכל יום חמישי בשעה 18:00; " +
      "הזמנות שיתקבלו לאחר מכן יישמרו לשבת הבאה.",

    // Pickup window in 24h "HH:MM" per slot. [TODO: real windows.]
    slotWindows: [
      "[TODO: 08:00–08:30]",
      "[TODO: 08:30–09:00]",
      "[TODO: 09:00–09:30]",
      "[TODO: 09:30–10:00]",
    ],
  },

  /* Closing reassurance block above the FAQ. */
  reassurance: {
    title: "איך זה עובד",
    steps: [
      "ממלאים את טופס ההזמנה כאן באתר.",
      "מקבלים אישור הזמנה במסך (ושומרים את מספר ההזמנה).",
      "מגיעים בשבת בבוקר לרחוב הכרמל 20 בחלון האיסוף שבחרתם.",
      "משלמים במקום (מזומן או אשראי).",
    ],
  },
};
