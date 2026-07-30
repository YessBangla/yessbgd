import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/pages")({
  head: () => ({
    meta: [
      { title: "Pages & sections — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPages,
});

type Section = {
  id: string;
  page: string;
  section_key: string;
  sort_order: number | null;
  title: string | null;
  title_bn: string | null;
  subtitle: string | null;
  subtitle_bn: string | null;
  body: string | null;
  body_bn: string | null;
  cta_label: string | null;
  cta_href: string | null;
  image_url: string | null;
  is_published: boolean | null;
};

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
    </label>
  );
}

function AdminPages() {
  const [rows, setRows] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    const { data, error } = await supabase
      .from("cms_pages")
      .select("*")
      .order("page")
      .order("sort_order");
    if (error) setErr(error.message);
    setRows((data ?? []) as unknown as Section[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const patch = (id: string, key: keyof Section, value: unknown) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const save = async (row: Section) => {
    setSavingId(row.id);
    setErr(null);
    setMsg(null);
    const { id, ...rest } = row;
    const { error } = await supabase.from("cms_pages").update(rest as never).eq("id", id);
    if (error) setErr(error.message);
    else setMsg(`Saved “${row.page}/${row.section_key}”.`);
    setSavingId(null);
  };

  const addSection = async () => {
    const page = window.prompt("Page key (home, about, services, contact…)");
    if (!page) return;
    const key = window.prompt("Section key (hero, intro, cta…)");
    if (!key) return;
    const { error } = await supabase
      .from("cms_pages")
      .insert({ page, section_key: key, sort_order: rows.length + 1, is_published: true } as never);
    if (error) setErr(error.message);
    else void load();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this section?")) return;
    const { error } = await supabase.from("cms_pages").delete().eq("id", id);
    if (error) setErr(error.message);
    else void load();
  };

  const pages = Array.from(new Set(rows.map((r) => r.page)));
  const visible = filter === "all" ? rows : rows.filter((r) => r.page === filter);

  return (
    <div>
      <AdminPageHeader
        title="Pages & sections"
        titleBn="পেজ ও সেকশন"
        description="Edit the headline, sub-headline, body text, CTA and image of every page section — in English and Bangla."
        actions={
          <button
            onClick={addSection}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New section
          </button>
        }
      />

      {err && <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}
      {msg && <p className="mb-4 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">{msg}</p>}

      <div className="mb-5 flex flex-wrap gap-2">
        {["all", ...pages].map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`rounded-full border px-3 py-1.5 text-xs capitalize ${
              filter === p ? "border-primary bg-primary/10 font-semibold text-primary" : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

      <div className="space-y-4">
        {visible.map((row) => (
          <details key={row.id} className="rounded-xl border border-border bg-card p-4" open={visible.length <= 4}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">
                  {row.title || row.section_key}
                </div>
                <div className="font-mono text-[11px] text-muted-foreground">
                  {row.page} / {row.section_key}
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  row.is_published ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                }`}
              >
                {row.is_published ? "Published" : "Hidden"}
              </span>
            </summary>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Field label="Title (EN)" value={row.title ?? ""} onChange={(v) => patch(row.id, "title", v)} />
              <Field label="Title (BN)" value={row.title_bn ?? ""} onChange={(v) => patch(row.id, "title_bn", v)} />
              <Field label="Subtitle (EN)" value={row.subtitle ?? ""} onChange={(v) => patch(row.id, "subtitle", v)} />
              <Field label="Subtitle (BN)" value={row.subtitle_bn ?? ""} onChange={(v) => patch(row.id, "subtitle_bn", v)} />
              <Field label="Body (EN)" value={row.body ?? ""} onChange={(v) => patch(row.id, "body", v)} textarea />
              <Field label="Body (BN)" value={row.body_bn ?? ""} onChange={(v) => patch(row.id, "body_bn", v)} textarea />
              <Field label="CTA label" value={row.cta_label ?? ""} onChange={(v) => patch(row.id, "cta_label", v)} />
              <Field label="CTA link" value={row.cta_href ?? ""} onChange={(v) => patch(row.id, "cta_href", v)} />
              <Field label="Image URL" value={row.image_url ?? ""} onChange={(v) => patch(row.id, "image_url", v)} />
              <Field
                label="Sort order"
                value={String(row.sort_order ?? 0)}
                onChange={(v) => patch(row.id, "sort_order", Number(v) || 0)}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!row.is_published}
                  onChange={(e) => patch(row.id, "is_published", e.target.checked)}
                />
                Published
              </label>
              <button
                onClick={() => save(row)}
                disabled={savingId === row.id}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {savingId === row.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </button>
              <button
                onClick={() => remove(row.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
