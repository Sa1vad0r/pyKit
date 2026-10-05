import type { Direction } from "../../_modes/maze/engine/types";

const CAMERA_ROTATION: Record<Direction, number> = { DOWN: 0, RIGHT: -90, UP: 180, LEFT: 90 };

/** Wall-mounted security camera that sweeps side to side. */
export default function CameraSprite({ direction, delay = 0 }: { direction: Direction; delay?: number }) {
  return (
      <svg
          viewBox="0 0 40 40"
          className="h-9 w-9 overflow-visible"
          style={{ transform: `rotate(${CAMERA_ROTATION[direction]}deg)` }}
          aria-label={`Security camera facing ${direction.toLowerCase()}`}
      >
        {/* Wall mount (fixed) */}
        <rect x="15" y="1" width="10" height="5" rx="1.5" fill="#52525b" />
        {/* Head sweeps left and right around the mount */}
        <g className="cam-sweep" style={{ animationDelay: `${delay}s` }}>
          <rect x="18" y="5" width="4" height="6" fill="#71717a" />
          <rect x="9" y="10" width="22" height="17" rx="4" fill="#27272a" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="9" y="10" width="22" height="5" rx="3" fill="#3f3f46" />
          {/* Lens */}
          <circle cx="20" cy="27" r="6" fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
          <circle cx="20" cy="27" r="3.5" fill="#ef4444" className="cam-lens" />
          <circle cx="18.5" cy="25.5" r="1" fill="#fecaca" />
          {/* Status LED */}
          <circle cx="27" cy="14" r="1.6" fill="#f87171" className="cam-led" />
        </g>
      </svg>
  );
}
