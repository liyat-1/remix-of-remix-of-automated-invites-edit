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

  const update = (fn: (v: typeof variant) => void) => editVariant(id, audience, fn);

  const seg = (active: boolean, disabled = false) =>
    `rounded px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
      active
        ? "bg-card text-card-foreground shadow-card"
        : disabled
          ? "cursor-not-allowed text-muted-foreground/50"
          : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-canvas">
      <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3.5 sm:px-6">
        <div className="min-w-0">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Campaign</p>
          <h2 className="truncate text-[17px] font-semibold tracking-tight text-card-foreground">{campaign.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={campaign.strategy}
            onChange={(e) =>
              mutate((d) => {
                d.campaigns.find((x) => x.id === id)!.strategy = e.target.value as Strategy;
              })
            }
            aria-label="Channel strategy"
            className="rounded-md border border-border bg-background px-2.5 py-2 text-[12.5px] text-foreground outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            {STRATEGIES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-2 text-[12.5px] font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            <Check size={14} />
            Done
          </button>
          <button onClick={onClose} aria-label="Close" className="p-1 text-muted-foreground transition-colors hover:text-foreground">
            <X size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card px-4 py-2.5 sm:px-6">
        <div className="flex gap-1 rounded-md bg-muted p-1">
          {(["direct", "ota"] as AudienceKey[]).map((k) => (
            <button key={k} onClick={() => setAudience(k)} className={seg(audience === k)}>
              {AUDIENCE_LABEL[k]}
              {campaign.variants[k].customized && (
                <span className="ml-1.5 inline-block size-1.5 rounded-full bg-brand align-middle" />
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-1 rounded-md bg-muted p-1">
          <button onClick={() => setChannel("text")} className={seg(activeChannel === "text")}>
            Text
          </button>
          <button
            onClick={() => emailOn && setChannel("email")}
            disabled={!emailOn}
            title={emailOn ? undefined : "Enable an email strategy to edit the email"}
            className={seg(activeChannel === "email", !emailOn)}
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
          className="ml-auto flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw size={13} />
          Reset {AUDIENCE_LABEL[audience].toLowerCase()}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto max-w-5xl rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
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
