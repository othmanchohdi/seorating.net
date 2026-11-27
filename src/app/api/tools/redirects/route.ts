import { NextRequest, NextResponse } from "next/server";
import { CheckError } from "@/lib/ai-check/net";
import { analyzeRedirects } from "@/lib/seo/redirects";
import { jsonError, targetFromQuery, throttle } from "@/lib/seo/route";

// Redirect & status checker: hop-by-hop trace, plus domain variants for a homepage.
export async function GET(req: NextRequest) {
  const target = targetFromQuery(req);
  if (target instanceof NextResponse) return target;
  const limited = await throttle(req, "tool-redirects", 40);
  if (limited) return limited;
  try {
    return NextResponse.json({ url: target.toString(), ...(await analyzeRedirects(target)) });
  } catch (err) {
    if (err instanceof CheckError) return jsonError(err.message, 400);
    throw err;
  }
}
