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
            ? "border-brand bg-brand text-brand-foreground"
            : "border-input bg-background text-card-foreground hover:border-brand/50 hover:bg-muted/60"
        }`}
      >
        <Layers size={15} className={managing ? "text-brand-foreground" : "text-muted-foreground"} />
        {managing ? "Done managing" : "Manage channel strategy"}
      </button>
      <button
        onClick={() => onEnableAll(!allEnabled)}
        className="rounded-md border border-input bg-background px-3 py-2 text-[12.5px] font-medium text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
      >
        {allEnabled ? "Turn all off" : "Turn all on"}
      </button>
      {managing && (
        <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-brand" />
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
      <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-float">
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <p className="text-[13.5px] font-semibold tracking-tight text-card-foreground">Channel strategy</p>
            <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
              {names.length} selected · {names.join(", ")}
            </p>
          </div>
          <button
            onClick={onDone}
            aria-label="Done"
            className="-mr-1 shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
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
                    ? "border-brand bg-brand-soft/70 ring-2 ring-brand/20"
                    : "border-border hover:border-brand/40 hover:bg-muted/50"
                }`}
              >
                <span
                  className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-md ${
                    active ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon size={14} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-semibold text-card-foreground">{s.label}</span>
                  <span className="mt-0.5 block text-[11.5px] leading-snug text-muted-foreground">{s.hint}</span>
                </span>
                {active && (
                  <span className="mt-1 grid size-4 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-3">
          <button
            onClick={onDone}
            className="rounded-md px-3 py-2 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Done
          </button>
          <button
            onClick={() => onApply(strategy)}
            className="rounded-md bg-brand px-4 py-2 text-[12.5px] font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            Apply to {names.length}
          </button>
        </div>
      </div>
    </div>
  );
}
