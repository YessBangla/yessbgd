import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/PageHero";
import { Download, LogOut, Mail, Phone, Linkedin, FileText, Trash2, RefreshCw } from "lucide-react";

type Status =
  | "Submitted"
  | "Under review"
  | "Interview"
  | "Offer"
  | "Hired"
  | "On hold"
  | "Rejected"
  | "New"
  | "Reviewed";
const STATUSES: Status[] = [
  "Submitted",
  "Under review",
  "Interview",
  "Offer",
  "Hired",
  "On hold",
  "Rejected",
];
const STATUS_STYLES: Record<Status, string> = {
  Submitted: "bg-primary/15 text-primary border-primary/30",
  "Under review": "bg-primary/15 text-primary border-primary/30",
  Interview: "bg-accent/15 text-accent-foreground border-accent/30",
  Offer: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  Hired: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  "On hold": "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Rejected: "bg-destructive/10 text-destructive border-destructive/30",
  New: "bg-primary/15 text-primary border-primary/30",
  Reviewed: "bg-primary/15 text-primary border-primary/30",
};

export const Route = createFileRoute("/admin/applications")({
  head: () => ({
    meta: [
      { title: "Job applications — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminApplications,
});

type Application = {
  id: string;
  job_slug: string;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  linkedin: string | null;
  cover_letter: string;
  resume_path: string;
  resume_name: string;
  resume_size: number;
  resume_type: string;
  created_at: string;
  status: Status;
  status_note: string | null;
  status_updated_at: string;
};

type ResumeKind = "all" | "pdf" | "doc" | "other";

function classifyResume(a: Application): Exclude<ResumeKind, "all"> {
  const t = (a.resume_type || "").toLowerCase();
  const n = (a.resume_name || "").toLowerCase();
  if (t.includes("pdf") || n.endsWith(".pdf")) return "pdf";
  if (
    t.includes("msword") ||
    t.includes("wordprocessingml") ||
    n.endsWith(".doc") ||
    n.endsWith(".docx")
  )
    return "doc";
  return "other";
}

function AdminApplications() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Application[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<ResumeKind>("all");
  const [minKB, setMinKB] = useState<string>("");
  const [maxKB, setMaxKB] = useState<string>("");

  const load = async () => {
    setError(null);
    const { data, error: e } = await supabase
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (e) {
      setError(e.message);
      setItems([]);
      return;
    }
    setItems((data ?? []) as Application[]);
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({ to: "/admin/login" });
        return;
      }
      setAuthChecked(true);
      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Realtime: refresh on insert/update/delete
  useEffect(() => {
    if (!authChecked) return;
    const channel = supabase
      .channel("admin-job-applications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "job_applications" },
        (payload) => {
          setItems((prev) => {
            if (!prev) return prev;
            if (payload.eventType === "INSERT") {
              return [payload.new as Application, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((x) =>
                x.id === (payload.new as Application).id
                  ? { ...x, ...(payload.new as Application) }
                  : x,
              );
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((x) => x.id !== (payload.old as { id: string }).id);
            }
            return prev;
          });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [authChecked]);

  const downloadResume = async (path: string, name: string) => {
    const { data, error: e } = await supabase.storage.from("resumes").createSignedUrl(path, 60);
    if (e || !data) {
      alert(e?.message || "Failed to create download link");
      return;
    }
    const a = document.createElement("a");
    a.href = data.signedUrl;
    a.download = name;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const removeItem = async (app: Application) => {
    if (!confirm(`Delete application from ${app.full_name}? This also removes their CV.`)) return;
    await supabase.storage.from("resumes").remove([app.resume_path]);
    const { error: e } = await supabase.from("job_applications").delete().eq("id", app.id);
    if (e) {
      alert(e.message);
      return;
    }
    setItems((prev) => prev?.filter((x) => x.id !== app.id) ?? null);
  };

  const updateStatus = async (app: Application, status: Status) => {
    const prev = app.status;
    setItems((list) => list?.map((x) => (x.id === app.id ? { ...x, status } : x)) ?? null);
    const { error: e } = await supabase
      .from("job_applications")
      .update({ status })
      .eq("id", app.id);
    if (e) {
      alert(e.message);
      setItems((list) => list?.map((x) => (x.id === app.id ? { ...x, status: prev } : x)) ?? null);
    }
  };

  const updateNote = async (app: Application, status_note: string) => {
    const prev = app.status_note;
    setItems((list) =>
      list?.map((x) => (x.id === app.id ? { ...x, status_note } : x)) ?? null,
    );
    const { error: e } = await supabase
      .from("job_applications")
      .update({ status_note: status_note || null })
      .eq("id", app.id);
    if (e) {
      alert(e.message);
      setItems((list) =>
        list?.map((x) => (x.id === app.id ? { ...x, status_note: prev } : x)) ?? null,
      );
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  if (!authChecked) {
    return (
      <section className="py-24">
        <div className="container-tight">Loading…</div>
      </section>
    );
  }

  const minBytes = minKB.trim() === "" ? null : Math.max(0, Number(minKB)) * 1024;
  const maxBytes = maxKB.trim() === "" ? null : Math.max(0, Number(maxKB)) * 1024;
  const q = query.trim().toLowerCase();
  const filtered = (items ?? []).filter((a) => {
    if (kind !== "all" && classifyResume(a) !== kind) return false;
    if (minBytes !== null && !Number.isNaN(minBytes) && a.resume_size < minBytes) return false;
    if (maxBytes !== null && !Number.isNaN(maxBytes) && a.resume_size > maxBytes) return false;
    if (q) {
      const hay = `${a.full_name} ${a.email} ${a.job_title} ${a.resume_name}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const clearFilters = () => {
    setQuery("");
    setKind("all");
    setMinKB("");
    setMaxKB("");
  };

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Job applications"
        subtitle="All career form submissions with downloadable CVs."
      />
      <section className="pb-24">
        <div className="container-tight">
          <div className="mb-4 flex flex-wrap gap-2 text-sm">
            <Link to="/admin/applications" className="rounded-full border border-primary bg-primary/10 px-3 py-1.5 font-semibold text-primary">
              Applications
            </Link>
            <Link to="/admin/messages" className="rounded-full border border-border px-3 py-1.5 font-semibold hover:bg-secondary">
              Messages
            </Link>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              {items
                ? `${filtered.length} of ${items.length} application${items.length === 1 ? "" : "s"}`
                : "Loading…"}
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportCSV}
                disabled={!filtered.length}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                <Download className="h-4 w-4" /> Export CSV
              </button>
              <button
                onClick={load}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>

          <div className="mb-6 grid gap-3 rounded-2xl glass-card p-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Search
              </label>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, email, role, file…"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Resume type
              </label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as ResumeKind)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="all">All types</option>
                <option value="pdf">PDF</option>
                <option value="doc">Word (DOC/DOCX)</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Min size (KB)
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={minKB}
                onChange={(e) => setMinKB(e.target.value)}
                placeholder="0"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Max size (KB)
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={maxKB}
                  onChange={(e) => setMaxKB(e.target.value)}
                  placeholder="5120"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <button
                  onClick={clearFilters}
                  className="shrink-0 rounded-lg border border-border px-3 text-xs font-semibold"
                  type="button"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
              <div className="mt-2 text-xs">
                If you see a permission error, your account does not have the <code>admin</code> role yet.
                Ask the project owner to grant it.
              </div>
            </div>
          )}

          {items && items.length === 0 && !error && (
            <div className="rounded-2xl glass-card p-10 text-center text-sm text-muted-foreground">
              No applications yet. Share the{" "}
              <Link to="/careers" className="text-primary underline">
                careers page
              </Link>
              .
            </div>
          )}

          {items && items.length > 0 && filtered.length === 0 && (
            <div className="rounded-2xl glass-card p-10 text-center text-sm text-muted-foreground">
              No applications match your filters.{" "}
              <button onClick={clearFilters} className="text-primary underline">
                Clear filters
              </button>
            </div>
          )}

          <div className="grid gap-4">
            {filtered.map((a) => (
              <article key={a.id} className="rounded-2xl glass-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {a.job_title}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold">{a.full_name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleString()}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[a.status]}`}
                      >
                        {a.status}
                      </span>
                      <select
                        value={a.status}
                        onChange={(e) => updateStatus(a, e.target.value as Status)}
                        className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium"
                        aria-label="Update status"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            Mark {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => downloadResume(a.resume_path, a.resume_name)}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                    >
                      <Download className="h-3.5 w-3.5" /> Download CV
                    </button>
                    <button
                      onClick={() => removeItem(a)}
                      className="inline-flex items-center gap-2 rounded-full border border-destructive/40 px-4 py-2 text-xs font-semibold text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <a href={`mailto:${a.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    <Mail className="h-3.5 w-3.5" /> {a.email}
                  </a>
                  <a href={`tel:${a.phone}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    <Phone className="h-3.5 w-3.5" /> {a.phone}
                  </a>
                  {a.linkedin && (
                    <a
                      href={a.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-foreground"
                    >
                      <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                    </a>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    {a.resume_name} · {(a.resume_size / 1024).toFixed(0)} KB · {a.resume_type || "file"}
                  </span>
                </div>

                <div className="mt-4 rounded-xl border border-border bg-secondary/20 p-3">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Note to applicant (visible on tracker)
                  </label>
                  <textarea
                    defaultValue={a.status_note ?? ""}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v !== (a.status_note ?? "")) updateNote(a, v);
                    }}
                    rows={2}
                    placeholder="e.g. We'll email you to schedule a call this week."
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Saved on blur. Last update: {new Date(a.status_updated_at).toLocaleString()}
                  </p>
                </div>

                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold">Cover letter</summary>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/85">{a.cover_letter}</p>
                </details>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
