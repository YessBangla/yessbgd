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
  ArrowRight,
  RefreshCw,
  Activity,
  Clock,
  BarChart3,
  Inbox,
  CheckCircle2,
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
  INSERT: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  UPDATE: "bg-primary/15 text-primary border-primary/30",
  DELETE: "bg-destructive/10 text-destructive border-destructive/30",
};

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

function AdminDashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<Record<string, number | null>>({
    applications: null,
    messages: null,
    audit: null,
  });
  const [cmsCounts, setCmsCounts] = useState<Record<string, number>>({});
  const [recentEvents, setRecentEvents] = useState<AuditEvent[] | null>(null);
  const [recentApps, setRecentApps] = useState<RecentRow[] | null>(null);
  const [recentMsgs, setRecentMsgs] = useState<RecentRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      navigate({ to: "/admin/login" });
      return;
    }

    try {
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

      const cmsOut: Record<string, number> = {};
      await Promise.all(
        Object.entries(CMS_TYPES).map(async ([key, cfg]) => {
          const { count } = await supabase.from(cfg.table).select("id", { count: "exact", head: true });
          cmsOut[key] = count ?? 0;
        }),
      );
      setCmsCounts(cmsOut);

      const [{ data: events, error: eventsErr }, apps, msgs] = await Promise.all([
        supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(120),
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

  // 14-day activity histogram from audit events.
  const chart = useMemo(() => {
    const days: { label: string; count: number }[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      days.push({ label: d.toISOString().slice(5, 10), count: 0 });
    }
    for (const e of recentEvents ?? []) {
      const key = new Date(e.created_at).toISOString().slice(5, 10);
      const hit = days.find((d) => d.label === key);
      if (hit) hit.count += 1;
    }
    const max = Math.max(1, ...days.map((d) => d.count));
    return { days, max };
  }, [recentEvents]);

  const stats = [
    {
      key: "applications",
      label: "Job applications",
      labelBn: "চাকরির আবেদন",
      count: counts.applications,
      href: "/admin/applications",
      icon: Briefcase,
      color: "bg-primary/10 text-primary",
    },
    {
      key: "messages",
      label: "Contact messages",
      labelBn: "যোগাযোগ বার্তা",
      count: counts.messages,
      href: "/admin/messages",
      icon: Mail,
      color: "bg-accent/10 text-accent-foreground",
    },
    {
      key: "audit",
      label: "Audit events",
      labelBn: "অডিট ইভেন্ট",
      count: counts.audit,
      href: "/admin/audit",
      icon: ShieldCheck,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      key: "content",
      label: "Content items",
      labelBn: "কনটেন্ট আইটেম",
      count: Object.keys(cmsCounts).length
        ? Object.values(cmsCounts).reduce((a, b) => a + b, 0)
        : null,
      href: "/admin/cms",
      icon: Database,
      color: "bg-primary/10 text-primary",
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

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        titleBn="সব কিছুর সারসংক্ষেপ এক জায়গায়"
        description="Applications, messages, content and audit activity at a glance."
        actions={
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        }
      />

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.key}
              to={s.href}
              className="group relative overflow-hidden rounded-2xl glass-card p-5 transition hover:shadow-glow"
            >
              <div className="flex items-start justify-between">
                <span className={`grid h-11 w-11 place-items-center rounded-2xl ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
              <div className="mt-4">
                <div className="font-display text-3xl font-semibold">{s.count ?? "—"}</div>
                <div className="mt-1 text-sm font-semibold">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.labelBn}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl glass-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4.5 w-4.5 text-primary" />
            <h2 className="font-display text-base font-semibold">Activity — last 14 days</h2>
          </div>
          <div className="flex h-40 items-end gap-1.5">
            {chart.days.map((d) => (
              <div key={d.label} className="group flex flex-1 flex-col items-center justify-end gap-1.5">
                <span className="text-[10px] text-muted-foreground opacity-0 transition group-hover:opacity-100">
                  {d.count}
                </span>
                <div
                  className="w-full rounded-t-md bg-gradient-primary transition-all"
                  style={{ height: `${Math.max(4, (d.count / chart.max) * 100)}%` }}
                />
                <span className="text-[9px] text-muted-foreground">{d.label.slice(3)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl glass-card p-5">
          <div className="mb-4 flex items-center gap-2">
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
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-secondary/60"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{c.label}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">{c.labelBn}</span>
                    </span>
                    <span className="text-sm font-semibold text-primary">{c.count ?? "—"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RecentList
          title="Latest applications"
          icon={Briefcase}
          rows={recentApps}
          href="/admin/applications"
        />
        <RecentList title="Latest messages" icon={Inbox} rows={recentMsgs} href="/admin/messages" />
      </div>

      <div className="mt-6 rounded-2xl glass-card p-1">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <Activity className="h-4.5 w-4.5 text-primary" />
            Recent activity
          </h2>
          <Link to="/admin/audit" className="text-sm text-muted-foreground hover:text-primary">
            View all →
          </Link>
        </div>
        {loading ? (
          <p className="p-5 text-sm text-muted-foreground">Loading events…</p>
        ) : recentEvents && recentEvents.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No audit events yet.</p>
        ) : (
          <ul className="divide-y divide-glass-border/50">
            {(recentEvents ?? []).slice(0, 10).map((r) => (
              <li key={r.id} className="flex items-start gap-3 p-4">
                <span
                  className={`mt-0.5 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${ACTION_STYLES[r.action]}`}
                >
                  {r.action}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground/90">{diffSummary(r)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
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
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
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
    <div className="rounded-2xl glass-card p-1">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold">
          <Icon className="h-4.5 w-4.5 text-primary" />
          {title}
        </h2>
        <Link to={href} className="text-sm text-muted-foreground hover:text-primary">
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
    </div>
  );
}
