import { Clock, Mail, MessageSquare, Pencil } from "lucide-react";
import {
  AUDIENCE_LABEL,
  customizedCount,
  fullTime,
  initialsOf,
  lastEdit,
  renderPreview,
  strategyHasEmail,
  timeAgo,
  type MarketingCampaign,
} from "@/lib/marketing";

export function CampaignCard({
  campaign,
  selected,
  selectable = false,
  onSelect,
  onToggle,
  onEdit,
}: {
  campaign: MarketingCampaign;
  selected: boolean;
  selectable?: boolean;
  onSelect: (v: boolean) => void;
  onToggle: (v: boolean) => void;
  onEdit: () => void;
}) {
  const custom = customizedCount(campaign);
  const email = strategyHasEmail(campaign.strategy);
  const edit = lastEdit(campaign);

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift ${
        selected ? "border-brand ring-2 ring-brand/25" : "border-border hover:border-brand/40"
      }`}
    >
      <div className="flex items-start gap-3 px-4 pt-4">
        {selectable && (
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(e.target.checked)}
            aria-label={`Select ${campaign.name}`}
            className="mt-1 size-4 shrink-0 accent-brand"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold tracking-tight text-card-foreground">{campaign.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Clock size={12} className="shrink-0 text-muted-foreground" />
            <span className="truncate">{campaign.timing}</span>
          </p>
        </div>

        <button
          role="switch"
          aria-checked={campaign.enabled}
          aria-label={`${campaign.enabled ? "Disable" : "Enable"} ${campaign.name}`}
          onClick={() => onToggle(!campaign.enabled)}
          className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors ${
            campaign.enabled ? "bg-brand" : "bg-muted-foreground/30"
          }`}
        >
          <span
            className={`absolute top-0.5 size-4 rounded-full bg-card shadow transition-all ${
              campaign.enabled ? "left-[18px]" : "left-0.5"
            }`}
          />
        </button>
      </div>

      <p className="mt-3 line-clamp-2 px-4 text-[12.5px] leading-relaxed text-muted-foreground">
        {renderPreview(campaign.variants.direct.text.message)}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 px-4">
        <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
          <MessageSquare size={11} /> Text
        </span>
        {email && (
          <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
            <Mail size={11} /> Email
          </span>
        )}
        {custom > 0 && (
          <span className="rounded bg-brand-soft px-2 py-1 text-[11px] font-medium text-brand">
            {custom} customised
          </span>
        )}

        {edit && (
          <span className="group relative ml-auto inline-flex items-center gap-1.5">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-foreground text-[9px] font-semibold text-background">
              {initialsOf(edit.by)}
            </span>
            <span className="text-[11px] text-muted-foreground">Updated {timeAgo(edit.at)}</span>
            <span className="pointer-events-none absolute bottom-7 right-0 z-10 w-56 rounded-md bg-foreground px-2.5 py-2 text-[11.5px] leading-snug text-background opacity-0 shadow-lift transition-opacity group-hover:opacity-100">
              Edited by {edit.by} · {timeAgo(edit.at)}
              <span className="mt-0.5 block text-background/70">
                {AUDIENCE_LABEL[edit.audience]} · {fullTime(edit.at)}
              </span>
            </span>
          </span>
        )}
      </div>

      <button
        onClick={onEdit}
        className="mt-4 flex items-center justify-center gap-1.5 border-t border-border py-2.5 text-[12.5px] font-semibold text-card-foreground transition-colors hover:bg-muted/60"
      >
        <Pencil size={13} className="text-muted-foreground" />
        Edit content
      </button>
    </div>
  );
}
