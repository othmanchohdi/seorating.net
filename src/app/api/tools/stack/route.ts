import { NextRequest, NextResponse } from "next/server";
import { fetchPage } from "@/lib/seo/route";
import { detectStack } from "@/lib/seo/stack";

// Shopify theme & app detector.
export async function GET(req: NextRequest) {
  const r = await fetchPage(req);
  if (r instanceof NextResponse) return r;
  return NextResponse.json({ url: r.page.finalUrl, ...detectStack(r.page.body, r.page.headers, r.page.finalUrl) });
}
