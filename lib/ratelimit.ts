/**
 * Shared Upstash sliding-window rate limiter — 5 requests/minute per IP.
 *
 * Used by both /api/jachnun-order and /api/catering-inquiry. Vercel's
 * serverless model invalidates in-memory limiters; Upstash gives us a
 * single source of truth across function instances.
 *
 * Env: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN.
 *
 * If env vars are missing (e.g. local dev without Upstash configured),
 * the limiter degrades to allow-all rather than blocking submissions.
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const ratelimit =
  url && token
    ? new Ratelimit({
        redis: new Redis({ url, token }),
        limiter: Ratelimit.slidingWindow(5, "60 s"),
        analytics: false,
        prefix: "cafe-hakerem:rl",
      })
    : null;

export function ipFromRequest(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export type RateLimitResult = {
  ok: boolean;
  retryAfterSeconds: number;
};

export async function checkRateLimit(req: Request): Promise<RateLimitResult> {
  if (!ratelimit) return { ok: true, retryAfterSeconds: 0 };
  const ip = ipFromRequest(req);
  const r = await ratelimit.limit(ip);
  const retryAfterSeconds = Math.max(0, Math.ceil((r.reset - Date.now()) / 1000));
  return { ok: r.success, retryAfterSeconds };
}
