import type { Ref } from "react";
import type { ApiDef } from "../python/apis";

/** Renders `backticks` in API docs as inline code. */
function Docs({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="text-zinc-300">
            {part}
          </code>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function ApiReference({ apis, accentText, ref }: { apis: ApiDef[]; accentText: string; ref?: Ref<HTMLDivElement> }) {
  const hasVariables = apis.some((a) => a.kind === "variable");
  return (
    <div ref={ref} className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-xl">
      <h2 className={`mb-1 text-sm font-semibold uppercase tracking-wider ${accentText}`}>Available APIs</h2>
      <p className="mb-4 text-xs text-zinc-500">
        {hasVariables ? "Variables and functions" : "Functions"} your Python code can use in this level.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apis.map((api) => (
          <div key={api.name} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <code className={`font-mono text-sm font-semibold ${accentText}`}>{api.signature}</code>
            <p className="mt-1 text-xs text-zinc-400">
              <Docs text={api.docs} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
