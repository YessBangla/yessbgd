import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { useSitePages } from "@/lib/sitePages";
import { Plus, Loader2, ExternalLink, FileText, Sparkles, Trash2, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/pages/")({
  head: () => ({
    meta: [
      { title: "Pages — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPagesList,
});

function slugify(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function AdminPagesList() {
  const { data, isLoading, refetch } = useSitePages();
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", nameBn: "", slug: "" });

  const invalidate = async () => {
    await qc.invalidateQueries({ queryKey: ["cms", "site-pages"] });
    await refetch();
  };

  const create = async () => {
    const slug = slugify(form.slug || form.name);
    if (!slug || !form.name.trim()) {
      setErr("Name and slug are required.");
      return;
    }
    setBusy(true);
    setErr(null);
    const { error } = await supabase.from("cms_site_pages").insert({
      page: slug,
      path: `/p/${slug}`,
      name: form.name.trim(),
      name_bn: form.nameBn.trim() || null,
      hero_title: form.name.trim(),
      hero_title_bn: form.nameBn.trim() || null,
      is_custom: true,
      is_published: true,
      sort_order: (data?.length ?? 0) + 1,
    } as never);
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setForm({ name: "", nameBn: "", slug: "" });
    setCreating(false);
    await invalidate();
  };

  const togglePublish = async (id: string, next: boolean) => {
    await supabase.from("cms_site_pages").update({ is_published: next } as never).eq("id", id);
    await invalidate();
  };

  const remove = async (id: string, name: string) => {
    if (!window.confirm(`Delete the page “${name}”? This cannot be undone.`)) return;
    await supabase.from("cms_site_pages").delete().eq("id", id);
    await invalidate();
  };

  const rows = data ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Pages"
        titleBn="সব পেইজ — বাংলা ও ইংরেজিতে সম্পাদনা করুন"
        description="Every page of the website, including the home page. Edit hero copy, images, body text and SEO — or create a brand new page."
        actions={
          <button
            onClick={() => setCreating((c) => !c)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New page · নতুন পেইজ
          </button>
        }
      />

      {err && <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}

      {creating && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 font-display text-lg font-semibold">Create a new page</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Page name (EN)
              </span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Partnerships"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                পেইজের নাম (BN)
              </span>
              <input
                value={form.nameBn}
                onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
                placeholder="পার্টনারশিপ"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                URL slug
              </span>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                placeholder={slugify(form.name) || "partnerships"}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary"
              />
              <span className="mt-1 block text-[11px] text-muted-foreground">
                /p/{slugify(form.slug || form.name) || "…"}
              </span>
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={create}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Create page
            </button>
            <button
              onClick={() => setCreating(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((p) => (
          <div key={p.id} className="flex flex-col rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{p.name}</div>
                <div className="truncate text-xs text-muted-foreground">{p.name_bn || "—"}</div>
                <div className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">{p.path}</div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                  p.is_published ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                }`}
              >
                {p.is_published ? "Live" : "Hidden"}
              </span>
            </div>

            {p.hero_image && (
              <div className="mt-3 aspect-[16/7] overflow-hidden rounded-lg border border-border/60">
                <img src={p.hero_image} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Link
                to="/admin/pages/$page"
                params={{ page: p.page }}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Edit · সম্পাদনা
              </Link>
              <a
                href={p.path}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
              >
                <ExternalLink className="h-3.5 w-3.5" /> View
              </a>
              <button
                onClick={() => togglePublish(p.id, !p.is_published)}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
              >
                {p.is_published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {p.is_published ? "Hide" : "Publish"}
              </button>
              {p.is_custom && (
                <button
                  onClick={() => remove(p.id, p.name)}
                  className="ml-auto inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
