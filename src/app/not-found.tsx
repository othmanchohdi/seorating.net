import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="container" style={{ padding: "clamp(64px,10vw,120px) 24px", textAlign: "center", maxWidth: 640 }}>
      <span className="eyebrow">404</span>
      <h1 className="h-section">This page isn&rsquo;t on the radar.</h1>
      <p className="body">The link may be old, or the page may have moved. These are good places to pick up from:</p>
      <div className="cta-row" style={{ justifyContent: "center" }}>
        <Link href="/" className="btn btn-primary">
          Home
        </Link>
        <Link href="/blog" className="btn btn-secondary">
          Blog
        </Link>
        <Link href="/docs" className="btn btn-secondary">
          Docs
        </Link>
      </div>
    </section>
  );
}
