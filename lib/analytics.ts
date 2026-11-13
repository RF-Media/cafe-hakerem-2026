/**
 * The site's analytics events. The catalogue, and what each one means, is
 * docs/analytics/measurement-plan.md; GTM forwards every name here to GA4.
 *
 * Everything goes through CookieStream's trackEvent, so nothing is sent before
 * the visitor accepts statistics, and events raised before a decision wait for it.
 * Never put names, phones or emails in params.
 */

import { business } from "@/content/business";
import { trackEvent } from "@/components/cookiestream/track";

export const EVENTS = [
  "generate_lead",
  "phone_call_click",
  "whatsapp_click",
  "directions_click",
  "club_join_click",
  "form_view",
  "form_start",
  "form_step",
  "order_item_change",
  "form_error",
  "map_load",
  "reviews_click",
  "social_click",
  "email_click",
  "club_calculator_use",
  "scroll_depth",
  "time_on_page",
  "faq_open",
  "menu_category_click",
  "gallery_filter",
  "cta_click",
  "page_not_found",
] as const;

export const PARAMS = [
  "ui_location",
  "map_provider",
  "social_network",
  "form_name",
  "error_type",
  "guest_range",
  "has_event_date",
  "menu_category",
  "gallery_category",
  "faq_question",
  "percent_scrolled",
  "engaged_seconds",
  "cups_per_week",
  "cups_per_week_num",
  "link_text",
  "link_url",
  "form_step",
  "form_field",
  "item_id",
  "jachnun_qty",
  "burekas_qty",
  "pickup_window",
  "value",
  "currency",
] as const;

export type AnalyticsEvent = (typeof EVENTS)[number];
export type AnalyticsParams = Partial<Record<(typeof PARAMS)[number], string | number>>;

const known = new Set<string>(EVENTS);

export function track(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  // GTM's data model keeps every key ever pushed, and the site navigates without
  // reloading, so each push clears the parameters this event doesn't set.
  const payload: Record<string, string | number | undefined> = {};
  for (const key of PARAMS) payload[key] = params[key];
  trackEvent(event, payload);
}

/** Data attributes that make an element send `event` when clicked. Works in server components. */
export function ev(event: AnalyticsEvent, params: AnalyticsParams = {}): Record<string, string> {
  const attrs: Record<string, string> = { "data-ev": event };
  for (const [key, value] of Object.entries(params)) attrs[`data-ev-${key}`] = String(value);
  return attrs;
}

/** Where on the page a click happened: a `data-track-area`, else the header or footer. */
function uiLocation(el: Element): string {
  const area = el.closest("[data-track-area]")?.getAttribute("data-track-area");
  if (area) return area;
  if (el.closest("header")) return "header";
  if (el.closest("footer")) return "footer";
  return "content";
}

function fromAttributes(el: HTMLElement): void {
  const event = el.getAttribute("data-ev");
  if (!event || !known.has(event)) return;
  const params: AnalyticsParams = { ui_location: uiLocation(el) };
  for (const attr of Array.from(el.attributes)) {
    if (attr.name.startsWith("data-ev-")) params[attr.name.slice(8) as keyof AnalyticsParams] = attr.value;
  }
  track(event as AnalyticsEvent, params);
}

const clubHost = new URL(business.coffeestream.shopBaseUrl).hostname;

function fromLink(a: HTMLAnchorElement): void {
  const href = a.getAttribute("href") ?? "";
  const ui_location = uiLocation(a);
  if (href.startsWith("tel:")) return track("phone_call_click", { ui_location });
  if (href.startsWith("mailto:")) return track("email_click", { ui_location });
  if (href.startsWith("waze:")) return track("directions_click", { ui_location, map_provider: "waze" });

  let url: URL;
  try {
    url = new URL(a.href);
  } catch {
    return;
  }
  const host = url.hostname.replace(/^www\./, "");

  if (host === "wa.me" || host.endsWith("whatsapp.com")) return track("whatsapp_click", { ui_location });
  if (host === "waze.com" || host.endsWith(".waze.com")) {
    return track("directions_click", { ui_location, map_provider: "waze" });
  }
  if ((host === "google.com" && url.pathname.startsWith("/maps")) || host === "maps.google.com" || host === "maps.app.goo.gl") {
    return track("directions_click", { ui_location, map_provider: "google_maps" });
  }
  if (host === clubHost) {
    return track("club_join_click", { ui_location: url.searchParams.get("utm_campaign") ?? ui_location });
  }
  if (host === "instagram.com") return track("social_click", { ui_location, social_network: "instagram" });
  if (host === "facebook.com") return track("social_click", { ui_location, social_network: "facebook" });

  if (url.origin === window.location.origin && a.hasAttribute("data-cta")) {
    track("cta_click", {
      ui_location,
      link_text: (a.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 100),
      link_url: url.pathname + url.hash,
    });
  }
}

// A click rather than `toggle`: the first answer on each page renders open, and that fires `toggle` too.
function fromSummary(summary: HTMLElement): void {
  const details = summary.parentElement;
  if (!(details instanceof HTMLDetailsElement) || details.open) return;
  const question = Array.from(summary.childNodes)
    .filter((node) => !(node instanceof Element && node.getAttribute("aria-hidden") === "true"))
    .map((node) => node.textContent ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (question) track("faq_open", { faq_question: question.slice(0, 100) });
}

/** One delegated click handler for the whole site: tagged elements first, then FAQs, then links by destination. */
export function trackClick(target: EventTarget | null): void {
  if (!(target instanceof Element)) return;
  const summary = target.closest<HTMLElement>("summary");
  if (summary) return fromSummary(summary);
  const tagged = target.closest<HTMLElement>("[data-ev]");
  if (tagged) return fromAttributes(tagged);
  const link = target.closest<HTMLAnchorElement>("a[href]");
  if (link) fromLink(link);
}
