import { SCRIPT_FILENAME } from "../config";

const API_MARKER = "[api] ";

/** Throw from an API's call() to show the student a plain message instead of a JS stack. */
export class ApiError extends Error {
  constructor(message: string) {
    super(API_MARKER + message);
  }
}

const LINE_RE = new RegExp(`File "${SCRIPT_FILENAME.replace(".", "\\.")}", line (\\d+)`, "g");
const API_RE = /\[api\] (.+)/;

/** Turns a Pyodide traceback into "Line 3: NameError: name 'x' is not defined". */
export function formatPythonError(err: unknown): string {
  const text = String(err instanceof Error ? err.message : err);
  const lines = [...text.matchAll(LINE_RE)];
  const lineNo = lines.length ? lines[lines.length - 1][1] : null;

  const apiMessage = text.match(API_RE)?.[1];
  const lastLine = text.trim().split("\n").filter(Boolean).pop() ?? text;
  const message = apiMessage ?? lastLine.trim();

  return lineNo ? `Line ${lineNo}: ${message}` : message;
}
