import { NextRequest, NextResponse } from "next/server";
import { unsubscribe } from "@/lib/ai-check/monitor";

// One-click unsubscribe (RFC 8058) for the List-Unsubscribe-Post header.
// POST only, so link scanners that open URLs can't unsubscribe anyone.
export async function POST(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  try {
    await unsubscribe(id);
  } catch (err) {
    console.error("One-click unsubscribe failed", err);
    return new NextResponse(null, { status: 500 });
  }
  return new NextResponse(null, { status: 200 });
}
