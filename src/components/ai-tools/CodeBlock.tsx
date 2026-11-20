import { CopyButton } from "./CopyButton";

export function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="code-panel">
      <div className="code-panel-head">
        <span>{label}</span>
        <CopyButton text={code} />
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
