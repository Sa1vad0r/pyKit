"use client";

import { useCallback, useState } from "react";
import type { PythonStatus } from "../python/types";

const STATUS_LINES: Record<PythonStatus, string> = {
  loading: "Loading Python WebAssembly runtime...",
  ready: "Python runtime ready successfully!",
  error: "Failed to load Python runtime. Refresh the page to try again.",
};

/** Console log lines for a level, plus a line whenever the Python runtime changes state. */
export function useConsole(status: PythonStatus) {
  const [logs, setLogs] = useState<string[]>(() => [STATUS_LINES[status]]);
  const [lastStatus, setLastStatus] = useState(status);
  const log = useCallback((msg: string) => setLogs((prev) => [...prev, msg]), []);

  // Adjust state while rendering when the status prop changes (no effect needed)
  if (status !== lastStatus) {
    setLastStatus(status);
    setLogs((prev) => [...prev, STATUS_LINES[status]]);
  }

  return { logs, log };
}
