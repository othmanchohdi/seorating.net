import { NextRequest, NextResponse } from "next/server";
import { CATEGORY_PATTERN, CitationError, citationsEnabled, getCitations } from "@/lib/ai-check/citations";
import { HOSTNAME_PATTERN } from "@/lib/ai-check/net";
import { EMAIL_PATTERN, escapeHtml, resendClient } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { CONTACT_TO, EMAIL_FROM } from "@/lib/site";

// Each check makes three paid Perplexity calls, so it's gated by email and
// capped per visitor and per day across the whole site.
const PER_IP_PER_HOUR = 3;
const DAILY_CAP = Number(process.env.CITATION_DAILY_CAP) || 100;

export async function POST(req: NextRequest) {
  if (!citationsEnabled()) return NextResponse.json({ error: "The citation check isn't available yet." }, { status: 503 });

  const body = await req.json().catch(() => null);
  const host = typeof body?.host === "string" ? body.host.trim().toLowerCase() : "";
  const category = typeof body?.category === "string" ? body.category.trim().replace(/\s+/g, " ") : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!HOSTNAME_PATTERN.test(host)) return NextResponse.json({ error: "That isn't a valid domain." }, { status: 400 });
  if (!CATEGORY_PATTERN.test(category)) return NextResponse.json({ error: "Describe what you sell in a few words, like “linen shirts”." }, { status: 400 });
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });

  if ((await rateLimit(`citations:${clientIp(req.headers)}`, PER_IP_PER_HOUR, 3600)).limited) {
    return NextResponse.json({ error: "You've run a few citation checks already. Please try again in an hour." }, { status: 429 });
  }
  const day = new Date().toISOString().slice(0, 10);
  if ((await rateLimit(`citations-day:${day}`, DAILY_CAP, 86_400)).limited) {
    return NextResponse.json({ error: "Today's free citation checks are used up. Please try again tomorrow." }, { status: 429 });
  }

  let report;
  try {
    report = await getCitations(host, category.toLowerCase());
  } catch (err) {
    if (err instanceof CitationError) return NextResponse.json({ error: err.message }, { status: 502 });
    console.error("Citation check failed", err);
    return NextResponse.json({ error: "Something went wrong running the check. Please try again." }, { status: 500 });
  }

  // The lead goes to the team inbox; a failed email never blocks the result.
  const discovery = report.answers.filter((a) => a.kind === "discovery");
  const summary = `mentioned in ${discovery.filter((a) => a.mentioned).length}/${discovery.length} buyer questions, cited in ${discovery.filter((a) => a.cited).length}/${discovery.length}`;
  const resend = resendClient();
  if (resend) {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject: `AI citation check: ${host} (${category})`,
      text: `${email} ran the Perplexity citation check for ${host}, category "${category}": ${summary}. Top cited competitors: ${report.competitors.map((c) => c.host).join(", ") || "none"}. Cost: $${report.costUsd ?? "?"}.`,
      html: `<p><strong>${escapeHtml(email)}</strong> ran the Perplexity citation check for <strong>${escapeHtml(host)}</strong>, category “${escapeHtml(category)}”: ${escapeHtml(summary)}.</p><p>Top cited competitors: ${escapeHtml(report.competitors.map((c) => c.host).join(", ") || "none")}</p><p>Cost: $${report.costUsd ?? "?"}</p>`,
    });
    if (error) console.error("Failed to send citation lead email", error);
  }

  return NextResponse.json(report);
}
