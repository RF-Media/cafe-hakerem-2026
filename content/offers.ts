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

/** A Happy Hour perk as the coupon prints it: the number big, what it's off small. */
export type OfferPerk = { value: string; label: string };

/** What the coupon's tear-off stub shouts: one short value and a word under it. */
export type OfferValue = { big: string; small: string };

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
  value: OfferValue;
  perks?: OfferPerk[];
  note?: string;
  cta?: { label: string; href: string };
};

export const offers = {
  intro: {
    kicker: "מבצעים, קפה הכרם · גני תקווה",
    title: "מבצעים חמים בקפה הכרם",
    lede:
      "ה-Happy Hour, מתנת יום ההולדת ועוד הטבות שמורות לחברי מועדון הלקוחות של קפה הכרם, " +
      "וחלק מהמבצעים פתוחים לכל מי שנכנס. ההצטרפות למועדון חינמית ולוקחת דקה.",
    toGrid: "לכל המבצעים",
    secondary: "המועדון בקצרה",
  },

  /* The Happy Hour as a coupon in the hero, so the first screen is the offer. */
  heroCoupon: {
    tag: "לחברי המועדון",
    stubLabel: "ההצטרפות חינם",
    stubCta: "להצטרפות",
    stubNote: "דקה בטלפון, בלי אפליקציה",
    burstSmall: "הצטרפות",
    burstBig: "חינם",
  },

  /* Plain strings: the ticker renders text nodes with no <bdi>, so no item may
     hold a time range with an en dash (it would read backwards). */
  ticker: [
    "50% על קפה שני",
    "10% על כל התפריט",
    "כוס יין ב-₪30",
    "Happy Hour כל יום מ-14:00 עד 19:00",
    "קפה חינם ו-20% ליום ההולדת",
    "הקפה העשירי עלינו",
    "ניקוב ראשון במתנה",
  ],

  grid: {
    eyebrow: "כל המבצעים",
    title: "עוד הטבות שמחכות לכם",
    description: "צהוב לחברי המועדון, ירוק לכל מי שמגיע.",
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
      title: "ה-Happy Hour של קפה הכרם",
      window: "בכל יום, 14:00–19:00",
      lede: "בין הצהריים לערב, הכרטיס שלכם פותח את השעה הכי משתלמת ביום בקפה הכרם.",
      value: { big: "50%", small: "על קפה שני" },
      perks: [
        { value: "50%", label: "על קפה שני" },
        { value: "10%", label: "על כל התפריט" },
        { value: "₪30", label: "לכוס יין" },
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
      value: { big: "20%", small: "וגם קפה חינם" },
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
      value: { big: "₪45", small: "בוקר וקפה" },
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
      value: { big: "חינם", small: "קפה על הבית" },
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
      value: { big: "10%", small: "על כל התפריט" },
      cta: { label: "לתפריט המלא", href: "/menu" },
    },
  ] as Offer[],

  /* Guest vs member. The club rows mirror facts already in content/club.ts
     (Happy Hour, ten punches, first punch, birthday, member deals); the page
     appends one row per `exclusivity: "all"` offer above, so deleting an
     example promo removes its row too. `member: true` renders a check. */
  comparison: {
    eyebrow: "מה מקבלים",
    title: "אורחים מול חברי מועדון",
    description: "אותו קפה, אותו דלפק. ההבדל הוא דקה של הרשמה חינמית.",
    caption: "השוואת ההטבות בקפה הכרם: אורחים מול חברי מועדון הלקוחות",
    cols: { benefit: "ההטבה", guest: "אורחים", member: "חברי מועדון" },
    memberTag: "חינם",
    included: "כלול",
    notIncluded: "לא כלול",
    rows: [
      { label: "קפה שני ב-Happy Hour", note: "בכל יום, 14:00–19:00", member: "50%" },
      { label: "כל התפריט ב-Happy Hour", member: "10%" },
      { label: "כוס יין ב-Happy Hour", member: "₪30" },
      { label: "הקפה העשירי", note: "ניקוב על כל קנייה", member: "חינם" },
      { label: "ניקוב ראשון בהצטרפות", member: "מתנה" },
      { label: "יום הולדת: קפה חינם והנחה על התפריט", note: "בתוקף שבוע", member: "20%" },
      { label: "מבצעים שעולים לכרטיס ומתחלפים", member: true },
    ] as { label: string; note?: string; member: string | true }[],
    footer: "ההצטרפות חינמית, בלי דמי חבר ובלי אפליקציה.",
    cta: "להצטרפות בחינם",
  },

  /* How a member actually uses an offer, in the closing band. */
  steps: [
    { icon: "phone" as const, title: "מצטרפים בחינם", body: "נרשמים פעם אחת, עם Google או במייל. הניקוב הראשון כבר בכרטיס." },
    { icon: "clock" as const, title: "מגיעים לקפה הכרם", body: "ה-Happy Hour פתוח בכל יום בין 14:00 ל-19:00, ושאר ההטבות מחכות בכרטיס." },
    { icon: "qr" as const, title: "מציגים קוד בקופה", body: "לפני התשלום פותחים את הכרטיס ומציגים את הקוד, כדי שהקופה תדע שאתם חברי מועדון." },
  ],

  finalCta: {
    title: "הניקוב הראשון כבר מחכה בכרטיס",
    body: "דקה של הרשמה חינמית, וה-Happy Hour וההטבות שבעמוד הזה כבר פתוחים לכם.",
    button: "להצטרפות למועדון",
    secondary: "לעמוד המועדון",
  },
};
