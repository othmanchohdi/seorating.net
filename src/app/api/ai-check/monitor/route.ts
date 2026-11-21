import { NextRequest, NextResponse } from "next/server";
import { monitorEnabled, subscribe } from "@/lib/ai-check/monitor";
import { HOSTNAME_PATTERN } from "@/lib/ai-check/net";
import { EMAIL_PATTERN } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// Starts a weekly-alert subscription. Nothing is sent until the address
// owner clicks the confirmation link (double opt-in).
export async function POST(req: NextRequest) {
  if (!monitorEnabled()) return NextResponse.json({ error: "Weekly alerts aren't available yet." }, { status: 503 });
  if ((await rateLimit(`monitor:${clientIp(req.headers)}`, 5, 3600)).limited) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const host = typeof body?.host === "string" ? body.host.trim().toLowerCase() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!HOSTNAME_PATTERN.test(host)) return NextResponse.json({ error: "That isn't a valid domain." }, { status: 400 });
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });

  try {
    const result = await subscribe(email, host);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 400 });
    return NextResponse.json({ ok: true, already: !!result.already });
  } catch (err) {
    console.error("Monitor subscribe failed", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
