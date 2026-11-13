/**
 * The only place tracking loads. Nothing here runs until the visitor has chosen,
 * and a new tool gets gated here rather than added to a layout.
 */

import { clearTrackingStorage, setConsentState } from './consent';
import type { CookieChoice, CookieStreamConfig } from './config';

type Queue = (...args: unknown[]) => void;
type Fbq = Queue & { callMethod?: Queue; queue: unknown[]; push: unknown; loaded: boolean; version: string };
type TrackingWindow = Window & { dataLayer?: unknown[]; gtag?: Queue; fbq?: Fbq; _fbq?: Fbq } & Record<`ga-disable-${string}`, boolean>;

// Local development stays out of the real property. The banner still shows, so it can be worked on.
const CAN_LOAD = process.env.NODE_ENV !== 'development';

// These end up in script URLs, so anything outside the exact formats is refused.
export const ID_FORMATS = {
  gtmId: /^GTM-[A-Z0-9]{4,12}$/,
  ga4Id: /^G-[A-Z0-9]{4,14}$/,
  metaPixelId: /^\d{6,20}$/,
};

let gtmLoaded = false;
let ga4Loaded = false;
let metaLoaded = false;
let applied: CookieChoice | null = null;

export const appliedChoice = (): CookieChoice | null => applied;

function gtag(...args: unknown[]) {
  const w = window as unknown as TrackingWindow;
  w.dataLayer = w.dataLayer || [];
  if (!w.gtag) {
    // gtag commands are only honoured when pushed as an Arguments object, not an array.
    w.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      (w.dataLayer as unknown[]).push(arguments);
    };
  }
  w.gtag(...args);
}

function consentSignals(choice: CookieChoice) {
  const ads = choice.marketing ? 'granted' : 'denied';
  return {
    analytics_storage: choice.analytics ? 'granted' : 'denied',
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  };
}

function setGaDisabled(ids: string[], disabled: boolean) {
  const w = window as unknown as TrackingWindow;
  for (const id of ids) if (id) w[`ga-disable-${id}`] = disabled;
}

function gaIdsInCookies(): string[] {
  return document.cookie
    .split('; ')
    .map((c) => c.match(/^_ga_([A-Z0-9]+)=/)?.[1])
    .filter((id): id is string => !!id)
    .map((id) => `G-${id}`);
}

function injectScript(src: string) {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function loadGtm(gtmId: string, choice: CookieChoice) {
  if (gtmLoaded || !CAN_LOAD || !ID_FORMATS.gtmId.test(gtmId)) return;
  gtmLoaded = true;
  gtag('consent', 'default', consentSignals(choice));
  (window as unknown as TrackingWindow).dataLayer?.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  injectScript(`https://www.googletagmanager.com/gtm.js?id=${gtmId}`);
}

// For sites with no GTM container: the same tag Google's snippet loads, only later.
function loadGa4(ga4Id: string, choice: CookieChoice) {
  if (ga4Loaded || !CAN_LOAD || !ID_FORMATS.ga4Id.test(ga4Id)) return;
  ga4Loaded = true;
  gtag('consent', 'default', consentSignals(choice));
  gtag('js', new Date());
  gtag('config', ga4Id);
  injectScript(`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`);
}

function loadMetaPixel(pixelId: string) {
  if (metaLoaded || !CAN_LOAD || !ID_FORMATS.metaPixelId.test(pixelId)) return;
  metaLoaded = true;
  const w = window as unknown as TrackingWindow;
  // Meta's own stub: calls made before fbevents.js arrives queue up as Arguments objects.
  const fbq = function () {
    // eslint-disable-next-line prefer-rest-params
    if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments as unknown as unknown[]);
    // eslint-disable-next-line prefer-rest-params
    else fbq.queue.push(arguments);
  } as unknown as Fbq;
  if (!w._fbq) w._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  w.fbq = fbq;
  injectScript('https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', pixelId);
  fbq('track', 'PageView');
}

export function effectiveChoice(choice: CookieChoice, config: CookieStreamConfig): CookieChoice {
  return { analytics: choice.analytics, marketing: choice.marketing && config.categories.marketing.enabled };
}

export function applyChoice(choice: CookieChoice, config: CookieStreamConfig): void {
  const effective = effectiveChoice(choice, config);
  const { gtmId, ga4Id, metaPixelId } = config.ids;

  setGaDisabled([ga4Id, ...gaIdsInCookies()], !effective.analytics);

  if (gtmId) {
    // GTM also carries Google Ads, so it can load for marketing alone, with GA4 switched off outright.
    // Without a known GA4 id it couldn't be switched off, so marketing alone doesn't load the container.
    const needGtm = effective.analytics || (effective.marketing && !!ga4Id);
    if (needGtm && gtmLoaded) gtag('consent', 'update', consentSignals(effective));
    else if (needGtm) loadGtm(gtmId, effective);
  } else if (ga4Loaded) {
    gtag('consent', 'update', consentSignals(effective));
  } else if (ga4Id && effective.analytics) {
    loadGa4(ga4Id, effective);
  }

  if (effective.marketing) loadMetaPixel(metaPixelId);

  setConsentState(effective.analytics || effective.marketing ? 'granted' : 'denied');
  applied = effective;
}

// Loaded trackers can't be unloaded: silence them, wipe what they stored, and reload without them.
export function revokeAndReload(next: CookieChoice, revoked: CookieChoice, config: CookieStreamConfig): void {
  setConsentState('denied');
  if (gtmLoaded || ga4Loaded) gtag('consent', 'update', consentSignals(next));
  if (revoked.analytics) setGaDisabled([config.ids.ga4Id, ...gaIdsInCookies()], true);
  const w = window as unknown as TrackingWindow;
  if (revoked.marketing && typeof w.fbq === 'function') w.fbq('consent', 'revoke');
  clearTrackingStorage(revoked);
  window.location.reload();
}

/** Meta doesn't see client-side navigation on its own. GA4 does, through Enhanced Measurement. */
export function trackMetaPageView(): void {
  const w = window as unknown as TrackingWindow;
  if (metaLoaded && applied?.marketing && typeof w.fbq === 'function') w.fbq('track', 'PageView');
}

/** Delivers a custom event to whichever Google tag is loaded. See track.ts. */
export function sendEvent(event: string, params: Record<string, unknown>): void {
  if (gtmLoaded) (window as unknown as TrackingWindow).dataLayer?.push({ event, ...params });
  else if (ga4Loaded) gtag('event', event, params);
}
