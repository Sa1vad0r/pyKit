import type { Ref } from "react";

/** The digits the player must match, highlighting dials that match or are locked. */
export default function TargetCode({ code, keys, locked, ref }: { code: number[]; keys: number[]; locked: boolean[]; ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-3 shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Target code</span>
        <span className="text-xs text-zinc-500">
          <code className="text-amber-400">code</code> in your script
        </span>
      </div>
      <div className="flex justify-center gap-3">
        {code.map((digit, i) => {
          const isLocked = locked[i];
          const isMatch = !isLocked && keys[i] === digit;
          return (
            <div
              key={i}
              className={`flex h-14 w-12 flex-col items-center justify-center rounded-lg border-2 font-mono transition-colors ${
                isLocked
                  ? "border-emerald-500 bg-emerald-950/60 text-emerald-300"
                  : isMatch
                    ? "match-pulse border-amber-400 bg-amber-950/40 text-amber-300"
                    : "border-zinc-700 bg-zinc-950 text-zinc-200"
              }`}
            >
              <span className="text-2xl font-bold leading-none">{digit}</span>
              <span className="mt-1 text-[10px] text-zinc-500">code[{i}]</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
