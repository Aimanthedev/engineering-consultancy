import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, MessageSquare, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Kpi, PageHeader, Panel, Pill, Segmented } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { APPROVALS, project, type Approval } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/approvals")({
  head: () => seo("Reviews & Approvals", "Client, internal, authority and consultant approvals with waiting time and owner."),
  component: Approvals,
});

function Approvals() {
  const [items, setItems] = useState(APPROVALS);
  const [type, setType] = useState<"All" | Approval["type"]>("All");
  const set = (id: string, status: Approval["status"]) => { setItems((s) => s.map((a) => (a.id === id ? { ...a, status, waiting: 0 } : a))); toast.success(`${id} marked ${status}`); };
  const list = items.filter((a) => type === "All" || a.type === type);
  const pending = items.filter((a) => a.status === "Pending");

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader eyebrow="Delivery" title="Reviews & Approvals" sub="Nothing moves to IFC without a recorded decision." actions={<Segmented value={type} options={["All", "Client", "Internal", "Authority", "Consultant"] as const} onChange={setType} />} />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Pending" value={pending.length} tone="warn" sub="Awaiting decision" />
        <Kpi label="Over 10 days" value={pending.filter((a) => a.waiting > 10).length} tone="bad" sub="Escalate" />
        <Kpi label="Avg. turnaround" value="6.4d" tone="info" sub="−1.2d vs last month" />
        <Kpi label="Approved this month" value={items.filter((a) => a.status === "Approved").length + 14} tone="ok" sub="First-time approval 78%" />
      </div>
      <Panel>
        <div className="divide-y">
          {list.map((a) => (
            <div key={a.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[11px] text-muted-foreground">{a.id}</span><Pill tone={a.type === "Internal" ? "review" : a.type === "Authority" ? "info" : "muted"}>{a.type}</Pill><span className="font-mono text-[11px]">Rev {a.rev}</span></div>
                <div className="mt-1 font-semibold">{a.title}</div>
                <div className="text-xs text-muted-foreground">{project(a.project)?.name} · submitted {a.submitted} · due {a.due}</div>
              </div>
              <div className="flex items-center gap-3">
                {a.status === "Pending" && <span className={a.waiting > 10 ? "text-sm font-bold text-bad" : "text-sm font-bold text-warn"}>{a.waiting}d waiting</span>}
                <Avatar id={a.owner} /><Pill>{a.status}</Pill>
                {a.status === "Pending" && <div className="flex gap-1">
                  <Button size="sm" variant="surface" onClick={() => set(a.id, "Comments")}><MessageSquare /></Button>
                  <Button size="sm" variant="surface" onClick={() => set(a.id, "Rejected")}><X /></Button>
                  <Button size="sm" variant="glow" onClick={() => set(a.id, "Approved")}><Check /> Approve</Button>
                </div>}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
