import { NextRequest, NextResponse } from "next/server";
import { CheckError, runCheck } from "@/lib/ai-check";

// Best-effort throttle so the public checker can't be used to hammer sites.
// It's per server instance, which is enough to stop casual abuse.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(ip)) {
    return NextResponse.json({ error: "Too many checks in a short time. Please wait a minute and try again." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : "";

  try {
    return NextResponse.json(await runCheck(url));
  } catch (err) {
    if (err instanceof CheckError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("AI visibility check failed", err);
    return NextResponse.json({ error: "Something went wrong running the check. Please try again." }, { status: 500 });
  }
}
