import { NextRequest, NextResponse } from "next/server";
import { jsonLd } from "@/lib/ai-check/html";
import { CheckError, safeFetch, toHostname } from "@/lib/ai-check/net";

// Lets the structured data checker read the JSON-LD actually on a live page
// (any path, not just the homepage), via the checker's SSRF-safe safeFetch.
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
    const { nodes, invalid } = jsonLd(res.body);
    return NextResponse.json({ host, finalUrl: res.finalUrl, nodes: nodes.slice(0, 40), invalid });
  } catch (err) {
    if (err instanceof CheckError) return NextResponse.json({ error: err.message }, { status: 400 });
    throw err;
  }
}
