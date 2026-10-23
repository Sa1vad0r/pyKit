import { isOpenCell } from "./level";
import { DIR_DELTA, type Direction, type Item, type MazeLevel, type Pos } from "./types";

export interface MazeState {
  pos: Pos;
  items: Item[];
  moves: number;
}

export type StepResult =
  | { type: "blocked"; x: number; y: number }
  | { type: "moved"; state: MazeState; collected: Item | null; done: "won" | "caught" | "exit-locked" | null };

/** Applies one move. Pure: returns the next state instead of changing it. */
export function step(level: MazeLevel, state: MazeState, dir: Direction): StepResult {
  const [dx, dy] = DIR_DELTA[dir];
  const x = state.pos.x + dx;
  const y = state.pos.y + dy;

  // Blocked moves don't count
  if (!isOpenCell(level.grid, x, y)) return { type: "blocked", x, y };

  const hit = state.items.find((i) => !i.collected && i.x === x && i.y === y) ?? null;
  const items = hit ? state.items.map((i) => (i.id === hit.id ? { ...i, collected: true } : i)) : state.items;
  const next: MazeState = { pos: { x, y }, items, moves: state.moves + 1 };

  let done: "won" | "caught" | "exit-locked" | null = null;
  if (level.vision.has(`${x},${y}`)) done = "caught";
  else if (level.grid[y][x] === 2) done = items.every((i) => i.collected) ? "won" : "exit-locked";

  return { type: "moved", state: next, collected: hit, done };
}
