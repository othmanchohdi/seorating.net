import { NextRequest, NextResponse } from "next/server";
import { CheckError, safeFetch, textFile, toHostname } from "@/lib/ai-check/net";

// Lets the robots.txt tester pull a live file instead of pasting it by hand.
// Reuses the checker's safeFetch (refuses private/internal addresses, caps
// time and size) so this can't be used to probe internal infrastructure.
export async function GET(req: NextRequest) {
  const host = toHostname(req.nextUrl.searchParams.get("url") ?? "");
  if (!host) {
    return NextResponse.json({ error: "Enter a valid domain, like yourstore.com." }, { status: 400 });
  }

  try {
    const res = await safeFetch(new URL("/robots.txt", `https://${host}`));
    const text = textFile(res);
    if (text === null) {
      return NextResponse.json(
        {
          error: res
            ? `${host} returned ${res.status === 200 ? "a page, not a plain-text file" : `HTTP ${res.status}`} for /robots.txt.`
            : `We couldn't reach ${host}. Check the domain and try again.`,
        },
        { status: 404 },
      );
    }
    return NextResponse.json({ host, text: text.slice(0, 100_000) });
  } catch (err) {
    if (err instanceof CheckError) return NextResponse.json({ error: err.message }, { status: 400 });
    throw err;
  }
}
