import { NextRequest, NextResponse } from "next/server";
import { metaContent, titleTag } from "@/lib/ai-check/html";
import { CheckError, safeFetch, toHostname } from "@/lib/ai-check/net";

// Lets the search snippet preview pull a live page's title and meta
// description (any path, not just the homepage) via the checker's
// SSRF-safe safeFetch, instead of typing them in by hand.
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
    const res = await safeFetch(target);
    if (!res) {
      return NextResponse.json({ error: `We couldn't reach ${target.hostname}. Check the URL and try again.` }, { status: 404 });
    }
    if (res.status !== 200 || !/html/i.test(res.contentType)) {
      return NextResponse.json({ error: `That URL returned ${res.status === 200 ? "a non-HTML response" : `HTTP ${res.status}`}, not a page we can read.` }, { status: 404 });
    }
    const title = titleTag(res.body);
    const description = metaContent(res.body, "description") ?? "";
    const finalUrl = new URL(res.finalUrl);
    return NextResponse.json({
      host: finalUrl.hostname.replace(/^www\./, ""),
      path: finalUrl.pathname,
      title,
      description,
    });
  } catch (err) {
    if (err instanceof CheckError) return NextResponse.json({ error: err.message }, { status: 400 });
    throw err;
  }
}
