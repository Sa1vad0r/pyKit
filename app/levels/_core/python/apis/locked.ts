import { defineApi } from "./defineApi";

export default defineApi({
  name: "locked",
  kind: "variable",
  signature: "locked",
  docs: "`locked[i]` is `True` once dial `i` is locked.",
});
