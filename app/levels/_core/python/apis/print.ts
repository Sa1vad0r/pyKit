import { defineApi } from "./defineApi";

export default defineApi({
  name: "print",
  kind: "function",
  signature: "print(value)",
  docs: "Standard Python `print()`. Output is captured and shown in the System Console after your script finishes running.",
});
