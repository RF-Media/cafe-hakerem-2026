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
   CONFIRM BEFORE LAUNCH — every number below is a real commitment.

   These are integer agorot, never shekel floats (see lib/money.ts).
   The display strings further down are derived from them, so the hero
   pill, the FAQ and the checkout total cannot drift apart.

   CLAUDE.md §9 says never invent prices. These were set as demo values
   so the ordering flow could be built and reviewed end to end; the café
   confirms or replaces the four numbers before launch. Logged in the
   Decision Log (2026-08-03).
   ──────────────────────────────────────────────────────────────── */

const UNIT_AGOROT = 3800;
const BUNDLE_UNIT_AGOROT = 3400;
const BUNDLE_THRESHOLD = 4;

export const jachnunPricing = {
  /** Price of one jachnun below the bundle threshold. */
  unitAgorot: UNIT_AGOROT,
  /** Price per jachnun once the order reaches `bundleThreshold` units. */
  bundleUnitAgorot: BUNDLE_UNIT_AGOROT,
  /** Units required for the bundle price. Applies to the whole order. */
  bundleThreshold: BUNDLE_THRESHOLD,

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
    title: "ג'חנון להזמנה מראש — איסוף בשבת בבוקר",
    lede:
      "קפה הכרם אופה ג'חנון תימני מסורתי לאיסוף בשבת בבוקר. " +
      "ההזמנה והתשלום מתבצעים מראש באתר, האיסוף בשבת בבוקר.",
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
    perUnit: `${formatILS(UNIT_AGOROT)} ליחידה`,
    bundleNote: `מ-${BUNDLE_THRESHOLD} יחידות — ${formatILS(BUNDLE_UNIT_AGOROT)} ליחידה.`,
  },

  /* Order-flow configuration. */
  form: {
    minQuantity: 1,
    maxQuantity: 20,
    quantityHint: "מינימום 1, מקסימום 20 יחידות להזמנה אחת.",

    // Pickup slots are generated dynamically by /lib/jachnun-cutoff.ts.
    // The label below introduces the slot picker.
    slotLabel: "בחר/י חלון איסוף",
    slotHint:
      "האיסוף מתבצע בשבת בבוקר. ההזמנות נסגרות בכל יום חמישי בשעה 18:00; " +
      "הזמנות שיתקבלו לאחר מכן יישמרו לשבת הבאה.",
  },

  /* Closing reassurance block above the FAQ. */
  reassurance: {
    title: "איך זה עובד",
    steps: [
      "בוחרים כמות ותוספות בטופס ההזמנה כאן באתר.",
      "משלמים באתר — אשראי, Apple Pay, Google Pay, ביט או מזומן באיסוף.",
      "מקבלים אישור הזמנה במסך (ושומרים את מספר ההזמנה).",
      "מגיעים בשבת בבוקר לרחוב הכרמל 20 בחלון האיסוף שבחרתם.",
    ],
  },

  /* CTA into the multi-step ordering flow at /jachnun/order. */
  cta: {
    label: "התחיל/י הזמנה",
    supporting: "הזמנה מאובטחת · פחות מדקה · ביטול עד יום חמישי 18:00",
  },
};
