import { ApiError } from "../runtime/errors";
import { defineApi } from "./defineApi";

const DIRECTIONS = ["UP", "DOWN", "LEFT", "RIGHT"];

export default defineApi({
  name: "move",
  kind: "function",
  signature: "move(direction: str)",
  docs: 'Moves the player one tile. `direction` is one of `"UP"`, `"DOWN"`, `"LEFT"`, `"RIGHT"`. Blocked by walls, collects items automatically, and triggers the alarm if a camera sees the tile.',
  call(ctx, direction) {
    const dir = typeof direction === "string" ? direction.toUpperCase() : "";
    if (!DIRECTIONS.includes(dir)) {
      throw new ApiError(`move() needs "UP", "DOWN", "LEFT" or "RIGHT", not ${JSON.stringify(direction) ?? String(direction)}.`);
    }
    ctx.record("move", dir);
  },
});
