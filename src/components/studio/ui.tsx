import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { person } from "@/lib/data";

export type Tone = "ok" | "warn" | "bad" | "info" | "review" | "muted";

const toneMap: Record<string, Tone> = {
  "On Track": "ok", Approved: "ok", Done: "ok", Closed: "ok", Issued: "ok", Paid: "ok", Delivered: "ok", IFC: "ok",
  "At Risk": "warn", Pending: "warn", "Client Review": "warn", Comments: "warn", Due: "warn", "For Approval": "warn", "Report Draft": "warn", "Awaiting Client": "warn", Responded: "warn", Processing: "warn", High: "warn", Major: "warn",
  Delayed: "bad", Rejected: "bad", Blocked: "bad", Overdue: "bad", Critical: "bad", Open: "bad",
  "In Design": "info", "In Progress": "info", WIP: "info", Scheduled: "info", Invoiced: "info", "In Field": "info", Medium: "info",
  Review: "review", "Internal Review": "review", "For Review": "review", Revision: "review",
};
export const toneOf = (s: string): Tone => toneMap[s] ?? "muted";

const toneCls: Record<Tone, string> = {
  ok: "text-ok bg-ok/10 ring-ok/20",
  warn: "text-warn bg-warn/10 ring-warn/20",
  bad: "text-bad bg-bad/10 ring-bad/20",
  info: "text-info bg-info/10 ring-info/20",
  review: "text-review bg-review/10 ring-review/20",
  muted: "text-muted-foreground bg-muted ring-border",
};
export const toneText: Record<Tone, string> = { ok: "text-ok", warn: "text-warn", bad: "text-bad", info: "text-info", review: "text-review", muted: "text-muted-foreground" };
export const toneBg: Record<Tone, string> = { ok: "bg-ok", warn: "bg-warn", bad: "bg-bad", info: "bg-info", review: "bg-review", muted: "bg-muted-foreground" };

export function Pill({ children, tone, className }: { children: ReactNode; tone?: Tone; className?: string }) {
  const t = tone ?? toneOf(String(children));
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset", toneCls[t], className)}>
      <span className={cn("size-1.5 rounded-full", toneBg[t])} />
      {children}
    </span>
  );
}

export function Avatar({ id, size = "sm" }: { id: string; size?: "sm" | "md" | "lg" }) {
  const p = person(id);
  const hue = (parseInt(id.slice(1)) * 47) % 360;
  return (
    <span
      title={`${p.name} · ${p.role}`}
      className={cn("inline-grid shrink-0 place-items-center rounded-full font-semibold ring-2 ring-background", size === "sm" ? "size-6 text-[10px]" : size === "md" ? "size-8 text-xs" : "size-11 text-sm")}
      style={{ background: `oklch(0.6 0.12 ${hue} / 0.22)`, color: `oklch(0.75 0.13 ${hue})` }}
    >
      {p.initials}
    </span>
  );
}

export function Bar({ value, tone = "info", className }: { value: number; tone?: Tone; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className={cn("h-full rounded-full transition-all duration-700", toneBg[tone])} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

export function Ring({ value, size = 56, tone = "info" }: { value: number; size?: number; tone?: Tone }) {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={4} className="stroke-muted" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={4} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} className={cn("transition-all duration-700", { ok: "stroke-ok", warn: "stroke-warn", bad: "stroke-bad", info: "stroke-info", review: "stroke-review", muted: "stroke-muted-foreground" }[tone])} />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="rotate-90 fill-foreground text-[11px] font-bold" style={{ transformOrigin: "center" }}>{value}%</text>
    </svg>
  );
}

export function Panel({ title, action, children, className, sub }: { title?: ReactNode; sub?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("panel rise flex min-w-0 flex-col p-5", className)}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h3 className="truncate text-[15px] font-bold tracking-tight">{title}</h3>}
            {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ eyebrow, title, sub, actions }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{eyebrow}</div>}
        <h1 className="text-2xl font-bold tracking-tight md:text-[32px]">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Kpi({ label, value, sub, tone = "info", children }: { label: string; value: ReactNode; sub?: ReactNode; tone?: Tone; children?: ReactNode }) {
  return (
    <div className="panel rise relative flex flex-col overflow-hidden p-5">
      <div className={cn("absolute -right-10 -top-10 size-32 rounded-full opacity-20 blur-2xl", toneBg[tone])} />
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-5xl font-extrabold tracking-tighter tabular-nums">{value}</div>
      {sub && <div className={cn("mt-1 text-xs font-semibold", toneText[tone])}>{sub}</div>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function Spark({ data, tone = "info" }: { data: number[]; tone?: Tone }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * 100},${30 - ((d - min) / (max - min || 1)) * 26}`).join(" ");
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className={cn("h-10 w-full", toneText[tone])}>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
      <polygon points={`0,32 ${pts} 100,32`} fill="currentColor" opacity="0.1" />
    </svg>
  );
}

export function Cover({ hue, seed, className }: { hue: number; seed: number; className?: string }) {
  const lines = Array.from({ length: 6 }, (_, i) => (seed * (i + 3)) % 100);
  return (
    <svg viewBox="0 0 200 90" preserveAspectRatio="xMidYMid slice" className={cn("w-full", className)}>
      <defs>
        <linearGradient id={`g${seed}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={`oklch(0.45 0.12 ${hue})`} />
          <stop offset="1" stopColor={`oklch(0.22 0.06 ${hue + 30})`} />
        </linearGradient>
      </defs>
      <rect width="200" height="90" fill={`url(#g${seed})`} />
      <g stroke="oklch(1 0 0 / 0.18)" strokeWidth="0.6" fill="none">
        {lines.map((l, i) => <line key={i} x1={l * 2} y1="0" x2={l * 2 - 40} y2="90" />)}
        <rect x={40 + (seed % 40)} y="22" width="60" height="46" />
        <rect x={70 + (seed % 30)} y="34" width="50" height="34" fill="oklch(1 0 0 / 0.06)" />
        <circle cx={150 - (seed % 30)} cy="30" r="14" />
      </g>
    </svg>
  );
}

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-lg border bg-surface p-0.5">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={cn("rounded-md px-3 py-1 text-xs font-semibold transition-colors", value === o ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn("whitespace-nowrap border-b px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", className)}>{children}</th>;
}
export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("whitespace-nowrap border-b px-3 py-3 text-sm", className)}>{children}</td>;
}
export function TableWrap({ children }: { children: ReactNode }) {
  return <div className="-mx-5 overflow-x-auto"><table className="w-full min-w-[720px] border-collapse [&_tbody_tr:hover]:bg-muted/40 [&_td:first-child]:pl-5 [&_th:first-child]:pl-5">{children}</table></div>;
}
