/**
 * /offers content — "מבצעים".
 *
 * One real, café-confirmed main promotion (the happy hour) plus the one other
 * already-confirmed club fact worth surfacing here (the birthday gift, mirrored
 * from `club.perks` in content/club.ts — not re-invented). The remaining three
 * are EXAMPLE PROMOS, built so the page has enough rhythm to review and ship a
 * real design against; each is flagged below. CONFIRM WITH THE CAFÉ BEFORE
 * LAUNCH, then either keep them as real promotions or delete the entry.
 *
 * §9 would normally forbid inventing this kind of specific, actionable content
 * ("never invent... dates"), but the café explicitly asked for dummy promos to
 * fill out the page for review — same carve-out as the 2026-08-03 jachnun
 * add-on demo prices. No placeholder sentinel on purpose: a page that renders
 * one can't demonstrate the layout it exists to demonstrate, and the content
 * completeness check would block the build besides.
 */

export type OfferExclusivity = "club" | "all";

/** Keyed to the hand-drawn scene in components/sections/OfferScenes.tsx. */
export type OfferIllustrationKey = "happyHour" | "birthday" | "brunch" | "jachnunCoffee" | "student";

export type OfferPerk = { label: string; detail: string };

export type Offer = {
  id: string;
  featured?: boolean;
  exclusivity: OfferExclusivity;
  illustration: OfferIllustrationKey;
  eyebrow: string;
  title: string;
  /** Human time/day window. Rendered inside <bdi dir="ltr"> at the call site —
   *  an en dash between two times is a bidi neutral and displays backwards
   *  otherwise (see the 2026-10-05 and 2026-11-05 Decision Log entries). */
  window: string;
  lede: string;
  perks?: OfferPerk[];
  note?: string;
  cta?: { label: string; href: string };
};

export const offers = {
  intro: {
    kicker: "מבצעים, קפה הכרם · גני תקווה",
    title: "המבצעים שרצים עכשיו.",
    lede:
      "מחכות לכם במועדון החברים של קפה הכרם. " +
      "חלק מההטבות פתוחות לכולם, וחלק שמורות לחברי המועדון שרץ על CoffeeStream.",
    primary: "לכרטיס המועדון",
    secondary: "המועדון בקצרה",
  },

  legend: {
    club: "לחברי המועדון",
    all: "לכולם",
  },

  items: [
    {
      id: "happy-hour",
      featured: true,
      exclusivity: "club",
      illustration: "happyHour",
      eyebrow: "המבצע המרכזי · לחברי המועדון",
      title: "ההאפי אאוור של קפה הכרם",
      window: "בכל יום, 14:00–19:00",
      lede: "בין הצהריים לערב, הכרטיס שלכם פותח את השעה הכי משתלמת ביום בקפה הכרם.",
      perks: [
        { label: "קפה שני", detail: "50% הנחה" },
        { label: "כל התפריט", detail: "10% הנחה" },
        { label: "כוס יין", detail: "₪30" },
      ],
      note: "בתוקף לחברי מועדון הלקוחות של קפה הכרם בלבד. אי אפשר לשלב עם מבצעים אחרים.",
    },
    // Real fact, mirrored from club.perks (content/club.ts) rather than
    // re-written here — same birthday benefit, surfaced as its own card.
    {
      id: "birthday",
      exclusivity: "club",
      illustration: "birthday",
      eyebrow: "מתנת המועדון",
      title: "מתנה ליום ההולדת",
      window: "מייל שמגיע יומיים מראש, בתוקף שבוע",
      lede: "קפה חינם ו-20% הנחה על התפריט, מתנה מהמועדון של קפה הכרם ליום ההולדת שלכם.",
    },
    // EXAMPLE PROMO — CONFIRM WITH THE CAFÉ BEFORE LAUNCH, then keep or delete.
    {
      id: "weekend-brunch",
      exclusivity: "all",
      illustration: "brunch",
      eyebrow: "סוף שבוע בקפה הכרם",
      title: "בראנץ' של שישי-שבת",
      window: "שישי ושבת, 09:00–13:00",
      lede: "ארוחת בוקר מלאה וקפה או שתייה חמה אחת ב-₪45, בבוקר של שישי ושבת.",
    },
    // EXAMPLE PROMO — CONFIRM WITH THE CAFÉ BEFORE LAUNCH, then keep or delete.
    {
      id: "jachnun-coffee",
      exclusivity: "all",
      illustration: "jachnunCoffee",
      eyebrow: "בזמן איסוף הג'חנון",
      title: "קפה על הבית לאוספי ג'חנון",
      window: "בכל איסוף של הזמנת ג'חנון לשבת",
      lede: "מזמינים ג'חנון של שבת מראש, ובאיסוף מקבלים כוס קפה או תה חם על הבית.",
      cta: { label: "להזמנת ג'חנון", href: "/jachnun" },
    },
    // EXAMPLE PROMO — CONFIRM WITH THE CAFÉ BEFORE LAUNCH, then keep or delete.
    {
      id: "student-discount",
      exclusivity: "all",
      illustration: "student",
      eyebrow: "ימים א׳-ה׳",
      title: "הנחת סטודנטים",
      window: "בכל ביקור, עם תעודת סטודנט בקופה",
      lede: "10% הנחה על כל התפריט למציגי תעודת סטודנט בקופה של קפה הכרם, בימים א׳ עד ה׳.",
      cta: { label: "לתפריט המלא", href: "/menu" },
    },
  ] as Offer[],

  clubTile: {
    eyebrow: "מי מפעיל את זה",
    title: "כל ההטבות של המועדון",
    body: "חברי המועדון רואים בכרטיס גם ניקובים לקפה חינם וגם את המבצעים האלה. ההצטרפות חינמית ולוקחת דקה.",
    cta: "לכרטיס המועדון",
  },

  finalCta: {
    title: "הניקוב הראשון כבר מחכה בכרטיס",
    body: "דקה של הרשמה חינמית, וההאפי אאוור וההטבות שבעמוד הזה כבר פתוחים לכם.",
    button: "להצטרפות למועדון",
    secondary: "לעמוד המועדון",
  },
};
