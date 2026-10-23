import type { Cell, Pos } from "./types";

/**
 * Map legend:
 *   #  wall
 *   .  floor
 *   S  start (floor)
 *   E  exit
 * Every row must be the same width. Loot and cameras are placed with
 * `pieces` in the mission, not in the map.
 */
export function parseMap(map: string): { grid: Cell[][]; start: Pos } {
  const rows = map.split("\n").map((r) => r.trimEnd()).filter((r) => r.trim() !== "");
  if (rows.length === 0) throw new Error("Maze map is empty.");

  const width = rows[0].length;
  let start: Pos | null = null;
  let exits = 0;

  const grid = rows.map((row, y) => {
    if (row.length !== width) throw new Error(`Maze map row ${y} is ${row.length} wide, expected ${width}.`);
    return [...row].map((ch, x): Cell => {
      switch (ch) {
        case "#":
          return 0;
        case ".":
          return 1;
        case "S":
          if (start) throw new Error(`Maze map has more than one start (S) — second at (${x}, ${y}).`);
          start = { x, y };
          return 1;
        case "E":
          exits++;
          return 2;
        default:
          throw new Error(`Unknown maze map character "${ch}" at (${x}, ${y}). Use # . S E`);
      }
    });
  });

  if (!start) throw new Error("Maze map needs a start tile (S).");
  if (exits === 0) throw new Error("Maze map needs at least one exit (E).");
  return { grid, start };
}
