import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/PageHero";
import { CMS_TYPES } from "@/lib/cmsSchema";
import { ArrowRight, Database, FileText, Briefcase, Layers } from "lucide-react";

export const Route = createFileRoute("/admin/cms")({
  head: () => ({
    meta: [
      { title: "Content management — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminCmsIndex,
});

const ICONS: Record<string, typeof Database> = {
  ventures: Briefcase,
  services: Layers,
  industries: Database,
  insights: FileText,
};

function AdminCmsIndex() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({ to: "/admin/login" });
        return;
      }
      setReady(true);
      const out: Record<string, number> = {};
      for (const [key, cfg] of Object.entries(CMS_TYPES)) {
        const { count } = await supabase
          .from(cfg.table)
          .select("id", { count: "exact", head: true });
        out[key] = count ?? 0;
      }
      setCounts(out);
    })();
  }, [navigate]);

  if (!ready) return null;

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Content management"
        subtitle="ভেঞ্চার, সার্ভিস, ইন্ডাস্ট্রি ও ইনসাইট — সরাসরি ডাটাবেজ থেকে সম্পাদনা করুন।"
      />
      <section className="pb-24">
        <div className="container-tight">
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(CMS_TYPES).map(([key, cfg]) => {
              const Icon = ICONS[key] ?? Database;
              return (
                <Link
                  key={key}
                  to="/admin/cms/$type"
                  params={{ type: key }}
                  className="group rounded-2xl glass-card p-6 transition hover:shadow-glow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="text-base font-semibold">{cfg.label}</div>
                        <div className="text-xs text-muted-foreground">{cfg.labelBn}</div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {counts[key] ?? "—"} items
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{cfg.description}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Manage <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link to="/admin/applications" className="text-muted-foreground underline-offset-4 hover:underline">
              ← Job applications
            </Link>
            <Link to="/admin/messages" className="text-muted-foreground underline-offset-4 hover:underline">
              Contact messages
            </Link>
            <Link to="/admin/audit" className="text-muted-foreground underline-offset-4 hover:underline">
              Audit log
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
