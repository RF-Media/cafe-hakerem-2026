/**
 * Single source of truth for Cafe Hakerem's business facts.
 *
 * Everything in this file is FACTUAL — addresses, phone numbers,
 * hours, social handles. If you find yourself wanting to put
 * marketing copy or design choices here, you're in the wrong file.
 *
 * The social handles carry a VERIFY comment: they were filled to a
 * plausible value rather than left as placeholders, and they have
 * real-world consequences if wrong. Confirm before launch.
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
  // Used for: schema.org geo property and the drawn map on /map, which is
  // centred on this pin (re-run scripts/build-map.ts if it moves).
  //
  // Read off the café's Google listing on 2026-11-07. The earlier value was an
  // estimate about 650m off, in a different part of the neighbourhood.
  geo: {
    latitude: 32.0589483,
    longitude: 34.8801555,
  },

  /* ─── Hours ────────────────────────────────────────────────── */
  // Used for: schema.org openingHoursSpecification, visible hours
  // blocks on /contact and /, and FAQ answers. Days are 0=Sunday
  // through 6=Saturday (Israeli week starts Sunday).
  //
  // 24h "HH:MM" strings. A closed day sets both open and close to null.
  hours: [
    { day: 0, label: { he: "ראשון" },  open: "07:00", close: "20:00" },
    { day: 1, label: { he: "שני" },    open: "07:00", close: "20:00" },
    { day: 2, label: { he: "שלישי" },  open: "07:00", close: "20:00" },
    { day: 3, label: { he: "רביעי" },  open: "07:00", close: "20:00" },
    { day: 4, label: { he: "חמישי" },  open: "07:00", close: "20:00" },
    { day: 5, label: { he: "שישי" },   open: "07:00", close: "15:00" },
    { day: 6, label: { he: "שבת" },    open: "08:00", close: "21:00" },
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
  // Instagram is confirmed: it is the handle on the café's CoffeeStream shop,
  // so it is the only profile `sameAs` claims. FACEBOOK IS STILL UNVERIFIED:
  // confirm it before adding it there.
  //
  // Waze and Google Maps search by name and address, which resolves straight to
  // the café's listing. The Google link used to be g.page/cafehakerem, which
  // only landed on a Google search for that word.
  socials: {
    instagram: "https://www.instagram.com/cafehakerem/",
    facebook:  "https://www.facebook.com/cafehakerem",
    google:    "https://www.google.com/maps/search/?api=1&query=%D7%A7%D7%A4%D7%94%20%D7%94%D7%9B%D7%A8%D7%9D%20%D7%94%D7%9B%D7%A8%D7%9E%D7%9C%2020%20%D7%92%D7%A0%D7%99%20%D7%AA%D7%A7%D7%95%D7%95%D7%94",
    waze:      "https://waze.com/ul?q=%D7%A7%D7%A4%D7%94%20%D7%94%D7%9B%D7%A8%D7%9D%20%D7%92%D7%A0%D7%99%20%D7%AA%D7%A7%D7%95%D7%95%D7%94&navigate=yes",
    googleMaps:"https://www.google.com/maps/search/?api=1&query=%D7%A7%D7%A4%D7%94%20%D7%94%D7%9B%D7%A8%D7%9D%20%D7%94%D7%9B%D7%A8%D7%9E%D7%9C%2020%20%D7%92%D7%A0%D7%99%20%D7%AA%D7%A7%D7%95%D7%95%D7%94",
  },

  /* ─── Map embed ────────────────────────────────────────────── */
  // Searches the name and address, so Google shows its own listing.
  mapEmbed:
    "https://www.google.com/maps?q=%D7%A7%D7%A4%D7%94%20%D7%94%D7%9B%D7%A8%D7%9D%20%D7%94%D7%9B%D7%A8%D7%9E%D7%9C%2020%20%D7%92%D7%A0%D7%99%20%D7%AA%D7%A7%D7%95%D7%95%D7%94&hl=he&z=16&output=embed",

  /* ─── Hours footnote ───────────────────────────────────────── */
  // Shown under the hours block on /contact, asterisked.
  hoursFootnote:
    "* מגיעים להופעה או הצגה במרכז הבמה בגני תקווה? אנחנו פתוחים עד לשעת תחילת ההצגה או ההופעה.",

  /* ─── CoffeeStream (the loyalty club) ──────────────────────── */
  // Slug and values read off the public shop page. "hakerem" is a 404 there;
  // "cafehakerem" is the live one.
  coffeestream: {
    businessSlug: "cafehakerem",
    shopBaseUrl: "https://app.coffeestream.co.il",
    privacyUrl: "https://app.coffeestream.co.il/privacy",
    termsUrl: "https://app.coffeestream.co.il/terms-of-service",
    punchesRequired: 10,
    reward: { he: "קפה חינם" },
    startingPunches: 1,
  },

  /* ─── Site URL ─────────────────────────────────────────────── */
  // Canonical absolute origin for the site. Used by sitemap.ts,
  // robots.ts, and absolute URLs in JSON-LD. Read from env in
  // production; fall back to the prod domain.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cafehakerem.co.il",
};

export type Business = typeof business;

/** Direct link to the café's card on CoffeeStream, tagged with where the click
 *  came from. Every link into the club goes through this. */
export const clubJoinUrl = (placement: string): string =>
  `${business.coffeestream.shopBaseUrl}/s/${business.coffeestream.businessSlug}` +
  `?utm_source=cafehakerem-site&utm_medium=website&utm_campaign=${placement}`;
