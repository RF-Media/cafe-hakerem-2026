/**
 * Customer confirmation emails, and the internal kitchen ticket.
 *
 * Hand-built tables with inline styles, because that is what Gmail, Apple Mail
 * and desktop Outlook (Word's renderer) all agree on:
 * - layout is nested tables, never divs; spacing is td padding, never margins
 * - a 600px MSO ghost table keeps Outlook from stretching the fluid container
 * - background colours go on td `bgcolor` as well as `style`
 * - the button is a padded td around a link, so Outlook keeps the hit area
 * - border-radius is decoration only; Outlook squares it off and that's fine
 * Colours are the "Roastery Noir" tokens from globals.css as hex.
 *
 * Everything a customer typed goes through escapeHtml before interpolation.
 */
import { business } from "@/content/business";
import { emailShell, jachnunConfirmation, cateringConfirmation, orderTicket } from "@/content/emails";
import { jachnun, type JachnunPackage } from "@/content/jachnun";
import type { Slot } from "@/lib/jachnun-cutoff";
import { formatILS } from "@/lib/money";
import { escapeHtml } from "@/lib/resend";

export const C = {
  ground: "#f6f3ee",
  card: "#ffffff",
  panel: "#f8f5f0",
  stroke: "#e4ded5",
  ink: "#231d19",
  inkSoft: "#6b625b",
  deep: "#16110e",
  pine: "#29433a",
  brassInk: "#80612d",
  cream: "#f6f3ee",
};

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Hebrew', Arial, sans-serif";

const siteUrl = business.siteUrl.replace(/\/$/, "");

export const multiline = (s: string) => escapeHtml(s).replace(/\n/g, "<br>");

export function eventDateLabel(iso: string): string {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** "א׳–ה׳ 07:00–20:00 · ו׳ 07:00–15:00 · שבת 08:00–21:00" — consecutive equal days grouped. */
export function hoursSummary(): string {
  const groups: { from: number; to: number; open: string | null; close: string | null }[] = [];
  for (const h of business.hours) {
    const last = groups[groups.length - 1];
    if (last && last.open === h.open && last.close === h.close && last.to === h.day - 1) last.to = h.day;
    else groups.push({ from: h.day, to: h.day, open: h.open, close: h.close });
  }
  const d = emailShell.dayShort;
  return groups
    .map((g) => {
      const days = g.from === g.to ? d[g.from] : `${d[g.from]}–${d[g.to]}`;
      const time = g.open && g.close ? `<span dir="ltr">${g.open}–${g.close}</span>` : emailShell.closed;
      return `<span style="white-space:nowrap;">${days} ${time}</span>`;
    })
    .join(" · ");
}

const addressLine = () => {
  const a = business.address;
  return `${a.street.he}, ${a.neighborhood.he}, ${a.city.he}`;
};

/* ─── Shell ───────────────────────────────────────────────────── */

function brandedEmail({ preheader, eyebrow, title, body }: { preheader: string; eyebrow: string; title: string; body: string }): string {
  return `<!doctype html>
<html lang="he" dir="rtl" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(title)}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<style>table,td,p,a,span,h1{font-family:Arial,sans-serif !important;}</style>
<![endif]-->
<style>
  a { color: ${C.pine}; }
  @media (max-width: 620px) {
    .px { padding-left: 20px !important; padding-right: 20px !important; }
    .stack { display: block !important; width: 100% !important; }
    .stack-gap { padding-top: 12px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.ground};-webkit-text-size-adjust:100%;" dir="rtl">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${C.ground}" style="background:${C.ground};">
<tr><td align="center" style="padding:28px 12px;">
<!--[if mso]><table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center"><tr><td><![endif]-->
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;font-family:${FONT};" dir="rtl">
  <tr><td bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.stroke};border-radius:14px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" dir="rtl">
      <tr><td class="px" align="center" style="padding:32px 40px 20px;">
        <a href="${siteUrl}" style="text-decoration:none;"><img src="${siteUrl}/images/logo_dark.png" width="112" height="50" alt="${business.name.he}" style="display:block;width:112px;height:auto;border:0;outline:none;"></a>
      </td></tr>
      <tr><td class="px" style="padding:0 40px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td height="1" style="height:1px;line-height:1px;font-size:1px;background:${C.stroke};" bgcolor="${C.stroke}">&nbsp;</td></tr></table></td></tr>
      <tr><td class="px" align="right" style="padding:28px 40px 0;text-align:right;">
        <p style="margin:0 0 6px;font-size:12px;line-height:18px;letter-spacing:2px;color:${C.brassInk};mso-line-height-rule:exactly;">${escapeHtml(eyebrow)}</p>
        <h1 style="margin:0;font-size:24px;line-height:30px;font-weight:700;color:${C.ink};mso-line-height-rule:exactly;">${escapeHtml(title)}</h1>
      </td></tr>
      ${body}
    </table>
  </td></tr>
  <tr><td align="center" style="padding:22px 20px 0;text-align:center;font-size:12px;line-height:20px;color:${C.inkSoft};mso-line-height-rule:exactly;" dir="rtl">
    <strong style="color:${C.ink};">${business.name.he}</strong> · ${addressLine()} · <a href="tel:${business.phone.tel}" style="color:${C.inkSoft};text-decoration:none;white-space:nowrap;" dir="ltr">${business.phone.display}</a><br>
    ${hoursSummary()}
  </td></tr>
  <tr><td align="center" style="padding:14px 20px 8px;font-size:11px;line-height:16px;color:#9a918a;" dir="rtl">
    ${emailShell.poweredBy} <a dir="ltr" href="${emailShell.poweredByUrl}" style="color:#9a918a;text-decoration:underline;">${emailShell.poweredByName}</a>
  </td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}

/* ─── Building blocks (each one is a <tr> of the card) ────────── */

function row(inner: string, pad = "20px 40px 0"): string {
  return `<tr><td class="px" align="right" style="padding:${pad};text-align:right;">${inner}</td></tr>`;
}

function text(t: string, opts: { size?: number; color?: string; weight?: number } = {}): string {
  const size = opts.size ?? 15;
  return `<p style="margin:0;font-size:${size}px;line-height:${Math.round(size * 1.6)}px;color:${opts.color ?? C.ink};font-weight:${opts.weight ?? 400};mso-line-height-rule:exactly;">${t}</p>`;
}

function sectionLabel(t: string): string {
  return `<p style="margin:0 0 8px;font-size:12px;line-height:18px;letter-spacing:1px;color:${C.inkSoft};font-weight:700;">${t}</p>`;
}

/** Two quiet facts side by side (stacks on phones): reference + the next thing that matters. */
function summaryStrip(a: { label: string; value: string }, b: { label: string; value: string }): string {
  const cell = (x: { label: string; value: string }, cls: string) =>
    `<td class="${cls}" width="50%" valign="top" style="padding:14px 18px;" align="right">
      <p style="margin:0 0 2px;font-size:12px;line-height:18px;color:${C.inkSoft};">${x.label}</p>
      <p style="margin:0;font-size:16px;line-height:24px;font-weight:700;color:${C.ink};">${x.value}</p>
    </td>`;
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${C.panel}" style="background:${C.panel};border:1px solid ${C.stroke};border-radius:10px;" dir="rtl"><tr>
    ${cell(a, "stack")}${cell(b, "stack stack-gap")}
  </tr></table>`;
}

/** Label/value rows; values are already-escaped HTML. */
function detailRows(rows: [string, string][]): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" dir="rtl">${rows
    .map(
      ([label, value]) =>
        `<tr><td valign="top" width="110" style="padding:9px 0 9px 12px;border-bottom:1px solid ${C.stroke};font-size:14px;line-height:20px;color:${C.inkSoft};">${label}</td><td style="padding:9px 0;border-bottom:1px solid ${C.stroke};font-size:14px;line-height:20px;color:${C.ink};">${value}</td></tr>`,
    )
    .join("")}</table>`;
}

const ref = (r: string) => `<span dir="ltr" style="letter-spacing:1px;">${escapeHtml(r)}</span>`;

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

export function jachnunConfirmationEmail(d: JachnunConfirmationInput): { subject: string; html: string } {
  const c = jachnunConfirmation;
  const total = formatILS(d.pkg.totalAgorot);
  const included = jachnun.whatsIncluded.slice(1).join(" · ");
  const slot = `${escapeHtml(d.slot.day)} · <span dir="ltr" style="white-space:nowrap;">${escapeHtml(d.slot.window)}</span>`;

  const items = `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" dir="rtl">
  <tr>
    <td style="padding:0 0 10px;font-size:15px;line-height:22px;color:${C.ink};" align="right"><strong>${escapeHtml(d.pkg.title)}</strong> <span style="color:${C.inkSoft};">· ${c.unitsLabel(d.pkg.units)}</span></td>
    <td align="left" style="padding:0 0 10px;font-size:15px;line-height:22px;color:${C.ink};white-space:nowrap;">${total}</td>
  </tr>
  <tr>
    <td style="padding:0 0 14px;font-size:13px;line-height:20px;color:${C.inkSoft};border-bottom:1px solid ${C.stroke};" align="right">${c.includedLabel}: ${escapeHtml(included)}</td>
    <td align="left" style="padding:0 0 14px;font-size:13px;line-height:20px;color:${C.inkSoft};white-space:nowrap;border-bottom:1px solid ${C.stroke};">${c.includedPrice}</td>
  </tr>
  <tr>
    <td style="padding:14px 0 0;font-size:15px;line-height:22px;font-weight:700;color:${C.ink};" align="right">${c.totalLabel}</td>
    <td align="left" style="padding:14px 0 0;font-size:20px;line-height:26px;font-weight:700;color:${C.pine};white-space:nowrap;">${total}</td>
  </tr>
</table>`;

  const details: [string, string][] = [
    [c.nameLabel, escapeHtml(d.name)],
    [c.phoneLabel, `<span dir="ltr">${escapeHtml(d.phone)}</span>`],
  ];
  if (d.email) details.push([c.emailLabel, `<span dir="ltr">${escapeHtml(d.email)}</span>`]);
  if (d.notes) details.push([c.notesLabel, multiline(d.notes)]);

  const body = [
    row(text(`${escapeHtml(c.greeting(d.name))}<br>${c.intro}`, { color: C.inkSoft }), "16px 40px 0"),
    row(summaryStrip({ label: c.referenceLabel, value: ref(d.reference) }, { label: c.pickupHeading, value: slot }), "24px 40px 0"),
    row(
      sectionLabel(c.pickupPlaceHeading) +
        text(`${business.name.he}, ${addressLine()}`) +
        text(`${c.navigateLabel} <a href="${business.socials.waze}" style="color:${C.pine};">${c.wazeLabel}</a> · <a href="${business.socials.googleMaps}" style="color:${C.pine};">${c.mapsLabel}</a>`, { size: 13, color: C.inkSoft }),
      "28px 40px 0",
    ),
    row(sectionLabel(c.orderHeading) + items, "28px 40px 0"),
    row(text(c.notChargedNote, { size: 13, color: C.inkSoft }), "10px 40px 0"),
    row(sectionLabel(c.detailsHeading) + detailRows(details), "28px 40px 0"),
    row(
      text(`${c.changeNote} <a href="tel:${business.phone.tel}" style="color:${C.pine};text-decoration:none;font-weight:700;" dir="ltr">${business.phone.display}</a>`, { size: 14 }) +
        `<p style="margin:12px 0 0;font-size:12px;line-height:18px;color:${C.inkSoft};">${emailShell.pdfNote}</p>`,
      "24px 40px 34px",
    ),
  ].join("\n");

  return {
    subject: c.subject(d.reference),
    html: brandedEmail({ preheader: c.preheader(d.slot.day), eyebrow: c.eyebrow, title: c.title, body }),
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

export function cateringConfirmationEmail(d: CateringConfirmationInput): { subject: string; html: string } {
  const c = cateringConfirmation;

  const rows: [string, string][] = [
    [c.nameLabel, escapeHtml(d.name)],
    [c.phoneLabel, `<span dir="ltr">${escapeHtml(d.phone)}</span>`],
  ];
  if (d.email) rows.push([c.emailLabel, `<span dir="ltr">${escapeHtml(d.email)}</span>`]);
  if (d.guestCount) rows.push([c.guestsLabel, String(d.guestCount)]);
  rows.push([c.messageLabel, multiline(d.message)]);

  const body = [
    row(text(`${escapeHtml(c.greeting(d.name))}<br>${c.intro}`, { color: C.inkSoft }), "16px 40px 0"),
    row(
      summaryStrip(
        { label: c.referenceLabel, value: ref(d.reference) },
        { label: c.eventDateLabel, value: d.eventDate ? escapeHtml(eventDateLabel(d.eventDate)) : "—" },
      ),
      "24px 40px 0",
    ),
    row(sectionLabel(c.recapHeading) + detailRows(rows), "28px 40px 0"),
    row(sectionLabel(c.nextHeading) + text(c.nextBody), "28px 40px 0"),
    row(
      `<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
        <td bgcolor="${C.ink}" style="background:${C.ink};border-radius:999px;padding:12px 26px;" align="center">
          <a href="${siteUrl}/catering" style="color:${C.cream};font-size:14px;line-height:20px;font-weight:700;text-decoration:none;display:inline-block;">${c.ctaLabel}</a>
        </td>
      </tr></table>` + `<p style="margin:18px 0 0;font-size:12px;line-height:18px;color:${C.inkSoft};">${emailShell.pdfNote}</p>`,
      "20px 40px 34px",
    ),
  ].join("\n");

  return {
    subject: c.subject(d.reference),
    html: brandedEmail({ preheader: c.preheader, eyebrow: c.eyebrow, title: c.title, body }),
  };
}

/* ─── Kitchen ticket ──────────────────────────────────────────── */

/**
 * The internal email: no logo, no hours, no marketing copy. A green header
 * with the reference, then what to make, who it's for and what to collect, in
 * type large enough to read off a phone propped up in the kitchen.
 */
function ticket({ header, headline, sub, rows, total, footer }: {
  header: string;
  headline: string;
  sub?: string;
  /** label + already-escaped HTML value */
  rows: [string, string][];
  total?: { label: string; value: string };
  footer: string;
}): string {
  const rowHtml = rows
    .map(
      ([label, value]) => `<tr>
  <td valign="top" style="padding:14px 0 14px 16px;border-bottom:1px solid ${C.stroke};font-size:15px;color:${C.inkSoft};white-space:nowrap;width:1%;">${label}</td>
  <td style="padding:14px 0;border-bottom:1px solid ${C.stroke};font-size:20px;line-height:1.4;color:${C.ink};">${value}</td>
</tr>`,
    )
    .join("");
  const totalHtml = total
    ? `<tr><td colspan="2" style="padding:20px 0 0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td bgcolor="${C.deep}" style="background:${C.deep};border-radius:12px;padding:18px 20px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
      <td style="font-size:18px;font-weight:700;color:${C.cream};">${total.label}</td>
      <td align="left" style="font-size:32px;font-weight:700;color:${C.cream};white-space:nowrap;">${total.value}</td>
    </tr></table>
  </td></tr></table>
</td></tr>`
    : "";
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(header)}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:${FONT};color:${C.ink};">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
<tr><td align="center" style="padding:16px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;" dir="rtl">
    <tr><td colspan="2" bgcolor="${C.pine}" style="background:${C.pine};border-radius:12px;padding:18px 20px;text-align:right;color:${C.cream};">
      <p style="margin:0 0 4px;font-size:15px;font-weight:500;">${escapeHtml(header)}</p>
      <p style="margin:0;font-size:30px;font-weight:700;letter-spacing:0.04em;" dir="ltr" align="right">${escapeHtml(headline)}</p>
      ${sub ? `<p style="margin:6px 0 0;font-size:20px;font-weight:700;">${sub}</p>` : ""}
    </td></tr>
    ${rowHtml}
    ${totalHtml}
    <tr><td colspan="2" style="padding:16px 0 0;font-size:13px;color:${C.inkSoft};">${escapeHtml(footer)}</td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

const phoneLink = (phone: string) =>
  `<a href="tel:${escapeHtml(phone.replace(/[^\d+]/g, ""))}" style="color:${C.pine};font-weight:700;text-decoration:none;" dir="ltr">${escapeHtml(phone)}</a>`;

export function jachnunOrderTicket(d: JachnunConfirmationInput): { subject: string; html: string } {
  const t = orderTicket;
  const total = formatILS(d.pkg.totalAgorot);
  const rows: [string, string][] = [
    [t.orderLabel, `<strong>${escapeHtml(d.pkg.title)}</strong> · ${t.units(d.pkg.units)}`],
    [t.includedLabel, `<span style="font-size:16px;">${escapeHtml(jachnun.whatsIncluded.slice(1).join(" · "))}</span>`],
  ];
  if (d.notes) rows.push([t.notesLabel, `<strong>${multiline(d.notes)}</strong>`]);
  rows.push([t.customerLabel, `${escapeHtml(d.name)}<br>${phoneLink(d.phone)}`]);

  return {
    subject: t.jachnunSubject(d.reference, d.name, total, d.slot.label),
    html: ticket({
      header: t.jachnunHeader,
      headline: d.reference,
      sub: `${t.pickupLabel}: ${escapeHtml(d.slot.day)} · <span dir="ltr" style="white-space:nowrap;">${escapeHtml(d.slot.window)}</span>`,
      rows,
      total: { label: t.totalLabel, value: total },
      footer: d.email ? t.sentTo(d.email) : t.noCustomerEmail,
    }),
  };
}

export function cateringInquiryTicket(d: CateringConfirmationInput): { subject: string; html: string } {
  const t = orderTicket;
  const rows: [string, string][] = [];
  if (d.eventDate) rows.push([t.eventDateLabel, escapeHtml(eventDateLabel(d.eventDate))]);
  if (d.guestCount) rows.push([t.guestsLabel, String(d.guestCount)]);
  rows.push([t.messageLabel, multiline(d.message)]);
  rows.push([t.customerLabel, `${escapeHtml(d.name)}<br>${phoneLink(d.phone)}`]);

  return {
    subject: t.cateringSubject(d.reference, d.name),
    html: ticket({
      header: t.cateringHeader,
      headline: d.reference,
      sub: t.callBack,
      rows,
      footer: d.email ? t.sentTo(d.email) : t.noCustomerEmail,
    }),
  };
}
