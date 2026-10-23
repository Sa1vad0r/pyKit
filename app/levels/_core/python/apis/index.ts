// ============================================================================
// 🐍 PYTHON API REGISTRY — every function/variable a level can expose.
// ----------------------------------------------------------------------------
// To add one: create a file next to this one with defineApi(), add it to the
// list below, then list its name in a mission's `apis`. The API reference
// panel and the editor hint read from these definitions automatically.
// ============================================================================
import code from "./code";
import type { ApiDef } from "./defineApi";
import keys from "./keys";
import lock from "./lock";
import locked from "./locked";
import move from "./move";
import print from "./print";
import tick from "./tick";

const ALL: ApiDef[] = [move, lock, print, keys, code, locked, tick];

export const API_REGISTRY: Record<string, ApiDef> = Object.fromEntries(ALL.map((api) => [api.name, api]));

export function resolveApis(names: string[]): ApiDef[] {
  return names.map((name) => {
    const def = API_REGISTRY[name];
    if (!def) throw new Error(`Unknown Python API "${name}". Add it to app/levels/_core/python/apis/index.ts.`);
    return def;
  });
}

export type { ApiDef } from "./defineApi";
