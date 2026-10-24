import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS ignores SVG icons, so render the radar mark to PNG at build time.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b1a14" }}>
        <svg width="180" height="180" viewBox="0 0 120 120">
          <rect width="120" height="120" fill="#0b1a14" />
          <circle cx="60" cy="60" r="51.9" stroke="#2e3f38" strokeWidth="5.4" fill="none" />
          <circle cx="60" cy="60" r="36.2" stroke="#63766d" strokeWidth="5.2" fill="none" />
          <circle cx="60" cy="60" r="21.25" stroke="#e8fff4" strokeWidth="5.3" fill="none" />
          <circle cx="60" cy="60" r="6" fill="#52f184" />
        </svg>
      </div>
    ),
    size,
  );
}
