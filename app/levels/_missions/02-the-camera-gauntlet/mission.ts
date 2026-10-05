import { defineMaze } from "../../_modes/maze/schema";
import { camera, loot } from "../../_modes/maze/pieces";
import map from "./map";
import starter from "./starter";
import tutorial from "./tutorial";

export default defineMaze({
  card: {
    number: 2,
    name: "The Camera Gauntlet",
    description: "Dodge three cameras, bag three diamonds.",
    difficulty: "Intermediate",
    category: "Infiltration",
    current: 3,
    total: 6,
  },
  title: "Security Maze Infiltration",
  subtitle: "Navigate past camera vision cones, collect all 3 items, and reach the exit!",
  accent: "emerald",
  editorLabel: "Python Navigation Code",
  map,
  pieces: [
    loot(5, 1),
    loot(7, 7),
    loot(1, 9),
    camera(3, 1, "DOWN", 3),
    camera(9, 5, "DOWN", 3),
    camera(7, 3, "RIGHT", 3),
  ],
  board: "arcade", // try "night-vault", "blueprint", "cardboard" or "classic"
  apis: ["move", "print"],
  starter,
  tutorial,
  // Lil reads each as "psst** try <hint>"
  hints: [
    "going DOWN first, the camera two tiles to your RIGHT is watching that hallway",
    "cutting across the wide row near the middle to reach the column with the first bag",
    'a for loop to repeat moves, like for _ in range(4): move("UP")',
    "grabbing the bottom-left bag last, then walking RIGHT along the bottom row to the exit",
  ],
});
