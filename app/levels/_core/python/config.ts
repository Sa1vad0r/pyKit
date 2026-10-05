// ============================================================================
// 🐍 PYTHON RUNTIME CONFIG — the one place to change how student code runs.
// ----------------------------------------------------------------------------
// Pyodide is self-hosted in /public/pyodide (Pyodide 314.0.7 → Python 3.14).
// To upgrade: replace that folder with a newer Pyodide "full" build. Nothing
// else needs to change.
// ============================================================================

export const PYODIDE_INDEX_URL = "/pyodide/";
export const PYODIDE_SCRIPT_URL = `${PYODIDE_INDEX_URL}pyodide.js`;

/** Student code runs under this file name, so errors can say "Line 3: ...". */
export const SCRIPT_FILENAME = "main.py";

/**
 * A run that calls level APIs (move, lock, ...) more often than this is
 * stopped. Catches runaway loops like `while True: move("UP")`.
 */
export const MAX_API_CALLS = 1000;
