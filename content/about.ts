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
      "קפה הכרם נפתח מתוך רצון פשוט — שיהיה בגבעת סביון מקום אחד שאפשר להיכנס אליו " +
      "בלי לתכנן, לשבת כמה שרוצים, ולקבל קפה שנטחן באותו רגע. מאז אנחנו כאן כל בוקר, " +
      "לאותם אנשים ולאותם שולחנות.",
  },

  /* Long-form story — paragraphs. Order matters; renders top-to-bottom. */
  paragraphs: [
    "קפה הכרם נפתח ברחוב הכרמל 20 בגני תקווה, בפינה שהייתה קודם חנות שכונתית קטנה. " +
      "הרעיון לא היה לפתוח בית קפה גדול אלא מקום אחד שהשכונה יכולה לקרוא לו שלה — " +
      "עשרה שולחנות, דלפק אחד, ומספיק מקום שאנשים יכירו אחד את השני.",
    "הקפה הוא תערובת ערביקה בקלייה בינונית שנבחרה אחרי חודשים של טעימות, בעיקר כי היא " +
      "עובדת טוב גם כאספרסו וגם עם חלב. אנחנו טוחנים לכל כוס בנפרד, ולא מכינים מראש. " +
      "מי שמבקש חלב שקדים, שיבולת שועל או סויה מקבל בלי תוספת תשלום.",
    "הג'חנון של שבת הגיע מהמטבח של סבתא, והמתכון לא השתנה מאז. אנחנו לשים את הבצק ביום " +
      "חמישי, מגלגלים אותו ביד, ומכניסים לתנור בליל שבת כדי שיאפה לאט עד הבוקר. " +
      "בשבת בבוקר אנשים אוספים אותו חם, עם ביצה, רסק ושוג.",
    "יום רגיל אצלנו מתחיל ב-07:00 עם מי שבדרך לעבודה, ממשיך בארוחות בוקר ארוכות עד הצהריים, " +
      "ונגמר אחר הצהריים עם ילדים שחוזרים מבית הספר ושכנים שקופצים לקפה אחרון. " +
      "זה קצב שלא ניסינו לשנות.",
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
