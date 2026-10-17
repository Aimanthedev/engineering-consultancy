import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, Pill, type Tone } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { NOTIFICATIONS } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/notifications")({
  head: () => seo("Notifications", "Alerts for approvals, clashes, deadlines and revisions."),
  component: Notif,
});

function Notif() {
  const [read, setRead] = useState<number[]>([]);
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="System" title="Notifications" actions={<Button variant="surface" onClick={() => setRead(NOTIFICATIONS.map((_, i) => i))}>Mark all read</Button>} />
      <Panel>{NOTIFICATIONS.map((n, i) => (
        <button key={i} onClick={() => setRead((r) => [...r, i])} className={`flex w-full items-start gap-3 border-b py-4 text-left last:border-0 ${read.includes(i) ? "opacity-50" : ""}`}>
          <Pill tone={n.tone as Tone}>{n.tone === "bad" ? "Urgent" : n.tone === "warn" ? "Deadline" : n.tone === "ok" ? "Done" : n.tone === "review" ? "Review" : "Info"}</Pill>
          <div className="min-w-0 flex-1"><div className="text-sm font-semibold">{n.title}</div><div className="text-xs text-muted-foreground">{n.body}</div></div>
          <span className="font-mono text-[10px] text-muted-foreground">{n.when}</span>
        </button>
      ))}</Panel>
    </div>
  );
}
