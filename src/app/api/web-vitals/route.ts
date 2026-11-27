import { NextRequest, NextResponse } from "next/server";
import { toHostname } from "@/lib/ai-check/net";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// Lets the Core Web Vitals checker show a real page's numbers via Google's
// PageSpeed Insights API: Chrome UX Report field data (what Google ranks
// on) for the URL, or its whole origin when the URL alone lacks traffic,
// plus a mobile Lighthouse lab run as a fallback. Google fetches the page,
// not us, so no safeFetch is needed. PSI takes 10-40s per run.
export const maxDuration = 60;

const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

type PsiMetric = { percentile?: number };
type PsiExperience = { id?: string; origin_fallback?: boolean; metrics?: Record<string, PsiMetric> };
type PsiResponse = {
  id?: string;
  loadingExperience?: PsiExperience;
  originLoadingExperience?: PsiExperience;
  lighthouseResult?: {
    finalUrl?: string;
    categories?: { performance?: { score?: number | null } };
    audits?: Record<string, { numericValue?: number }>;
  };
  error?: { code?: number; message?: string };
};

// CrUX reports LCP and INP in ms; CLS comes multiplied by 100.
function fieldVitals(exp: PsiExperience | undefined) {
  const m = exp?.metrics;
  const lcp = m?.LARGEST_CONTENTFUL_PAINT_MS?.percentile;
  const inp = m?.INTERACTION_TO_NEXT_PAINT?.percentile;
  const cls = m?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile;
  if (lcp === undefined && inp === undefined && cls === undefined) return null;
  return {
    lcp: lcp === undefined ? null : lcp / 1000,
    inp: inp ?? null,
    cls: cls === undefined ? null : cls / 100,
  };
}

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("url") ?? "";
  const host = toHostname(input);
  if (!host) {
    return NextResponse.json({ error: "Enter a valid URL, like yourstore.com or yourstore.com/products/linen-shirt." }, { status: 400 });
  }

  const { limited } = await rateLimit(`web-vitals:${clientIp(req.headers)}`, 10, 3600);
  if (limited) {
    return NextResponse.json({ error: "You've run a lot of checks this hour. Try again a bit later." }, { status: 429 });
  }

  const raw = input.trim();
  const parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  const target = new URL(parsed.pathname + parsed.search, `https://${host}`).toString();

  const params = new URLSearchParams({ url: target, strategy: "mobile", category: "performance" });
  if (process.env.PAGESPEED_API_KEY) params.set("key", process.env.PAGESPEED_API_KEY);

  let data: PsiResponse;
  try {
    const res = await fetch(`${ENDPOINT}?${params}`, { signal: AbortSignal.timeout(55_000), cache: "no-store" });
    data = (await res.json()) as PsiResponse;
    if (!res.ok || data.error) {
      const status = data.error?.code ?? res.status;
      if (status === 429) {
        return NextResponse.json({ error: "Google's PageSpeed service is busy right now. Try again in a few minutes." }, { status: 503 });
      }
      // PSI returns 400/500 with a message like "Lighthouse returned error: FAILED_DOCUMENT_REQUEST" when it can't load the page.
      return NextResponse.json({ error: `Google couldn't test ${host}. Check the URL loads in a browser and try again.` }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "Google's PageSpeed test took too long. Try again, or try a lighter page." }, { status: 504 });
  }

  // When the URL alone has too little traffic, PSI fills loadingExperience with origin data and flags it.
  const page = data.loadingExperience?.origin_fallback ? null : fieldVitals(data.loadingExperience);
  const origin = fieldVitals(data.originLoadingExperience);
  const audits = data.lighthouseResult?.audits ?? {};
  const labLcp = audits["largest-contentful-paint"]?.numericValue;
  const labCls = audits["cumulative-layout-shift"]?.numericValue;
  const score = data.lighthouseResult?.categories?.performance?.score;

  return NextResponse.json({
    url: data.lighthouseResult?.finalUrl ?? data.id ?? target,
    field: page ? { scope: "page", ...page } : origin ? { scope: "origin", ...origin } : null,
    lab:
      labLcp === undefined
        ? null
        : {
            lcp: labLcp / 1000,
            cls: labCls ?? null,
            tbt: audits["total-blocking-time"]?.numericValue ?? null,
            score: typeof score === "number" ? Math.round(score * 100) : null,
          },
  });
}
