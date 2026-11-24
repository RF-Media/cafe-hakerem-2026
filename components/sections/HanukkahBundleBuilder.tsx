"use client";

/**
 * The Hanukkah pre-order: one card, one decision at a time. A slider (or the
 * three size tiles, bound to the same state) fills a box with sufganiyot, the
 * price follows, and the form under it asks for a name and a phone. A rep calls
 * back to confirm and take payment (CLAUDE.md 2026-11-13), so nothing is charged
 * here and no email is asked for.
 *
 * The box is an illustration: its photos are `alt=""`, and a polite live region
 * says the same thing in words. Slots animate `transform` + `opacity` only, so
 * the reduced-motion kill switch (transition-duration → 0) is enough.
 * All prices come from content/hanukkah.ts; the server prices the order again.
 */
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconCheck } from "@/components/ui/icons";
import { Turnstile, type TurnstileHandle } from "@/components/ui/Turnstile";
import { business } from "@/content/business";
import {
  BUNDLE_SIZES,
  BUNDLE_TIERS,
  bundlePrice,
  flavors,
  hanukkah,
  hanukkahBundles,
  type BundleSize,
  type BundleTier,
} from "@/content/hanukkah";
import { track } from "@/lib/analytics";
import { isValidIsraeliMobile, normalizePhone } from "@/lib/phone";

const FORM_NAME = "hanukkah_preorder";
const MAX_SLOTS = BUNDLE_SIZES[BUNDLE_SIZES.length - 1];
const copy = hanukkah.builder;

// 4 is coprime to 15, so the box cycles through every flavour before repeating
// and neighbouring slots never match.
const slotImages = Array.from({ length: MAX_SLOTS }, (_, i) => flavors[(i * 4) % flavors.length].image);

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "done"; reference: string };

type Errors = { name?: string; phone?: string };

export function HanukkahBundleBuilder() {
  const [tier, setTier] = useState<BundleTier>("regular");
  const [sizeIndex, setSizeIndex] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [token, setToken] = useState<string | null>(null);

  const size: BundleSize = BUNDLE_SIZES[sizeIndex];
  const total = bundlePrice(tier, size);
  const label = `${hanukkahBundles[tier].label}, ${size} סופגניות`;

  const rootRef = useRef<HTMLDivElement>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef<number | null>(null);
  const started = useRef(false);
  const changeTimer = useRef<ReturnType<typeof setTimeout>>();
  const prevFilled = useRef(size);

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

  useEffect(() => () => clearTimeout(changeTimer.current), []);

  function begin() {
    if (started.current) return;
    started.current = true;
    startedAt.current = Date.now();
    track("form_start", { form_name: FORM_NAME });
  }

  // One event per settled choice: a drag across the slider is not three.
  function settle(nextTier: BundleTier, nextSize: BundleSize) {
    clearTimeout(changeTimer.current);
    changeTimer.current = setTimeout(() => {
      track("order_item_change", {
        form_name: FORM_NAME,
        item_id: `${nextTier}_${nextSize}`,
        value: bundlePrice(nextTier, nextSize),
        currency: "ILS",
      });
    }, 800);
  }

  function chooseTier(next: BundleTier) {
    begin();
    setTier(next);
    settle(next, size);
  }

  function chooseSize(index: number) {
    begin();
    setSizeIndex(index);
    settle(tier, BUNDLE_SIZES[index]);
  }

  // Slots that are filling in now arrive one after another; slots leaving don't wait.
  const filling = size > prevFilled.current;
  const baseCount = prevFilled.current;
  useEffect(() => {
    prevFilled.current = size;
  }, [size]);

  const slots = useMemo(() => Array.from({ length: MAX_SLOTS }, (_, i) => i), []);

  function validate(): Errors {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "נא להזין שם מלא.";
    if (!isValidIsraeliMobile(normalizePhone(phone))) e.phone = "מספר טלפון לא תקין. דוגמה: 050-1234567";
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (status.kind === "submitting") return;
    const e = validate();
    setErrors(e);
    const fields = Object.keys(e);
    if (fields.length) {
      for (const f of fields) track("form_error", { form_name: FORM_NAME, error_type: "validation", form_field: f });
      document.getElementById(e.name ? "hnk-name" : "hnk-phone")?.focus();
      return;
    }
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !token) {
      track("form_error", { form_name: FORM_NAME, error_type: "turnstile" });
      setStatus({ kind: "error", message: copy.errors.turnstile });
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const r = await fetch("/api/hanukkah-preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          tier,
          size,
          notes: notes.trim() || undefined,
          turnstileToken: token ?? undefined,
          hp: honeypotRef.current?.value ?? "",
          elapsedMs: startedAt.current ? Date.now() - startedAt.current : undefined,
        }),
      });
      const j = (await r.json().catch(() => null)) as { ok?: boolean; reference?: string; error?: string; code?: string } | null;
      if (r.ok && j?.ok) {
        track("generate_lead", { form_name: FORM_NAME, item_id: `${tier}_${size}`, value: total, currency: "ILS" });
        setStatus({ kind: "done", reference: j.reference ?? "" });
        return;
      }
      track("form_error", {
        form_name: FORM_NAME,
        error_type: j?.code === "rate_limited" ? "rate_limit" : j?.code === "turnstile" ? "turnstile" : j?.code === "validation" ? "validation" : "server",
      });
      setToken(null);
      turnstileRef.current?.reset();
      setStatus({ kind: "error", message: j?.error ?? copy.errors.generic });
    } catch {
      track("form_error", { form_name: FORM_NAME, error_type: "network" });
      setToken(null);
      turnstileRef.current?.reset();
      setStatus({ kind: "error", message: copy.errors.network });
    }
  }

  function reset() {
    setName("");
    setPhone("");
    setNotes("");
    setErrors({});
    setToken(null);
    started.current = false;
    setStatus({ kind: "idle" });
  }

  const premium = tier === "premium";
  const label_ = "mb-1.5 block text-sm font-medium text-espresso";
  const input =
    "w-full min-h-[48px] rounded-input border border-stroke bg-cream px-4 py-3 text-espresso placeholder:text-espresso-soft/60 " +
    "hover:border-espresso-soft/40 focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20 " +
    "aria-[invalid=true]:border-jachnun aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-jachnun/15";

  return (
    <div ref={rootRef} className="grid lg:grid-cols-12">
      {/* The box. Decorative: the live region below says the same in words. */}
      <div className="p-3 sm:p-4 lg:col-span-6 lg:p-5">
        <div
          aria-hidden
          className={`relative isolate overflow-hidden rounded-[calc(var(--radius-card)-4px)] bg-espresso-deep p-4 sm:p-6 lg:sticky lg:top-28 ${
            premium ? "ring-1 ring-brass/70" : "ring-1 ring-cream/10"
          } transition-shadow duration-base`}
        >
          <div
            className={`pointer-events-none absolute inset-0 -z-10 transition-opacity duration-slow ${
              premium
                ? "bg-[radial-gradient(90%_70%_at_50%_0%,hsl(var(--brass)/0.28),transparent_70%)]"
                : "bg-[radial-gradient(90%_70%_at_50%_0%,hsl(var(--olive)/0.55),transparent_70%)]"
            }`}
          />
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="type-index text-xs text-brass">{hanukkahBundles[tier].label}</span>
            <span className="rounded-pill border border-brass/40 px-3 py-1 text-xs font-medium tabular-nums text-cream">
              <bdi dir="ltr">
                {size} / {MAX_SLOTS}
              </bdi>
            </span>
          </div>

          <ul className="grid grid-cols-5 gap-2 sm:gap-3">
            {slots.map((i) => {
              const filled = i < size;
              const delay = filling && filled ? Math.max(0, i - baseCount) * 45 : 0;
              return (
                <li key={i} className="relative aspect-square">
                  <span className="absolute inset-0 rounded-full border border-dashed border-cream/25" />
                  <span
                    className={`absolute inset-0 overflow-hidden rounded-full ring-2 transition-[transform,opacity] duration-base ease-out-soft ${
                      premium ? "ring-brass" : "ring-cream/70"
                    } ${filled ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                    style={{ transitionDelay: `${delay}ms` }}
                  >
                    <Image src={slotImages[i]} alt="" fill sizes="(min-width: 1024px) 80px, 18vw" quality={60} className="object-cover" />
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-center text-xs text-cream/70">{copy.boxCaption}</p>
        </div>
      </div>

      {/* The controls and the form. */}
      <div className="p-5 pt-2 sm:p-7 lg:col-span-6 lg:p-8 lg:ps-5">
        {status.kind === "done" ? (
          <div role="status" className="flex h-full flex-col justify-center py-6">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-olive text-cream">
              <IconCheck className="h-6 w-6" />
            </span>
            <h3 className="type-title mt-5 text-3xl">{copy.successTitle}</h3>
            <p className="mt-3 max-w-prose-he text-espresso-soft">{copy.successBody}</p>
            <dl className="mt-5 grid max-w-sm grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-card border border-stroke bg-cream p-4 text-sm">
              <dt className="text-espresso-soft">{copy.successRef}</dt>
              <dd className="font-medium tabular-nums">{status.reference}</dd>
              <dt className="text-espresso-soft">מארז</dt>
              <dd className="font-medium">{label}</dd>
              <dt className="text-espresso-soft">לתשלום</dt>
              <dd className="font-medium tabular-nums">₪{total}</dd>
            </dl>
            <p className="mt-4 text-sm text-espresso-soft">
              {business.name.he}:{" "}
              <a href={`tel:${business.phone.tel}`} className="font-medium underline underline-offset-4">
                {business.phone.display}
              </a>
            </p>
            <Button type="button" variant="secondary" size="md" className="mt-6 self-start" onClick={reset}>
              {copy.again}
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <fieldset>
              <legend className={label_}>{copy.tierLabel}</legend>
              <div className="grid grid-cols-2 gap-2">
                {BUNDLE_TIERS.map((t) => (
                  <label key={t} className="cursor-pointer">
                    <input
                      type="radio"
                      name="hnk-tier"
                      value={t}
                      checked={tier === t}
                      onChange={() => chooseTier(t)}
                      className="peer sr-only"
                    />
                    <span className="flex min-h-[48px] items-center justify-center rounded-pill border border-stroke bg-cream px-4 text-center font-medium transition-colors duration-fast hover:border-espresso-soft/50 peer-checked:border-espresso peer-checked:bg-espresso peer-checked:text-cream peer-focus-visible:ring-2 peer-focus-visible:ring-olive peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-cream-3">
                      {hanukkahBundles[t].label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="hnk-size" className={label_}>
                  {copy.sizeLabel}
                </label>
                <span className="text-xs text-espresso-soft">{copy.sizeHint}</span>
              </div>
              <input
                id="hnk-size"
                type="range"
                min={0}
                max={BUNDLE_SIZES.length - 1}
                step={1}
                value={sizeIndex}
                onChange={(e) => chooseSize(Number(e.target.value))}
                aria-valuetext={`${size} סופגניות, ₪${total}`}
                className="block h-11 w-full cursor-pointer accent-[hsl(var(--olive))]"
              />
              <div className="mt-1 grid grid-cols-3 gap-2">
                {BUNDLE_SIZES.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => chooseSize(i)}
                    aria-pressed={sizeIndex === i}
                    className="min-h-[56px] cursor-pointer rounded-card border border-stroke bg-cream px-2 py-2 transition-[border-color,background-color,transform] duration-fast hover:border-espresso-soft/50 aria-pressed:border-olive aria-pressed:bg-cream-3 aria-pressed:ring-1 aria-pressed:ring-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive"
                  >
                    <span className="block type-sub text-xl tabular-nums">{s}</span>
                    <span className="block text-xs tabular-nums text-espresso-soft">₪{bundlePrice(tier, s)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4 border-y border-stroke py-4" role="status" aria-live="polite">
              <p className="text-sm text-espresso-soft">
                <span className="sr-only">נבחר: </span>
                {label}
              </p>
              <p key={`${tier}-${size}`} className="price-pop type-statement text-5xl tabular-nums text-espresso">
                ₪{total}
              </p>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="hnk-name" className={label_}>
                  {copy.fields.name} <span className="text-jachnun" aria-hidden>*</span>
                </label>
                <input
                  id="hnk-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={80}
                  value={name}
                  onChange={(e) => {
                    begin();
                    setName(e.target.value);
                  }}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "hnk-name-err" : undefined}
                  className={input}
                />
                {errors.name ? (
                  <p id="hnk-name-err" className="mt-1 text-sm text-jachnun">
                    {errors.name}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="hnk-phone" className={label_}>
                  {copy.fields.phone} <span className="text-jachnun" aria-hidden>*</span>
                </label>
                <input
                  id="hnk-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  dir="ltr"
                  value={phone}
                  onChange={(e) => {
                    begin();
                    setPhone(e.target.value);
                  }}
                  placeholder={copy.fields.phoneHint}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "hnk-phone-err" : undefined}
                  className={`${input} text-end`}
                />
                {errors.phone ? (
                  <p id="hnk-phone-err" className="mt-1 text-sm text-jachnun">
                    {errors.phone}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="hnk-notes" className={label_}>
                  {copy.fields.notes} <span className="font-normal text-espresso-soft">({copy.fields.notesHint})</span>
                </label>
                <textarea
                  id="hnk-notes"
                  name="notes"
                  rows={2}
                  maxLength={500}
                  value={notes}
                  onChange={(e) => {
                    begin();
                    setNotes(e.target.value);
                  }}
                  className={input}
                />
              </div>
              {/* Honeypot: invisible to people, irresistible to form-filling bots. */}
              <div aria-hidden className="sr-only">
                <input ref={honeypotRef} type="text" name="hk_ref_code" tabIndex={-1} autoComplete="off" defaultValue="" />
              </div>
            </div>

            {status.kind === "error" ? (
              <div role="alert" className="mt-4 rounded-input border border-jachnun/40 bg-jachnun/[0.07] px-4 py-3 text-sm text-jachnun">
                <p>{status.message}</p>
                <p className="mt-1">
                  {copy.errors.callPrefix}{" "}
                  <a href={`tel:${business.phone.tel}`} className="font-medium underline underline-offset-4">
                    {business.phone.display}
                  </a>
                </p>
              </div>
            ) : null}

            <Turnstile
              ref={turnstileRef}
              onVerify={setToken}
              onExpire={() => setToken(null)}
              onError={() => setToken(null)}
              className="mt-3 empty:hidden"
            />

            <Button type="submit" variant="primary" size="lg" disabled={status.kind === "submitting"} className="mt-5 w-full">
              {status.kind === "submitting" ? copy.submitting : `${copy.submit} · ₪${total}`}
            </Button>
            <p className="mt-3 text-xs leading-relaxed text-espresso-soft">{copy.payNote}</p>
          </form>
        )}
      </div>
    </div>
  );
}
