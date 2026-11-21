import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getSubscription, monitorEnabled } from "@/lib/ai-check/monitor";
import { HOSTNAME_PATTERN } from "@/lib/ai-check/net";
import { confirmAction, unsubscribeAction } from "./actions";

export const metadata: Metadata = {
  title: "Weekly AI visibility alerts",
  robots: { index: false, follow: false },
};

// Confirm and unsubscribe links land here and need a button press, because
// email security scanners open links automatically.
export default function MonitorPage({ searchParams }: PageProps<"/ai-tools/monitor">) {
  return (
    <div className="container container-narrow" style={{ padding: "64px 24px 120px", maxWidth: 640 }}>
      <span className="eyebrow">Weekly AI visibility alerts</span>
      <Suspense fallback={<p style={{ marginTop: 20 }}>Loading…</p>}>
        <Body searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

const mask = (email: string) => email.replace(/^(.)[^@]*(@.*)$/, "$1•••$2");

function Message({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <>
      <h1 style={{ margin: "14px 0 0", fontSize: "clamp(28px,4.5vw,38px)", lineHeight: 1.12, letterSpacing: "-0.02em", fontWeight: 600 }}>{title}</h1>
      <div style={{ marginTop: 16, fontSize: 16.5, lineHeight: 1.65, color: "var(--color-text-softer)" }}>{children}</div>
    </>
  );
}

async function Body({ searchParams }: { searchParams: PageProps<"/ai-tools/monitor">["searchParams"] }) {
  const p = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const action = one(p.action);
  const done = one(p.done);
  const id = one(p.id);
  const host = HOSTNAME_PATTERN.test(one(p.host)) ? one(p.host) : null;

  if (done === "confirmed" && host)
    return (
      <Message title="You're watching it">
        <p>We&rsquo;ll check {host} every Monday and email you only when something changes. Every email has a link to stop them.</p>
        <p><Link href={`/ai-tools/report/${host}`}>See the current report →</Link></p>
      </Message>
    );
  if (done === "unsubscribed")
    return (
      <Message title="Alerts stopped">
        <p>You won&rsquo;t get any more alerts{host ? ` for ${host}` : ""}.</p>
        <p><Link href="/ai-tools">Back to the free AI tools</Link></p>
      </Message>
    );

  if (!monitorEnabled()) return <Message title="Alerts aren't available right now">Please try again later.</Message>;

  const sub = id ? await getSubscription(id) : null;
  if (!sub || (action !== "confirm" && action !== "unsubscribe"))
    return (
      <Message title="This link has expired">
        <p>Confirmation links last 48 hours. You can sign up again from any <Link href="/ai-tools">AI visibility report</Link>.</p>
      </Message>
    );

  if (action === "confirm") {
    return sub.status === "active" ? (
      <Message title="Already confirmed">
        <p>{sub.host} is already being watched for {mask(sub.email)}.</p>
      </Message>
    ) : (
      <Message title={`Confirm alerts for ${sub.host}`}>
        <p>We&rsquo;ll check {sub.host} every Monday and email {mask(sub.email)} only when something changes.</p>
        <form action={confirmAction} style={{ marginTop: 20 }}>
          <input type="hidden" name="id" value={sub.id} />
          <button type="submit" className="btn btn-primary">Confirm weekly alerts</button>
        </form>
      </Message>
    );
  }

  return (
    <Message title={`Stop alerts for ${sub.host}?`}>
      <p>{mask(sub.email)} won&rsquo;t get any more alerts about {sub.host}.</p>
      <form action={unsubscribeAction} style={{ marginTop: 20 }}>
        <input type="hidden" name="id" value={sub.id} />
        <button type="submit" className="btn btn-dark">Stop alerts</button>
      </form>
    </Message>
  );
}
