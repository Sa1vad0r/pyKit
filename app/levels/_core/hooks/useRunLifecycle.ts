"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Run bookkeeping every mode needs: one run at a time, cancel on reset or
 * unmount, and a timer for the "failed, back to the start" auto-reset.
 */
export function useRunLifecycle() {
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);
  const runIdRef = useRef(0);
  const mountedRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const runId = runIdRef;
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      runId.current++; // cancels any in-flight run
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /** Stops any in-flight run and any pending auto-reset. */
  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    runIdRef.current++;
    runningRef.current = false;
    setRunning(false);
  }, []);

  /** Starts a run. Returns isCancelled() for the run loop to check after each await, or null if a run is already going. */
  const begin = useCallback(() => {
    if (runningRef.current) return null;
    runningRef.current = true;
    setRunning(true);
    const id = ++runIdRef.current;
    return () => runIdRef.current !== id || !mountedRef.current;
  }, []);

  const end = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
  }, []);

  /** Calls fn after ms unless the run is cancelled or the level unmounts first. */
  const after = useCallback((ms: number, fn: () => void) => {
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      if (mountedRef.current) fn();
    }, ms);
  }, []);

  return { running, begin, end, cancel, after };
}

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
