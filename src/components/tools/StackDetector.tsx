"use client";

import { WidgetFrame } from "@/components/blog/WidgetFrame";
import type { DetectedApp, ThemeInfo } from "@/lib/seo/stack";
import { LiveUrlForm, Tally, plural, useLiveCheck } from "./LiveUrlForm";

type Result = { url: string; platform: string | null; theme: ThemeInfo | null; apps: DetectedApp[]; externalScripts: number; thirdPartyHosts: string[] };

export function StackDetector() {
  const { status, data, run } = useLiveCheck<Result>("/api/tools/stack");
  const heavy = data?.apps.filter((a) => a.heavy) ?? [];
  // Apps arrive sorted by category; group consecutive runs (Object.groupBy is too new for older Safari).
  const byCategory: [string, DetectedApp[]][] = [];
  for (const a of data?.apps ?? []) {
    const last = byCategory[byCategory.length - 1];
    if (last?.[0] === a.category) last[1].push(a);
    else byCategory.push([a.category, [a]]);
  }

  return (
    <WidgetFrame
      title="Shopify theme & app detector"
      badge={data?.platform && <span className="pill pill-ok">{data.platform}</span>}
      caption="Detected from the scripts and widgets a store loads on the page you enter. Apps that only run in checkout, the admin or on other pages won't show up."
    >
      <LiveUrlForm
        label="Store URL"
        button="Detect theme & apps"
        loadingLabel="Detecting…"
        status={status}
        onSubmit={run}
        hint="Enter any store's homepage or a product page. Product pages reveal more apps (reviews, upsells, wishlists)."
        doneHint={data && `Read ${data.url}. Nothing is saved on our end.`}
      />

      {data && (
        <>
          <div className="report-card" style={{ padding: 16, display: "grid", gap: 6 }}>
            <span className="tool-section-title">Platform & theme</span>
            {!data.platform ? (
              <span>We couldn&rsquo;t identify the platform. The site may be custom-built or behind a headless front end.</span>
            ) : data.platform !== "Shopify" ? (
              <span>
                Runs on <strong>{data.platform}</strong>, not Shopify, so there&rsquo;s no Shopify theme to report.
              </span>
            ) : data.theme ? (
              <>
                <span style={{ fontSize: 20, fontWeight: 600 }}>
                  {data.theme.schemaName ?? data.theme.name ?? "Unknown theme"}
                  {data.theme.version && <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-faint)" }}> v{data.theme.version}</span>}
                </span>
                <span className="result-sub">
                  {data.theme.themeStoreId
                    ? `A Shopify Theme Store theme (ID ${data.theme.themeStoreId}).`
                    : data.theme.schemaName
                      ? "Not linked to the Theme Store: a custom theme, or a copy edited by a developer."
                      : "Custom theme."}
                  {data.theme.name && data.theme.name !== data.theme.schemaName && <> The store named its copy &ldquo;{data.theme.name}&rdquo;.</>}
                </span>
              </>
            ) : (
              <span>Shopify store, but the theme name is hidden (common on headless Hydrogen stores).</span>
            )}
          </div>

          <Tally
            items={[
              { label: plural(data.apps.length, "app or tool", "apps and tools"), tone: "ok" },
              { label: `${plural(heavy.length, "heavy script")}`, tone: heavy.length > 2 ? "bad" : heavy.length ? "warn" : "ok" },
              { label: `${plural(data.externalScripts, "external script")}`, tone: data.externalScripts > 40 ? "warn" : undefined },
              { label: `${plural(data.thirdPartyHosts.length, "third-party domain")}`, tone: data.thirdPartyHosts.length > 15 ? "warn" : undefined },
            ]}
          />

          {data.apps.length === 0 ? (
            <p className="result-sub" style={{ margin: 0 }}>No known apps found on this page.</p>
          ) : (
            <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
              {byCategory.map(([category, apps]) => (
                <div key={category} style={{ display: "grid", gap: 6, alignContent: "start" }}>
                  <span className="tool-section-title">{category}</span>
                  {apps.map((a) => (
                    <span key={a.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14.5 }} title={a.evidence}>
                      {a.name}
                      {a.heavy && (
                        <span className="pill pill-warn" style={{ fontSize: 10.5 }}>
                          heavy
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}

          {heavy.length > 0 && (
            <p className="result-sub" style={{ margin: 0 }}>
              &ldquo;Heavy&rdquo; apps commonly add a lot of JavaScript to every page, which slows Core Web Vitals. Keep the ones that earn their place and remove leftover code from uninstalled apps.
            </p>
          )}
        </>
      )}
    </WidgetFrame>
  );
}
