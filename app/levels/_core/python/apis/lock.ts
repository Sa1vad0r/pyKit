import { ApiError } from "../runtime/errors";
import { defineApi } from "./defineApi";

export default defineApi({
  name: "lock",
  kind: "function",
  signature: "lock(i: int)",
  docs: "Locks dial `i` (0 is the first dial). If the key doesn't match the code, it's a misfire. Too many misfires trips the alarm.",
  call(ctx, i) {
    const dial = Number(i);
    if (!Number.isInteger(dial)) throw new ApiError(`lock() needs a whole number like lock(0), not ${String(i)}.`);
    ctx.record("lock", dial);
  },
});
