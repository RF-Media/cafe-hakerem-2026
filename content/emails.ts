/**
 * Copy for the customer confirmation emails (lib/email-templates.ts).
 * The café's internal notifications are built in their API routes and are
 * not customer-facing, so they stay there.
 */

export const emailShell = {
  /** Sunday-first, for the one-line hours summary ("א׳–ה׳ 07:00–20:00"). */
  dayShort: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "שבת"],
  closed: "סגור",
  poweredBy: "מופעל על ידי",
  poweredByName: "CoffeeStream",
  poweredByUrl: "https://coffeestream.co.il",
};

export const jachnunConfirmation = {
  subject: (reference: string) => `קיבלנו את בקשת ההזמנה שלך · ${reference}`,
  preheader: (_day: string) => "זהו אישור קבלת הבקשה. נציג יתקשר אליך לאישור סופי, לתיאום ולתשלום.",
  eyebrow: "ג'חנון של שבת",
  title: "קיבלנו את בקשת ההזמנה",
  greeting: (name: string) => `שלום ${name},`,
  intro:
    "תודה שפנית לקפה הכרם. זהו אישור על כך שפרטי בקשת ההזמנה הגיעו אלינו — זו עדיין לא הזמנה סגורה. נציג שלנו יצור איתך קשר טלפוני בקרוב כדי לאשר את הפרטים, לקבל את התשלום ולתת לך אישור סופי.",
  referenceLabel: "מספר בקשה",
  pickupHeading: "חלון איסוף מבוקש",
  pickupPlaceHeading: "מקום האיסוף",
  wazeLabel: "Waze",
  mapsLabel: "Google Maps",
  navigateLabel: "ניווט:",
  orderHeading: "מה ביקשת",
  unitsLabel: (units: number) => (units === 1 ? "יחידה אחת" : `${units} יחידות`),
  includedLabel: "כל ג'חנון מגיע עם",
  includedPrice: "כלול",
  totalLabel: "סכום משוער",
  notChargedNote:
    "לא בוצע חיוב, ולא נשמר מקום באופן סופי. הסכום הסופי, חלון האיסוף ואופן התשלום ייסגרו עם הנציג בטלפון.",
  detailsHeading: "הפרטים שלך",
  nameLabel: "שם",
  phoneLabel: "טלפון",
  emailLabel: "אימייל",
  notesLabel: "בקשות מיוחדות",
  changeNote: "רוצה לשנות משהו לפני שהנציג יתקשר? התקשרו לקפה הכרם ונסדר את זה.",
};

export const cateringConfirmation = {
  subject: (reference: string) => `קיבלנו את הפנייה שלך למגשי אירוח · ${reference}`,
  preheader: "קפה הכרם יחזור אליך בהקדם עם הצעה.",
  eyebrow: "מגשי אירוח",
  title: "קיבלנו את הפנייה שלך",
  greeting: (name: string) => `שלום ${name},`,
  intro: "תודה שפנית לקפה הכרם בנוגע למגשי אירוח. הפנייה הגיעה אלינו, ונחזור אליך בטלפון בהקדם כדי לתאם את הפרטים ולתת הצעת מחיר.",
  referenceLabel: "מספר פנייה",
  recapHeading: "מה שלחת לנו",
  nameLabel: "שם",
  phoneLabel: "טלפון",
  emailLabel: "אימייל",
  eventDateLabel: "תאריך האירוע",
  guestsLabel: "מספר אורחים משוער",
  traysLabel: "מגשים",
  noTrays: "נשמח להמלצה מהקפה",
  fulfilmentLabel: "איסוף או משלוח",
  messageLabel: "הערות",
  nextHeading: "מה עכשיו?",
  nextBody: "נעבור על הבקשה, נתקשר לתאם סוגי מגשים, כמויות ומועד איסוף או משלוח, ונשלח הצעה מסודרת. בינתיים אפשר להציץ שוב במגשים שלנו.",
  ctaLabel: "למגשי האירוח",
};

/* The PDF attached to each customer confirmation (lib/confirmation-pdf.ts). */
export const confirmationPdf = {
  jachnunTitle: "אישור הזמנה",
  jachnunSubtitle: "ג'חנון של שבת",
  cateringTitle: "אישור קבלת פנייה",
  cateringSubtitle: "מגשי אירוח",
  referenceLabel: "מספר הזמנה",
  inquiryReferenceLabel: "מספר פנייה",
  issuedLabel: "תאריך",
  pickupLabel: "מועד איסוף",
  pickupPlaceLabel: "מקום איסוף",
  itemCol: "פריט",
  qtyCol: "כמות",
  amountCol: "סכום",
  included: "כלול",
  totalLabel: "סכום משוער",
  paymentNote: "לא בוצע חיוב. ההזמנה טרם אושרה סופית - נציג יצור קשר לאישור ולקבלת פרטי התשלום.",
  customerHeading: "פרטי המזמין",
  inquiryHeading: "פרטי הפנייה",
  nextNote: "קפה הכרם יחזור אליך בטלפון לתיאום הפרטים ולהצעת מחיר.",
  notInvoice: "מסמך זה הוא אישור הזמנה ואינו מהווה חשבונית מס.",
  filename: (reference: string) => `cafe-hakerem-${reference}.pdf`,
};

/* Kitchen ticket: the internal email to ORDER_COPY_EMAILS (CoffeeStream now,
   the seller later). Built to be read at a glance on a phone in the kitchen. */
export const orderTicket = {
  jachnunHeader: "הזמנת ג'חנון חדשה",
  cateringHeader: "פנייה חדשה למגשי אירוח",
  jachnunSubject: (reference: string, name: string, total: string, slot: string) =>
    `ג'חנון ${reference} · ${name} · ${total} · ${slot}`,
  cateringSubject: (reference: string, name: string, guests?: number, date?: string) =>
    [`מגשי אירוח ${reference}`, name, guests ? `${guests} אורחים` : "", date ?? ""].filter(Boolean).join(" · "),
  pickupLabel: "איסוף",
  orderLabel: "בהזמנה",
  units: (n: number) => `${n} יח׳`,
  includedLabel: "כולל",
  notesLabel: "הערות",
  customerLabel: "לקוח",
  totalLabel: "סכום לאישור וגבייה בטלפון",
  eventDateLabel: "תאריך",
  guestsLabel: "אורחים",
  traysLabel: "מגשים",
  noTrays: "לא בחר/ה - להמליץ",
  fulfilmentLabel: "איך",
  messageLabel: "הערות",
  callBack: "לחזור ללקוח בטלפון",
  sentTo: (email: string) => `אישור נשלח ללקוח: ${email}`,
  noCustomerEmail: "הלקוח לא השאיר אימייל, לא נשלח אישור",
};
