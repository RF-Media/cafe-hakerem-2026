/**
 * All Zod schemas. One file so the validation surface is auditable
 * in a single place. Every API route imports its schema from here.
 *
 * Error messages are Hebrew — they bubble up to the user.
 */
import { z } from "zod";

/* Israeli mobile phone — accepts:
 *   05X-XXXXXXX
 *   05XXXXXXXX
 *   +9725XXXXXXXX
 * Spaces and dashes are stripped before regex test. */
const israeliPhoneRegex = /^(?:\+9725\d{8}|05\d{8})$/;

export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .refine((v) => israeliPhoneRegex.test(v), {
    message: "מספר טלפון לא תקין. דוגמה: 050-1234567 או +972501234567.",
  });

export const nameSchema = z
  .string()
  .trim()
  .min(2, "שם קצר מדי — נא להזין שם מלא.")
  .max(80, "שם ארוך מדי.");

export const optionalEmailSchema = z
  .string()
  .trim()
  .email("כתובת אימייל לא תקינה.")
  .optional()
  .or(z.literal("").transform(() => undefined));

/* ─── Jachnun order ────────────────────────────────────────────── */

export const jachnunOrderSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  quantity: z
    .number({ invalid_type_error: "כמות לא תקינה." })
    .int("כמות חייבת להיות מספר שלם.")
    .min(1, "יש להזמין לפחות יחידה אחת.")
    .max(20, "להזמנות גדולות מ-20 יחידות — נא לפנות בטלפון."),
  // ISO-8601 from the slot dropdown; validated against available slots
  // server-side in the route (not enough info to validate purely from string).
  pickupSlot: z
    .string()
    .datetime({ message: "מועד איסוף לא תקין." }),
  notes: z
    .string()
    .trim()
    .max(500, "ההערה ארוכה מדי.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type JachnunOrderInput = z.infer<typeof jachnunOrderSchema>;

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
