"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useConsole } from "../../_core/hooks/useConsole";
import { sleep, useRunLifecycle } from "../../_core/hooks/useRunLifecycle";
import OutcomeBanner from "../../_core/panels/OutcomeBanner";
import { Stat, StatsBar } from "../../_core/panels/StatsBar";
import { usePython } from "../../_core/python/usePython";
import LevelShell from "../../_core/shell/LevelShell";
import ChickThief from "../../_core/sprites/ChickThief";
import { keysAt, makeRound, type Round } from "./engine/dials";
import TargetCode from "./pieces/TargetCode";
import VaultDoor from "./pieces/VaultDoor";
import type { VaultMission } from "./schema";
import "./vault.css";

const TICK_MS = 1000; // keypad scrambles once per second
const AUTO_RESET_DELAY_MS = 2500; // how long a failure message stays before auto reset

type Outcome = { type: "won" } | { type: "alarm" } | { type: "timeout"; lockedCount: number } | null;

/** Plays any vault mission: the script re-runs every second against a scrambling keypad. */
export default function VaultMode({ mission }: { mission: VaultMission }) {
  const { dials, seconds, strikes: maxStrikes } = mission;

  const python = usePython();
  const { logs, log } = useConsole(python.status);
  const { running, begin, end, cancel, after } = useRunLifecycle();

  const unlocked = useCallback(() => Array<boolean>(dials).fill(false), [dials]);
  const [code, setCode] = useState(mission.starter);
  const [round, setRound] = useState<Round>(mission.firstRound);
  const roundRef = useRef<Round>(mission.firstRound);
  const [locked, setLocked] = useState<boolean[]>(unlocked);
  const [tick, setTick] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [outcome, setOutcome] = useState<Outcome>(null);

  const codePanelRef = useRef<HTMLDivElement>(null);
  const vaultRef = useRef<HTMLDivElement>(null);
  const targets = useMemo(() => ({ code: codePanelRef, vault: vaultRef }), []);

  // While idle the keypad keeps scrambling so the vault feels alive. During a run the run loop drives the clock.
  useEffect(() => {
    if (running) return;
    const id = setInterval(() => setTick((t) => t + 1), TICK_MS);
    return () => clearInterval(id);
  }, [running]);

  // Back to the starting state (logs are kept so the player can review them)
  const resetBoard = useCallback(
    (newRound: boolean) => {
      cancel();
      if (newRound) {
        const r = makeRound(dials, mission.stepSizes);
        roundRef.current = r;
        setRound(r);
      }
      setLocked(unlocked());
      setStrikes(0);
      setOutcome(null);
      setElapsed(0);
      setTick(0);
    },
    [cancel, dials, mission.stepSizes, unlocked]
  );

  const resetGame = useCallback(() => {
    resetBoard(true);
    log("New vault, new code. Good luck!");
  }, [resetBoard, log]);

  const failAndReset = useCallback(
    (result: Outcome) => {
      setOutcome(result);
      after(AUTO_RESET_DELAY_MS, () => {
        resetBoard(true);
        log("Vault reset with a new code. Try again!");
      });
    },
    [after, resetBoard, log]
  );

  const runCode = async () => {
    if (running) return;
    // Same code as before, so the player can retry against what they just read
    resetBoard(false);
    const cancelled = begin();
    if (!cancelled) return;

    const r = roundRef.current;
    let lockedNow = unlocked();
    let strikesNow = 0;

    log("--- Cracking the vault ---");

    for (let t = 0; t < seconds; t++) {
      if (cancelled()) return;
      setTick(t);
      setElapsed(t);

      const keys = keysAt(r, t, lockedNow);
      const result = await python.run(code, {
        apis: mission.apis,
        vars: { keys, code: r.code, locked: lockedNow, tick: t },
      });
      if (cancelled()) return;
      if (result.output.length) log(`[t=${t}] ${result.output.join("\n")}`);
      if (result.error) {
        log(`Error: ${result.error}`);
        resetBoard(false);
        return;
      }

      let alarm = false;
      for (const call of result.calls) {
        if (call.api !== "lock") continue;
        const i = call.args[0] as number;
        if (i < 0 || i >= dials) {
          log(`lock(${i}) ignored - dial must be 0 to ${dials - 1}.`);
          continue;
        }
        if (lockedNow[i]) continue; // already locked

        if (keys[i] === r.code[i]) {
          lockedNow = lockedNow.map((v, j) => (j === i ? true : v));
          log(`Dial ${i} locked on ${keys[i]}.`);
        } else {
          strikesNow += 1;
          log(`Misfire! Dial ${i} shows ${keys[i]} but the code needs ${r.code[i]}. (${strikesNow}/${maxStrikes})`);
          if (strikesNow >= maxStrikes) {
            alarm = true;
            break;
          }
        }
      }

      setLocked(lockedNow);
      setStrikes(strikesNow);

      if (alarm) {
        log("ALARM! Too many misfires - security is on the way!");
        end();
        failAndReset({ type: "alarm" });
        return;
      }
      if (lockedNow.every(Boolean)) {
        log("Click! All dials locked - the vault is open!");
        end();
        setOutcome({ type: "won" });
        return;
      }

      await sleep(TICK_MS);
    }

    if (cancelled()) return;
    setElapsed(seconds);
    end();
    const lockedCount = lockedNow.filter(Boolean).length;
    log(`--- Time's up: ${lockedCount} of ${dials} dials locked ---`);
    failAndReset({ type: "timeout", lockedCount });
  };

  const keys = keysAt(round, tick, locked);
  const lockedCount = locked.filter(Boolean).length;
  const timeLeft = running || outcome ? Math.max(0, seconds - elapsed) : seconds;
  const isWon = outcome?.type === "won";
  const isAlarm = outcome?.type === "alarm";

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
      <StatsBar>
        <div className={`h-11 w-11 shrink-0 ${isWon ? "chick-cheer" : isAlarm ? "chick-shiver" : ""}`}>
          <ChickThief />
        </div>
        <Stat label="Time" valueClass={timeLeft <= 5 && running ? "text-red-400" : "text-amber-400"}>
          {timeLeft}s
        </Stat>
        <Stat label="Locked">
          {lockedCount} / {dials}
        </Stat>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-zinc-400">Strikes:</span>
          <span className="flex gap-1" aria-label={`${strikes} of ${maxStrikes} strikes`}>
            {Array.from({ length: maxStrikes }, (_, i) => (
              <span key={i} className={`h-3 w-3 rounded-full border ${i < strikes ? "border-red-500 bg-red-500" : "border-zinc-600 bg-zinc-900"}`} />
            ))}
          </span>
        </div>
      </StatsBar>

      <TargetCode ref={codePanelRef} code={round.code} keys={keys} locked={locked} />

      <div ref={vaultRef} className="flex w-full max-w-lg justify-center rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-2xl">
        <VaultDoor keys={keys} code={round.code} locked={locked} open={isWon} alarm={isAlarm} running={running} />
      </div>

      {outcome?.type === "alarm" && (
        <OutcomeBanner tone="danger" title="🚨 ALARM TRIPPED! 🚨">
          {maxStrikes} misfires. Only call lock(i) when keys[i] equals code[i]. Resetting the vault...
        </OutcomeBanner>
      )}
      {outcome?.type === "timeout" && (
        <OutcomeBanner tone="warning" title="⏱️ Time's up!">
          You locked {outcome.lockedCount} of {dials} dials. Make sure every dial has its own check. Resetting the vault...
        </OutcomeBanner>
      )}
      {outcome?.type === "won" && (
        <OutcomeBanner tone="success" title="💰 VAULT CRACKED! 💰" action={{ label: "Crack Another Vault", onClick: resetGame }}>
          All {dials} dials locked with {strikes} misfire{strikes === 1 ? "" : "s"}. The loot is yours!
        </OutcomeBanner>
      )}
    </LevelShell>
  );
}
