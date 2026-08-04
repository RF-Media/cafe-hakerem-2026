"use client";

/**
 * The payment attempt: card state, wallet/3-DS sheets, and the call into the
 * mock processor.
 *
 * Kept out of `OrderFlow` because it is a state machine of its own, and
 * because it is the part that gets deleted when a real provider arrives —
 * everything it owns (card fields, sheet stages, failure reasons) is
 * provider-shaped and nothing else in the flow depends on its internals.
 *
 * Card values live here and only here. They are never lifted into the draft
 * and never written to `sessionStorage`.
 */

import { useCallback, useState } from "react";
import {
  completeMock3DS,
  processMockPayment,
  type MockFailureReason,
  type MockPaymentSuccess,
} from "@/lib/mock-payment";
import { EMPTY_CARD, validateCard, type CardErrors, type CardValues } from "@/components/order/CardForm";
import type { PaymentMethod } from "@/content/jachnun-order";

export type PaymentPhase =
  | { kind: "idle" }
  /** A wallet sheet is open, waiting for the customer to approve or cancel. */
  | { kind: "sheet"; method: PaymentMethod }
  /** The processor is working. The form is locked and the CTA is busy. */
  | { kind: "processing" }
  /** The bank wants a second factor. */
  | { kind: "challenge"; challengeId: string; busy: boolean }
  | { kind: "failed"; reason: MockFailureReason };

type UsePaymentArgs = {
  /** Amount to charge. Cash orders authorise ₪0 — handled by the processor. */
  totalAgorot: number;
  idempotencyKey: string;
  /** Called once the processor approves. The flow persists the order here. */
  onAuthorized: (result: MockPaymentSuccess) => void | Promise<void>;
};

export function usePayment({ totalAgorot, idempotencyKey, onAuthorized }: UsePaymentArgs) {
  const [phase, setPhase] = useState<PaymentPhase>({ kind: "idle" });
  const [card, setCard] = useState<CardValues>(EMPTY_CARD);
  const [cardErrors, setCardErrors] = useState<CardErrors>({});

  const needsCard = useCallback(
    (method: PaymentMethod) => method === "card" || method === "cash",
    [],
  );

  const run = useCallback(
    async (method: PaymentMethod) => {
      setPhase({ kind: "processing" });
      const result = await processMockPayment({
        method,
        amountAgorot: totalAgorot,
        card: needsCard(method) ? card : undefined,
        idempotencyKey,
      });

      if (result.status === "requires_3ds") {
        setPhase({ kind: "challenge", challengeId: result.challengeId, busy: false });
        return;
      }
      if (result.status === "failed") {
        setPhase({ kind: "failed", reason: result.reason });
        return;
      }
      await onAuthorized(result);
      // Back to idle either way. On success the flow has already swapped in
      // the confirmation screen; on a persistence failure the pay button has
      // to be live again so the customer can retry.
      setPhase({ kind: "idle" });
    },
    [card, idempotencyKey, needsCard, onAuthorized, totalAgorot],
  );

  /**
   * Entry point for the pay button and the express wallet buttons. Wallets
   * open their sheet first; card and cash validate the fields first, because
   * a decline that was really a typo is a decline the customer blames on us.
   */
  const start = useCallback(
    (method: PaymentMethod) => {
      if (needsCard(method)) {
        const errors = validateCard(card);
        if (Object.keys(errors).length > 0) {
          setCardErrors(errors);
          return { ok: false as const, errors };
        }
        void run(method);
        return { ok: true as const };
      }
      setPhase({ kind: "sheet", method });
      return { ok: true as const };
    },
    [card, needsCard, run],
  );

  /** Wallet sheet approved. */
  const approveSheet = useCallback(() => {
    if (phase.kind !== "sheet") return;
    void run(phase.method);
  }, [phase, run]);

  /** 3-DS challenge resolved, one way or the other. */
  const resolveChallenge = useCallback(
    async (approved: boolean) => {
      if (phase.kind !== "challenge") return;
      setPhase({ kind: "challenge", challengeId: phase.challengeId, busy: true });
      const result = await completeMock3DS(phase.challengeId, approved);
      if (result.status === "failed") {
        setPhase({ kind: "failed", reason: result.reason });
        return;
      }
      if (result.status === "requires_3ds") {
        setPhase({ kind: "failed", reason: "processor_error" });
        return;
      }
      await onAuthorized(result);
      setPhase({ kind: "idle" });
    },
    [onAuthorized, phase],
  );

  const cancelSheet = useCallback(() => {
    setPhase({ kind: "failed", reason: "cancelled" });
  }, []);

  /** Back to a state where the customer can try again. */
  const reset = useCallback(() => setPhase({ kind: "idle" }), []);

  const fail = useCallback((reason: MockFailureReason) => setPhase({ kind: "failed", reason }), []);

  const busy = phase.kind === "processing" || (phase.kind === "challenge" && phase.busy);

  return {
    phase,
    busy,
    card,
    setCard,
    cardErrors,
    setCardErrors,
    start,
    approveSheet,
    cancelSheet,
    resolveChallenge,
    reset,
    fail,
    needsCard,
  };
}
