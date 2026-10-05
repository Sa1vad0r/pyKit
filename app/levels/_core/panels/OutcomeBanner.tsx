import type { ReactNode } from "react";

const TONES = {
  success: "border-emerald-500 bg-emerald-950/80 text-emerald-200",
  danger: "border-red-600 bg-red-950/80 text-red-200",
  warning: "border-amber-600 bg-amber-950/80 text-amber-200",
};

interface OutcomeBannerProps {
  tone: keyof typeof TONES;
  title: string;
  children: ReactNode;
  action?: { label: string; onClick: () => void };
}

/** Win / lose message under the board. */
export default function OutcomeBanner({ tone, title, children, action }: OutcomeBannerProps) {
  return (
    <div className={`w-full max-w-lg rounded-xl border p-4 text-center shadow-xl ${TONES[tone]}`}>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-1 text-sm">{children}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-3 rounded-full bg-emerald-600 px-6 py-1.5 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
