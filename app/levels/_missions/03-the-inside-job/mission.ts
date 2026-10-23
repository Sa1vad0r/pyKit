import { defineVault } from "../../_modes/vault/schema";
import starter from "./starter";
import tutorial from "./tutorial";

export default defineVault({
  card: {
    number: 3,
    name: "The Inside Job",
    description: "Lift the code off the guard's terminal.",
    difficulty: "Advanced",
    category: "Cracking",
    current: 1,
    total: 8,
  },
  title: "Vault Code Heist",
  subtitle: "The keypad scrambles every second. Write if-statements that lock each dial only when its key matches the code.",
  accent: "amber",
  editorLabel: "Python Safecracking Code",
  runningLabel: "Cracking...",
  resetLabel: "New Vault",
  dials: 4,
  seconds: 20,
  strikes: 3,
  stepSizes: [1, 3, 7, 9],
  firstRound: { code: [4, 7, 2, 9], offsets: [0, 3, 5, 8], steps: [1, 3, 7, 9] },
  apis: ["keys", "code", "lock", "locked", "tick", "print"],
  starter,
  tutorial,
  // Lil reads each as "psst** try <hint>"
  hints: [
    "print(keys) and watch the console, the keypad changes every second",
    "copying the dial 0 check for dials 1, 2 and 3, just change the number",
    "a for loop over every dial: for i in range(4):",
    'checking "and not locked[i]" too, so you never re-lock a finished dial',
  ],
});
