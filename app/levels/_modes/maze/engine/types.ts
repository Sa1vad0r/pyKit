export type Cell = 0 | 1 | 2; // 0 wall · 1 floor · 2 exit
export type Pos = { x: number; y: number };
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export interface Item {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

export interface Camera {
  id: string;
  x: number;
  y: number;
  direction: Direction;
  range: number;
}

export const DIR_DELTA: Record<Direction, [number, number]> = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
};

/** Everything the engine needs, built once from a mission (see engine/level.ts). */
export interface MazeLevel {
  grid: Cell[][];
  start: Pos;
  items: Item[];
  cameras: Camera[];
  /** "x,y" keys of every tile a camera can see. */
  vision: Set<string>;
}
