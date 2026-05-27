/**
 * Instagram feed for the home page.
 *
 * No live Instagram API — the cost (Meta auth, refresh tokens,
 * rate limits) doesn't justify it for a 6-page boutique site.
 * Instead: a hand-curated grid of recent posts, edited when the
 * café asks. This is a Decision Log entry.
 *
 * Each item is one post the café wants surfaced.
 */

export type InstagramPost = {
  /** /public path to the image (square, recommended 1080×1080). */
  src: string;
  /** Hebrew alt text — describes what's in the photo. */
  alt: string;
  /** Optional link out to the Instagram post itself. */
  href?: string;
};

export const instagram: InstagramPost[] = [
  // [TODO: 6 posts, square images saved to /public/images/instagram/
  //  Example shape:
  //  {
  //    src: "/images/instagram/2026-05-01-breakfast.jpg",
  //    alt: "ארוחת בוקר עם שקשוקה, סלט וקפה הפוך",
  //    href: "https://instagram.com/p/XXXXXX",
  //  },
  // ]
];

export const instagramSection = {
  eyebrow: "מהפיד שלנו",
  title: "רגעים אחרונים מקפה הכרם",
  body:
    "מה שיוצא מהמטבח, מי שיושב בחוץ, מה אופים השבוע. עקבו אחרינו באינסטגרם.",
  ctaLabel: "לעמוד באינסטגרם",
};
