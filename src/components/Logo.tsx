// Inline SVG of the radar app icon: no extra request, crisp at any size.
export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <rect width="120" height="120" rx="26.5" fill="#0b1a14" />
      <g fill="none">
        <circle cx="60" cy="60" r="51.9" stroke="#2e3f38" strokeWidth="5.4" />
        <circle cx="60" cy="60" r="36.2" stroke="#63766d" strokeWidth="5.2" />
        <circle cx="60" cy="60" r="21.25" stroke="#e8fff4" strokeWidth="5.3" />
      </g>
      <circle cx="60" cy="60" r="6" fill="#52f184" />
    </svg>
  );
}
