import { NextResponse, type NextRequest } from "next/server";
import { POST_SLUGS } from "@/content/blog/slugs";

const KNOWN = new Set<string>([...POST_SLUGS, "rss.xml"]);

// Blog pages stream, so a notFound() inside the page would arrive after a
// 200 status was already sent (a "soft 404"). Reject unknown slugs here,
// before rendering starts, so they get a real 404.
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !KNOWN.has(slug)) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  }
}

export const config = {
  matcher: "/blog/:slug",
};
