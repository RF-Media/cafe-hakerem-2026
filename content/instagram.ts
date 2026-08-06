/**
 * Instagram feed for the home page.
 *
 * No live Instagram API — the cost (Meta auth, refresh tokens, rate limits)
 * doesn't justify it for a 6-page boutique site. Instead: a hand-curated
 * grid of recent posts, edited when the café asks. This is a Decision Log
 * entry.
 *
 * Each item is one post the café wants surfaced. The real handle and profile
 * URL live once in `content/business.ts` (`socials.instagram`) — this file
 * never repeats it, per the single-source-of-truth rule in CLAUDE.md §9.
 */

import type { PlaceholderVariant } from "@/components/ui/placeholders";

export type InstagramPost = {
  /** /public path to the image (square, recommended 1080×1080).
   *  Omit until real photography lands — `CafeImage` then renders the
   *  authored line art instead, still carrying the `alt` below. */
  src?: string;
  /** Hebrew alt text — describes what's in the photo. */
  alt: string;
  /** Optional link out to the Instagram post itself. Falls back to the
   *  café's profile (never a dead `#`) when the post isn't linked yet. */
  href?: string;
  /** Short Hebrew filter label — also picks which placeholder line-art
   *  renders until real photography lands, so the grid isn't six identical
   *  icons. */
  category: "בוקר" | "מטבח" | "ג'חנון" | "בחוץ";
  variant: PlaceholderVariant;
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
  {
    alt: "ארוחת בוקר הכרם על שולחן עץ - ביצים, גבינות, סלט ולחם הבית",
    category: "בוקר",
    variant: "tray",
  },
  {
    alt: "קפה הפוך בכוס קרמיקה עם ציור חלב על הדלפק",
    category: "בוקר",
    variant: "cup",
  },
  {
    alt: "מגש בורקסים חמים יוצא מהתנור במטבח של קפה הכרם",
    category: "מטבח",
    variant: "pastry",
  },
  {
    alt: "ג'חנון אפוי עם ביצה קשה, רסק וסחוג בשבת בבוקר",
    category: "ג'חנון",
    variant: "jachnun",
  },
  {
    alt: "שולחנות החוץ של קפה הכרם ברחוב הכרמל בשעת בוקר",
    category: "בחוץ",
    variant: "interior",
  },
  {
    alt: "עוגת גבינה אפויה ופרוסה על צלחת לצד אספרסו",
    category: "מטבח",
    variant: "pastry",
  },
];

/** Filter chips shown above the grid — "הכל" first, then every category
 *  present in `instagram`, in first-seen order. */
export const instagramCategories = [
  "הכל",
  ...Array.from(new Set(instagram.map((post) => post.category))),
];

export const instagramSection = {
  eyebrow: "מהפיד שלנו",
  title: "רגעים אחרונים מקפה הכרם",
  body: "מה שיוצא מהמטבח, מי שיושב בחוץ, מה אופים השבוע.",
  ctaLabel: "עקבו אחרינו",
};
