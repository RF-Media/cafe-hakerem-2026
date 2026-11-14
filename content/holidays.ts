/**
 * Holiday promotions band for the home page.
 *
 * New section requested without any specific holiday copy supplied yet — per
 * CLAUDE.md §9 ("never invent"), no marketing copy was written to fill the
 * gap. `body` is the single [TODO] blocking `check:todos` until the café
 * supplies real holiday content; swap it in and the section is ready.
 */

export const homeHolidays = {
  /** Hidden at the café's request (2026-11-14); true brings the band back. */
  enabled: false,
  eyebrow: "מבצעי חגים",
  title: "משהו מיוחד לחג",
  // [TODO: תוכן למבצעי חגים - טרם נמסר]
  body: "[TODO: תוכן למבצעי חגים - טרם נמסר]",
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
  anchor: "hanukkah",
  image: "/images/sufganiyah.png",
  imageAlt: "סופגנייה עם אבקת סוכר",
  card: {
    title: "חנוכה שמח בקפה הכרם",
    line: "קפה חם וסופגנייה. חג שמח.",
    cta: "לחנוכה בקפה הכרם",
  },
  section: {
    eyebrow: "חג אורים שמח",
    title: "חנוכה בקפה הכרם",
    body: "חג אורים שמח מכל הצוות של קפה הכרם בגני תקווה. קפה חם וסופגנייה. חג שמח.",
  },
};
