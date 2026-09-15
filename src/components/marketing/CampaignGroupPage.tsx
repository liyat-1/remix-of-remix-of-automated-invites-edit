import { useState } from "react";
import { MarketingShell } from "./MarketingShell";
import { StrategyBar } from "./StrategyBar";
import { CampaignCard } from "./CampaignCard";
import { CampaignEditor } from "./CampaignEditor";
import { GROUP_META, mutate, useMarketing, type CampaignGroup, type Strategy } from "@/lib/marketing";

/** Shared page for each automated-campaign group. */
export function CampaignGroupPage({ group }: { group: CampaignGroup }) {
  const { campaigns } = useMarketing();
  const meta = GROUP_META[group];
  const list = campaigns.filter((c) => c.group === group);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<string | null>(null);

  const targets = () => (selected.length ? selected : list.map((c) => c.id));
  const allEnabled = list.length > 0 && list.every((c) => c.enabled);

  return (
    <MarketingShell title={meta.title}>
      <div className="mx-auto max-w-6xl px-6 py-6">
        <p className="text-[13.5px] text-zinc-500">{meta.desc}</p>

        <div className="mt-4">
          <StrategyBar
            total={list.length}
            selectedCount={selected.length}
            allEnabled={allEnabled}
            onApply={(s: Strategy) =>
              mutate((d) => {
                const ids = targets();
                d.campaigns.forEach((c) => {
                  if (ids.includes(c.id)) c.strategy = s;
                });
              })
            }
            onEnableAll={(v) =>
              mutate((d) => {
                const ids = targets();
                d.campaigns.forEach((c) => {
                  if (ids.includes(c.id)) c.enabled = v;
                });
              })
            }
          />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-[12.5px] text-zinc-500">
            {list.filter((c) => c.enabled).length} of {list.length} active
          </p>
          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="text-[12.5px] text-zinc-500 hover:text-zinc-800"
            >
              Clear selection ({selected.length})
            </button>
          )}
        </div>

        <div className="mt-3 grid gap-4 pb-10 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
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

      {editing && <CampaignEditor id={editing} onClose={() => setEditing(null)} />}
    </MarketingShell>
  );
}
