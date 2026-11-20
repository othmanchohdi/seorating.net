"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

export function CopyButton({
  text,
  label = "Copy",
  className = "copy-btn",
  onCopied,
  trackCheck,
}: {
  text: string;
  label?: string;
  className?: string;
  onCopied?: () => void;
  // Report check id, to record which fixes people copy.
  trackCheck?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          onCopied?.();
          if (trackCheck) track("fix_copied", { check: trackCheck });
          setTimeout(() => setCopied(false), 1800);
        });
      }}
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
