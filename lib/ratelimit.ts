/**
 * Shared Upstash rate limiter — two sliding windows, one per IP and one
 * per phone number.
 *
 * Used by both /api/jachnun-preorder and /api/catering-inquiry. Vercel's
 * serverless model invalidates in-memory limiters; Upstash gives us a
 * single source of truth across function instances.
 *
 * Env: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN.
 *
 * If env vars are missing (e.g. local dev without Upstash configured),
 * both limiters degrade to allow-all rather than blocking submissions.
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

/**
 * Per-IP limit: catches rapid-fire testing or scripted spam from one
 * address. Tight enough that 4+ submissions in 10 minutes from one IP
 * halts; loose enough that a family submitting one real order each,
 * sharing a NAT, doesn't trip it.
 */
export const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "10 m"),
      analytics: false,
      prefix: "cafe-hakerem:rl",
    })
  : null;

/**
 * Per-phone limit: 2 submissions per hour per normalized phone, across
 * both endpoints. A real customer doesn't submit three orders in an
 * hour — if they do, something is wrong (duplicate click, test, abuse)
 * and the halt is the right outcome. The café can reach them by phone.
 */
export const phoneRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(2, "60 m"),
      analytics: false,
      prefix: "cafe-hakerem:rl-phone",
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

/**
 * Check phone-keyed limit. `phone` must already be normalized
 * (lib/phone.ts normalizePhone) so the same number in different formats
 * maps to one bucket. Degrades to allow-all when Upstash is unconfigured.
 */
export async function checkPhoneLimit(phone: string): Promise<RateLimitResult> {
  if (!phoneRatelimit) return { ok: true, retryAfterSeconds: 0 };
  const r = await phoneRatelimit.limit(`phone:${phone}`);
  const retryAfterSeconds = Math.max(0, Math.ceil((r.reset - Date.now()) / 1000));
  return { ok: r.success, retryAfterSeconds };
}
