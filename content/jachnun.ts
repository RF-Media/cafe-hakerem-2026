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
import { menuCategories } from "@/content/menu";

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

/**
 * Flat per-unit price for the live phase-1 pre-order (see Decision Log,
 * "2.7 — jachnun moves from packages to a flat per-unit price"). This
 * supersedes `jachnunStartingPriceAgorot` for anything the phase-1 form or
 * marketing copy displays. `jachnunPackages` above, and everything in
 * lib/jachnun-pricing.ts, stay untouched — they belong to the gated phase-2
 * checkout, which keeps its own previously-confirmed package pricing until
 * that flow is reconciled and switched back on.
 */
export const jachnunUnitPriceAgorot = 3000;

/** Past this many units, the café quotes a special price rather than N × the flat rate. */
export const jachnunBulkThresholdUnits = 20;

/**
 * Burekas on the pre-order form, read off the menu's own burekas item so the
 * form can never quote a different serving or price than /menu does.
 */
const burekasMenuItem = menuCategories.find((c) => c.id === "burekas")?.items[0];
if (!burekasMenuItem) throw new Error("content/menu.ts has no burekas item for the jachnun pre-order.");
export const burekasServing = {
  name: "בורקס תורכי",
  description: burekasMenuItem.description ?? "",
  priceAgorot: Number(burekasMenuItem.price.replace(/[^\d]/g, "")) * 100,
};

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
    kicker: "ג'חנון של שבת להזמנה, קפה הכרם גני תקווה",
    title: "ג'חנון הכרם",
    lede:
      "בקפה הכרם אנחנו אופים ג'חנון תימני מסורתי לאיסוף בשבת בבוקר. " +
      "מזמינים מראש באתר, אוספים ומשלמים בשבת בבוקר.",
    image: "/images/jachnun-closeup_shared.jpg",
    imageAlt:
      "ג'חנון תימני מגולגל לצד רסק עגבניות טרי, ביצה קשה וסחוג ירוק של קפה הכרם",
  },

  /* "Why ours" — 3 short reasons. Each ≤ 12 words. */
  // [TODO: לאשר עם רועי האם הניסוח "בצד בעבודת יד" מכוון או שגיאת הקלדה ל"בצק"] —
  // do not change the title below from "בצק שנערך ביד" until that's confirmed.
  threeReasons: [
    {
      title: "בצק שנערך ביד",
      body: "לשים ומגלגלים ביום חמישי, יחידה אחר יחידה, בלי מכונה.",
      image: "/images/jachnun-plate_jachnun.jpg",
      imageAlt: "ג'חנון מגולגל על צלחת לבנה ליד רסק עגבניות וזעתר, במבט מלמעלה",
    },
    {
      title: "נאפה לילה שלם",
      body: "נכנס לתנור בליל שבת ואופה לאט עד הבוקר.",
      image: "/images/jachnun-tray_shared.jpg",
      imageAlt: "מגש ג'חנון על נייר חום, עם רסק עגבניות, סחוג וביצים קשות",
    },
    {
      title: "מגיע עם הכל",
      body: "ביצה קשה, רסק עגבניות וסחוג הבית בכל הזמנה.",
      image: "/images/jachnun-closeup_shared.jpg",
      imageAlt: "קרוב על רסק עגבניות טרי, ביצה קשה וג'חנון מגולגל",
    },
  ],

  /* What's included in a single jachnun order. */
  whatsIncluded: [
    "ג'חנון אחד, אפוי לילה שלם",
    "ביצה קשה חומה",
    "רסק עגבניות טרי",
    "סחוג הבית",
  ],

  /* Display strings, derived so they can never contradict the numbers. */
  pricing: {
    perUnit: `${formatILS(jachnunUnitPriceAgorot)} ליחידה`,
    // CONFIRM BEFORE LAUNCH — amount/percentage not supplied yet.
    bulkNote: `מעל ${jachnunBulkThresholdUnits} יח' - מחיר מיוחד. [TODO: לקבוע סכום/אחוז ההנחה מעל 20 יחידות ג'חנון]`,
  },

  /* Phase-1 one-step pre-order on /jachnun (the five-step checkout at
     /jachnun/order is phase 2 — see CHECKOUT_ENABLED). Flat per-unit price,
     paid over the phone once a rep calls to confirm (see Decision Log). */
  preorder: {
    eyebrow: "הזמנה מראש",
    title: "להזמין לשבת",
    lede: "ג'חנון, ואם בא לכם גם בורקס. בוחרים, קובעים שעה ואוספים חם בשבת בבוקר.",

    steps: [
      { id: "items", short: "מה", title: "מה מזמינים?" },
      { id: "pickup", short: "מתי", title: "מתי לאסוף?" },
      { id: "details", short: "פרטים", title: "למי ההזמנה?" },
    ],
    progressLabel: "שלבי ההזמנה",
    stepOf: (n: number, total: number) => `שלב ${n} מתוך ${total}:`,
    back: "חזרה",
    backTo: (title: string, chosen: string) => `שינוי ${title} (${chosen})`,

    items: {
      jachnun: {
        name: "ג'חנון",
        short: "ג'חנון",
        detail: "עם ביצה קשה, רסק וסחוג",
        unit: "ליחידה",
        image: "/images/jachnun-plate_jachnun.jpg",
      },
      burekas: {
        name: burekasServing.name,
        short: "בורקס",
        detail: burekasServing.description,
        unit: "למנה",
        image: "/images/burekas-golden_shared.jpg",
      },
      increase: (name: string) => `להוסיף ${name}`,
      decrease: (name: string) => `להוריד ${name}`,
      count: (name: string, n: number) => `${name}: ${n}`,
      empty: "בחרו לפחות פריט אחד.",
      bulkNote: `מעל ${jachnunBulkThresholdUnits} יח' ג'חנון - מחיר מיוחד. נציג שלנו ייצור קשר.`,
    },
    /** One line naming the whole order, for the summary bar, the emails and the PDF. */
    orderTitle: (jachnunQty: number, burekasQty: number) => {
      const burekas = burekasQty
        ? `${burekasServing.name} × ${burekasQty} ${burekasQty === 1 ? "מנה" : "מנות"}`
        : "";
      const jach = jachnunQty ? (jachnunQty === 1 && !burekas ? "ג'חנון" : `ג'חנון × ${jachnunQty}`) : "";
      return [jach, burekas].filter(Boolean).join(" + ");
    },

    pickup: {
      where: "רחוב הכרמל 20",
      loading: "טוען חלונות איסוף…",
      required: "בחרו חלון איסוף.",
      cutoffNote: "ההזמנות לשבת הקרובה נסגרות ביום שישי ב-16:00. אחר כך - לשבת הבאה.",
    },
    details: {
      name: { label: "שם מלא", placeholder: "ישראל ישראלי" },
      phone: { label: "טלפון נייד", placeholder: "050-1234567", hint: "נציג יתקשר למספר הזה לאישור ההזמנה." },
      email: { label: "אימייל (אופציונלי)", placeholder: "you@example.com", hint: "נשלח אליך אישור הזמנה עם כל הפרטים." },
      notesToggle: "+ בקשה מיוחדת, אלרגיה או תוספת",
      notes: {
        label: "בקשות מיוחדות (אופציונלי)",
        hint: "תוספות, אלרגיות, אריזה נפרדת - כל דבר שכדאי שנדע.",
      },
    },

    summary: {
      heading: "ההזמנה שלך",
      empty: "עוד לא נבחר כלום",
      pickup: "איסוף",
      pickupPending: "בשלב הבא",
    },
    next: {
      items: "המשך לבחירת שעה",
      pickup: "המשך לפרטים",
    },

    total: "סכום משוער",
    submit: "שליחת ההזמנה",
    submitting: "שולח…",
    payNote: "אין תשלום באתר. נציג יתקשר לאשר ולסגור תשלום.",
    network: "אין חיבור לרשת. ההזמנה לא נשלחה - בדקו את החיבור ונסו שוב.",
    generic: "משהו השתבש וההזמנה לא נשלחה.",
    callPrefix: "אפשר גם להזמין בטלפון:",

    success: {
      title: "ההזמנה התקבלה!",
      referenceLabel: "מספר הזמנה",
      referenceHint: "שמרו את המספר - נשתמש בו באיסוף.",
      confirmationNote: "קבלת מספר ההזמנה אינה מהווה אישור סופי - נציג שלנו יצור קשר לאישור ההזמנה ולסגירת התשלום.",
      pickup: "איסוף",
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
    title: "מהזמנה ועד לשולחן, בחמישה צעדים",
    steps: [
      { title: "בוחרים כמות ושעה", body: "ג'חנון, ואם רוצים גם בורקס, בטופס כאן באתר." },
      { title: "משאירים שם וטלפון", body: "ההזמנה נשלחת ישירות לקפה." },
      {
        title: "מקבלים מספר הזמנה",
        body: "במסך - כדאי לשמור אותו לאיסוף.",
      },
      {
        title: "נציג מתקשר ומאשר",
        body: "מאמת את ההזמנה וגובה את התשלום בטלפון.",
      },
      {
        title: "מגיעים בשבת בבוקר",
        body: "לרחוב הכרמל 20, ואוספים את הג'חנון.",
      },
    ],
  },
};
