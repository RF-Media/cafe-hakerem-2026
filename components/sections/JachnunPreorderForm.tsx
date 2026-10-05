"use client";

/**
 * Phase-1 jachnun pre-order: package, pickup window and contact details on
 * one screen, paid at pickup. The five-step checkout in components/order/ is
 * phase 2 (see CHECKOUT_ENABLED); this form borrows its slot math and its
 * details validation so the two can't disagree on what a valid order is.
 *
 * Slots are computed after mount, never during render — the server renders
 * in UTC and around the Thursday 18:00 cutoff it disagrees with the visitor
 * about which Shabbat is on offer.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { IconArrow } from "@/components/ui/icons";
import { EMPTY_DRAFT, validateDetails, type DetailsField } from "@/components/order/state";
import { getAvailableSlots, type Slot } from "@/lib/jachnun-cutoff";
import { formatILS } from "@/lib/money";
import { jachnun, jachnunPackages, type PackageId } from "@/content/jachnun";
import { business } from "@/content/business";

const copy = jachnun.preorder;

type Details = Record<DetailsField, string>;
type FieldKey = "package" | "slot" | DetailsField;
type Errors = Partial<Record<FieldKey, string>>;

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "done"; reference: string; slot: Slot | null; packageTitle: string; totalAgorot: number };

const EMPTY_DETAILS: Details = { name: "", phone: "", email: "", notes: "" };
const FIELD_ORDER: FieldKey[] = ["package", "slot", "name", "phone", "email", "notes"];

const checkDetails = (d: Details) => validateDetails({ ...EMPTY_DRAFT, ...d });

const choiceBase =
  "relative flex cursor-pointer rounded-input border-2 transition-[border-color,background-color] " +
  "duration-fast ease-out-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-olive " +
  "has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-cream-3 ";
const choiceIdle = "border-stroke bg-cream hover:border-jachnun/45";
const choiceSelected = "border-jachnun bg-jachnun/[0.07]";

export function JachnunPreorderForm() {
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [packageId, setPackageId] = useState<PackageId | null>(null);
  const [slotIso, setSlotIso] = useState<string | null>(null);
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => setSlots(getAvailableSlots()), []);

  useEffect(() => {
    if (status.kind === "done") doneRef.current?.focus();
  }, [status.kind]);

  const pkg = jachnunPackages.find((p) => p.id === packageId) ?? null;
  const submitting = status.kind === "submitting";

  function focusField(key: FieldKey) {
    const form = formRef.current;
    if (!form) return;
    const el =
      key === "package"
        ? form.querySelector<HTMLInputElement>('input[name="packageId"]')
        : key === "slot"
          ? form.querySelector<HTMLInputElement>('input[name="pickupSlot"]')
          : form.querySelector<HTMLElement>(`#jp-${key}`);
    if (!el) return;
    // Centred rather than at the top edge, where the fixed nav would cover it.
    el.focus({ preventScroll: true });
    (el.closest("fieldset") ?? el).scrollIntoView({ block: "center" });
  }

  function change(key: DetailsField, value: string) {
    const next = { ...details, [key]: value };
    setDetails(next);
    // Once a field is flagged, it clears the moment it becomes valid.
    if (errors[key]) setErrors((e) => ({ ...e, [key]: checkDetails(next)[key] }));
  }

  // Blur only flags what was typed wrong. "Required" waits for submit — on a
  // phone, scrolling up to tap a package blurs whatever field had focus.
  function blur(key: DetailsField) {
    if (!details[key].trim()) return;
    setErrors((e) => ({ ...e, [key]: checkDetails(details)[key] }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const next: Errors = { ...checkDetails(details) };
    if (!packageId) next.package = copy.packages.required;
    if (!slotIso) next.slot = copy.pickup.required;
    setErrors(next);
    const firstInvalid = FIELD_ORDER.find((k) => next[k]);
    if (firstInvalid || !pkg || !slotIso) {
      if (firstInvalid) focusField(firstInvalid);
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const r = await fetch("/api/jachnun-preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...details, packageId, pickupSlot: slotIso }),
      });
      const j = await r.json().catch(() => null);

      if (r.ok && j?.ok) {
        setStatus({
          kind: "done",
          reference: j.reference,
          slot: slots?.find((s) => s.iso === slotIso) ?? null,
          packageTitle: pkg.title,
          totalAgorot: pkg.totalAgorot,
        });
        return;
      }

      // The cutoff passed while the form was open: offer the new Shabbat.
      if (j?.code === "slot_unavailable") {
        setSlots(getAvailableSlots());
        setSlotIso(null);
        setErrors((er) => ({ ...er, slot: j.error }));
        setStatus({ kind: "idle" });
        focusField("slot");
        return;
      }

      setStatus({ kind: "error", message: j?.error ?? copy.generic });
    } catch {
      setStatus({ kind: "error", message: copy.network });
    }
  }

  if (status.kind === "done") {
    const s = copy.success;
    return (
      <div className="text-center">
        <span
          aria-hidden
          className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-jachnun text-2xl text-cream"
        >
          ✓
        </span>
        <h3
          ref={doneRef}
          tabIndex={-1}
          className="mt-5 scroll-mt-28 type-title text-2xl md:text-3xl text-espresso focus-visible:shadow-none"
        >
          {s.title}
        </h3>

        <p className="mt-5 text-sm text-espresso-soft">{s.referenceLabel}</p>
        <p dir="ltr" className="mt-1 type-sub text-3xl tracking-wider text-espresso tabular-nums">
          {status.reference}
        </p>
        <p className="mt-1.5 text-sm text-espresso-soft">{s.referenceHint}</p>

        <dl className="mt-6 divide-y divide-stroke rounded-card border border-stroke bg-cream text-start text-sm">
          {status.slot ? (
            <SummaryRow label={s.pickup}>
              {status.slot.day} · <bdi dir="ltr">{status.slot.window}</bdi> · {copy.pickup.where}
            </SummaryRow>
          ) : null}
          <SummaryRow label={s.package}>{status.packageTitle}</SummaryRow>
          <SummaryRow label={copy.total}>
            <span className="tabular-nums">{formatILS(status.totalAgorot)}</span>
          </SummaryRow>
        </dl>

        <p className="mt-6 text-sm text-espresso-soft">
          {s.questions}{" "}
          <a href={`tel:${business.phone.tel}`} className="text-olive underline underline-offset-4 hover:text-espresso">
            {business.phone.display}
          </a>
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3"
          onClick={() => {
            setPackageId(null);
            setSlotIso(null);
            setStatus({ kind: "idle" });
          }}
        >
          {s.again}
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} method="post" noValidate className="space-y-8">
      {/* 1 — package */}
      <fieldset className="min-w-0" aria-describedby={errors.package ? "jp-package-err" : undefined}>
        <Legend n={1}>{copy.packages.legend}</Legend>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
          {jachnunPackages.map((p) => {
            const selected = p.id === packageId;
            return (
              <label
                key={p.id}
                className={`${choiceBase} min-h-[84px] flex-col justify-between p-3 sm:p-4 ${
                  selected ? choiceSelected : choiceIdle
                }`}
              >
                <input
                  type="radio"
                  name="packageId"
                  value={p.id}
                  checked={selected}
                  onChange={() => {
                    setPackageId(p.id);
                    setErrors((e) => ({ ...e, package: undefined }));
                  }}
                  className="sr-only"
                />
                <span className="pe-6 text-sm sm:text-base font-medium leading-snug text-espresso">
                  {p.title}
                </span>
                <span className="mt-2 flex flex-col items-start">
                  <span className="type-sub text-lg sm:text-xl text-espresso tabular-nums">
                    {formatILS(p.totalAgorot)}
                  </span>
                  {p.units > 1 ? (
                    <span className="text-xs text-espresso-soft tabular-nums">
                      {formatILS(Math.round(p.totalAgorot / p.units))} {copy.perUnit}
                    </span>
                  ) : null}
                </span>
                <CheckDot on={selected} />
              </label>
            );
          })}
        </div>
        <FieldError id="jp-package-err" message={errors.package} />
      </fieldset>

      {/* 2 — pickup window */}
      <fieldset className="min-w-0" aria-describedby={errors.slot ? "jp-slot-err" : "jp-slot-note"}>
        <Legend n={2}>{copy.pickup.legend}</Legend>
        <p className="mt-1.5 ps-10 text-sm text-espresso-soft min-h-[1.25rem]">
          {slots ? `${slots[0]?.day} · ${copy.pickup.where}` : null}
        </p>
        {slots ? (
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:gap-3">
            {slots.map((slot) => {
              const selected = slot.iso === slotIso;
              return (
                <label
                  key={slot.iso}
                  className={`${choiceBase} min-h-[52px] items-center justify-center px-3 ${
                    selected ? choiceSelected : choiceIdle
                  }`}
                >
                  <input
                    type="radio"
                    name="pickupSlot"
                    value={slot.iso}
                    checked={selected}
                    onChange={() => {
                      setSlotIso(slot.iso);
                      setErrors((e) => ({ ...e, slot: undefined }));
                    }}
                    aria-label={slot.label}
                    className="sr-only"
                  />
                  {/* A clock range reads left to right even in Hebrew. */}
                  <bdi dir="ltr" className="text-base font-medium text-espresso tabular-nums">
                    {slot.window}
                  </bdi>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:gap-3" aria-busy="true" aria-label={copy.pickup.loading}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} aria-hidden className="h-[52px] rounded-input border-2 border-stroke bg-cream-2/60" />
            ))}
          </div>
        )}
        <FieldError id="jp-slot-err" message={errors.slot} />
        <p id="jp-slot-note" className="mt-1 text-xs leading-relaxed text-espresso-soft">
          {copy.pickup.cutoffNote}
        </p>
      </fieldset>

      {/* 3 — details */}
      <fieldset className="min-w-0">
        <Legend n={3}>{copy.details.legend}</Legend>
        <div className="pt-3 space-y-1">
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
            maxLength={120}
            value={details.email}
            onChange={(v) => change("email", v)}
            onBlur={() => blur("email")}
            error={errors.email}
          />
          <FormField
            id="jp-notes"
            label={copy.details.notes.label}
            name="notes"
            type="textarea"
            rows={3}
            hint={copy.details.notes.hint}
            maxLength={500}
            value={details.notes}
            onChange={(v) => change("notes", v)}
            onBlur={() => blur("notes")}
            error={errors.notes}
          />
        </div>
      </fieldset>

      {/* Total + submit */}
      <div className="border-t border-stroke pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-espresso-soft">{copy.total}</span>
          {pkg ? (
            <span className="type-sub text-2xl text-espresso tabular-nums">{formatILS(pkg.totalAgorot)}</span>
          ) : (
            <span className="text-sm text-espresso-soft">{copy.totalEmpty}</span>
          )}
        </div>

        {status.kind === "error" ? (
          <div role="alert" className="mt-4 rounded-input border border-jachnun/40 bg-jachnun/[0.07] px-4 py-3 text-sm text-jachnun">
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
          size="xl"
          disabled={submitting}
          className="mt-4 w-full"
          icon={submitting ? undefined : <IconArrow />}
        >
          {submitting ? copy.submitting : copy.submit}
        </Button>
        <p className="mt-3 text-center text-xs text-espresso-soft">{copy.payNote}</p>
      </div>
    </form>
  );
}

function Legend({ n, children }: { n: number; children: ReactNode }) {
  return (
    <legend className="flex items-center gap-3 type-sub text-lg md:text-xl text-espresso">
      <span
        aria-hidden
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-jachnun/40 text-sm font-medium text-jachnun tabular-nums"
      >
        {n}
      </span>
      {children}
    </legend>
  );
}

function CheckDot({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={
        "absolute top-3 end-3 grid h-5 w-5 place-items-center rounded-full border-2 text-[0.65rem] leading-none " +
        "transition-colors duration-fast " +
        (on ? "border-jachnun bg-jachnun text-cream" : "border-stroke bg-cream-3 text-transparent")
      }
    >
      ✓
    </span>
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
