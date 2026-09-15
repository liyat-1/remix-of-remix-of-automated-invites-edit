import { useState } from "react";
import { X, Image as ImageIcon, Film, FileText, Search, Check, Play, Folder } from "lucide-react";
import { useMarketing, type MediaItem, type MediaType } from "@/lib/marketing";

export const TYPE_ICON: Record<MediaType, React.ComponentType<{ size?: number; className?: string }>> = {
  image: ImageIcon,
  video: Film,
  document: FileText,
};

const extOf = (name: string) => (name.split(".").pop() ?? "file").toUpperCase();

const DOC_TONE: Record<string, string> = {
  PDF: "#dc2626",
  DOC: "#2563eb",
  DOCX: "#2563eb",
  XLS: "#16a34a",
  XLSX: "#16a34a",
  PPT: "#ea580c",
  PPTX: "#ea580c",
};

/** Realistic-looking thumbnail: photo, video still with play badge, or a paper document. */
export function MediaThumb({ item, className = "" }: { item: MediaItem; className?: string }) {
  if (item.type === "image" && item.url) {
    return <img src={item.url} alt={item.name} className={`block size-full object-cover ${className}`} />;
  }

  if (item.type === "video") {
    return (
      <div className={`relative size-full overflow-hidden bg-zinc-900 ${className}`}>
        {item.url ? (
          <video src={item.url} muted playsInline preload="metadata" className="size-full object-cover" />
        ) : (
          <div
            className="size-full"
            style={{ background: "linear-gradient(135deg, #1f2937 0%, #4b5563 55%, #111827 100%)" }}
          />
        )}
        <div className="absolute inset-x-0 top-0 flex justify-between px-1 py-1 opacity-40">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-[1px] bg-white" />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 py-1 opacity-40">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-[1px] bg-white" />
          ))}
        </div>
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-9 place-items-center rounded-full bg-white/90 text-zinc-900 shadow">
            <Play size={15} className="ml-0.5 fill-current" />
          </span>
        </span>
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-white">
          {extOf(item.name)}
        </span>
      </div>
    );
  }

  const ext = extOf(item.name);
  const tone = DOC_TONE[ext] ?? "#52525b";
  return (
    <div className={`grid size-full place-items-center bg-zinc-100 p-3 ${className}`}>
      <div className="relative h-full w-[70%] max-w-[92px] rounded-sm bg-white shadow-sm">
        <div
          className="absolute right-0 top-0 size-4"
          style={{ background: "#e4e4e7", clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
        />
        <div className="space-y-1.5 px-2.5 pt-4">
          <div className="h-1 w-3/4 rounded-sm bg-zinc-200" />
          <div className="h-1 rounded-sm bg-zinc-200" />
          <div className="h-1 rounded-sm bg-zinc-200" />
          <div className="h-1 w-2/3 rounded-sm bg-zinc-200" />
        </div>
        <span
          className="absolute bottom-2 left-2 rounded px-1.5 py-0.5 text-[8.5px] font-bold tracking-wide text-white"
          style={{ background: tone }}
        >
          {ext}
        </span>
      </div>
    </div>
  );
}

/**
 * Modal media browser with a folder sidebar. In multi mode it stays open while
 * you keep picking, so several items can be attached in one visit.
 */
export function MediaPicker({
  open,
  onClose,
  onSelect,
  selectedIds = [],
  multi = false,
  types = ["image", "video", "document"],
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
  selectedIds?: string[];
  multi?: boolean;
  types?: MediaType[];
}) {
  const { media, folders } = useMarketing();
  const [folder, setFolder] = useState<string>("All");
  const [q, setQ] = useState("");

  if (!open) return null;

  const pool = media.filter((m) => types.includes(m.type));
  const list = pool
    .filter((m) => (folder === "All" ? true : m.folder === folder))
    .filter((m) => m.name.toLowerCase().includes(q.trim().toLowerCase()));

  const countIn = (f: string) => (f === "All" ? pool.length : pool.filter((m) => m.folder === f).length);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-900/40 p-4">
      <div className="flex max-h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3.5">
          <div>
            <h2 className="text-[15px] font-semibold">Media library</h2>
            {multi && (
              <p className="text-[12px] text-zinc-500">
                Pick as many items as you need — the library stays open.
              </p>
            )}
          </div>
          <button onClick={onClose} aria-label="Close" className="text-zinc-400 hover:text-zinc-700">
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-zinc-100 px-5 py-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search media"
              className="w-full rounded-md border border-zinc-200 py-2 pl-9 pr-3 text-[13px] outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <aside className="w-48 shrink-0 overflow-y-auto border-r border-zinc-100 p-3">
            <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              Folders
            </p>
            {["All", ...folders].map((f) => {
              const active = folder === f;
              return (
                <button
                  key={f}
                  onClick={() => setFolder(f)}
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12.5px] transition-colors ${
                    active ? "bg-blue-50 font-semibold text-blue-700" : "text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  <Folder size={14} className={active ? "text-blue-600" : "text-zinc-400"} />
                  <span className="min-w-0 flex-1 truncate">{f === "All" ? "All media" : f}</span>
                  <span className="text-[10.5px] text-zinc-400">{countIn(f)}</span>
                </button>
              );
            })}
          </aside>

          <div className="grid flex-1 grid-cols-2 content-start gap-3 overflow-y-auto p-5 sm:grid-cols-3">
            {list.map((m) => {
              const active = selectedIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    onSelect(m);
                    if (!multi) onClose();
                  }}
                  className={`group relative overflow-hidden rounded-lg border text-left transition-colors ${
                    active ? "border-blue-600 ring-2 ring-blue-600/20" : "border-zinc-200 hover:border-blue-500"
                  }`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-zinc-50">
                    <MediaThumb item={m} />
                  </div>
                  {active && (
                    <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-blue-600 text-white">
                      <Check size={12} />
                    </span>
                  )}
                  <div className="px-2.5 py-2">
                    <p className="truncate text-[12.5px] font-medium text-zinc-800">{m.name}</p>
                    <p className="truncate text-[11px] text-zinc-400">
                      {m.folder} · {m.size}
                    </p>
                  </div>
                </button>
              );
            })}
            {list.length === 0 && (
              <p className="col-span-full py-10 text-center text-[13px] text-zinc-400">No media found.</p>
            )}
          </div>
        </div>

        {multi && (
          <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3">
            <p className="text-[12.5px] text-zinc-500">{selectedIds.length} attached</p>
            <button
              onClick={onClose}
              className="rounded-md bg-blue-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
