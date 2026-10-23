export interface ApiContext {
  /** Records a call for the level to play back, e.g. record("move", "UP"). */
  record(api: string, ...args: unknown[]): void;
}

export interface ApiDef {
  /** The Python name, e.g. "move". */
  name: string;
  kind: "function" | "variable";
  /** How it appears in the API reference, e.g. "move(direction: str)". */
  signature: string;
  /** Shown in the API reference. Wrap code in `backticks`. */
  docs: string;
  /**
   * Functions only: check the arguments, then ctx.record() the call.
   * Throw ApiError to show the student a plain message.
   * Builtins like print() leave this out.
   */
  call?: (ctx: ApiContext, ...args: unknown[]) => void;
}

export const defineApi = (def: ApiDef): ApiDef => def;
