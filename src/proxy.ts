import { NextResponse, type NextRequest } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { CRAWLER_SLUGS } from "@/content/ai-crawlers";
import { POST_SLUGS } from "@/content/blog/slugs";

const KNOWN = new Set<string>([...POST_SLUGS, "rss.xml"]);
const CRAWLERS = new Set<string>(CRAWLER_SLUGS);
const HOSTNAME = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

// Throttle report generation, which crawls third-party sites. Cached
// reports are cheap, so the cap is loose. Shared across instances when
// Upstash is configured (see lib/rate-limit.ts).
const MAX_REPORTS_PER_MINUTE = 12;

const notFound = (request: NextRequest) => NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/ai-tools/report/")) {
    const segment = pathname.split("/")[3] ?? "";
    // Only the page itself crawls; its opengraph-image reuses the cached result.
    const isPage = pathname.split("/").length === 4;
    const host = decodeURIComponent(segment).toLowerCase();
    if (host !== segment) return NextResponse.redirect(new URL(`/ai-tools/report/${host}`, request.url), 308);
    if (!HOSTNAME.test(host)) return notFound(request);
    if (isPage && request.method === "GET" && !request.headers.has("rsc") && (await rateLimit(`report:${clientIp(request.headers)}`, MAX_REPORTS_PER_MINUTE, 60)).limited) {
      return new NextResponse("Too many reports in a short time. Please wait a minute and try again.", { status: 429, headers: { "Retry-After": "60" } });
    }
    return;
  }

  if (pathname === "/ai-tools/compare") {
    // Each compared site is a crawl, so it counts like a report.
    const sites = (request.nextUrl.searchParams.get("sites") ?? "").split(",").filter(Boolean).length;
    if (sites >= 2 && request.method === "GET" && !request.headers.has("rsc") && (await rateLimit(`report:${clientIp(request.headers)}`, MAX_REPORTS_PER_MINUTE, 60, Math.min(sites, 3))).limited) {
      return new NextResponse("Too many checks in a short time. Please wait a minute and try again.", { status: 429, headers: { "Retry-After": "60" } });
    }
    return;
  }

  if (pathname.startsWith("/ai-tools/ai-crawlers/")) {
    const slug = pathname.split("/")[3];
    if (slug && !CRAWLERS.has(slug)) return notFound(request);
    return;
  }

  // Blog pages stream, so a notFound() inside the page would arrive after a
  // 200 status was already sent (a "soft 404"). Reject unknown slugs here,
  // before rendering starts, so they get a real 404.
  const slug = pathname.split("/")[2];
  if (slug && !KNOWN.has(slug)) return notFound(request);
}

export const config = {
  matcher: ["/blog/:slug", "/ai-tools/report/:path*", "/ai-tools/ai-crawlers/:slug", "/ai-tools/compare"],
};
