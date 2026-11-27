import { NextRequest, NextResponse } from "next/server";
import { linkHref } from "@/lib/ai-check/html";
import { CheckError, safeFetch, textFile, toHostname } from "@/lib/ai-check/net";

// Lets the Shopify URL inspector check a real page instead of only
// simulating Shopify's default behaviour: the page's actual canonical tag,
// and the store's actual robots.txt (which may not be the Shopify default
// if it's been customised).
export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("url") ?? "";
  const host = toHostname(input);
  if (!host) {
    return NextResponse.json({ error: "Enter a valid URL, like yourstore.com/products/linen-shirt." }, { status: 400 });
  }

  // toHostname validated and normalised the host; re-parse to keep the path and query the visitor typed.
  const raw = input.trim();
  const parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  const target = new URL(parsed.pathname + parsed.search, `https://${host}`);

  try {
    const [pageRes, robotsRes] = await Promise.all([safeFetch(target), safeFetch(new URL("/robots.txt", `https://${host}`))]);
    if (!pageRes) {
      return NextResponse.json({ error: `We couldn't reach ${target.hostname}. Check the URL and try again.` }, { status: 404 });
    }
    if (pageRes.status !== 200 || !/html/i.test(pageRes.contentType)) {
      return NextResponse.json({ error: `That URL returned ${pageRes.status === 200 ? "a non-HTML response" : `HTTP ${pageRes.status}`}, not a page we can read.` }, { status: 404 });
    }

    const canonicalHref = linkHref(pageRes.body, "canonical");
    let canonical: string | null = null;
    if (canonicalHref) {
      try {
        canonical = new URL(canonicalHref, pageRes.finalUrl).toString();
      } catch {
        canonical = canonicalHref;
      }
    }

    const finalUrl = new URL(pageRes.finalUrl);
    return NextResponse.json({
      host: finalUrl.hostname,
      path: finalUrl.pathname + finalUrl.search,
      finalUrl: pageRes.finalUrl,
      canonical,
      robots: textFile(robotsRes),
    });
  } catch (err) {
    if (err instanceof CheckError) return NextResponse.json({ error: err.message }, { status: 400 });
    throw err;
  }
}
