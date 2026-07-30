import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { CMS_TYPES } from "@/lib/cmsSchema";
import {
  Briefcase,
  Mail,
  Database,
  Layers,
  FileText,
  RefreshCw,
  Image as ImageIcon,
  FilePlus2,
  Settings,
  ListTree,
  Users,
  ArrowRight,
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

type RecentRow = { id: string; created_at: string; primary: string; secondary: string };

/** Big, plain-language shortcuts — the main way people use the dashboard. */
const TASKS = [
  {
    to: "/admin/pages",
    icon: FilePlus2,
    title: "Edit a page",
    titleBn: "পেজের লেখা বদলান",
    help: "হোম, About, Contact — যেকোনো পেজের লেখা ও ছবি বদলান।",
  },
  {
    to: "/admin/media",
    icon: ImageIcon,
    title: "Photos & files",
    titleBn: "ছবি আপলোড করুন",
    help: "নতুন ছবি আপলোড করুন বা গ্যালারি থেকে বেছে নিন।",
  },
  {
    to: "/admin/cms",
    icon: Layers,
    title: "Content",
    titleBn: "ভেঞ্চার, সার্ভিস, ইনসাইট",
    help: "ভেঞ্চার, সার্ভিস, ইন্ডাস্ট্রি ও ইনসাইট যোগ বা সম্পাদনা করুন।",
  },
  {
    to: "/admin/menus",
    icon: ListTree,
    title: "Menu",
    titleBn: "মেনু সাজান",
    help: "উপরের মেনু ও সাবমেনুর ক্রম ঠিক করুন।",
  },
  {
    to: "/admin/settings",
    icon: Settings,
    title: "Site settings",
    titleBn: "নাম, ঠিকানা, লোগো",
    help: "কোম্পানির নাম, ফোন, ইমেইল, ঠিকানা ও লোগো।",
  },
  {
    to: "/admin/applications",
    icon: Users,
    title: "Job applications",
    titleBn: "চাকরির আবেদন",
    help: "কে কোন পদে আবেদন করেছে দেখুন।",
  },
] as const;

const CMS_ICONS: Record<string, typeof Database> = {
  ventures: Briefcase,
  services: Layers,
  industries: Database,
  insights: FileText,
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "এইমাত্র";
  if (m < 60) return `${m} মিনিট আগে`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} ঘন্টা আগে`;
  const d = Math.round(h / 24);
  return `${d} দিন আগে`;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<number | null>(null);
  const [msgs, setMsgs] = useState<number | null>(null);
  const [cmsCounts, setCmsCounts] = useState<Record<string, number>>({});
  const [recentApps, setRecentApps] = useState<RecentRow[]>([]);
  const [recentMsgs, setRecentMsgs] = useState<RecentRow[]>([]);
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
      const [appsRes, msgsRes, appRows, msgRows] = await Promise.all([
        supabase.from("job_applications").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
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
      setApps(appsRes.count ?? 0);
      setMsgs(msgsRes.count ?? 0);
      setRecentApps(
        (appRows.data ?? []).map((a) => ({
          id: a.id as string,
          created_at: a.created_at as string,
          primary: (a.full_name as string) ?? "—",
          secondary: (a.job_title as string) ?? "",
        })),
      );
      setRecentMsgs(
        (msgRows.data ?? []).map((m) => ({
          id: m.id as string,
          created_at: m.created_at as string,
          primary: (m.name as string) ?? "—",
          secondary: (m.subject as string) ?? "",
        })),
      );

      const out: Record<string, number> = {};
      await Promise.all(
        Object.entries(CMS_TYPES).map(async ([key, cfg]) => {
          const { count } = await supabase.from(cfg.table).select("id", { count: "exact", head: true });
          out[key] = count ?? 0;
        }),
      );
      setCmsCounts(out);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        titleBn="আপনি কী করতে চান?"
        description="নিচের যেকোনো একটি কার্ডে ক্লিক করে কাজ শুরু করুন। কোনো কোড লেখার দরকার নেই।"
        actions={
          <button
            onClick={load}
            disabled={loading}
            className="admin-glass-strong inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-glass-border px-4 text-sm font-semibold disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh · রিফ্রেশ</span>
          </button>
        }
      />

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Main task cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TASKS.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="group rounded-2xl glass-card p-5 transition hover:-translate-y-0.5 hover:shadow-glow"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div className="mt-3 text-base font-semibold">{t.titleBn}</div>
              <div className="text-xs text-muted-foreground">{t.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{t.help}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                শুরু করুন <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>

      {/* Simple numbers */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link to="/admin/applications" className="rounded-2xl glass-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-primary" /> চাকরির আবেদন
          </div>
          <div className="mt-2 font-display text-3xl font-bold">{apps ?? "—"}</div>
        </Link>
        <Link to="/admin/messages" className="rounded-2xl glass-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Mail className="h-4 w-4 text-primary" /> যোগাযোগ বার্তা
          </div>
          <div className="mt-2 font-display text-3xl font-bold">{msgs ?? "—"}</div>
        </Link>
        <div className="rounded-2xl glass-card p-5">
          <div className="text-sm font-semibold">কনটেন্ট সংখ্যা</div>
          <div className="mt-3 space-y-2">
            {Object.entries(CMS_TYPES).map(([key, cfg]) => {
              const Icon = CMS_ICONS[key] ?? Database;
              return (
                <Link
                  key={key}
                  to="/admin/cms/$type"
                  params={{ type: key }}
                  className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-primary/5"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{cfg.labelBn || cfg.label}</span>
                  </span>
                  <span className="font-semibold">{cmsCounts[key] ?? "—"}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Latest items */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl glass-card p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-display text-base font-semibold">নতুন আবেদন</h2>
            <Link to="/admin/applications" className="text-xs font-semibold text-primary">
              সব দেখুন
            </Link>
          </div>
          {recentApps.length === 0 ? (
            <p className="text-sm text-muted-foreground">এখনো কোনো আবেদন আসেনি।</p>
          ) : (
            <ul className="divide-y divide-glass-border">
              {recentApps.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{r.primary}</div>
                    <div className="truncate text-xs text-muted-foreground">{r.secondary}</div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(r.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl glass-card p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-display text-base font-semibold">নতুন বার্তা</h2>
            <Link to="/admin/messages" className="text-xs font-semibold text-primary">
              সব দেখুন
            </Link>
          </div>
          {recentMsgs.length === 0 ? (
            <p className="text-sm text-muted-foreground">এখনো কোনো বার্তা আসেনি।</p>
          ) : (
            <ul className="divide-y divide-glass-border">
              {recentMsgs.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{r.primary}</div>
                    <div className="truncate text-xs text-muted-foreground">{r.secondary}</div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(r.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="mt-8 rounded-2xl glass-card p-5 text-sm text-muted-foreground">
        সাহায্য দরকার? যেকোনো কার্ডে ক্লিক করুন — প্রতিটি পাতায় ধাপে ধাপে ফর্ম দেওয়া আছে। পরিবর্তনের পর
        <span className="font-semibold text-foreground"> Save</span> বাটনে ক্লিক করলেই ওয়েবসাইটে দেখা যাবে।
      </p>
    </>
  );
}
