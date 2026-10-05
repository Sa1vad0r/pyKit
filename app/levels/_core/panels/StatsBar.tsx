import type { ReactNode } from "react";

/** The row of counters above a board (Moves, Items, Time, ...). */
export function StatsBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full max-w-lg items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-3 shadow-md">
      {children}
    </div>
  );
}

export function Stat({ label, children, valueClass = "text-emerald-400" }: { label: string; children: ReactNode; valueClass?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase text-zinc-400">{label}:</span>
      <span className={`font-mono text-lg font-bold ${valueClass}`}>{children}</span>
    </div>
  );
}
