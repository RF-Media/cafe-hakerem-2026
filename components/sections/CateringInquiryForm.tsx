"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; reference: string }
  | { kind: "error"; message: string };

export function CateringInquiryForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    const fd = new FormData(e.currentTarget);
    const guests = String(fd.get("guestCount") ?? "").trim();
    const eventDate = String(fd.get("eventDate") ?? "").trim();
    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? "") || undefined,
      eventDate: eventDate ? new Date(eventDate).toISOString() : undefined,
      guestCount: guests ? Number(guests) : undefined,
      message: String(fd.get("message") ?? ""),
    };

    try {
      const r = await fetch("/api/catering-inquiry", {
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
      <div className="bg-cream-2 border border-stroke rounded-2xl p-8 text-center">
        <div className="font-display text-2xl text-espresso mb-2">תודה! הפנייה נשלחה.</div>
        <p className="text-base text-espresso-soft">
          מספר פנייה: <strong className="text-espresso">{status.reference}</strong>. נחזור אליכם בהקדם.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid md:grid-cols-2 gap-5">
        <FormField label="שם מלא" name="name" type="text" required autoComplete="name" />
        <FormField label="טלפון" name="phone" type="tel" required autoComplete="tel" inputMode="tel" />
      </div>
      <FormField label="אימייל (אופציונלי)" name="email" type="email" autoComplete="email" />
      <div className="grid md:grid-cols-2 gap-5">
        <FormField label="תאריך אירוע (אופציונלי)" name="eventDate" type="date" />
        <FormField label="מספר אורחים משוער (אופציונלי)" name="guestCount" type="number" min={1} max={1000} inputMode="numeric" />
      </div>
      <FormField
        label="ספרו לנו על האירוע"
        name="message"
        type="textarea"
        required
        rows={5}
        hint="סוג האירוע, סוג המגש המעדף, אילוצים תזונתיים."
      />

      {status.kind === "error" ? (
        <p role="alert" className="text-sm text-jachnun">{status.message}</p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status.kind === "submitting"}
        className="w-full md:w-auto"
      >
        {status.kind === "submitting" ? "שולח…" : "שלחו פנייה"}
      </Button>
    </form>
  );
}
