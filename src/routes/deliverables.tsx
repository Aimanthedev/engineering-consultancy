import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Avatar, Bar, Kpi, PageHeader, Panel, Pill, Segmented, TableWrap, Td, Th, toneOf } from "@/components/studio/ui";
import { PACKAGES, project } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/deliverables")({
  head: () => seo("Deliverables", "Track every design deliverable and package due across projects."),
  component: Deliverables,
});

function Deliverables() {
  const [f, setF] = useState<"All" | "Due soon" | "Blocked" | "Approved">("All");
  const list = PACKAGES.filter((p) => f === "All" || (f === "Due soon" ? parseInt(p.due) <= 18 && p.status !== "Approved" : p.status === f));
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader eyebrow="Delivery" title="Deliverables" sub="What we owe, to whom, and when." actions={<Segmented value={f} options={["All", "Due soon", "Blocked", "Approved"] as const} onChange={setF} />} />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Total packages" value={PACKAGES.length} tone="info" />
        <Kpi label="Due in 7 days" value={PACKAGES.filter((p) => parseInt(p.due) <= 20 && p.status !== "Approved").length} tone="warn" />
        <Kpi label="Blocked" value={PACKAGES.filter((p) => p.status === "Blocked").length} tone="bad" />
        <Kpi label="Approved" value={PACKAGES.filter((p) => p.status === "Approved").length} tone="ok" />
      </div>
      <Panel><TableWrap>
        <thead><tr><Th>Deliverable</Th><Th>Project</Th><Th>Rev</Th><Th>Sheets</Th><Th>Progress</Th><Th>Lead</Th><Th>Due</Th><Th>Status</Th></tr></thead>
        <tbody>{list.map((k) => (
          <tr key={k.id}><Td className="font-medium">{k.name}</Td><Td className="text-muted-foreground">{project(k.project)?.name}</Td><Td className="font-mono">{k.rev}</Td><Td>{k.drawings}</Td>
            <Td><div className="flex w-28 items-center gap-2"><Bar value={k.progress} tone={toneOf(k.status)} /><span className="text-xs">{k.progress}%</span></div></Td><Td><Avatar id={k.lead} /></Td><Td className="font-semibold">{k.due}</Td><Td><Pill>{k.status}</Pill></Td></tr>
        ))}</tbody>
      </TableWrap></Panel>
    </div>
  );
}
