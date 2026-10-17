import { createFileRoute } from "@tanstack/react-router";
import { Bar as RBar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Kpi, PageHeader, Panel, Pill, TableWrap, Td, Th } from "@/components/studio/ui";
import { MILESTONES, PROJECTS, VARIATIONS, fmtQAR, project } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/commercial")({
  head: () => seo("Commercial", "Fees, invoicing, milestones and variations across the consultancy."),
  component: Commercial,
});

function Commercial() {
  const fee = PROJECTS.reduce((a, p) => a + p.fee, 0), inv = PROJECTS.reduce((a, p) => a + p.invoiced, 0);
  const chart = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((m, i) => ({ m, invoiced: [1.8, 2.1, 1.6, 2.4, 2.9, 2.2][i], collected: [1.5, 1.9, 1.7, 2.0, 2.5, 1.4][i] }));
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader eyebrow="Management" title="Commercial" sub="Fee position across all live commissions" />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Total fee book" value={fmtQAR(fee).replace("QAR ", "")} sub="QAR" tone="info" />
        <Kpi label="Invoiced" value={fmtQAR(inv).replace("QAR ", "")} sub={`${Math.round((inv / fee) * 100)}% of fee`} tone="ok" />
        <Kpi label="Overdue" value="0.62M" sub="2 invoices" tone="bad" />
        <Kpi label="Variations" value={VARIATIONS.length} sub={fmtQAR(VARIATIONS.reduce((a, v) => a + v.amount, 0))} tone="review" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Invoiced vs collected" sub="QAR millions">
          <div className="h-56"><ResponsiveContainer><BarChart data={chart}><XAxis dataKey="m" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10 }} /><RBar dataKey="invoiced" fill="var(--chart-1)" radius={[6, 6, 0, 0]} /><RBar dataKey="collected" fill="var(--chart-3)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Variations / additional services">{VARIATIONS.map((v) => <div key={v.id} className="border-b py-3 last:border-0"><div className="flex items-center justify-between"><span className="font-mono text-[11px] text-muted-foreground">{v.id}</span><Pill>{v.status}</Pill></div><div className="text-sm font-semibold">{v.title}</div><div className="text-xs text-muted-foreground">{project(v.project)?.name} · {fmtQAR(v.amount)}</div></div>)}</Panel>
      </div>
      <Panel className="mt-4" title="Fee milestones"><TableWrap>
        <thead><tr><Th>Milestone</Th><Th>Project</Th><Th>Amount</Th><Th>Due</Th><Th>Status</Th></tr></thead>
        <tbody>{MILESTONES.map((m) => <tr key={m.id}><Td className="font-medium">{m.name}</Td><Td className="text-muted-foreground">{project(m.project)?.name}</Td><Td className="font-bold tabular-nums">{fmtQAR(m.amount)}</Td><Td>{m.due}</Td><Td><Pill>{m.status}</Pill></Td></tr>)}</tbody>
      </TableWrap></Panel>
    </div>
  );
}
