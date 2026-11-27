import { NextRequest, NextResponse } from "next/server";
import { analyzeHreflang } from "@/lib/seo/hreflang";
import { fetchPage, throttle } from "@/lib/seo/route";

// hreflang checker: fetches every alternate to confirm return links.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const limited = await throttle(req, "tool-hreflang", 20);
  if (limited) return limited;
  const r = await fetchPage(req);
  if (r instanceof NextResponse) return r;
  return NextResponse.json(await analyzeHreflang(r.page.body, r.page.finalUrl));
}
