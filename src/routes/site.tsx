import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CloudSun, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Bar, Kpi, PageHeader, Panel, Pill, Segmented } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { ISSUES, VISITS, person, project, type Issue } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/site")({
  head: () => seo("Site & Supervision", "Site visits, observations, snags, NCRs and RFIs across supervised projects."),
  component: Site,
});

function Site() {
  const [kind, setKind] = useState<"All" | Issue["kind"]>("All");
  const [issues, setIssues] = useState(ISSUES);
  const list = issues.filter((i) => kind === "All" || i.kind === kind);
  const open = issues.filter((i) => i.status === "Open" || i.status === "Overdue");
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader eyebrow="Supervision" title="Site & Supervision" sub="From IFC to handover — what's happening on site." actions={<Button variant="glow" onClick={() => toast.success("Site visit SV-1043 scheduled (demo)")}>Schedule visit</Button>} />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Sites supervised" value={4} tone="info" />
        <Kpi label="Visits this week" value={VISITS.filter((v) => v.status !== "Issued").length + 3} tone="ok" />
        <Kpi label="Open issues" value={open.length} tone="bad" sub={`${open.filter((i) => i.severity === "Critical").length} critical`} />
        <Kpi label="Open RFIs" value={issues.filter((i) => i.kind === "RFI" && i.status !== "Closed").length} tone="warn" sub="1 overdue" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Site visits" sub="Scheduled and recent">
          <div className="space-y-3">{VISITS.map((v) => (
            <div key={v.id} className="rounded-xl border bg-surface p-3">
              <div className="flex items-center justify-between"><span className="font-mono text-[11px] text-muted-foreground">{v.id}</span><Pill>{v.status}</Pill></div>
              <div className="mt-1 text-sm font-semibold">{project(v.project)?.name}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />{v.type} · {v.date}</div>
              <div className="mt-2 flex items-center gap-2 text-xs"><Avatar id={v.engineer} />{person(v.engineer).name.split(" ")[0]}<CloudSun className="ml-auto size-3.5 text-warn" />{v.weather}</div>
              <div className="mt-2 flex items-center gap-2 text-[11px]"><span className="text-muted-foreground">Site progress</span><Bar value={v.progress} tone="ok" /><b>{v.progress}%</b></div>
            </div>
          ))}</div>
        </Panel>
        <Panel className="xl:col-span-2" title="Issues, RFIs & snags" action={<Segmented value={kind} options={["All", "RFI", "Snag", "Observation", "NCR", "Clash"] as const} onChange={setKind} />}>
          <div className="divide-y">{list.map((i) => (
            <div key={i.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="w-20 font-mono text-xs text-primary">{i.id}</span>
              <div className="min-w-0 flex-1"><div className="text-sm font-semibold">{i.title}</div><div className="text-xs text-muted-foreground">{project(i.project)?.name} · {i.location} · raised {i.raised}</div></div>
              <Pill>{i.severity}</Pill><Avatar id={i.owner} /><Pill>{i.status}</Pill>
              {i.status !== "Closed" && <Button size="sm" variant="surface" onClick={() => { setIssues((s) => s.map((x) => (x.id === i.id ? { ...x, status: "Closed" } : x))); toast.success(`${i.id} closed`); }}>Close</Button>}
            </div>
          ))}</div>
        </Panel>
      </div>
    </div>
  );
}
