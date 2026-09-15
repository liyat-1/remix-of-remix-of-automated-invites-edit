import { useRef, useState } from "react";
import { Folder, FolderPlus, Pencil, Search, Trash2, Upload } from "lucide-react";
import { MarketingShell } from "./MarketingShell";
import { MediaThumb } from "./MediaPicker";
import { mutate, uid, useMarketing, type MediaType } from "@/lib/marketing";

const TYPES: ("all" | MediaType)[] = ["all", "image", "video", "document"];

function typeOf(file: File): MediaType {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "document";
}

const fmtSize = (b: number) => (b > 1024 * 1024 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);

/** Small inline text field used for renaming folders and files. */
function RenameField({
  value,
  onSave,
  onCancel,
  className = "",
}: {
  value: string;
  onSave: (v: string) => void;
  onCancel: () => void;
  className?: string;
}) {
  const [draft, setDraft] = useState(value);
  const commit = () => {
    const v = draft.trim();
    if (v) onSave(v);
    else onCancel();
  };
  return (
    <input
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") onCancel();
      }}
      onFocus={(e) => e.currentTarget.select()}
      className={`w-full rounded border border-blue-500 px-1.5 py-0.5 text-[12.5px] outline-none ring-2 ring-blue-500/15 ${className}`}
    />
  );
}

export function MediaLibraryPage() {
  const { media, folders } = useMarketing();
  const [folder, setFolder] = useState("All");
  const [type, setType] = useState<"all" | MediaType>("all");
  const [q, setQ] = useState("");
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null);
  const [renamingItem, setRenamingItem] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const list = media
    .filter((m) => (folder === "All" ? true : m.folder === folder))
    .filter((m) => (type === "all" ? true : m.type === type))
    .filter((m) => m.name.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => b.addedAt - a.addedAt);

  const countIn = (f: string) => (f === "All" ? media.length : media.filter((m) => m.folder === f).length);

  const upload = (files: FileList | File[] | null) => {
    if (!files) return;
    const arr = Array.from(files);
    if (!arr.length) return;
    const target = folder === "All" ? folders[0] : folder;
    mutate((d) => {
      arr.forEach((f) => {
        d.media.unshift({
          id: uid(),
          name: f.name,
          type: typeOf(f),
          folder: target,
          size: fmtSize(f.size),
          url: f.type.startsWith("image/") || f.type.startsWith("video/") ? URL.createObjectURL(f) : undefined,
          addedAt: Date.now(),
        });
      });
    });
  };

  const createFolder = () => {
    let name = "Untitled folder";
    let i = 2;
    while (folders.includes(name)) name = `Untitled folder ${i++}`;
    mutate((d) => {
      d.folders.push(name);
    });
    setFolder(name);
    setRenamingFolder(name);
  };

  const renameFolder = (from: string, to: string) => {
    if (from === to) return setRenamingFolder(null);
    mutate((d) => {
      if (d.folders.includes(to)) return;
      d.folders = d.folders.map((f) => (f === from ? to : f));
      d.media.forEach((m) => {
        if (m.folder === from) m.folder = to;
      });
    });
    setFolder((cur) => (cur === from ? to : cur));
    setRenamingFolder(null);
  };

  const deleteFolder = (name: string) => {
    mutate((d) => {
      d.folders = d.folders.filter((f) => f !== name);
      d.media = d.media.filter((m) => m.folder !== name);
    });
    setFolder("All");
  };

  return (
    <MarketingShell title="Media">
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-6">
        <aside className="w-56 shrink-0">
          <div className="flex items-center justify-between px-1 pb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Folders</p>
            <button
              onClick={createFolder}
              aria-label="New folder"
              title="New folder"
              className="text-zinc-400 hover:text-zinc-800"
            >
              <FolderPlus size={15} />
            </button>
          </div>

          <button
            onClick={() => setFolder("All")}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12.5px] ${
              folder === "All" ? "bg-blue-50 font-semibold text-blue-700" : "text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <Folder size={14} className={folder === "All" ? "text-blue-600" : "text-zinc-400"} />
            <span className="flex-1">All media</span>
            <span className="text-[10.5px] text-zinc-400">{countIn("All")}</span>
          </button>

          {folders.map((f) => {
            const active = folder === f;
            if (renamingFolder === f) {
              return (
                <div key={f} className="px-2 py-1">
                  <RenameField
                    value={f}
                    onSave={(v) => renameFolder(f, v)}
                    onCancel={() => setRenamingFolder(null)}
                  />
                </div>
              );
            }
            return (
              <div
                key={f}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/media-id");
                  if (id)
                    mutate((d) => {
                      const m = d.media.find((x) => x.id === id);
                      if (m) m.folder = f;
                    });
                }}
                className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] ${
                  active ? "bg-blue-50 font-semibold text-blue-700" : "text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <button onClick={() => setFolder(f)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                  <Folder size={14} className={active ? "text-blue-600" : "text-zinc-400"} />
                  <span className="min-w-0 flex-1 truncate">{f}</span>
                  <span className="text-[10.5px] text-zinc-400">{countIn(f)}</span>
                </button>
                <button
                  onClick={() => setRenamingFolder(f)}
                  aria-label={`Rename ${f}`}
                  className="opacity-0 transition-opacity hover:text-zinc-900 group-hover:opacity-100"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => deleteFolder(f)}
                  aria-label={`Delete folder ${f}`}
                  className="opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}

          <button
            onClick={createFolder}
            className="mt-2 flex w-full items-center gap-1.5 rounded-md border border-dashed border-zinc-300 px-2 py-2 text-[12px] font-medium text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
          >
            <FolderPlus size={14} />
            New folder
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search media"
                className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-3 text-[13px] outline-none focus:border-blue-600"
              />
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 rounded-md bg-zinc-900 px-3.5 py-2 text-[12.5px] font-semibold text-white hover:opacity-90"
            >
              <Upload size={14} />
              Upload
            </button>
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                upload(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          <div className="mt-3 flex gap-1 rounded-md bg-zinc-100 p-1 text-[12.5px]">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded px-3 py-1.5 font-medium capitalize transition-colors ${
                  type === t ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {t === "all" ? "All files" : `${t}s`}
              </button>
            ))}
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              upload(e.dataTransfer.files);
            }}
            className={`mt-4 rounded-lg border-2 border-dashed p-4 transition-colors ${
              dragging ? "border-blue-500 bg-blue-50/60" : "border-transparent"
            }`}
          >
            <p className="pb-3 text-[12px] text-zinc-400">
              Drop files here to add them to {folder === "All" ? folders[0] : folder}.
            </p>

            <div className="grid gap-4 pb-10 sm:grid-cols-3 lg:grid-cols-4">
              {list.map((m) => (
                <div
                  key={m.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/media-id", m.id)}
                  className="group overflow-hidden rounded-lg border border-zinc-200 bg-white"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-zinc-50">
                    <MediaThumb item={m} />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      {renamingItem === m.id ? (
                        <RenameField
                          value={m.name}
                          onSave={(v) => {
                            mutate((d) => {
                              const it = d.media.find((x) => x.id === m.id);
                              if (it) it.name = v;
                            });
                            setRenamingItem(null);
                          }}
                          onCancel={() => setRenamingItem(null)}
                        />
                      ) : (
                        <button
                          onDoubleClick={() => setRenamingItem(m.id)}
                          className="block w-full truncate text-left text-[12.5px] font-medium text-zinc-800"
                          title="Double-click to rename"
                        >
                          {m.name}
                        </button>
                      )}
                      <p className="truncate text-[11px] text-zinc-400">
                        {m.folder} · {m.size}
                        {m.dims ? ` · ${m.dims}` : ""}
                      </p>
                    </div>
                    <button
                      aria-label={`Rename ${m.name}`}
                      onClick={() => setRenamingItem(m.id)}
                      className="text-zinc-300 transition-colors hover:text-zinc-700"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      aria-label={`Delete ${m.name}`}
                      onClick={() =>
                        mutate((d) => {
                          d.media = d.media.filter((x) => x.id !== m.id);
                        })
                      }
                      className="text-zinc-300 transition-colors hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
              {list.length === 0 && (
                <p className="col-span-full py-16 text-center text-[13px] text-zinc-400">
                  Nothing here yet — drop files in or use Upload.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
