import { Check, X } from "lucide-react";
import { LAYOUT_PRESETS, type EmailLayout } from "@/lib/marketing";

/** Tiny wireframe of an email layout. Shared by the picker and the editor cards. */
export function LayoutThumb({ layout, accent }: { layout: EmailLayout; accent: string }) {
  const band = <div className="rounded-sm" style={{ background: accent, opacity: 0.22, height: 14 }} />;
  const line = <div className="h-1.5 rounded-sm bg-zinc-200" />;
  const short = <div className="h-1.5 w-2/3 rounded-sm bg-zinc-200" />;
  const btn = <div className="h-2.5 w-10 rounded-sm" style={{ background: accent }} />;

  return (
    <div className="flex h-[74px] flex-col gap-1.5 rounded bg-white p-2 shadow-sm">
      {layout === "hero_top" && (
        <>
          {band}
          {line}
          {short}
          {btn}
        </>
      )}
      {layout === "text_only" && (
        <>
          <div className="h-2 w-3/4 rounded-sm bg-zinc-300" />
          {line}
          {line}
          {short}
          {btn}
        </>
      )}
      {layout === "split" && (
        <>
          <div className="flex gap-1.5">
            <div className="w-1/2 rounded-sm" style={{ background: accent, opacity: 0.22, height: 34 }} />
            <div className="flex w-1/2 flex-col gap-1.5">
              {line}
              {line}
              {short}
            </div>
          </div>
          {btn}
        </>
      )}
      {layout === "full_bleed" && (
        <div
          className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-sm"
          style={{ background: accent, opacity: 0.22 }}
        >
          <div className="h-2 w-2/3 rounded-sm bg-white/80" />
          <div className="h-2.5 w-10 rounded-sm bg-white" />
        </div>
      )}
      {layout === "gallery_two" && (
        <>
          <div className="h-2 w-3/4 rounded-sm bg-zinc-300" />
          {short}
          <div className="flex gap-1.5">
            {[0, 1].map((i) => (
              <div key={i} className="h-4 flex-1 rounded-sm" style={{ background: accent, opacity: 0.22 }} />
            ))}
          </div>
          {btn}
        </>
      )}
      {layout === "gallery_three" && (
        <>
          {band}
          {short}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-3.5 flex-1 rounded-sm" style={{ background: accent, opacity: 0.22 }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Layout picker. It slides in from the left so the live preview on the right
 * stays visible while you try different layouts.
 */
export function LayoutLibrary({
  open,
  onClose,
  value,
  accent,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  value: EmailLayout;
  accent: string;
  onSelect: (l: EmailLayout) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-[75] flex w-[330px] max-w-[85vw] flex-col border-r border-zinc-200 bg-white shadow-2xl">
      <div className="flex items-start justify-between border-b border-zinc-200 px-4 py-3.5">
        <div>
          <h2 className="text-[14.5px] font-semibold">Layout library</h2>
          <p className="text-[11.5px] text-zinc-500">Pick one — the preview updates as you go.</p>
        </div>
        <button onClick={onClose} aria-label="Close" className="text-zinc-400 hover:text-zinc-700">
          <X size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-4">
        {LAYOUT_PRESETS.map((l) => {
          const active = value === l.value;
          return (
            <button
              key={l.value}
              onClick={() => onSelect(l.value)}
              aria-pressed={active}
              className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors ${
                active ? "border-blue-600 ring-2 ring-blue-600/20" : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <span className="w-24 shrink-0 rounded bg-zinc-50 p-1.5">
                <LayoutThumb layout={l.value} accent={accent} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-semibold text-zinc-900">{l.label}</span>
                <span className="mt-0.5 block text-[11.5px] leading-snug text-zinc-500">{l.desc}</span>
              </span>
              {active && (
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-blue-600 text-white">
                  <Check size={11} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="border-t border-zinc-100 px-4 py-3">
        <button
          onClick={onClose}
          className="w-full rounded-md bg-zinc-900 py-2 text-[12.5px] font-semibold text-white hover:opacity-90"
        >
          Done
        </button>
      </div>
    </div>
  );
}
