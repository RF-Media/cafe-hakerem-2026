/**
 * Copy for the customer confirmation emails (lib/email-templates.ts).
 * The café's internal notifications are built in their API routes and are
 * not customer-facing, so they stay there.
 */

export const emailShell = {
  hoursLabel: "שעות פתיחה",
  contactLabel: "שאלות? התקשרו אלינו",
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
  wazeLabel: "ניווט עם Waze",
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
  eventDateLabel: "תאריך האירוע",
  guestsLabel: "מספר אורחים משוער",
  messageLabel: "על האירוע",
  nextHeading: "מה עכשיו?",
  nextBody: "נעבור על הבקשה, נתקשר לתאם סוגי מגשים, כמויות ומועד איסוף, ונשלח הצעה מסודרת. בינתיים אפשר להציץ שוב במגשים שלנו.",
  ctaLabel: "למגשי האירוח",
};
