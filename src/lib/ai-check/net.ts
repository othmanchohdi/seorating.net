import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { absoluteUrl } from "../site";

// Network layer for the AI visibility checker. Every request goes through
// safeFetch, which refuses private addresses (re-checked on each redirect),
// caps time and size, and never sends cookies or credentials.

export const CHECKER_UA = `Mozilla/5.0 (compatible; SEORatingBot/1.0; +${absoluteUrl("/ai-tools")})`;
const TIMEOUT_MS = 8000;
const MAX_BYTES = 1_500_000;
const MAX_REDIRECTS = 4;

export class CheckError extends Error {}

// Hostnames as they appear in report URLs: lowercase, no scheme, no port.
export const HOSTNAME_PATTERN = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

// Turns whatever someone typed ("https://Shop.com/products/x") into a hostname.
export function toHostname(input: string): string | null {
  const raw = input.trim();
  if (!raw || raw.length > 500) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const host = url.hostname.toLowerCase().replace(/\.$/, "");
    return HOSTNAME_PATTERN.test(host) && !isIP(host) ? host : null;
  } catch {
    return null;
  }
}

function isPrivateAddress(address: string): boolean {
  if (isIP(address) === 4) {
    const [a, b] = address.split(".").map(Number);
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }
  const v6 = address.toLowerCase();
  if (v6.startsWith("::ffff:")) return isPrivateAddress(v6.slice(7));
  return v6 === "::" || v6 === "::1" || /^f[cd]/.test(v6) || /^fe[89ab]/.test(v6);
}

async function assertPublicHost(hostname: string) {
  let addresses: { address: string }[];
  try {
    addresses = await lookup(hostname, { all: true });
  } catch {
    throw new CheckError(`We couldn't find ${hostname}. Check the spelling and try again.`);
  }
  if (!addresses.length || addresses.some((a) => isPrivateAddress(a.address))) {
    throw new CheckError("That address can't be checked.");
  }
}

export type Fetched = {
  status: number;
  contentType: string;
  headers: Record<string, string>;
  body: string;
  finalUrl: string;
};

async function readCapped(res: Response, limit: number): Promise<string> {
  if (!res.body || limit === 0) {
    res.body?.cancel().catch(() => {});
    return "";
  }
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (size < limit) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    size += value.byteLength;
  }
  reader.cancel().catch(() => {});
  return new TextDecoder().decode(Buffer.concat(chunks).subarray(0, limit));
}

const KEPT_HEADERS = ["server", "x-powered-by", "x-shopid", "x-shopify-stage", "cf-mitigated", "x-robots-tag", "content-type"];

// fetch() with redirects followed by hand so every hop is re-validated.
// Returns null when the site can't be reached; throws CheckError only for
// addresses we refuse to contact.
export async function safeFetch(start: URL, { userAgent = CHECKER_UA, maxBytes = MAX_BYTES } = {}): Promise<Fetched | null> {
  let url = start;
  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      await assertPublicHost(url.hostname);
      const res = await fetch(url, {
        redirect: "manual",
        headers: { "User-Agent": userAgent, Accept: "text/html,text/plain,application/json;q=0.9,*/*;q=0.8" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      });
      const location = res.headers.get("location");
      if (res.status >= 300 && res.status < 400 && location) {
        res.body?.cancel().catch(() => {});
        url = new URL(location, url);
        if (url.protocol !== "https:" && url.protocol !== "http:") return null;
        continue;
      }
      const headers: Record<string, string> = {};
      for (const h of KEPT_HEADERS) {
        const v = res.headers.get(h);
        if (v) headers[h] = v;
      }
      return {
        status: res.status,
        contentType: res.headers.get("content-type") ?? "",
        headers,
        body: await readCapped(res, maxBytes),
        finalUrl: url.toString(),
      };
    }
  } catch (err) {
    if (err instanceof CheckError) throw err;
  }
  return null;
}

// A plain-text file only counts if it really is one: many sites answer every
// unknown path with their HTML 404 page and a 200 status.
export function textFile(f: Fetched | null): string | null {
  if (!f || f.status !== 200) return null;
  if (/text\/html/i.test(f.contentType) || /^\s*<(!doctype|html)/i.test(f.body)) return null;
  return f.body;
}

export type Hop = { url: string; status: number | null; location: string | null; ms: number };

// Follows redirects one hop at a time and records each one, for the
// redirect checker and the link/sitemap spot checks. Same safety rules as
// safeFetch; the final hop's body is not read. status null = unreachable.
export async function traceUrl(start: URL, { userAgent = CHECKER_UA, maxHops = 8, timeoutMs = TIMEOUT_MS } = {}): Promise<Hop[]> {
  const hops: Hop[] = [];
  let url = start;
  for (let i = 0; i <= maxHops; i++) {
    const began = Date.now();
    try {
      await assertPublicHost(url.hostname);
      const res = await fetch(url, {
        redirect: "manual",
        headers: { "User-Agent": userAgent, Accept: "text/html,*/*;q=0.8" },
        signal: AbortSignal.timeout(timeoutMs),
        cache: "no-store",
      });
      res.body?.cancel().catch(() => {});
      const location = res.headers.get("location");
      hops.push({ url: url.toString(), status: res.status, location, ms: Date.now() - began });
      if (res.status < 300 || res.status >= 400 || !location) return hops;
      const next = new URL(location, url);
      if (next.protocol !== "https:" && next.protocol !== "http:") return hops;
      if (hops.some((h) => h.url === next.toString())) {
        hops.push({ url: next.toString(), status: null, location: null, ms: 0 });
        return hops; // redirect loop
      }
      url = next;
    } catch (err) {
      if (err instanceof CheckError && i === 0) throw err;
      hops.push({ url: url.toString(), status: null, location: null, ms: Date.now() - began });
      return hops;
    }
  }
  return hops;
}

// totalBytes: the full size when known (Content-Length, or counted while
// streaming up to measureUpTo), else null.
export type FetchedBytes = { status: number; contentType: string; totalBytes: number | null; bytes: Uint8Array; finalUrl: string };

// Reads the first `maxBytes` of a binary resource (an image), following
// redirects with the same checks as safeFetch. Sends a browser-like Accept
// header so CDNs (Shopify's included) serve the format visitors get.
// Without a Content-Length it keeps streaming (discarding) up to
// measureUpTo bytes to learn the real file size.
export async function safeFetchBytes(start: URL, { keep = 131_072, measureUpTo = 4_000_000 } = {}): Promise<FetchedBytes | null> {
  let url = start;
  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      await assertPublicHost(url.hostname);
      const res = await fetch(url, {
        redirect: "manual",
        headers: { "User-Agent": CHECKER_UA, Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      });
      const location = res.headers.get("location");
      if (res.status >= 300 && res.status < 400 && location) {
        res.body?.cancel().catch(() => {});
        url = new URL(location, url);
        if (url.protocol !== "https:" && url.protocol !== "http:") return null;
        continue;
      }
      const length = Number(res.headers.get("content-length"));
      const known = Number.isFinite(length) && length > 0 && !res.headers.get("content-encoding");
      const { head, total, complete } = await readBytes(res, keep, known ? keep : measureUpTo);
      return {
        status: res.status,
        contentType: res.headers.get("content-type") ?? "",
        totalBytes: known ? length : complete ? total : null,
        bytes: head,
        finalUrl: url.toString(),
      };
    }
  } catch (err) {
    if (err instanceof CheckError) throw err;
  }
  return null;
}

// Keeps the first `keep` bytes and counts the rest up to `limit`.
async function readBytes(res: Response, keep: number, limit: number): Promise<{ head: Uint8Array; total: number; complete: boolean }> {
  if (!res.body) return { head: new Uint8Array(), total: 0, complete: true };
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let kept = 0;
  let total = 0;
  let complete = false;
  while (total < limit) {
    const { done, value } = await reader.read();
    if (done) {
      complete = true;
      break;
    }
    total += value.byteLength;
    if (kept < keep) {
      chunks.push(value);
      kept += value.byteLength;
    }
  }
  reader.cancel().catch(() => {});
  return { head: new Uint8Array(Buffer.concat(chunks).subarray(0, keep)), total, complete };
}

// Runs `fn` over `items` with at most `limit` in flight, keeping order.
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    }),
  );
  return out;
}
