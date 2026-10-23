import { defineMaze } from "../../_modes/maze/schema";
import { loot } from "../../_modes/maze/pieces";
import map from "./map";
import starter from "./starter";
import tutorial from "./tutorial";

export default defineMaze({
  card: {
    number: 1,
    name: "The Casing",
    description: "Scope the place out. Variables 101.",
    difficulty: "Beginner",
    category: "Tutorial",
    current: 5,
    total: 5,
  },
  title: "Casing the Joint",
  subtitle: "Walk the hallway, grab all 3 money bags, and reach the exit!",
  accent: "emerald",
  editorLabel: "Python Navigation Code",
  map,
  pieces: [loot(4, 1), loot(5, 1), loot(6, 1)],
  board: "arcade",
  apis: ["move", "print"],
  starter,
  tutorial,
  // Lil reads each as "psst** try <hint>"
  hints: [
    'move("RIGHT") a few more times, the exit is at the end of the hallway',
    "counting the tiles: you need 8 moves to the RIGHT to reach the exit",
    'a for loop so you only write it once: for _ in range(8): move("RIGHT")',
  ],
});
