import { useState } from "react";
import { X, Image as ImageIcon, Film, FileText, Search, Check } from "lucide-react";
import { useMarketing, type MediaItem, type MediaType } from "@/lib/marketing";

export const TYPE_ICON: Record<MediaType, React.ComponentType<{ size?: number; className?: string }>> = {
  image: ImageIcon,
  video: Film,
  document: FileText,
};

export function MediaThumb({ item, className = "" }: { item: MediaItem; className?: string }) {
  const Icon = TYPE_ICON[item.type];
  if (item.type === "image" && item.url) {
    return <img src={item.url} alt={item.name} className={`block size-full object-cover ${className}`} />;
  }
  return (
    <div className={`grid size-full place-items-center bg-zinc-100 text-zinc-400 ${className}`}>
      <Icon size={22} />
    </div>
  );
}

/**
 * Modal media browser. In multi mode it stays open while you keep picking, so
 * several items can be attached in one visit.
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

  const list = media
    .filter((m) => types.includes(m.type))
    .filter((m) => (folder === "All" ? true : m.folder === folder))
    .filter((m) => m.name.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-900/40 p-4">
      <div className="flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
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

        <div className="flex items-center gap-2 border-b border-zinc-100 px-5 py-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search media"
              className="w-full rounded-md border border-zinc-200 py-2 pl-9 pr-3 text-[13px] outline-none focus:border-blue-600"
            />
          </div>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="rounded-md border border-zinc-200 px-2.5 py-2 text-[13px] outline-none focus:border-blue-600"
          >
            <option>All</option>
            {folders.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto p-5 sm:grid-cols-4">
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
                  <p className="text-[11px] text-zinc-400">{m.size}</p>
                </div>
              </button>
            );
          })}
          {list.length === 0 && (
            <p className="col-span-full py-10 text-center text-[13px] text-zinc-400">No media found.</p>
          )}
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
