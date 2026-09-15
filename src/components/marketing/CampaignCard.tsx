import { Clock, Ellipsis, FlaskConical, Mail, MessageSquare, Pencil, Power, RotateCcw, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  AUDIENCE_LABEL,
  STRATEGY_LABEL,
  fullTime,
  initialsOf,
  lastEdit,
  timeAgo,
  type MarketingCampaign,
  type Promotion,
} from "@/lib/marketing";

function AudienceState({ campaign, audience }: { campaign: MarketingCampaign; audience: "direct" | "ota" }) {
  const state = campaign.variants[audience].customization;
  return (
    <div className="flex items-center justify-between gap-3 py-1 text-[11.5px]">
      <span className="font-medium text-card-foreground">{audience === "direct" ? "Direct" : "OTA"}</span>
      <span className="text-muted-foreground">
        Text · <span className={state.text ? "font-medium text-brand" : ""}>{state.text ? "Customized" : "Default"}</span>
        <span className="mx-1.5 text-border">/</span>
        Email · <span className={state.email ? "font-medium text-brand" : ""}>{state.email ? "Customized" : "Default"}</span>
      </span>
    </div>
  );
}

export function CampaignCard({
  campaign,
  promotion,
  selected,
  selectable = false,
  onSelect,
  onToggle,
  onEdit,
  onTest,
  onPromotion,
  onRevert,
}: {
  campaign: MarketingCampaign;
  promotion: Promotion | null;
  selected: boolean;
  selectable?: boolean;
  onSelect: (value: boolean) => void;
  onToggle: (value: boolean) => void;
  onEdit: () => void;
  onTest: () => void;
  onPromotion: () => void;
  onRevert: () => void;
}) {
  const edit = lastEdit(campaign);
  const hasCustomization = Object.values(campaign.variants).some((variant) => variant.customization.text || variant.customization.email);

  return (
    <article className={`flex min-h-[390px] flex-col overflow-hidden rounded-lg border bg-card shadow-card transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:shadow-lift ${selected ? "border-brand ring-2 ring-brand/20" : "border-border hover:border-brand/40"}`}>
      <div className="flex items-start gap-3 px-4 pt-4">
        {selectable && (
          <input type="checkbox" checked={selected} onChange={(event) => onSelect(event.target.checked)} aria-label={`Select ${campaign.name}`} className="mt-1 size-4 shrink-0 accent-brand" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[14px] font-semibold text-card-foreground">{campaign.name}</h3>
            <span className={`size-1.5 shrink-0 rounded-full ${campaign.enabled ? "bg-brand" : "bg-muted-foreground/35"}`} />
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-muted-foreground"><Clock size={12} /><span className="truncate">{campaign.timing}</span></p>
        </div>
        <span className={`text-[10px] font-semibold uppercase text-muted-foreground ${campaign.enabled ? "text-brand" : ""}`}>{campaign.enabled ? "On" : "Off"}</span>
      </div>

      <p className="mt-3 min-h-[42px] px-4 text-[12.5px] leading-relaxed text-muted-foreground">{campaign.purpose}</p>

      <div className="mx-4 mt-4 border-y border-border py-3">
        <p className="flex items-center gap-1.5 text-[12px] font-semibold text-card-foreground">
          {campaign.strategy === "text" ? <MessageSquare size={13} className="text-brand" /> : <Mail size={13} className="text-brand" />}
          {STRATEGY_LABEL[campaign.strategy]}
        </p>
        <div className="mt-2">
          <AudienceState campaign={campaign} audience="direct" />
          <AudienceState campaign={campaign} audience="ota" />
        </div>
      </div>

      <div className="px-4 py-3">
        <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Promotion</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <span className="truncate text-[12.5px] font-medium text-card-foreground">{promotion?.name ?? "No promotion"}</span>
          <button onClick={onPromotion} className="shrink-0 text-[11.5px] font-semibold text-brand hover:underline">{promotion ? "Change" : "+ Add"}</button>
        </div>
      </div>

      <div className="mt-auto">
        {edit && (
          <div className="group relative mx-4 mb-3 flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-foreground text-[8.5px] font-semibold text-background">{initialsOf(edit.by)}</span>
            <span>Updated {timeAgo(edit.at)}</span>
            <span className="pointer-events-none absolute bottom-7 left-0 z-10 w-56 rounded-md bg-foreground px-2.5 py-2 text-[11px] leading-snug text-background opacity-0 shadow-lift transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              Edited by {edit.by} · {timeAgo(edit.at)}
              <span className="mt-0.5 block text-background/70">{AUDIENCE_LABEL[edit.audience]} · {fullTime(edit.at)}</span>
            </span>
          </div>
        )}
        <div className="grid grid-cols-[auto_1fr_auto] border-t border-border p-2">
          <Button variant="ghost" size="sm" onClick={onTest}><FlaskConical size={13} />Test</Button>
          <Button variant="brand" size="sm" onClick={onEdit}><Pencil size={13} />Edit content</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8" aria-label={`More actions for ${campaign.name}`}><Ellipsis size={16} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onSelect={onPromotion}><Tag size={14} />{promotion ? "Change promotion" : "Add promotion"}</DropdownMenuItem>
              <DropdownMenuItem disabled={!hasCustomization} onSelect={onRevert}><RotateCcw size={14} />Revert content to suggested</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => onToggle(!campaign.enabled)}><Power size={14} />{campaign.enabled ? "Disable campaign" : "Enable campaign"}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
}