/**
 * Custom events, held until the visitor decides. Optional: copy it only if the site
 * sends custom events. Page views need nothing from here.
 *
 * Never put names, phones or emails in params.
 */

import { getConsentState, onConsentState } from './consent';
import { sendEvent } from './trackers';

type Params = Record<string, string | number | boolean | undefined>;

const DEDUPE_WINDOW_MS = 500;

let buffer: Array<{ event: string; params: Params }> = [];
const recent = new Map<string, number>();

// Until a choice events wait; on refusal they're dropped; on acceptance they're delivered in order.
onConsentState((state) => {
  const pending = buffer;
  buffer = [];
  if (state === 'granted') pending.forEach((item) => sendEvent(item.event, item.params));
});

// React re-invokes effects in development StrictMode, which doubled every effect-fired event.
// The window is short enough that a genuine repeat still registers.
function isDuplicate(event: string, params: Params): boolean {
  const key = `${event}|${JSON.stringify(params)}`;
  const now = Date.now();
  const seen = recent.get(key);
  if (seen !== undefined && now - seen < DEDUPE_WINDOW_MS) return true;
  recent.set(key, now);
  if (recent.size > 50) {
    recent.forEach((time, k) => {
      if (now - time > DEDUPE_WINDOW_MS) recent.delete(k);
    });
  }
  return false;
}

export function trackEvent(event: string, params: Params = {}): void {
  if (typeof window === 'undefined') return;
  const state = getConsentState();
  if (state === 'denied' || isDuplicate(event, params)) return;
  if (state === 'pending') buffer.push({ event, params });
  else sendEvent(event, params);
}
