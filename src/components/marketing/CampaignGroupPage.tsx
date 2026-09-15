import { useState } from "react";
import { MarketingShell } from "./MarketingShell";
import { StrategyBar, StrategyPanel } from "./StrategyBar";
import { CampaignCard } from "./CampaignCard";
import { CampaignEditor } from "./CampaignEditor";
import { GROUP_META, mutate, useMarketing, type CampaignGroup, type Strategy } from "@/lib/marketing";

/** Shared page for each automated-campaign group. */
export function CampaignGroupPage({ group }: { group: CampaignGroup }) {
  const { campaigns } = useMarketing();
  const meta = GROUP_META[group];
  const list = campaigns.filter((c) => c.group === group);
  const [managing, setManaging] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<string | null>(null);

  const allEnabled = list.length > 0 && list.every((c) => c.enabled);
  const names = list.filter((c) => selected.includes(c.id)).map((c) => c.name);

  const leaveManage = () => {
    setManaging(false);
    setSelected([]);
  };

  return (
    <MarketingShell title={meta.title}>
      <div className="mx-auto max-w-6xl px-6 py-6">
        <p className="text-[13.5px] text-zinc-500">{meta.desc}</p>

        <div className="mt-4">
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

        <div className="mt-5">
          <p className="text-[12.5px] text-zinc-500">
            {list.filter((c) => c.enabled).length} of {list.length} active
          </p>
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
