/** Fields every mission has, whatever its mode. Each mode's schema.ts extends this. */

export type Accent = "emerald" | "amber";

/** Feeds the home-page level card and the navbar. */
export interface MissionCard {
  number: number;
  name: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category: string;
  /** Progress shown on the card (not tracked yet). */
  current: number;
  total: number;
}

export interface TutorialStepDef {
  /** "editor" | "run" | "console" | "apis", or a target the mode adds (e.g. "board"). */
  target: string;
  title: string;
  body: string;
  placement?: "top" | "bottom" | "left" | "right";
}

export interface MissionBase {
  card: MissionCard;
  /** Page header. */
  title: string;
  subtitle: string;
  accent: Accent;
  editorLabel: string;
  starter: string;
  /** Python APIs this mission exposes, by registry name (see _core/python/apis). */
  apis: string[];
  tutorial: TutorialStepDef[];
  /** Optional hints from Lil, shown in the corner. */
  hints?: string[];
  runLabel?: string;
  runningLabel?: string;
  resetLabel?: string;
}
