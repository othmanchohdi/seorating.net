import { NextRequest, NextResponse } from "next/server";
import { analyzeImages } from "@/lib/seo/images";
import { fetchPage, throttle } from "@/lib/seo/route";

// Image size checker: fetches up to 40 images per check, so it's throttled.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const limited = await throttle(req, "tool-images", 20);
  if (limited) return limited;
  const r = await fetchPage(req);
  if (r instanceof NextResponse) return r;
  return NextResponse.json({ url: r.page.finalUrl, ...(await analyzeImages(r.page.body, r.page.finalUrl)) });
}
