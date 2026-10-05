import type { ReactNode } from "react";
import { PythonProvider } from "./_core/python/PythonProvider";
import "./_core/styles/level-animations.css";

/** Shared by every level: one Python runtime that stays loaded between levels. */
export default function LevelsLayout({ children }: { children: ReactNode }) {
  return <PythonProvider>{children}</PythonProvider>;
}
