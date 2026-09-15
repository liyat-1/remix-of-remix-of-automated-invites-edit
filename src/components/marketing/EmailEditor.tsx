import { useState } from "react";
import { LayoutTemplate, Rows3 } from "lucide-react";
import { TemplateLibrary } from "./TemplateLibrary";
import { LayoutLibrary, LayoutThumb } from "./LayoutLibrary";
import { MediaStrip } from "./MediaStrip";
import { MediaThumb } from "./MediaPicker";
import {
  LAYOUT_LABEL,
  normalizeLayout,
  renderPreview,
  useMarketing,
  type EmailContent,
  type EmailLayout,
  type MediaItem,
} from "@/lib/marketing";

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-md border border-zinc-200 px-3 py-2 text-[13.5px] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
      />
    </label>
  );
}

/** Tiny wireframe of the chosen template, shown on the template card. */
function TemplateThumb({ accent }: { accent: string }) {
  return (
    <div className="flex h-[74px] flex-col gap-1.5 overflow-hidden rounded bg-white p-2 shadow-sm">
      <div className="rounded-sm" style={{ background: accent, opacity: 0.2, height: 18 }} />
      <div className="h-2 w-3/4 rounded-sm bg-zinc-300" />
      <div className="h-1.5 rounded-sm bg-zinc-200" />
      <div className="h-1.5 w-2/3 rounded-sm bg-zinc-200" />
      <div className="mt-auto h-2.5 w-10 rounded-sm" style={{ background: accent }} />
    </div>
  );
}


function Banner({ item, accent, height }: { item?: MediaItem; accent: string; height: number }) {
  if (item) {
    return (
      <div className="overflow-hidden" style={{ height }}>
        <MediaThumb item={item} />
      </div>
    );
  }
  return (
    <div
      style={{ height, background: `linear-gradient(135deg, ${accent}33, ${accent}0d)` }}
      aria-hidden
    />
  );
}

/** Email channel editor: template first, then layout, copy, media and preview. */
export function EmailEditor({
  value,
  onChange,
}: {
  value: EmailContent;
  onChange: (v: EmailContent) => void;
}) {
  const { templates, media } = useMarketing();
  const [lib, setLib] = useState(false);
  const template = templates.find((t) => t.id === value.templateId) ?? templates[0];
  const accent = template?.accent ?? "#2563eb";
  const layout = normalizeLayout(String(value.layout));
  const ids = value.mediaIds ?? [];
  const images = ids
    .map((id) => media.find((m) => m.id === id))
    .filter((m): m is MediaItem => !!m && m.type === "image" && !!m.url);

  const set = <K extends keyof EmailContent>(k: K, v: EmailContent[K]) => onChange({ ...value, [k]: v });

  const centred = layout === "full_bleed";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-5">
        {/* Step 1 — template */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">Step 1</p>
          <div className="mt-1.5 flex items-center justify-between rounded-md border border-zinc-200 px-3.5 py-3">
            <div className="min-w-0">
              <p className="text-[12px] uppercase tracking-wide text-zinc-500">Template</p>
              <p className="truncate text-[13.5px] font-semibold text-zinc-900">
                {template?.name ?? "None"}
              </p>
            </div>
            <button
              onClick={() => setLib(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-[12.5px] font-medium text-zinc-700 hover:border-zinc-300"
            >
              <LayoutTemplate size={14} className="text-zinc-400" />
              {template ? "Change" : "Choose"}
            </button>
          </div>
        </section>

        {/* Step 2 — layout */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">Step 2</p>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-zinc-500">Layout</span>
            <span className="text-[11.5px] text-zinc-400">{LAYOUT_LABEL(layout)}</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {LAYOUT_PRESETS.map((l) => {
              const active = layout === l.value;
              return (
                <button
                  key={l.value}
                  onClick={() => set("layout", l.value)}
                  title={l.desc}
                  aria-pressed={active}
                  className={`relative rounded-lg border p-2 text-left transition-all hover:-translate-y-0.5 ${
                    active ? "border-blue-600 ring-2 ring-blue-600/20" : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <div className="rounded bg-zinc-50 p-1.5">
                    <LayoutThumb layout={l.value} accent={accent} />
                  </div>
                  <p className="mt-1.5 truncate text-[11.5px] font-medium text-zinc-700">{l.label}</p>
                  {active && (
                    <span className="absolute right-2 top-2 grid size-4 place-items-center rounded-full bg-blue-600 text-white">
                      <Check size={10} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 3 — content */}
        <section className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">Step 3</p>
          <Field label="Subject" value={value.subject} onChange={(v) => set("subject", v)} />
          <Field label="Preheader" value={value.preheader} onChange={(v) => set("preheader", v)} />
          <Field label="Heading" value={value.heading} onChange={(v) => set("heading", v)} />

          <label className="block">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-zinc-500">Body</span>
            <textarea
              value={value.body}
              onChange={(e) => set("body", e.target.value)}
              rows={5}
              className="mt-1.5 w-full rounded-md border border-zinc-200 px-3 py-2 text-[13.5px] leading-relaxed outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Button label" value={value.ctaLabel} onChange={(v) => set("ctaLabel", v)} />
            <Field label="Button link" value={value.ctaUrl} onChange={(v) => set("ctaUrl", v)} />
          </div>

          <MediaStrip
            ids={ids}
            onChange={(mediaIds) => set("mediaIds", mediaIds)}
            types={["image"]}
            label="Images"
          />
        </section>
      </div>

      {/* Live preview */}
      <div className="rounded-lg bg-zinc-100 p-5 lg:sticky lg:top-4 lg:self-start">
        <p className="mb-3 text-[11.5px] uppercase tracking-wide text-zinc-500">
          Live preview · {LAYOUT_LABEL(layout)}
        </p>
        <div className="mx-auto max-w-[460px] overflow-hidden rounded-md bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-5 py-3">
            <p className="text-[13px] font-semibold text-zinc-900">{renderPreview(value.subject)}</p>
            <p className="text-[12px] text-zinc-400">{renderPreview(value.preheader)}</p>
          </div>

          {(layout === "hero_top" || layout === "gallery_three") && (
            <Banner item={images[0]} accent={accent} height={128} />
          )}

          {layout === "full_bleed" ? (
            <div
              className="px-6 py-10 text-center"
              style={{ background: `linear-gradient(135deg, ${accent}2e, ${accent}0d)` }}
            >
              <h3 className="text-[22px] font-semibold leading-snug text-zinc-900">
                {renderPreview(value.heading)}
              </h3>
              <p className="mx-auto mt-2.5 max-w-[320px] whitespace-pre-wrap text-[13.5px] leading-relaxed text-zinc-600">
                {renderPreview(value.body)}
              </p>
              <span
                className="mt-5 inline-block rounded px-6 py-3 text-[13px] font-semibold text-white"
                style={{ background: accent }}
              >
                {value.ctaLabel}
              </span>
            </div>
          ) : layout === "split" ? (
            <div className="flex gap-4 px-6 py-6">
              <div className="w-2/5 shrink-0 overflow-hidden rounded">
                <Banner item={images[0]} accent={accent} height={130} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[17px] font-semibold leading-snug text-zinc-900">
                  {renderPreview(value.heading)}
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-zinc-600">
                  {renderPreview(value.body)}
                </p>
                <span
                  className="mt-4 inline-block rounded px-4 py-2.5 text-[12.5px] font-semibold text-white"
                  style={{ background: accent }}
                >
                  {value.ctaLabel}
                </span>
              </div>
            </div>
          ) : (
            <div className={`px-6 py-6 ${centred ? "text-center" : "text-left"}`}>
              <h3 className="text-[20px] font-semibold leading-snug text-zinc-900">
                {renderPreview(value.heading)}
              </h3>
              <p className="mt-2.5 whitespace-pre-wrap text-[13.5px] leading-relaxed text-zinc-600">
                {renderPreview(value.body)}
              </p>

              {layout === "gallery_two" && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[0, 1].map((i) => (
                    <div key={i} className="overflow-hidden rounded">
                      <Banner item={images[i]} accent={accent} height={90} />
                    </div>
                  ))}
                </div>
              )}

              {layout === "gallery_three" && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="overflow-hidden rounded">
                      <Banner item={images[i + 1]} accent={accent} height={70} />
                    </div>
                  ))}
                </div>
              )}

              <span
                className="mt-5 inline-block rounded px-5 py-3 text-[13px] font-semibold text-white"
                style={{ background: accent }}
              >
                {value.ctaLabel}
              </span>
            </div>
          )}

          <div className="border-t border-zinc-100 px-6 py-4 text-[11px] text-zinc-400">
            Holiday Inn New York City – Times Square · Unsubscribe
          </div>
        </div>
      </div>

      <TemplateLibrary
        open={lib}
        onClose={() => setLib(false)}
        selectedId={value.templateId}
        onSelect={(t) =>
          onChange({
            ...value,
            templateId: t.id,
            layout: t.layout,
            subject: t.heading,
            heading: t.heading,
            body: t.body,
            ctaLabel: t.ctaLabel,
          })
        }
      />
    </div>
  );
}
