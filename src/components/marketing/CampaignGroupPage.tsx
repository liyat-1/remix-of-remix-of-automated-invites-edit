import { useState } from "react";
import { MarketingShell } from "./MarketingShell";
import { StrategyBar, StrategyPanel } from "./StrategyBar";
import { CampaignCard } from "./CampaignCard";
import { CampaignEditor } from "./CampaignEditor";
import {
  GROUP_META,
  customizedCount,
  mutate,
  useMarketing,
  type CampaignGroup,
  type Strategy,
} from "@/lib/marketing";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[92px] rounded-lg border border-border bg-background/60 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-[15px] font-semibold tabular-nums text-card-foreground">{value}</p>
    </div>
  );
}

/** Shared page for each automated-campaign group. */
export function CampaignGroupPage({ group }: { group: CampaignGroup }) {
  const { campaigns } = useMarketing();
  const meta = GROUP_META[group];
  const list = campaigns.filter((c) => c.group === group);
  const [managing, setManaging] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<string | null>(null);

  const allEnabled = list.length > 0 && list.every((c) => c.enabled);
  const activeCount = list.filter((c) => c.enabled).length;
  const customised = list.reduce((n, c) => n + customizedCount(c), 0);
  const names = list.filter((c) => selected.includes(c.id)).map((c) => c.name);

  const leaveManage = () => {
    setManaging(false);
    setSelected([]);
  };

  return (
    <MarketingShell title={meta.title}>
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
        <section className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 max-w-xl">
              <h2 className="text-[15px] font-semibold tracking-tight text-card-foreground">{meta.title}</h2>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{meta.desc}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Stat label="Active" value={`${activeCount} / ${list.length}`} />
              <Stat label="Customised" value={String(customised)} />
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <StrategyBar
              managing={managing}
              allEnabled={allEnabled}
              onToggleManage={() => (managing ? leaveManage() : setManaging(true))}
              onEnableAll={(v) =>
                mutate((d) => {
                  const ids = list.map((c) => c.id);
                  d.campaigns.forEach((c) => {
                    if (ids.includes(c.id)) c.enabled = v;
                  });
                })
              }
            />
          </div>
        </section>

        <div className="mt-5 flex items-center justify-between px-1">
          <p className="text-[12px] text-muted-foreground">
            {list.length} campaign{list.length === 1 ? "" : "s"} in this journey
          </p>
          {selected.length > 0 && (
            <p className="text-[12px] font-medium text-brand">{selected.length} selected</p>
          )}
        </div>

        <div className="mt-3 grid gap-4 pb-28 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              selectable={managing}
              selected={selected.includes(c.id)}
              onSelect={(v) =>
                setSelected((s) => (v ? [...s, c.id] : s.filter((x) => x !== c.id)))
              }
              onToggle={(v) =>
                mutate((d) => {
                  d.campaigns.find((x) => x.id === c.id)!.enabled = v;
                })
              }
              onEdit={() => setEditing(c.id)}
            />
          ))}
        </div>
      </div>

      {managing && selected.length > 0 && (
        <StrategyPanel
          names={names}
          onDone={leaveManage}
          onApply={(s: Strategy) => {
            mutate((d) => {
              d.campaigns.forEach((c) => {
                if (selected.includes(c.id)) c.strategy = s;
              });
            });
            setSelected([]);
          }}
        />
      )}

      {editing && <CampaignEditor id={editing} onClose={() => setEditing(null)} />}
    </MarketingShell>
  );
}
