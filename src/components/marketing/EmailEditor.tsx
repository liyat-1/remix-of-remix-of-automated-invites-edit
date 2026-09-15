import { useState } from "react";
import { LayoutTemplate } from "lucide-react";
import { TemplateLibrary } from "./TemplateLibrary";
import {
  LAYOUTS,
  renderPreview,
  useMarketing,
  type EmailContent,
  type EmailLayout,
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

/** Email channel editor: template, layout, copy and a live desktop preview. */
export function EmailEditor({
  value,
  onChange,
}: {
  value: EmailContent;
  onChange: (v: EmailContent) => void;
}) {
  const { templates } = useMarketing();
  const [lib, setLib] = useState(false);
  const template = templates.find((t) => t.id === value.templateId) ?? templates[0];
  const set = <K extends keyof EmailContent>(k: K, v: EmailContent[K]) => onChange({ ...value, [k]: v });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-md border border-zinc-200 px-3.5 py-3">
          <div>
            <p className="text-[12px] uppercase tracking-wide text-zinc-500">Template</p>
            <p className="text-[13.5px] font-semibold text-zinc-900">{template?.name ?? "None"}</p>
          </div>
          <button
            onClick={() => setLib(true)}
            className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-[12.5px] font-medium text-zinc-700 hover:border-zinc-300"
          >
            <LayoutTemplate size={14} className="text-zinc-400" />
            Change
          </button>
        </div>

        <div>
          <span className="text-[12px] font-semibold uppercase tracking-wide text-zinc-500">Layout</span>
          <div className="mt-1.5 flex flex-wrap gap-1 rounded-md bg-zinc-100 p-1">
            {LAYOUTS.map((l) => (
              <button
                key={l.value}
                onClick={() => set("layout", l.value as EmailLayout)}
                className={`rounded px-2.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                  value.layout === l.value
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

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
      </div>

      <div className="rounded-lg bg-zinc-100 p-5">
        <p className="mb-3 text-[11.5px] uppercase tracking-wide text-zinc-500">Preview</p>
        <div className="mx-auto max-w-[460px] overflow-hidden rounded-md bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-5 py-3">
            <p className="text-[13px] font-semibold text-zinc-900">{renderPreview(value.subject)}</p>
            <p className="text-[12px] text-zinc-400">{renderPreview(value.preheader)}</p>
          </div>
          {value.layout !== "text_first" && (
            <div
              className="h-32"
              style={{
                background: `linear-gradient(135deg, ${template?.accent ?? "#2563eb"}33, ${
                  template?.accent ?? "#2563eb"
                }0d)`,
              }}
            />
          )}
          <div className={`px-6 py-6 ${value.layout === "full_width" ? "text-center" : "text-left"}`}>
            <h3 className="text-[20px] font-semibold leading-snug text-zinc-900">
              {renderPreview(value.heading)}
            </h3>
            <p className="mt-2.5 whitespace-pre-wrap text-[13.5px] leading-relaxed text-zinc-600">
              {renderPreview(value.body)}
            </p>
            <a
              href={value.ctaUrl}
              onClick={(e) => e.preventDefault()}
              className={`mt-5 inline-block rounded px-5 py-3 text-[13px] font-semibold text-white ${
                value.layout === "full_width" ? "w-full text-center" : ""
              }`}
              style={{ background: template?.accent ?? "#2563eb" }}
            >
              {value.ctaLabel}
            </a>
          </div>
          {value.layout === "text_first" && (
            <div
              className="h-28"
              style={{
                background: `linear-gradient(135deg, ${template?.accent ?? "#2563eb"}33, ${
                  template?.accent ?? "#2563eb"
                }0d)`,
              }}
            />
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
