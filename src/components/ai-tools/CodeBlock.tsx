import { CopyButton } from "./CopyButton";

export function CodeBlock({ label, code, trackCheck }: { label: string; code: string; trackCheck?: string }) {
  return (
    <div className="code-panel">
      <div className="code-panel-head">
        <span>{label}</span>
        <CopyButton text={code} trackCheck={trackCheck} />
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
