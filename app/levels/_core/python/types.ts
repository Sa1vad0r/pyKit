/** The slice of Pyodide's API this runtime uses. */
export interface PyProxy {
  set(name: string, value: unknown): void;
  destroy(): void;
}

export interface PyodideAPI {
  globals: { get(name: string): (...args: unknown[]) => PyProxy };
  runPythonAsync(code: string, options?: { globals?: PyProxy; filename?: string }): Promise<unknown>;
  setStdout(options: { batched: (line: string) => void }): void;
  setStderr(options: { batched: (line: string) => void }): void;
  toPy(value: unknown): unknown;
}

export type PythonStatus = "loading" | "ready" | "error";

/** One call the student's script made to a level API, e.g. move("UP"). */
export interface ApiCall {
  api: string;
  args: unknown[];
}

export interface RunOptions {
  /** Registry names of the APIs this level exposes (see apis/index.ts). */
  apis: string[];
  /** Plain values made available as Python variables, e.g. { keys: [1, 2] }. */
  vars?: Record<string, unknown>;
}

export interface RunResult {
  /** Every API call, in order. Levels play these back on the board. */
  calls: ApiCall[];
  /** Lines the script printed. */
  output: string[];
  /** Student-facing error ("Line 3: NameError: ..."), or null if the script finished. */
  error: string | null;
}
