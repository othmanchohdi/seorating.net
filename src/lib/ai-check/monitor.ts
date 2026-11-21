import { randomBytes } from "node:crypto";
import { escapeHtml, resendClient } from "../email";
import { rateLimit } from "../rate-limit";
import { redis, redisEnabled } from "../redis";
import { EMAIL_FROM, SITE_NAME, absoluteUrl } from "../site";
import { accessChecks, fileChecks, homepageChecks, productChecks, summarize, type Check } from "./checks";
import { fetchFiles, fetchHome, fetchProbes, fetchProduct } from "./data";

// Weekly monitoring: a visitor subscribes to a site, confirms by email, and
// gets an email only when something changes. Subscriptions live in Redis:
//   mon:sub:<id>          JSON Subscription (pending ones expire after 48 h)
//   mon:idx:<email>:<host> → id, to avoid duplicates
//   mon:active            set of confirmed ids
// The id is a random token; it's the only credential for confirm/unsubscribe.

export const monitorEnabled = () => redisEnabled() && !!process.env.RESEND_API_KEY;

export type Subscription = {
  id: string;
  email: string;
  host: string;
  status: "pending" | "active";
  createdAt: string;
  lastScore: number | null;
  lastProblems: string[];
  lastCheckedAt: string | null;
};

const PENDING_TTL = 48 * 3600;
const MAX_SITES_PER_EMAIL = 5;
export const ALERT_DELTA = 5;

const subKey = (id: string) => `mon:sub:${id}`;
const idxKey = (email: string, host: string) => `mon:idx:${email.toLowerCase()}:${host}`;
const ID_PATTERN = /^[A-Za-z0-9_-]{32}$/;

export async function getSubscription(id: string): Promise<Subscription | null> {
  if (!ID_PATTERN.test(id)) return null;
  const raw = await redis<string | null>("GET", subKey(id));
  return raw ? (JSON.parse(raw) as Subscription) : null;
}

async function save(sub: Subscription) {
  if (sub.status === "pending") await redis("SET", subKey(sub.id), JSON.stringify(sub), "EX", PENDING_TTL);
  else await redis("SET", subKey(sub.id), JSON.stringify(sub));
}

const problemIds = (checks: Check[]) => checks.filter((c) => c.tone === "bad").map((c) => c.id);

// A fresh, uncached crawl: the monitor must see the site as it is now.
export async function freshReport(host: string) {
  const home = await fetchHome(host);
  if (!home.ok) return null;
  const [files, probes, product] = await Promise.all([fetchFiles(home.origin), fetchProbes(home.origin), fetchProduct(home.productUrl)]);
  const checks = [...accessChecks(home, files, probes), ...fileChecks(home, files), ...homepageChecks(home), ...productChecks(home, product)];
  const summary = summarize(checks);
  return { home, checks, summary, problems: problemIds(checks) };
}

// ---------------------------------------------------------------------------

export type SubscribeResult = { ok: true; already?: boolean } | { ok: false; message: string };

export async function subscribe(email: string, host: string): Promise<SubscribeResult> {
  const existingId = await redis<string | null>("GET", idxKey(email, host));
  const existing = existingId ? await getSubscription(existingId) : null;
  if (existing?.status === "active") return { ok: true, already: true };

  if ((await rateLimit(`monitor-email:${email.toLowerCase()}`, MAX_SITES_PER_EMAIL, 86_400)).limited) {
    return { ok: false, message: "That address has asked to watch several sites today. Please try again tomorrow." };
  }

  const sub: Subscription = existing ?? {
    id: randomBytes(24).toString("base64url"),
    email,
    host,
    status: "pending",
    createdAt: new Date().toISOString(),
    lastScore: null,
    lastProblems: [],
    lastCheckedAt: null,
  };
  await save(sub);
  await redis("SET", idxKey(email, host), sub.id, "EX", PENDING_TTL);

  const link = absoluteUrl(`/ai-tools/monitor?action=confirm&id=${sub.id}`);
  const resend = resendClient()!;
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: `Confirm weekly AI visibility alerts for ${host}`,
    text: `Someone (hopefully you) asked for weekly AI visibility alerts for ${host}.\n\nConfirm here: ${link}\n\nWe'll only email when something changes. If this wasn't you, ignore this email and nothing will happen.\n\n— The ${SITE_NAME} team`,
    html: `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:520px;color:#17171d;line-height:1.6"><p>Someone (hopefully you) asked for weekly AI visibility alerts for <strong>${escapeHtml(host)}</strong>.</p><p><a href="${link}" style="display:inline-block;background:#0b7a55;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600">Confirm alerts</a></p><p style="color:#686880;font-size:14px">We'll only email when something changes. If this wasn't you, ignore this email and nothing will happen.</p></div>`,
  });
  if (error) {
    console.error("Failed to send monitor confirmation", error);
    return { ok: false, message: "We couldn't send the confirmation email. Please try again." };
  }
  return { ok: true };
}

export async function confirm(id: string): Promise<Subscription | null> {
  const sub = await getSubscription(id);
  if (!sub) return null;
  if (sub.status === "active") return sub;
  const report = await freshReport(sub.host);
  const active: Subscription = {
    ...sub,
    status: "active",
    lastScore: report?.summary.score ?? null,
    lastProblems: report?.problems ?? [],
    lastCheckedAt: new Date().toISOString(),
  };
  await save(active);
  await redis("SET", idxKey(sub.email, sub.host), sub.id);
  await redis("SADD", "mon:active", sub.id);
  return active;
}

export async function unsubscribe(id: string): Promise<Subscription | null> {
  const sub = await getSubscription(id);
  if (!sub) return null;
  await redis("DEL", subKey(id));
  await redis("DEL", idxKey(sub.email, sub.host));
  await redis("SREM", "mon:active", id);
  return sub;
}

// ---------------------------------------------------------------------------
// The weekly run

export type Change = { scoreFrom: number | null; scoreTo: number; newProblems: Check[]; fixed: string[] };

export function diff(sub: Subscription, report: NonNullable<Awaited<ReturnType<typeof freshReport>>>): Change | null {
  const newProblems = report.checks.filter((c) => c.tone === "bad" && !sub.lastProblems.includes(c.id));
  const fixed = sub.lastProblems.filter((id) => !report.problems.includes(id));
  const delta = sub.lastScore === null ? 0 : report.summary.score - sub.lastScore;
  if (Math.abs(delta) < ALERT_DELTA && !newProblems.length && !fixed.length) return null;
  return { scoreFrom: sub.lastScore, scoreTo: report.summary.score, newProblems, fixed };
}

async function sendAlert(sub: Subscription, change: Change, checks: Check[]) {
  const reportUrl = absoluteUrl(`/ai-tools/report/${sub.host}`);
  const manageUrl = absoluteUrl(`/ai-tools/monitor?action=unsubscribe&id=${sub.id}`);
  const oneClick = absoluteUrl(`/api/ai-check/monitor/unsubscribe?id=${sub.id}`);
  const label = (id: string) => checks.find((c) => c.id === id)?.label ?? id;
  const dir = change.scoreFrom === null ? "" : change.scoreTo < change.scoreFrom ? "dropped" : change.scoreTo > change.scoreFrom ? "improved" : "";
  const subject = change.newProblems.length
    ? `${sub.host}: new AI visibility problem – ${change.newProblems[0].label}`
    : dir
      ? `${sub.host}: AI visibility ${dir} to ${change.scoreTo}/100`
      : `${sub.host}: AI visibility changes this week`;

  const lines = [
    change.scoreFrom !== null ? `Score: ${change.scoreFrom} → ${change.scoreTo}/100` : `Score: ${change.scoreTo}/100`,
    ...(change.newProblems.length ? ["", "New problems:", ...change.newProblems.map((c) => `- ${c.label}: ${c.detail}`)] : []),
    ...(change.fixed.length ? ["", "Fixed since last week:", ...change.fixed.map((id) => `- ${label(id)}`)] : []),
    "",
    `Full report and fixes: ${reportUrl}`,
    "",
    `Stop these alerts: ${manageUrl}`,
  ];
  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;color:#17171d;line-height:1.55">
<p style="font-size:13px;color:#686880;text-transform:uppercase;letter-spacing:.06em;margin:0 0 6px">Weekly AI visibility check</p>
<h1 style="font-size:21px;margin:0 0 12px">${escapeHtml(sub.host)}</h1>
<p style="font-size:16px;margin:0 0 16px">Score: ${change.scoreFrom !== null ? `${change.scoreFrom} → ` : ""}<strong>${change.scoreTo}/100</strong></p>
${change.newProblems.length ? `<h2 style="font-size:15px;margin:16px 0 6px;color:#b23a34">New problems</h2><ul style="padding-left:18px;margin:0">${change.newProblems.map((c) => `<li><strong>${escapeHtml(c.label)}</strong>: ${escapeHtml(c.detail)}</li>`).join("")}</ul>` : ""}
${change.fixed.length ? `<h2 style="font-size:15px;margin:16px 0 6px;color:#0b7a55">Fixed since last week</h2><ul style="padding-left:18px;margin:0">${change.fixed.map((id) => `<li>${escapeHtml(label(id))}</li>`).join("")}</ul>` : ""}
<p style="margin:22px 0"><a href="${reportUrl}" style="display:inline-block;background:#0b7a55;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600">See the full report</a></p>
<p style="font-size:12.5px;color:#686880">You asked for alerts about ${escapeHtml(sub.host)}. <a href="${manageUrl}" style="color:#686880">Stop these alerts</a>.</p>
</div>`;

  const { error } = await resendClient()!.emails.send({
    from: EMAIL_FROM,
    to: sub.email,
    subject,
    text: lines.join("\n"),
    html,
    headers: { "List-Unsubscribe": `<${oneClick}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  });
  if (error) throw new Error(`Alert email failed: ${JSON.stringify(error)}`);
}

// Re-checks every watched site once and emails subscribers whose site
// changed. Sites are crawled once each, however many people watch them.
export async function runMonitor({ maxSites = 150, concurrency = 4 } = {}) {
  const ids = await redis<string[]>("SMEMBERS", "mon:active");
  const subs = (await Promise.all(ids.map(getSubscription))).filter((s): s is Subscription => !!s && s.status === "active");
  const byHost = new Map<string, Subscription[]>();
  for (const s of subs) byHost.set(s.host, [...(byHost.get(s.host) ?? []), s]);
  // Least recently checked first, so a capped run still reaches everyone over time.
  const hosts = [...byHost.keys()]
    .sort((a, b) => (byHost.get(a)![0].lastCheckedAt ?? "").localeCompare(byHost.get(b)![0].lastCheckedAt ?? ""))
    .slice(0, maxSites);

  const stats = { sites: hosts.length, subscribers: subs.length, alerts: 0, errors: 0 };
  let next = 0;
  async function worker() {
    while (next < hosts.length) {
      const host = hosts[next++];
      try {
        const report = await freshReport(host);
        if (!report) continue;
        for (const sub of byHost.get(host)!) {
          const change = diff(sub, report);
          if (change) {
            await sendAlert(sub, change, report.checks);
            stats.alerts++;
          }
          await save({ ...sub, lastScore: report.summary.score, lastProblems: report.problems, lastCheckedAt: new Date().toISOString() });
        }
      } catch (err) {
        stats.errors++;
        console.error(`Monitor failed for ${host}`, err);
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return stats;
}

