import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard, FolderKanban, PenTool, CheckSquare, CalendarDays, PackageCheck, Ruler, BadgeCheck, FileText,
  HardHat, Compass, Building2, Users, Wallet, BarChart3, Bell, Activity, Settings, Search, Plus, Sun, Moon,
  PanelLeftClose, PanelLeftOpen, Menu, X, Command as CmdIcon, Hexagon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Avatar } from "./ui";
import { APPROVALS, ISSUES, NOTIFICATIONS, PEOPLE, PROJECTS, DRAWINGS, CLIENTS, VISITS, PACKAGES } from "@/lib/data";

type Item = { to: string; label: string; icon: typeof LayoutDashboard; badge?: number; tone?: "warn" | "bad" };
const NAV: { group: string; items: Item[] }[] = [
  { group: "Main", items: [
    { to: "/", label: "Overview", icon: LayoutDashboard },
    { to: "/projects", label: "Projects", icon: FolderKanban, badge: PROJECTS.length },
    { to: "/design-studio", label: "Design Studio", icon: PenTool },
    { to: "/tasks", label: "Tasks", icon: CheckSquare, badge: 9 },
    { to: "/calendar", label: "Calendar", icon: CalendarDays },
  ] },
  { group: "Delivery", items: [
    { to: "/deliverables", label: "Deliverables", icon: PackageCheck },
    { to: "/drawings", label: "Drawings", icon: Ruler },
    { to: "/approvals", label: "Reviews & Approvals", icon: BadgeCheck, badge: APPROVALS.filter((a) => a.status === "Pending").length, tone: "warn" },
    { to: "/documents", label: "Documents", icon: FileText },
    { to: "/site", label: "Site & Supervision", icon: HardHat, badge: ISSUES.filter((i) => i.status === "Open" || i.status === "Overdue").length, tone: "bad" },
    { to: "/surveys", label: "Surveys", icon: Compass },
  ] },
  { group: "Management", items: [
    { to: "/clients", label: "Clients", icon: Building2 },
    { to: "/team", label: "Team & Workload", icon: Users },
    { to: "/commercial", label: "Commercial", icon: Wallet },
    { to: "/reports", label: "Reports", icon: BarChart3 },
  ] },
  { group: "System", items: [
    { to: "/notifications", label: "Notifications", icon: Bell, badge: NOTIFICATIONS.length },
    { to: "/activity", label: "Activity", icon: Activity },
    { to: "/settings", label: "Settings", icon: Settings },
  ] },
];
const ALL = NAV.flatMap((g) => g.items);

function SidebarBody({ collapsed, onNav }: { collapsed: boolean; onNav?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const active = (to: string) => (to === "/" ? path === "/" : path.startsWith(to));
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-6">
      {NAV.map((g) => (
        <div key={g.group}>
          {!collapsed && <div className="mb-1.5 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">{g.group}</div>}
          <ul className="space-y-0.5">
            {g.items.map((it) => {
              const on = active(it.to);
              return (
                <li key={it.to}>
                  <Link
                    to={it.to}
                    onClick={onNav}
                    title={it.label}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                      on ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      collapsed && "justify-center px-0",
                    )}
                  >
                    {on && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary glow-primary" />}
                    <it.icon className={cn("size-[17px] shrink-0", on && "text-primary")} />
                    {!collapsed && <span className="truncate">{it.label}</span>}
                    {!collapsed && it.badge != null && (
                      <span className={cn("ml-auto rounded-md px-1.5 py-px font-mono text-[10px] font-semibold",
                        it.tone === "warn" ? "bg-warn/15 text-warn" : it.tone === "bad" ? "bg-bad/15 text-bad" : "bg-muted text-muted-foreground")}>
                        {it.badge}
                      </span>
                    )}
                    {collapsed && it.badge != null && it.tone && <span className={cn("absolute right-2 top-1.5 size-1.5 rounded-full", it.tone === "warn" ? "bg-warn" : "bg-bad")} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={cn("flex h-16 shrink-0 items-center gap-2.5 px-5", collapsed && "justify-center px-0")}>
      <div className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
        <Hexagon className="size-4" strokeWidth={2.5} />
      </div>
      {!collapsed && (
        <div className="leading-tight">
          <div className="text-[15px] font-black tracking-tight">Studio Command</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Design · Engineering</div>
        </div>
      )}
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [cmd, setCmd] = useState(false);
  const [create, setCreate] = useState(false);
  const [notif, setNotif] = useState(false);
  const [dark, setDark] = useState(true);
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = ALL.find((i) => (i.to === "/" ? path === "/" : path.startsWith(i.to)));

  useEffect(() => {
    const saved = localStorage.getItem("sc-theme");
    if (saved) setDark(saved === "dark");
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("sc-theme", dark ? "dark" : "light");
  }, [dark]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmd((v) => !v); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const go = (to: string, params?: Record<string, string>) => { setCmd(false); navigate({ to, params } as never); };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 lg:flex", collapsed ? "w-[72px]" : "w-[244px]")}>
        <Brand collapsed={collapsed} />
        <SidebarBody collapsed={collapsed} />
        <div className={cn("flex items-center gap-3 border-t border-sidebar-border p-4", collapsed && "justify-center")}>
          <Avatar id="p2" size="md" />
          {!collapsed && <div className="min-w-0 leading-tight"><div className="truncate text-sm font-semibold">Omar Haddad</div><div className="truncate text-[11px] text-muted-foreground">Design Director</div></div>}
        </div>
      </aside>

      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent side="left" className="flex w-[280px] flex-col border-sidebar-border bg-sidebar p-0">
          <SheetHeader className="sr-only"><SheetTitle>Navigation</SheetTitle></SheetHeader>
          <Brand collapsed={false} />
          <SidebarBody collapsed={false} onNav={() => setMobile(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/75 px-4 backdrop-blur-xl md:px-6">
          <button onClick={() => setMobile(true)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Open menu"><Menu className="size-5" /></button>
          <button onClick={() => setCollapsed((v) => !v)} className="hidden rounded-md p-1.5 text-muted-foreground hover:bg-muted lg:block" aria-label="Collapse sidebar">
            {collapsed ? <PanelLeftOpen className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
          </button>
          <div className="hidden min-w-0 items-center gap-2 text-sm md:flex">
            <span className="text-muted-foreground">Studio</span><span className="text-muted-foreground/50">/</span>
            <span className="truncate font-semibold">{current?.label ?? "Project"}</span>
          </div>
          <button onClick={() => setCmd(true)} className="ml-auto flex h-9 w-full max-w-sm items-center gap-2 rounded-lg border bg-surface px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 md:ml-6">
            <Search className="size-4" /><span className="truncate">Search projects, drawings, RFIs…</span>
            <kbd className="ml-auto hidden items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] sm:inline-flex"><CmdIcon className="size-2.5" />K</kbd>
          </button>
          <div className="flex shrink-0 items-center gap-1 md:ml-auto">
            <Button variant="glow" size="sm" onClick={() => setCreate(true)} className="hidden sm:inline-flex"><Plus /> Create</Button>
            <button onClick={() => setNotif(true)} className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Notifications">
              <Bell className="size-[18px]" /><span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-bad ring-2 ring-background" />
            </button>
            <button onClick={() => setDark((v) => !v)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Toggle theme">
              {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </button>
          </div>
        </header>

        <main className="canvas-grid min-w-0 flex-1 px-4 py-6 pb-24 md:px-8 md:py-8 lg:pb-8">{children}</main>
      </div>

      {/* Mobile bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-background/90 backdrop-blur-xl lg:hidden">
        {([ALL[0], ALL[1], { to: "#create", label: "Create", icon: Plus }, ALL[7], ALL[9]] as Item[]).map((it) =>
          it.to === "#create" ? (
            <button key="c" onClick={() => setCreate(true)} className="flex flex-col items-center py-2"><span className="grid size-10 -translate-y-3 place-items-center rounded-full bg-primary text-primary-foreground glow-primary"><Plus className="size-5" /></span></button>
          ) : (
            <Link key={it.to} to={it.to} className={cn("flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium", (it.to === "/" ? path === "/" : path.startsWith(it.to)) ? "text-primary" : "text-muted-foreground")}>
              <it.icon className="size-5" />{it.label.split(" ")[0]}
            </Link>
          ),
        )}
      </nav>

      <CommandDialog open={cmd} onOpenChange={setCmd}>
        <CommandInput placeholder="Search everything across the studio…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Navigate">{ALL.map((i) => <CommandItem key={i.to} onSelect={() => go(i.to)}><i.icon />{i.label}</CommandItem>)}</CommandGroup>
          <CommandGroup heading="Projects">{PROJECTS.map((p) => <CommandItem key={p.id} value={`${p.name} ${p.code}`} onSelect={() => go("/projects/$id", { id: p.id })}><FolderKanban />{p.name}<span className="ml-auto font-mono text-[10px] text-muted-foreground">{p.code}</span></CommandItem>)}</CommandGroup>
          <CommandGroup heading="Drawings">{DRAWINGS.slice(0, 12).map((d) => <CommandItem key={d.no} value={`${d.no} ${d.title}`} onSelect={() => go("/drawings")}><Ruler />{d.title}<span className="ml-auto font-mono text-[10px] text-muted-foreground">{d.no}</span></CommandItem>)}</CommandGroup>
          <CommandGroup heading="RFIs & Issues">{ISSUES.map((i) => <CommandItem key={i.id} value={`${i.id} ${i.title}`} onSelect={() => go("/site")}><HardHat />{i.title}<span className="ml-auto font-mono text-[10px] text-muted-foreground">{i.id}</span></CommandItem>)}</CommandGroup>
          <CommandGroup heading="Site visits">{VISITS.map((v) => <CommandItem key={v.id} value={`${v.id} ${v.type}`} onSelect={() => go("/site")}><HardHat />{v.type}<span className="ml-auto font-mono text-[10px] text-muted-foreground">{v.id}</span></CommandItem>)}</CommandGroup>
          <CommandGroup heading="Deliverables">{PACKAGES.slice(0, 8).map((d) => <CommandItem key={d.id} value={`${d.name} ${d.id}`} onSelect={() => go("/deliverables")}><PackageCheck />{d.name}</CommandItem>)}</CommandGroup>
          <CommandGroup heading="Clients">{CLIENTS.map((c) => <CommandItem key={c.name} onSelect={() => go("/clients")}><Building2 />{c.name}</CommandItem>)}</CommandGroup>
          <CommandGroup heading="People">{PEOPLE.map((p) => <CommandItem key={p.id} value={p.name} onSelect={() => go("/team")}><Users />{p.name}<span className="ml-auto text-[10px] text-muted-foreground">{p.role}</span></CommandItem>)}</CommandGroup>
        </CommandList>
      </CommandDialog>

      <Dialog open={create} onOpenChange={setCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Quick create</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[["New Project", FolderKanban], ["Design Package", PenTool], ["Drawing", Ruler], ["Task", CheckSquare], ["Review Request", BadgeCheck], ["Site Visit", HardHat], ["RFI", FileText], ["Survey", Compass], ["Variation", Wallet]].map(([l, I]) => {
              const Icon = I as typeof Plus;
              return (
                <button key={l as string} onClick={() => { setCreate(false); toast.success(`${l} draft created`, { description: "Saved to your workspace (demo)." }); }}
                  className="flex flex-col items-start gap-3 rounded-xl border bg-surface p-3 text-left text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-primary/50">
                  <Icon className="size-4 text-primary" />{l as string}
                </button>
              );
            })}
          </div>
          <Input placeholder="Or describe it… e.g. 'RFI for parapet on Crescent School'" />
        </DialogContent>
      </Dialog>

      <Sheet open={notif} onOpenChange={setNotif}>
        <SheetContent className="w-full max-w-sm">
          <SheetHeader><SheetTitle>Notifications</SheetTitle></SheetHeader>
          <div className="mt-2 space-y-2 px-4">
            {NOTIFICATIONS.map((n, i) => (
              <div key={i} className="rounded-xl border bg-surface p-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className={cn("size-2 rounded-full", { bad: "bg-bad", warn: "bg-warn", ok: "bg-ok", info: "bg-info", review: "bg-review" }[n.tone])} />
                  {n.title}<span className="ml-auto font-mono text-[10px] text-muted-foreground">{n.when}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
              </div>
            ))}
            <Link to="/notifications" onClick={() => setNotif(false)} className="block pt-2 text-center text-xs font-semibold text-primary">View all</Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export const X_ICON = X;
