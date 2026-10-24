import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SUPPORT_EMAIL } from "@/lib/site";

const FROM_ADDRESS = "SEO Rating Website <contact@send.seorating.net>";

// The WordPress waitlist is small enough to live in the support inbox:
// each signup is emailed to the team rather than stored in a database.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured — waitlist signup dropped.");
    return NextResponse.json(
      { error: `The waitlist isn't configured yet. Please email ${SUPPORT_EMAIL} instead.` },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: SUPPORT_EMAIL,
      replyTo: email,
      subject: `WordPress waitlist: ${email}`,
      text: `${email} joined the WordPress & WooCommerce waitlist from seorating.net.`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send waitlist email", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }
}
