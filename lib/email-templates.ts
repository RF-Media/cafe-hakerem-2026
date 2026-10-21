/**
 * Customer confirmation emails.
 *
 * Inline-styled tables, not React Email: two templates don't justify a
 * dependency, and table layout + inline styles is what every mail client
 * (Outlook included) actually renders. Colours are the "Roastery Noir" tokens
 * from globals.css as hex, since mail clients don't read CSS variables.
 *
 * Everything a customer typed goes through escapeHtml before interpolation.
 */
import { business } from "@/content/business";
import { emailShell, jachnunConfirmation, cateringConfirmation, orderCopy } from "@/content/emails";
import { jachnun, type JachnunPackage } from "@/content/jachnun";
import type { Slot } from "@/lib/jachnun-cutoff";
import { formatILS } from "@/lib/money";
import { escapeHtml } from "@/lib/resend";

const C = {
  ground: "#f6f3ee",
  card: "#fdfbf6",
  panel: "#efebe4",
  stroke: "#dcd6cd",
  ink: "#231d19",
  inkSoft: "#665c55",
  deep: "#16110e",
  pine: "#29433a",
  brassInk: "#80612d",
  cream: "#f6f3ee",
};

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Hebrew', Arial, sans-serif";

const siteUrl = business.siteUrl.replace(/\/$/, "");

function hoursRows(): string {
  return business.hours
    .map((h) => {
      const time = h.open && h.close ? `<span dir="ltr">${h.open}–${h.close}</span>` : "סגור";
      return `<tr><td style="padding:2px 0 2px 16px;color:${C.inkSoft};font-size:13px;">${h.label.he}</td><td style="padding:2px 0;color:${C.ink};font-size:13px;">${time}</td></tr>`;
    })
    .join("");
}

function brandedEmail({
  preheader,
  eyebrow,
  title,
  body,
  notice,
}: {
  preheader: string;
  eyebrow: string;
  title: string;
  body: string;
  /** Already-escaped HTML shown in a banner above the card — the internal copy uses it. */
  notice?: string;
}): string {
  const a = business.address;
  const noticeRow = notice
    ? `<tr><td bgcolor="${C.pine}" style="background:${C.pine};border-radius:12px;padding:14px 20px;margin:0;text-align:right;font-size:14px;line-height:1.6;color:${C.cream};" dir="rtl">${notice}</td></tr>
    <tr><td style="height:12px;line-height:12px;font-size:12px;">&nbsp;</td></tr>`
    : "";
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.ground};font-family:${FONT};color:${C.ink};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${C.ground}" style="background:${C.ground};">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;">
    <tr><td align="center" style="padding:0 0 24px;">
      <a href="${siteUrl}" style="text-decoration:none;">
        <img src="${siteUrl}/images/logo_dark.png" width="180" alt="${business.name.he}" style="display:block;width:180px;max-width:60%;height:auto;border:0;margin:0 auto;">
      </a>
    </td></tr>
    ${noticeRow}
    <tr><td bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.stroke};border-radius:16px;padding:32px 28px;text-align:right;" dir="rtl">
      <div style="width:32px;height:1px;background:${C.brassInk};margin:0 0 12px;line-height:1px;font-size:1px;">&nbsp;</div>
      <p style="margin:0 0 8px;color:${C.brassInk};font-size:12px;letter-spacing:0.18em;font-weight:500;">${escapeHtml(eyebrow)}</p>
      <h1 style="margin:0 0 20px;color:${C.ink};font-size:26px;line-height:1.15;font-weight:700;letter-spacing:-0.02em;">${escapeHtml(title)}</h1>
      ${body}
    </td></tr>
    <tr><td style="padding:28px 8px 0;text-align:right;" dir="rtl">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td valign="top" style="padding:0 0 16px 12px;font-size:13px;line-height:1.6;color:${C.inkSoft};">
            <strong style="color:${C.ink};">${business.name.he}</strong><br>
            ${a.street.he}, ${a.neighborhood.he}, ${a.city.he}<br>
            ${emailShell.contactLabel}: <a href="tel:${business.phone.tel}" style="color:${C.pine};text-decoration:none;" dir="ltr">${business.phone.display}</a>
          </td>
          <td valign="top" style="padding:0 0 16px;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:${C.ink};">${emailShell.hoursLabel}</p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">${hoursRows()}</table>
          </td>
        </tr>
      </table>
    </td></tr>
    <tr><td align="center" style="padding:16px 8px 0;border-top:1px solid ${C.stroke};font-size:11px;color:${C.inkSoft};" dir="rtl">
      ${emailShell.poweredBy} <a dir="ltr" href="${emailShell.poweredByUrl}" style="color:${C.ink};font-weight:700;text-decoration:none;">${emailShell.poweredByName}</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

function p(text: string, style = ""): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${C.ink};${style}">${text}</p>`;
}

function heading(text: string): string {
  return `<p style="margin:28px 0 10px;font-size:16px;font-weight:700;color:${C.ink};">${text}</p>`;
}

function referenceBox(label: string, reference: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 8px;">
<tr><td bgcolor="${C.panel}" style="background:${C.panel};border-radius:12px;padding:16px 20px;text-align:center;">
  <p style="margin:0 0 4px;font-size:12px;color:${C.inkSoft};">${label}</p>
  <p style="margin:0;font-size:24px;font-weight:700;letter-spacing:0.08em;color:${C.ink};" dir="ltr">${escapeHtml(reference)}</p>
</td></tr></table>`;
}

/** Label/value rows; values are already-escaped HTML. */
function detailRows(rows: [string, string][]): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${rows
    .map(
      ([label, value]) =>
        `<tr><td valign="top" style="padding:8px 0 8px 16px;border-bottom:1px solid ${C.stroke};font-size:14px;color:${C.inkSoft};white-space:nowrap;width:1%;">${label}</td><td style="padding:8px 0;border-bottom:1px solid ${C.stroke};font-size:14px;color:${C.ink};">${value}</td></tr>`,
    )
    .join("")}</table>`;
}

const multiline = (s: string) => escapeHtml(s).replace(/\n/g, "<br>");

/* ─── Jachnun ─────────────────────────────────────────────────── */

export type JachnunConfirmationInput = {
  reference: string;
  slot: Slot;
  pkg: JachnunPackage;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
};

/**
 * `copy: true` renders the same confirmation as an internal copy: an
 * order-copy banner (who it was for, what to collect) and an internal
 * subject line. The body stays identical, so the copy shows exactly what the
 * customer saw.
 */
export type ConfirmationOptions = { copy?: boolean };

export function jachnunConfirmationEmail(
  d: JachnunConfirmationInput,
  { copy = false }: ConfirmationOptions = {},
): { subject: string; html: string } {
  const c = jachnunConfirmation;
  const total = formatILS(d.pkg.totalAgorot);
  const a = business.address;
  const included = jachnun.whatsIncluded.slice(1).join(" · ");

  const lineItems = `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${C.stroke};font-size:15px;color:${C.ink};">
    <strong>${escapeHtml(d.pkg.title)}</strong><br>
    <span style="font-size:13px;color:${C.inkSoft};">${c.unitsLabel(d.pkg.units)}</span>
  </td>
  <td align="left" style="padding:10px 0;border-bottom:1px solid ${C.stroke};font-size:15px;color:${C.ink};white-space:nowrap;">${formatILS(d.pkg.totalAgorot)}</td>
</tr>
<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${C.stroke};font-size:13px;color:${C.inkSoft};">${c.includedLabel}: ${escapeHtml(included)}</td>
  <td align="left" style="padding:10px 0;border-bottom:1px solid ${C.stroke};font-size:13px;color:${C.inkSoft};white-space:nowrap;">${c.includedPrice}</td>
</tr>
</table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:12px;">
<tr><td bgcolor="${C.deep}" style="background:${C.deep};border-radius:12px;padding:16px 20px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
    <td style="font-size:15px;font-weight:700;color:${C.cream};">${c.totalLabel}</td>
    <td align="left" style="font-size:24px;font-weight:700;color:${C.cream};white-space:nowrap;">${formatILS(d.pkg.totalAgorot)}</td>
  </tr></table>
</td></tr></table>
<p style="margin:10px 0 0;font-size:13px;color:${C.inkSoft};">${c.notChargedNote}</p>`;

  const details: [string, string][] = [
    [c.nameLabel, escapeHtml(d.name)],
    [c.phoneLabel, `<span dir="ltr">${escapeHtml(d.phone)}</span>`],
  ];
  if (d.email) details.push([c.emailLabel, `<span dir="ltr">${escapeHtml(d.email)}</span>`]);
  if (d.notes) details.push([c.notesLabel, multiline(d.notes)]);

  const body = `
${p(escapeHtml(c.greeting(d.name)))}
${p(c.intro)}
${referenceBox(c.referenceLabel, d.reference)}
${heading(c.pickupHeading)}
${p(`<strong>${escapeHtml(d.slot.day)}</strong> · <span dir="ltr">${escapeHtml(d.slot.window)}</span><br>${business.name.he}, ${a.street.he}, ${a.neighborhood.he}, ${a.city.he}<br><a href="${business.socials.waze}" style="color:${C.pine};font-weight:700;">${c.wazeLabel}</a>`, "margin:0;")}
${heading(c.orderHeading)}
${lineItems}
${heading(c.detailsHeading)}
${detailRows(details)}
${p(`${c.changeNote} <a href="tel:${business.phone.tel}" style="color:${C.pine};font-weight:700;text-decoration:none;" dir="ltr">${business.phone.display}</a>`, "margin:24px 0 0;")}
`;

  const k = orderCopy;
  return {
    subject: copy ? k.jachnunSubject(d.reference, d.name, total, d.slot.label) : c.subject(d.reference),
    html: brandedEmail({
      preheader: copy ? k.jachnunNotice(d.name, d.reference, total) : c.preheader(d.slot.day),
      eyebrow: c.eyebrow,
      title: c.title,
      body,
      notice: copy
        ? `<strong>${k.banner}</strong><br>${escapeHtml(k.jachnunNotice(d.name, d.reference, total))}<br>${escapeHtml(d.email ? k.sentTo(d.email) : k.noCustomerEmail)}`
        : undefined,
    }),
  };
}

/* ─── Catering ────────────────────────────────────────────────── */

export type CateringConfirmationInput = {
  reference: string;
  name: string;
  phone: string;
  email?: string;
  eventDate?: string;
  guestCount?: number;
  message: string;
};

export function cateringConfirmationEmail(
  d: CateringConfirmationInput,
  { copy = false }: ConfirmationOptions = {},
): { subject: string; html: string } {
  const c = cateringConfirmation;

  const rows: [string, string][] = [
    [c.nameLabel, escapeHtml(d.name)],
    [c.phoneLabel, `<span dir="ltr">${escapeHtml(d.phone)}</span>`],
  ];
  if (d.email) rows.push([c.emailLabel, `<span dir="ltr">${escapeHtml(d.email)}</span>`]);
  if (d.eventDate) {
    const date = new Intl.DateTimeFormat("he-IL", {
      timeZone: "Asia/Jerusalem",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(d.eventDate));
    rows.push([c.eventDateLabel, escapeHtml(date)]);
  }
  if (d.guestCount) rows.push([c.guestsLabel, String(d.guestCount)]);
  rows.push([c.messageLabel, multiline(d.message)]);

  const body = `
${p(escapeHtml(c.greeting(d.name)))}
${p(c.intro)}
${referenceBox(c.referenceLabel, d.reference)}
${heading(c.recapHeading)}
${detailRows(rows)}
${heading(c.nextHeading)}
${p(c.nextBody)}
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 0;"><tr>
  <td bgcolor="${C.ink}" style="background:${C.ink};border-radius:999px;">
    <a href="${siteUrl}/catering" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:${C.cream};text-decoration:none;">${c.ctaLabel}</a>
  </td>
</tr></table>
`;

  const k = orderCopy;
  return {
    subject: copy ? k.cateringSubject(d.reference, d.name) : c.subject(d.reference),
    html: brandedEmail({
      preheader: copy ? k.cateringNotice(d.name, d.reference) : c.preheader,
      eyebrow: c.eyebrow,
      title: c.title,
      body,
      notice: copy
        ? `<strong>${k.banner}</strong><br>${escapeHtml(k.cateringNotice(d.name, d.reference))}<br>${escapeHtml(d.email ? k.sentTo(d.email) : k.noCustomerEmail)}`
        : undefined,
    }),
  };
}
