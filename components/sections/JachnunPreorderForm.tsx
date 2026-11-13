"use client";

/**
 * Phase-1 pre-order on /jachnun: jachnun and burekas, a pickup window and
 * contact details, in three short steps. Built to fit the fold:
 *
 * - Phones: the steps stack, and the order summary + primary action sit in a
 *   bar pinned to the bottom of the card, so the total is never out of sight.
 * - Desktop (lg): the card is two columns, the step on the start side and the
 *   summary + action as a fixed column on the end side, sized so every step
 *   fits a 13" laptop (≈1280×680 viewport) under the nav without scrolling.
 *
 * Completed steps in the progress row show what was chosen, underlined with
 * an edit mark, and take you back to that step.
 *
 * No payment: a rep calls after submission to confirm and take payment. The
 * five-step checkout in components/order/ is phase 2 (CHECKOUT_ENABLED); this
 * form only borrows its details validation so the two agree on what a valid
 * name/phone/email is.
 *
 * Slots are computed after mount, never during render: the server renders in
 * UTC and around the Friday 16:00 cutoff it disagrees with the visitor about
 * which Shabbat is on offer.
 *
 * Measurement (docs/analytics/measurement-plan.md): form_view → form_start →
 * order_item_change → form_step (pickup, details) → generate_lead, with
 * form_error per invalid field or rejected submission. No names, phones or
 * emails ever reach analytics.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FormField } from "@/components/ui/FormField";
import { CafeImage } from "@/components/ui/CafeImage";
import { IconArrow, IconCheck, IconEdit } from "@/components/ui/icons";
import { EMPTY_DRAFT, validateDetails, type DetailsField } from "@/components/order/state";
import { getAvailableSlots, type Slot } from "@/lib/jachnun-cutoff";
import { formatILS } from "@/lib/money";
import { track, type AnalyticsParams } from "@/lib/analytics";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import {
  PREORDER_ITEM_IDS,
  PREORDER_MAX,
  preorderLines,
  preorderTotalAgorot,
  preorderUnits,
  unitAgorot,
  type PreorderItemId,
  type PreorderLine,
  type PreorderQuantities,
} from "@/lib/preorder";
import { jachnun, jachnunBulkThresholdUnits } from "@/content/jachnun";
import { business } from "@/content/business";

const copy = jachnun.preorder;
const STEPS = copy.steps;
const LAST = STEPS.length - 1;
const FORM_NAME = "jachnun_preorder";
const STORAGE_KEY = "hakerem.jachnun-preorder.v1";
const START_QTY: PreorderQuantities = { jachnun: 1, burekas: 0 };

type Details = Record<DetailsField, string>;
type FieldKey = "items" | "slot" | DetailsField;
type Errors = Partial<Record<FieldKey, string>>;

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "done"; reference: string; slot: Slot | null; lines: PreorderLine[]; totalAgorot: number };

const EMPTY_DETAILS: Details = { name: "", phone: "", email: "", notes: "" };
const DETAIL_ORDER: DetailsField[] = ["name", "phone", "email", "notes"];

const checkDetails = (d: Details) => validateDetails({ ...EMPTY_DRAFT, ...d });
const slotStart = (slot: Slot | null) => slot?.window.split("–")[0];
const clampQty = (id: PreorderItemId, n: unknown) =>
  Math.min(PREORDER_MAX[id], Math.max(0, Math.round(Number(n) || 0)));

const SERVER_ERROR_TYPE: Record<string, string> = {
  rate_limited: "rate_limit",
  validation: "validation",
  slot_unavailable: "slot_unavailable",
  send_failed: "server",
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-cream-3";

export function JachnunPreorderForm() {
  const [step, setStep] = useState(0);
  const [qty, setQty] = useState<PreorderQuantities>(START_QTY);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotIso, setSlotIso] = useState<string | null>(null);
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [notesOpen, setNotesOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [restored, setRestored] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const started = useRef(false);
  const qtyRef = useRef(qty);
  qtyRef.current = qty;
  const pendingItems = useRef<Partial<Record<PreorderItemId, number>>>({});
  const reduced = useReducedMotion();

  const lines = preorderLines(qty);
  const totalAgorot = preorderTotalAgorot(qty);
  const slot = slots?.find((s) => s.iso === slotIso) ?? null;
  const submitting = status.kind === "submitting";

  // Slots, then whatever this tab had already filled in (a reload or a
  // detour to the menu shouldn't cost the visitor their order).
  useEffect(() => {
    const available = getAvailableSlots();
    setSlots(available);
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved && typeof saved === "object") {
        if (saved.qty) {
          const q = { jachnun: clampQty("jachnun", saved.qty.jachnun), burekas: clampQty("burekas", saved.qty.burekas) };
          if (preorderUnits(q) > 0) setQty(q);
        }
        if (available.some((s) => s.iso === saved.slotIso)) setSlotIso(saved.slotIso);
        if (saved.details) {
          const d = { ...EMPTY_DETAILS };
          for (const k of DETAIL_ORDER) if (typeof saved.details[k] === "string") d[k] = saved.details[k];
          setDetails(d);
          if (d.notes) setNotesOpen(true);
        }
      }
    } catch {
      /* storage blocked or corrupt: start fresh */
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored || status.kind === "done") return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ qty, slotIso, details }));
    } catch {
      /* private mode */
    }
  }, [restored, qty, slotIso, details, status.kind]);

  // form_view: the card was actually seen, once per page view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        track("form_view", { form_name: FORM_NAME });
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const timers = pendingItems.current;
    return () => Object.values(timers).forEach((t) => window.clearTimeout(t));
  }, []);

  // After a step change: if the card isn't fully in view, bring its top under
  // the nav; then move focus to the new step's heading for screen readers.
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    const el = rootRef.current;
    if (!el) return;
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 68;
    const rect = el.getBoundingClientRect();
    const room = window.innerHeight - nav;
    const offscreen =
      rect.height <= room
        ? rect.top < nav || rect.bottom > window.innerHeight
        : rect.top < nav || rect.top > nav + room * 0.3;
    if (offscreen) window.scrollBy({ top: rect.top - nav - 12, behavior: reduced ? "instant" : "smooth" });
    (status.kind === "done" ? doneRef : headingRef).current?.focus({ preventScroll: true });
  }, [step, status.kind, reduced]);

  function orderParams(q: PreorderQuantities = qtyRef.current): AnalyticsParams {
    return {
      form_name: FORM_NAME,
      jachnun_qty: q.jachnun,
      burekas_qty: q.burekas,
      value: preorderTotalAgorot(q) / 100,
      currency: "ILS",
    };
  }

  function markStarted() {
    if (started.current) return;
    started.current = true;
    track("form_start", { form_name: FORM_NAME });
  }

  function sendItemChange(id: PreorderItemId) {
    delete pendingItems.current[id];
    track("order_item_change", { ...orderParams(), item_id: id });
  }

  // Taps are coalesced: five quick "+" presses are one change to 5, not five events.
  function flushItemChanges() {
    for (const id of PREORDER_ITEM_IDS) {
      const t = pendingItems.current[id];
      if (t === undefined) continue;
      window.clearTimeout(t);
      sendItemChange(id);
    }
  }

  function reportInvalid(fields: FieldKey[]) {
    for (const f of fields) track("form_error", { form_name: FORM_NAME, error_type: "validation", form_field: f });
  }

  function goTo(i: number) {
    moved.current = true;
    setStep(i);
  }

  function changeQty(id: PreorderItemId, delta: number) {
    markStarted();
    setQty((q) => ({ ...q, [id]: clampQty(id, q[id] + delta) }));
    setErrors((e) => ({ ...e, items: undefined }));
    window.clearTimeout(pendingItems.current[id]);
    pendingItems.current[id] = window.setTimeout(() => sendItemChange(id), 800);
  }

  function chooseSlot(iso: string) {
    markStarted();
    setSlotIso(iso);
    setErrors((e) => ({ ...e, slot: undefined }));
  }

  function change(key: DetailsField, value: string) {
    const next = { ...details, [key]: value };
    setDetails(next);
    if (errors[key]) setErrors((e) => ({ ...e, [key]: checkDetails(next)[key] }));
  }

  // Blur only flags what was typed wrong; "required" waits for submit.
  function blur(key: DetailsField) {
    if (!details[key].trim()) return;
    setErrors((e) => ({ ...e, [key]: checkDetails(details)[key] }));
  }

  function focusField(key: DetailsField) {
    const el = rootRef.current?.querySelector<HTMLElement>(`#jp-${key}`);
    if (!el) return;
    el.focus({ preventScroll: true });
    const r = el.getBoundingClientRect();
    if (r.top < 100 || r.bottom > window.innerHeight - 200) {
      el.scrollIntoView({ block: "center", behavior: reduced ? "instant" : "smooth" });
    }
  }

  function advance() {
    const id = STEPS[step].id;
    if (id === "items" && preorderUnits(qty) === 0) {
      setErrors((e) => ({ ...e, items: copy.items.empty }));
      reportInvalid(["items"]);
      return;
    }
    if (id === "pickup" && !slotIso) {
      setErrors((e) => ({ ...e, slot: copy.pickup.required }));
      reportInvalid(["slot"]);
      return;
    }
    flushItemChanges();
    const next = step + 1;
    track("form_step", {
      ...orderParams(),
      form_step: STEPS[next].id,
      pickup_window: next > 1 ? slotStart(slot) : undefined,
    });
    goTo(next);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < LAST) return advance();
    if (submitting) return;

    const found = checkDetails(details);
    setErrors((er) => ({ ...er, name: found.name, phone: found.phone, email: found.email, notes: found.notes }));
    const invalid = DETAIL_ORDER.filter((k) => found[k]);
    if (invalid.length) {
      reportInvalid(invalid);
      return focusField(invalid[0]);
    }
    if (preorderUnits(qty) === 0) return goTo(0);
    if (!slotIso) return goTo(1);

    flushItemChanges();
    setStatus({ kind: "submitting" });
    try {
      const r = await fetch("/api/jachnun-preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...details, quantity: qty.jachnun, burekas: qty.burekas, pickupSlot: slotIso }),
      });
      const j = await r.json().catch(() => null);

      if (r.ok && j?.ok) {
        track("generate_lead", { ...orderParams(), pickup_window: slotStart(slot) });
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        moved.current = true;
        setStatus({ kind: "done", reference: j.reference, slot, lines, totalAgorot });
        return;
      }

      track("form_error", { form_name: FORM_NAME, error_type: SERVER_ERROR_TYPE[j?.code] ?? "server" });

      // The cutoff passed while the form was open: offer the new Shabbat.
      if (j?.code === "slot_unavailable") {
        setSlots(getAvailableSlots());
        setSlotIso(null);
        setErrors((er) => ({ ...er, slot: j.error }));
        setStatus({ kind: "idle" });
        return goTo(1);
      }

      setStatus({ kind: "error", message: j?.error ?? copy.generic });
    } catch {
      track("form_error", { form_name: FORM_NAME, error_type: "network" });
      setStatus({ kind: "error", message: copy.network });
    }
  }

  function orderAgain() {
    setQty(START_QTY);
    setSlotIso(null);
    setErrors({});
    setStatus({ kind: "idle" });
    started.current = false;
    goTo(0);
  }

  if (status.kind === "done") {
    return (
      <div ref={rootRef}>
        <Header compact={false} />
        <div className="step-in px-4 py-7 sm:px-6 lg:px-8">
          <Success status={status} doneRef={doneRef} onAgain={orderAgain} />
        </div>
      </div>
    );
  }

  const current = STEPS[step];
  const itemsChosen = lines.map((l) => `${l.qty} ${copy.items[l.id].short}`).join(" · ");
  const summaryText = lines.length ? lines.map((l) => `${l.name} × ${l.qty}`).join(" · ") : copy.summary.empty;
  const slotLabel = slot ? (
    <>
      {slot.day} · <bdi dir="ltr">{slot.window}</bdi>
    </>
  ) : null;

  return (
    <div ref={rootRef}>
      <form
        onSubmit={onSubmit}
        method="post"
        noValidate
        aria-labelledby="jp-step-title"
        className="lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem]"
      >
        <div className="lg:col-span-2">
          <Header compact={step > 0} />
        </div>

        {/* The step */}
        <div className="min-w-0 px-4 pt-4 pb-5 sm:px-6 lg:px-8 lg:pt-5 lg:pb-7">
          <noscript>
            <p className="mb-4 rounded-input border border-stroke bg-cream px-4 py-3 text-sm text-espresso-soft">
              טופס ההזמנה דורש JavaScript. אפשר להזמין ג&apos;חנון מקפה הכרם גם בטלפון:{" "}
              <a href={`tel:${business.phone.tel}`} className="text-olive underline underline-offset-4">
                {business.phone.display}
              </a>
              .
            </p>
          </noscript>

          <Progress
            step={step}
            chosen={[itemsChosen, slot ? <bdi dir="ltr">{slotStart(slot)}</bdi> : null, null]}
            chosenText={[itemsChosen, slotStart(slot) ?? ""]}
            onJump={goTo}
          />

          <div key={step} className="step-in mt-3 lg:mt-4">
            <div className="flex min-h-[44px] items-center justify-between gap-3">
              <h3
                id="jp-step-title"
                ref={headingRef}
                tabIndex={-1}
                className="type-sub text-xl md:text-2xl text-espresso focus:outline-none focus-visible:shadow-none"
              >
                <span className="sr-only">{copy.stepOf(step + 1, STEPS.length)} </span>
                {current.title}
              </h3>
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => goTo(step - 1)}
                  className={`-me-2 inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-pill px-3 text-sm
                             text-olive transition-colors duration-fast hover:bg-cream-2 ${focusRing}`}
                >
                  {/* "Back" points right in Hebrew. */}
                  <IconArrow className="h-4 w-4 rotate-180" />
                  {copy.back}
                </button>
              ) : null}
            </div>

            {current.id === "items" ? (
              <ItemsStep qty={qty} error={errors.items} onChange={changeQty} />
            ) : current.id === "pickup" ? (
              <PickupStep slots={slots} slotIso={slotIso} error={errors.slot} onChoose={chooseSlot} />
            ) : (
              <div className="mt-2 grid gap-x-4 gap-y-2 sm:grid-cols-2" onFocusCapture={markStarted}>
                <FormField
                  id="jp-name"
                  label={copy.details.name.label}
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder={copy.details.name.placeholder}
                  maxLength={80}
                  value={details.name}
                  onChange={(v) => change("name", v)}
                  onBlur={() => blur("name")}
                  error={errors.name}
                />
                <FormField
                  id="jp-phone"
                  label={copy.details.phone.label}
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder={copy.details.phone.placeholder}
                  hint={copy.details.phone.hint}
                  maxLength={20}
                  value={details.phone}
                  onChange={(v) => change("phone", v)}
                  onBlur={() => blur("phone")}
                  error={errors.phone}
                />
                <FormField
                  id="jp-email"
                  label={copy.details.email.label}
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder={copy.details.email.placeholder}
                  hint={copy.details.email.hint}
                  maxLength={120}
                  value={details.email}
                  onChange={(v) => change("email", v)}
                  onBlur={() => blur("email")}
                  error={errors.email}
                />
                {notesOpen ? (
                  <FormField
                    id="jp-notes"
                    label={copy.details.notes.label}
                    name="notes"
                    type="textarea"
                    rows={2}
                    hint={copy.details.notes.hint}
                    maxLength={500}
                    value={details.notes}
                    onChange={(v) => change("notes", v)}
                    onBlur={() => blur("notes")}
                    error={errors.notes}
                  />
                ) : (
                  <div className="sm:pt-7">
                    <button
                      type="button"
                      onClick={() => {
                        setNotesOpen(true);
                        requestAnimationFrame(() => rootRef.current?.querySelector<HTMLElement>("#jp-notes")?.focus());
                      }}
                      className={`inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-input border border-dashed
                                 border-stroke px-4 text-sm font-medium text-olive transition-colors duration-fast
                                 hover:border-olive hover:bg-cream ${focusRing}`}
                    >
                      {copy.details.notesToggle}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* The live order. Phones: pinned to the bottom of the viewport while
            the card is on screen (MobileBar steps aside: data-hide-mobile-bar on
            the page's #order wrapper). Desktop: the card's end column. */}
        <div
          className="sticky bottom-0 z-10 rounded-b-card border-t border-stroke bg-cream-3 px-4 pt-3
                     pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-10px_24px_-16px_hsl(var(--espresso-deep)/0.35)]
                     sm:px-6 lg:static lg:z-auto lg:flex lg:flex-col lg:rounded-b-none lg:rounded-ee-card lg:border-t-0
                     lg:border-s lg:bg-cream lg:p-6 lg:shadow-none"
        >
          <p className="sr-only" aria-live="polite">
            {summaryText}. {copy.total}: {formatILS(totalAgorot)}
          </p>

          {/* Phones: one compact row. The end padding clears the accessibility tab. */}
          <div className="flex items-end justify-between gap-4 pe-8 lg:hidden" aria-hidden>
            <div className="min-w-0">
              <p className="text-sm font-medium leading-snug text-espresso">{summaryText}</p>
              <p className="mt-0.5 text-xs text-espresso-soft">
                {copy.summary.pickup}: {slotLabel ?? copy.summary.pickupPending}
              </p>
            </div>
            <div className="shrink-0 text-end">
              <p className="text-xs text-espresso-soft">{copy.total}</p>
              <p className="type-sub text-2xl leading-none text-espresso tabular-nums">{formatILS(totalAgorot)}</p>
            </div>
          </div>

          {/* Desktop: the full order, line by line. */}
          <div className="hidden lg:block" aria-hidden>
            <p className="type-sub text-lg text-espresso">{copy.summary.heading}</p>
            {lines.length ? (
              <ul className="mt-3 space-y-2 text-sm">
                {lines.map((l) => (
                  <li key={l.id} className="flex items-baseline justify-between gap-3">
                    <span className="text-espresso">
                      {l.name} <span className="text-espresso-soft tabular-nums">× {l.qty}</span>
                    </span>
                    <span className="tabular-nums text-espresso">{formatILS(l.totalAgorot)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-espresso-soft">{copy.summary.empty}</p>
            )}
            <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-stroke pt-3 text-sm">
              <span className="text-espresso-soft">{copy.summary.pickup}</span>
              <span className="text-end text-espresso">{slotLabel ?? copy.summary.pickupPending}</span>
            </div>
          </div>

          <div className="hidden lg:mt-auto lg:block lg:pt-5" aria-hidden>
            <div className="flex items-baseline justify-between gap-3 border-t border-stroke pt-4">
              <span className="text-sm text-espresso-soft">{copy.total}</span>
              <span className="type-sub text-3xl text-espresso tabular-nums">{formatILS(totalAgorot)}</span>
            </div>
          </div>

          {status.kind === "error" ? (
            <div
              role="alert"
              className="mt-3 rounded-input border border-jachnun/40 bg-jachnun/[0.07] px-4 py-3 text-sm text-jachnun"
            >
              <p>{status.message}</p>
              <p className="mt-1">
                {copy.callPrefix}{" "}
                <a href={`tel:${business.phone.tel}`} className="font-medium underline underline-offset-4">
                  {business.phone.display}
                </a>
              </p>
            </div>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            className="mt-3 w-full lg:mt-4"
            icon={submitting ? undefined : <IconArrow />}
          >
            {step < LAST ? copy.next[current.id as "items" | "pickup"] : submitting ? copy.submitting : copy.submit}
          </Button>
          <p className={`mt-2 text-center text-xs text-espresso-soft ${step === LAST ? "" : "hidden lg:block"}`}>
            {copy.payNote}
          </p>
        </div>
      </form>
    </div>
  );
}

/* ─── Chrome ────────────────────────────────────────────────────── */

/** Terracotta header. On phones, past step 1, it shrinks to the title alone. */
function Header({ compact }: { compact: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-t-card bg-jachnun px-4 py-4 text-cream sm:px-6 lg:px-8 lg:py-5">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -end-24 h-72 w-72 rounded-full
                   bg-[radial-gradient(circle,hsl(var(--cream)/0.12),transparent_65%)]"
      />
      <div className="relative lg:flex lg:items-end lg:justify-between lg:gap-10">
        <div>
          <Eyebrow
            tone="cream"
            withRule
            className={compact ? "hidden lg:inline-flex" : "[@media(max-width:1023px)_and_(max-height:700px)]:hidden"}
          >
            {copy.eyebrow}
          </Eyebrow>
          <h2
            className={`type-statement text-[1.6rem] text-cream lg:mt-2 lg:text-4xl ${
              compact ? "" : "mt-2 [@media(max-width:1023px)_and_(max-height:700px)]:mt-0"
            }`}
          >
            {copy.title}
          </h2>
        </div>
        <p className={`text-sm text-cream lg:max-w-sm lg:text-base ${compact ? "hidden lg:block" : "mt-1.5 lg:mt-0"}`}>
          {copy.lede}
        </p>
      </div>
    </div>
  );
}

/**
 * Three segments. A finished step shows what was chosen, underlined with an
 * edit mark — the two cues people already read as "tap to change" — and is a
 * real button back to that step.
 */
function Progress({
  step,
  chosen,
  chosenText,
  onJump,
}: {
  step: number;
  chosen: ReactNode[];
  chosenText: string[];
  onJump: (i: number) => void;
}) {
  return (
    <ol className="grid grid-cols-3 gap-2" aria-label={copy.progressLabel}>
      {STEPS.map((s, i) => {
        const state = i < step ? "done" : i === step ? "current" : "todo";
        const head = (
          <>
            <span
              aria-hidden
              className={`block h-1 rounded-full transition-colors duration-base ${i <= step ? "bg-jachnun" : "bg-stroke"}`}
            />
            <span
              className={`mt-1.5 flex items-center gap-1.5 text-sm ${
                state === "todo" ? "text-espresso-soft" : "font-medium text-espresso"
              }`}
            >
              {state === "done" ? (
                <IconCheck className="h-3.5 w-3.5 shrink-0 text-jachnun" />
              ) : (
                <span aria-hidden className="tabular-nums">
                  {i + 1}.
                </span>
              )}
              {s.short}
            </span>
          </>
        );
        return (
          <li key={s.id} aria-current={state === "current" ? "step" : undefined} className="min-w-0">
            {state === "done" ? (
              <button
                type="button"
                onClick={() => onJump(i)}
                aria-label={copy.backTo(s.title, chosenText[i] ?? "")}
                className={`group -mx-1.5 flex min-h-[44px] w-[calc(100%+0.75rem)] cursor-pointer flex-col justify-start
                            rounded-input px-1.5 pb-1 text-start transition-colors duration-fast hover:bg-cream-2 ${focusRing}`}
              >
                {head}
                <span className="mt-0.5 flex min-w-0 items-center gap-1 text-xs text-olive">
                  <span className="truncate underline decoration-olive/40 underline-offset-2 group-hover:decoration-olive">
                    {chosen[i]}
                  </span>
                  <IconEdit className="h-3 w-3 shrink-0" />
                </span>
              </button>
            ) : (
              <div className="flex min-h-[44px] flex-col justify-start">{head}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ─── Steps ─────────────────────────────────────────────────────── */

function ItemsStep({
  qty,
  error,
  onChange,
}: {
  qty: PreorderQuantities;
  error?: string;
  onChange: (id: PreorderItemId, delta: number) => void;
}) {
  return (
    <>
      <ul className="mt-2 space-y-3">
        {PREORDER_ITEM_IDS.map((id) => {
          const item = copy.items[id];
          const n = qty[id];
          return (
            <li
              key={id}
              className={`flex gap-2.5 rounded-card border-2 p-2.5 transition sm:gap-3 sm:p-3-[border-color,background-color]
                          duration-fast ease-out-soft ${n > 0 ? "border-jachnun bg-jachnun/[0.05]" : "border-stroke bg-cream"}`}
            >
              <CafeImage
                variant={id === "jachnun" ? "jachnun" : "pastry"}
                src={item.image}
                alt=""
                ratio="aspect-square"
                sizes="80px"
                className="w-12 shrink-0 self-start !rounded-input min-[400px]:w-16 sm:w-20"
              />
              <div className="min-w-0 flex-1">
                <p className="type-sub text-lg leading-tight text-espresso">{item.name}</p>
                <p className="mt-0.5 text-sm leading-snug text-espresso-soft">{item.detail}</p>
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <p className="text-sm text-espresso">
                    <span className="font-medium tabular-nums">{formatILS(unitAgorot(id))}</span>{" "}
                    <span className="text-espresso-soft">{item.unit}</span>
                  </p>
                  <Stepper name={item.name} value={n} max={PREORDER_MAX[id]} onStep={(d) => onChange(id, d)} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {qty.jachnun >= jachnunBulkThresholdUnits ? (
        <p className="mt-3 text-sm text-jachnun">{copy.items.bulkNote}</p>
      ) : null}
      <FieldError id="jp-items-err" message={error} />
    </>
  );
}

function Stepper({
  name,
  value,
  max,
  onStep,
}: {
  name: string;
  value: number;
  max: number;
  onStep: (delta: number) => void;
}) {
  const btn =
    "grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full text-xl leading-none select-none " +
    "transition-[background-color,border-color,transform] duration-fast ease-out-soft active:scale-95 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-35 disabled:active:scale-100";
  return (
    <div className="flex shrink-0 items-center gap-0.5 sm:gap-1" role="group" aria-label={name}>
      <button
        type="button"
        onClick={() => onStep(-1)}
        disabled={value <= 0}
        aria-label={copy.items.decrease(name)}
        className={`${btn} border-2 border-stroke bg-cream-3 text-espresso [@media(hover:hover)]:hover:border-jachnun/50`}
      >
        <span aria-hidden>−</span>
      </button>
      <span className="w-7 text-center type-sub text-xl text-espresso tabular-nums sm:w-8">
        <span aria-hidden>{value}</span>
        <span className="sr-only">{copy.items.count(name, value)}</span>
      </span>
      <button
        type="button"
        onClick={() => onStep(1)}
        disabled={value >= max}
        aria-label={copy.items.increase(name)}
        className={`${btn} bg-jachnun text-cream [@media(hover:hover)]:hover:bg-espresso`}
      >
        <span aria-hidden>+</span>
      </button>
    </div>
  );
}

function PickupStep({
  slots,
  slotIso,
  error,
  onChoose,
}: {
  slots: Slot[] | null;
  slotIso: string | null;
  error?: string;
  onChoose: (iso: string) => void;
}) {
  const choice =
    "relative flex min-h-[44px] cursor-pointer items-center justify-center rounded-input border-2 px-1 " +
    "transition-[border-color,background-color] duration-fast ease-out-soft " +
    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-olive has-[:focus-visible]:ring-offset-2 " +
    "has-[:focus-visible]:ring-offset-cream-3 ";
  const grid = "mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5";
  return (
    <fieldset className="min-w-0" aria-describedby={error ? "jp-slot-err" : "jp-slot-note"}>
      <legend className="sr-only">{STEPS[1].title}</legend>
      <p className="min-h-[1.25rem] text-sm text-espresso-soft">
        {slots?.[0] ? `${slots[0].day} · ${copy.pickup.where}` : null}
      </p>
      {slots ? (
        <div className={grid}>
          {slots.map((s) => {
            const selected = s.iso === slotIso;
            return (
              <label
                key={s.iso}
                className={`${choice} ${
                  selected ? "border-jachnun bg-jachnun text-cream" : "border-stroke bg-cream text-espresso hover:border-jachnun/45"
                }`}
              >
                <input
                  type="radio"
                  name="pickupSlot"
                  value={s.iso}
                  checked={selected}
                  onChange={() => onChoose(s.iso)}
                  aria-label={s.label}
                  className="sr-only"
                />
                {/* A clock range reads left to right even in Hebrew. */}
                <bdi dir="ltr" className="text-sm font-medium tabular-nums">
                  {s.window}
                </bdi>
              </label>
            );
          })}
        </div>
      ) : (
        <div className={grid} aria-busy="true" aria-label={copy.pickup.loading}>
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i} aria-hidden className="h-11 rounded-input border-2 border-stroke bg-cream-2/60" />
          ))}
        </div>
      )}
      <FieldError id="jp-slot-err" message={error} />
      <p id="jp-slot-note" className="mt-2 text-xs leading-relaxed text-espresso-soft">
        {copy.pickup.cutoffNote}
      </p>
    </fieldset>
  );
}

/* ─── Done ──────────────────────────────────────────────────────── */

function Success({
  status,
  doneRef,
  onAgain,
}: {
  status: Extract<Status, { kind: "done" }>;
  doneRef: React.RefObject<HTMLHeadingElement>;
  onAgain: () => void;
}) {
  const s = copy.success;
  return (
    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
      <div className="text-center lg:text-start">
        <span
          aria-hidden
          className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-jachnun text-cream lg:mx-0"
        >
          <IconCheck className="h-6 w-6" />
        </span>
        <h3
          ref={doneRef}
          tabIndex={-1}
          className="mt-4 type-title text-2xl md:text-3xl text-espresso focus:outline-none focus-visible:shadow-none"
        >
          {s.title}
        </h3>
        <p className="mt-4 text-sm text-espresso-soft">{s.referenceLabel}</p>
        <p dir="ltr" className="mt-1 type-sub text-3xl tracking-wider text-espresso tabular-nums lg:text-end">
          {status.reference}
        </p>
        <p className="mt-1.5 text-sm text-espresso-soft">{s.referenceHint}</p>
        <p className="mt-3 text-sm text-jachnun">{s.confirmationNote}</p>
      </div>

      <div className="mt-6 lg:mt-0">
        <dl className="divide-y divide-stroke rounded-card border border-stroke bg-cream text-start text-sm">
          {status.slot ? (
            <SummaryRow label={s.pickup}>
              {status.slot.day} · <bdi dir="ltr">{status.slot.window}</bdi> · {copy.pickup.where}
            </SummaryRow>
          ) : null}
          {status.lines.map((l) => (
            <SummaryRow key={l.id} label={`${l.name} × ${l.qty}`}>
              <span className="tabular-nums">{formatILS(l.totalAgorot)}</span>
            </SummaryRow>
          ))}
          <SummaryRow label={copy.total}>
            <span className="tabular-nums">{formatILS(status.totalAgorot)}</span>
          </SummaryRow>
        </dl>
        <div className="mt-5 text-center lg:text-start">
          <p className="text-sm text-espresso-soft">
            {s.questions}{" "}
            <a href={`tel:${business.phone.tel}`} className="text-olive underline underline-offset-4 hover:text-espresso">
              {business.phone.display}
            </a>
          </p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={onAgain}>
            {s.again}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className="mt-2 text-sm text-jachnun">
      {message}
    </p>
  ) : null;
}

function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-3">
      <dt className="shrink-0 text-espresso-soft">{label}</dt>
      <dd className="text-end font-medium text-espresso">{children}</dd>
    </div>
  );
}
