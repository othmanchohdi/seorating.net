import { verdict } from "@/lib/ai-check/checks";
import { loadSummary } from "@/lib/ai-check/report";
import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "AI visibility report";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const { summary } = await loadSummary(domain);
  return ogImage({
    eyebrow: "AI visibility report",
    title: summary ? `${domain} scores ${summary.score}/100: ${verdict(summary.score).text}` : `AI visibility report for ${domain}`,
    footer: "Check your site free at seorating.net/ai-tools",
  });
}
