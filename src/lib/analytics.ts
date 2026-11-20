import { track as vercelTrack } from "@vercel/analytics";

// Funnel events for the free AI tools. Names are fixed here so dashboards
// stay consistent. Property values must be strings, numbers or booleans.
type Events = {
  report_requested: { source: string };
  report_viewed: { score: number; band: string; shopify: boolean };
  report_rechecked: Record<string, never>;
  fix_copied: { check: string };
  report_shared: { method: string };
  review_requested: { score: number };
  citations_requested: Record<string, never>;
  citations_viewed: { mentioned: number; cited: number };
};

export function track<E extends keyof Events>(event: E, props?: Events[E]) {
  try {
    vercelTrack(event, props);
  } catch {
    // Analytics must never break the page.
  }
}
