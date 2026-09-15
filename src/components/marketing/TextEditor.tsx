import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { TagTextArea } from "@/components/campaign/TagTextArea";
import { SmsPreview } from "@/components/editor/SmsPreview";
import { MediaPicker, MediaThumb } from "./MediaPicker";
import { MERGE_TAGS, useMarketing, type TextContent } from "@/lib/marketing";

/** Text (SMS) channel editor with merge tags, media attachment and live preview. */
export function TextEditor({
  value,
  onChange,
}: {
  value: TextContent;
  onChange: (v: TextContent) => void;
}) {
  const { media } = useMarketing();
  const ref = useRef<HTMLDivElement | null>(null);
  const [pick, setPick] = useState(false);
  const attached = media.find((m) => m.id === value.mediaId) ?? null;
  const chars = value.message.length;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <label className="text-[12px] font-semibold uppercase tracking-wide text-zinc-500">Message</label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {MERGE_TAGS.map((t) => (
            <button
              key={t.token}
              type="button"
              onClick={() => (ref.current as any)?.__insertToken?.(t.token)}
              className={`rounded px-2 py-1 text-[11.5px] font-semibold transition-colors ${t.chip}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-2">
          <TagTextArea
            value={value.message}
            onChange={(message) => onChange({ ...value, message })}
            tags={MERGE_TAGS}
            inputRef={ref}
            placeholder="Write your text message"
            minHeight={150}
          />
        </div>
        <p className="mt-1.5 text-[11.5px] text-zinc-400">
          {chars} characters · {Math.max(1, Math.ceil(chars / 160))} segment
          {chars > 160 ? "s" : ""}
        </p>

        <div className="mt-6">
          <label className="text-[12px] font-semibold uppercase tracking-wide text-zinc-500">
            Attachment
          </label>
          {attached ? (
            <div className="mt-2 flex items-center gap-3 rounded-md border border-zinc-200 p-2.5">
              <div className="size-12 overflow-hidden rounded bg-zinc-50">
                <MediaThumb item={attached} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{attached.name}</p>
                <p className="text-[11.5px] text-zinc-400">{attached.size}</p>
              </div>
              <button
                onClick={() => onChange({ ...value, mediaId: null })}
                className="text-zinc-400 hover:text-zinc-700"
                aria-label="Remove attachment"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setPick(true)}
              className="mt-2 flex items-center gap-2 rounded-md border border-dashed border-zinc-300 px-3.5 py-2.5 text-[13px] text-zinc-600 hover:border-zinc-400"
            >
              <ImagePlus size={16} className="text-zinc-400" />
              Add from media library
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-center lg:justify-start">
        <SmsPreview
          message={value.message}
          imageUrl={attached?.type === "image" ? attached.url : null}
          sender="Holiday Inn"
          scale={0.62}
        />
      </div>

      <MediaPicker
        open={pick}
        onClose={() => setPick(false)}
        onSelect={(m) => onChange({ ...value, mediaId: m.id })}
      />
    </div>
  );
}
