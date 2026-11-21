// Minimal Upstash Redis REST client (no SDK). Configured by the same
// variables as lib/rate-limit.ts.

const URL_ = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const redisEnabled = () => !!(URL_ && TOKEN);

export async function redis<T = unknown>(...command: (string | number)[]): Promise<T> {
  if (!URL_ || !TOKEN) throw new Error("Redis is not configured");
  const res = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command.map(String)),
    signal: AbortSignal.timeout(5000),
    cache: "no-store",
  });
  const body = (await res.json().catch(() => ({}))) as { result?: T; error?: string };
  if (!res.ok || body.error) throw new Error(`Redis ${command[0]} failed: ${body.error ?? res.status}`);
  return body.result as T;
}
