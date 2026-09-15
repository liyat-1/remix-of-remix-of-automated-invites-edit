import { Clock, Mail, MessageSquare, Pencil } from "lucide-react";
import {
  STRATEGY_LABEL,
  customizedCount,
  renderPreview,
  strategyHasEmail,
  type MarketingCampaign,
} from "@/lib/marketing";

export function CampaignCard({
  campaign,
  selected,
  onSelect,
  onToggle,
  onEdit,
}: {
  campaign: MarketingCampaign;
  selected: boolean;
  onSelect: (v: boolean) => void;
  onToggle: (v: boolean) => void;
  onEdit: () => void;
}) {
  const custom = customizedCount(campaign);
  const email = strategyHasEmail(campaign.strategy);

  return (
    <div
      className={`flex flex-col rounded-lg border bg-white transition-colors ${
        selected ? "border-blue-500 ring-2 ring-blue-500/15" : "border-zinc-200 hover:border-zinc-300"
      }`}
    >
      <div className="flex items-start gap-3 px-4 pt-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          aria-label={`Select ${campaign.name}`}
          className="mt-1 size-4 accent-blue-600"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-zinc-900">{campaign.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-zinc-500">
            <Clock size={12} className="shrink-0 text-zinc-400" />
            <span className="truncate">{campaign.timing}</span>
          </p>
        </div>
        <button
          role="switch"
          aria-checked={campaign.enabled}
          aria-label={`${campaign.enabled ? "Disable" : "Enable"} ${campaign.name}`}
          onClick={() => onToggle(!campaign.enabled)}
          className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
            campaign.enabled ? "bg-blue-600" : "bg-zinc-200"
          }`}
        >
          <span
            className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all ${
              campaign.enabled ? "left-[18px]" : "left-0.5"
            }`}
          />
        </button>
      </div>

      <p className="mt-3 line-clamp-2 px-4 text-[12.5px] leading-relaxed text-zinc-500">
        {renderPreview(campaign.variants.direct.text.message)}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 px-4">
        <span className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-600">
          <MessageSquare size={11} /> Text
        </span>
        {email && (
          <span className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-600">
            <Mail size={11} /> Email
          </span>
        )}
        <span className="rounded bg-zinc-50 px-2 py-1 text-[11px] text-zinc-500 ring-1 ring-inset ring-zinc-200">
          {STRATEGY_LABEL[campaign.strategy]}
        </span>
        {custom > 0 && (
          <span className="rounded bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
            {custom} customised
          </span>
        )}
      </div>

      <button
        onClick={onEdit}
        className="mt-4 flex items-center justify-center gap-1.5 border-t border-zinc-100 py-2.5 text-[12.5px] font-semibold text-zinc-700 hover:bg-zinc-50"
      >
        <Pencil size={13} className="text-zinc-400" />
        Edit content
      </button>
    </div>
  );
}
