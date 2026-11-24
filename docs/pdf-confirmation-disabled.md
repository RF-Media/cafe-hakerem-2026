# PDF confirmation — disabled 2026-11-18

The customer confirmation email for both forms used to carry a PDF
("אישור הזמנה / אישור קבלת פנייה"), rendered by headless Chromium on Vercel
and attached to the email. It is **turned off**. The mechanism is intact — a
single flag flips it back on — and this file explains the state so it isn't
rediscovered through grep later.

## Why it's off

Phase 1 does not close an order on submit. The customer fills the form, the
café receives the request, and a **rep calls the customer** to confirm the
details, take payment and give the final confirmation
(see CLAUDE.md, 2026-11-13 "rep calls to confirm and collect payment"). The
PDF, titled "אישור הזמנה" with a total line on it, overstated what had just
happened. The café asked to hold off on it rather than reword it for a flow
that will change again when phase-2 checkout turns on.

## What changed

- **`lib/confirmation-pdf.ts`** — new `PDF_ATTACHMENT_ENABLED = false` export.
  `pdfAttachment()` returns `undefined` immediately when it's false, so
  Chromium never launches and no PDF is rendered.
- **Routes untouched.** `app/api/jachnun-preorder/route.ts` and
  `app/api/catering-inquiry/route.ts` still call `pdfAttachment(...)`; they
  just get `undefined` back and pass that to `sendCustomerEmail`, which sends
  the email without an attachment.
- **Customer copy reworded** (`content/emails.ts`, `jachnunConfirmation`). The
  email is now plainly framed as *receipt of request*, not as confirmation:
  subject, title, intro and the "not charged" note all say the booking isn't
  final, and that a rep will call for the final confirmation and payment. The
  earlier line "the confirmation is attached as a PDF" (`emailShell.pdfNote`)
  is gone from the shell and from both email templates.
- **Catering copy untouched.** It was already framed as inquiry receipt
  ("קיבלנו את הפנייה שלך"), so only the PDF line was removed.

## What's intact

- `renderPdf()` and the Chromium launch path in `lib/confirmation-pdf.ts`.
- `jachnunConfirmationHtml()` and `cateringConfirmationHtml()` — the PDF
  body renderers.
- `confirmationPdf` copy in `content/emails.ts`.
- `puppeteer-core`, `@sparticuz/chromium`, Noto Sans Hebrew and Heebo font
  files in `lib/fonts/`.
- The routes still call `pdfAttachment()` with the HTML, so re-enabling is
  a one-line change.

## How to re-enable

1. Set `PDF_ATTACHMENT_ENABLED = true` in `lib/confirmation-pdf.ts`.
2. Check the PDF body still matches whatever the order flow then promises
   (price model, slot shape, payment state).
3. Restore `emailShell.pdfNote` and its two template references if you want
   the "attached as PDF" line back.
4. Send one real test from each form and inspect the PDF, not just the email.

No deployment knob — this is a code flag on purpose, so it can't be toggled
from Vercel env by accident.
