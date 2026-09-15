import { useMemo, useState } from "react";
import { X, Check } from "lucide-react";
import { useMarketing, type EmailTemplate } from "@/lib/marketing";

/** Grid of saved email templates. Used from the email editor. */
export function TemplateLibrary({
  open,
  onClose,
  selectedId,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  selectedId?: string;
  onSelect: (t: EmailTemplate) => void;
}) {
  const { templates } = useMarketing();
  const [cat, setCat] = useState("All");
  const cats = useMemo(() => ["All", ...Array.from(new Set(templates.map((t) => t.category)))], [templates]);

  if (!open) return null;
  const list = templates.filter((t) => (cat === "All" ? true : t.category === cat));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-900/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3.5">
          <div>
            <h2 className="text-[15px] font-semibold">Template library</h2>
            <p className="text-[12px] text-zinc-500">Pick a starting point for this email.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-zinc-400 hover:text-zinc-700">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-zinc-100 px-5 py-3">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                cat === c ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid flex-1 gap-4 overflow-y-auto p-5 sm:grid-cols-3">
          {list.map((t) => {
            const active = t.id === selectedId;
            return (
              <button
                key={t.id}
                onClick={() => {
                  onSelect(t);
                  onClose();
                }}
                className={`overflow-hidden rounded-lg border text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  active ? "border-blue-600 ring-2 ring-blue-600/20" : "border-zinc-200"
                }`}
              >
                <div className="relative aspect-[4/3] bg-zinc-50 p-3">
                  <div className="flex h-full flex-col overflow-hidden rounded bg-white shadow-sm">
                    <div className="h-1/3" style={{ background: t.accent, opacity: 0.18 }} />
                    <div className="flex-1 space-y-1.5 p-2">
                      <div className="h-2 w-3/4 rounded bg-zinc-300" />
                      <div className="h-1.5 rounded bg-zinc-100" />
                      <div className="h-1.5 w-2/3 rounded bg-zinc-100" />
                      <div className="mt-1.5 h-3.5 w-16 rounded-sm" style={{ background: t.accent }} />
                    </div>
                  </div>
                  {active && (
                    <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-blue-600 text-white">
                      <Check size={12} />
                    </span>
                  )}
                </div>
                <div className="border-t border-zinc-100 px-3 py-2.5">
                  <p className="text-[13px] font-semibold text-zinc-900">{t.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-zinc-500">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
