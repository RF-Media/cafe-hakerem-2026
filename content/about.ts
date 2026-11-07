/**
 * About-page content for /about.
 *
 * The highest-trust page on the site: where the café tells its story in its
 * own voice. The story is built from the copywriter's doc (2026-10-20) and
 * expanded without adding a single new fact: no dates, names or claims the
 * café hasn't made. `founders` and `foundedYear` stay out of the page at the
 * café's request (see the 2026-08-10 Decision Log).
 */

import type { PlaceholderVariant } from "@/components/ui/placeholders";

export type Founder = {
  name: string;       // Hebrew
  role: string;       // Hebrew
  bioShort: string;   // 1–2 sentences
  photo?: string;     // /public path
};

/** A photo slot in the album. No `src` renders a designed empty frame; adding
 *  one swaps in the real photo with nothing else to change. */
export type AlbumPhoto = {
  src?: string;
  variant: PlaceholderVariant;
  alt: string;
  caption: string;
};

export const about = {
  hero: {
    eyebrow: "הסיפור שלנו",
    kicker: "הסיפור של קפה הכרם, גני תקווה",
    title: "שולחן השכונה של גני תקווה",
    lede:
      "קפה הכרם הוא הרבה יותר מבית קפה. הוא פינה שקטה בלב גני תקווה, מקום מפגש " +
      "לשכנים, חברים ומשפחות, עם קפה משובח, אוכל מפנק ואווירה ביתית שאין בשום מקום " +
      "אחר. מקום שכיף לעצור בו לרגע ולפעמים גם להישאר קצת יותר.",
    image: "/images/barista_shared.jpg",
    imageAlt: "בריסטה של קפה הכרם בחולצה עם לוגו הבית, מכין קפה ליד מכונת האספרסו",
  },

  /* Long-form story, in chapters. Order matters; renders top to bottom. */
  story: [
    {
      n: "01",
      eyebrow: "ההתחלה",
      heading: "הכול התחיל מג'חנון ובורקס",
      paragraphs: [
        "הסיפור שלנו התחיל מעגלת ג'חנון ובורקס שהפכה עם הזמן להרבה יותר מרעיון של סוף שבוע. " +
          "האהבה שקיבלנו נתנה לנו את ההשראה לקחת את האהבה לאוכל צעד אחד קדימה ולפתוח את קפה הכרם.",
        "כך נולד בית הקפה שלנו ברחוב הכרמל 20 בגני תקווה. מקום שבו אפשר ליהנות מאותם טעמים " +
          "של שבת בבוקר, אבל גם לפתוח את היום עם קפה טוב, מאפה חם, או כריך שמכינים במקום.",
        "את הג'חנון אופים לילה שלם בתנור, לאיסוף בשבת בבוקר. יש דברים שלא צריך לשנות.",
      ],
      image: "/images/jachnun-tray_shared.jpg",
      imageAlt: "מגש ג'חנון על נייר חום עם רסק עגבניות, סחוג וביצים קשות",
      link: { href: "/jachnun", label: "להזמנת ג'חנון" },
    },
    {
      n: "02",
      eyebrow: "המלאכה",
      heading: "הדברים הקטנים שעושים את ההבדל",
      paragraphs: [
        "אצלנו הבוקר מתחיל מוקדם, עם ריח של מאפים חמים, כריכים טריים וקפה שנטחן במקום. " +
          "מאז ועד היום, אנחנו מאמינים בקפה איכותי, אוכל משובח וביחס חם ואישי. וזה מה שתמצאו כאן, בכל ביקור.",
        "הקפה הוא תערובת של ערביקה ורובוסטה בקלייה איטית, כי ככה הוא שומר על טעם עמוק וארומה עשירה. " +
          "הבורקס התורכי נעשה ביד, הכריכים מוכנים במקום, והמאפים נאפים מדי בוקר.",
      ],
      image: "/images/portafilter_shared.jpg",
      imageAlt: "ידית אספרסו מלאה בקפה שזה עתה נטחן, מעל מכונת הקפה של קפה הכרם",
    },
    {
      n: "03",
      eyebrow: "המקום",
      heading: "המקום שלכם לקחת רגע",
      paragraphs: [
        "יש מי שמגיע לקפה של הבוקר בדרך לעבודה, מי שנפגש עם חברים ומי שפשוט אוהב לשבת, " +
          "להזמין משהו טעים ולתת לזמן לעבור קצת יותר לאט.",
        "אנחנו אוהבים את הרגעים האלה. את השיחות שמתארכות, את המפגשים הספונטניים ואת האנשים " +
          "שהופכים את המקום למה שהוא.",
      ],
      image: "/images/courtyard-tall_shared.jpg",
      imageAlt: "החצר של קפה הכרם תחת שמשייה לבנה, אורחים יושבים בין עציצים ועצי דקל",
    },
  ],

  signoff: "מחכים לראותכם בכרם.",

  /* The empty frames, on purpose: the café's history before this address has no
     photos yet. Give any of these a `src` and the frame becomes the photo. */
  album: {
    eyebrow: "מהאלבום",
    title: "הדפים שעוד מחכים לתמונה",
    lede: "יש לנו עוד כמה רגעים שאנחנו מחפשים בארגזים. כשנמצא אותם, הם ייכנסו לכאן.",
    pendingNote: "התמונה בדרך",
    photos: [
      { variant: "tray", alt: "העגלה שבה התחיל קפה הכרם", caption: "העגלה שממנה הכול התחיל" },
      { variant: "interior", alt: "הבוקר הראשון של קפה הכרם ברחוב הכרמל 20", caption: "הבוקר הראשון ברחוב הכרמל" },
      { variant: "founder", alt: "הצוות של קפה הכרם מאחורי הדלפק", caption: "האנשים שמאחורי הדלפק" },
    ] as AlbumPhoto[],
  },

  /* A day at the café, scene by scene. Every line is something the menu or the
     hours already say; nothing here is a new promise. */
  day: {
    eyebrow: "יום אחד בקפה הכרם",
    title: "מהכוס הראשונה ועד השקיעה בחצר",
    scenes: [
      { when: "בוקר", title: "הכוס הראשונה", body: "פותחים ב-07:00 עם קפה שנטחן במקום, ומאפים שרק יצאו מהתנור.", image: "/images/flat-white_shared.jpg", alt: "קפה הפוך עם ציור חלב, במבט מלמעלה על שיש בהיר, ולידו צל ארוך" },
      { when: "צהריים", title: "הפסקה טובה", body: "פוקאצ'ות, כריכים וסלטים שמכינים במקום, לשבת או לקחת.", image: "/images/coffee-sandwich_shared.jpg", alt: "כריך חצילים ופטה בבאגט דגנים לצד קפה הפוך בכוס זכוכית" },
      { when: "אחר הצהריים", title: "עוד כוס בחצר", body: "עוגה, קפה קר ושיחה שמתארכת, בחוץ תחת השמשיות.", image: "/images/iced-latte-palms_shared.jpg", alt: "קפה קר בכוס זכוכית על שולחן שחור, ברקע עצי דקל וחצר" },
      { when: "שבת בבוקר", title: "הריח של הג'חנון", body: "פותחים ב-08:00, והג'חנון שהוזמן מראש מחכה חם לאיסוף.", image: "/images/jachnun-closeup_shared.jpg", alt: "ג'חנון מגולגל עם רסק עגבניות וביצה קשה" },
    ],
  },

  stats: {
    eyebrow: "במספרים",
    title: "קפה הכרם בכמה עובדות",
    items: [
      { value: 7, suffix: "", label: "ימים בשבוע", detail: "פתוחים גם בשבת" },
      { value: 10, suffix: "", label: "קטגוריות בתפריט", detail: "מבורקס ועד ג'חנון" },
      { value: 1, suffix: "", label: "עגלה", detail: "שממנה הכול התחיל" },
    ],
  },

  /* The people behind the café. Not rendered, at the café's request. */
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

  foundedYear: "2016" as string,

  /* Closing call-to-action, above the FAQ. */
  cta: {
    title: "בואו לבקר",
    body: "קפה הכרם נמצא במרכז הבמה, ברחוב הכרמל 20 בגני תקווה, פתוח שבעה ימים בשבוע.",
    menu: "לתפריט",
    jachnun: "ג'חנון של שבת",
    club: "מועדון הלקוחות",
    contact: "איך מגיעים",
  },
};
