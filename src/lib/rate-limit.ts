// Fixed-window rate limiting. Uses Upstash Redis over its REST API when
// configured (UPSTASH_REDIS_REST_URL/TOKEN, or the KV_REST_API_URL/TOKEN
// names the Vercel Marketplace integration sets), so limits hold across
// every server instance. Without it, falls back to per-instance memory,
// which is enough to stop casual abuse but resets on each cold start.

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const memory = new Map<string, { count: number; resetAt: number }>();

function memoryHit(key: string, windowSec: number) {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    if (memory.size > 10_000) memory.clear();
    memory.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return 1;
  }
  entry.count += 1;
  return entry.count;
}

async function redisHit(key: string, windowSec: number): Promise<number | null> {
  try {
    const res = await fetch(`${REDIS_URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(windowSec), "NX"],
      ]),
      signal: AbortSignal.timeout(1500),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const [incr] = (await res.json()) as { result?: number }[];
    return typeof incr?.result === "number" ? incr.result : null;
  } catch {
    return null;
  }
}

// Counts one hit against `key` and reports whether it's over `max` per
// `windowSec`. If Redis is unreachable it fails open to the memory limiter.
export async function rateLimit(key: string, max: number, windowSec: number): Promise<{ limited: boolean; count: number }> {
  const scoped = `rl:${key}`;
  const count = (REDIS_URL && REDIS_TOKEN ? await redisHit(scoped, windowSec) : null) ?? memoryHit(scoped, windowSec);
  return { limited: count > max, count };
}

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0].trim() || headers.get("x-real-ip") || "unknown";
}
