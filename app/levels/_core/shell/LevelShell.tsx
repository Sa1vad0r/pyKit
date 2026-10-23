"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import type { MissionBase } from "../mission";
import ApiReference from "../panels/ApiReference";
import CodeEditor from "../panels/CodeEditor";
import ConsolePanel from "../panels/ConsolePanel";
import { resolveApis } from "../python/apis";
import { usePython } from "../python/usePython";
import HintMascot from "../tutorial/HintMascot";
import TutorialOverlay, { type TutorialStep } from "../tutorial/TutorialOverlay";
import { ACCENTS } from "./accents";

interface LevelShellProps {
  mission: MissionBase;
  code: string;
  onCodeChange: (code: string) => void;
  logs: string[];
  running: boolean;
  /** A result banner is showing; Run waits until the level resets. */
  showingOutcome: boolean;
  onRun: () => void;
  onReset: () => void;
  /** Extra tutorial targets from the mode, e.g. { board: boardRef }. */
  targets?: Record<string, RefObject<HTMLElement | null>>;
  /** Right column: board, stats, banners. */
  children: ReactNode;
}

/**
 * The frame every level shares: header with Run / Reset / Help, editor and
 * console on the left, the mode's board on the right, API reference below,
 * and the spotlight tutorial (the level stays locked until it's finished).
 */
export default function LevelShell({
  mission,
  code,
  onCodeChange,
  logs,
  running,
  showingOutcome,
  onRun,
  onReset,
  targets,
  children,
}: LevelShellProps) {
  const { status } = usePython();
  const accent = ACCENTS[mission.accent];
  const apis = useMemo(() => resolveApis(mission.apis), [mission.apis]);

  const editorRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<HTMLButtonElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const apisRef = useRef<HTMLDivElement>(null);

  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialDone, setTutorialDone] = useState(false);

  // Start the tutorial after hydration (not during server render), once refs are attached
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time start on mount
    setTutorialActive(true);
  }, []);

  const finishTutorial = () => {
    setTutorialActive(false);
    setTutorialDone(true);
  };

  const tutorialSteps: TutorialStep[] = useMemo(() => {
    const refs: Record<string, RefObject<HTMLElement | null>> = {
      editor: editorRef,
      run: runRef,
      console: consoleRef,
      apis: apisRef,
      ...targets,
    };
    return mission.tutorial.map((step) => {
      const target = refs[step.target];
      if (!target) throw new Error(`Tutorial step "${step.title}" targets unknown "${step.target}".`);
      return { ...step, target };
    });
  }, [mission.tutorial, targets]);

  const runDisabled = status !== "ready" || !tutorialDone || running || showingOutcome;

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-zinc-950 p-4 text-zinc-100 md:p-8">
        <header className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-800 pb-4 md:flex-row md:items-center">
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${accent.text}`}>{mission.title}</h1>
            <p className="text-sm text-zinc-400">{mission.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300">
              {status === "loading" && "Loading Python runtime..."}
              {status === "ready" && "🟢 Python Runtime Ready"}
              {status === "error" && "🔴 Python Runtime Error"}
            </span>
            <button
              ref={runRef}
              onClick={onRun}
              disabled={runDisabled}
              className={`rounded-full px-5 py-2 text-sm font-semibold shadow-lg transition-all disabled:opacity-50 ${accent.run}`}
            >
              {running ? (mission.runningLabel ?? "Running...") : (mission.runLabel ?? "Run Code")}
            </button>
            <button
              onClick={onReset}
              disabled={running || !tutorialDone}
              className="rounded-full border border-zinc-700 bg-zinc-800 px-5 py-2 text-sm font-semibold text-zinc-200 transition-all hover:bg-zinc-700 disabled:opacity-50"
            >
              {mission.resetLabel ?? "Reset"}
            </button>
            <button
              onClick={() => setTutorialActive(true)}
              className="rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200 transition-all hover:bg-zinc-700"
              title="Replay tutorial"
            >
              ? Help
            </button>
          </div>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div ref={editorRef} className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-xl">
              <label className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">{mission.editorLabel}</label>
              <CodeEditor value={code} onChange={onCodeChange} />
              <div className="mt-2 text-xs text-zinc-500">
                Available:{" "}
                {apis.map((api, i) => (
                  <span key={api.name}>
                    {i > 0 && ", "}
                    <code className={accent.text}>{api.kind === "function" ? `${api.name}()` : api.name}</code>
                  </span>
                ))}
              </div>
            </div>
            <ConsolePanel ref={consoleRef} logs={logs} />
          </div>

          <div className="flex flex-col items-center justify-start gap-4 lg:col-span-7">{children}</div>
        </div>

        <ApiReference ref={apisRef} apis={apis} accentText={accent.text} />
      </div>

      <TutorialOverlay steps={tutorialSteps} active={tutorialActive} onFinish={finishTutorial} />
      {mission.hints && <HintMascot hints={mission.hints} hidden={tutorialActive} />}
    </>
  );
}
