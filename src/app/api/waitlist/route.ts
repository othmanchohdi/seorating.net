import { NextRequest, NextResponse } from "next/server";
import { CONTACT_TO, EMAIL_FROM, SUPPORT_EMAIL } from "@/lib/site";
import { EMAIL_PATTERN, escapeHtml, resendClient } from "@/lib/email";

// The WordPress waitlist is small enough to live in the inbox: each signup
// is emailed to the team rather than stored in a database or Resend Audience.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const resend = resendClient();
  if (!resend) {
    console.error("RESEND_API_KEY is not configured — waitlist signup dropped.");
    return NextResponse.json(
      { error: `We couldn't add you to the waitlist. Please email ${SUPPORT_EMAIL} instead.` },
      { status: 500 },
    );
  }

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: CONTACT_TO,
    replyTo: email,
    subject: `WordPress waitlist: ${email}`,
    text: `${email} joined the WordPress & WooCommerce waitlist from seorating.net.`,
    html: `<p><strong>${escapeHtml(email)}</strong> joined the WordPress &amp; WooCommerce waitlist from seorating.net.</p>`,
  });

  if (error) {
    console.error("Failed to send waitlist email", error);
    return NextResponse.json(
      { error: `We couldn't add you to the waitlist. Please try again or email ${SUPPORT_EMAIL}.` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
