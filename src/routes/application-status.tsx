import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/PageHero";
import { Check, Search, Loader2, AlertCircle, ArrowRight, Clock, RefreshCw, Wifi, WifiOff } from "lucide-react";

type SearchParams = { ref?: string; email?: string };

export const Route = createFileRoute("/application-status")({
  head: () => ({
    meta: [
      { title: "Application status — YESS Bangla" },
      { name: "description", content: "Track your job application status with your reference ID and email." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    ref: typeof search.ref === "string" ? search.ref : undefined,
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  component: ApplicationStatusPage,
});

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

type Application = {
  id: string;
  job_title: string;
  full_name: string;
  email: string;
  status: Status;
  status_note: string | null;
  status_updated_at: string;
  created_at: string;
};

// Canonical pipeline shown on the tracker
const PIPELINE: { key: Status; title: string; desc: string }[] = [
  { key: "Submitted", title: "Submitted", desc: "We've received your application." },
  { key: "Under review", title: "Under review", desc: "Our recruiters are reviewing your profile." },
  { key: "Interview", title: "Interview", desc: "You're invited for an interview round." },
  { key: "Offer", title: "Offer", desc: "An offer is on its way." },
  { key: "Hired", title: "Hired", desc: "Welcome to the team!" },
];

// Map legacy / side statuses into the pipeline progress index
function progressIndex(s: Status): number {
  switch (s) {
    case "Submitted":
    case "New":
      return 0;
    case "Under review":
    case "Reviewed":
      return 1;
    case "Interview":
      return 2;
    case "Offer":
      return 3;
    case "Hired":
      return 4;
    default:
      return 0;
  }
}

const STATUS_BADGE: Record<Status, string> = {
  Submitted: "border-primary/30 bg-primary/10 text-primary",
  "Under review": "border-primary/30 bg-primary/10 text-primary",
  Interview: "border-accent/30 bg-accent/15 text-accent-foreground",
  Offer: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Hired: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "On hold": "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Rejected: "border-destructive/30 bg-destructive/10 text-destructive",
  New: "border-primary/30 bg-primary/10 text-primary",
  Reviewed: "border-primary/30 bg-primary/10 text-primary",
};

const lookupSchema = z.object({
  ref: z.string().trim().min(4, "Reference must be at least 4 characters").max(64),
  email: z.string().trim().email("Enter a valid email"),
});

function ApplicationStatusPage() {
  const sp = Route.useSearch();
  const [ref, setRef] = useState(sp.ref ?? "");
  const [email, setEmail] = useState(sp.email ?? "");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [app, setApp] = useState<Application | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  const [flash, setFlash] = useState(false);
  const prevSigRef = useRef<string | null>(null);

  const runLookup = async (
    parsedRef: string,
    parsedEmail: string,
  ): Promise<{ row: Application | null; error: string | null }> => {
    const { data, error: queryErr } = await supabase.rpc("lookup_application", {
      _ref: parsedRef,
      _email: parsedEmail,
    });
    if (queryErr) return { row: null, error: queryErr.message };
    const row = Array.isArray(data) ? ((data[0] as Application | undefined) ?? null) : null;
    return { row, error: null };
  };

  const lookup = async (evt?: FormEvent) => {
    evt?.preventDefault();
    setError(null);
    setApp(null);
    prevSigRef.current = null;
    const parsed = lookupSchema.safeParse({ ref, email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    const { row, error: err } = await runLookup(parsed.data.ref, parsed.data.email);
    setLoading(false);
    setLastChecked(new Date());
    if (err) {
      setError(err);
      return;
    }
    if (!row) {
      setError("No application found for this reference and email. Please double-check both values.");
      return;
    }
    prevSigRef.current = `${row.status}|${row.status_updated_at}`;
    setApp(row);
  };

  const refresh = async () => {
    if (!app || refreshing) return;
    setRefreshing(true);
    const { row } = await runLookup(ref, email);
    setRefreshing(false);
    setLastChecked(new Date());
    if (row) {
      const sig = `${row.status}|${row.status_updated_at}`;
      if (sig !== prevSigRef.current) {
        prevSigRef.current = sig;
        setFlash(true);
        setTimeout(() => setFlash(false), 1600);
      }
      setApp(row);
    }
  };

  useEffect(() => {
    if (sp.ref && sp.email) {
      lookup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    if (!app?.id) return;
    const tick = () => {
      if (document.hidden || !navigator.onLine) return;
      void refresh();
    };
    const t = setInterval(tick, 20000);
    const onVis = () => {
      if (!document.hidden) void refresh();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app?.id, ref, email]);

  const refDisplay = useMemo(() => (app ? app.id.slice(0, 8).toUpperCase() : ""), [app]);

  return (
    <>
      <PageHero
        eyebrow="Applicants"
        title="Application status"
        subtitle="Enter your reference ID and email to see live updates on your application."
      />
      <section className="pb-24">
        <div className="container-tight max-w-3xl">
          <form onSubmit={lookup} className="rounded-2xl glass-card p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr_auto]">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Reference ID
                </label>
                <input
                  value={ref}
                  onChange={(e) => setRef(e.target.value.toUpperCase())}
                  placeholder="e.g. A1B2C3D4"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60 sm:w-auto"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Track
                </button>
              </div>
            </div>

            {error && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5" /> {error}
              </p>
            )}
          </form>

          {app && (
            <article className="mt-6 rounded-3xl glass-card p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {app.job_title}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold">{app.full_name}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Reference <span className="font-mono font-semibold text-foreground">{refDisplay}</span>
                    {" · "}Submitted {new Date(app.created_at).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${STATUS_BADGE[app.status]}`}
                >
                  {app.status}
                </span>
              </div>

              {app.status_note && (
                <div className="mt-4 rounded-2xl border border-border bg-secondary/30 p-4 text-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Note from the team
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-foreground/90">{app.status_note}</p>
                </div>
              )}

              <p className="mt-5 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                Last update: {new Date(app.status_updated_at).toLocaleString()}
              </p>

              <Tracker status={app.status} />

              <p className="mt-6 text-xs text-muted-foreground">
                Updates appear live. Questions?{" "}
                <a className="text-primary underline" href="mailto:yessbangla.bd@gmail.com">
                  yessbangla.bd@gmail.com
                </a>
              </p>
              <Link
                to="/careers"
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary"
              >
                Back to careers <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </article>
          )}
        </div>
      </section>
    </>
  );
}

function Tracker({ status }: { status: Status }) {
  const rejected = status === "Rejected";
  const onHold = status === "On hold";
  const idx = progressIndex(status);

  return (
    <div className="mt-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Progress
      </p>
      <ol className="mt-3 space-y-3">
        {PIPELINE.map((step, i) => {
          const done = !rejected && i < idx;
          const current = !rejected && !onHold && i === idx;
          return (
            <li key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] font-bold " +
                    (done
                      ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow"
                      : current
                        ? "border-primary bg-primary/10 text-primary animate-pulse"
                        : "border-border bg-background text-muted-foreground")
                  }
                  aria-hidden
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                {i < PIPELINE.length - 1 && (
                  <div
                    className={
                      "mt-1 h-full min-h-[18px] w-px " + (done ? "bg-primary/60" : "bg-border")
                    }
                    aria-hidden
                  />
                )}
              </div>
              <div className="pb-2">
                <p className={"text-sm font-semibold " + (current ? "text-primary" : "")}>
                  {step.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {rejected && (
        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Unfortunately your application was not successful this time. We're grateful you applied.
        </div>
      )}
      {onHold && (
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-400">
          Your application is currently on hold. We'll reach out as soon as there's an update.
        </div>
      )}
    </div>
  );
}
