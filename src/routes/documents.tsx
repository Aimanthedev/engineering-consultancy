import { createFileRoute } from "@tanstack/react-router";
import { FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { Avatar, PageHeader, Panel, Pill, TableWrap, Td, Th } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { DOCS, project } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/documents")({
  head: () => seo("Documents", "Transmittals, reports, specifications, minutes and models with version control."),
  component: Docs,
});

function Docs() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader eyebrow="Delivery" title="Documents" sub="Version-controlled project records" actions={<Button variant="glow" onClick={() => toast.success("Upload queued (demo)")}><Upload /> Upload</Button>} />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-6">
        {["Transmittal", "Report", "Specification", "Minutes", "Contract", "Model"].map((k) => (
          <div key={k} className="panel p-4"><FileText className="size-4 text-primary" /><div className="mt-3 text-2xl font-extrabold">{DOCS.filter((d) => d.kind === k).length * 14 + 3}</div><div className="text-xs text-muted-foreground">{k}s</div></div>
        ))}
      </div>
      <Panel><TableWrap>
        <thead><tr><Th>Document</Th><Th>Project</Th><Th>Type</Th><Th>Version</Th><Th>Size</Th><Th>Updated</Th><Th>By</Th></tr></thead>
        <tbody>{DOCS.map((d) => <tr key={d.id}><Td className="font-medium">{d.name}</Td><Td className="text-muted-foreground">{project(d.project)?.name}</Td><Td><Pill tone="muted">{d.kind}</Pill></Td><Td className="font-mono font-bold">{d.version}</Td><Td className="text-xs">{d.size}</Td><Td className="text-xs">{d.updated}</Td><Td><Avatar id={d.by} /></Td></tr>)}</tbody>
      </TableWrap></Panel>
    </div>
  );
}
