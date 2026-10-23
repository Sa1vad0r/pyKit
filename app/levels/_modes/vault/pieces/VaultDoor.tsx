/** Bank vault door with a live keypad. Drawn for 4 dials. */
const RIVETS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180;
  return { x: (160 + 111 * Math.cos(a)).toFixed(1), y: (170 + 111 * Math.sin(a)).toFixed(1) };
});

const SPOKES = Array.from({ length: 6 }, (_, i) => i * 60);

interface VaultDoorProps {
  keys: number[];
  code: number[];
  locked: boolean[];
  open: boolean;
  alarm: boolean;
  running: boolean;
}

export default function VaultDoor({ keys, code, locked, open, alarm, running }: VaultDoorProps) {
  const lightFill = open ? "#4ade80" : alarm ? "#ef4444" : running ? "#fbbf24" : "#78716c";

  return (
      <svg
          viewBox="0 0 320 320"
          className={`w-full max-w-sm ${alarm ? "vault-shake" : ""}`}
          aria-label="Bank vault door with a four digit keypad"
      >
        {/* Steel frame */}
        <rect x="10" y="10" width="300" height="300" rx="24" fill="#27272a" stroke="#52525b" strokeWidth="4" />

        {/* Alarm lights */}
        <circle cx="34" cy="34" r="9" fill={lightFill} className={alarm ? "light-flash" : ""} />
        <circle cx="286" cy="34" r="9" fill={lightFill} className={alarm ? "light-flash" : ""} />

        {/* Interior, revealed when the door swings open */}
        <circle cx="160" cy="170" r="118" fill="#0c0a09" />
        {[
          [95, 214],
          [150, 214],
          [205, 214],
          [122, 188],
          [178, 188],
        ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <rect x={x} y={y} width="50" height="24" rx="3" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
              <rect x={x + 5} y={y + 4} width="22" height="5" rx="2" fill="#fde68a" />
            </g>
        ))}
        {[
          [140, 170],
          [160, 166],
          [180, 170],
          [150, 160],
          [170, 158],
        ].map(([x, y]) => (
            <circle key={`c-${x}-${y}`} cx={x} cy={y} r="7" fill="#fcd34d" stroke="#b45309" strokeWidth="1.2" />
        ))}

        {/* Locking bolts retract when open */}
        <g className={`bolts ${open ? "bolts-open" : ""}`}>
          {[110, 150, 190, 230].map(y => (
              <rect key={y} x="268" y={y} width="34" height="12" rx="3" fill="#a1a1aa" stroke="#52525b" strokeWidth="1.5" />
          ))}
        </g>

        {/* Door (hinged on the left) */}
        <g className={`vault-door ${open ? "vault-door-open" : ""}`}>
          <circle cx="160" cy="170" r="118" fill="#52525b" stroke="#a1a1aa" strokeWidth="6" />
          <circle cx="160" cy="170" r="104" fill="none" stroke="#3f3f46" strokeWidth="3" />
          {RIVETS.map((r, i) => (
              <circle key={i} cx={r.x} cy={r.y} r="3.5" fill="#a1a1aa" stroke="#3f3f46" strokeWidth="1" />
          ))}

          {/* Spin wheel */}
          <g className={`wheel ${open ? "wheel-spin" : ""}`}>
            <circle cx="160" cy="122" r="30" fill="#3f3f46" stroke="#d4d4d8" strokeWidth="3" />
            {SPOKES.map(deg => (
                <g key={deg} transform={`rotate(${deg} 160 122)`}>
                  <line x1="160" y1="122" x2="160" y2="96" stroke="#d4d4d8" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="160" cy="94" r="4" fill="#e4e4e7" />
                </g>
            ))}
            <circle cx="160" cy="122" r="9" fill="#71717a" stroke="#e4e4e7" strokeWidth="2" />
          </g>

          {/* Keypad display */}
          <rect x="92" y="190" width="136" height="60" rx="8" fill="#09090b" stroke="#71717a" strokeWidth="2" />
          {keys.map((k, i) => {
            const x = 96 + i * 34;
            const isLocked = locked[i];
            const isMatch = !isLocked && k === code[i];
            const stroke = isLocked ? "#4ade80" : isMatch ? "#fbbf24" : "#52525b";
            return (
                <g key={i}>
                  <rect x={x} y="196" width="30" height="38" rx="5" fill={isLocked ? "#052e16" : "#1c1917"} stroke={stroke} strokeWidth={isLocked || isMatch ? 2.5 : 1.5} />
                  <text
                      key={`${i}-${k}-${isLocked}`}
                      x={x + 15}
                      y="223"
                      textAnchor="middle"
                      fontSize="26"
                      fontWeight="700"
                      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                      fill={isLocked ? "#4ade80" : "#fbbf24"}
                      className="digit-flip"
                  >
                    {k}
                  </text>
                  <text x={x + 15} y="245" textAnchor="middle" fontSize="9" fontFamily="ui-monospace, monospace" fill="#a1a1aa">
                    {i}
                  </text>
                </g>
            );
          })}
        </g>
      </svg>
  );
}
