/**
 * Checkout state: one reducer, one draft object, one storage key.
 *
 * The draft is mirrored into `sessionStorage` on every change. A checkout is
 * the single place on the site where losing state costs a sale — a mistyped
 * card, a pull-to-refresh, an OS back-swipe or a phone call mid-order all
 * bring the customer back to a flow that still knows what they were buying.
 *
 * Card details are **never** part of the draft and are never persisted; they
 * live inside the payment step's own state for the lifetime of one attempt.
 */

import {
  ADDON_KEYS,
  clampExtras,
  clampUnits,
  EMPTY_EXTRAS,
  maxExtrasFor,
  type AddonKey,
  type Extras,
} from "@/lib/jachnun-pricing";
import { isValidIsraeliMobile } from "@/lib/phone";
import { orderCopy, ORDER_STEPS, type OrderStepId, type PaymentMethod } from "@/content/jachnun-order";

export type OrderDraft = {
  units: number;
  extras: Extras;
  /** ISO timestamp of the chosen pickup window; null until step 3 is done. */
  pickupSlotIso: string | null;
  name: string;
  phone: string;
  email: string;
  notes: string;
  paymentMethod: PaymentMethod | null;
};

export const EMPTY_DRAFT: OrderDraft = {
  units: 1,
  extras: { ...EMPTY_EXTRAS },
  pickupSlotIso: null,
  name: "",
  phone: "",
  email: "",
  notes: "",
  paymentMethod: null,
};

export type DetailsField = "name" | "phone" | "email" | "notes";

export type OrderAction =
  | { type: "units"; value: number }
  | { type: "extra"; key: AddonKey; value: number }
  | { type: "slot"; iso: string }
  | { type: "clearSlot" }
  | { type: "field"; key: DetailsField; value: string }
  | { type: "method"; value: PaymentMethod }
  | { type: "hydrate"; draft: OrderDraft }
  | { type: "reset" };

export function orderReducer(state: OrderDraft, action: OrderAction): OrderDraft {
  switch (action.type) {
    case "units": {
      const units = clampUnits(action.value);
      // Lowering the unit count lowers the extras ceiling with it, otherwise
      // dropping from 5 jachnun to 1 leaves 15 paid tomato portions attached.
      return { ...state, units, extras: clampExtras(units, state.extras) };
    }
    case "extra": {
      const cap = maxExtrasFor(state.units);
      const value = Math.min(cap, Math.max(0, Math.round(action.value)));
      return { ...state, extras: { ...state.extras, [action.key]: value } };
    }
    case "slot":
      return { ...state, pickupSlotIso: action.iso };
    case "clearSlot":
      return { ...state, pickupSlotIso: null };
    case "field":
      return { ...state, [action.key]: action.value };
    case "method":
      return { ...state, paymentMethod: action.value };
    case "hydrate":
      return action.draft;
    case "reset":
      return { ...EMPTY_DRAFT, extras: { ...EMPTY_EXTRAS } };
  }
}

/* ── Validation ──────────────────────────────────────────────────────── */

export type DetailsErrors = Partial<Record<DetailsField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Only the fields the customer must get right. Email is optional, so it is
 * validated only once something has been typed into it — flagging an empty
 * optional field is the classic way to make a form feel hostile.
 */
export function validateDetails(draft: OrderDraft): DetailsErrors {
  const errors: DetailsErrors = {};
  const e = orderCopy.fieldErrors;

  const name = draft.name.trim();
  if (!name) errors.name = e.nameRequired;
  else if (name.length < 2) errors.name = e.nameShort;

  const phone = draft.phone.trim();
  if (!phone) errors.phone = e.phoneRequired;
  else if (!isValidIsraeliMobile(phone)) errors.phone = e.phoneInvalid;

  const email = draft.email.trim();
  if (email && !EMAIL.test(email)) errors.email = e.emailInvalid;

  if (draft.notes.trim().length > 500) errors.notes = e.notesLong;

  return errors;
}

/** Whether a step has everything it needs. Drives forward navigation. */
export function isStepComplete(step: OrderStepId, draft: OrderDraft): boolean {
  switch (step) {
    case "quantity":
      return draft.units >= 1;
    case "addons":
      // Add-ons are entirely optional — the step is always satisfiable.
      return true;
    case "pickup":
      return Boolean(draft.pickupSlotIso);
    case "details":
      return Object.keys(validateDetails(draft)).length === 0;
    case "payment":
      return draft.paymentMethod !== null;
  }
}

/**
 * The furthest step the customer is allowed to reach. Jumping ahead via the
 * progress bar is fine as long as everything behind it is answered; jumping
 * past an unanswered step is not, because the order would be incomplete at
 * the point of payment.
 */
export function furthestReachableStep(draft: OrderDraft): number {
  for (let i = 0; i < ORDER_STEPS.length; i++) {
    if (!isStepComplete(ORDER_STEPS[i], draft)) return i;
  }
  return ORDER_STEPS.length - 1;
}

/* ── Persistence ─────────────────────────────────────────────────────── */

const STORAGE_KEY = "cafe-hakerem:jachnun-order:v1";

type StoredState = { draft: OrderDraft; stepIndex: number; savedAt: number };

/** Drafts older than this are stale — prices and pickup windows have moved on. */
const DRAFT_TTL_MS = 6 * 60 * 60 * 1000;

export function saveDraft(draft: OrderDraft, stepIndex: number): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredState = { draft, stepIndex, savedAt: Date.now() };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Private-browsing quota errors must never break the checkout. The flow
    // works fine without persistence; it just forgets on refresh.
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* see saveDraft */
  }
}

/**
 * Reads back a draft, re-validating every field rather than trusting what was
 * stored — sessionStorage is user-writable, and a stale draft can also carry
 * a pickup slot that has since passed. The slot is dropped here; the pickup
 * step re-offers whatever is currently open.
 */
export function loadDraft(): { draft: OrderDraft; stepIndex: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredState;
    if (!parsed?.draft || typeof parsed.savedAt !== "number") return null;
    if (Date.now() - parsed.savedAt > DRAFT_TTL_MS) {
      clearDraft();
      return null;
    }

    const d = parsed.draft;
    const units = clampUnits(Number(d.units));
    const extras = clampExtras(units, {
      tomato: Number(d.extras?.tomato ?? 0),
      olives: Number(d.extras?.olives ?? 0),
      egg: Number(d.extras?.egg ?? 0),
    });
    const draft: OrderDraft = {
      units,
      extras,
      pickupSlotIso: typeof d.pickupSlotIso === "string" ? d.pickupSlotIso : null,
      name: String(d.name ?? "").slice(0, 80),
      phone: String(d.phone ?? "").slice(0, 20),
      email: String(d.email ?? "").slice(0, 120),
      notes: String(d.notes ?? "").slice(0, 500),
      paymentMethod: null,
    };

    const maxIndex = furthestReachableStep(draft);
    const stepIndex = Math.min(Math.max(0, Number(parsed.stepIndex) || 0), maxIndex);
    return { draft, stepIndex };
  } catch {
    return null;
  }
}

/* ── Misc ────────────────────────────────────────────────────────────── */

/**
 * One key per checkout attempt. The API's unique constraint on it is what
 * turns a double-tapped pay button into a single order.
 */
export function newIdempotencyKey(): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return rand.slice(0, 32);
}

export function totalExtras(extras: Extras): number {
  return ADDON_KEYS.reduce((sum, key) => sum + (extras[key] ?? 0), 0);
}
