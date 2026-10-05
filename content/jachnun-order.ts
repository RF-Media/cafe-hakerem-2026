/**
 * Copy for the multi-step jachnun ordering flow at /jachnun/order.
 *
 * Per CLAUDE.md §3 no string in `components/order/` is written inline — the
 * café changes wording here without touching the state machine. Prices are
 * never written out as literals in this file either; they are formatted from
 * `jachnunPricing` at render time so the copy cannot drift from the total.
 */

/**
 * Phase 2. While false, /jachnun/order redirects to the one-step pre-order
 * form on /jachnun and /api/jachnun-order answers 404. The checkout is kept
 * intact behind this flag; flipping it is the whole switch back.
 */
export const CHECKOUT_ENABLED = false;

export const ORDER_STEPS = ["quantity", "addons", "pickup", "details", "payment"] as const;
export type OrderStepId = (typeof ORDER_STEPS)[number];

export const PAYMENT_METHODS = ["apple_pay", "google_pay", "bit", "card", "cash"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const orderCopy = {
  meta: {
    title: "הזמנת ג'חנון | קפה הכרם - גני תקווה",
    description:
      "הזמנת ג'חנון של שבת מקפה הכרם בגני תקווה: בחירת כמות, תוספות וחלון איסוף, ותשלום מאובטח באתר. איסוף בשבת בבוקר ברחוב הכרמל 20.",
  },

  chrome: {
    /** Shown in the slim kiosk bar instead of the full site nav. */
    wordmark: "קפה הכרם",
    subtitle: "הזמנת ג'חנון",
    exit: "יציאה",
    exitAria: "יציאה מההזמנה וחזרה לעמוד הג'חנון",
    exitConfirm: "לצאת מההזמנה? הפרטים שמילאתם יישמרו בדפדפן.",
    help: "צריכים עזרה?",
  },

  /** Ordered, and indexed by `ORDER_STEPS`. */
  steps: {
    quantity: {
      shortLabel: "חבילה",
      title: "איזו חבילה?",
      lede: "כל ג'חנון נאפה לילה שלם ומגיע עם ביצה קשה, רסק עגבניות וסחוג של הבית. בחרו את הגודל שמתאים לכם.",
      popularBadge: "פופולרי",
      /** Shown next to a multi-unit package's price, e.g. "₪33.50 ליחידה". */
      perUnit: "ליחידה",
      /** `{savings}` replaced at render time. */
      savings: "חיסכון של {savings} לעומת הזמנה בודדת",
      /** Compact form for the package cards. `{savings}` replaced at render time. */
      savingsShort: "חיסכון {savings}",
      selectAria: "בחירת {title}",
      /** Label above the +/- stepper, which cycles the same 4 packages by unit count. */
      stepperLabel: "מספר יחידות",
      decreaseAria: "כמות קטנה יותר",
      increaseAria: "כמות גדולה יותר",
      next: "לתוספות",
    },

    addons: {
      shortLabel: "תוספות",
      title: "תוספות להזמנה",
      lede: "כל ג'חנון כבר כולל רסק עגבניות וקופסת זיתים, בלי תוספת תשלום. אפשר להוסיף עוד.",
      includedHeading: "כלול בהזמנה",
      includedNote: "כלול · ללא תשלום",
      extrasHeading: "רוצים עוד?",
      extraPrefix: "תוספת",
      perItem: "ליחידה",
      capReached: "הגעתם למקסימום התוספות להזמנה בגודל הזה.",
      decreaseAria: "הפחתת תוספת אחת של {label}",
      increaseAria: "הוספת תוספת אחת של {label}",
      skip: "לא צריך, תודה",
      next: "לחלון האיסוף",
    },

    pickup: {
      shortLabel: "איסוף",
      title: "מתי לאסוף?",
      lede: "האיסוף בשבת בבוקר ברחוב הכרמל 20, גני תקווה. בחרו את החלון שנוח לכם.",
      legend: "חלון איסוף",
      loading: "טוען חלונות איסוף…",
      empty: "אין כרגע חלונות איסוף פנויים. נסו שוב בהמשך השבוע או התקשרו אלינו.",
      cutoffNote:
        "ההזמנות לשבת הקרובה נסגרות ביום חמישי בשעה 18:00. הזמנות שיתקבלו אחר כך יישמרו לשבת הבאה.",
      required: "בחרו חלון איסוף כדי להמשיך.",
      next: "לפרטים שלכם",
    },

    details: {
      shortLabel: "פרטים",
      title: "הפרטים שלכם",
      lede: "נצטרך רק שם וטלפון כדי לזהות אתכם באיסוף.",
      name: { label: "שם מלא", placeholder: "ישראל ישראלי" },
      phone: {
        label: "טלפון נייד",
        placeholder: "050-1234567",
        hint: "נשלח אליכם אישור הזמנה. לא נשתמש במספר לשום דבר אחר.",
      },
      email: {
        label: "אימייל (אופציונלי)",
        placeholder: "you@example.com",
        hint: "לקבלת אישור הזמנה במייל.",
      },
      notes: {
        label: "בקשות מיוחדות (אופציונלי)",
        hint: "אלרגיות, אריזה נפרדת, שעה מדויקת - כל דבר שכדאי שנדע.",
      },
      next: "לתשלום",
    },

    payment: {
      shortLabel: "תשלום",
      title: "תשלום",
      lede: "התשלום מאובטח. ההזמנה נסגרת רק אחרי אישור התשלום.",
      expressHeading: "תשלום מהיר",
      divider: "או",
      otherHeading: "אמצעי תשלום",
      trust: "התשלום מאובטח ומוצפן. פרטי האשראי אינם נשמרים אצלנו.",
      terms:
        "בשליחת ההזמנה אתם מאשרים את תנאי ההזמנה של קפה הכרם: ביטול עד יום חמישי 18:00, איסוף עצמי בלבד.",
      /** `{total}` replaced at render time. */
      pay: "לתשלום {total}",
      payCash: "אישור הזמנה · תשלום במקום",
      processing: "מעבד תשלום…",
      helpPrefix: "משהו לא עובד?",
      helpCta: "התקשרו אלינו",
    },
  },

  methods: {
    apple_pay: {
      label: "Apple Pay",
      description: "תשלום מהיר עם Face ID או Touch ID.",
      sheetTitle: "אישור תשלום ב-Apple Pay",
    },
    google_pay: {
      label: "Google Pay",
      description: "תשלום מהיר מחשבון Google שלכם.",
      sheetTitle: "אישור תשלום ב-Google Pay",
    },
    bit: {
      label: "ביט",
      description: "תשלום באפליקציית ביט מהטלפון.",
      sheetTitle: "אישור תשלום בביט",
    },
    card: {
      label: "כרטיס אשראי",
      description: "ויזה, מאסטרקארד, אמריקן אקספרס, ישראכרט.",
      sheetTitle: "אימות כרטיס",
    },
    cash: {
      label: "מזומן באיסוף",
      description: "משלמים בקפה. נבקש פרטי אשראי לאבטחת ההזמנה בלבד.",
      sheetTitle: "אימות כרטיס",
    },
  } satisfies Record<PaymentMethod, { label: string; description: string; sheetTitle: string }>,

  card: {
    heading: "פרטי כרטיס",
    number: { label: "מספר כרטיס", placeholder: "0000 0000 0000 0000" },
    holder: { label: "שם בעל/ת הכרטיס", placeholder: "כפי שמופיע על הכרטיס" },
    expiry: { label: "תוקף", placeholder: "MM/YY" },
    cvc: { label: "CVV", placeholder: "123", hint: "3 ספרות בגב הכרטיס." },
    save: "שמירת הכרטיס להזמנה הבאה",
  },

  /** Card is collected for cash orders too — a hold, not a charge. */
  cashGuarantee: {
    heading: "לאבטחת ההזמנה",
    body: "נבקש פרטי אשראי כדי לשמור לכם את הג'חנון, אבל לא נחייב אתכם. התשלום מתבצע בקפה באיסוף.",
    badge: "לא תחויבו עכשיו",
    confirmedNote: "לא חויבתם - התשלום מתבצע בקפה באיסוף.",
  },

  wallet: {
    approve: "אישור התשלום",
    cancel: "ביטול",
    processing: "ממתין לאישור…",
    cancelled: "התשלום בוטל. ההזמנה שלכם נשמרה - אפשר לנסות שוב או לבחור אמצעי תשלום אחר.",
    mockBadge: "הדמיה",
  },

  threeDS: {
    title: "אימות נוסף מול חברת האשראי",
    body: "חברת האשראי מבקשת אימות כדי להשלים את התשלום.",
    approve: "אישור",
    cancel: "ביטול",
    cancelled: "האימות בוטל ולא בוצע חיוב. אפשר לנסות שוב.",
  },

  summary: {
    heading: "סיכום הזמנה",
    openAria: "פתיחת סיכום ההזמנה",
    closeAria: "סגירת סיכום ההזמנה",
    total: "סה״כ",
    savings: "חסכתם",
    // Hebrew takes the singular after 1, so both forms are needed.
    items: "פריטים",
    itemsOne: "פריט",
    pickupHeading: "איסוף",
    pickupMissing: "טרם נבחר חלון איסוף",
    edit: "שינוי",
    payLater: "לתשלום בקפה",
  },

  nav: {
    back: "חזרה",
    backAria: "חזרה לשלב הקודם",
    stepOf: "שלב {current} מתוך {total}",
  },

  confirmation: {
    eyebrow: "ההזמנה אושרה",
    title: "תודה! הג'חנון שלכם מוזמן.",
    referenceLabel: "מספר הזמנה",
    referenceHint: "שמרו את המספר - נשתמש בו באיסוף.",
    pickupHeading: "מתי ואיפה",
    addressLine: "רחוב הכרמל 20, גני תקווה",
    orderHeading: "מה הזמנתם",
    paidHeading: "תשלום",
    paidWith: "שולם באמצעות",
    print: "שמירה או הדפסה",
    printAria: "שמירת אישור ההזמנה כקובץ או הדפסתו",
    again: "הזמנה נוספת",
    home: "חזרה לעמוד הג'חנון",
    smsNote: "אישור הזמנה יישלח אליכם בהודעה.",
    questions: "שאלות על ההזמנה?",
  },

  /** Field-level validation. Server messages take precedence when they arrive. */
  fieldErrors: {
    nameRequired: "נא להזין שם מלא.",
    nameShort: "שם קצר מדי - נא להזין שם מלא.",
    phoneRequired: "נא להזין מספר טלפון נייד.",
    phoneInvalid: "מספר טלפון לא תקין. דוגמה: 050-1234567.",
    emailInvalid: "כתובת אימייל לא תקינה.",
    notesLong: "הבקשה ארוכה מדי - עד 500 תווים.",
    slotRequired: "בחרו חלון איסוף כדי להמשיך.",
    cardNumberRequired: "נא להזין מספר כרטיס.",
    cardNumberInvalid: "מספר הכרטיס אינו תקין.",
    cardHolderRequired: "נא להזין את השם שעל הכרטיס.",
    expiryRequired: "נא להזין תוקף.",
    expiryInvalid: "תוקף לא תקין. הזינו בפורמט MM/YY.",
    expiryPast: "הכרטיס פג תוקף.",
    cvcRequired: "נא להזין CVV.",
    cvcInvalid: "CVV לא תקין.",
  },

  /** Flow-level errors. Each one has a defined recovery. */
  errors: {
    summaryHeading: "יש לתקן כמה פרטים",
    declined: "הכרטיס נדחה. נסו כרטיס אחר או אמצעי תשלום אחר.",
    insufficientFunds: "אין מספיק יתרה בכרטיס. נסו כרטיס אחר.",
    expiredCard: "הכרטיס פג תוקף. נסו כרטיס אחר.",
    processorError: "שירות התשלומים לא הגיב. לא בוצע חיוב - אפשר לנסות שוב.",
    network: "אין חיבור לרשת. ההזמנה לא נשלחה - בדקו את החיבור ונסו שוב.",
    rateLimited: "יותר מדי ניסיונות. נסו שוב בעוד {seconds} שניות.",
    slotTaken: "חלון האיסוף שבחרתם התמלא. בחרו חלון אחר ונשלים את ההזמנה.",
    cutoffPassed:
      "חלון ההזמנות לשבת הקרובה נסגר בזמן שמילאתם את הטופס. בחרו חלון חדש - ההזמנה תישמר לשבת הבאה.",
    totalMismatch: "המחירים התעדכנו בזמן ההזמנה. בדקו את הסיכום ואשרו שוב.",
    generic: "משהו השתבש. לא בוצע חיוב - אפשר לנסות שוב.",
    retry: "נסו שוב",
    changeMethod: "אמצעי תשלום אחר",
    backToPickup: "בחירת חלון איסוף",
  },

  /** Dev-only helper panel listing the mock processor's test cards. */
  devPanel: {
    heading: "כרטיסי בדיקה (מצב פיתוח בלבד)",
    note: "לחיצה על כרטיס ממלאת את הטופס. תוקף ו-CVV - כל ערך תקין.",
  },
};
