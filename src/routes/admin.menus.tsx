import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/menus")({
  head: () => ({
    meta: [
      { title: "Menus — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminMenus,
});

type Item = {
  id: string;
  location: string;
  label: string;
  label_bn: string | null;
  href: string;
  group_label: string | null;
  sort_order: number | null;
  is_external: boolean | null;
  is_published: boolean | null;
};

const inputCls =
  "w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus:border-primary";

function AdminMenus() {
  const [rows, setRows] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("cms_menu_items")
      .select("*")
      .order("location")
      .order("sort_order");
    if (error) setErr(error.message);
    setRows((data ?? []) as unknown as Item[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const patch = (id: string, key: keyof Item, value: unknown) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const saveAll = async () => {
    setSaving(true);
    setErr(null);
    setMsg(null);
    for (const row of rows) {
      const { id, ...rest } = row;
      const { error } = await supabase.from("cms_menu_items").update(rest as never).eq("id", id);
      if (error) {
        setErr(error.message);
        setSaving(false);
        return;
      }
    }
    setMsg("Menus saved.");
    setSaving(false);
  };

  const add = async (location: "header" | "footer") => {
    const { error } = await supabase.from("cms_menu_items").insert({
      location,
      label: "New link",
      href: "/",
      sort_order: rows.filter((r) => r.location === location).length + 1,
      is_published: true,
    } as never);
    if (error) setErr(error.message);
    else void load();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this menu item?")) return;
    const { error } = await supabase.from("cms_menu_items").delete().eq("id", id);
    if (error) setErr(error.message);
    else void load();
  };

  const section = (location: "header" | "footer", title: string) => {
    const items = rows.filter((r) => r.location === location);
    return (
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{title}</h2>
          <button
            onClick={() => add(location)}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-secondary"
          >
            <Plus className="h-3.5 w-3.5" /> Add link
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b border-border/70 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Label (EN)</th>
                <th className="px-3 py-2">Label (BN)</th>
                <th className="px-3 py-2">Link</th>
                <th className="px-3 py-2">Group</th>
                <th className="px-3 py-2 w-20">Order</th>
                <th className="px-3 py-2 w-20">Live</th>
                <th className="px-3 py-2 w-12" />
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-b border-border/50 last:border-0">
                  <td className="px-3 py-2">
                    <input className={inputCls} value={r.label} onChange={(e) => patch(r.id, "label", e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <input className={inputCls} value={r.label_bn ?? ""} onChange={(e) => patch(r.id, "label_bn", e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <input className={inputCls} value={r.href} onChange={(e) => patch(r.id, "href", e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <input className={inputCls} value={r.group_label ?? ""} onChange={(e) => patch(r.id, "group_label", e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className={inputCls}
                      value={r.sort_order ?? 0}
                      onChange={(e) => patch(r.id, "sort_order", Number(e.target.value) || 0)}
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={!!r.is_published}
                      onChange={(e) => patch(r.id, "is_published", e.target.checked)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => remove(r.id)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No links yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  return (
    <div>
      <AdminPageHeader
        title="Menus"
        titleBn="মেনু ও ফুটার"
        description="Control the header navigation and footer links — labels, order, and visibility."
        actions={
          <button
            onClick={saveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save all
          </button>
        }
      />
      {err && <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}
      {msg && <p className="mb-4 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">{msg}</p>}
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {section("header", "Header navigation")}
      {section("footer", "Footer links")}
    </div>
  );
}
