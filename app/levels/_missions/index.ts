// ============================================================================
// 🗺️ MISSIONS — every playable level, in order.
// ----------------------------------------------------------------------------
// New level: copy a mission folder that uses the mode you want, edit its
// mission.ts (and map.ts / starter.ts / tutorial.ts), then add it below.
// It gets a page at /levels/<card.number> and a card on the home page.
//
// Keep this file free of React components: the navbar imports it.
// ============================================================================
import type { MazeMission } from "../_modes/maze/schema";
import type { VaultMission } from "../_modes/vault/schema";
import theCasing from "./01-the-casing/mission";
import theCameraGauntlet from "./02-the-camera-gauntlet/mission";
import theInsideJob from "./03-the-inside-job/mission";

export type Mission = MazeMission | VaultMission;

export const MISSIONS: Mission[] = [theCasing, theCameraGauntlet, theInsideJob];

export const getMission = (number: number): Mission | undefined => MISSIONS.find((m) => m.card.number === number);
