import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin login — YESS Bangla" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLogin,
});

const highlights = [
  { title: "Pages & content", titleBn: "পেইজ ও কনটেন্ট", desc: "Edit every page in English and Bangla." },
  { title: "Menus & media", titleBn: "মেনু ও মিডিয়া", desc: "Tree menu editor with a live preview." },
  { title: "Secure by design", titleBn: "নিরাপদ অ্যাক্সেস", desc: "Role-based access with audit logging." },
];

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signErr) {
      setError(signErr.message);
      return;
    }
    navigate({ to: "/admin" });
  };

  const field =
    "w-full rounded-xl border border-white/15 bg-white/10 px-11 py-3 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-white/40 focus:bg-white/15 focus:ring-2 focus:ring-white/20";

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[oklch(0.21_0.03_255)] px-4 py-10">
      {/* ambient corporate mesh */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.12 235 / 0.55), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -right-32 h-[560px] w-[560px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.60 0.10 195 / 0.42), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 78%)",
        }}
      />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/12 bg-white/[0.06] shadow-2xl backdrop-blur-xl lg:grid-cols-2">
        {/* Brand / value panel */}
        <section className="hidden flex-col justify-between gap-10 border-r border-white/10 p-10 lg:flex">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
              <Sparkles className="h-3.5 w-3.5" /> Control Center
            </span>
            <h1 className="mt-6 text-3xl font-semibold leading-tight text-white">
              YESS Bangla
              <span className="block text-white/60">Content Management Suite</span>
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
              পুরো ওয়েব পোর্টাল — পেইজ, মেনু, মিডিয়া, ক্যারিয়ার ও সেটিংস — একটি কর্পোরেট ড্যাশবোর্ড থেকে পরিচালনা করুন।
            </p>
          </div>

          <ul className="space-y-4">
            {highlights.map((h) => (
              <li key={h.title} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/15 bg-white/10 text-white">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">
                    {h.title} <span className="font-normal text-white/55">— {h.titleBn}</span>
                  </span>
                  <span className="block text-xs text-white/50">{h.desc}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
            © {new Date().getFullYear()} YESS Bangla — Authorized personnel only
          </p>
        </section>

        {/* Form panel */}
        <section className="p-8 sm:p-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/55 transition hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to website
          </Link>

          <h2 className="mt-6 text-2xl font-semibold text-white">Sign in</h2>
          <p className="mt-1 text-sm text-white/55">
            Restricted area — অনুমোদিত কর্মীদের জন্য সংরক্ষিত।
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="admin@yessbangla.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={field}
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                <input
                  id="admin-password"
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${field} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[oklch(0.21_0.03_255)] shadow-lg transition hover:bg-white/90 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign in to dashboard"}
            </button>
          </form>

          <p className="mt-6 flex items-center gap-2 text-[11px] text-white/40">
            <ShieldCheck className="h-3.5 w-3.5" /> Sessions are encrypted and every admin action is logged.
          </p>
        </section>
      </div>
    </main>
  );
}
