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
