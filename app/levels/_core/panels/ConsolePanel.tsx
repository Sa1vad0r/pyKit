"use client";

import { useEffect, useRef, type Ref } from "react";

export default function ConsolePanel({ logs, ref }: { logs: string[]; ref?: Ref<HTMLDivElement> }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the newest line in view
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  return (
    <div ref={ref} className="flex min-h-[160px] flex-1 flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-xl">
      <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">System Console / Logs</span>
      <div ref={scrollRef} className="max-h-[200px] flex-1 space-y-1 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300">
        {logs.length === 0 && <span className="text-zinc-600">No logs yet...</span>}
        {logs.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
}
