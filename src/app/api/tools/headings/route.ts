import { NextRequest, NextResponse } from "next/server";
import { analyzeHeadings } from "@/lib/seo/headings";
import { fetchPage } from "@/lib/seo/route";

// Heading tags checker: the page's h1–h6 outline as crawlers read it.
export async function GET(req: NextRequest) {
  const r = await fetchPage(req);
  if (r instanceof NextResponse) return r;
  return NextResponse.json({ url: r.page.finalUrl, ...analyzeHeadings(r.page.body) });
}
