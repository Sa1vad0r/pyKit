import { defineApi } from "./defineApi";

export default defineApi({
  name: "code",
  kind: "variable",
  signature: "code",
  docs: "List of the digits you must match. Compare it to `keys` with `==`.",
});
