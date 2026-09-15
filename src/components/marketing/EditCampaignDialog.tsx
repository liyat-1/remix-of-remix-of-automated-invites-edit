import { AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type MarketingCampaign } from "@/lib/marketing";

export function EditCampaignDialog({ campaign, open, onClose, onContinue }: { campaign: MarketingCampaign | null; open: boolean; onClose: () => void; onContinue: () => void }) {
  if (!campaign) return null;
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-lg border-border bg-card p-0 shadow-float">
        <DialogHeader className="border-b border-border px-5 py-4 pr-12">
          <DialogTitle className="text-[16px]">Edit future invites?</DialogTitle>
          <DialogDescription>Previously sent invites will not be affected.</DialogDescription>
        </DialogHeader>
        <div className="flex items-start gap-3 px-5 py-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-warning-soft text-warning"><AlertTriangle size={17} /></span>
          <p className="text-[13px] leading-relaxed text-card-foreground">Changes to <strong>{campaign.name}</strong> will apply only to future invites.</p>
        </div>
          <dl className="grid grid-cols-[112px_minmax(0,1fr)] gap-x-4 gap-y-3 rounded-md border border-border bg-muted/30 p-4 text-[12.5px]">
            <dt className="text-muted-foreground">Campaign</dt><dd className="font-semibold text-card-foreground">{campaign.name}</dd>
            <dt className="text-muted-foreground">Timing</dt><dd className="text-card-foreground">{campaign.timing}</dd>
            <dt className="text-muted-foreground">Guest types</dt><dd className="flex items-center gap-1.5 text-card-foreground"><Users size={13} className="text-muted-foreground" />Direct + OTA</dd>
            <dt className="text-muted-foreground">Current strategy</dt><dd className="text-card-foreground">{STRATEGY_LABEL[campaign.strategy]}</dd>
          </dl>
          <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">Changes apply to future messages sent automatically to guests who meet this campaign’s criteria.</p>
          <p className="mt-2 text-[12.5px] font-medium text-card-foreground">You can customize content separately for each guest type and channel.</p>
        </div>
        <DialogFooter className="border-t border-border px-5 py-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="brand" onClick={onContinue}>Continue editing<ArrowRight size={14} /></Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}