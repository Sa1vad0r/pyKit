import { PYODIDE_INDEX_URL, PYODIDE_SCRIPT_URL } from "../config";
import type { PyodideAPI } from "../types";

// Typed locally: app/game declares its own global window.loadPyodide type.
type LoadPyodide = (options: { indexURL: string }) => Promise<PyodideAPI>;
const getLoader = () => (window as unknown as { loadPyodide?: LoadPyodide }).loadPyodide;

const SCRIPT_ID = "pyodide-script";

let pending: Promise<PyodideAPI> | null = null;

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
  });
}

/** Loads Pyodide once per tab. Every level shares the same instance. */
export function loadPython(): Promise<PyodideAPI> {
  if (pending) return pending;

  const load = (async () => {
    if (!getLoader()) await injectScript(PYODIDE_SCRIPT_URL);
    const loader = getLoader();
    if (!loader) throw new Error("pyodide.js loaded but loadPyodide() is missing.");
    return loader({ indexURL: PYODIDE_INDEX_URL });
  })();
  // Let the next caller retry after a failed load
  load.catch(() => {
    pending = null;
  });
  pending = load;
  return load;
}
