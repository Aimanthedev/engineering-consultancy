import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Avatar, PageHeader, Panel, Pill, Segmented, TableWrap, Td, Th } from "@/components/studio/ui";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DRAWINGS, project, person, type Drawing } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/drawings")({
  head: () => seo("Drawings Register", "Master drawings register with revisions, status and issue history."),
  component: Drawings,
});

const ST = ["All", "WIP", "For Review", "For Approval", "Approved", "IFC", "Superseded"] as const;

function Drawings() {
  const [q, setQ] = useState("");
  const [st, setSt] = useState<(typeof ST)[number]>("All");
  const [open, setOpen] = useState<Drawing | null>(null);
  const list = DRAWINGS.filter((d) => (st === "All" || d.status === st) && `${d.no} ${d.title}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader eyebrow="Delivery" title="Drawings Register" sub={`${list.length} drawings · current revisions only`} />
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-[220px] flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search drawing no. or title…" className="h-9 w-full rounded-lg border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary/50" /></div>
        <div className="overflow-x-auto"><Segmented value={st} options={ST} onChange={setSt} /></div>
      </div>
      <Panel>
        <TableWrap>
          <thead><tr><Th>Drawing no.</Th><Th>Title</Th><Th>Project</Th><Th>Discipline</Th><Th>Rev</Th><Th>Scale</Th><Th>Date</Th><Th>By</Th><Th>Status</Th></tr></thead>
          <tbody>{list.slice(0, 80).map((d) => (
            <tr key={d.no} onClick={() => setOpen(d)} className="cursor-pointer"><Td className="font-mono text-xs text-primary">{d.no}</Td><Td className="font-medium">{d.title}</Td><Td className="text-muted-foreground">{project(d.project)?.name}</Td><Td>{d.discipline}</Td><Td className="font-mono font-bold">{d.rev}</Td><Td>{d.scale}</Td><Td className="text-xs">{d.date}</Td><Td><Avatar id={d.by} /></Td><Td><Pill>{d.status}</Pill></Td></tr>
          ))}</tbody>
        </TableWrap>
      </Panel>
      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {open && <>
            <SheetHeader><SheetTitle className="font-mono">{open.no}</SheetTitle></SheetHeader>
            <div className="space-y-5 px-4 pb-8">
              <div className="canvas-grid relative grid aspect-[1.414] place-items-center rounded-xl border bg-surface">
                <svg viewBox="0 0 140 100" className="w-3/4 text-primary/70"><g fill="none" stroke="currentColor" strokeWidth=".6"><rect x="10" y="10" width="120" height="80" /><line x1="60" y1="10" x2="60" y2="90" /><line x1="10" y1="50" x2="130" y2="50" /><rect x="70" y="60" width="40" height="20" /><circle cx="35" cy="30" r="8" /></g></svg>
                <div className="absolute bottom-2 right-2 rounded border bg-background/80 px-2 py-1 font-mono text-[10px]">{open.scale} · {open.rev}</div>
              </div>
              <div><div className="text-lg font-bold">{open.title}</div><div className="text-sm text-muted-foreground">{project(open.project)?.name} · {open.discipline}</div></div>
              <div><div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Revision history</div>
                {["P01", "P02", "P03", "C01", "C02"].slice(0, 4).map((r, i) => (
                  <div key={r} className="flex items-center gap-3 border-b py-2 text-sm"><span className="w-10 font-mono font-bold">{r}</span><span className="text-muted-foreground">{["Preliminary issue", "Updated per coordination", "Client comments incorporated", "Construction issue"][i]}</span><span className="ml-auto text-xs text-muted-foreground">{i * 6 + 3} Sep</span></div>
                ))}</div>
              <div className="flex items-center gap-2 text-sm"><Avatar id={open.by} />Drawn by {person(open.by).name}<Pill className="ml-auto">{open.status}</Pill></div>
            </div>
          </>}
        </SheetContent>
      </Sheet>
    </div>
  );
}
