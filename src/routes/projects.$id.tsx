import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { Avatar, Bar, Cover, Panel, Pill, Ring, TableWrap, Td, Th, toneOf } from "@/components/studio/ui";
import { ACTIVITY, APPROVALS, DOCS, DRAWINGS, ISSUES, MILESTONES, PACKAGES, PEOPLE, STAGES, TASKS, VISITS, fmtQAR, person, project } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/$id")({
  loader: ({ params }) => { const p = project(params.id); if (!p) throw notFound(); return { name: p.name, code: p.code, type: p.type }; },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} · ${loaderData.code} — Studio Command` },
      { name: "description", content: `Project command center for ${loaderData.name}, ${loaderData.type}.` },
      { property: "og:title", content: `${loaderData.name} — Studio Command` },
      { property: "og:description", content: `Design, deliverables, approvals and site activity for ${loaderData.name}.` },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ] : [{ title: "Project unavailable — Studio Command" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => <div className="p-10 text-center">Project not found. <Link to="/projects" className="text-primary">Back to projects</Link></div>,
  component: Detail,
});

const TABS = ["Overview", "Design", "Deliverables", "Drawings", "Tasks", "Approvals", "Site", "Documents", "Commercial", "Activity"] as const;

function Detail() {
  const { id } = Route.useParams();
  const p = project(id)!;
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const pkgs = PACKAGES.filter((k) => k.project === id);
  const drawings = DRAWINGS.filter((d) => d.project === id);
  const tasks = TASKS.filter((t) => t.project === id);
  const approvals = APPROVALS.filter((a) => a.project === id);
  const issues = ISSUES.filter((i) => i.project === id);
  const si = STAGES.indexOf(p.stage);

  return (
    <div className="mx-auto max-w-[1600px]">
      <Link to="/projects" className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3" /> All projects</Link>
      <div className="panel relative overflow-hidden">
        <Cover hue={p.hue} seed={parseInt(p.code.slice(-3))} className="absolute inset-0 h-full opacity-40" />
        <div className="relative bg-gradient-to-r from-background via-background/85 to-transparent p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs text-primary">{p.code}</span><Pill>{p.health}</Pill></div>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-4xl">{p.name}</h1>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">{p.type} · <MapPin className="size-3.5" />{p.location}, Qatar · {p.client}</div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {[[`${p.progress}%`, "Complete"], [p.days, "Days active"], [Object.keys(p.packages).length, "Disciplines"], [p.team, "Team members"], [p.pendingReviews, "Pending reviews"]].map(([v, l]) => (
              <div key={l as string}><div className="text-3xl font-extrabold tabular-nums">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-20 -mx-4 mt-4 overflow-x-auto border-b bg-background/80 px-4 backdrop-blur md:mx-0 md:px-0">
        <div className="flex gap-1">{TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("relative whitespace-nowrap px-3 py-3 text-sm font-medium transition-colors", tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {t}{tab === t && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />}
          </button>
        ))}</div>
      </div>

      <div className="mt-4">
        {tab === "Overview" && (
          <div className="grid gap-4 xl:grid-cols-3">
            <Panel className="xl:col-span-3" title="Stage progression">
              <div className="flex gap-1 overflow-x-auto">{STAGES.map((s, i) => (
                <div key={s} className="min-w-[90px] flex-1"><div className={cn("h-1.5 rounded-full", i < si ? "bg-ok" : i === si ? "bg-primary glow-primary" : "bg-muted")} /><div className={cn("mt-2 text-xs", i === si ? "font-bold text-primary" : "text-muted-foreground")}>{s}</div></div>
              ))}</div>
            </Panel>
            <Panel title="Discipline progress">
              <div className="grid grid-cols-2 gap-4">{Object.entries(p.packages).map(([d, v]) => <div key={d} className="flex items-center gap-3"><Ring value={v!} tone={v! > 70 ? "ok" : v! > 45 ? "info" : "warn"} /><span className="text-sm font-medium">{d}</span></div>)}</div>
            </Panel>
            <Panel title="Next milestone"><div className="text-xs text-muted-foreground">Due {p.nextDate}</div><div className="mt-1 text-xl font-bold">{p.next}</div>
              <div className="mt-4 space-y-2 text-sm">{tasks.slice(0, 4).map((t) => <div key={t.id} className="flex items-center gap-2"><Avatar id={t.assignee} /><span className="truncate">{t.title}</span><Pill className="ml-auto">{t.priority}</Pill></div>)}{tasks.length === 0 && <div className="text-muted-foreground">No open tasks.</div>}</div>
            </Panel>
            <Panel title="Team">
              <div className="flex flex-wrap gap-2">{PEOPLE.slice(0, 8).map((m) => <div key={m.id} className="flex items-center gap-2 rounded-full border bg-surface py-1 pl-1 pr-3 text-xs"><Avatar id={m.id} />{m.name.split(" ")[0]}</div>)}</div>
              <div className="mt-4 text-xs text-muted-foreground">PM: <b className="text-foreground">{person(p.pm).name}</b></div>
            </Panel>
            <Panel className="xl:col-span-2" title="Risks & issues">{issues.length ? issues.map((i) => <Row key={i.id} a={i.id} b={i.title} c={<Pill>{i.status}</Pill>} />) : <Empty t="No open issues on this project." />}</Panel>
            <Panel title="Fee"><div className="text-3xl font-extrabold">{fmtQAR(p.fee)}</div><div className="text-xs text-muted-foreground">Total consultancy fee</div><Bar className="mt-4" value={(p.invoiced / p.fee) * 100} tone="ok" /><div className="mt-1 text-xs">{fmtQAR(p.invoiced)} invoiced</div></Panel>
          </div>
        )}
        {tab === "Design" && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{pkgs.map((k) => (
          <Panel key={k.id} title={k.discipline} sub={`${k.stage} design · Rev ${k.rev}`} action={<Pill>{k.status}</Pill>}>
            <div className="flex items-center gap-4"><Ring value={k.progress} size={72} /><div className="text-xs"><div className="text-muted-foreground">Lead</div><div className="flex items-center gap-2 font-semibold"><Avatar id={k.lead} />{person(k.lead).name}</div><div className="mt-2 text-muted-foreground">{k.drawings} drawings · due {k.due}</div></div></div>
          </Panel>
        ))}</div>}
        {tab === "Deliverables" && <Panel>{pkgs.map((k) => <Row key={k.id} a={k.discipline} b={`${k.name} · ${k.drawings} sheets`} c={<><span className="text-xs">{k.due}</span><Pill>{k.status}</Pill></>} />)}</Panel>}
        {tab === "Drawings" && <Panel><TableWrap><thead><tr><Th>No.</Th><Th>Title</Th><Th>Rev</Th><Th>Scale</Th><Th>Status</Th></tr></thead><tbody>{drawings.map((d) => <tr key={d.no}><Td className="font-mono text-xs">{d.no}</Td><Td>{d.title}</Td><Td className="font-mono">{d.rev}</Td><Td>{d.scale}</Td><Td><Pill>{d.status}</Pill></Td></tr>)}</tbody></TableWrap>{!drawings.length && <Empty t="No drawings registered yet." />}</Panel>}
        {tab === "Tasks" && <Panel>{tasks.length ? tasks.map((t) => <Row key={t.id} a={t.id} b={t.title} c={<><Avatar id={t.assignee} /><Pill>{t.status}</Pill></>} />) : <Empty t="No tasks." />}</Panel>}
        {tab === "Approvals" && <Panel>{approvals.length ? approvals.map((a) => <Row key={a.id} a={a.id} b={`${a.title} · ${a.type}`} c={<Pill>{a.status}</Pill>} />) : <Empty t="Nothing awaiting approval." />}</Panel>}
        {tab === "Site" && <Panel>{VISITS.filter((v) => v.project === id).map((v) => <Row key={v.id} a={v.id} b={`${v.type} · ${v.date}`} c={<Pill>{v.status}</Pill>} />)}{!VISITS.some((v) => v.project === id) && <Empty t="Site supervision not started for this project." />}</Panel>}
        {tab === "Documents" && <Panel>{DOCS.filter((d) => d.project === id).map((d) => <Row key={d.id} a={d.kind} b={d.name} c={<span className="font-mono text-xs">{d.version}</span>} />)}{!DOCS.some((d) => d.project === id) && <Empty t="No documents yet." />}</Panel>}
        {tab === "Commercial" && <Panel>{MILESTONES.filter((m) => m.project === id).map((m) => <Row key={m.id} a={m.id} b={`${m.name} · ${fmtQAR(m.amount)}`} c={<Pill>{m.status}</Pill>} />)}{!MILESTONES.some((m) => m.project === id) && <Empty t="No fee milestones recorded." />}</Panel>}
        {tab === "Activity" && <Panel>{ACTIVITY.map((a, i) => <div key={i} className="flex items-center gap-3 border-b py-3 text-sm last:border-0"><Avatar id={a.who} /><span><b>{person(a.who).name}</b> {a.what} <b>{a.target}</b></span><span className="ml-auto text-xs text-muted-foreground">{a.when}</span></div>)}</Panel>}
      </div>
    </div>
  );
}

function Row({ a, b, c }: { a: React.ReactNode; b: React.ReactNode; c: React.ReactNode }) {
  return <div className="flex items-center gap-3 border-b py-3 last:border-0"><span className="w-24 shrink-0 font-mono text-xs text-muted-foreground">{a}</span><span className="min-w-0 flex-1 truncate text-sm">{b}</span><span className="flex shrink-0 items-center gap-2">{c}</span></div>;
}
function Empty({ t }: { t: string }) { return <div className="py-10 text-center text-sm text-muted-foreground">{t}</div>; }
export { toneOf };
