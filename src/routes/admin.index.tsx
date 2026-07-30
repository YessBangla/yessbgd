import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/PageHero";
import { CMS_TYPES } from "@/lib/cmsSchema";
import {
  LayoutDashboard,
  Briefcase,
  Mail,
  ShieldCheck,
  Database,
  Layers,
  FileText,
  LogOut,
  ArrowRight,
  RefreshCw,
  Users,
  Activity,
  Clock,
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

type Stat = {
  key: string;
  label: string;
  labelBn: string;
  count: number | null;
  href: string;
  icon: typeof LayoutDashboard;
  color: string;
};

type AuditEvent = {
  id: string;
  created_at: string;
  action: "INSERT" | "UPDATE" | "DELETE";
  table_name: string;
  record_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
};

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
    if (JSON.stringify(before[k]) !== JSON.stringify(after[k])) {
      changes.push(k);
    }
  }
  return changes.length ? `Updated ${changes.join(", ")}` : "Updated record";
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [stats, setStats] = useState<Stat[]>([
    {
      key: "applications",
      label: "Job applications",
      labelBn: "চাকরির আবেদন",
      count: null,
      href: "/admin/applications",
      icon: Briefcase,
      color: "bg-primary/10 text-primary",
    },
    {
      key: "messages",
      label: "Contact messages",
      labelBn: "যোগাযোগ বার্তা",
      count: null,
      href: "/admin/messages",
      icon: Mail,
      color: "bg-accent/10 text-accent-foreground",
    },
    {
      key: "audit",
      label: "Audit events",
      labelBn: "অডিট ইভেন্ট",
      count: null,
      href: "/admin/audit",
      icon: ShieldCheck,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
  ]);
  const [cmsCounts, setCmsCounts] = useState<Record<string, number>>({});
  const [recentEvents, setRecentEvents] = useState<AuditEvent[] | null>(null);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      navigate({ to: "/admin/login" });
      return;
    }
    setReady(true);

    try {
      const [appsRes, msgsRes, auditRes] = await Promise.all([
        supabase.from("job_applications").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("audit_logs").select("id", { count: "exact", head: true }),
      ]);

      setStats((prev) =>
        prev.map((s) => {
          if (s.key === "applications") return { ...s, count: appsRes.count ?? 0 };
          if (s.key === "messages") return { ...s, count: msgsRes.count ?? 0 };
          if (s.key === "audit") return { ...s, count: auditRes.count ?? 0 };
          return s;
        }),
      );

      const cmsOut: Record<string, number> = {};
      await Promise.all(
        Object.entries(CMS_TYPES).map(async ([key, cfg]) => {
          const { count } = await supabase
            .from(cfg.table)
            .select("id", { count: "exact", head: true });
          cmsOut[key] = count ?? 0;
        }),
      );
      setCmsCounts(cmsOut);

      const { data: events, error: eventsErr } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (eventsErr) throw eventsErr;
      setRecentEvents((events ?? []) as AuditEvent[]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  if (!ready) {
    return (
      <section className="py-24">
        <div className="container-tight text-sm text-muted-foreground">Loading…</div>
      </section>
    );
  }

  const cmsCards = Object.entries(CMS_TYPES).map(([key, cfg]) => {
    const iconMap: Record<string, typeof Database> = {
      ventures: Briefcase,
      services: Layers,
      industries: Database,
      insights: FileText,
    };
    const Icon = iconMap[key] ?? Database;
    return {
      key,
      label: cfg.label,
      labelBn: cfg.labelBn,
      count: cmsCounts[key] ?? null,
      href: `/admin/cms/$type`,
      params: { type: key },
      icon: Icon,
      color: "bg-primary/10 text-primary",
    };
  });

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Dashboard"
        subtitle="সব কিছুর সারসংক্ষেপ এক জায়গায় — আবেদন, বার্তা, কনটেন্ট এবং অডিট।"
      />
      <section className="pb-24">
        <div className="container-tight">
          {error && (
            <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                Welcome back, admin.
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={load}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.key}
                  to={s.href}
                  className="group relative overflow-hidden rounded-2xl glass-card p-6 transition hover:shadow-glow"
                >
                  <div className="flex items-start justify-between">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl ${s.color}`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <div className="mt-5">
                    <div className="font-display text-3xl font-semibold">
                      {s.count === null ? "—" : s.count}
                    </div>
                    <div className="mt-1 text-sm font-semibold">{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.labelBn}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
              <Database className="h-5 w-5 text-primary" />
              Content management
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cmsCards.map((c) => {
                const Icon = c.icon;
                return (
                  <Link
                    key={c.key}
                    to={c.href}
                    params={c.params}
                    className="group rounded-2xl glass-card p-5 transition hover:shadow-glow"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`grid h-10 w-10 place-items-center rounded-xl ${c.color}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{c.label}</div>
                        <div className="text-xs text-muted-foreground">{c.labelBn}</div>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        {c.count === null ? "—" : c.count}
                      </span>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary">
                      Manage <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent activity
                </h2>
                <Link
                  to="/admin/audit"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  View all →
                </Link>
              </div>
              <div className="rounded-2xl glass-card p-1">
                {loadingEvents ? (
                  <p className="p-6 text-sm text-muted-foreground">Loading events…</p>
                ) : recentEvents && recentEvents.length === 0 ? (
                  <p className="p-6 text-sm text-muted-foreground">No audit events yet.</p>
                ) : (
                  <ul className="divide-y divide-glass-border/50">
                    {(recentEvents ?? []).map((r) => (
                      <li key={r.id} className="flex items-start gap-3 p-4">
                        <span
                          className={`mt-0.5 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${ACTION_STYLES[r.action]}`}
                        >
                          {r.action}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-foreground/90">{diffSummary(r)}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
                              {r.table_name}
                            </code>{" "}
                            {r.record_id && (
                              <span className="font-mono">#{r.record_id.slice(0, 8)}</span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(r.created_at).toLocaleDateString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                Quick links
              </h2>
              <div className="rounded-2xl glass-card p-2">
                {[
                  { to: "/admin/applications", label: "Job applications", desc: "Review CVs & status" },
                  { to: "/admin/messages", label: "Contact messages", desc: "Inbound inquiries" },
                  { to: "/admin/audit", label: "Audit log", desc: "Track every change" },
                  { to: "/admin/cms", label: "Content (CMS)", desc: "Edit site content" },
                ].map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="flex items-center justify-between rounded-xl p-3 transition hover:bg-secondary/50"
                  >
                    <div>
                      <div className="text-sm font-semibold">{l.label}</div>
                      <div className="text-xs text-muted-foreground">{l.desc}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
