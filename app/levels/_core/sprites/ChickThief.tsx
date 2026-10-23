/** The player: a baby chick in a thief's balaclava. */
export default function ChickThief({ className = "h-full w-full" }: { className?: string }) {
  return (
      <svg viewBox="0 0 40 40" className={className} aria-label="Baby chick wearing a black thief mask">
        {/* Feet */}
        <path d="M14 34 L13 38 M14 34 L16 38 M26 34 L24 38 M26 34 L27 38" stroke="#f97316" strokeWidth="1.6" strokeLinecap="round" />
        {/* Fluffy round body */}
        <ellipse cx="20" cy="25" rx="13" ry="11" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
        {/* Little wings */}
        <ellipse cx="8.5" cy="26" rx="3.2" ry="5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" transform="rotate(12 8.5 26)" />
        <ellipse cx="31.5" cy="26" rx="3.2" ry="5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" transform="rotate(-12 31.5 26)" />
        {/* Black balaclava over the head */}
        <path d="M9.5 17 C9.5 7 14 3.5 20 3.5 C26 3.5 30.5 7 30.5 17 L30.5 22 L9.5 22 Z" fill="#18181b" />
        <path d="M14 6 L14.5 12 M20 4.5 L20 11 M26 6 L25.5 12" stroke="#3f3f46" strokeWidth="0.8" strokeLinecap="round" />
        {/* Rolled brim */}
        <rect x="8.5" y="20.5" width="23" height="4.5" rx="2.2" fill="#27272a" stroke="#52525b" strokeWidth="0.6" />
        {/* Eye opening */}
        <rect x="11.5" y="11" width="17" height="6.5" rx="3.2" fill="#fde047" />
        {/* Sneaky eyes */}
        <circle cx="16" cy="14.2" r="2.1" fill="#fff" />
        <circle cx="24" cy="14.2" r="2.1" fill="#fff" />
        <circle cx="16.6" cy="14.4" r="1.2" fill="#18181b" />
        <circle cx="24.6" cy="14.4" r="1.2" fill="#18181b" />
        {/* Beak pokes out of the mask */}
        <path d="M17.6 18.2 L22.4 18.2 L20 21.4 Z" fill="#fb923c" stroke="#c2410c" strokeWidth="0.6" strokeLinejoin="round" />
      </svg>
  );
}
