/**
 * Holiday promotions band for the home page.
 *
 * Hidden by default (`enabled: false`); the café supplies copy and flips the
 * flag when a holiday promotion is live.
 */

export const homeHolidays = {
  /** Hidden at the café's request (2026-11-14); true brings the band back. */
  enabled: false,
  eyebrow: "מבצעי חגים",
  title: "משהו מיוחד לחג",
  body: "",
};

/**
 * Temporary Hanukkah campaign. `enabled` is the one switch: true shows the
 * card beside "מה בא לכם היום?" (below the hero on phones) and adds the
 * Hanukkah section above the `homeHolidays` band; false removes the card and the section.
 *
 * No approved Hanukkah offers exist in the project (content/offers.ts has none,
 * and the café hasn't supplied holiday promotions), so per the brief the button
 * reads "לחנוכה בקפה הכרם" rather than "למבצעי חנוכה", and the section is a
 * greeting, not a list of deals.
 */
export const hanukkahCampaign = {
  enabled: true,
  /** Section hidden for now (2026-11-18); the card stays and says "בקרוב" instead of linking. */
  sectionEnabled: false,
  /** The sufganiyot page (content/hanukkah.ts). While true, the card links to it. */
  pageEnabled: true,
  page: "/hanukkah",
  anchor: "hanukkah",
  image: "/images/sufganiyah.png",
  imageAlt: "סופגנייה עם אבקת סוכר",
  card: {
    title: "חנוכה שמח בקפה הכרם",
    line: "15 טעמי סופגניות ומארזים להזמנה מראש.",
    cta: "לסופגניות חנוכה",
    soon: "בקרוב",
  },
  section: {
    eyebrow: "חג אורים שמח",
    title: "חנוכה בקפה הכרם",
    body: "חג אורים שמח מכל הצוות של קפה הכרם בגני תקווה. קפה חם וסופגנייה. חג שמח.",
  },
};
