/** A collectible. Every loot piece must be picked up before the exit opens. */
export interface LootPiece {
  kind: "loot";
  x: number;
  y: number;
}

export const loot = (x: number, y: number): LootPiece => ({ kind: "loot", x, y });
