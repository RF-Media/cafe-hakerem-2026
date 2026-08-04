/**
 * ███  MOCK PAYMENT PROCESSOR — NOT A REAL ONE.  ███
 *
 * This module is the single seam between the checkout UI and a payment
 * provider. It fakes authorisation entirely in the browser: no network call
 * leaves the page, no card number is ever transmitted or stored, and the
 * "token" it returns is a base64 envelope any reader can decode.
 *
 * Replacing it with a real provider means:
 *   1. `processMockPayment()`  → the provider's client SDK (Stripe/Tranzila/
 *      Cardcom …) which returns an opaque token.
 *   2. `verifyMockPaymentToken()` → a server-side capture/confirm call
 *      against the provider's API using a secret key.
 *   3. Delete `TEST_CARDS` and the dev panel that renders it.
 *
 * Everything else in the flow — state machine, validation, persistence,
 * emails — is written against the real shape and does not change.
 *
 * The card details never leave this module. `MockPaymentResult` carries only
 * a brand and the last four digits, which is all the confirmation screen,
 * the café's notification and the future receipt are allowed to know.
 */

import { detectBrand, digitsOnly, last4 as last4Of, type CardBrand } from "@/lib/card";
import type { PaymentMethod } from "@/content/jachnun-order";

export type MockCardInput = {
  number: string;
  holder: string;
  expiry: string;
  cvc: string;
};

export type MockFailureReason =
  | "declined"
  | "insufficient_funds"
  | "expired_card"
  | "processor_error"
  | "cancelled";

export type MockPaymentRequest = {
  method: PaymentMethod;
  /** Amount to charge. `0` for cash orders — an authorisation, not a charge. */
  amountAgorot: number;
  card?: MockCardInput;
  idempotencyKey: string;
};

export type MockPaymentSuccess = {
  /** `approved` = money moved. `authorized_only` = card held, charge at pickup. */
  status: "approved" | "authorized_only";
  token: string;
  method: PaymentMethod;
  brand: CardBrand;
  last4: string;
  amountAgorot: number;
};

export type MockPaymentResult =
  | MockPaymentSuccess
  | { status: "requires_3ds"; challengeId: string }
  | { status: "failed"; reason: MockFailureReason };

/* ── Test cards ─────────────────────────────────────────────────────────
   Numbers are Luhn-valid so they pass client-side validation and reach the
   processor, which is the only way to exercise a decline path by hand. */

export type TestCard = {
  number: string;
  outcome: "approved" | MockFailureReason | "requires_3ds";
  label: string;
};

export const TEST_CARDS: TestCard[] = [
  { number: "4242424242424242", outcome: "approved", label: "אישור מיידי" },
  { number: "4000000000000002", outcome: "declined", label: "כרטיס נדחה" },
  { number: "4000000000009995", outcome: "insufficient_funds", label: "אין יתרה מספקת" },
  { number: "4000000000000069", outcome: "expired_card", label: "כרטיס פג תוקף" },
  { number: "4000000000003220", outcome: "requires_3ds", label: "אימות 3-D Secure" },
  { number: "4000000000000119", outcome: "processor_error", label: "תקלה בשירות התשלומים" },
];

const OUTCOME_BY_NUMBER = new Map(TEST_CARDS.map((c) => [c.number, c.outcome]));

/* ── Token envelope ─────────────────────────────────────────────────────
   A real provider returns something the server exchanges over a secret
   channel. This is a signed-looking but unsigned envelope; the server
   checks that the amount and method match what it independently computed,
   which is the property that actually matters for the demo. */

type TokenPayload = {
  v: 1;
  method: PaymentMethod;
  amountAgorot: number;
  status: "approved" | "authorized_only";
  brand: CardBrand;
  last4: string;
  issuedAt: number;
  key: string;
};

const TOKEN_PREFIX = "mock_tok_";
const TOKEN_TTL_MS = 15 * 60 * 1000;

function encode(payload: TokenPayload): string {
  const json = JSON.stringify(payload);
  const b64 =
    typeof btoa === "function"
      ? btoa(unescape(encodeURIComponent(json)))
      : Buffer.from(json, "utf8").toString("base64");
  return TOKEN_PREFIX + b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decode(token: string): TokenPayload | null {
  if (!token?.startsWith(TOKEN_PREFIX)) return null;
  const b64 = token.slice(TOKEN_PREFIX.length).replace(/-/g, "+").replace(/_/g, "/");
  try {
    const json =
      typeof atob === "function"
        ? decodeURIComponent(escape(atob(b64)))
        : Buffer.from(b64, "base64").toString("utf8");
    const parsed = JSON.parse(json) as TokenPayload;
    return parsed?.v === 1 ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Server-side check. Deliberately re-derives nothing from the client except
 * the token: the caller passes the amount **it** computed, and a mismatch is
 * a rejection. That is the one habit worth keeping when the real provider
 * lands — never charge what the browser says the order costs.
 */
export function verifyMockPaymentToken(
  token: string,
  expected: { method: PaymentMethod; amountAgorot: number },
  now: number = Date.now(),
):
  | { ok: true; status: "approved" | "authorized_only"; brand: CardBrand; last4: string }
  | { ok: false; error: "malformed" | "expired" | "amount_mismatch" | "method_mismatch" } {
  const payload = decode(token);
  if (!payload) return { ok: false, error: "malformed" };
  if (now - payload.issuedAt > TOKEN_TTL_MS) return { ok: false, error: "expired" };
  if (payload.method !== expected.method) return { ok: false, error: "method_mismatch" };
  if (payload.amountAgorot !== expected.amountAgorot) return { ok: false, error: "amount_mismatch" };
  return { ok: true, status: payload.status, brand: payload.brand, last4: payload.last4 };
}

/* ── Processing ─────────────────────────────────────────────────────── */

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Enough latency that the processing state is visible and worth designing. */
function processingDelay(): number {
  return 900 + Math.floor(Math.random() * 700);
}

/** Pending 3-DS challenges, keyed by the id handed to the UI. */
const challenges = new Map<string, { request: MockPaymentRequest; issuedAt: number }>();

function newId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function approve(request: MockPaymentRequest): MockPaymentSuccess {
  // Cash orders take a zero-amount authorisation: the card is verified and
  // held against a no-show, and the customer pays at the counter.
  const isCash = request.method === "cash";
  const status: MockPaymentSuccess["status"] = isCash ? "authorized_only" : "approved";
  const amountAgorot = isCash ? 0 : request.amountAgorot;
  const brand = request.card ? detectBrand(request.card.number) : "unknown";
  const last4 = request.card ? last4Of(request.card.number) : "";

  const token = encode({
    v: 1,
    method: request.method,
    amountAgorot,
    status,
    brand,
    last4,
    issuedAt: Date.now(),
    key: request.idempotencyKey,
  });

  return { status, token, method: request.method, brand, last4, amountAgorot };
}

/**
 * Wallet and Bit payments are approved by the caller's mock sheet before this
 * runs, so by the time they arrive here they succeed. Card and cash payments
 * are routed by the test-card table.
 */
export async function processMockPayment(request: MockPaymentRequest): Promise<MockPaymentResult> {
  await delay(processingDelay());

  if (request.method === "apple_pay" || request.method === "google_pay" || request.method === "bit") {
    return approve(request);
  }

  const number = digitsOnly(request.card?.number ?? "");
  const outcome = OUTCOME_BY_NUMBER.get(number) ?? "approved";

  if (outcome === "requires_3ds") {
    const challengeId = newId("chal");
    challenges.set(challengeId, { request, issuedAt: Date.now() });
    return { status: "requires_3ds", challengeId };
  }

  if (outcome !== "approved") return { status: "failed", reason: outcome };

  return approve(request);
}

/** Called when the customer completes (or abandons) the 3-DS sheet. */
export async function completeMock3DS(
  challengeId: string,
  approved: boolean,
): Promise<MockPaymentResult> {
  const pending = challenges.get(challengeId);
  challenges.delete(challengeId);
  if (!pending) return { status: "failed", reason: "processor_error" };

  await delay(600);
  if (!approved) return { status: "failed", reason: "cancelled" };
  return approve(pending.request);
}
