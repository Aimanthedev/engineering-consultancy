import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Bar, Cover, PageHeader, Panel, Pill, Segmented, TableWrap, Td, Th, toneOf } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROJECTS, STAGES, person, type Project } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/projects/")({
  head: () => seo("Projects", "Portfolio of active design and engineering projects with health, stage and progress."),
  component: Projects,
});

const VIEWS = ["Portfolio", "List", "Board", "Timeline"] as const;

function Card({ p }: { p: Project }) {
  return (
    <Link to="/projects/$id" params={{ id: p.id }} className="panel rise group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40">
      <div className="relative"><Cover hue={p.hue} seed={parseInt(p.code.slice(-3))} className="h-24" /><div className="absolute left-3 top-3"><Pill>{p.health}</Pill></div><span className="absolute right-3 top-3 rounded bg-background/60 px-1.5 font-mono text-[10px] backdrop-blur">{p.code}</span></div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-[13px] font-black uppercase tracking-wide">{p.name}</div>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">{p.type} · <MapPin className="size-3" />{p.location}, Qatar</div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div><div className="text-muted-foreground">Client</div><div className="truncate font-medium">{p.client}</div></div>
          <div><div className="text-muted-foreground">Stage</div><div className="font-medium">{p.stage} Design</div></div>
        </div>
        <div className="mt-3 flex items-end justify-between"><span className="text-3xl font-extrabold tabular-nums">{p.progress}%</span><div className="text-right text-xs"><div className="text-muted-foreground">Next · {p.nextDate}</div><div className="font-semibold">{p.next}</div></div></div>
        <Bar className="mt-2" value={p.progress} tone={toneOf(p.health)} />
        <div className="mt-3 space-y-1.5">
          {Object.entries(p.packages).slice(0, 4).map(([d, v]) => (
            <div key={d} className="grid grid-cols-[80px_1fr_32px] items-center gap-2 text-[11px]"><span className="text-muted-foreground">{d}</span><Bar value={v!} tone="info" className="h-1" /><span className="text-right tabular-nums">{v}%</span></div>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2 border-t pt-3 text-xs"><Avatar id={p.pm} /><span>{person(p.pm).name}</span><span className="ml-auto text-muted-foreground">{p.team} members</span></div>
      </div>
    </Link>
  );
}

function Projects() {
  const [view, setView] = useState<(typeof VIEWS)[number]>("Portfolio");
  const [q, setQ] = useState("");
  const [health, setHealth] = useState("all");
  const [stage, setStage] = useState("all");
  const [pm, setPm] = useState("all");
  const list = useMemo(() => PROJECTS.filter((p) =>
    (q === "" || `${p.name} ${p.client} ${p.code} ${p.location}`.toLowerCase().includes(q.toLowerCase())) &&
    (health === "all" || p.health === health) && (stage === "all" || p.stage === stage) && (pm === "all" || p.pm === pm)), [q, health, stage, pm]);

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader eyebrow="Portfolio" title="Projects" sub={`${list.length} of ${PROJECTS.length} projects`} actions={<><Segmented value={view} options={VIEWS} onChange={setView} /><Button variant="glow" onClick={() => toast.success("New project wizard opened (demo)")}><Plus /> New Project</Button></>} />
      <div className="mb-5 flex flex-wrap gap-2">
        <div className="relative min-w-[220px] flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects..." className="h-9 w-full rounded-lg border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary/50" /></div>
        <F v={health} set={setHealth} label="Health" opts={["On Track", "At Risk", "Delayed", "Review"]} />
        <F v={stage} set={setStage} label="Stage" opts={STAGES} />
        <F v={pm} set={setPm} label="Project manager" opts={["p1", "p9"]} fmt={(x) => person(x).name} />
      </div>

      {list.length === 0 && <div className="panel grid place-items-center p-16 text-center text-sm text-muted-foreground">No projects match these filters.</div>}

      {view === "Portfolio" && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{list.map((p) => <Card key={p.id} p={p} />)}</div>}

      {view === "List" && list.length > 0 && (
        <Panel><TableWrap><thead><tr><Th>Project</Th><Th>Client</Th><Th>Stage</Th><Th>Progress</Th><Th>Next milestone</Th><Th>PM</Th><Th>Health</Th></tr></thead>
          <tbody>{list.map((p) => (
            <tr key={p.id}><Td><Link to="/projects/$id" params={{ id: p.id }} className="font-semibold hover:text-primary">{p.name}</Link><div className="font-mono text-[10px] text-muted-foreground">{p.code}</div></Td>
              <Td className="text-muted-foreground">{p.client}</Td><Td>{p.stage}</Td><Td><div className="flex w-32 items-center gap-2"><Bar value={p.progress} tone={toneOf(p.health)} /><span className="text-xs tabular-nums">{p.progress}%</span></div></Td>
              <Td className="text-xs">{p.next} · <b>{p.nextDate}</b></Td><Td><Avatar id={p.pm} /></Td><Td><Pill>{p.health}</Pill></Td></tr>
          ))}</tbody></TableWrap></Panel>
      )}

      {view === "Board" && (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.map((s) => (
            <div key={s} className="w-64 shrink-0 rounded-xl border bg-surface/60 p-2">
              <div className="flex items-center justify-between px-2 py-1.5 text-xs font-bold uppercase tracking-wider">{s}<span className="font-mono text-muted-foreground">{list.filter((p) => p.stage === s).length}</span></div>
              <div className="space-y-2">{list.filter((p) => p.stage === s).map((p) => (
                <Link key={p.id} to="/projects/$id" params={{ id: p.id }} className="block rounded-lg border bg-card p-3 hover:border-primary/40">
                  <div className="text-sm font-semibold">{p.name}</div><div className="mt-1 flex items-center justify-between"><Pill>{p.health}</Pill><span className="text-xs font-bold">{p.progress}%</span></div><Bar className="mt-2" value={p.progress} tone={toneOf(p.health)} />
                </Link>
              ))}</div>
            </div>
          ))}
        </div>
      )}

      {view === "Timeline" && (
        <Panel title="2026 – 2027 programme">
          <div className="overflow-x-auto"><div className="min-w-[800px]">
            <div className="ml-56 grid grid-cols-12 border-b pb-2 font-mono text-[10px] text-muted-foreground">{["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => <span key={m}>{m}</span>)}</div>
            {list.map((p, i) => {
              const start = (i * 7) % 30, len = 30 + ((i * 13) % 50);
              return (
                <div key={p.id} className="flex items-center border-b py-2">
                  <div className="w-56 truncate pr-3 text-sm font-medium">{p.name}</div>
                  <div className="relative h-6 flex-1">
                    <div className="absolute inset-y-0 left-[25%] w-px bg-primary/60" />
                    <div className="absolute inset-y-0.5 rounded-md bg-primary/20 ring-1 ring-primary/40" style={{ left: `${start}%`, width: `${len}%` }}>
                      <div className="h-full rounded-md bg-primary/50" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div></div>
        </Panel>
      )}
    </div>
  );
}

function F({ v, set, label, opts, fmt }: { v: string; set: (s: string) => void; label: string; opts: readonly string[]; fmt?: (s: string) => string }) {
  return (
    <Select value={v} onValueChange={set}>
      <SelectTrigger className="h-9 w-[160px] bg-surface"><SelectValue placeholder={label} /></SelectTrigger>
      <SelectContent><SelectItem value="all">All · {label}</SelectItem>{opts.map((o) => <SelectItem key={o} value={o}>{fmt ? fmt(o) : o}</SelectItem>)}</SelectContent>
    </Select>
  );
}
