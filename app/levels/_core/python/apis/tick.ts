import { defineApi } from "./defineApi";

export default defineApi({
  name: "tick",
  kind: "variable",
  signature: "tick",
  docs: "The current second of the run, starting at `0`.",
});
