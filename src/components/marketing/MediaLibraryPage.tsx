import { useRef, useState } from "react";
import { Search, Trash2, Upload, FolderPlus } from "lucide-react";
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

export function MediaLibraryPage() {
  const { media, folders } = useMarketing();
  const [folder, setFolder] = useState("All");
  const [type, setType] = useState<"all" | MediaType>("all");
  const [q, setQ] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const list = media
    .filter((m) => (folder === "All" ? true : m.folder === folder))
    .filter((m) => (type === "all" ? true : m.type === type))
    .filter((m) => m.name.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => b.addedAt - a.addedAt);

  const upload = (files: FileList | null) => {
    if (!files?.length) return;
    const target = folder === "All" ? folders[0] : folder;
    mutate((d) => {
      Array.from(files).forEach((f) => {
        d.media.unshift({
          id: uid(),
          name: f.name,
          type: typeOf(f),
          folder: target,
          size: fmtSize(f.size),
          url: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
          addedAt: Date.now(),
        });
      });
    });
  };

  return (
    <MarketingShell title="Media">
      <div className="mx-auto max-w-6xl px-6 py-6">
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
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="rounded-md border border-zinc-200 bg-white px-2.5 py-2 text-[13px] outline-none focus:border-blue-600"
          >
            <option>All</option>
            {folders.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
          <button
            onClick={() => {
              const name = window.prompt("New folder name");
              if (name?.trim())
                mutate((d) => {
                  if (!d.folders.includes(name.trim())) d.folders.push(name.trim());
                });
            }}
            className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-2 text-[12.5px] font-medium text-zinc-700 hover:border-zinc-300"
          >
            <FolderPlus size={14} className="text-zinc-400" />
            New folder
          </button>
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

        <div className="mt-5 grid gap-4 pb-10 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((m) => (
            <div key={m.id} className="group overflow-hidden rounded-lg border border-zinc-200 bg-white">
              <div className="aspect-[4/3] overflow-hidden bg-zinc-50">
                <MediaThumb item={m} />
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium text-zinc-800">{m.name}</p>
                  <p className="truncate text-[11px] text-zinc-400">
                    {m.folder} · {m.size}
                    {m.dims ? ` · ${m.dims}` : ""}
                  </p>
                </div>
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
              Nothing here yet — upload a file to get started.
            </p>
          )}
        </div>
      </div>
    </MarketingShell>
  );
}
