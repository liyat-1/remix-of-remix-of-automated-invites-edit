import { useState } from "react";
import { X, RotateCcw, Check } from "lucide-react";
import { TextEditor } from "./TextEditor";
import { EmailEditor } from "./EmailEditor";
import {
  AUDIENCE_LABEL,
  STRATEGIES,
  defaultVariant,
  editVariant,
  mutate,
  strategyHasEmail,
  useMarketing,
  type AudienceKey,
  type Strategy,
} from "@/lib/marketing";

/** Full-screen editor for one campaign: audience tabs × channel tabs. */
export function CampaignEditor({ id, onClose }: { id: string; onClose: () => void }) {
  const { campaigns } = useMarketing();
  const campaign = campaigns.find((c) => c.id === id);
  const [audience, setAudience] = useState<AudienceKey>("direct");
  const [channel, setChannel] = useState<"text" | "email">("text");

  if (!campaign) return null;
  const variant = campaign.variants[audience];
  const emailOn = strategyHasEmail(campaign.strategy);
  const activeChannel = emailOn ? channel : "text";

  const update = (fn: (v: typeof variant) => void) =>
    mutate((d) => {
      const c = d.campaigns.find((x) => x.id === id)!;
      fn(c.variants[audience]);
      c.variants[audience].customized = true;
    });

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#f5f6f7]">
      <header className="flex items-center justify-between gap-4 border-b border-zinc-200 bg-white px-6 py-3.5">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-zinc-400">Campaign</p>
          <h2 className="truncate text-[17px] font-semibold tracking-tight">{campaign.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={campaign.strategy}
            onChange={(e) =>
              mutate((d) => {
                d.campaigns.find((x) => x.id === id)!.strategy = e.target.value as Strategy;
              })
            }
            className="rounded-md border border-zinc-200 px-2.5 py-2 text-[12.5px] outline-none focus:border-blue-600"
          >
            {STRATEGIES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-md bg-zinc-900 px-3.5 py-2 text-[12.5px] font-semibold text-white hover:opacity-90"
          >
            <Check size={14} />
            Done
          </button>
          <button onClick={onClose} aria-label="Close" className="text-zinc-400 hover:text-zinc-700">
            <X size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-4 border-b border-zinc-200 bg-white px-6 py-2.5">
        <div className="flex gap-1 rounded-md bg-zinc-100 p-1">
          {(["direct", "ota"] as AudienceKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setAudience(k)}
              className={`rounded px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                audience === k ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {AUDIENCE_LABEL[k]}
              {campaign.variants[k].customized && (
                <span className="ml-1.5 inline-block size-1.5 rounded-full bg-blue-600 align-middle" />
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-1 rounded-md bg-zinc-100 p-1">
          <button
            onClick={() => setChannel("text")}
            className={`rounded px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
              activeChannel === "text" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Text
          </button>
          <button
            onClick={() => emailOn && setChannel("email")}
            disabled={!emailOn}
            title={emailOn ? undefined : "Enable an email strategy to edit the email"}
            className={`rounded px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
              activeChannel === "email"
                ? "bg-white text-zinc-900 shadow-sm"
                : emailOn
                  ? "text-zinc-500 hover:text-zinc-800"
                  : "cursor-not-allowed text-zinc-300"
            }`}
          >
            Email
          </button>
        </div>

        <button
          onClick={() =>
            mutate((d) => {
              d.campaigns.find((x) => x.id === id)!.variants[audience] = defaultVariant(id, audience);
            })
          }
          className="ml-auto flex items-center gap-1.5 text-[12.5px] text-zinc-500 hover:text-zinc-800"
        >
          <RotateCcw size={13} />
          Reset {AUDIENCE_LABEL[audience].toLowerCase()}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-5xl rounded-lg border border-zinc-200 bg-white p-6">
          {activeChannel === "text" ? (
            <TextEditor value={variant.text} onChange={(text) => update((v) => (v.text = text))} />
          ) : (
            <EmailEditor value={variant.email} onChange={(email) => update((v) => (v.email = email))} />
          )}
        </div>
      </div>
    </div>
  );
}
