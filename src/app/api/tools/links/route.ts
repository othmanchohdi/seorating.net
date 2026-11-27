import { NextRequest, NextResponse } from "next/server";
import { analyzeLinks } from "@/lib/seo/links";
import { fetchPage, throttle } from "@/lib/seo/route";

// Broken link checker: checks up to 120 links per page, so it's throttled.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const limited = await throttle(req, "tool-links", 10);
  if (limited) return limited;
  const r = await fetchPage(req);
  if (r instanceof NextResponse) return r;
  return NextResponse.json({ url: r.page.finalUrl, ...(await analyzeLinks(r.page.body, r.page.finalUrl)) });
}
