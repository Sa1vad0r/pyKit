/** Loot: a money bag that shakes (bag-shake in level-animations.css). */
export default function MoneyBag({ delay = 0 }: { delay?: number }) {
  return (
      <svg
          viewBox="0 0 32 32"
          className="bag-shake h-8 w-8 overflow-visible drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]"
          style={{ animationDelay: `${delay}s` }}
          aria-label="Money bag"
      >
        {/* Gathered top */}
        <path d="M10 8 L8.5 3.5 L13.5 6 L16 2.5 L18.5 6 L23.5 3.5 L22 8 Z" fill="#d97706" stroke="#78350f" strokeWidth="1" strokeLinejoin="round" />
        {/* Bag body */}
        <path d="M11 8.5 Q16 11.5 21 8.5 L24.5 14 Q30 20.5 26.5 26 Q24 30 16 30 Q8 30 5.5 26 Q2 20.5 7.5 14 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Tie */}
        <path d="M10.5 9.5 Q16 12.5 21.5 9.5" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
        {/* Highlight */}
        <path d="M9 17 Q8 21 10 24" fill="none" stroke="#fde68a" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        {/* Dollar sign */}
        <text x="16" y="25" textAnchor="middle" fontSize="12" fontWeight="800" fontFamily="ui-sans-serif, system-ui, sans-serif" fill="#78350f">$</text>
      </svg>
  );
}
