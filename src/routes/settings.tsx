import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/studio/ui";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/settings")({
  head: () => seo("Settings", "Studio, notification and workflow preferences."),
  component: Settings,
});

function Settings() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader eyebrow="System" title="Settings" />
      <Panel title="Studio">
        <div className="grid gap-3 sm:grid-cols-2"><Input defaultValue="Studio Command Consultants" /><Input defaultValue="Doha, Qatar" /><Input defaultValue="PRJ-{YYYY}-{###}" /><Input defaultValue="QAR" /></div>
      </Panel>
      <Panel title="Notifications">
        {["Approval waiting more than 7 days", "Critical clash detected", "Deadline within 48 hours", "Revision issued on my projects", "Weekly studio digest"].map((l, i) => (
          <label key={l} className="flex items-center justify-between border-b py-3 text-sm last:border-0">{l}<Switch defaultChecked={i < 4} /></label>
        ))}
      </Panel>
      <Button variant="glow" onClick={() => toast.success("Settings saved")}>Save changes</Button>
    </div>
  );
}
