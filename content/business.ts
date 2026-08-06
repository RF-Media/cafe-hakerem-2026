/**
 * Single source of truth for Cafe Hakerem's business facts.
 *
 * Everything in this file is FACTUAL — addresses, phone numbers,
 * hours, social handles. If you find yourself wanting to put
 * marketing copy or design choices here, you're in the wrong file.
 *
 * Two blocks carry a VERIFY comment — geo coordinates and social
 * handles. Both were filled to a plausible value rather than left as
 * placeholders, but neither was read off the café's own records, and
 * both have real-world consequences if wrong. Confirm before launch.
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
    // Public-facing email, shown on /contact.
    public: "hello@cafehakerem.co.il",

    // Internal: where order notifications and catering inquiries go.
    // This is NOT shown publicly. Set via env var in production:
    // process.env.CAFE_NOTIFICATION_EMAIL
    notifications: process.env.CAFE_NOTIFICATION_EMAIL ?? "orders@cafehakerem.co.il",
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
    postalCode: "5591000",
  },

  /* ─── Geo coordinates ──────────────────────────────────────── */
  // Used for: schema.org geo property, Google Maps embed, Waze link.
  //
  // VERIFY BEFORE LAUNCH. These are approximate coordinates for
  // הכרמל 20, גבעת סביון, גני תקווה — close enough to place the map on
  // the right street, but not read off the café's own pin. A wrong
  // lat/lng here routes Waze to a neighbour's driveway, so confirm it:
  // open Google Maps, right-click the café's pin, copy the pair that
  // appears at the top, and replace BOTH numbers.
  geo: {
    latitude: 32.0619,
    longitude: 34.8742,
  },

  /* ─── Hours ────────────────────────────────────────────────── */
  // Used for: schema.org openingHoursSpecification, visible hours
  // blocks on /contact and /, and FAQ answers. Days are 0=Sunday
  // through 6=Saturday (Israeli week starts Sunday).
  //
  // 24h "HH:MM" strings. A closed day sets both open and close to null.
  hours: [
    { day: 0, label: { he: "ראשון" },  open: "07:00", close: "19:00" },
    { day: 1, label: { he: "שני" },    open: "07:00", close: "19:00" },
    { day: 2, label: { he: "שלישי" },  open: "07:00", close: "19:00" },
    { day: 3, label: { he: "רביעי" },  open: "07:00", close: "19:00" },
    { day: 4, label: { he: "חמישי" },  open: "07:00", close: "19:00" },
    { day: 5, label: { he: "שישי" },   open: "07:00", close: "15:00" },
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
  //
  // VERIFY BEFORE LAUNCH. These follow the café's name but were not read
  // off the café's own profiles. An unconfirmed handle can point at an
  // unrelated account — and `sameAs` in the JSON-LD is the strongest
  // identity signal the site emits, so a wrong one actively misidentifies
  // the business. Confirm each, and delete any profile that doesn't exist
  // rather than leaving a guess in place.
  socials: {
    instagram: "https://www.instagram.com/cafehakerem/",
    facebook:  "https://facebook.com/cafehakerem",
    google:    "https://g.page/cafehakerem",
    waze:      "https://waze.com/ul?ll=32.0619,34.8742&navigate=yes",
    googleMaps:"https://maps.google.com/?q=32.0619,34.8742",
  },

  /* ─── Site URL ─────────────────────────────────────────────── */
  // Canonical absolute origin for the site. Used by sitemap.ts,
  // robots.ts, and absolute URLs in JSON-LD. Read from env in
  // production; fall back to the prod domain.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cafehakerem.co.il",
};

export type Business = typeof business;