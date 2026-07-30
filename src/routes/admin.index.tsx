import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { CMS_TYPES } from "@/lib/cmsSchema";
import {
  Briefcase,
  Mail,
  ShieldCheck,
  Database,
  Layers,
  FileText,
  RefreshCw,
  Activity,
  Clock,
  Inbox,
  Search,
  TrendingUp,
  TrendingDown,
  MousePointerClick,
  Users,
  Repeat2,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminDashboard,
});

type AuditEvent = {
  id: string;
  created_at: string;
  action: "INSERT" | "UPDATE" | "DELETE";
  table_name: string;
  record_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
};

type RecentRow = { id: string; created_at: string; primary: string; secondary: string };

const ACTION_STYLES: Record<AuditEvent["action"], string> = {
  INSERT: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  UPDATE: "bg-primary/15 text-primary border-primary/30",
  DELETE: "bg-destructive/10 text-destructive border-destructive/30",
};

const DONUT_TONES = ["var(--primary)", "color-mix(in oklab, var(--primary) 55%, white)", "color-mix(in oklab, var(--primary) 28%, white)", "color-mix(in oklab, var(--primary) 12%, white)"];

function diffSummary(row: AuditEvent): string {
  if (row.action === "INSERT") return "Created new record";
  if (row.action === "DELETE") return "Removed record";
  const before = (row.old_data ?? {}) as Record<string, unknown>;
  const after = (row.new_data ?? {}) as Record<string, unknown>;
  const changes: string[] = [];
  for (const k of Object.keys(after)) {
    if (k === "status_updated_at" || k === "updated_at" || k === "created_at") continue;
    if (JSON.stringify(before[k]) !== JSON.stringify(after[k])) changes.push(k);
  }
  return changes.length ? `Updated ${changes.join(", ")}` : "Updated record";
}

/** Catmull-Rom → cubic bezier smoothing for the sparkline. */
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function delta(current: number, previous: number): { pct: number; up: boolean } {
  if (previous === 0) return { pct: current > 0 ? 100 : 0, up: current >= 0 };
  const pct = ((current - previous) / previous) * 100;
  return { pct: Math.abs(pct), up: pct >= 0 };
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<Record<string, number | null>>({
    applications: null,
    messages: null,
    audit: null,
  });
  const [trends, setTrends] = useState<Record<string, { pct: number; up: boolean }>>({});
  const [cmsCounts, setCmsCounts] = useState<Record<string, number>>({});
  const [recentEvents, setRecentEvents] = useState<AuditEvent[] | null>(null);
  const [recentApps, setRecentApps] = useState<RecentRow[] | null>(null);
  const [recentMsgs, setRecentMsgs] = useState<RecentRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = async () => {
    setError(null);
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      navigate({ to: "/admin/login" });
      return;
    }

    try {
      const now = Date.now();
      const d30 = new Date(now - 30 * 864e5).toISOString();
      const d60 = new Date(now - 60 * 864e5).toISOString();

      const [appsRes, msgsRes, auditRes] = await Promise.all([
        supabase.from("job_applications").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("audit_logs").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        applications: appsRes.count ?? 0,
        messages: msgsRes.count ?? 0,
        audit: auditRes.count ?? 0,
      });

      const window = async (table: "job_applications" | "contact_messages" | "audit_logs") => {
        const [cur, prev] = await Promise.all([
          supabase.from(table).select("id", { count: "exact", head: true }).gte("created_at", d30),
          supabase
            .from(table)
            .select("id", { count: "exact", head: true })
            .gte("created_at", d60)
            .lt("created_at", d30),
        ]);
        return delta(cur.count ?? 0, prev.count ?? 0);
      };
      const [tApps, tMsgs, tAudit] = await Promise.all([
        window("job_applications"),
        window("contact_messages"),
        window("audit_logs"),
      ]);
      setTrends({ applications: tApps, messages: tMsgs, audit: tAudit });

      const cmsOut: Record<string, number> = {};
      await Promise.all(
        Object.entries(CMS_TYPES).map(async ([key, cfg]) => {
          const { count } = await supabase.from(cfg.table).select("id", { count: "exact", head: true });
          cmsOut[key] = count ?? 0;
        }),
      );
      setCmsCounts(cmsOut);

      const [{ data: events, error: eventsErr }, apps, msgs] = await Promise.all([
        supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(400),
        supabase
          .from("job_applications")
          .select("id, created_at, full_name, job_title")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("contact_messages")
          .select("id, created_at, name, subject")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      if (eventsErr) throw eventsErr;
      setRecentEvents((events ?? []) as AuditEvent[]);
      setRecentApps(
        (apps.data ?? []).map((a) => ({
          id: a.id as string,
          created_at: a.created_at as string,
          primary: (a.full_name as string) ?? "—",
          secondary: (a.job_title as string) ?? "",
        })),
      );
      setRecentMsgs(
        (msgs.data ?? []).map((m) => ({
          id: m.id as string,
          created_at: m.created_at as string,
          primary: (m.name as string) ?? "—",
          secondary: (m.subject as string) ?? "",
        })),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Daily activity for the last 14 days → smooth line chart. */
  const line = useMemo(() => {
    const days: { label: string; short: string; count: number }[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      days.push({
        label: d.toISOString().slice(0, 10),
        short: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
        count: 0,
      });
    }
    for (const e of recentEvents ?? []) {
      const key = new Date(e.created_at).toISOString().slice(0, 10);
      const hit = days.find((d) => d.label === key);
      if (hit) hit.count += 1;
    }
    const max = Math.max(1, ...days.map((d) => d.count));
    const w = 640;
    const h = 180;
    const pts = days.map((d, i) => ({
      x: (i / (days.length - 1)) * w,
      y: h - (d.count / max) * (h - 16) - 8,
    }));
    return { days, max, w, h, pts, path: smoothPath(pts) };
  }, [recentEvents]);

  /** Monthly activity for the last 6 months → bar chart. */
  const bars = useMemo(() => {
    const months: { label: string; key: string; count: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleDateString(undefined, { month: "short" }),
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        count: 0,
      });
    }
    for (const e of recentEvents ?? []) {
      const key = e.created_at.slice(0, 7);
      const hit = months.find((m) => m.key === key);
      if (hit) hit.count += 1;
    }
    const max = Math.max(1, ...months.map((m) => m.count));
    return { months, max };
  }, [recentEvents]);

  /** Content mix → donut. */
  const donut = useMemo(() => {
    const entries = Object.entries(CMS_TYPES).map(([key, cfg], i) => ({
      key,
      label: cfg.label,
      value: cmsCounts[key] ?? 0,
      tone: DONUT_TONES[i % DONUT_TONES.length],
    }));
    const total = entries.reduce((a, b) => a + b.value, 0);
    let offset = 0;
    const segments = entries.map((e) => {
      const share = total ? e.value / total : 0;
      const seg = { ...e, share, dash: share * 100, offset };
      offset += share * 100;
      return seg;
    });
    return { segments, total };
  }, [cmsCounts]);

  /** Channel mix → progress bars (applications / messages / content edits). */
  const channels = useMemo(() => {
    const rows = [
      { label: "Job applications", value: counts.applications ?? 0 },
      { label: "Contact messages", value: counts.messages ?? 0 },
      { label: "Content items", value: Object.values(cmsCounts).reduce((a, b) => a + b, 0) },
    ];
    const max = Math.max(1, ...rows.map((r) => r.value));
    return { rows, max };
  }, [counts, cmsCounts]);

  const kpis = [
    {
      key: "applications",
      label: "Job applications",
      labelBn: "চাকরির আবেদন",
      count: counts.applications,
      href: "/admin/applications",
      icon: Users,
    },
    {
      key: "messages",
      label: "Contact messages",
      labelBn: "যোগাযোগ বার্তা",
      count: counts.messages,
      href: "/admin/messages",
      icon: MousePointerClick,
    },
    {
      key: "audit",
      label: "Audit events",
      labelBn: "অডিট ইভেন্ট",
      count: counts.audit,
      href: "/admin/audit",
      icon: Repeat2,
    },
  ];

  const cmsCards = Object.entries(CMS_TYPES).map(([key, cfg]) => {
    const iconMap: Record<string, typeof Database> = {
      ventures: Briefcase,
      services: Layers,
      industries: Database,
      insights: FileText,
    };
    return {
      key,
      label: cfg.label,
      labelBn: cfg.labelBn,
      count: cmsCounts[key] ?? null,
      icon: iconMap[key] ?? Database,
    };
  });

  const filteredEvents = (recentEvents ?? []).filter((e) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      e.table_name.toLowerCase().includes(q) ||
      e.action.toLowerCase().includes(q) ||
      diffSummary(e).toLowerCase().includes(q)
    );
  });

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        titleBn="সব কিছুর সারসংক্ষেপ এক জায়গায়"
        description="Applications, messages, content and audit activity at a glance."
        actions={
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <label className="relative flex min-w-0 flex-1 items-center sm:w-72">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search activity…"
                aria-label="Search recent activity"
                className="admin-glass-strong h-10 w-full rounded-full border border-glass-border pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <button
              onClick={load}
              disabled={loading}
              className="admin-glass-strong inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-glass-border px-4 text-sm font-semibold disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        }
      />

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* KPI row */}
      <div className="grid gap-4 md:grid-cols-3">
        {kpis.map((s) => {
          const Icon = s.icon;
          const t = trends[s.key];
          const Trend = t?.up ? TrendingUp : TrendingDown;
          return (
            <Link
              key={s.key}
              to={s.href}
              className="group rounded-2xl glass-card p-5 transition hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Icon className="h-4.5 w-4.5 text-primary" />
                <span className="min-w-0 truncate">{s.label}</span>
              </div>
              <div className="mt-3 font-display text-3xl font-bold tracking-tight">
                {s.count ?? "—"}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {t && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      t.up
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    <Trend className="h-3 w-3" />
                    {t.pct.toFixed(2)}%
                  </span>
                )}
                <span className="text-xs text-muted-foreground">vs previous 30 days</span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">{s.labelBn}</div>
            </Link>
          );
        })}
      </div>

      {/* Line chart + donut */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl glass-card p-5">
          <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="min-w-0 truncate font-display text-base font-semibold">Activity overview</h2>
            <Link
              to="/admin/audit"
              className="admin-glass-strong shrink-0 rounded-full border border-glass-border px-3 py-1.5 text-xs font-semibold"
            >
              View details
            </Link>
          </div>
          <div className="relative">
            <svg
              viewBox={`0 0 ${line.w} ${line.h}`}
              preserveAspectRatio="none"
              className="h-44 w-full overflow-visible"
              role="img"
              aria-label="Audit activity over the last 14 days"
            >
              <defs>
                <linearGradient id="admin-line-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 0.25, 0.5, 0.75, 1].map((g) => (
                <line
                  key={g}
                  x1="0"
                  x2={line.w}
                  y1={g * line.h}
                  y2={g * line.h}
                  stroke="currentColor"
                  strokeOpacity="0.12"
                  strokeDasharray="4 6"
                />
              ))}
              <path d={`${line.path} L ${line.w} ${line.h} L 0 ${line.h} Z`} fill="url(#admin-line-fill)" />
              <path
                d={line.path}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              {line.days
                .filter((_, i) => i % 2 === 0)
                .map((d) => (
                  <span key={d.label}>{d.short}</span>
                ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl glass-card p-5">
          <h2 className="mb-4 font-display text-base font-semibold">Content mix</h2>
          <div className="flex items-center gap-5">
            <svg viewBox="0 0 42 42" className="h-32 w-32 shrink-0 -rotate-90" role="img" aria-label="Content mix by type">
              <circle cx="21" cy="21" r="15.915" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="6" />
              {donut.segments.map((s) => (
                <circle
                  key={s.key}
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="none"
                  stroke={s.tone}
                  strokeWidth="6"
                  strokeDasharray={`${s.dash} ${100 - s.dash}`}
                  strokeDashoffset={-s.offset}
                />
              ))}
            </svg>
            <ul className="min-w-0 flex-1 space-y-2 text-sm">
              {donut.segments.map((s) => (
                <li key={s.key} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.tone }} />
                  <span className="min-w-0 flex-1 truncate">{s.label}</span>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {(s.share * 100).toFixed(2)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Channels + monthly performance */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl glass-card p-5">
          <h2 className="mb-4 font-display text-base font-semibold">Inbound sources</h2>
          <ul className="space-y-4">
            {channels.rows.map((r) => (
              <li key={r.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="min-w-0 truncate">{r.label}</span>
                  <span className="shrink-0 font-semibold tabular-nums">{r.value}</span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full rounded-full bg-gradient-primary"
                    style={{ width: `${Math.max(3, (r.value / channels.max) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl glass-card p-5">
          <h2 className="mb-4 font-display text-base font-semibold">Monthly performance</h2>
          <div className="flex h-40 items-stretch gap-3">
            {bars.months.map((m) => (
              <div key={m.key} className="group flex flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground opacity-0 transition group-hover:opacity-100">
                  {m.count}
                </span>
                <div
                  className="w-full rounded-lg bg-gradient-primary transition-all"
                  style={{ height: `${Math.max(6, (m.count / bars.max) * 118)}px` }}
                />
                <span className="text-[10px] text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Content library + recent lists */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl glass-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Database className="h-4.5 w-4.5 text-primary" />
            <h2 className="font-display text-base font-semibold">Content library</h2>
          </div>
          <ul className="space-y-1">
            {cmsCards.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.key}>
                  <Link
                    to="/admin/cms/$type"
                    params={{ type: c.key }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-foreground/5"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{c.label}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">{c.labelBn}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-primary">{c.count ?? "—"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <RecentList title="Latest applications" icon={Briefcase} rows={recentApps} href="/admin/applications" />
        <RecentList title="Latest messages" icon={Inbox} rows={recentMsgs} href="/admin/messages" />
      </div>

      <div className="mt-6 rounded-2xl glass-card p-1">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <h2 className="flex min-w-0 items-center gap-2 font-display text-base font-semibold">
            <Activity className="h-4.5 w-4.5 shrink-0 text-primary" />
            <span className="truncate">Recent activity</span>
          </h2>
          <Link to="/admin/audit" className="shrink-0 text-sm text-muted-foreground hover:text-primary">
            View all →
          </Link>
        </div>
        {loading ? (
          <p className="p-5 text-sm text-muted-foreground">Loading events…</p>
        ) : filteredEvents.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">
            {query ? "No events match your search." : "No audit events yet."}
          </p>
        ) : (
          <ul className="divide-y divide-glass-border/50">
            {filteredEvents.slice(0, 10).map((r) => (
              <li key={r.id} className="flex items-start gap-3 p-4">
                <span
                  className={`mt-0.5 inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${ACTION_STYLES[r.action]}`}
                >
                  {r.action}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground/90">{diffSummary(r)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <code className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-[10px]">
                      {r.table_name}
                    </code>{" "}
                    {r.record_id && <span className="font-mono">#{r.record_id.slice(0, 8)}</span>}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl glass-card px-5 py-4 text-sm text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        Database, auth and audit logging are active. Content is served dynamically from the CMS tables.
      </div>
    </>
  );
}

function RecentList({
  title,
  icon: Icon,
  rows,
  href,
}: {
  title: string;
  icon: typeof Briefcase;
  rows: RecentRow[] | null;
  href: string;
}) {
  return (
    <section className="rounded-2xl glass-card p-1">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
        <h2 className="flex min-w-0 items-center gap-2 font-display text-base font-semibold">
          <Icon className="h-4.5 w-4.5 shrink-0 text-primary" />
          <span className="truncate">{title}</span>
        </h2>
        <Link to={href} className="shrink-0 text-sm text-muted-foreground hover:text-primary">
          View all →
        </Link>
      </div>
      {!rows ? (
        <p className="p-5 text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">Nothing yet.</p>
      ) : (
        <ul className="divide-y divide-glass-border/50">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{r.primary}</div>
                <div className="truncate text-xs text-muted-foreground">{r.secondary}</div>
              </div>
              <div className="shrink-0 text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
