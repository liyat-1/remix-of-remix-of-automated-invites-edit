import { useEffect, useState } from "react";
import { Check, Layers, Mail, MessageSquare, Shuffle, X } from "lucide-react";
import { STRATEGIES, type Strategy } from "@/lib/marketing";

const ICONS: Record<Strategy, React.ComponentType<{ size?: number; className?: string }>> = {
  text: MessageSquare,
  text_email: Mail,
  text_fallback: Shuffle,
};

/**
 * Channel strategy is opened from a single button and applied from a floating
 * panel of selectable cards, so the page stays quiet until you need it.
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
  const [open, setOpen] = useState(false);
  const [strategy, setStrategy] = useState<Strategy>("text_email");
  const target = selectedCount > 0 ? `${selectedCount} selected` : `all ${total}`;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3.5 py-2 text-[12.5px] font-semibold text-zinc-800 hover:border-zinc-300"
        >
          <Layers size={15} className="text-zinc-400" />
          Manage channel strategy
        </button>
        <button
          onClick={() => onEnableAll(!allEnabled)}
          className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-[12.5px] font-medium text-zinc-700 hover:border-zinc-300"
        >
          {allEnabled ? "Turn all off" : "Turn all on"}
        </button>
        {selectedCount > 0 && (
          <span className="text-[12px] text-zinc-500">{selectedCount} selected</span>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[65] flex items-end justify-center bg-zinc-900/30 p-4 sm:items-center">
          <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-zinc-200 px-5 py-3.5">
              <div>
                <h2 className="text-[15px] font-semibold">Channel strategy</h2>
                <p className="text-[12px] text-zinc-500">
                  Choose how these campaigns reach guests, then apply to {target}.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 p-5">
              {STRATEGIES.map((s) => {
                const Icon = ICONS[s.value];
                const active = strategy === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => setStrategy(s.value)}
                    aria-pressed={active}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3.5 text-left transition-colors ${
                      active
                        ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/15"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-md ${
                        active ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      <Icon size={15} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-semibold text-zinc-900">{s.label}</span>
                      <span className="mt-0.5 block text-[12px] leading-snug text-zinc-500">{s.hint}</span>
                    </span>
                    {active && (
                      <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-blue-600 text-white">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-zinc-100 px-5 py-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-[12.5px] font-medium text-zinc-600 hover:text-zinc-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onApply(strategy);
                  setOpen(false);
                }}
                className="rounded-md bg-zinc-900 px-4 py-2 text-[12.5px] font-semibold text-white hover:opacity-90"
              >
                Apply to {target}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
