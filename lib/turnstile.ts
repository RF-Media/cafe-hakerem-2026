/**
 * Cloudflare Turnstile server-side verification for the jachnun pre-order and
 * catering inquiry forms. The widget hands the client a token; the route POSTs
 * it here with the visitor's IP and calls Cloudflare's siteverify endpoint.
 *
 * Env: NEXT_PUBLIC_TURNSTILE_SITE_KEY (rendered by the widget component) and
 * TURNSTILE_SECRET_KEY (this file). Both must be set together.
 *
 * Fail-open vs fail-closed:
 * - Secret unset: `verifyTurnstile` returns ok. Dev convenience, matches
 *   lib/ratelimit.ts. In production this is logged as an error, because
 *   a misconfigured deploy would otherwise lose Turnstile silently.
 * - Secret set, token missing or siteverify fails: rejected. Fail-closed is
 *   the whole point of putting the check in front of the work.
 */
export type TurnstileResult = { ok: true } | { ok: false; reason: "missing" | "failed" };

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function turnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token: string | undefined, ip: string): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[turnstile] TURNSTILE_SECRET_KEY not set in production — allowing submission through.");
    }
    return { ok: true };
  }
  if (!token) return { ok: false, reason: "missing" };

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    const r = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      // Siteverify is quick, but a hung call must not freeze the submission.
      signal: AbortSignal.timeout(5000),
    });
    const j = (await r.json().catch(() => null)) as { success?: boolean; "error-codes"?: string[] } | null;
    if (j?.success) return { ok: true };
    console.warn("[turnstile] verification failed:", j?.["error-codes"]);
    return { ok: false, reason: "failed" };
  } catch (e) {
    console.error("[turnstile] siteverify request failed:", e);
    return { ok: false, reason: "failed" };
  }
}
