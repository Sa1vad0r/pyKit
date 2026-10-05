import type { MissionBase } from "../../_core/mission";
import type { Round } from "./engine/dials";

export interface VaultMission extends MissionBase {
  mode: "vault";
  /** Number of dials. The door artwork is drawn for 4. */
  dials: number;
  /** Seconds the player gets; the script re-runs once per second. */
  seconds: number;
  /** Wrong lock() calls before the alarm trips. */
  strikes: number;
  /** How far a dial can jump per second. Use values coprime with 10 (1, 3, 7, 9) so every digit shows up within 10 seconds. */
  stepSizes: number[];
  /** The first vault the player sees; "New Vault" rolls random ones after that. */
  firstRound: Round;
}

export const defineVault = (mission: Omit<VaultMission, "mode">): VaultMission => ({ ...mission, mode: "vault" });
