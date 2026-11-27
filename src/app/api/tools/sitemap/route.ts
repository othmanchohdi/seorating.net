import { NextRequest, NextResponse } from "next/server";
import { CheckError } from "@/lib/ai-check/net";
import { jsonError, targetFromQuery, throttle } from "@/lib/seo/route";
import { analyzeSitemap } from "@/lib/seo/sitemap";

// Sitemap checker: reads robots.txt, the sitemap index and up to 15 child
// sitemaps, then spot-checks a sample of URLs.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const target = targetFromQuery(req);
  if (target instanceof NextResponse) return target;
  const limited = await throttle(req, "tool-sitemap", 15);
  if (limited) return limited;
  try {
    return NextResponse.json({ host: target.hostname, ...(await analyzeSitemap(target.origin)) });
  } catch (err) {
    if (err instanceof CheckError) return jsonError(err.message, 400);
    throw err;
  }
}
