import { cameraCells } from "../pieces";
import type { MazeMission } from "../schema";
import { parseMap } from "./parseMap";
import type { Camera, Cell, Item, MazeLevel } from "./types";

export const isOpenCell = (grid: Cell[][], x: number, y: number) => {
  const cell = grid[y]?.[x];
  return cell === 1 || cell === 2;
};

/** Turns a mission's map + pieces into the engine's starting level. Throws on bad placement. */
export function buildMazeLevel(mission: MazeMission): MazeLevel {
  const { grid, start } = parseMap(mission.map);
  const items: Item[] = [];
  const cameras: Camera[] = [];

  for (const piece of mission.pieces) {
    if (!isOpenCell(grid, piece.x, piece.y)) {
      throw new Error(`${mission.card.name}: ${piece.kind} at (${piece.x}, ${piece.y}) is on a wall.`);
    }
    if (piece.kind === "loot") {
      items.push({ id: items.length + 1, x: piece.x, y: piece.y, collected: false });
    } else {
      cameras.push({ id: `cam${cameras.length + 1}`, x: piece.x, y: piece.y, direction: piece.direction, range: piece.range });
    }
  }

  const vision = new Set<string>();
  const open = (x: number, y: number) => isOpenCell(grid, x, y);
  for (const cam of cameras) for (const c of cameraCells(cam, open)) vision.add(`${c.x},${c.y}`);

  return { grid, start, items, cameras, vision };
}

export const freshItems = (level: MazeLevel): Item[] => level.items.map((i) => ({ ...i }));
