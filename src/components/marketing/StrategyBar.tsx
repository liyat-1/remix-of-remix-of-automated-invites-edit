import { useState } from "react";
import { Layers } from "lucide-react";
import { STRATEGIES, type Strategy } from "@/lib/marketing";

/**
 * Bulk channel-strategy bar: choose one strategy and apply it to every
 * campaign in the group (or only the selected ones).
 */
export function StrategyBar({
  selectedCount,
  total,
  onApply,
  onEnableAll,
  allEnabled,
}: {
  selectedCount: number;
  total: number;
  onApply: (s: Strategy) => void;
  onEnableAll: (v: boolean) => void;
  allEnabled: boolean;
}) {
  const [strategy, setStrategy] = useState<Strategy>("text_email");
  const target = selectedCount > 0 ? `${selectedCount} selected` : `all ${total}`;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
      <span className="flex items-center gap-2 text-[13px] font-semibold text-zinc-800">
        <Layers size={15} className="text-zinc-400" />
        Channel strategy
      </span>

      <div className="flex flex-wrap gap-1 rounded-md bg-zinc-100 p-1">
        {STRATEGIES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStrategy(s.value)}
            title={s.hint}
            className={`rounded px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
              strategy === s.value ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => onApply(strategy)}
        className="rounded-md bg-zinc-900 px-3.5 py-2 text-[12.5px] font-semibold text-white hover:opacity-90"
      >
        Apply to {target}
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => onEnableAll(!allEnabled)}
          className="rounded-md border border-zinc-200 px-3 py-2 text-[12.5px] font-medium text-zinc-700 hover:border-zinc-300"
        >
          {allEnabled ? "Turn all off" : "Turn all on"}
        </button>
      </div>

      <p className="w-full text-[11.5px] text-zinc-400">
        {STRATEGIES.find((s) => s.value === strategy)?.hint}
      </p>
    </div>
  );
}
