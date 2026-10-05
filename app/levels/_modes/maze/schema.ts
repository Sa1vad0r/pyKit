import type { MissionBase } from "../../_core/mission";
import type { BoardTheme } from "./boards";
import type { MazePiece } from "./pieces";

export interface MazeMission extends MissionBase {
  mode: "maze";
  /** ASCII map, see engine/parseMap.ts for the legend. */
  map: string;
  pieces: MazePiece[];
  /** Board look. Defaults to "arcade". */
  board?: BoardTheme;
}

export const defineMaze = (mission: Omit<MazeMission, "mode">): MazeMission => ({ ...mission, mode: "maze" });
