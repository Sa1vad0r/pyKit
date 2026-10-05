"use client";

import { python } from "@codemirror/lang-python";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import CodeMirror from "@uiw/react-codemirror";

const EXTENSIONS = [python()];

export default function CodeEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800">
      <CodeMirror
        value={value}
        onChange={onChange}
        theme={tokyoNight}
        extensions={EXTENSIONS}
        height="18rem"
        basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: true }}
        className="text-sm"
      />
    </div>
  );
}
