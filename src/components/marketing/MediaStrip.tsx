import { useState } from "react";
import { ImagePlus, Search, X } from "lucide-react";
import { MediaPicker, MediaThumb } from "./MediaPicker";
import { useMarketing, type MediaItem, type MediaType } from "@/lib/marketing";

/**
 * Inline media attacher: recently added items and a search box right here,
 * plus the full library for everything else. Supports multiple attachments.
 */
export function MediaStrip({
  ids,
  onChange,
  types = ["image", "video", "document"],
  label = "Attachments",
}: {
  ids: string[];
  onChange: (ids: string[]) => void;
  types?: MediaType[];
  label?: string;
}) {
  const { media } = useMarketing();
  const [q, setQ] = useState("");
  const [lib, setLib] = useState(false);

  const pool = media.filter((m) => types.includes(m.type));
  const attached = ids.map((id) => pool.find((m) => m.id === id)).filter(Boolean) as MediaItem[];
  const query = q.trim().toLowerCase();
  const suggestions = (
    query ? pool.filter((m) => m.name.toLowerCase().includes(query)) : [...pool].sort((a, b) => b.addedAt - a.addedAt)
  )
    .filter((m) => !ids.includes(m.id))
    .slice(0, 8);

  const toggle = (m: MediaItem) =>
    onChange(ids.includes(m.id) ? ids.filter((x) => x !== m.id) : [...ids, m.id]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
        <button
          onClick={() => setLib(true)}
          className="flex items-center gap-1.5 text-[12.5px] font-medium text-blue-600 hover:text-blue-700"
        >
          <ImagePlus size={14} />
          Add from library
        </button>
      </div>

      {attached.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {attached.map((m) => (
            <div key={m.id} className="relative w-24 overflow-hidden rounded-md border border-zinc-200">
              <div className="aspect-[4/3] bg-zinc-50">
                <MediaThumb item={m} />
              </div>
              <p className="truncate px-1.5 py-1 text-[11px] text-zinc-600">{m.name}</p>
              <button
                onClick={() => onChange(ids.filter((x) => x !== m.id))}
                aria-label={`Remove ${m.name}`}
                className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-white/90 text-zinc-500 shadow hover:text-zinc-900"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative mt-2.5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search media"
          className="w-full rounded-md border border-zinc-200 py-2 pl-9 pr-3 text-[13px] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
        />
      </div>

      <p className="mt-2.5 text-[11.5px] uppercase tracking-wide text-zinc-400">
        {query ? "Results" : "Recently added"}
      </p>
      <div className="mt-1.5 flex gap-2 overflow-x-auto pb-1">
        {suggestions.map((m) => (
          <button
            key={m.id}
            onClick={() => toggle(m)}
            title={`Attach ${m.name}`}
            className="w-20 shrink-0 overflow-hidden rounded-md border border-zinc-200 text-left hover:border-blue-500"
          >
            <div className="aspect-[4/3] bg-zinc-50">
              <MediaThumb item={m} />
            </div>
            <p className="truncate px-1.5 py-1 text-[10.5px] text-zinc-600">{m.name}</p>
          </button>
        ))}
        {suggestions.length === 0 && (
          <p className="py-3 text-[12.5px] text-zinc-400">Nothing else to show.</p>
        )}
      </div>

      <MediaPicker
        open={lib}
        multi
        types={types}
        selectedIds={ids}
        onClose={() => setLib(false)}
        onSelect={toggle}
      />
    </div>
  );
}
