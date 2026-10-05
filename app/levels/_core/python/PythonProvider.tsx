"use client";

import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { loadPython } from "./runtime/load";
import { runPython } from "./runtime/run";
import type { PyodideAPI, PythonStatus, RunOptions, RunResult } from "./types";

export interface PythonContextValue {
  status: PythonStatus;
  run: (code: string, options: RunOptions) => Promise<RunResult>;
}

export const PythonContext = createContext<PythonContextValue | null>(null);

/**
 * Starts loading Python as soon as any level page mounts and keeps the one
 * instance alive while the player moves between levels.
 */
export function PythonProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<PythonStatus>("loading");
  const pyRef = useRef<PyodideAPI | null>(null);

  useEffect(() => {
    let alive = true;
    loadPython().then(
      (py) => {
        if (!alive) return;
        pyRef.current = py;
        setStatus("ready");
      },
      () => {
        if (alive) setStatus("error");
      }
    );
    return () => {
      alive = false;
    };
  }, []);

  const run = useCallback(async (code: string, options: RunOptions) => {
    const py = pyRef.current;
    if (!py) return { calls: [], output: [], error: "Python is still loading. Try again in a moment." };
    return runPython(py, code, options);
  }, []);

  const value = useMemo(() => ({ status, run }), [status, run]);
  return <PythonContext.Provider value={value}>{children}</PythonContext.Provider>;
}
