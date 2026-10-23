import { DIR_DELTA, type Camera, type Direction, type Pos } from "../engine/types";

/** A fixed camera. Stepping on any tile it can see trips the alarm. */
export interface CameraPiece {
  kind: "camera";
  x: number;
  y: number;
  direction: Direction;
  range: number;
}

export const camera = (x: number, y: number, direction: Direction, range = 3): CameraPiece => ({
  kind: "camera",
  x,
  y,
  direction,
  range,
});

/** Open tiles a camera sees, starting with its own tile. Walls block the view. */
export function cameraCells(cam: Camera, isOpen: (x: number, y: number) => boolean): Pos[] {
  const [dx, dy] = DIR_DELTA[cam.direction];
  const cells: Pos[] = [];
  for (let i = 0; i < cam.range; i++) {
    const x = cam.x + dx * i;
    const y = cam.y + dy * i;
    if (!isOpen(x, y)) break;
    cells.push({ x, y });
  }
  return cells;
}
