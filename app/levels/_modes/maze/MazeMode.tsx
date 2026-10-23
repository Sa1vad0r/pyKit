"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useConsole } from "../../_core/hooks/useConsole";
import { sleep, useRunLifecycle } from "../../_core/hooks/useRunLifecycle";
import OutcomeBanner from "../../_core/panels/OutcomeBanner";
import { usePython } from "../../_core/python/usePython";
import LevelShell from "../../_core/shell/LevelShell";
import { BOARD_THEMES, DEFAULT_BOARD } from "./boards";
import { buildMazeLevel, freshItems } from "./engine/level";
import { step, type MazeState } from "./engine/step";
import type { Direction } from "./engine/types";
import type { MazeMission } from "./schema";

const STEP_DELAY_MS = 300; // time between each visible move (matches .player-hop)
const AUTO_RESET_DELAY_MS = 2000; // how long a failure message stays before auto reset

type Outcome = { type: "won" } | { type: "caught" } | { type: "incomplete"; reason: string } | null;

/** Plays any maze mission: the script's move() calls are replayed one tile at a time. */
export default function MazeMode({ mission }: { mission: MazeMission }) {
  const level = useMemo(() => buildMazeLevel(mission), [mission]);
  const { Board } = BOARD_THEMES[mission.board ?? DEFAULT_BOARD];

  const python = usePython();
  const { logs, log } = useConsole(python.status);
  const { running, begin, end, cancel, after } = useRunLifecycle();

  const initialState = useCallback((): MazeState => ({ pos: level.start, items: freshItems(level), moves: 0 }), [level]);
  const [code, setCode] = useState(mission.starter);
  const [state, setState] = useState<MazeState>(initialState);
  const [outcome, setOutcome] = useState<Outcome>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const targets = useMemo(() => ({ board: boardRef }), []);

  const total = level.items.length;

  // Back to the starting state (logs are kept so the player can review them)
  const resetBoard = useCallback(() => {
    cancel();
    setState(initialState());
    setOutcome(null);
  }, [cancel, initialState]);

  const resetGame = useCallback(() => {
    resetBoard();
    log("Game reset to starting position.");
  }, [resetBoard, log]);

  const failAndReset = useCallback(
    (result: Outcome) => {
      setOutcome(result);
      after(AUTO_RESET_DELAY_MS, () => {
        resetBoard();
        log("Player returned to the starting position. Try again!");
      });
    },
    [after, resetBoard, log]
  );

  const runCode = async () => {
    if (running) return;
    resetBoard();
    const cancelled = begin();
    if (!cancelled) return;

    log("--- Executing Python Code ---");
    const result = await python.run(code, { apis: mission.apis });
    if (cancelled()) return;
    if (result.output.length) log(result.output.join("\n"));
    if (result.error) {
      log(`Error: ${result.error}`);
      end();
      return;
    }

    const moves = result.calls.filter((c) => c.api === "move").map((c) => c.args[0] as Direction);
    if (moves.length === 0) {
      log("Your code didn't call move(). Nothing to do!");
      end();
      failAndReset({ type: "incomplete", reason: "Your code never moved the player." });
      return;
    }

    // Replay the moves one at a time. `current` is the source of truth; React state mirrors it.
    let current = initialState();
    let finished: "won" | "caught" | null = null;

    for (const dir of moves) {
      await sleep(STEP_DELAY_MS);
      if (cancelled()) return;

      const res = step(level, current, dir);
      if (res.type === "blocked") {
        log(`Collision! Cannot move into wall at (${res.x}, ${res.y})`);
        continue;
      }

      current = res.state;
      setState(current);
      if (res.collected) log(`Collected Item #${res.collected.id}!`);

      if (res.done === "caught") {
        log("ALARM! You were spotted by a security camera!");
        finished = "caught";
        break;
      }
      if (res.done === "won") {
        log("Success! All items collected and reached the exit!");
        finished = "won";
        break;
      }
      if (res.done === "exit-locked") log(`Reached exit, but you still need to collect all ${total} items!`);
    }

    if (cancelled()) return;
    end();

    if (finished === "won") {
      setOutcome({ type: "won" });
    } else if (finished === "caught") {
      failAndReset({ type: "caught" });
    } else {
      const atExit = level.grid[current.pos.y][current.pos.x] === 2;
      const collected = current.items.filter((i) => i.collected).length;
      const reason = atExit
        ? `You reached the exit with only ${collected} of ${total} items.`
        : "Your code finished before the player reached the exit.";
      log(`--- Execution Completed: ${reason} ---`);
      failAndReset({ type: "incomplete", reason });
    }
  };

  const collected = state.items.filter((i) => i.collected).length;

  return (
    <LevelShell
      mission={mission}
      code={code}
      onCodeChange={setCode}
      logs={logs}
      running={running}
      showingOutcome={outcome !== null}
      onRun={runCode}
      onReset={resetGame}
      targets={targets}
    >
      <div ref={boardRef} className="flex w-full justify-center">
        <Board
          grid={level.grid}
          player={state.pos}
          items={state.items}
          cameras={level.cameras}
          visionCells={level.vision}
          moves={state.moves}
          collected={collected}
          total={total}
          caught={outcome?.type === "caught"}
          won={outcome?.type === "won"}
        />
      </div>

      {outcome?.type === "caught" && (
        <OutcomeBanner tone="danger" title="🚨 CAUGHT BY SECURITY CAMERA! 🚨">
          Avoid camera vision cones. Resetting to the start...
        </OutcomeBanner>
      )}
      {outcome?.type === "incomplete" && (
        <OutcomeBanner tone="warning" title="⚠️ Exit not reached">
          {outcome.reason} Resetting to the start...
        </OutcomeBanner>
      )}
      {outcome?.type === "won" && (
        <OutcomeBanner tone="success" title="🎉 MISSION ACCOMPLISHED! 🎉" action={{ label: "Play Again", onClick: resetGame }}>
          Successfully collected all items and escaped in {state.moves} moves!
        </OutcomeBanner>
      )}
    </LevelShell>
  );
}
