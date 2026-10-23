"use client";

import { getMission } from "../_missions";
import MazeMode from "./maze/MazeMode";
import VaultMode from "./vault/VaultMode";

/**
 * Looks a mission up and renders the mode that plays it. Runs on the client,
 * so missions can hold anything (functions, components), not just JSON.
 * New mode: add a case here and a schema.ts with its `mode` name.
 */
export default function MissionPlayer({ number }: { number: number }) {
  const mission = getMission(number);
  if (!mission) return null;

  switch (mission.mode) {
    case "maze":
      return <MazeMode key={number} mission={mission} />;
    case "vault":
      return <VaultMode key={number} mission={mission} />;
  }
}
