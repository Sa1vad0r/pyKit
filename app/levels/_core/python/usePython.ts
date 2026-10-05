"use client";

import { useContext } from "react";
import { PythonContext, type PythonContextValue } from "./PythonProvider";

/** The only way levels talk to Python: { status, run(code, { apis, vars }) }. */
export function usePython(): PythonContextValue {
  const ctx = useContext(PythonContext);
  if (!ctx) throw new Error("usePython() must be used inside <PythonProvider> (see app/levels/layout.tsx).");
  return ctx;
}
