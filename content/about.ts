/**
 * About-page content for /about.
 *
 * The About page is the highest-trust page on the site — it's where
 * the café tells its story in its own voice. Everything here that
 * isn't already in business.ts is prose about the café itself.
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
    title: "שולחן השכונה של גני תקווה",
    lede:
      "קפה הכרם הוא הרבה יותר מבית קפה. הוא פינה שקטה בלב גני תקווה, מקום מפגש " +
      "לשכנים, חברים ומשפחות, עם קפה משובח, אוכל מפנק ואווירה ביתית שאין בשום מקום " +
      "אחר. מקום שכיף לעצור בו לרגע ולפעמים גם להישאר קצת יותר.",
  },

  /* Long-form story — headed sections. Order matters; renders top-to-bottom. */
  story: [
    {
      heading: "הכול התחיל מג'חנון ובורקס",
      paragraphs: [
        "הסיפור שלנו התחיל מעגלת ג'חנון ובורקס שהפכה עם הזמן להרבה יותר מרעיון של סוף שבוע. " +
          "האהבה שקיבלנו נתנה לנו את ההשראה לקחת את האהבה לאוכל צעד אחד קדימה ולפתוח את קפה הכרם.",
        "כך נולד בית הקפה שלנו ברחוב הכרמל 20 בגני תקווה. מקום שבו אפשר ליהנות מאותם טעמים " +
          "של שבת בבוקר, אבל גם לפתוח את היום עם קפה טוב, מאפה חם, או כריך שמכינים במקום.",
      ],
    },
    {
      heading: "הדברים הקטנים שעושים את ההבדל",
      paragraphs: [
        "אצלנו הבוקר מתחיל מוקדם, עם ריח של מאפים חמים, כריכים טריים וקפה שנטחן במקום. " +
          "מאז ועד היום, אנחנו מאמינים בקפה איכותי, אוכל משובח וביחס חם ואישי. וזה מה שתמצאו כאן, בכל ביקור.",
      ],
    },
    {
      heading: "המקום שלכם לקחת רגע",
      paragraphs: [
        "יש מי שמגיע לקפה של הבוקר בדרך לעבודה, מי שנפגש עם חברים ומי שפשוט אוהב לשבת, " +
          "להזמין משהו טעים ולתת לזמן לעבור קצת יותר לאט.",
        "אנחנו אוהבים את הרגעים האלה. את השיחות שמתארכות, את המפגשים הספונטניים ואת האנשים " +
          "שהופכים את המקום למה שהוא.",
        "מחכים לראותכם בכרם.",
      ],
    },
  ],

  /* The people behind the café — required for GEO authorship signal. */
  founders: [
    {
      name: "רונית ואבי לוי",
      role: "מייסדים ובעלים",
      bioShort:
        "רונית ואבי פתחו את קפה הכרם אחרי שנים במטבחים מקצועיים, במרחק הליכה מהבית שלהם " +
        "בגבעת סביון. הם עדיין נמצאים בקפה כמעט כל בוקר.",
      photo: undefined,
    },
  ] as Founder[],

  /* Years in operation — used in the authorship block + Organization
   * JSON-LD foundingDate. */
  foundedYear: "2016" as string,

  /* Visual gallery — paths to images under /public. No photography has
   * been supplied yet, so /about falls back to the authored line art in
   * components/ui/placeholders. Add entries here to swap them out. */
  gallery: [
    // { src: "/images/about/interior-1.jpg", alt: "פנים בית הקפה — שולחנות עץ בשעות הבוקר" },
  ] as { src: string; alt: string }[],

  /* Closing call-to-action shown above the FAQ block. */
  cta: {
    title: "בואו לבקר",
    body: "קפה הכרם נמצא ברחוב הכרמל 20 בגני תקווה. הדלת פתוחה ברוב שעות היום.",
  },
};
