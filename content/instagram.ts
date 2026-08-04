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
  /** /public path to the image (square, recommended 1080×1080).
   *  Omit until real photography lands — `CafeImage` then renders the
   *  authored line art instead, still carrying the `alt` below. */
  src?: string;
  /** Hebrew alt text — describes what's in the photo. */
  alt: string;
  /** Optional link out to the Instagram post itself. */
  href?: string;
};

/**
 * Six curated posts. No photography has been supplied yet, so `src` is
 * omitted on each and the gallery renders the authored line art from
 * components/ui/placeholders — the same graceful-degradation path
 * `CafeImage` uses everywhere else. Add a `src` per post (square,
 * 1080×1080, under /public/images/instagram/) to swap in real photos;
 * the `alt` text already describes what each frame should show.
 */
export const instagram: InstagramPost[] = [
  { alt: "ארוחת בוקר הכרם על שולחן עץ — ביצים, גבינות, סלט ולחם הבית" },
  { alt: "קפה הפוך בכוס קרמיקה עם ציור חלב על הדלפק" },
  { alt: "מגש בורקסים חמים יוצא מהתנור במטבח של קפה הכרם" },
  { alt: "ג'חנון אפוי עם ביצה קשה, רסק וסחוג בשבת בבוקר" },
  { alt: "שולחנות החוץ של קפה הכרם ברחוב הכרמל בשעת בוקר" },
  { alt: "עוגת גבינה אפויה ופרוסה על צלחת לצד אספרסו" },
];

export const instagramSection = {
  eyebrow: "מהפיד שלנו",
  title: "רגעים אחרונים מקפה הכרם",
  body: "מה שיוצא מהמטבח, מי שיושב בחוץ, מה אופים השבוע.",
  ctaLabel: "עקבו אחרינו",
};
