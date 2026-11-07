/**
 * The photo grid on the home page.
 *
 * No live Instagram API: the cost (Meta auth, refresh tokens, rate limits)
 * doesn't justify it for a boutique site. Instead, a hand-curated grid from the
 * café's own photos, edited when the café asks. Each tile links to the café's
 * Instagram profile, whose handle lives once in `content/business.ts`.
 */

import type { PlaceholderVariant } from "@/components/ui/placeholders";

export type InstagramPost = {
  /** /public path to the image. */
  src?: string;
  /** Hebrew alt text: describes what's in the photo. */
  alt: string;
  /** Optional link to the post itself. Falls back to the café's profile. */
  href?: string;
  /** Short Hebrew filter label. */
  category: "קפה" | "מאפים" | "ג'חנון" | "בחוץ";
  variant: PlaceholderVariant;
};

export const instagram: InstagramPost[] = [
  { src: "/images/tray-carry_shared.jpg", alt: "מגש עם מאצ'ה קרה וכריך, בידיים של אורחת בשמלה לבנה בקפה הכרם", category: "בחוץ", variant: "tray" },
  { src: "/images/latte-cinnamon_shared.jpg", alt: "קפה בכוס זכוכית עם קצף וקינמון, על שולחן בהיר בקפה הכרם", category: "קפה", variant: "cup" },
  { src: "/images/orange-cake_shared.jpg", alt: "פרוסת עוגת תפוזים עם פרוסות הדר מקורמלות, על נייר אפייה", category: "מאפים", variant: "pastry" },
  { src: "/images/jachnun-plate_jachnun.jpg", alt: "ג'חנון מגולגל על צלחת עם רסק עגבניות, במבט מלמעלה", category: "ג'חנון", variant: "jachnun" },
  { src: "/images/latte-outdoors_shared.jpg", alt: "קפה קר בכוס זכוכית על שולחן שחור בשמש, ולידו צמחייה ירוקה", category: "בחוץ", variant: "cup" },
  { src: "/images/chestnut-tart_shared.jpg", alt: "טארט עם זילוף קרם וקרמל על צלחת לבנה ושיש בהיר", category: "מאפים", variant: "pastry" },
  { src: "/images/matcha-pair_shared.jpg", alt: "מאצ'ה קרה בכוס שקופה וכוס קפה ממותגת של קפה הכרם על שולחן עץ", category: "קפה", variant: "cup" },
  { src: "/images/toast-hands_shared.jpg", alt: "טוסט חתוך לשניים עם מילוי עשיר, מוחזק בשתי ידיים", category: "מאפים", variant: "tray" },
  { src: "/images/jachnun-closeup_shared.jpg", alt: "קרוב על ג'חנון מגולגל, ביצה קשה ורסק עגבניות טרי", category: "ג'חנון", variant: "jachnun" },
  { src: "/images/jachnun-tray_shared.jpg", alt: "מגש ג'חנון על נייר חום עם רסק עגבניות, סחוג וביצים קשות", category: "ג'חנון", variant: "jachnun" },
  { src: "/images/bag-baguette_about.jpg", alt: "באגט בשקית נייר ממותגת של קפה הכרם, בידי אורחת במעיל בז'", category: "בחוץ", variant: "interior" },
  { src: "/images/chocolate-croissant_shared.jpg", alt: "קרואסון שוקולד וכוס קפה ממותגת על נייר חום ושולחן עץ", category: "קפה", variant: "pastry" },
];

/** Filter chips shown above the grid: "הכל" first, then every category present
 *  in `instagram`, in first-seen order. */
export const instagramCategories = [
  "הכל",
  ...Array.from(new Set(instagram.map((post) => post.category))),
];

export const instagramSection = {
  eyebrow: "מהפיד שלנו",
  title: "רגעים אחרונים מקפה הכרם",
  body: "קצת מהאווירה, מהקפה ומהרגעים שביניהם.",
  ctaLabel: "עקבו אחרינו",
  countLabel: (n: number) => `${n} רגעים מהדלפק, מהמטבח ומהשולחנות בחוץ.`,
};
