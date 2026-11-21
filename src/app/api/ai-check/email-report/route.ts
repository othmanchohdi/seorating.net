import { NextRequest, NextResponse } from "next/server";
import { verdict } from "@/lib/ai-check/checks";
import { HOSTNAME_PATTERN } from "@/lib/ai-check/net";
import { loadSummary } from "@/lib/ai-check/report";
import { EMAIL_PATTERN, escapeHtml, resendClient } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { CONTACT_TO, EMAIL_FROM, SITE_NAME, SUPPORT_EMAIL, absoluteUrl } from "@/lib/site";

// Sends the visitor a copy of their report (score, sections, top fixes and
// a link back), and tells the team about the lead.
export async function POST(req: NextRequest) {
  if ((await rateLimit(`email-report:${clientIp(req.headers)}`, 3, 3600)).limited) {
    return NextResponse.json({ error: "You've emailed a few reports already. Please try again later." }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const host = typeof body?.host === "string" ? body.host.trim().toLowerCase() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!HOSTNAME_PATTERN.test(host)) return NextResponse.json({ error: "That isn't a valid domain." }, { status: 400 });
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  if ((await rateLimit(`email-report-to:${email.toLowerCase()}`, 5, 86_400)).limited) {
    return NextResponse.json({ error: "That address has received a few reports today already." }, { status: 429 });
  }

  const { home, summary } = await loadSummary(host);
  if (!home.ok || !summary) return NextResponse.json({ error: "We couldn't check that site, so there's no report to send." }, { status: 400 });

  const resend = resendClient();
  if (!resend) {
    console.error("RESEND_API_KEY is not configured — report email dropped.");
    return NextResponse.json({ error: `We couldn't send the email. Please contact ${SUPPORT_EMAIL}.` }, { status: 500 });
  }

  const url = absoluteUrl(`/ai-tools/report/${host}`);
  const v = verdict(summary.score);
  const groups = summary.groups.filter((g) => g.score !== null);
  const fixes = summary.topFixes;

  const text = [
    `AI visibility report for ${host}: ${summary.score}/100 (${v.text})`,
    "",
    ...groups.map((g) => `${g.label}: ${g.score}/100`),
    "",
    fixes.length ? "Fix these first:" : "No problems found.",
    ...fixes.map((f, i) => `${i + 1}. ${f.label}: ${f.detail}`),
    "",
    `Full report with copy-paste fixes: ${url}`,
    "",
    `Questions? Reply to this email. — The ${SITE_NAME} team`,
  ].join("\n");

  const color = v.tone === "ok" ? "#0b7a55" : v.tone === "warn" ? "#915709" : "#b23a34";
  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#17171d">
  <p style="font-size:13px;color:#686880;margin:0 0 6px;text-transform:uppercase;letter-spacing:.06em">AI visibility report</p>
  <h1 style="font-size:22px;margin:0 0 16px">${escapeHtml(host)}</h1>
  <p style="font-size:44px;font-weight:700;margin:0;color:${color}">${summary.score}<span style="font-size:18px;color:#686880">/100</span></p>
  <p style="margin:4px 0 20px;font-weight:600;color:${color}">${escapeHtml(v.text)}</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">${groups
    .map((g) => `<tr><td style="padding:6px 0;border-top:1px solid #eeedf6">${escapeHtml(g.label)}</td><td style="padding:6px 0;border-top:1px solid #eeedf6;text-align:right;font-family:monospace">${g.score}</td></tr>`)
    .join("")}</table>
  ${fixes.length ? `<h2 style="font-size:16px;margin:0 0 10px">Fix these first</h2><ol style="padding-left:20px;margin:0 0 20px;font-size:14px;line-height:1.55">${fixes.map((f) => `<li style="margin-bottom:8px"><strong>${escapeHtml(f.label)}</strong><br>${escapeHtml(f.detail)}</li>`).join("")}</ol>` : ""}
  <p style="margin:0 0 24px"><a href="${url}" style="display:inline-block;background:#0b7a55;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600">See the full report and fixes</a></p>
  <p style="font-size:13px;color:#686880;line-height:1.55">Questions? Just reply to this email. — The ${escapeHtml(SITE_NAME)} team</p>
</div>`;

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    replyTo: CONTACT_TO,
    subject: `Your AI visibility report for ${host}: ${summary.score}/100`,
    text,
    html,
  });
  if (error) {
    console.error("Failed to send report email", error);
    return NextResponse.json({ error: `We couldn't send the email. Please try again or contact ${SUPPORT_EMAIL}.` }, { status: 500 });
  }

  // Lead notification; never blocks the visitor's result.
  await resend.emails
    .send({
      from: EMAIL_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject: `Report emailed: ${host} (${summary.score}/100)`,
      text: `${email} emailed themselves the AI visibility report for ${host} (${summary.score}/100). ${url}`,
    })
    .catch((err) => console.error("Failed to send report lead email", err));

  return NextResponse.json({ ok: true });
}
