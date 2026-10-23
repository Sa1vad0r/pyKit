import { MISSIONS } from "../levels/_missions";

export interface LevelData {
  levelNumber: number;
  name: string;
  description: string;
  current: number;
  total: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category: string;
  /** Route for the level, or null if it has no playable page yet. */
  href: string | null;
  locked?: boolean;
}

/** Cards for levels that aren't built yet. Playable levels come from app/levels/_missions. */
const UPCOMING: LevelData[] = [
  {
    levelNumber: 4,
    name: "The Vault",
    description: "The big one. Crack the cipher before the cops show.",
    current: 0,
    total: 10,
    difficulty: "Expert",
    category: "Heist",
    href: null,
    locked: true,
  },
];

export const initialLevels: LevelData[] = [
  ...MISSIONS.map(({ card }) => ({
    levelNumber: card.number,
    name: card.name,
    description: card.description,
    current: card.current,
    total: card.total,
    difficulty: card.difficulty,
    category: card.category,
    href: `/levels/${card.number}`,
  })),
  ...UPCOMING,
];
