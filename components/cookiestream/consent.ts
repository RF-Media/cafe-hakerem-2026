/**
 * The stored decision: reading it, saving it, recording it, and wiping what a
 * withdrawn category left behind. No React and no tracker code in here.
 */

import type { CookieChoice } from './config';

export const CONSENT_COOKIE = 'cs_consent';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
const OPEN_EVENT = 'cs:cookie-settings';
const CONSENT_ID = /^[A-Za-z0-9-]{8,64}$/;

// Add a tool's cookies here when adding the tool, or withdrawal leaves them behind.
const ANALYTICS_COOKIES = /^(_ga|_gid|_gat)/;
const MARKETING_COOKIES = /^(_gcl|_fbp|_fbc)/;

export type ConsentState = 'pending' | 'granted' | 'denied';

let state: ConsentState = 'pending';
const listeners = new Set<(next: ConsentState) => void>();

export const getConsentState = (): ConsentState => state;

export function setConsentState(next: ConsentState): void {
  state = next;
  listeners.forEach((listener) => listener(next));
}

export function onConsentState(listener: (next: ConsentState) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Parses a cs_consent cookie value, on the client or the server. */
export function parseConsentCookie(
  value: string | undefined | null
): { v?: number; id?: string; analytics?: boolean; marketing?: boolean } | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function consentIdFrom(value: string | undefined | null): string | null {
  const id = parseConsentCookie(value)?.id;
  return typeof id === 'string' && CONSENT_ID.test(id) ? id : null;
}

function rawCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const raw = document.cookie.split('; ').find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  return raw ? raw.slice(CONSENT_COOKIE.length + 1) : null;
}

// A choice saved under an older version counts as no choice, so the banner asks again.
export function readCookieChoice(version: number): CookieChoice | null {
  const parsed = parseConsentCookie(rawCookie());
  if (!parsed || parsed.v !== version) return null;
  return { analytics: parsed.analytics === true, marketing: parsed.marketing === true };
}

function newConsentId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  } catch {
    // Falls through.
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** Saves the choice and returns the browser's consent id, which stays the same across later changes. */
export function saveCookieChoice(choice: CookieChoice, version: number): string {
  const id = consentIdFrom(rawCookie()) ?? newConsentId();
  const value = encodeURIComponent(
    JSON.stringify({ v: version, id, analytics: choice.analytics, marketing: choice.marketing, at: new Date().toISOString() })
  );
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  return id;
}

/** Fire-and-forget copy for a backend; keepalive lets it survive the reload a withdrawal triggers. */
export function recordCookieChoice(endpoint: string | undefined, consentId: string, choice: CookieChoice, version: number): void {
  if (!endpoint) return;
  fetch(endpoint, {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ consentId, analytics: choice.analytics, marketing: choice.marketing, version }),
  }).catch(() => {});
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenCookieSettings(handler: () => void): () => void {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}

// Trackers write on the parent domain, so every suffix of the host is tried.
export function clearTrackingStorage(revoked: CookieChoice): void {
  const names = document.cookie
    .split('; ')
    .map((c) => c.split('=')[0])
    .filter((name) => (revoked.analytics && ANALYTICS_COOKIES.test(name)) || (revoked.marketing && MARKETING_COOKIES.test(name)));
  const parts = window.location.hostname.split('.');
  const domains = parts.map((_, i) => parts.slice(i).join('.')).filter((d) => d.includes('.'));
  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; Path=/`;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${domain}`;
  }
}
