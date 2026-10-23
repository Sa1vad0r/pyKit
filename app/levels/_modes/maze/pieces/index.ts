// ============================================================================
// 🧩 MAZE PIECES — things a maze mission can place on the grid.
// To add one (e.g. a laser): create pieces/laser.ts with a factory + type,
// add it to MazePiece below, handle it in engine/level.ts and engine/step.ts,
// and draw it in the boards.
// ============================================================================
import type { CameraPiece } from "./camera";
import type { LootPiece } from "./loot";

export type MazePiece = LootPiece | CameraPiece;

export { camera, cameraCells } from "./camera";
export { loot } from "./loot";
