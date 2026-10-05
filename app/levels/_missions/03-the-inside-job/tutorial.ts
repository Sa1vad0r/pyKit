import type { TutorialStepDef } from "../../_core/mission";

export default [
  {
    target: "code",
    title: "Your target code",
    body: "These are the four digits you have to match. In your script this is the list code, so code[0] is the first digit.",
    placement: "left",
  },
  {
    target: "vault",
    title: "The scrambling keypad",
    body: "Every dial on the vault changes every second. A dial glows amber when its key matches the code, and turns green once it is locked.",
    placement: "left",
  },
  {
    target: "editor",
    title: "Write your if-statements",
    body: "For each dial, check if keys[i] == code[i] and call lock(i) when they match. Four dials means four checks.",
    placement: "right",
  },
  {
    target: "run",
    title: "Crack the safe",
    body: "Run your script once the Python runtime is ready. It re-runs every second against the new keypad for 20 seconds.",
    placement: "bottom",
  },
  {
    target: "console",
    title: "Watch the console",
    body: "Locks, misfires, and anything your script prints show up here. Three misfires trips the alarm!",
    placement: "right",
  },
  {
    target: "apis",
    title: "Available APIs",
    body: "This reference lists every variable and function your Python code can use in this level.",
    placement: "top",
  },
] satisfies TutorialStepDef[];
