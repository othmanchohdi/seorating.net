import { NextRequest, NextResponse } from "next/server";
import { CheckError, safeFetch, toHostname, type Fetched } from "@/lib/ai-check/net";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// Shared plumbing for the free SEO tool API routes: read ?url=, validate
// it, fetch the page, and turn failures into friendly JSON errors.

export const jsonError = (error: string, status: number) => NextResponse.json({ error }, { status });

// The visitor's URL with its path and query kept, on the validated host.
export function targetFromQuery(req: NextRequest): URL | NextResponse {
  const input = req.nextUrl.searchParams.get("url") ?? "";
  const host = toHostname(input);
  if (!host) return jsonError("Enter a valid URL, like yourstore.com/products/linen-shirt.", 400);
  const raw = input.trim();
  const parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  return new URL(parsed.pathname + parsed.search, `${parsed.protocol === "http:" ? "http" : "https"}://${host}`);
}

// Fetches the requested page as HTML, or returns the error response to send.
export async function fetchPage(req: NextRequest): Promise<{ target: URL; page: Fetched } | NextResponse> {
  const target = targetFromQuery(req);
  if (target instanceof NextResponse) return target;
  try {
    const page = await safeFetch(target);
    if (!page) return jsonError(`We couldn't reach ${target.hostname}. Check the URL and try again.`, 404);
    if (page.status !== 200 || !/html/i.test(page.contentType)) {
      return jsonError(`That URL returned ${page.status === 200 ? "a non-HTML response" : `HTTP ${page.status}`}, not a page we can read.`, 404);
    }
    return { target, page };
  } catch (err) {
    if (err instanceof CheckError) return jsonError(err.message, 400);
    throw err;
  }
}

// For tools that make many outbound requests per check.
export async function throttle(req: NextRequest, tool: string, maxPerHour: number): Promise<NextResponse | null> {
  const { limited } = await rateLimit(`${tool}:${clientIp(req.headers)}`, maxPerHour, 3600);
  return limited ? jsonError("You've run a lot of checks this hour. Try again a bit later.", 429) : null;
}
