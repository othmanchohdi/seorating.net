import { NextRequest, NextResponse } from "next/server";
import { monitorEnabled, runMonitor } from "@/lib/ai-check/monitor";

// Weekly run, scheduled in vercel.json. Vercel sends CRON_SECRET as a bearer
// token; anything else is rejected.
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!monitorEnabled()) return NextResponse.json({ skipped: "Monitoring isn't configured." });
  const stats = await runMonitor();
  console.log("Monitor run", stats);
  return NextResponse.json(stats);
}
