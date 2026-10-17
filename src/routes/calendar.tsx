import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/studio/ui";
import { APPROVALS, PROJECTS, TASKS, VISITS } from "@/lib/data";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => seo("Calendar", "Milestones, site visits, reviews and deadlines in one studio calendar."),
  component: Cal,
});

function Cal() {
  const ev: Record<number, { t: string; c: string }[]> = {};
  const add = (d: number, t: string, c: string) => (ev[d] ??= []).push({ t, c });
  PROJECTS.forEach((p) => add(parseInt(p.nextDate), p.next, "bg-primary/15 text-primary"));
  APPROVALS.forEach((a) => add(parseInt(a.due), a.title, "bg-warn/15 text-warn"));
  VISITS.forEach((v) => add(parseInt(v.date), v.type, "bg-ok/15 text-ok"));
  TASKS.filter((t) => t.priority === "Critical").forEach((t) => add(parseInt(t.due), t.title, "bg-bad/15 text-bad"));
  const offset = 4; // Oct 1 2026 = Thursday
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader eyebrow="Main" title="October 2026" sub="Milestones · approvals · site visits · critical tasks" />
      <Panel>
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border bg-border">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="bg-surface p-2 text-center text-[11px] font-semibold uppercase text-muted-foreground">{d}</div>)}
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - offset + 1;
            const valid = day >= 1 && day <= 31;
            return (
              <div key={i} className={cn("min-h-[92px] bg-card p-1.5 md:min-h-[120px]", !valid && "opacity-30")}>
                {valid && <>
                  <div className={cn("mb-1 grid size-6 place-items-center rounded-full text-xs font-semibold", day === 13 && "bg-primary text-primary-foreground")}>{day}</div>
                  <div className="space-y-0.5">{(ev[day] ?? []).slice(0, 3).map((e, j) => <div key={j} className={cn("truncate rounded px-1 py-0.5 text-[10px] font-medium", e.c)}>{e.t}</div>)}
                    {(ev[day]?.length ?? 0) > 3 && <div className="text-[10px] text-muted-foreground">+{ev[day].length - 3} more</div>}</div>
                </>}
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
