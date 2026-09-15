import { useState } from "react";
import { Film, ImagePlus, Library, Search, X } from "lucide-react";
import { MediaPicker, MediaThumb } from "./MediaPicker";
import { useMarketing, type MediaItem, type MediaType } from "@/lib/marketing";
import { Button } from "@/components/ui/button";

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
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <span className="text-[12px] font-semibold text-card-foreground">{label}</span>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Choose existing assets for this message.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLib(true)}
          className="shrink-0"
        >
          <Library size={14} />
          Browse library
        </Button>
      </div>

      {attached.length > 0 && (
        <div className="flex flex-wrap gap-3 border-b border-border bg-muted/35 p-3">
          {attached.map((m) => (
            <div key={m.id} className="relative w-28 overflow-hidden rounded-md border border-border bg-background shadow-sm">
              <div className="aspect-[16/10] bg-muted">
                <MediaThumb item={m} />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5">
                {m.type === "video" ? <Film size={11} className="shrink-0 text-muted-foreground" /> : <ImagePlus size={11} className="shrink-0 text-muted-foreground" />}
                <p className="truncate text-[11px] font-medium text-foreground">{m.name}</p>
              </div>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => onChange(ids.filter((x) => x !== m.id))}
                aria-label={`Remove ${m.name}`}
                className="absolute right-1.5 top-1.5 size-6 rounded-full shadow"
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="p-3">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search media"
          className="w-full rounded-md border border-zinc-200 py-2 pl-9 pr-3 text-[13px] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
        />
      </div>

      <p className="mt-3 text-[11px] font-semibold uppercase text-muted-foreground">
        {query ? "Results" : "Recently added"}
      </p>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {suggestions.map((m) => (
          <button
            key={m.id}
            onClick={() => toggle(m)}
            title={`Attach ${m.name}`}
            className="w-24 shrink-0 overflow-hidden rounded-md border border-border bg-background text-left transition-colors hover:border-ring"
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
      </div>

      <MediaPicker
        open={lib}
        multi
        types={types}
        selectedIds={ids}
        onClose={() => setLib(false)}
        onSelect={toggle}
      />
    </section>
  );
}
