import { NextRequest, NextResponse } from "next/server";
import { fetchPage } from "@/lib/seo/route";
import { analyzeSocial } from "@/lib/seo/social";

// Social share preview: Open Graph and X card tags plus the share image's size.
export async function GET(req: NextRequest) {
  const r = await fetchPage(req);
  if (r instanceof NextResponse) return r;
  return NextResponse.json(await analyzeSocial(r.page.body, r.page.finalUrl));
}
