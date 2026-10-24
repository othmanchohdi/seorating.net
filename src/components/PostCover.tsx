import type { Post } from "@/content/blog";

// CSS-only cover art: a code panel on the brand green. No image bytes to
// download, so covers never hurt LCP.
export function PostCover({ post, size = "md" }: { post: Pick<Post, "cover">; size?: "sm" | "md" | "lg" }) {
  const pad = size === "lg" ? 32 : size === "md" ? 24 : 18;
  return (
    <div className="cover" style={{ padding: pad, height: "100%" }} aria-hidden="true">
      <div
        aria-hidden="true"
        style={{ position: "absolute", right: -80, top: -80, width: 260, height: 260, borderRadius: 999, border: "1px solid rgba(255,255,255,0.14)" }}
      />
      <div
        className="code-panel"
        style={{ position: "relative", width: "100%", maxWidth: size === "sm" ? 300 : 360, boxShadow: "0 24px 48px -20px rgba(0,0,0,0.5)" }}
      >
        <div className="code-panel-head">
          <span>{post.cover.file}</span>
        </div>
        <pre style={{ fontSize: size === "sm" ? 11.5 : 12.5 }}>
          {post.cover.lines.map((l, i) => (
            <span key={i} className={l.startsWith("#") ? "c-h" : l.startsWith(">") ? "c-q" : undefined}>
              {l || " "}
              {"\n"}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}
