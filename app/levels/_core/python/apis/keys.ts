import { defineApi } from "./defineApi";

export default defineApi({
  name: "keys",
  kind: "variable",
  signature: "keys",
  docs: "List of the digits on the keypad right now. It changes every second, so `keys[0]` is the first dial.",
});
