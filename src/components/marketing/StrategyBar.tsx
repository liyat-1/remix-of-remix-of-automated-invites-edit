import { Check, Layers, Mail, MessageSquare, Shuffle, X } from "lucide-react";
import { useState } from "react";
import { STRATEGIES, type Strategy } from "@/lib/marketing";

const ICONS: Record<Strategy, React.ComponentType<{ size?: number; className?: string }>> = {
  text: MessageSquare,
  text_email: Mail,
  text_fallback: Shuffle,
};

/** Toolbar: enters/leaves the channel-strategy selection mode. */
export function StrategyBar({
  managing,
  onToggleManage,
  onEnableAll,
  allEnabled,
}: {
  managing: boolean;
  onToggleManage: () => void;
  onEnableAll: (v: boolean) => void;
  allEnabled: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onToggleManage}
        aria-pressed={managing}
        className={`flex items-center gap-2 rounded-md border px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${
          managing
            ? "border-blue-600 bg-blue-50 text-blue-700"
            : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
        }`}
      >
        <Layers size={15} className={managing ? "text-blue-600" : "text-zinc-400"} />
        {managing ? "Managing channel strategy" : "Manage channel strategy"}
      </button>
      <button
        onClick={() => onEnableAll(!allEnabled)}
        className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-[12.5px] font-medium text-zinc-700 hover:border-zinc-300"
      >
        {allEnabled ? "Turn all off" : "Turn all on"}
      </button>
      {managing && (
        <span className="text-[12px] text-zinc-500">
          Tick the campaigns you want, then pick a strategy.
        </span>
      )}
    </div>
  );
}

/**
 * Floating strategy chooser. Only shows once at least one campaign is ticked.
 * Apply keeps you in selection mode; Done leaves it.
 */
export function StrategyPanel({
  names,
  onApply,
  onDone,
}: {
  names: string[];
  onApply: (s: Strategy) => void;
  onDone: () => void;
}) {
  const [strategy, setStrategy] = useState<Strategy>("text_email");

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[65] flex justify-center px-4 pb-4 sm:justify-end sm:pr-6">
      <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-100 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[13.5px] font-semibold text-zinc-900">Channel strategy</p>
            <p className="truncate text-[11.5px] text-zinc-500">
              {names.length} selected · {names.join(", ")}
            </p>
          </div>
          <button onClick={onDone} aria-label="Done" className="text-zinc-400 hover:text-zinc-700">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-1.5 p-3">
          {STRATEGIES.map((s) => {
            const Icon = ICONS[s.value];
            const active = strategy === s.value;
            return (
              <button
                key={s.value}
                onClick={() => setStrategy(s.value)}
                aria-pressed={active}
                className={`flex w-full items-start gap-2.5 rounded-lg border p-2.5 text-left transition-colors ${
                  active
                    ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/15"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <span
                  className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-md ${
                    active ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  <Icon size={14} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-semibold text-zinc-900">{s.label}</span>
                  <span className="mt-0.5 block text-[11.5px] leading-snug text-zinc-500">{s.hint}</span>
                </span>
                {active && (
                  <span className="mt-1 grid size-4 shrink-0 place-items-center rounded-full bg-blue-600 text-white">
                    <Check size={10} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-zinc-100 px-4 py-3">
          <button
            onClick={onDone}
            className="rounded-md px-3 py-2 text-[12.5px] font-medium text-zinc-600 hover:text-zinc-900"
          >
            Done
          </button>
          <button
            onClick={() => onApply(strategy)}
            className="rounded-md bg-zinc-900 px-4 py-2 text-[12.5px] font-semibold text-white hover:opacity-90"
          >
            Apply to {names.length}
          </button>
        </div>
      </div>
    </div>
  );
}
