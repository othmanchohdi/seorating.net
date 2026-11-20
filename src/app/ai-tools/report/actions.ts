"use server";

import { headers } from "next/headers";
import { updateTag } from "next/cache";
import { getHome, siteTag } from "@/lib/ai-check/data";
import { HOSTNAME_PATTERN } from "@/lib/ai-check/net";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const MIN_AGE_MS = 5 * 60_000;

export type RecheckResult = { ok: true } | { ok: false; message: string };

// Expires every cached piece of a report so the next render crawls the site
// again. Limited per site (results under five minutes old are kept) and per
// visitor, because each re-check costs a fresh crawl of someone's site.
export async function recheckReport(host: string): Promise<RecheckResult> {
  if (!HOSTNAME_PATTERN.test(host)) return { ok: false, message: "That isn't a valid domain." };

  const home = await getHome(host);
  if (home.ok && Date.now() - Date.parse(home.checkedAt) < MIN_AGE_MS) {
    return { ok: false, message: "This report is less than five minutes old. Try again in a few minutes." };
  }
  if ((await rateLimit(`recheck:${clientIp(await headers())}`, 6, 3600)).limited) {
    return { ok: false, message: "You've re-checked a lot of reports. Please wait a while and try again." };
  }

  updateTag(siteTag(host));
  if (home.ok) {
    const finalHost = new URL(home.origin).hostname;
    if (finalHost !== host) updateTag(siteTag(finalHost));
  }
  return { ok: true };
}
