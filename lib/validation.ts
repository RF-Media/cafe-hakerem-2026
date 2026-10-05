/**
 * All Zod schemas. One file so the validation surface is auditable
 * in a single place. Every API route imports its schema from here.
 *
 * Error messages are Hebrew — they bubble up to the user.
 */
import { z } from "zod";
import { PACKAGE_IDS, jachnunPackages, jachnunPricing } from "@/content/jachnun";
import { PAYMENT_METHODS } from "@/content/jachnun-order";
import { isValidIsraeliMobile, normalizePhone } from "@/lib/phone";

/* Israeli mobile phone. The rule itself lives in lib/phone.ts so the
 * checkout can validate on blur without shipping Zod to the browser. */
export const phoneSchema = z
  .string()
  .trim()
  .transform(normalizePhone)
  .refine(isValidIsraeliMobile, {
    message: "מספר טלפון לא תקין. דוגמה: 050-1234567 או +972501234567.",
  });

export const nameSchema = z
  .string()
  .trim()
  .min(2, "שם קצר מדי - נא להזין שם מלא.")
  .max(80, "שם ארוך מדי.");

export const optionalEmailSchema = z
  .string()
  .trim()
  .email("כתובת אימייל לא תקינה.")
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalNotesSchema = z
  .string()
  .trim()
  .max(500, "ההערה ארוכה מדי.")
  .optional()
  .or(z.literal("").transform(() => undefined));

/* ─── Jachnun order ────────────────────────────────────────────── */

/** Ceiling on paid extras, mirroring `maxExtrasFor()` at the largest package size. */
const MAX_PACKAGE_UNITS = Math.max(...jachnunPackages.map((p) => p.units));
const MAX_EXTRAS = MAX_PACKAGE_UNITS * jachnunPricing.maxExtraPerUnit;

const extraCountSchema = z
  .number({ invalid_type_error: "כמות תוספת לא תקינה." })
  .int("כמות תוספת חייבת להיות מספר שלם.")
  .min(0, "כמות תוספת לא תקינה.")
  .max(MAX_EXTRAS, "יותר מדי תוספות להזמנה אחת.");

export const jachnunOrderSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: optionalEmailSchema,
  // Jachnun is sold as fixed-size packages, not a continuous quantity — the
  // total is derived server-side from the package definition, never from a
  // client-supplied unit count or price.
  packageId: z.enum(PACKAGE_IDS, { errorMap: () => ({ message: "חבילה לא תקינה." }) }),
  // Paid extras only. What every unit already includes for free is derived
  // server-side from the unit count — the client cannot ask for more of it.
  extras: z
    .object({ tomato: extraCountSchema, olives: extraCountSchema, egg: extraCountSchema })
    .default({ tomato: 0, olives: 0, egg: 0 }),
  // ISO-8601 from the slot picker; validated against available slots
  // server-side in the route (not enough info to validate purely from string).
  pickupSlot: z
    .string()
    .datetime({ message: "מועד איסוף לא תקין." }),
  notes: optionalNotesSchema,

  /* ── Payment ──
     `totalAgorot` is what the browser displayed. The route recomputes the
     real total from the selection and rejects a mismatch rather than
     charging either number — a client that can name its own price is the
     oldest bug in online ordering. */
  paymentMethod: z.enum(PAYMENT_METHODS, { errorMap: () => ({ message: "אמצעי תשלום לא תקין." }) }),
  paymentToken: z.string().min(1, "אישור התשלום חסר. נסו שוב."),
  totalAgorot: z
    .number({ invalid_type_error: "סכום לא תקין." })
    .int("סכום לא תקין.")
    .min(0, "סכום לא תקין."),
  idempotencyKey: z.string().trim().min(8, "מפתח בקשה לא תקין.").max(64, "מפתח בקשה לא תקין."),
});

export type JachnunOrderInput = z.infer<typeof jachnunOrderSchema>;

/* ─── Jachnun pre-order (phase 1) ──────────────────────────────── */

/* The one-step form on /jachnun: no add-ons, no payment, no client total.
   The price in the café's email is looked up from the package server-side. */
export const jachnunPreorderSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: optionalEmailSchema,
  packageId: z.enum(PACKAGE_IDS, { errorMap: () => ({ message: "בחרו חבילה." }) }),
  pickupSlot: z.string().datetime({ message: "מועד איסוף לא תקין." }),
  notes: optionalNotesSchema,
});

export type JachnunPreorderInput = z.infer<typeof jachnunPreorderSchema>;

/* ─── Catering inquiry ─────────────────────────────────────────── */

export const cateringInquirySchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: optionalEmailSchema,
  eventDate: z
    .string()
    .datetime({ message: "תאריך אירוע לא תקין." })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  guestCount: z
    .number({ invalid_type_error: "מספר אורחים לא תקין." })
    .int()
    .min(1)
    .max(1000)
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, "תיאור קצר מדי. ספרו לנו עוד על האירוע.")
    .max(2000, "ההודעה ארוכה מדי."),
});

export type CateringInquiryInput = z.infer<typeof cateringInquirySchema>;

/* ─── Helpers ──────────────────────────────────────────────────── */

/**
 * Short, human-friendly reference code shown to the customer.
 * e.g. "JCH-2X4P". Not a security token — just a confirmation handle.
 */
export function generateReference(prefix: "JCH" | "CAT"): string {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // no 0/1/I/O
  let out = "";
  for (let i = 0; i < 4; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${out}`;
}

/**
 * Unguessable id for the receipt URL. Unlike `generateReference`, this one is
 * a security boundary: a phase-2 receipt PDF is served to anyone holding the
 * token, so 128 bits of real randomness, not four friendly characters.
 */
export function generateReceiptToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
