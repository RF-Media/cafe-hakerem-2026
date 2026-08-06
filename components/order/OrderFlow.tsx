"use client";

/**
 * The jachnun checkout.
 *
 * One client component orchestrating five steps and a confirmation: it owns
 * the draft, the step index, the pickup slots, the submit, and the mapping
 * from a server failure to the screen that can fix it. The steps themselves
 * are presentational.
 *
 * Three rules it exists to enforce:
 *   1. The total shown on step 1 is the total on the pay button, and the
 *      server recomputes it independently before charging anything.
 *   2. Every failure lands somewhere the customer can act — a taken slot goes
 *      back to step 3, a declined card stays on step 5 with the cart intact.
 *   3. Nothing is lost. The draft is mirrored to `sessionStorage` on every
 *      change; card details never are.
 */

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { OrderProgress } from "@/components/order/OrderProgress";
import { OrderSummary } from "@/components/order/OrderSummary";
import { StickyActionBar } from "@/components/order/StickyActionBar";
import { OrderStepQuantity } from "@/components/order/OrderStepQuantity";
import { OrderStepAddons } from "@/components/order/OrderStepAddons";
import { OrderStepPickup } from "@/components/order/OrderStepPickup";
import { OrderStepDetails } from "@/components/order/OrderStepDetails";
import { OrderStepPayment, failureMessage } from "@/components/order/OrderStepPayment";
import { OrderConfirmation } from "@/components/order/OrderConfirmation";
import { PaymentSheet } from "@/components/order/PaymentSheet";
import { usePayment } from "@/components/order/use-payment";
import { EMPTY_CARD } from "@/components/order/CardForm";
import {
  clearDraft,
  EMPTY_DRAFT,
  furthestReachableStep,
  loadDraft,
  newIdempotencyKey,
  orderReducer,
  saveDraft,
  validateDetails,
  type DetailsErrors,
  type DetailsField,
} from "@/components/order/state";
import { itemCount, priceOrder } from "@/lib/jachnun-pricing";
import { formatILS } from "@/lib/money";
import { getAvailableSlots, type Slot } from "@/lib/jachnun-cutoff";
import { DUR, EASE_OUT_SOFT } from "@/lib/motion";
import type { MockPaymentSuccess } from "@/lib/mock-payment";
import type { Receipt } from "@/lib/order-receipt";
import { business } from "@/content/business";
import { orderCopy, ORDER_STEPS, type OrderStepId } from "@/content/jachnun-order";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "done"; receipt: Receipt };

const STEP_META = ORDER_STEPS.map((id) => ({ id, label: orderCopy.steps[id].shortLabel }));

export function OrderFlow() {
  const [draft, dispatch] = useReducer(orderReducer, EMPTY_DRAFT);
  const [stepIndex, setStepIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [pickupError, setPickupError] = useState<string | undefined>();
  const [detailsErrors, setDetailsErrors] = useState<DetailsErrors>({});
  const [touchedDetails, setTouchedDetails] = useState<Set<DetailsField>>(new Set());
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });
  const [idempotencyKey, setIdempotencyKey] = useState(() => newIdempotencyKey());

  const headingRef = useRef<HTMLHeadingElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const contentPaneRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const step: OrderStepId = ORDER_STEPS[stepIndex];
  const stepCopy = orderCopy.steps[step];
  const priced = useMemo(
    () => priceOrder({ packageId: draft.packageId, extras: draft.extras }),
    [draft.packageId, draft.extras],
  );
  const count = itemCount(priced.units, draft.extras);
  const maxIndex = furthestReachableStep(draft);
  const selectedSlot = slots?.find((s) => s.iso === draft.pickupSlotIso) ?? null;

  /* ── Slots ──
     After mount only: the server renders in UTC, the visitor is in
     Asia/Jerusalem, and the two disagree about which Shabbat is on offer
     around the Thursday 18:00 cutoff. */
  const refreshSlots = useCallback(() => {
    const next = getAvailableSlots();
    setSlots(next);
    return next;
  }, []);

  useEffect(() => {
    const next = refreshSlots();
    const restored = loadDraft();
    if (restored) {
      // A restored slot may belong to a window that has since closed. Keep it
      // only if it is still on offer; otherwise step 3 re-asks.
      const stillOffered = next.some((s) => s.iso === restored.draft.pickupSlotIso);
      const draftToUse = stillOffered
        ? restored.draft
        : { ...restored.draft, pickupSlotIso: null };
      dispatch({ type: "hydrate", draft: draftToUse });
      setStepIndex(Math.min(restored.stepIndex, furthestReachableStep(draftToUse)));
    }
    setHydrated(true);
  }, [refreshSlots]);

  /* ── Persistence ── */
  useEffect(() => {
    if (!hydrated) return;
    if (submit.kind === "done") return;
    saveDraft(draft, stepIndex);
  }, [draft, stepIndex, hydrated, submit.kind]);

  /* ── Focus ──
     Moving focus to the new heading is what makes the flow usable by keyboard
     and screen reader: without it, focus stays on a button that no longer
     exists and the next Tab starts from the top of the document. */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    (confirmationRef.current ?? headingRef.current)?.focus();
  }, [stepIndex, submit.kind]);

  /* ── Navigation ── */
  const goTo = useCallback((index: number) => {
    setStepIndex(index);
    setSummaryOpen(false);
    // Mobile scrolls the document; the desktop app shell (md:) scrolls its
    // own content pane instead, since the shell itself no longer moves.
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
    contentPaneRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  function goBack() {
    if (stepIndex > 0) goTo(stepIndex - 1);
  }

  function goNext() {
    if (step === "pickup" && !draft.pickupSlotIso) {
      setPickupError(orderCopy.fieldErrors.slotRequired);
      return;
    }
    if (step === "details") {
      const errors = validateDetails(draft);
      if (Object.keys(errors).length > 0) {
        setDetailsErrors(errors);
        setTouchedDetails(new Set(Object.keys(errors) as DetailsField[]));
        return;
      }
    }
    if (stepIndex < ORDER_STEPS.length - 1) goTo(stepIndex + 1);
  }

  /* ── Details validation ──
     Errors appear on blur and are re-checked on every keystroke *after* the
     field has been touched, so a corrected field clears immediately but an
     untouched one is never pre-flagged. */
  function onDetailChange(key: DetailsField, value: string) {
    dispatch({ type: "field", key, value });
    if (touchedDetails.has(key)) {
      const next = validateDetails({ ...draft, [key]: value });
      setDetailsErrors((prev) => ({ ...prev, [key]: next[key] }));
    }
  }

  function onDetailBlur(key: DetailsField) {
    setTouchedDetails((prev) => new Set(prev).add(key));
    const next = validateDetails(draft);
    setDetailsErrors((prev) => ({ ...prev, [key]: next[key] }));
  }

  /* ── Submit ──
     Runs only after the processor has approved. A failure here leaves the
     customer on the payment step with the cart intact; a real provider would
     also void the authorisation at this point, which is the one line that
     changes when `lib/mock-payment.ts` is replaced. */
  const onAuthorized = useCallback(
    async (result: MockPaymentSuccess) => {
      setSubmit({ kind: "submitting" });
      try {
        const res = await fetch("/api/jachnun-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: draft.name,
            phone: draft.phone,
            email: draft.email || undefined,
            packageId: draft.packageId,
            extras: draft.extras,
            pickupSlot: draft.pickupSlotIso,
            notes: draft.notes || undefined,
            paymentMethod: result.method,
            paymentToken: result.token,
            totalAgorot: priced.totalAgorot,
            idempotencyKey,
          }),
        });

        const body = await res.json().catch(() => null);

        if (res.ok && body?.ok && body.receipt) {
          clearDraft();
          setSubmit({ kind: "done", receipt: body.receipt as Receipt });
          return;
        }

        const code: string | undefined = body?.code;
        const message: string = body?.error ?? orderCopy.errors.generic;

        if (code === "slot_unavailable") {
          // The Thursday 18:00 cutoff can pass while a customer fills the
          // form. Re-offer whatever is open now and send them back to step 3.
          dispatch({ type: "clearSlot" });
          const next = refreshSlots();
          setPickupError(next.length ? orderCopy.errors.slotTaken : orderCopy.errors.cutoffPassed);
          setSubmit({ kind: "idle" });
          goTo(ORDER_STEPS.indexOf("pickup"));
          return;
        }

        if (code === "rate_limited") {
          const retryAfter = Number(res.headers.get("Retry-After")) || 60;
          setSubmit({
            kind: "error",
            message: orderCopy.errors.rateLimited.replace("{seconds}", String(retryAfter)),
          });
          return;
        }

        setSubmit({ kind: "error", message });
      } catch {
        setSubmit({ kind: "error", message: orderCopy.errors.network });
      }
    },
    [draft, idempotencyKey, priced.totalAgorot, refreshSlots, goTo],
  );

  const payment = usePayment({
    totalAgorot: priced.totalAgorot,
    idempotencyKey,
    onAuthorized,
  });

  /* ── Order again ── */
  function orderAgain() {
    clearDraft();
    dispatch({ type: "reset" });
    setStepIndex(0);
    setSubmit({ kind: "idle" });
    setDetailsErrors({});
    setTouchedDetails(new Set());
    setPickupError(undefined);
    payment.reset();
    payment.setCard(EMPTY_CARD);
    payment.setCardErrors({});
    // A fresh key: the next order is a different order, and reusing the old
    // one would make the API hand back the previous receipt.
    setIdempotencyKey(newIdempotencyKey());
    refreshSlots();
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
    contentPaneRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }

  /* ── CTA ── */
  const busy = payment.busy || submit.kind === "submitting";
  const isPaymentStep = step === "payment";
  const payLater = draft.paymentMethod === "cash";

  const primaryLabel = isPaymentStep
    ? busy
      ? orderCopy.steps.payment.processing
      : payLater
        ? orderCopy.steps.payment.payCash
        : orderCopy.steps.payment.pay.replace("{total}", formatILS(priced.totalAgorot))
    : "next" in stepCopy
      ? stepCopy.next
      : "";

  /* Steps 3 and 4 keep their button enabled even when incomplete: a disabled
     "next" with no explanation is the classic dead end. Clicking runs the
     validation and shows what is missing. */
  const primaryDisabled = isPaymentStep ? busy || !draft.paymentMethod : false;

  function onPrimary() {
    if (!isPaymentStep) {
      goNext();
      return;
    }
    if (!draft.paymentMethod) return;
    setSubmit({ kind: "idle" });
    payment.start(draft.paymentMethod);
  }

  /* ── Payment error surface ── */
  const paymentError =
    submit.kind === "error"
      ? submit.message
      : payment.phase.kind === "failed"
        ? failureMessage(payment.phase.reason)
        : undefined;

  /* ── Confirmation ── */
  if (submit.kind === "done") {
    return (
      <>
        <OrderHeader />
        {/* The focus target is this wrapper, not a second heading — the
            confirmation renders the page's only `<h1>` itself. */}
        <div
          ref={confirmationRef}
          tabIndex={-1}
          className="mx-auto max-w-container px-6 md:px-10 lg:px-16 py-10 md:py-16 outline-none"
        >
          <OrderConfirmation receipt={submit.receipt} onOrderAgain={orderAgain} />
        </div>
      </>
    );
  }

  return (
    <>
      {/* md and up: a fixed-height app shell (header / scrollable content /
          sticky CTA row) so the primary action is always in the fold no
          matter how tall a step's content or the summary get. Mobile keeps
          normal document scroll — StickyActionBar already pins its CTA. */}
      <div className="md:flex md:h-screen-s md:flex-col md:overflow-hidden">
        <OrderHeader>
          <OrderProgress
            steps={STEP_META}
            currentIndex={stepIndex}
            maxIndex={maxIndex}
            onJump={goTo}
          />
        </OrderHeader>

        <div
          ref={contentPaneRef}
          className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-16 py-6 md:py-10 md:flex-1 md:min-h-0 md:overflow-y-auto"
        >
        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10 lg:gap-14">
          <div className="min-w-0">
            <header>
              {/* Desktop only: on a phone the progress rail in the header
                  already says "שלב 3 מתוך 5", and printing it twice on a
                  375px screen is just noise. */}
              <p className="hidden md:block type-index text-brass-ink">
                {orderCopy.nav.stepOf
                  .replace("{current}", String(stepIndex + 1))
                  .replace("{total}", String(ORDER_STEPS.length))}
              </p>
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="md:mt-2 type-display text-3xl md:text-5xl text-espresso outline-none"
              >
                {stepCopy.title}
              </h1>
              <p className="mt-3 type-lede text-base md:text-lg text-espresso-soft max-w-prose-he">
                {stepCopy.lede}
              </p>
            </header>

            {/* No `aria-live` here: focus moves to the step heading on every
                change, which announces the new screen without re-reading the
                entire step body on each keystroke inside it. */}
            <div className="mt-6 md:mt-8">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={step}
                  data-motion="order-step"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: DUR.base, ease: EASE_OUT_SOFT }}
                >
                  {step === "quantity" ? (
                    <OrderStepQuantity
                      selectedId={draft.packageId}
                      onSelect={(id) => dispatch({ type: "package", id })}
                    />
                  ) : null}

                  {step === "addons" ? (
                    <OrderStepAddons
                      units={priced.units}
                      extras={draft.extras}
                      onChange={(key, value) => dispatch({ type: "extra", key, value })}
                    />
                  ) : null}

                  {step === "pickup" ? (
                    <OrderStepPickup
                      slots={slots}
                      selectedIso={draft.pickupSlotIso}
                      onSelect={(iso) => {
                        setPickupError(undefined);
                        dispatch({ type: "slot", iso });
                      }}
                      error={pickupError}
                    />
                  ) : null}

                  {step === "details" ? (
                    <OrderStepDetails
                      draft={draft}
                      errors={detailsErrors}
                      onChange={onDetailChange}
                      onBlur={onDetailBlur}
                    />
                  ) : null}

                  {step === "payment" ? (
                    <OrderStepPayment
                      method={draft.paymentMethod}
                      onSelectMethod={(value) => {
                        payment.reset();
                        setSubmit({ kind: "idle" });
                        dispatch({ type: "method", value });
                      }}
                      onExpress={(value) => {
                        payment.reset();
                        setSubmit({ kind: "idle" });
                        dispatch({ type: "method", value });
                        payment.start(value);
                      }}
                      card={payment.card}
                      onCardChange={payment.setCard}
                      cardErrors={payment.cardErrors}
                      onCardErrorsChange={payment.setCardErrors}
                      busy={busy}
                      error={paymentError}
                    />
                  ) : null}
                </m.div>
              </AnimatePresence>
            </div>

            {/* Desktop actions: plain flow directly under the step content —
                with the condensed step layout the whole column now fits one
                fold, so a sticky bottom bar just left dead space between the
                content and the button. On a phone these live in the sticky
                bar instead. */}
            <div className="hidden md:flex items-center gap-4 mt-8 pt-6 border-t border-stroke">
              <Button
                variant="primary"
                size="xl"
                onClick={onPrimary}
                disabled={primaryDisabled}
                className="min-w-[16rem]"
              >
                {primaryLabel}
              </Button>
              {stepIndex > 0 ? (
                <Button variant="ghost" size="lg" onClick={goBack} ariaLabel={orderCopy.nav.backAria}>
                  {orderCopy.nav.back}
                </Button>
              ) : null}
              {step === "addons" ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="text-sm text-espresso-soft underline underline-offset-4 hover:text-espresso transition-colors"
                >
                  {orderCopy.steps.addons.skip}
                </button>
              ) : null}
            </div>

            {/* Mobile back link — the sticky bar holds only the primary action. */}
            {stepIndex > 0 ? (
              <div className="md:hidden mt-8">
                <button
                  type="button"
                  onClick={goBack}
                  className="min-h-[44px] text-sm text-espresso-soft underline underline-offset-4"
                >
                  {orderCopy.nav.back}
                </button>
              </div>
            ) : null}
          </div>

          {/* Desktop summary. Capped and independently scrollable — like
              StickyActionBar's mobile summary sheet — so a long line list
              (extra add-ons) scrolls inside the card instead of pushing the
              shell taller than the viewport. */}
          <aside className="hidden lg:block lg:min-h-0">
            <div className="lg:sticky lg:top-4 lg:max-h-[65svh] lg:overflow-y-auto rounded-card border border-stroke bg-cream-3 p-6 shadow-sm">
              <OrderSummary
                priced={priced}
                pickupLabel={selectedSlot?.label ?? null}
                itemCount={count}
                payLater={payLater}
                onEditPickup={() => goTo(ORDER_STEPS.indexOf("pickup"))}
              />
            </div>
          </aside>
        </div>
        </div>
      </div>

      {/* Bottom padding so the sticky bar never covers the last element. */}
      <div className="md:hidden h-[8.5rem]" aria-hidden />

      <StickyActionBar
        totalAgorot={priced.totalAgorot}
        itemCount={count}
        ctaLabel={primaryLabel}
        onCta={onPrimary}
        ctaDisabled={primaryDisabled}
        expanded={summaryOpen}
        onToggle={() => setSummaryOpen((v) => !v)}
      >
        <OrderSummary
          priced={priced}
          pickupLabel={selectedSlot?.label ?? null}
          itemCount={count}
          payLater={payLater}
          compact
          onEditPickup={() => goTo(ORDER_STEPS.indexOf("pickup"))}
        />
      </StickyActionBar>

      {/* Wallet sheet */}
      <PaymentSheet
        open={payment.phase.kind === "sheet"}
        title={
          payment.phase.kind === "sheet"
            ? orderCopy.methods[payment.phase.method].sheetTitle
            : ""
        }
        amountAgorot={priced.totalAgorot}
        approveLabel={orderCopy.wallet.approve}
        cancelLabel={orderCopy.wallet.cancel}
        busy={busy}
        busyLabel={orderCopy.wallet.processing}
        onApprove={payment.approveSheet}
        onCancel={payment.cancelSheet}
      />

      {/* 3-D Secure challenge */}
      <PaymentSheet
        open={payment.phase.kind === "challenge"}
        title={orderCopy.threeDS.title}
        body={orderCopy.threeDS.body}
        amountAgorot={priced.totalAgorot}
        approveLabel={orderCopy.threeDS.approve}
        cancelLabel={orderCopy.threeDS.cancel}
        busy={payment.phase.kind === "challenge" && payment.phase.busy}
        busyLabel={orderCopy.wallet.processing}
        onApprove={() => payment.resolveChallenge(true)}
        onCancel={() => payment.resolveChallenge(false)}
      />
    </>
  );
}

/* ── Chrome ──────────────────────────────────────────────────────────── */

function OrderHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-stroke bg-cream/95 backdrop-blur print:hidden">
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16 py-3 md:py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0">
            <Link
              href="/jachnun"
              className="type-title text-base md:text-lg text-espresso hover:text-olive transition-colors"
            >
              {orderCopy.chrome.wordmark}
            </Link>
            <span className="ms-2 text-sm text-espresso-soft">{orderCopy.chrome.subtitle}</span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href={`tel:${business.phone.tel}`}
              className="hidden sm:inline text-sm text-espresso-soft hover:text-espresso transition-colors"
            >
              {business.phone.display}
            </a>
            <Link
              href="/jachnun"
              aria-label={orderCopy.chrome.exitAria}
              className="text-sm text-espresso-soft hover:text-espresso transition-colors"
            >
              {orderCopy.chrome.exit}
            </Link>
          </div>
        </div>

        {/* One instance, both breakpoints. Rendering it twice (once per
            breakpoint slot) put two `role="progressbar"` nodes in the
            accessibility tree, one of them permanently hidden. */}
        {children ? <div className="mt-3">{children}</div> : null}
      </div>
    </header>
  );
}
