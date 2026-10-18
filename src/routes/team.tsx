import { createFileRoute } from "@tanstack/react-router";
import { Avatar, Bar, Kpi, PageHeader, Panel } from "@/components/studio/ui";
import { DISCIPLINES, PEOPLE } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/team")({
  head: () => seo("Team & Workload", "Resource heatmap, discipline capacity and individual utilisation."),
  component: Team,
});
const WEEKS = ["W42", "W43", "W44", "W45", "W46", "W47", "W48", "W49"];

function Team() {
  const avg = Math.round(PEOPLE.reduce((a, p) => a + p.load, 0) / PEOPLE.length);
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader eyebrow="Management" title="Team & Workload" sub="Who is overloaded, who has capacity." />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Headcount" value={PEOPLE.length + 48} tone="info" />
        <Kpi label="Avg. utilisation" value={`${avg}%`} tone="ok" />
        <Kpi label="Overloaded" value={PEOPLE.filter((p) => p.load > 100).length} tone="bad" sub="> 100% allocated" />
        <Kpi label="Available" value={PEOPLE.filter((p) => p.load < 70).length} tone="review" sub="< 70% allocated" />
      </div>
      <Panel title="Resource heatmap" sub="Forecast allocation, next 8 weeks">
        <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm">
          <thead><tr><th className="py-2 text-left text-xs text-muted-foreground">Person</th>{WEEKS.map((w) => <th key={w} className="font-mono text-[10px] text-muted-foreground">{w}</th>)}</tr></thead>
          <tbody>{PEOPLE.map((p, i) => (
            <tr key={p.id}><td className="py-1 pr-4"><div className="flex items-center gap-2"><Avatar id={p.id} /><div><div className="font-medium">{p.name}</div><div className="text-[10px] text-muted-foreground">{p.role}</div></div></div></td>
              {WEEKS.map((w, j) => { const v = Math.max(20, Math.min(130, p.load + ((i * 7 + j * 13) % 40) - 20 - j * 3)); return (
                <td key={w} className="p-0.5"><div className="rounded py-2 text-center text-[11px] font-bold tabular-nums" style={{ background: v > 100 ? "color-mix(in oklab, var(--bad) 45%, transparent)" : v > 85 ? "color-mix(in oklab, var(--warn) 35%, transparent)" : `color-mix(in oklab, var(--ok) ${v * 0.35}%, transparent)` }}>{v}</div></td>
              ); })}</tr>
          ))}</tbody>
        </table></div>
      </Panel>
      <Panel className="mt-4" title="Discipline capacity">
        <div className="grid gap-4 md:grid-cols-3">{DISCIPLINES.map((d, i) => { const v = [94, 81, 84, 116, 46, 81][i]!; return (
          <div key={d}><div className="flex justify-between text-sm"><span className="font-medium">{d}</span><b className={v > 100 ? "text-bad" : ""}>{v}%</b></div><Bar className="mt-1.5 h-2" value={v} tone={v > 100 ? "bad" : v > 90 ? "warn" : "ok"} /></div>
        ); })}</div>
      </Panel>
    </div>
  );
}
