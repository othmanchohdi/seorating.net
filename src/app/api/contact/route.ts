import { NextRequest, NextResponse } from "next/server";
import { CONTACT_TO, EMAIL_FROM, SUPPORT_EMAIL } from "@/lib/site";
import { EMAIL_PATTERN, escapeHtml, resendClient } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please fill in every field with a valid email." }, { status: 400 });
  }
  if (name.length > 200 || message.length > 10_000) {
    return NextResponse.json({ error: "Your message is too long. Please shorten it and try again." }, { status: 400 });
  }

  const resend = resendClient();
  if (!resend) {
    console.error("RESEND_API_KEY is not configured — contact form submission dropped.");
    return NextResponse.json(
      { error: `We couldn't send your message. Please email ${SUPPORT_EMAIL} directly.` },
      { status: 500 },
    );
  }

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: CONTACT_TO,
    replyTo: email,
    subject: `Contact form: ${name.replace(/[\r\n]+/g, " ")}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
  });

  if (error) {
    console.error("Failed to send contact form email", error);
    return NextResponse.json(
      { error: `We couldn't send your message. Please email ${SUPPORT_EMAIL} directly.` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
