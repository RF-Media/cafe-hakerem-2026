/**
 * The PDF attached to each customer confirmation.
 *
 * Same approach as CoffeeStream's receipts (coffeestream/lib/billing-pdf.ts):
 * an HTML document printed by headless Chromium. A real browser is the only
 * renderer that gets Hebrew right — bidi, mixed Hebrew/Latin/numbers, shaping —
 * without workarounds. On Vercel the binary comes from @sparticuz/chromium;
 * locally it uses the installed Chrome.
 *
 * The font and logo are inlined as data URIs and every other request is
 * blocked, so the customer-typed text in the document can't reach the network.
 */
import fs from "node:fs";
import path from "node:path";
import { business } from "@/content/business";
import { cateringConfirmation, confirmationPdf, emailShell, jachnunConfirmation } from "@/content/emails";
import { jachnun } from "@/content/jachnun";
import {
  C,
  eventDateLabel,
  hoursSummary,
  multiline,
  type CateringConfirmationInput,
  type JachnunConfirmationInput,
} from "@/lib/email-templates";
import { formatILS } from "@/lib/money";
import { escapeHtml } from "@/lib/resend";

const asset = (p: string) => fs.readFileSync(path.join(process.cwd(), p)).toString("base64");

let assets: { font: string; latin: string; logo: string } | null = null;
function getAssets() {
  assets ??= {
    font: asset("lib/pdf-assets/NotoSansHebrew.ttf"),
    // Noto Sans Hebrew covers Hebrew and digits only. Chromium on Vercel has no
    // system fonts to fall back on, so Latin (reference, email, brand names)
    // would print as empty boxes without an embedded fallback.
    latin: asset("lib/pdf-assets/Heebo.ttf"),
    logo: asset("public/images/logo_dark.png"),
  };
  return assets;
}

function issuedToday(): string {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date());
}

function document(opts: { title: string; subtitle: string; meta: [string, string][]; body: string }): string {
  const { font, latin, logo } = getAssets();
  const a = business.address;
  const t = confirmationPdf;
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: "Noto Sans Hebrew"; font-weight: 100 900; src: url(data:font/ttf;base64,${font}) format("truetype"); }
  @font-face { font-family: "Heebo"; font-weight: 100 900; src: url(data:font/ttf;base64,${latin}) format("truetype"); }
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; font-family: "Noto Sans Hebrew", "Heebo"; color: ${C.ink}; font-size: 10.5pt; line-height: 1.55; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 14px; border-bottom: 1px solid ${C.stroke}; }
  .head img { width: 46mm; height: auto; }
  .cafe { text-align: left; font-size: 9pt; color: ${C.inkSoft}; line-height: 1.6; }
  .cafe strong { color: ${C.ink}; font-size: 10pt; }
  .eyebrow { margin: 22px 0 2px; font-size: 9pt; letter-spacing: 2px; color: ${C.brassInk}; }
  h1 { margin: 0 0 16px; font-size: 20pt; font-weight: 700; line-height: 1.2; }
  .meta { display: grid; grid-template-columns: repeat(${opts.meta.length}, 1fr); border: 1px solid ${C.stroke}; border-radius: 8px; background: ${C.panel}; }
  .meta div { padding: 10px 14px; border-inline-start: 1px solid ${C.stroke}; }
  .meta div:first-child { border-inline-start: 0; }
  .meta div > span { display: block; font-size: 8.5pt; color: ${C.inkSoft}; }
  .meta b { font-size: 11pt; }
  h2 { margin: 24px 0 8px; font-size: 9pt; letter-spacing: 1px; color: ${C.inkSoft}; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: right; font-size: 8.5pt; font-weight: 700; color: ${C.inkSoft}; padding: 6px 0; border-bottom: 1px solid ${C.ink}; }
  td { padding: 9px 0; border-bottom: 1px solid ${C.stroke}; vertical-align: top; }
  .num { text-align: left; white-space: nowrap; width: 22%; }
  .qty { text-align: center; width: 14%; }
  .sub { font-size: 9pt; color: ${C.inkSoft}; }
  .total td { border-bottom: 0; border-top: 1.5px solid ${C.ink}; padding-top: 12px; font-weight: 700; font-size: 12pt; }
  .total .num { color: ${C.pine}; font-size: 15pt; }
  .note { margin-top: 8px; font-size: 9pt; color: ${C.inkSoft}; }
  .details td:first-child { width: 28%; color: ${C.inkSoft}; }
  .foot { position: fixed; bottom: 0; left: 0; right: 0; padding-top: 8px; border-top: 1px solid ${C.stroke}; display: flex; justify-content: space-between; font-size: 8pt; color: ${C.inkSoft}; }
  [dir="ltr"] { unicode-bidi: isolate; }
</style>
</head>
<body>
  <div class="head">
    <img src="data:image/png;base64,${logo}" alt="${business.name.he}">
    <div class="cafe">
      <strong>${business.name.he}</strong><br>
      ${a.street.he}, ${a.neighborhood.he}, ${a.city.he}<br>
      <span dir="ltr">${business.phone.display}</span> · <span dir="ltr">${business.email.public}</span><br>
      ${hoursSummary()}
    </div>
  </div>
  <p class="eyebrow">${escapeHtml(opts.subtitle)}</p>
  <h1>${escapeHtml(opts.title)}</h1>
  <div class="meta">${opts.meta.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("")}</div>
  ${opts.body}
  <div class="foot">
    <span>${t.notInvoice}</span>
    <span>${emailShell.poweredBy} <span dir="ltr">${emailShell.poweredByName}</span></span>
  </div>
</body>
</html>`;
}

function detailsTable(rows: [string, string][]): string {
  return `<table class="details">${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</table>`;
}

const ltr = (s: string) => `<span dir="ltr">${escapeHtml(s)}</span>`;

export function jachnunConfirmationHtml(d: JachnunConfirmationInput): string {
  const t = confirmationPdf;
  const c = jachnunConfirmation;
  const a = business.address;
  const total = formatILS(d.pkg.totalAgorot);
  const customer: [string, string][] = [
    [c.nameLabel, escapeHtml(d.name)],
    [c.phoneLabel, ltr(d.phone)],
  ];
  if (d.email) customer.push([c.emailLabel, ltr(d.email)]);
  if (d.notes) customer.push([c.notesLabel, multiline(d.notes)]);

  return document({
    title: t.jachnunTitle,
    subtitle: t.jachnunSubtitle,
    meta: [
      [t.referenceLabel, ltr(d.reference)],
      [t.issuedLabel, issuedToday()],
      [t.pickupLabel, `${escapeHtml(d.slot.day)}<br>${ltr(d.slot.window)}`],
    ],
    body: `
      <h2>${c.orderHeading}</h2>
      <table>
        <tr><th>${t.itemCol}</th><th class="qty">${t.qtyCol}</th><th class="num">${t.amountCol}</th></tr>
        <tr>
          <td><b>${escapeHtml(d.pkg.title)}</b><div class="sub">${c.includedLabel}: ${escapeHtml(jachnun.whatsIncluded.slice(1).join(" · "))}</div></td>
          <td class="qty">${d.pkg.units}</td>
          <td class="num">${total}</td>
        </tr>
        <tr class="total"><td colspan="2">${t.totalLabel}</td><td class="num">${total}</td></tr>
      </table>
      <p class="note">${t.paymentNote}</p>
      <h2>${t.pickupPlaceLabel}</h2>
      <p style="margin:0">${business.name.he}, ${a.street.he}, ${a.neighborhood.he}, ${a.city.he}</p>
      <h2>${t.customerHeading}</h2>
      ${detailsTable(customer)}
      <p class="note">${c.changeNote} <span dir="ltr">${business.phone.display}</span></p>`,
  });
}

export function cateringConfirmationHtml(d: CateringConfirmationInput): string {
  const t = confirmationPdf;
  const c = cateringConfirmation;
  const rows: [string, string][] = [
    [c.nameLabel, escapeHtml(d.name)],
    [c.phoneLabel, ltr(d.phone)],
  ];
  if (d.email) rows.push([c.emailLabel, ltr(d.email)]);
  if (d.guestCount) rows.push([c.guestsLabel, String(d.guestCount)]);
  rows.push([c.messageLabel, multiline(d.message)]);

  return document({
    title: t.cateringTitle,
    subtitle: t.cateringSubtitle,
    meta: [
      [t.inquiryReferenceLabel, ltr(d.reference)],
      [t.issuedLabel, issuedToday()],
      [c.eventDateLabel, d.eventDate ? escapeHtml(eventDateLabel(d.eventDate)) : "—"],
    ],
    body: `
      <h2>${t.inquiryHeading}</h2>
      ${detailsTable(rows)}
      <p class="note">${t.nextNote}</p>`,
  });
}

async function launchBrowser() {
  const puppeteer = (await import("puppeteer-core")).default;
  if (process.env.VERCEL) {
    const chromium = (await import("@sparticuz/chromium")).default;
    chromium.setGraphicsMode = false;
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: "shell",
    });
  }
  return puppeteer.launch({
    executablePath: process.env.CHROME_EXECUTABLE_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
}

export async function renderPdf(html: string): Promise<Buffer> {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.url().startsWith("data:")) void req.continue();
      else void req.abort();
    });
    await page.setContent(html, { waitUntil: "load" });
    return Buffer.from(await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true }));
  } finally {
    await browser.close();
  }
}

/**
 * The attachment for a confirmation, or none. A PDF that fails to render
 * (cold Chromium, a Vercel hiccup) must never cost the customer their email,
 * so the failure is logged and the email goes out without it.
 */
export async function pdfAttachment(
  reference: string,
  html: string,
): Promise<{ filename: string; content: Buffer }[] | undefined> {
  try {
    return [{ filename: confirmationPdf.filename(reference), content: await renderPdf(html) }];
  } catch (e) {
    console.error(`[confirmation-pdf] ${reference} render failed, sending without attachment:`, e);
    return undefined;
  }
}
