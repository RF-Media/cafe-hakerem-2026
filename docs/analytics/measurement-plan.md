# Measurement plan: קפה הכרם website

GA4 account "Cafe Hakerem" (415648465), property 563483014, web stream "Hakerem Website"
(Measurement ID G-KHG85VPG1Q), through GTM container GTM-56MPGJWD.
Owner of the event code: `lib/analytics.ts` and `components/analytics/Measurement.tsx`. Decision Log: CLAUDE.md, 2026-11-10.
Owner of the GTM/GA4 setup: this file and `gtm-container.json` beside it.

## Business goals and what measures them

| Goal | Hard conversion (GA4 key event) | Soft conversions (leading signals) |
|---|---|---|
| Walk-ins | `directions_click`, `phone_call_click`, `whatsapp_click` | `map_load`, `reviews_click`, `menu_category_click`, `time_on_page` 60s on /menu or /map |
| Jachnun pre-orders | `generate_lead` (`form_name` = `jachnun_preorder`, with `value`) | `form_view`, `form_start`, `order_item_change`, `form_step`, `form_error` |
| Catering leads | `generate_lead` (`form_name` = `catering_inquiry`) | `form_start`, `form_error` (friction), `faq_open` on /catering |
| Club members | `club_join_click` | `club_calculator_use` |
| Brand / content | none | `scroll_depth`, `time_on_page`, `faq_open`, `gallery_filter`, `social_click`, `cta_click` |

**The jachnun pre-order is measured** (from 2026-11-13, GTM version 3 "Jachnun pre-order funnel";
it was out of scope until the order flow was final). The gated phase-2 checkout at `/jachnun/order` still sends nothing.

## Consent

Nothing in this plan runs before the visitor accepts statistics in the cookie banner
(`components/cookiestream`, config in `content/cookies.ts`):

- GTM itself loads only after acceptance, from `components/cookiestream/trackers.ts`.
- Consent Mode v2 defaults are set by CookieStream before `gtm.js` loads:
  `analytics_storage: granted`, `ad_storage / ad_user_data / ad_personalization: denied`
  (the banner has no marketing category).
- Events raised before a decision are held, delivered in order on acceptance, dropped on refusal
  (`components/cookiestream/track.ts`).
- Withdrawal sets consent to denied, deletes the `_ga*` cookies and reloads without GTM.
- **Never add a marketing tag (Google Ads, Meta, remarketing) to the container** without first
  enabling `marketing` in `content/cookies.ts`, naming the tool on /privacy, and raising `version`.

## Event catalogue

All custom events reach the dataLayer as `{ event, ...params }`. Every push resets the other
known parameters to `undefined`, so a value from an earlier event never leaks into a later one.
`page_location`, `page_title` and `page_referrer` are attached automatically by GA4.

### Key events (hard conversions)

| Event | Fires when | Parameters |
|---|---|---|
| `generate_lead` | The catering inquiry is accepted by `/api/catering-inquiry` | `form_name` = `catering_inquiry`, `guest_range` (`1-15` `16-40` `41-80` `81+` `unknown`), `has_event_date` (`yes`/`no`) |
| `generate_lead` | A jachnun pre-order is accepted by `/api/jachnun-preorder` | `form_name` = `jachnun_preorder`, `value` (estimated total, ₪), `currency` = `ILS`, `jachnun_qty`, `burekas_qty`, `pickup_window` (slot start, `08:30`) |
| `phone_call_click` | Any `tel:` link | `ui_location` |
| `whatsapp_click` | Any `wa.me` link | `ui_location` |
| `directions_click` | Any Waze or Google Maps link (not the reviews card) | `ui_location`, `map_provider` (`waze`/`google_maps`) |
| `club_join_click` | Any link into the CoffeeStream club | `ui_location` (the link's `utm_campaign`: `home_band`, `club_calculator`, `menu_interlude`, ...) |

### Soft conversions

| Event | Fires when | Parameters |
|---|---|---|
| `form_view` | The jachnun order card is 30% on screen, once per page view | `form_name` |
| `form_start` | First focus inside the catering form, or first tap in the jachnun form (stepper, slot or field), once per page view | `form_name` |
| `order_item_change` | A jachnun/burekas stepper settles (taps within 800ms are one event) | `form_name`, `item_id` (`jachnun`/`burekas`), `jachnun_qty`, `burekas_qty`, `value`, `currency` |
| `form_step` | The jachnun form moves forward a step | `form_name`, `form_step` (`pickup`/`details`), `jachnun_qty`, `burekas_qty`, `value`, `currency`, `pickup_window` (on `details`) |
| `form_error` | The catering submission is rejected; in the jachnun form, also one per invalid field on "continue"/submit | `form_name`, `error_type` (`validation`/`rate_limit`/`slot_unavailable`/`server`/`network`), `form_field` (jachnun validation only: `items`/`slot`/`name`/`phone`/`email`/`notes`) |
| `map_load` | The /contact map facade is opened | `ui_location` |
| `reviews_click` | The Google reviews card on /contact | `ui_location` |
| `social_click` | Instagram or Facebook link | `social_network`, `ui_location` |
| `email_click` | Any `mailto:` link | `ui_location` |
| `club_calculator_use` | First move of the club calculator slider, once per page view | `cups_per_week`, `cups_per_week_num` (same value, registered as a metric) |

### Engagement

| Event | Fires when | Parameters |
|---|---|---|
| `scroll_depth` | 25, 50, 75, 90% of the page scrolled, once each per page view | `percent_scrolled` |
| `time_on_page` | 15, 30, 60, 120, 300 seconds of visible time on one page | `engaged_seconds` |
| `faq_open` | An FAQ question is expanded | `faq_question` (first 100 chars) |
| `menu_category_click` | A /menu category chip or a home category tile | `menu_category`, `ui_location` |
| `gallery_filter` | An Instagram gallery filter chip | `gallery_category` |
| `cta_click` | A button-style internal link (`<Button as="a">`) | `link_text`, `link_url`, `ui_location` |
| `page_not_found` | The 404 page renders | none |

### `ui_location` values

`header`, `footer`, `mobile_bar`, `home_hero`, `page_hero`, `home_categories`, `menu_rail`,
`content`, `jachnun_order` (links and buttons inside the order card), or for club links the
`utm_campaign` placement.

### Automatic GA4 events (enhanced measurement)

| Setting | State | Why |
|---|---|---|
| Page views, incl. browser history changes | On | The site navigates client-side |
| Outbound clicks | On | Catches outbound links the catalogue doesn't name |
| File downloads | On | |
| Scrolls | **Off** | Replaced by `scroll_depth` at four thresholds |
| Form interactions | **Off** | Replaced by `form_start`/`generate_lead`; the automatic one misfires on fetch forms |
| Site search, video engagement | Off | No search, no embedded YouTube |

## GTM

Imported from `gtm-container.json`:

| Kind | Name | Setup |
|---|---|---|
| Constant | `const - GA4 Measurement ID` | `G-KHG85VPG1Q` |
| Data Layer Variables (v2) | `dlv - <param>` | One per parameter above (24) |
| Trigger | `CE - site events` | Custom Event, regex `^(generate_lead\|phone_call_click\|…)$` over every event in the catalogue |
| Tag | `GA4 - Google tag` | Google tag, ID from the constant, fires on Initialization - All Pages |
| Tag | `GA4 - Event - site events` | GA4 Event, name `{{Event}}`, all 16 parameters mapped to their variables, fires on `CE - site events` |

Consent: both tags use their built-in `analytics_storage` check and need no additional consent.

## GA4 admin

- **Key events:** `generate_lead` (once per event); `phone_call_click`, `whatsapp_click`,
  `directions_click`, `club_join_click` (once per session, so a double tap isn't two conversions).
  GA4's own defaults `close_convert_lead` and `qualify_lead` are unmarked.
- **Custom dimensions (event scope):** `ui_location`, `map_provider`, `social_network`,
  `form_name`, `error_type`, `guest_range`, `has_event_date`, `menu_category`,
  `gallery_category`, `faq_question`, `percent_scrolled`, `engaged_seconds`, `cups_per_week`,
  `form_step`, `form_field`, `item_id`, `pickup_window`.
  `link_text` and `link_url` use GA4's built-in dimensions.
- **Custom metrics (event scope):** `jachnun_qty` and `burekas_qty` (standard units), so
  units ordered sum per item; `value`/`currency` are GA4's own and need no registration.
- **Custom metric (event scope):** `cups_per_week_num`, for the average. A parameter can be a
  dimension or a metric, not both, so the calculator sends the value under both names.
- **Data retention:** 14 months.
- **Google signals:** off (the banner has no marketing consent).
- **Funnel explorations:**
  - Catering: page_view /catering → `form_start` → `generate_lead`
  - Jachnun (open funnel, all filtered on `form_name` = `jachnun_preorder`): `form_view` →
    `form_start` → `form_step` = `pickup` → `form_step` = `details` → `generate_lead`.
    Breakdown by device category: most of this traffic is mobile. Drop-off between `details` and
    `generate_lead` reads together with `form_error` by `form_field`.
  - Jachnun basket: `generate_lead` (jachnun) with `burekas_qty` > 0 over all, i.e. burekas attach rate.
  - Club: page_view /coffee-club → `club_calculator_use` → `club_join_click`
  - Club (direct): page_view /coffee-club → `club_join_click`
  - Visit: page_view /menu → `menu_category_click` → any of `directions_click`/`phone_call_click`/`whatsapp_click`

## Dashboard (Looker Studio, GA4 property 563483014)

1. **Overview:** users, sessions, engagement rate, average engagement time, key events,
   session key event rate; users and key events over time; key events by name; channels.
2. **Conversions:** each key event over time; by `ui_location`; by landing page; the catering and
   club funnels as step counts.
3. **Engagement:** `scroll_depth` by `percent_scrolled`; `time_on_page` by `engaged_seconds`;
   top pages by views and engagement time; FAQ opens by question; menu category clicks;
   gallery filters; CTA clicks by text.
4. **Audience:** device, city, new vs returning, language.

## Testing

Trackers don't load under `next dev`. Run a production build (`next build && next start`), accept
the banner, and check events in GTM Preview (Tag Assistant) and GA4 DebugView. Analytics only
counts visitors who accept, so numbers will be lower than an always-on tag.

## Changing the plan

Add the event to `lib/analytics.ts` (and its parameters to `PARAMS`), to the trigger regex and the
GA4 event tag in GTM, register new parameters as custom dimensions, and update this file.
