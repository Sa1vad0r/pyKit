import { MAX_API_CALLS, SCRIPT_FILENAME } from "../config";
import { resolveApis } from "../apis";
import type { ApiContext } from "../apis/defineApi";
import type { ApiCall, PyProxy, PyodideAPI, RunOptions, RunResult } from "../types";
import { ApiError, formatPythonError } from "./errors";

// stdout/stderr are wired once per instance and routed to whichever run is active.
// Runs are sequential (one per level at a time), so a single sink is enough.
let sink: ((line: string) => void) | null = null;
const wired = new WeakSet<PyodideAPI>();

function wireOutput(py: PyodideAPI) {
  if (wired.has(py)) return;
  py.setStdout({ batched: (line) => sink?.(line) });
  py.setStderr({ batched: (line) => sink?.(line) });
  wired.add(py);
}

/**
 * Runs a student script in a fresh namespace (nothing leaks between runs),
 * with only the level's APIs and variables defined. Never throws: errors come
 * back as a student-facing string in `result.error`.
 */
export async function runPython(py: PyodideAPI, code: string, { apis, vars = {} }: RunOptions): Promise<RunResult> {
  wireOutput(py);

  const calls: ApiCall[] = [];
  const output: string[] = [];
  const ctx: ApiContext = {
    record(api, ...args) {
      if (calls.length >= MAX_API_CALLS) {
        throw new ApiError(`Stopped after ${MAX_API_CALLS} calls. Is there a loop that never ends?`);
      }
      calls.push({ api, args });
    },
  };

  const scope = py.globals.get("dict")();
  for (const def of resolveApis(apis)) {
    const call = def.call;
    if (call) scope.set(def.name, (...args: unknown[]) => call(ctx, ...args));
  }
  for (const [name, value] of Object.entries(vars)) {
    const pyValue = py.toPy(value);
    scope.set(name, pyValue);
    (pyValue as Partial<PyProxy> | null)?.destroy?.();
  }

  sink = (line) => output.push(line);
  try {
    await py.runPythonAsync(code, { globals: scope, filename: SCRIPT_FILENAME });
    return { calls, output, error: null };
  } catch (err) {
    return { calls, output, error: formatPythonError(err) };
  } finally {
    sink = null;
    scope.destroy();
  }
}
