/**
 * Jachnun-page content for /jachnun.
 *
 * The jachnun page is a sub-brand (terracotta accents) but lives on
 * the main domain per the Decision Log. It targets the high-intent
 * query "ג'חנון להזמנה" and converts via the pre-order flow.
 *
 * Pricing, what's included, and pickup windows are real commitments the
 * café has to honour at the counter — confirm them against the board
 * before launch if anything has changed.
 */

import { formatILS } from "@/lib/money";

/* ────────────────────────────────────────────────────────────────
   Real pricing, confirmed by the café (2026-08-05) — supersedes the
   2026-08-03 demo unit/bundle-threshold model. Jachnun is sold as four
   fixed-size packages, not a continuous quantity, because that is how
   the kitchen actually bakes and prices it: each size is its own line
   on the board, not "N × a per-unit price".

   These are integer agorot, never shekel floats (see lib/money.ts).
   ──────────────────────────────────────────────────────────────── */

export const PACKAGE_IDS = ["solo", "duo", "quintet", "deca"] as const;
export type PackageId = (typeof PACKAGE_IDS)[number];

export type JachnunPackage = {
  id: PackageId;
  /** Card title, e.g. "ג'חנון לזוג". */
  title: string;
  /** One-line description of what's in the package. */
  description: string;
  /** Number of jachnun units in the package — drives add-on caps and included-item counts. */
  units: number;
  totalAgorot: number;
  /** Shows the "פופולרי" badge on the package card. */
  popular: boolean;
};

/**
 * `units` must stay unique across packages — receipts for orders already
 * placed are reconstructed from the stored unit count alone (see
 * `packageForUnits` in lib/jachnun-pricing.ts), not from a separate stored
 * package id. Two packages sharing a unit count would make that lookup
 * ambiguous.
 */
export const jachnunPackages: JachnunPackage[] = [
  {
    id: "solo",
    title: "ג'חנון",
    description: "ג'חנון עבודת יד. עם ביצה קשה, רסק וסחוג חריף.",
    units: 1,
    totalAgorot: 3500,
    popular: true,
  },
  {
    id: "duo",
    title: "ג'חנון לזוג",
    description: "2 ג'חנונים, עבודת יד. עם ביצים, רסק וחריף.",
    units: 2,
    totalAgorot: 6700,
    popular: true,
  },
  {
    id: "quintet",
    title: "ג'חנון לחמישה",
    description: "חמישה ג'חנונים, עבודת יד. עם ביצים, רסק וחריף.",
    units: 5,
    totalAgorot: 17000,
    popular: true,
  },
  {
    id: "deca",
    title: "10 ג'חנון קומפלט",
    description: "10 יחידות ג'חנון עם ביצים, רסק וסחוג.",
    units: 10,
    totalAgorot: 33900,
    popular: false,
  },
];

/** The single-unit package is the reference price for "you saved ₪X" on the bigger ones. */
export const jachnunStartingPriceAgorot = jachnunPackages[0].totalAgorot;

export const jachnunPricing = {
  /**
   * Add-ons. Every jachnun unit ships with `includedPerUnit` of each at no
   * charge — that is the "מגיע עם הכל" promise on the page, and charging
   * for it at checkout would be exactly the kind of surprise line item that
   * loses the order. Anything beyond that is priced.
   */
  addons: {
    tomato: {
      key: "tomato",
      label: "רסק עגבניות",
      description: "רסק טרי של הבית, מנה אישית.",
      includedPerUnit: 1,
      extraAgorot: 600,
    },
    olives: {
      key: "olives",
      label: "זיתים בקופסה",
      description: "זיתים מתובלים, קופסה קטנה.",
      includedPerUnit: 1,
      extraAgorot: 800,
    },
    // Not included by default — every unit already ships with one free
    // hard-boiled egg (see `whatsIncluded` below), so this is worded
    // "another one" rather than implying the free one is being sold.
    egg: {
      key: "egg",
      label: "ביצה קשה נוספת",
      description: "ביצה קשה נוספת, לצד זו שכבר כלולה בכל מנה.",
      includedPerUnit: 0,
      extraAgorot: 400, // CONFIRM BEFORE LAUNCH — demo value, same convention as tomato/olives above
    },
  },

  /**
   * Cap on paid extras, per jachnun unit, per add-on. Without it the kiosk
   * stepper happily reaches 400 boxes of olives and the café finds out on
   * Saturday morning.
   */
  maxExtraPerUnit: 3,
} as const;

export type AddonKey = keyof typeof jachnunPricing.addons;

export const jachnun = {
  hero: {
    eyebrow: "ג'חנון של שבת",
    title: "ג'חנון הכרם",
    lede:
      "בקפה הכרם אנחנו אופים ג'חנון תימני מסורתי לאיסוף בשבת בבוקר. " +
      "מזמינים מראש באתר, אוספים ומשלמים בשבת בבוקר.",
    image: "/images/jachnun-band.jpg",
    imageAlt:
      "מגש ג'חנון תימני עם ביצה קשה, רסק עגבניות, סחוג, זיתים ומלפפונים חמוצים",
  },

  /* "Why ours" — 3 short reasons. Each ≤ 12 words. */
  threeReasons: [
    {
      title: "בצק שנערך ביד",
      body: "לשים ומגלגלים ביום חמישי, יחידה אחר יחידה, בלי מכונה.",
    },
    {
      title: "נאפה לילה שלם",
      body: "נכנס לתנור בליל שבת ואופה לאט עד הבוקר.",
    },
    {
      title: "מגיע עם הכל",
      body: "ביצה קשה, רסק עגבניות וסחוג של הבית בכל הזמנה.",
    },
  ],

  /* What's included in a single jachnun order. */
  whatsIncluded: [
    "ג'חנון אחד, אפוי לילה שלם",
    "ביצה קשה חומה",
    "רסק עגבניות טרי",
    "סחוג ירוק של הבית",
  ],

  /* Display strings, derived so they can never contradict the numbers. */
  pricing: {
    perUnit: `${formatILS(jachnunStartingPriceAgorot)} ליחידה`,
    bundleNote: "אפשר גם בחבילה: זוג, חמישייה או עשרה - משתלם יותר ליחידה.",
  },

  /* Phase-1 one-step pre-order on /jachnun (the five-step checkout at
     /jachnun/order is phase 2 — see CHECKOUT_ENABLED). Pay at pickup. */
  preorder: {
    eyebrow: "הזמנה מראש",
    title: "להזמין ג'חנון לשבת",
    lede: "בוחרים חבילה וחלון איסוף, משאירים שם וטלפון - ואוספים חם בשבת בבוקר.",
    reassurance: "רוצים להיות בטוחים שיש? מומלץ להזמין מראש.",
    perUnit: "ליחידה",

    packages: { legend: "כמה ג'חנון?", required: "בחרו חבילה." },
    pickup: {
      legend: "מתי לאסוף?",
      where: "רחוב הכרמל 20",
      loading: "טוען חלונות איסוף…",
      required: "בחרו חלון איסוף.",
      cutoffNote: "ההזמנות לשבת הקרובה נסגרות ביום חמישי ב-18:00. אחר כך - לשבת הבאה.",
    },
    details: {
      legend: "הפרטים שלכם",
      name: { label: "שם מלא", placeholder: "ישראל ישראלי" },
      phone: { label: "טלפון נייד", placeholder: "050-1234567", hint: "לזיהוי באיסוף ולעדכונים על ההזמנה בלבד." },
      email: { label: "אימייל (אופציונלי)", placeholder: "you@example.com" },
      notes: {
        label: "בקשות מיוחדות (אופציונלי)",
        hint: "תוספות, אלרגיות, אריזה נפרדת - כל דבר שכדאי שנדע.",
      },
    },

    total: "לתשלום באיסוף",
    totalEmpty: "בחרו חבילה",
    submit: "שליחת ההזמנה",
    submitting: "שולח…",
    payNote: "אין תשלום באתר - משלמים בקפה, באיסוף.",
    network: "אין חיבור לרשת. ההזמנה לא נשלחה - בדקו את החיבור ונסו שוב.",
    generic: "משהו השתבש וההזמנה לא נשלחה.",
    callPrefix: "אפשר גם להזמין בטלפון:",

    success: {
      title: "ההזמנה התקבלה!",
      referenceLabel: "מספר הזמנה",
      referenceHint: "שמרו את המספר - נשתמש בו באיסוף.",
      pickup: "איסוף",
      package: "חבילה",
      questions: "שאלות על ההזמנה?",
      again: "הזמנה נוספת",
    },
  },

  /* Standalone "how it works" walkthrough — its own section on the page,
     not folded into the order card (see Decision Log 2026-08-05). Each
     step keeps the original sentence, split into a short title (the scan
     line) and a supporting clause (the detail), rather than inventing
     new copy. */
  reassurance: {
    eyebrow: "איך זה עובד",
    title: "מהזמנה ועד לשולחן, בארבעה צעדים",
    steps: [
      { title: "בוחרים חבילה ושעה", body: "בטופס ההזמנה כאן באתר." },
      { title: "משאירים שם וטלפון", body: "ההזמנה נשלחת ישירות לקפה." },
      {
        title: "מקבלים מספר הזמנה",
        body: "במסך - כדאי לשמור אותו לאיסוף.",
      },
      {
        title: "מגיעים בשבת בבוקר",
        body: "לרחוב הכרמל 20, ומשלמים באיסוף.",
      },
    ],
  },
};
