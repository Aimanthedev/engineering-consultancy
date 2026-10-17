import { createFileRoute } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { Avatar, PageHeader, Panel, Pill } from "@/components/studio/ui";
import { STAGES, SURVEYS, project } from "@/lib/data";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/surveys")({
  head: () => seo("Surveys", "Topographic, measured, boundary and laser-scan surveys feeding design."),
  component: Surveys,
});
const FLOW = ["Planned", "In Field", "Processing", "Delivered"] as const;

function Surveys() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader eyebrow="Delivery" title="Surveys" sub="Survey data that feeds the design stage" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SURVEYS.map((s) => {
          const i = FLOW.indexOf(s.status);
          return (
            <Panel key={s.id} title={s.type} sub={`${s.id} · ${project(s.project)?.name}`} action={<Pill>{s.status}</Pill>}>
              <div className="flex gap-1">{FLOW.map((f, j) => <div key={f} className="flex-1"><div className={cn("h-1.5 rounded-full", j <= i ? "bg-teal" : "bg-muted")} /><div className="mt-1 text-[10px] text-muted-foreground">{f}</div></div>)}</div>
              <div className="mt-4 flex items-center gap-3 text-sm"><Compass className="size-4 text-teal" /><span className="font-bold tabular-nums">{s.points.toLocaleString()}</span><span className="text-xs text-muted-foreground">points captured</span><span className="ml-auto flex items-center gap-2 text-xs"><Avatar id={s.surveyor} />{s.date}</span></div>
              <div className="mt-3 text-xs text-muted-foreground">Feeds: <b className="text-foreground">{STAGES[2]} design</b></div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
