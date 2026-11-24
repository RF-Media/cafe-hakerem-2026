"use client";

/**
 * The catering inquiry on /catering, built on the same frame as the jachnun
 * pre-order (JachnunPreorderForm): a coloured header, three short steps with a
 * progress row whose finished steps show what was chosen, and the inquiry so
 * far in a bar pinned to the bottom of the card on phones and in an end column
 * on desktop. Every step fits a 390×844 phone and a 1280×680 laptop under the
 * nav. Sage, not terracotta: catering's colour world (CLAUDE.md §4).
 *
 * Nothing is priced or booked here. Trays are optional; a visitor who picks
 * none is asking for a recommendation.
 *
 * Abuse: Turnstile, the route's per-IP and per-phone limits, plus a hidden
 * field and a fill time the route checks (app/api/catering-inquiry). The fill
 * time is measured from the draft's first save, so a reload mid-form doesn't
 * make a real person look like a bot.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCateringTrays } from "@/components/sections/CateringPlanner";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { CafeImage } from "@/components/ui/CafeImage";
import { Turnstile, type TurnstileHandle } from "@/components/ui/Turnstile";
import { IconArrow, IconCheck, IconEdit } from "@/components/ui/icons";
import { EMPTY_DRAFT, validateDetails } from "@/components/order/state";
import { track } from "@/lib/analytics";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { catering } from "@/content/catering";
import { business } from "@/content/business";

const copy = catering.inquiry;
const STEPS = copy.steps;
const LAST = STEPS.length - 1;
const FORM_NAME = "catering_inquiry";
// Same key as CATERING_DRAFT_KEY in CateringPlanner, which restores the trays.
const STORAGE_KEY = "hakerem.catering-inquiry.v1";
const G = copy.guests;
const TRAY_IDS = catering.options.map((o) => o.id);

type Fulfilment = "pickup" | "delivery";
type Field = "name" | "phone" | "email" | "notes";
type Details = Record<Field, string>;
type FieldKey = "fulfilment" | "eventDate" | Field;
type Errors = Partial<Record<FieldKey, string>>;

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "done"; reference: string; email: string };

const EMPTY_DETAILS: Details = { name: "", phone: "", email: "", notes: "" };
const DETAIL_ORDER: Field[] = ["name", "phone", "email"];

const checkDetails = (d: Details) => validateDetails({ ...EMPTY_DRAFT, ...d, notes: "" });

function guestRange(n: number | null): string {
  if (!n) return "unknown";
  if (n <= 15) return "1-15";
  if (n <= 40) return "16-40";
  if (n <= 80) return "41-80";
  return "81+";
}

/** Local YYYY-MM-DD, `days` from today. */
function isoDay(days = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const wd = new Date(y, m - 1, d).toLocaleDateString("he-IL", { weekday: "short" });
  return `${wd} ${d}.${m}`;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-cream-3";

/** `onClose` turns /catering's card back to the fine print; trays are shared with the catalogue above it. */
export function CateringInquiryForm({ onClose }: { onClose?: () => void } = {}) {
  const [step, setStep] = useState(0);
  const { trays, setTrays } = useCateringTrays();
  const [guests, setGuests] = useState<number | null>(null);
  const [eventDate, setEventDate] = useState("");
  const [fulfilment, setFulfilment] = useState<Fulfilment | null>(null);
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [notesOpen, setNotesOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [restored, setRestored] = useState(false);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef<number>(0);
  const moved = useRef(false);
  const started = useRef(false);
  const reduced = useReducedMotion();
  const submitting = status.kind === "submitting";

  // Restore this tab's draft; dates are computed here, after mount, because
  // the server's "today" is UTC.
  useEffect(() => {
    setMinDate(isoDay(0));
    startedAt.current = Date.now();
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved && typeof saved === "object") {
        if (typeof saved.guests === "number") setGuests(Math.min(G.max, Math.max(G.min, saved.guests)));
        if (typeof saved.eventDate === "string" && saved.eventDate >= isoDay(0)) setEventDate(saved.eventDate);
        if (saved.fulfilment === "pickup" || saved.fulfilment === "delivery") setFulfilment(saved.fulfilment);
        if (saved.details) {
          const d = { ...EMPTY_DETAILS };
          for (const k of Object.keys(EMPTY_DETAILS) as Field[]) {
            if (typeof saved.details[k] === "string") d[k] = saved.details[k];
          }
          setDetails(d);
          if (d.notes) setNotesOpen(true);
        }
        if (typeof saved.startedAt === "number" && saved.startedAt < startedAt.current) startedAt.current = saved.startedAt;
      }
    } catch {
      /* storage blocked or corrupt: start fresh */
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored || status.kind === "done") return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ trays, guests, eventDate, fulfilment, details, startedAt: startedAt.current }),
      );
    } catch {
      /* private mode */
    }
  }, [restored, trays, guests, eventDate, fulfilment, details, status.kind]);

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

  // After a step change: bring the card's top under the nav if it isn't in
  // view, then move focus to the new heading for screen readers.
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

  function markStarted() {
    if (started.current) return;
    started.current = true;
    track("form_start", { form_name: FORM_NAME });
  }

  function goTo(i: number) {
    moved.current = true;
    setStep(i);
  }

  function toggleTray(id: string) {
    markStarted();
    setTrays((t) => (t.includes(id) ? t.filter((x) => x !== id) : TRAY_IDS.filter((x) => x === id || t.includes(x))));
  }

  function stepGuests(delta: number) {
    markStarted();
    setGuests((g) => {
      if (g === null) return delta > 0 ? G.start : null;
      const next = Math.round((g + delta) / G.step) * G.step;
      return Math.min(G.max, Math.max(G.min, next));
    });
  }

  function typeGuests(raw: string) {
    markStarted();
    const digits = raw.replace(/\D/g, "").slice(0, 3);
    setGuests(digits ? Math.min(G.max, Number(digits)) : null);
  }

  function change(key: Field, value: string) {
    const next = { ...details, [key]: value };
    setDetails(next);
    if (errors[key]) setErrors((e) => ({ ...e, [key]: checkDetails(next)[key as "name"] }));
  }

  function blur(key: Field) {
    if (!details[key].trim() || key === "notes") return;
    setErrors((e) => ({ ...e, [key]: checkDetails(details)[key as "name"] }));
  }

  function focusField(key: Field) {
    const el = rootRef.current?.querySelector<HTMLElement>(`#ci-${key}`);
    if (!el) return;
    el.focus({ preventScroll: true });
    const r = el.getBoundingClientRect();
    if (r.top < 100 || r.bottom > window.innerHeight - 200) {
      el.scrollIntoView({ block: "center", behavior: reduced ? "instant" : "smooth" });
    }
  }

  function reportInvalid(fields: FieldKey[]) {
    for (const f of fields) track("form_error", { form_name: FORM_NAME, error_type: "validation", form_field: f });
  }

  function advance() {
    const id = STEPS[step].id;
    if (id === "event" && guests !== null && guests < G.min) setGuests(G.min);
    if (id === "when") {
      const e: Errors = {};
      if (!fulfilment) e.fulfilment = copy.when.fulfilmentRequired;
      if (eventDate && minDate && eventDate < minDate) e.eventDate = copy.when.dateTooSoon;
      if (e.fulfilment || e.eventDate) {
        setErrors((er) => ({ ...er, ...e }));
        reportInvalid(Object.keys(e) as FieldKey[]);
        return;
      }
    }
    const next = step + 1;
    track("form_step", { form_name: FORM_NAME, form_step: STEPS[next].id });
    goTo(next);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < LAST) return advance();
    if (submitting) return;

    const found = checkDetails(details);
    setErrors((er) => ({ ...er, name: found.name, phone: found.phone, email: found.email }));
    const invalid = DETAIL_ORDER.filter((k) => found[k as "name"]);
    if (invalid.length) {
      reportInvalid(invalid);
      return focusField(invalid[0]);
    }
    if (!fulfilment) return goTo(1);
    if (turnstileEnabled && !turnstileToken) {
      track("form_error", { form_name: FORM_NAME, error_type: "turnstile" });
      setStatus({ kind: "error", message: copy.turnstilePending });
      return;
    }

    setStatus({ kind: "submitting" });
    const g = guests !== null && guests >= 1 ? guests : undefined;
    try {
      const r = await fetch("/api/catering-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: details.name,
          phone: details.phone,
          email: details.email || undefined,
          eventDate: eventDate ? new Date(eventDate).toISOString() : undefined,
          guestCount: g,
          trays,
          fulfilment,
          message: details.notes,
          hp: honeypotRef.current?.value ?? "",
          elapsedMs: Date.now() - startedAt.current,
          turnstileToken: turnstileToken ?? undefined,
        }),
      });
      const j = await r.json().catch(() => null);

      if (r.ok && j?.ok) {
        track("generate_lead", {
          form_name: FORM_NAME,
          guest_range: guestRange(g ?? null),
          has_event_date: eventDate ? "yes" : "no",
        });
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        moved.current = true;
        setStatus({ kind: "done", reference: j.reference, email: details.email.trim() });
        return;
      }

      const error_type =
        r.status === 403 ? "turnstile" : r.status === 400 ? "validation" : r.status === 429 ? "rate_limit" : "server";
      track("form_error", { form_name: FORM_NAME, error_type });
      setTurnstileToken(null);
      turnstileRef.current?.reset();
      setStatus({ kind: "error", message: j?.error ?? copy.generic });
    } catch {
      track("form_error", { form_name: FORM_NAME, error_type: "network" });
      setTurnstileToken(null);
      turnstileRef.current?.reset();
      setStatus({ kind: "error", message: copy.network });
    }
  }

  function startAgain() {
    setTrays([]);
    setGuests(null);
    setEventDate("");
    setFulfilment(null);
    setDetails((d) => ({ ...d, notes: "" }));
    setNotesOpen(false);
    setErrors({});
    setStatus({ kind: "idle" });
    started.current = false;
    startedAt.current = Date.now();
    goTo(0);
  }

  if (status.kind === "done") {
    const s = copy.success;
    return (
      <div ref={rootRef}>
        <Header compact={false} onClose={onClose} />
        <div className="step-in px-4 py-7 text-center sm:px-6 lg:px-8">
          <span aria-hidden className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-olive text-cream">
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
          <p dir="ltr" className="mt-1 type-sub text-3xl tracking-wider text-espresso tabular-nums">
            {status.reference}
          </p>
          <p className="mx-auto mt-3 max-w-md text-base text-espresso-soft">
            {s.body} {status.email ? s.emailed(status.email) : null}
          </p>
          <p className="mt-5 text-sm text-espresso-soft">
            {s.questions}{" "}
            <a href={`tel:${business.phone.tel}`} className="text-olive underline underline-offset-4 hover:text-espresso">
              {business.phone.display}
            </a>
          </p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={startAgain}>
            {s.again}
          </Button>
        </div>
      </div>
    );
  }

  const current = STEPS[step];
  const trayTitles = trays.map((id) => catering.options.find((o) => o.id === id)?.title.he ?? id);
  const traysText = trayTitles.length ? trayTitles.join(" · ") : copy.summary.recommend;
  const guestsText = guests ? `${guests} ${G.unit}` : null;
  const fulfilmentText = copy.when.options.find((o) => o.id === fulfilment)?.label ?? null;
  const dateText = eventDate ? shortDate(eventDate) : null;
  const whenText = [dateText, fulfilmentText].filter(Boolean).join(" · ");
  const eventChosen = [trayTitles.length ? `${trayTitles.length} מגשים` : copy.summary.recommend, guestsText]
    .filter(Boolean)
    .join(" · ");

  return (
    <div ref={rootRef}>
      <form
        onSubmit={onSubmit}
        method="post"
        noValidate
        aria-labelledby="ci-step-title"
        className="lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem]"
      >
        <div className="lg:col-span-2">
          <Header compact={step > 0} onClose={onClose} />
        </div>

        {/* Hidden from people and assistive tech; bots fill it. */}
        <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
          <label>
            Leave empty
            <input ref={honeypotRef} type="text" name="hk_ref_code" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        <div className="min-w-0 px-4 pt-4 pb-5 sm:px-6 lg:px-8 lg:pt-5 lg:pb-7">
          <noscript>
            <p className="mb-4 rounded-input border border-stroke bg-cream px-4 py-3 text-sm text-espresso-soft">
              הטופס דורש JavaScript. אפשר לפנות לקפה הכרם גם בטלפון:{" "}
              <a href={`tel:${business.phone.tel}`} className="text-olive underline underline-offset-4">
                {business.phone.display}
              </a>
              .
            </p>
          </noscript>

          <Progress step={step} chosen={[eventChosen, whenText || null, null]} onJump={goTo} />

          <div key={step} className="step-in mt-3 lg:mt-4">
            <div className="flex min-h-[44px] items-center justify-between gap-3">
              <h3
                id="ci-step-title"
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
                  <IconArrow className="h-4 w-4 rotate-180" />
                  {copy.back}
                </button>
              ) : null}
            </div>

            {current.id === "event" ? (
              <EventStep
                trays={trays}
                guests={guests}
                onToggle={toggleTray}
                onStep={stepGuests}
                onType={typeGuests}
              />
            ) : current.id === "when" ? (
              <WhenStep
                eventDate={eventDate}
                minDate={minDate}
                fulfilment={fulfilment}
                errors={errors}
                onDate={(v) => {
                  markStarted();
                  setEventDate(v);
                  setErrors((e) => ({ ...e, eventDate: undefined }));
                }}
                onFulfilment={(v) => {
                  markStarted();
                  setFulfilment(v);
                  setErrors((e) => ({ ...e, fulfilment: undefined }));
                }}
              />
            ) : (
              <div className="mt-2 grid gap-x-4 gap-y-2 sm:grid-cols-2" onFocusCapture={markStarted}>
                <FormField
                  id="ci-name"
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
                  id="ci-phone"
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
                  id="ci-email"
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
                    id="ci-notes"
                    label={copy.details.notes.label}
                    name="notes"
                    type="textarea"
                    rows={2}
                    hint={copy.details.notes.hint}
                    maxLength={2000}
                    value={details.notes}
                    onChange={(v) => change("notes", v)}
                  />
                ) : (
                  <div className="sm:pt-7">
                    <button
                      type="button"
                      onClick={() => {
                        setNotesOpen(true);
                        requestAnimationFrame(() => rootRef.current?.querySelector<HTMLElement>("#ci-notes")?.focus());
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

        {/* The inquiry so far. Phones: pinned to the bottom while the card is
            on screen (MobileBar steps aside via data-hide-mobile-bar on the
            page's wrapper). Desktop: the card's end column. */}
        <div
          className="sticky bottom-0 z-10 rounded-b-card border-t border-stroke bg-cream-3 px-4 pt-3
                     pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-10px_24px_-16px_hsl(var(--espresso-deep)/0.35)]
                     sm:px-6 lg:static lg:z-auto lg:flex lg:flex-col lg:rounded-b-none lg:rounded-ee-card lg:border-t-0
                     lg:border-s lg:bg-cream lg:p-6 lg:shadow-none"
        >
          <p className="sr-only" aria-live="polite">
            {copy.summary.trays}: {traysText}. {copy.summary.guests}: {guestsText ?? copy.summary.pending}.
          </p>

          {/* Phones: one compact row. The end padding clears the accessibility tab. */}
          <div className="flex items-end justify-between gap-4 pe-8 lg:hidden" aria-hidden>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium leading-snug text-espresso">{traysText}</p>
              <p className="mt-0.5 truncate text-xs text-espresso-soft">
                {whenText || `${copy.summary.date}: ${copy.summary.pending}`}
              </p>
            </div>
            <div className="shrink-0 text-end">
              <p className="text-xs text-espresso-soft">{copy.summary.guests}</p>
              <p className="type-sub text-2xl leading-none text-espresso tabular-nums">{guests ?? "—"}</p>
            </div>
          </div>

          {/* Desktop: the inquiry, row by row. */}
          <div className="hidden lg:block" aria-hidden>
            <p className="type-sub text-lg text-espresso">{copy.summary.heading}</p>
            <dl className="mt-3 divide-y divide-stroke text-sm">
              <SummaryRow label={copy.summary.trays}>{traysText}</SummaryRow>
              <SummaryRow label={copy.summary.guests}>{guestsText ?? copy.summary.pending}</SummaryRow>
              <SummaryRow label={copy.summary.date}>{dateText ?? copy.summary.pending}</SummaryRow>
              <SummaryRow label={copy.summary.fulfilment}>{fulfilmentText ?? copy.summary.pending}</SummaryRow>
            </dl>
          </div>

          <p className="hidden text-xs text-espresso-soft lg:mt-auto lg:block lg:pt-5">{copy.minimumNote}</p>

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

          <Turnstile
            ref={turnstileRef}
            onVerify={setTurnstileToken}
            onExpire={() => setTurnstileToken(null)}
            onError={() => setTurnstileToken(null)}
            className="mt-3 empty:hidden"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            className="mt-3 w-full lg:mt-4"
            icon={submitting ? undefined : <IconArrow />}
          >
            {step < LAST ? copy.next[current.id as "event" | "when"] : submitting ? copy.submitting : copy.submit}
          </Button>
          <p className={`mt-2 text-center text-xs text-espresso-soft ${step === LAST ? "" : "hidden lg:block"}`}>
            {copy.note}
          </p>
        </div>
      </form>
    </div>
  );
}

/* ─── Chrome ────────────────────────────────────────────────────── */

/** Sage header. On phones, past step 1, it shrinks to the title alone. */
function Header({ compact, onClose }: { compact: boolean; onClose?: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-t-card bg-sage px-4 py-4 text-espresso sm:px-6 lg:px-8 lg:py-5">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -end-24 h-72 w-72 rounded-full
                   bg-[radial-gradient(circle,hsl(var(--cream-3)/0.7),transparent_65%)]"
      />
      <div className="relative lg:flex lg:items-end lg:justify-between lg:gap-10">
        <div>
          <Eyebrow
            tone="olive"
            withRule
            className="hidden lg:inline-flex"
          >
            {copy.eyebrow}
          </Eyebrow>
          <h2
            tabIndex={-1}
            data-flip-focus
            className="type-statement text-[1.6rem] text-espresso focus:outline-none lg:mt-2 lg:text-4xl"
          >
            {copy.title}
          </h2>
        </div>
        <div className="flex flex-col items-start lg:max-w-sm lg:items-end lg:text-end">
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className={`-ms-2 mt-1 inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-pill px-2 text-sm
                         font-medium text-olive transition-colors duration-fast hover:bg-cream-3/60 order-last lg:-me-2
                         lg:ms-0 lg:mt-1 ${focusRing}`}
            >
              <IconArrow className="h-4 w-4 rotate-180" />
              {catering.planner.close}
            </button>
          ) : null}
          <p
            className={`text-sm text-espresso lg:text-base ${
              compact ? "hidden lg:block" : "mt-1.5 lg:mt-0 [@media(max-width:1023px)_and_(max-height:800px)]:hidden"
            }`}
          >
            {copy.lede}
          </p>
        </div>
      </div>
    </div>
  );
}

function Progress({
  step,
  chosen,
  onJump,
}: {
  step: number;
  chosen: (string | null)[];
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
              className={`block h-1 rounded-full transition-colors duration-base ${i <= step ? "bg-olive" : "bg-stroke"}`}
            />
            <span
              className={`mt-1.5 flex items-center gap-1.5 text-sm ${
                state === "todo" ? "text-espresso-soft" : "font-medium text-espresso"
              }`}
            >
              {state === "done" ? (
                <IconCheck className="h-3.5 w-3.5 shrink-0 text-olive" />
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
                aria-label={copy.backTo(s.title, chosen[i] ?? "")}
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

const choiceRing =
  "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-olive has-[:focus-visible]:ring-offset-2 " +
  "has-[:focus-visible]:ring-offset-cream-3";

function EventStep({
  trays,
  guests,
  onToggle,
  onStep,
  onType,
}: {
  trays: string[];
  guests: number | null;
  onToggle: (id: string) => void;
  onStep: (delta: number) => void;
  onType: (raw: string) => void;
}) {
  return (
    <>
      <fieldset className="min-w-0">
        <legend className="text-sm text-espresso-soft">
          <span className="sr-only">{copy.trays.legend} </span>
          {copy.trays.optional}
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3 sm:gap-3">
          {catering.options.map((o) => {
            const on = trays.includes(o.id);
            return (
              <label
                key={o.id}
                className={`group relative flex cursor-pointer items-center gap-3 rounded-card border-2 p-2 transition-[border-color,background-color]
                            duration-fast ease-out-soft sm:flex-col sm:items-stretch sm:gap-0 sm:p-0 ${choiceRing} ${
                              on ? "border-olive bg-olive/[0.06]" : "border-stroke bg-cream hover:border-olive/45"
                            }`}
              >
                <input type="checkbox" className="sr-only" checked={on} onChange={() => onToggle(o.id)} />
                <CafeImage
                  variant="tray"
                  src={o.photo}
                  alt=""
                  ratio="aspect-square sm:aspect-video"
                  sizes="(max-width: 640px) 56px, 240px"
                  className="w-12 shrink-0 !rounded-input min-[400px]:w-14 sm:w-full sm:!rounded-b-none sm:!rounded-t-[calc(var(--radius-card)-2px)]"
                />
                <span className="min-w-0 flex-1 sm:px-3 sm:py-2.5">
                  <span className="block type-sub text-base leading-tight text-espresso md:text-lg">{o.title.he}</span>
                  <span className="mt-0.5 block text-sm text-espresso-soft">{o.serves}</span>
                </span>
                <span
                  aria-hidden
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-fast
                              sm:absolute sm:end-2 sm:top-2 ${
                                on ? "border-olive bg-olive text-cream" : "border-stroke bg-cream-3 text-transparent"
                              }`}
                >
                  <IconCheck className="h-3.5 w-3.5" />
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-card border border-stroke bg-cream px-3 py-2.5">
        <label htmlFor="ci-guests" className="type-sub text-base text-espresso md:text-lg">
          {G.label}
        </label>
        <div className="flex shrink-0 items-center gap-1" role="group" aria-label={G.label}>
          <StepButton label={G.decrease} disabled={guests === null || guests <= G.min} onClick={() => onStep(-G.step)}>
            −
          </StepButton>
          <input
            id="ci-guests"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={guests ?? ""}
            placeholder="—"
            onChange={(e) => onType(e.target.value)}
            className="h-11 w-14 rounded-input border border-transparent bg-transparent text-center type-sub text-xl text-espresso
                       tabular-nums placeholder:text-espresso-soft focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
          />
          <StepButton label={G.increase} primary disabled={guests !== null && guests >= G.max} onClick={() => onStep(G.step)}>
            +
          </StepButton>
        </div>
        {guests !== null && guests >= G.max ? <p className="w-full text-xs text-espresso-soft">{G.more}</p> : null}
      </div>
    </>
  );
}

function StepButton({
  label,
  primary,
  disabled,
  onClick,
  children,
}: {
  label: string;
  primary?: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full text-xl leading-none select-none
                  transition-[background-color,border-color,transform] duration-fast ease-out-soft active:scale-95
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2
                  focus-visible:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-35 disabled:active:scale-100 ${
                    primary
                      ? "bg-olive text-cream [@media(hover:hover)]:hover:bg-espresso"
                      : "border-2 border-stroke bg-cream-3 text-espresso [@media(hover:hover)]:hover:border-olive/50"
                  }`}
    >
      <span aria-hidden>{children}</span>
    </button>
  );
}

function WhenStep({
  eventDate,
  minDate,
  fulfilment,
  errors,
  onDate,
  onFulfilment,
}: {
  eventDate: string;
  minDate?: string;
  fulfilment: Fulfilment | null;
  errors: Errors;
  onDate: (v: string) => void;
  onFulfilment: (v: Fulfilment) => void;
}) {
  const w = copy.when;
  return (
    <div className="mt-2 grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="ci-date" className="mb-2 block text-sm font-medium text-espresso">
          {w.dateLabel}
        </label>
        <input
          id="ci-date"
          type="date"
          value={eventDate}
          min={minDate}
          onChange={(e) => onDate(e.target.value)}
          aria-invalid={errors.eventDate ? true : undefined}
          aria-describedby={errors.eventDate ? "ci-date-err" : "ci-date-hint"}
          className={inputClasses}
        />
        {errors.eventDate ? (
          <p id="ci-date-err" role="alert" className="mt-1 text-sm text-jachnun">
            {errors.eventDate}
          </p>
        ) : (
          <p id="ci-date-hint" className="mt-1 text-sm text-espresso-soft">
            {w.dateHint}
          </p>
        )}
      </div>

      <fieldset className="min-w-0" aria-describedby={errors.fulfilment ? "ci-ful-err" : undefined}>
        <legend className="mb-2 text-sm font-medium text-espresso">
          {w.fulfilmentLegend} <span className="text-jachnun" aria-hidden>*</span>
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {w.options.map((o) => {
            const on = fulfilment === o.id;
            return (
              <label
                key={o.id}
                className={`flex min-h-[64px] cursor-pointer flex-col justify-center rounded-input border-2 px-3 py-2
                            transition-[border-color,background-color] duration-fast ease-out-soft ${choiceRing} ${
                              on ? "border-olive bg-olive text-cream" : "border-stroke bg-cream text-espresso hover:border-olive/45"
                            }`}
              >
                <input
                  type="radio"
                  name="fulfilment"
                  value={o.id}
                  checked={on}
                  onChange={() => onFulfilment(o.id as Fulfilment)}
                  className="sr-only"
                />
                <span className="text-base font-medium">{o.label}</span>
                <span className={`text-xs ${on ? "text-cream" : "text-espresso-soft"}`}>{o.hint}</span>
              </label>
            );
          })}
        </div>
        {errors.fulfilment ? (
          <p id="ci-ful-err" role="alert" className="mt-2 text-sm text-jachnun">
            {errors.fulfilment}
          </p>
        ) : null}
      </fieldset>

      <p className="text-xs leading-relaxed text-espresso-soft sm:col-span-2">
        {catering.fineprint.leadTime} {copy.minimumNote}
      </p>
    </div>
  );
}

function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="shrink-0 text-espresso-soft">{label}</dt>
      <dd className="text-end font-medium text-espresso">{children}</dd>
    </div>
  );
}
