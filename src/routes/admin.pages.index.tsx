import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { useSitePages } from "@/lib/sitePages";
import {
  Plus,
  Loader2,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  Pencil,
  ExternalLink,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";

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

type StatusFilter = "all" | "published" | "hidden";
type TypeFilter = "all" | "custom" | "system";

function AdminPagesList() {
  const { data, isLoading, isFetching, refetch } = useSitePages();
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", nameBn: "", slug: "" });

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkOpen, setBulkOpen] = useState(false);

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
    setSelected((s) => s.filter((x) => x !== id));
    await invalidate();
  };

  const bulk = async (action: "publish" | "hide" | "delete") => {
    setBulkOpen(false);
    if (selected.length === 0) return;
    if (action === "delete") {
      const deletable = (data ?? []).filter((p) => selected.includes(p.id) && p.is_custom).map((p) => p.id);
      if (deletable.length === 0) {
        setErr("Only custom pages can be deleted.");
        return;
      }
      if (!window.confirm(`Delete ${deletable.length} page(s)? This cannot be undone.`)) return;
      await supabase.from("cms_site_pages").delete().in("id", deletable);
    } else {
      await supabase
        .from("cms_site_pages")
        .update({ is_published: action === "publish" } as never)
        .in("id", selected);
    }
    setSelected([]);
    await invalidate();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter((p) => {
      if (status === "published" && !p.is_published) return false;
      if (status === "hidden" && p.is_published) return false;
      if (type === "custom" && !p.is_custom) return false;
      if (type === "system" && p.is_custom) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.name_bn ?? "").toLowerCase().includes(q) ||
        p.path.toLowerCase().includes(q)
      );
    });
  }, [data, search, status, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * perPage;
  const rows = filtered.slice(start, start + perPage);
  const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  const inputCls =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <div>
      <AdminPageHeader
        title="Pages"
        titleBn="সব পেইজ — বাংলা ও ইংরেজিতে সম্পাদনা করুন"
        description="Every page of the website, including the home page. Edit hero copy, images, body text and SEO — or create a brand new page."
      />

      {err && <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}

      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border/70 p-4">
          <div className="relative">
            <button
              onClick={() => setBulkOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
            >
              Bulk Actions <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {bulkOpen && (
              <ul className="absolute left-0 top-11 z-30 w-44 overflow-hidden rounded-md border border-border bg-popover py-1 text-sm shadow-lg">
                <li>
                  <button onClick={() => bulk("publish")} className="block w-full px-3 py-2 text-left hover:bg-secondary">
                    Publish selected
                  </button>
                </li>
                <li>
                  <button onClick={() => bulk("hide")} className="block w-full px-3 py-2 text-left hover:bg-secondary">
                    Hide selected
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => bulk("delete")}
                    className="block w-full px-3 py-2 text-left text-destructive hover:bg-destructive/10"
                  >
                    Delete selected
                  </button>
                </li>
              </ul>
            )}
          </div>

          <button
            onClick={() => setShowFilters((f) => !f)}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </button>

          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              aria-label="Search pages"
              className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setCreating((c) => !c)}
              className="inline-flex items-center gap-2 rounded-md bg-admin-accent px-4 py-2 text-sm font-semibold text-admin-accent-foreground"
            >
              <Plus className="h-4 w-4" /> Create
            </button>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Reload
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid gap-3 border-b border-border/70 bg-secondary/30 p-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </span>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as StatusFilter);
                  setPage(1);
                }}
                className={inputCls}
              >
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="hidden">Hidden</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Type
              </span>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as TypeFilter);
                  setPage(1);
                }}
                className={inputCls}
              >
                <option value="all">All</option>
                <option value="system">Built-in</option>
                <option value="custom">Custom</option>
              </select>
            </label>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatus("all");
                  setType("all");
                  setSearch("");
                }}
                className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}

        {creating && (
          <div className="border-b border-border/70 bg-secondary/20 p-4">
            <h2 className="mb-3 font-display text-base font-semibold">Create a new page</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Page name (EN)
                </span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Partnerships"
                  className={inputCls}
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
                  className={inputCls}
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
                  className={`${inputCls} font-mono`}
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
                className="inline-flex items-center gap-2 rounded-md bg-admin-accent px-4 py-2 text-sm font-semibold text-admin-accent-foreground disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create page
              </button>
              <button
                onClick={() => setCreating(false)}
                className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border/70 bg-secondary/40 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    checked={allChecked}
                    onChange={(e) =>
                      setSelected(e.target.checked ? Array.from(new Set([...selected, ...rows.map((r) => r.id)])) : [])
                    }
                  />
                </th>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Path</th>
                <th className="px-3 py-3">Template</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Operations</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    No pages match your filters.
                  </td>
                </tr>
              )}
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${p.name}`}
                      checked={selected.includes(p.id)}
                      onChange={(e) =>
                        setSelected((s) => (e.target.checked ? [...s, p.id] : s.filter((x) => x !== p.id)))
                      }
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      to="/admin/pages/$page"
                      params={{ page: p.page }}
                      className="font-medium text-primary hover:underline"
                    >
                      {p.name}
                    </Link>
                    <span className="block text-xs text-muted-foreground">{p.name_bn || "—"}</span>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{p.path}</td>
                  <td className="px-3 py-3 text-muted-foreground">{p.is_custom ? "Custom" : "Built-in"}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded px-2 py-1 text-[11px] font-semibold ${
                        p.is_published
                          ? "bg-admin-success text-admin-success-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {p.is_published ? "Published" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to="/admin/pages/$page"
                        params={{ page: p.page }}
                        title="Edit"
                        className="grid h-8 w-8 place-items-center rounded bg-admin-accent text-admin-accent-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <a
                        href={p.path}
                        target="_blank"
                        rel="noreferrer"
                        title="View"
                        className="grid h-8 w-8 place-items-center rounded border border-border text-muted-foreground hover:bg-secondary"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() => togglePublish(p.id, !p.is_published)}
                        title={p.is_published ? "Hide" : "Publish"}
                        className="grid h-8 w-8 place-items-center rounded border border-border text-muted-foreground hover:bg-secondary"
                      >
                        {p.is_published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => remove(p.id, p.name)}
                        disabled={!p.is_custom}
                        title={p.is_custom ? "Delete" : "Built-in pages cannot be deleted"}
                        className="grid h-8 w-8 place-items-center rounded bg-destructive text-destructive-foreground disabled:opacity-35"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center gap-3 border-t border-border/70 p-4 text-sm text-muted-foreground">
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            aria-label="Rows per page"
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>
            Show from {filtered.length === 0 ? 0 : start + 1} to {Math.min(start + perPage, filtered.length)} in{" "}
            <span className="rounded bg-secondary px-1.5 py-0.5 font-semibold text-foreground">{filtered.length}</span>{" "}
            records
          </span>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={current === 1}
              className="rounded-md border border-border px-2.5 py-1.5 disabled:opacity-40"
            >
              « Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`min-w-8 rounded-md border px-2.5 py-1.5 ${
                  n === current
                    ? "border-admin-accent bg-admin-accent text-admin-accent-foreground"
                    : "border-border hover:bg-secondary"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={current === totalPages}
              className="rounded-md border border-border px-2.5 py-1.5 disabled:opacity-40"
            >
              Next »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
