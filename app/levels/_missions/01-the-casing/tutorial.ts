import type { TutorialStepDef } from "../../_core/mission";

export default [
  {
    target: "editor",
    title: "Write your navigation code",
    body: 'This is your Python editor. Call move("UP"/"DOWN"/"LEFT"/"RIGHT") to plan a path through the maze before running it.',
    placement: "right",
  },
  {
    target: "run",
    title: "Run your code",
    body: "Once the Python runtime shows ready, click here to execute your script and watch the player move step by step.",
    placement: "bottom",
  },
  {
    target: "console",
    title: "Watch the console",
    body: "Collisions, item pickups, and alarms are all logged here, along with anything your script prints.",
    placement: "right",
  },
  {
    target: "board",
    title: "The path",
    body: "Grab all 3 items, then reach the green EXIT tile.",
    placement: "left",
  },
  {
    target: "apis",
    title: "Available APIs",
    body: "This reference lists every function your Python code can call in this level, plus what it does.",
    placement: "top",
  },
] satisfies TutorialStepDef[];
