"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

// Records one report_viewed event per report render.
export function ReportViewed({ score, shopify }: { score: number; shopify: boolean }) {
  useEffect(() => {
    track("report_viewed", { score, band: score >= 85 ? "ready" : score >= 60 ? "partial" : "poor", shopify });
  }, [score, shopify]);
  return null;
}
