import { createFileRoute } from "@tanstack/react-router";
import { Avatar, PageHeader, Panel } from "@/components/studio/ui";
import { ACTIVITY, person, project } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/activity")({
  head: () => seo("Activity", "Live feed of revisions, approvals, site events and commercial actions."),
  component: Act,
});

function Act() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="System" title="Activity" sub="Everything that happened across the studio" />
      <Panel>
        <ol className="relative ml-3 border-l">{ACTIVITY.map((a, i) => (
          <li key={i} className="relative pb-6 pl-6 last:pb-0">
            <span className="absolute -left-3 top-0"><Avatar id={a.who} /></span>
            <div className="text-sm"><b>{person(a.who).name}</b> <span className="text-muted-foreground">{a.what}</span> <b>{a.target}</b></div>
            <div className="text-xs text-muted-foreground">{project(a.project)?.name} · {a.when}</div>
          </li>
        ))}</ol>
      </Panel>
    </div>
  );
}
