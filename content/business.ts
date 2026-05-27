/**
 * Single source of truth for Cafe Hakerem's business facts.
 *
 * Everything in this file is FACTUAL — addresses, phone numbers,
 * hours, social handles. If you find yourself wanting to put
 * marketing copy or design choices here, you're in the wrong file.
 *
 * Items marked [TODO] must be filled in with real values from the
 * café before deploying to production. The build will fail if any
 * [TODO] remains (see /scripts/check-todos.ts).
 *
 * If a fact changes (new hours, new phone), change it HERE and
 * nowhere else. Every component imports from this file.
 */

export const business = {
  /* ─── Identity ─────────────────────────────────────────────── */

  name: {
    he: "קפה הכרם",
    en: "Cafe Hakerem", // Used only in Latin contexts (URLs, schema)
  },

  tagline: {
    he: "בית קפה בוטיקי ואינטימי בלב גני תקווה",
  },

  /* ─── Contact ──────────────────────────────────────────────── */

  phone: {
    display: "053-557-4194",     // How it appears to readers
    tel: "+972535574194",        // Used in tel: links — E.164 format
  },

  whatsapp: {
    // Israeli WhatsApp format: country code + number, no + or dashes
    number: "972535574194",
    // What text is pre-filled when the user taps the WhatsApp button:
    prefilledMessage: "שלום, פנייה דרך האתר",
  },

  email: {
    // Public-facing email. [TODO: confirm — the existing site does
    // not display an email address. Ask the café if they want one
    // shown, or leave WhatsApp + phone only.]
    public: "[TODO: public email or null]",

    // Internal: where order notifications and catering inquiries go.
    // This is NOT shown publicly. Set via env var in production:
    // process.env.CAFE_NOTIFICATION_EMAIL
    notifications: process.env.CAFE_NOTIFICATION_EMAIL ?? "[TODO: notifications email]",
  },

  /* ─── Location ─────────────────────────────────────────────── */

  address: {
    street: {
      he: "הכרמל 20",
      en: "HaCarmel 20",
    },
    neighborhood: {
      he: "גבעת סביון",
      en: "Givat Savyon",
    },
    city: {
      he: "גני תקווה",
      en: "Ganei Tikva",
    },
    country: {
      he: "ישראל",
      en: "IL", // ISO code for schema
    },
    // [TODO: postal code, if the café uses one in mail.]
    postalCode: "[TODO: postal code or null]",
  },

  /* ─── Geo coordinates ──────────────────────────────────────── */
  // Used for: schema.org geo property, Google Maps embed, Waze link.
  // [TODO: get exact lat/lng. Way to get this: open Google Maps,
  // right-click the café's pin, copy the coordinates that appear
  // at the top. Replace BOTH numbers below.]
  geo: {
    latitude: 0.0,  // [TODO: real latitude, e.g. 32.0628]
    longitude: 0.0, // [TODO: real longitude, e.g. 34.8693]
  },

  /* ─── Hours ────────────────────────────────────────────────── */
  // Used for: schema.org openingHoursSpecification, visible hours
  // blocks on /contact and /, and FAQ answers. Days are 0=Sunday
  // through 6=Saturday (Israeli week starts Sunday).
  //
  // [TODO: replace every "[TODO …]" below with the café's real
  // hours. Use 24h "HH:MM" strings. If the café is closed on a
  // given day, set both open and close to null.]
  hours: [
    { day: 0, label: { he: "ראשון" },  open: "[TODO: HH:MM]", close: "[TODO: HH:MM]" },
    { day: 1, label: { he: "שני" },    open: "[TODO: HH:MM]", close: "[TODO: HH:MM]" },
    { day: 2, label: { he: "שלישי" },  open: "[TODO: HH:MM]", close: "[TODO: HH:MM]" },
    { day: 3, label: { he: "רביעי" },  open: "[TODO: HH:MM]", close: "[TODO: HH:MM]" },
    { day: 4, label: { he: "חמישי" },  open: "[TODO: HH:MM]", close: "[TODO: HH:MM]" },
    { day: 5, label: { he: "שישי" },   open: "[TODO: HH:MM]", close: "[TODO: HH:MM]" },
    { day: 6, label: { he: "שבת" },    open: null, close: null }, // jachnun pickup only
  ],

  /* ─── Pricing band ─────────────────────────────────────────── */
  // schema.org priceRange — a string of "₪" symbols (1–4).
  // Boutique neighborhood café typically maps to "₪₪".
  priceRange: "₪₪",

  /* ─── Cuisine (schema servesCuisine) ───────────────────────── */
  servesCuisine: ["Café", "Israeli", "Yemenite"],

  /* ─── Social handles ───────────────────────────────────────── */
  // Used for schema sameAs and footer/contact links. Full URLs.
  // [TODO: confirm actual handles with the café. Remove any that
  // don't exist; do not invent.]
  socials: {
    instagram: "[TODO: https://instagram.com/<handle>]",
    facebook:  "[TODO: https://facebook.com/<handle> or null]",
    google:    "[TODO: Google Business profile URL]",
    waze:      "[TODO: Waze permalink, e.g. https://waze.com/ul?ll=…]",
    googleMaps:"[TODO: Google Maps share link]",
  },

  /* ─── Site URL ─────────────────────────────────────────────── */
  // Canonical absolute origin for the site. Used by sitemap.ts,
  // robots.ts, and absolute URLs in JSON-LD. Read from env in
  // production; fall back to the prod domain.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cafehakerem.co.il",
};

export type Business = typeof business;