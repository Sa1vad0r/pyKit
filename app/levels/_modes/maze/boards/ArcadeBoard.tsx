"use client";

import CameraSprite from "../../../_core/sprites/CameraSprite";
import ChickThief from "../../../_core/sprites/ChickThief";
import MoneyBag from "../../../_core/sprites/MoneyBag";
import { Stat, StatsBar } from "../../../_core/panels/StatsBar";
import type { HeistBoardProps } from "./shared";

/**
 * Theme "arcade" — the board levels 1 and 2 shipped with: rounded zinc tiles,
 * animated sprites, and pulsing red laser tiles for camera vision.
 */
export default function ArcadeBoard(props: HeistBoardProps) {
  const { grid, player, items, cameras, visionCells, moves, collected, total } = props;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <StatsBar>
        <Stat label="Moves">{moves}</Stat>
        <Stat label="Items" valueClass="text-amber-400">
          {collected} / {total}
        </Stat>
      </StatsBar>

      <div className="relative overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-2xl">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}>
          {grid.map((row, y) =>
            row.map((cellType, x) => {
              const isPlayerHere = player.x === x && player.y === y;
              const cameraHere = cameras.find((c) => c.x === x && c.y === y);
              const itemHere = items.find((i) => !i.collected && i.x === x && i.y === y);
              const isVision = visionCells.has(`${x},${y}`);

              let bgClass = "bg-zinc-800/80"; // Wall
              if (cellType === 1) bgClass = "bg-zinc-900/90"; // Open path
              if (cellType === 2) bgClass = "bg-emerald-950/60 border border-emerald-500/40"; // Exit
              if (isVision && cellType !== 0) bgClass = "laser-cell bg-red-950/50 border border-red-500/40"; // Camera vision

              return (
                <div
                  key={`${x}-${y}`}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all sm:h-12 sm:w-12 ${bgClass}`}
                >
                  {cellType === 2 && !isPlayerHere && <span className="text-xs font-bold text-emerald-400">EXIT</span>}

                  {itemHere && (
                    <div className="z-10 flex items-center justify-center">
                      <MoneyBag delay={(itemHere.id - 1) * 0.25} />
                    </div>
                  )}

                  {cameraHere && (
                    <div className="relative z-10 flex items-center justify-center drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                      <CameraSprite direction={cameraHere.direction} delay={cameras.indexOf(cameraHere) * 0.6} />
                    </div>
                  )}

                  {/* Player hops into each new tile */}
                  {isPlayerHere && (
                    <div className="player-hop z-10 flex h-9 w-9 items-center justify-center drop-shadow-[0_0_8px_rgba(16,185,129,0.9)] sm:h-11 sm:w-11">
                      <ChickThief />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
