import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Layers } from "lucide-react";
import { Avatar, Bar, PageHeader, Panel, Pill, Ring, Segmented, toneOf } from "@/components/studio/ui";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DISCIPLINES, DRAWINGS, PACKAGES, person, project, type Package } from "@/lib/data";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/design-studio")({
  head: () => seo("Design Studio", "Every design package across the studio — by discipline, stage, status and revision."),
  component: Studio,
});

const COLS: Package["status"][] = ["In Design", "Internal Review", "Client Review", "Revision", "Approved", "Blocked"];

function Studio() {
  const [disc, setDisc] = useState<string>("All");
  const [view, setView] = useState<"Board" | "Matrix">("Board");
  const [open, setOpen] = useState<Package | null>(null);
  const list = PACKAGES.filter((p) => disc === "All" || p.discipline === disc);

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader eyebrow="Primary workflow" title="Design Studio" sub={`${list.length} design packages in production`} actions={<Segmented value={view} options={["Board", "Matrix"] as const} onChange={setView} />} />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {DISCIPLINES.map((d) => {
          const ps = PACKAGES.filter((p) => p.discipline === d);
          const avg = Math.round(ps.reduce((a, p) => a + p.progress, 0) / (ps.length || 1));
          return (
            <button key={d} onClick={() => setDisc(disc === d ? "All" : d)} className={cn("panel flex items-center gap-3 p-3 text-left transition-all hover:border-primary/40", disc === d && "glow-primary")}>
              <Ring value={avg} size={48} tone={avg > 70 ? "ok" : avg > 45 ? "info" : "warn"} />
              <div className="min-w-0"><div className="truncate text-sm font-bold">{d}</div><div className="text-[11px] text-muted-foreground">{ps.length} packages</div></div>
            </button>
          );
        })}
      </div>

      {view === "Board" ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {COLS.map((c) => {
            const items = list.filter((p) => p.status === c);
            return (
              <div key={c} className="w-72 shrink-0 rounded-xl border bg-surface/60 p-2">
                <div className="flex items-center justify-between px-2 py-2"><Pill>{c}</Pill><span className="font-mono text-xs text-muted-foreground">{items.length}</span></div>
                <div className="space-y-2">{items.map((k) => (
                  <button key={k.id} onClick={() => setOpen(k)} className="block w-full rounded-lg border bg-card p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40">
                    <div className="flex items-center justify-between text-[10px]"><span className="font-mono text-primary">{k.discipline.toUpperCase()}</span><span className="font-mono text-muted-foreground">Rev {k.rev}</span></div>
                    <div className="mt-1 text-sm font-semibold leading-snug">{project(k.project)?.name}</div>
                    <div className="text-xs text-muted-foreground">{k.stage} design · {k.drawings} dwgs</div>
                    <div className="mt-2 flex items-center gap-2"><Bar value={k.progress} tone={toneOf(k.status)} /><span className="text-xs font-bold tabular-nums">{k.progress}%</span></div>
                    <div className="mt-2 flex items-center justify-between text-xs"><Avatar id={k.lead} /><span className="text-muted-foreground">Due {k.due}</span></div>
                  </button>
                ))}{!items.length && <div className="py-6 text-center text-xs text-muted-foreground">Empty</div>}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <Panel title="Discipline × project matrix" sub="Package completion">
          <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm">
            <thead><tr><th className="py-2 text-left text-xs text-muted-foreground">Project</th>{DISCIPLINES.map((d) => <th key={d} className="text-xs text-muted-foreground">{d}</th>)}</tr></thead>
            <tbody>{Array.from(new Set(PACKAGES.map((p) => p.project))).map((pid) => (
              <tr key={pid} className="border-t"><td className="py-2 pr-4"><Link to="/projects/$id" params={{ id: pid }} className="font-medium hover:text-primary">{project(pid)?.name}</Link></td>
                {DISCIPLINES.map((d) => { const k = PACKAGES.find((p) => p.project === pid && p.discipline === d); return (
                  <td key={d} className="p-1 text-center">{k ? <button onClick={() => setOpen(k)} className="w-full rounded-md py-1.5 text-xs font-bold tabular-nums" style={{ background: `color-mix(in oklab, var(--primary) ${k.progress * 0.5}%, transparent)` }}>{k.progress}</button> : <span className="text-muted-foreground/40">—</span>}</td>
                ); })}</tr>
            ))}</tbody>
          </table></div>
        </Panel>
      )}

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {open && <>
            <SheetHeader><SheetTitle className="flex items-center gap-2"><Layers className="size-4 text-primary" />{open.discipline} Package</SheetTitle></SheetHeader>
            <div className="space-y-5 px-4 pb-8">
              <div><div className="text-lg font-bold">{project(open.project)?.name}</div><div className="text-sm text-muted-foreground">{open.stage} design · Revision {open.rev}</div></div>
              <div className="flex items-center gap-4"><Ring value={open.progress} size={84} /><div className="space-y-1 text-sm"><Pill>{open.status}</Pill><div className="flex items-center gap-2"><Avatar id={open.lead} />{person(open.lead).name}</div><div className="text-muted-foreground">Due {open.due}</div></div></div>
              <div><div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Workflow</div>
                <ol className="space-y-2">{["Brief received", "Design development", "Internal review", "Client review", "Approved for issue"].map((s, i) => {
                  const done = i < Math.ceil(open.progress / 22);
                  return <li key={s} className="flex items-center gap-3 text-sm"><span className={cn("size-2.5 rounded-full", done ? "bg-ok" : "bg-muted")} /><span className={done ? "" : "text-muted-foreground"}>{s}</span></li>;
                })}</ol></div>
              <div><div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Drawings</div>
                {DRAWINGS.filter((d) => d.project === open.project && d.discipline === open.discipline).slice(0, 6).map((d) => (
                  <div key={d.no} className="flex items-center gap-2 border-b py-2 text-sm"><span className="font-mono text-[11px] text-muted-foreground">{d.no}</span><span className="truncate">{d.title}</span><Pill className="ml-auto">{d.status}</Pill></div>
                ))}</div>
            </div>
          </>}
        </SheetContent>
      </Sheet>
    </div>
  );
}
