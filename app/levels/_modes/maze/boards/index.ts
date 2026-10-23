import type { ComponentType } from "react";
import ArcadeBoard from "./ArcadeBoard";
import BlueprintBoard from "./BlueprintBoard";
import CardboardBoard from "./CardboardBoard";
import ClassicBoard from "./ClassicBoard";
import NightVaultBoard from "./NightVaultBoard";
import type { HeistBoardProps } from "./shared";

// ============================================================================
// 🎨 BOARD THEMES — a maze mission picks one with `board: "<name>"`.
// Every theme takes the same HeistBoardProps, so any maze mission can use any
// theme. To add one: make a component here and register it below.
// ============================================================================
export const BOARD_THEMES = {
  arcade: { label: "Arcade", Board: ArcadeBoard }, // levels 1 + 2 as shipped (default)
  classic: { label: "Classic", Board: ClassicBoard }, // slate terminal tiles
  "night-vault": { label: "Night Vault", Board: NightVaultBoard }, // dark slate, guards w/ cones
  blueprint: { label: "Blueprint", Board: BlueprintBoard }, // hand-drawn heist plan
  cardboard: { label: "Cardboard", Board: CardboardBoard }, // sticker / cardboard-box style
} satisfies Record<string, { label: string; Board: ComponentType<HeistBoardProps> }>;

export type BoardTheme = keyof typeof BOARD_THEMES;

export const DEFAULT_BOARD: BoardTheme = "arcade";

export type { HeistBoardProps } from "./shared";
