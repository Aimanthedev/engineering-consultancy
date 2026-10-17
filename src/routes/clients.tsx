import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { Bar, PageHeader, Panel } from "@/components/studio/ui";
import { CLIENTS, fmtQAR } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/clients")({
  head: () => seo("Clients", "Client portfolio, fee value, open approvals and relationship health."),
  component: Clients,
});

function Clients() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader eyebrow="Management" title="Clients" sub={`${CLIENTS.length} active client relationships`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CLIENTS.map((c) => (
          <Panel key={c.name}>
            <div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20"><Building2 className="size-5" /></div>
              <div className="min-w-0"><div className="truncate font-bold">{c.name}</div><div className="text-xs text-muted-foreground">{c.contact}</div></div></div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div><div className="text-xl font-extrabold">{c.projects}</div><div className="text-[10px] text-muted-foreground">Projects</div></div>
              <div><div className="text-xl font-extrabold">{fmtQAR(c.value).replace("QAR ", "")}</div><div className="text-[10px] text-muted-foreground">Fee value</div></div>
              <div><div className={c.pending ? "text-xl font-extrabold text-warn" : "text-xl font-extrabold"}>{c.pending}</div><div className="text-[10px] text-muted-foreground">Approvals</div></div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs"><span className="text-muted-foreground">Satisfaction</span><Bar value={c.satisfaction} tone={c.satisfaction > 85 ? "ok" : "info"} /><b>{c.satisfaction}</b></div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
