"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { recheckReport } from "@/app/ai-tools/report/actions";
import { track } from "@/lib/analytics";

export function RecheckButton({ host }: { host: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setMessage(null);
            const result = await recheckReport(host);
            if (!result.ok) return setMessage(result.message);
            track("report_rechecked");
            router.refresh();
          })
        }
      >
        {pending ? "Re-checking…" : "Re-check now"}
      </button>
      {message && (
        <span role="status" style={{ fontSize: 13, color: "var(--color-text-faint)" }}>
          {message}
        </span>
      )}
    </span>
  );
}
