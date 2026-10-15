import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ArrowRight, Clock, HardHat, MapPin } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Avatar, Bar, Kpi, PageHeader, Panel, Pill, Segmented, Spark, toneOf, type Tone } from "@/components/studio/ui";
import { APPROVALS, ISSUES, PACKAGES, PEOPLE, PROJECTS, STAGES, TASKS, VISITS, project, person } from "@/lib/data";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => seo("Overview", "Everything happening across the consultancy — designs, approvals, site activity and teams."),
  component: Overview,
});

const trend = [
  { w: "W33", issued: 38, approved: 22 }, { w: "W34", issued: 44, approved: 30 }, { w: "W35", issued: 41, approved: 34 },
  { w: "W36", issued: 56, approved: 38 }, { w: "W37", issued: 52, approved: 45 }, { w: "W38", issued: 63, approved: 49 },
  { w: "W39", issued: 70, approved: 52 }, { w: "W40", issued: 66, approved: 58 }, { w: "W41", issued: 78, approved: 61 },
];

function Overview() {
  const [f, setF] = useState<"All" | "On Track" | "At Risk" | "Delayed">("All");
  const rows = PROJECTS.filter((p) => f === "All" || p.health === f).slice(0, 8);
  const stageCount = STAGES.map((s) => ({ s, n: PROJECTS.filter((p) => p.stage === s).length + PACKAGES.filter((k) => k.stage === s).length }));
  const pending = APPROVALS.filter((a) => a.status === "Pending");

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader eyebrow="Tuesday · 13 October 2026" title={<>Good morning, <span className="text-gradient">Omar</span></>} sub="Here’s what’s happening across your studio." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Active Projects" value={PROJECTS.length - 1} sub="+3 this quarter" tone="info"><Spark data={[14, 15, 15, 17, 18, 18, 20, 22, 23, 24]} /></Kpi>
        <Kpi label="Design Packages" value={PACKAGES.length} sub="Across 6 disciplines" tone="review">
          <div className="flex h-2 overflow-hidden rounded-full">
            {[["bg-chart-1", 12], ["bg-chart-2", 18], ["bg-chart-5", 23], ["bg-chart-3", 14]].map(([c, n]) => <div key={c as string} className={c as string} style={{ flex: n as number }} />)}
          </div>
          <div className="mt-2 grid grid-cols-4 text-[10px] text-muted-foreground"><span>Concept</span><span>Developed</span><span>Detailed</span><span>IFC</span></div>
        </Kpi>
        <Kpi label="Awaiting Approval" value={pending.length} sub="3 waiting > 10 days" tone="warn">
          <div className="flex flex-wrap gap-1.5">{(["Client", "Internal", "Authority", "Consultant"] as const).map((t) => <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-[11px]">{t} · {pending.filter((a) => a.type === t).length}</span>)}</div>
        </Kpi>
        <Kpi label="Due This Week" value={8} sub="2 critical" tone="bad">
          <div className="flex -space-x-1.5">{["p3", "p6", "p4", "p7", "p5"].map((p) => <Avatar key={p} id={p} />)}</div>
        </Kpi>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Project Health" sub="Progress, schedule and next milestone"
          action={<Segmented value={f} options={["All", "On Track", "At Risk", "Delayed"] as const} onChange={setF} />}>
          <div className="space-y-1">
            {rows.map((p) => (
              <Link key={p.id} to="/projects/$id" params={{ id: p.id }} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/50 md:grid-cols-[minmax(0,1.6fr)_1fr_minmax(0,1fr)_auto_auto]">
                <div className="min-w-0"><div className="truncate text-sm font-semibold">{p.name}</div><div className="font-mono text-[10px] text-muted-foreground">{p.code} · {p.stage}</div></div>
                <div className="hidden items-center gap-3 md:flex"><Bar value={p.progress} tone={toneOf(p.health)} /><span className="w-9 text-right text-sm font-bold tabular-nums">{p.progress}%</span></div>
                <div className="hidden min-w-0 text-xs md:block"><div className="truncate text-muted-foreground">{p.next}</div><div className="font-semibold">{p.nextDate}</div></div>
                <span className="hidden md:block"><Avatar id={p.pm} /></span>
                <Pill>{p.health}</Pill>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="Attention Required" sub="Blocked, overdue or waiting" action={<AlertTriangle className="size-4 text-warn" />}>
          <ul className="space-y-2.5">
            {[...ISSUES.filter((i) => i.severity === "Critical" || i.status === "Overdue").map((i) => ({ t: i.title, s: `${i.id} · ${project(i.project)?.name}`, tone: "bad" as Tone, to: "/site" })),
              ...APPROVALS.filter((a) => a.waiting > 10).map((a) => ({ t: `${a.title} waiting ${a.waiting}d`, s: `${a.type} approval · ${project(a.project)?.name}`, tone: "warn" as Tone, to: "/approvals" })),
              { t: "Khalid Al-Mansoori at 116% capacity", s: "MEP · 4 active packages", tone: "review" as Tone, to: "/team" }].map((x, i) => (
              <li key={i}><Link to={x.to} className="flex gap-3 rounded-lg border bg-surface p-3 transition-colors hover:border-primary/40">
                <span className={cn("mt-1 size-2 shrink-0 rounded-full", { bad: "bg-bad", warn: "bg-warn", review: "bg-review" }[x.tone as "bad"])} />
                <div className="min-w-0"><div className="text-sm font-semibold leading-snug">{x.t}</div><div className="truncate text-xs text-muted-foreground">{x.s}</div></div>
              </Link></li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel className="mt-4" title="Design Pipeline" sub="Projects and packages by stage — from brief to handover">
        <div className="-mx-1 flex gap-1 overflow-x-auto pb-1">
          {stageCount.map(({ s, n }, i) => (
            <div key={s} className="relative min-w-[110px] flex-1 px-1">
              <div className={cn("rounded-lg border p-3", i >= 2 && i <= 6 ? "bg-primary/5 border-primary/20" : "bg-surface")}>
                <div className="font-mono text-[10px] text-muted-foreground">0{i + 1}</div>
                <div className="mt-1 text-3xl font-extrabold tabular-nums">{n}</div>
                <div className="text-xs font-semibold">{s}</div>
              </div>
              {i < stageCount.length - 1 && <ArrowRight className="absolute -right-1.5 top-1/2 z-10 size-3 -translate-y-1/2 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </Panel>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Panel title="Today" sub="Your schedule">
          <ul className="space-y-3">
            {[["08:30", "Site visit — Crescent School", HardHat], ["10:00", "Design review — West Bay HQ MEP", Clock], ["12:30", "Client meeting — Al Noor Holdings", Clock], ["15:00", "Coordination — Katara Hotel", Clock]].map(([t, l, I]) => {
              const Icon = I as typeof Clock;
              return <li key={t as string} className="flex items-center gap-3 text-sm"><span className="w-11 font-mono text-xs text-muted-foreground">{t as string}</span><Icon className="size-3.5 text-primary" /><span className="truncate">{l as string}</span></li>;
            })}
          </ul>
          <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">{TASKS.filter((t) => t.due === "13 Oct").length} tasks due today</div>
        </Panel>
        <Panel title="Team Capacity" sub="Utilisation this week">
          <ul className="space-y-2.5">{PEOPLE.slice(2, 8).map((p) => (
            <li key={p.id} className="flex items-center gap-2.5"><Avatar id={p.id} /><div className="min-w-0 flex-1"><div className="flex justify-between text-xs"><span className="truncate font-medium">{p.name}</span><span className={cn("font-bold tabular-nums", p.load > 100 ? "text-bad" : p.load > 90 ? "text-warn" : "text-muted-foreground")}>{p.load}%</span></div><Bar className="mt-1" value={p.load} tone={p.load > 100 ? "bad" : p.load > 90 ? "warn" : "ok"} /></div></li>
          ))}</ul>
        </Panel>
        <Panel className="md:col-span-2" title="Deliverable Progress" sub="Drawings issued vs approved · last 9 weeks">
          <div className="h-48">
            <ResponsiveContainer>
              <AreaChart data={trend} margin={{ left: 0, right: 0, top: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--chart-1)" stopOpacity={0.4} /><stop offset="1" stopColor="var(--chart-1)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--chart-3)" stopOpacity={0.3} /><stop offset="1" stopColor="var(--chart-3)" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="w" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
                <Area dataKey="issued" stroke="var(--chart-1)" strokeWidth={2} fill="url(#ga)" />
                <Area dataKey="approved" stroke="var(--chart-3)" strokeWidth={2} fill="url(#gb)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel className="mt-4" title="Site Activity" sub="Supervision visits and live observations" action={<Link to="/site" className="text-xs font-semibold text-primary">Open site module →</Link>}>
        <div className="grid gap-3 md:grid-cols-3">
          {VISITS.slice(0, 3).map((v) => (
            <div key={v.id} className="rounded-xl border bg-surface p-4">
              <div className="flex items-center justify-between"><span className="font-mono text-[11px] text-muted-foreground">{v.id}</span><Pill>{v.status}</Pill></div>
              <div className="mt-2 font-semibold">{project(v.project)?.name}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />{v.type} · {v.date}</div>
              <div className="mt-3 flex items-center gap-3 text-xs"><Avatar id={v.engineer} /><span>{person(v.engineer).name}</span><span className="ml-auto font-bold">{v.observations} obs.</span></div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
