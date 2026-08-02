"use client";

/**
 * Pre-order form. Computes available pickup slots client-side from the
 * shared `getAvailableSlots()` helper — pure function over static data
 * plus the user's clock, so no API round-trip needed. POSTs the chosen
 * slot to /api/jachnun-order; the server re-validates against the same
 * helper before persisting. All UX text is Hebrew.
 */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { jachnun as content } from "@/content/jachnun";
import { getAvailableSlots, type Slot } from "@/lib/jachnun-cutoff";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; reference: string }
  | { kind: "error"; message: string };

export function JachnunOrderForm() {
  // Slots are computed AFTER mount, not during render. `getAvailableSlots()`
  // reads the clock, and the server renders in UTC while the visitor is in
  // Asia/Jerusalem — around the Thursday 18:00 cutoff the two disagree about
  // which Shabbat is on offer, which is a hydration mismatch on the one
  // field where being wrong costs a real order.
  const [slots, setSlots] = useState<Slot[] | null>(null);

  useEffect(() => {
    setSlots(getAvailableSlots());
  }, []);

  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const loading = slots === null;
  const noSlots = slots !== null && slots.length === 0;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      quantity: Number(fd.get("quantity") ?? 0),
      pickupSlot: String(fd.get("pickupSlot") ?? ""),
      notes: String(fd.get("notes") ?? "") || undefined,
    };

    try {
      const r = await fetch("/api/jachnun-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (r.ok && j?.ok) setStatus({ kind: "success", reference: j.reference });
      else setStatus({ kind: "error", message: j?.error ?? "אירעה שגיאה. נסו שוב." });
    } catch {
      setStatus({ kind: "error", message: "שגיאת רשת. נסו שוב." });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="bg-cream-2 border border-stroke rounded-card p-8 text-center">
        <div className="type-display text-2xl text-espresso mb-2">תודה! ההזמנה התקבלה.</div>
        <p className="text-base text-espresso-soft mb-4">
          מספר ההזמנה שלכם: <strong className="text-espresso">{status.reference}</strong>.
          נראה אתכם בשבת בבוקר.
        </p>
        <p className="text-sm text-espresso-soft">
          שמרו את המספר — נשתמש בו באיסוף.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FormField label="שם מלא" name="name" type="text" required autoComplete="name" />
      <FormField
        label="טלפון נייד"
        name="phone"
        type="tel"
        required
        autoComplete="tel"
        inputMode="tel"
        placeholder="050-1234567"
      />
      <FormField
        label="כמות (יחידות)"
        name="quantity"
        type="number"
        required
        min={content.form.minQuantity}
        max={content.form.maxQuantity}
        defaultValue={1}
        hint={content.form.quantityHint}
      />

      <FormField
        label={content.form.slotLabel}
        name="pickupSlot"
        type="select"
        required
        hint={content.form.slotHint}
        options={
          slots?.length
            ? slots.map((s) => ({ value: s.iso, label: s.label }))
            : [
                {
                  value: "",
                  // "Loading" and "none available" are different states and
                  // used to share one message — a closed window read as a
                  // spinner that never resolved.
                  label: loading ? "טוען חלונות איסוף…" : "אין כרגע חלונות איסוף פנויים",
                },
              ]
        }
      />

      {noSlots ? (
        <p className="text-sm text-espresso-soft">
          חלון ההזמנות לשבת הקרובה נסגר. נסו שוב בהמשך השבוע, או התקשרו אלינו.
        </p>
      ) : null}

      <FormField
        label="הערות (אופציונלי)"
        name="notes"
        type="textarea"
        hint="אלרגיות, בקשות מיוחדות, וכו'."
      />

      {status.kind === "error" ? (
        <p role="alert" className="text-sm text-jachnun">{status.message}</p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status.kind === "submitting" || !slots?.length}
        className="w-full"
      >
        {status.kind === "submitting" ? "שולח…" : "שלחו הזמנה"}
      </Button>
    </form>
  );
}
