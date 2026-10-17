import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { Bar, PageHeader, Panel, Pill } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/reports")({
  head: () => seo("Reports", "Design performance, project risk and studio health reports."),
  component: Reports,
});

function Reports() {
  const radar = [["On-time issue", 82], ["First-time approval", 78], ["Coordination", 71], ["Utilisation", 88], ["Fee recovery", 74], ["Client score", 86]].map(([k, v]) => ({ k, v }));
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader eyebrow="Management" title="Reports" sub="Studio performance at a glance" actions={<Button variant="surface" onClick={() => toast.success("Monthly report exported (demo)")}><Download /> Export PDF</Button>} />
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Design performance">
          <div className="h-64"><ResponsiveContainer><RadarChart data={radar}><PolarGrid stroke="var(--border)" /><PolarAngleAxis dataKey="k" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} /><Radar dataKey="v" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.25} /></RadarChart></ResponsiveContainer></div>
        </Panel>
        <Panel className="xl:col-span-2" title="Project risk panel" sub="Ranked by schedule & approval exposure">
          {PROJECTS.filter((p) => p.health !== "On Track").map((p) => (
            <div key={p.id} className="grid grid-cols-[minmax(0,1fr)_120px_auto] items-center gap-4 border-b py-3 last:border-0">
              <div className="min-w-0"><div className="truncate text-sm font-semibold">{p.name}</div><div className="text-xs text-muted-foreground">{p.next} · {p.nextDate}</div></div>
              <Bar value={100 - p.progress} tone={p.health === "Delayed" ? "bad" : "warn"} /><Pill>{p.health}</Pill>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
