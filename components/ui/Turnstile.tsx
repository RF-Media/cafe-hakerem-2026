"use client";

/**
 * Cloudflare Turnstile widget — bot protection on the jachnun pre-order and
 * catering inquiry forms. Loads the Turnstile script once per page, renders
 * an invisible/interaction-only widget, and calls onVerify(token) when the
 * visitor passes. The server re-checks the token against siteverify in
 * lib/turnstile.ts; this component is the token issuer only.
 *
 * Returns null when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset — the form still
 * submits and the server allows the request through (dev path, matches the
 * degraded mode in lib/ratelimit.ts). Production must have both env vars set.
 *
 * Tokens are single-use and expire after 5 minutes. Call reset() via ref to
 * get a fresh one after a failed submission.
 */
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

type TurnstileWindow = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileWindow;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src^="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("turnstile script failed")), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.addEventListener("load", () => resolve(), { once: true });
    s.addEventListener("error", () => reject(new Error("turnstile script failed")), { once: true });
    document.head.appendChild(s);
  });
  return scriptPromise;
}

type Props = {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
};

export type TurnstileHandle = { reset: () => void };

export const Turnstile = forwardRef<TurnstileHandle, Props>(function Turnstile(
  { onVerify, onExpire, onError, className },
  ref,
) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  // The callbacks fire outside the React render path, so capture them in refs
  // and let the widget mount once per siteKey rather than rebuild on every
  // parent re-render.
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);
  onVerifyRef.current = onVerify;
  onExpireRef.current = onExpire;
  onErrorRef.current = onError;

  useImperativeHandle(ref, () => ({
    reset: () => {
      const id = widgetIdRef.current;
      if (id && window.turnstile) window.turnstile.reset(id);
    },
  }));

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => onVerifyRef.current(token),
          "expired-callback": () => onExpireRef.current?.(),
          "error-callback": () => onErrorRef.current?.(),
          theme: "light",
          language: "he",
          appearance: "interaction-only",
        });
      })
      .catch(() => onErrorRef.current?.());
    return () => {
      cancelled = true;
      const id = widgetIdRef.current;
      if (id && window.turnstile) {
        window.turnstile.remove(id);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  if (!siteKey) return null;
  return <div ref={containerRef} className={className} />;
});
