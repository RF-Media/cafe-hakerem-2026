/**
 * Copy for the customer confirmation emails (lib/email-templates.ts).
 * The café's internal notifications are built in their API routes and are
 * not customer-facing, so they stay there.
 */

export const emailShell = {
  /** Sunday-first, for the one-line hours summary ("א׳–ה׳ 07:00–20:00"). */
  dayShort: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "שבת"],
  closed: "סגור",
  pdfNote: "אישור ההזמנה מצורף למייל כקובץ PDF.",
  poweredBy: "מופעל על ידי",
  poweredByName: "CoffeeStream",
  poweredByUrl: "https://coffeestream.co.il",
};

export const jachnunConfirmation = {
  subject: (reference: string) => `הזמנת הג'חנון שלך התקבלה · ${reference}`,
  preheader: (day: string) => `נתראה ${day}. התשלום בקופה באיסוף.`,
  eyebrow: "ג'חנון של שבת",
  title: "ההזמנה שלך התקבלה",
  greeting: (name: string) => `שלום ${name},`,
  intro: "תודה שהזמנת ג'חנון מקפה הכרם. הנה כל פרטי ההזמנה, כדאי לשמור את המייל הזה עד האיסוף.",
  referenceLabel: "מספר הזמנה",
  pickupHeading: "איסוף",
  pickupPlaceHeading: "מקום האיסוף",
  wazeLabel: "Waze",
  mapsLabel: "Google Maps",
  navigateLabel: "ניווט:",
  orderHeading: "פירוט ההזמנה",
  unitsLabel: (units: number) => (units === 1 ? "יחידה אחת" : `${units} יחידות`),
  includedLabel: "כל ג'חנון מגיע עם",
  includedPrice: "כלול",
  totalLabel: "לתשלום בקופה באיסוף",
  notChargedNote: "לא בוצע חיוב. משלמים בקופה כשאוספים את ההזמנה.",
  detailsHeading: "הפרטים שלך",
  nameLabel: "שם",
  phoneLabel: "טלפון",
  emailLabel: "אימייל",
  notesLabel: "בקשות מיוחדות",
  changeNote: "צריך לשנות או לבטל? התקשרו לקפה הכרם ונסדר את זה.",
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
  messageLabel: "על האירוע",
  nextHeading: "מה עכשיו?",
  nextBody: "נעבור על הבקשה, נתקשר לתאם סוגי מגשים, כמויות ומועד איסוף, ונשלח הצעה מסודרת. בינתיים אפשר להציץ שוב במגשים שלנו.",
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
  totalLabel: "לתשלום בקופה באיסוף",
  paymentNote: "לא בוצע חיוב. התשלום מתבצע בקופה בעת איסוף ההזמנה.",
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
  cateringSubject: (reference: string, name: string) => `מגשי אירוח ${reference} · ${name}`,
  pickupLabel: "איסוף",
  orderLabel: "בהזמנה",
  units: (n: number) => `${n} יח׳`,
  includedLabel: "כולל",
  notesLabel: "הערות",
  customerLabel: "לקוח",
  totalLabel: "לגבייה בקופה",
  eventDateLabel: "תאריך",
  guestsLabel: "אורחים",
  messageLabel: "פרטים",
  callBack: "לחזור ללקוח בטלפון",
  sentTo: (email: string) => `אישור נשלח ללקוח: ${email}`,
  noCustomerEmail: "הלקוח לא השאיר אימייל, לא נשלח אישור",
};
