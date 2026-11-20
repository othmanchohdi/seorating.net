import { NextRequest, NextResponse } from "next/server";
import { CONTACT_TO, EMAIL_FROM, SUPPORT_EMAIL } from "@/lib/site";
import { EMAIL_PATTERN, escapeHtml, resendClient } from "@/lib/email";

// Lead capture from the AI visibility checker: someone ran a check and asked
// the team for a free review. Like the waitlist, it lands in the inbox.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const site = typeof body?.site === "string" ? body.site.trim().slice(0, 300) : "";
  const score = Number.isFinite(body?.score) ? Math.round(body.score) : null;

  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const resend = resendClient();
  if (!resend) {
    console.error("RESEND_API_KEY is not configured — AI check review request dropped.");
    return NextResponse.json({ error: `We couldn't send your request. Please email ${SUPPORT_EMAIL} instead.` }, { status: 500 });
  }

  const scoreText = score === null ? "" : ` (score ${score}/100)`;
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: CONTACT_TO,
    replyTo: email,
    subject: `AI visibility review request: ${site || email}${scoreText}`,
    text: `${email} ran the free AI visibility checker on ${site || "an unknown site"}${scoreText} and asked for a free review.`,
    html: `<p><strong>${escapeHtml(email)}</strong> ran the free AI visibility checker on <strong>${escapeHtml(site || "an unknown site")}</strong>${escapeHtml(scoreText)} and asked for a free review.</p>`,
  });

  if (error) {
    console.error("Failed to send AI check review email", error);
    return NextResponse.json({ error: `We couldn't send your request. Please try again or email ${SUPPORT_EMAIL}.` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
