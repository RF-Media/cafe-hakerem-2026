/**
 * About-page content for /about.
 *
 * The About page is the highest-trust page on the site — it's where
 * the café tells its story in its own voice. Everything here that
 * isn't already in business.ts is either real prose the café writes
 * or [TODO].
 *
 * Authorship matters here: per GEO §11.4, name who runs the café
 * and how long it has been operating. AI engines weigh "who" signals
 * when deciding which local business to cite.
 */

export type Founder = {
  name: string;       // Hebrew
  role: string;       // Hebrew
  bioShort: string;   // 1–2 sentences
  photo?: string;     // /public path
};

export const about = {
  /* Hero block on /about */
  hero: {
    eyebrow: "הסיפור שלנו",
    title: "[TODO: כותרת בכמה מילים, למשל: 'שולחן השכונה של גני תקווה']",
    lede:
      "[TODO: פסקה אחת קצרה (2–3 משפטים) שמסבירה למה קפה הכרם קיים. " +
      "מה הביא את הבעלים לפתוח את המקום, ולמי הוא מיועד.]",
  },

  /* Long-form story — paragraphs. Order matters; renders top-to-bottom. */
  paragraphs: [
    "[TODO: פסקה 1 — איך הכל התחיל. שנת הקמה, החלום הראשוני, הקרבה לשכונה.]",
    "[TODO: פסקה 2 — איך הקפה נבחר, מי הספק, מה מיוחד בו.]",
    "[TODO: פסקה 3 — מסורת הג'חנון של שבת. מאיפה הגיע, מי אופה.]",
    "[TODO: פסקה 4 — איך נראית שכונה ביום שגרתי בקפה הכרם.]",
  ],

  /* The people behind the café — required for GEO authorship signal. */
  founders: [
    {
      name: "[TODO: שם הבעלים/ה]",
      role: "[TODO: מייסד/ת ובעלים]",
      bioShort: "[TODO: 1–2 משפטים — רקע מקצועי, למה פתח/ה את הקפה.]",
      photo: undefined, // [TODO: /images/founder-1.jpg]
    },
  ] as Founder[],

  /* Years in operation — used in the authorship block + Organization
   * JSON-LD foundingDate. [TODO: confirm exact year of founding.] */
  foundedYear: "[TODO: YYYY]" as string,

  /* Visual gallery — paths to images under /public. [TODO: real photos.] */
  gallery: [
    // { src: "/images/about/interior-1.jpg", alt: "פנים בית הקפה — שולחנות עץ בשעות הבוקר" },
  ] as { src: string; alt: string }[],

  /* Closing call-to-action shown above the FAQ block. */
  cta: {
    title: "בואו לבקר",
    body: "קפה הכרם נמצא ברחוב הכרמל 20 בגני תקווה. הדלת פתוחה ברוב שעות היום.",
  },
};
