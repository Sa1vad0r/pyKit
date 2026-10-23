import type { Accent } from "../mission";

/** Full class strings per accent (Tailwind needs them written out literally). */
export const ACCENTS: Record<Accent, { text: string; run: string }> = {
  emerald: {
    text: "text-emerald-400",
    run: "bg-emerald-600 text-white hover:bg-emerald-500",
  },
  amber: {
    text: "text-amber-400",
    run: "bg-amber-500 text-zinc-950 hover:bg-amber-400",
  },
};
