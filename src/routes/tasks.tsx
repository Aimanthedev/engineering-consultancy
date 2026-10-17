import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Avatar, PageHeader, Pill } from "@/components/studio/ui";
import { TASKS, project, type Task } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/tasks")({
  head: () => seo("Tasks", "Studio-wide task board across projects and disciplines."),
  component: Tasks,
});
const COLS: Task["status"][] = ["To Do", "In Progress", "Review", "Done"];

function Tasks() {
  const [tasks, setTasks] = useState(TASKS);
  const advance = (id: string) => setTasks((s) => s.map((t) => (t.id === id ? { ...t, status: COLS[Math.min(3, COLS.indexOf(t.status) + 1)] } : t)));
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader eyebrow="Main" title="Tasks" sub={`${tasks.filter((t) => t.status !== "Done").length} open · click → to advance`} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {COLS.map((c) => (
          <div key={c} className="rounded-xl border bg-surface/60 p-2">
            <div className="flex items-center justify-between px-2 py-2 text-xs font-bold uppercase tracking-wider">{c}<span className="font-mono text-muted-foreground">{tasks.filter((t) => t.status === c).length}</span></div>
            <div className="space-y-2">{tasks.filter((t) => t.status === c).map((t) => (
              <div key={t.id} className="rise rounded-lg border bg-card p-3">
                <div className="flex items-center justify-between"><span className="font-mono text-[10px] text-muted-foreground">{t.id} · {t.discipline}</span><Pill>{t.priority}</Pill></div>
                <div className="mt-1.5 text-sm font-semibold leading-snug">{t.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{project(t.project)?.name}</div>
                <div className="mt-2 flex items-center gap-2 text-xs"><Avatar id={t.assignee} /><span className="text-muted-foreground">Due {t.due}</span>
                  {c !== "Done" && <button onClick={() => advance(t.id)} aria-label="Advance" className="ml-auto rounded-md border p-1 hover:border-primary hover:text-primary"><ChevronRight className="size-3.5" /></button>}</div>
              </div>
            ))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
