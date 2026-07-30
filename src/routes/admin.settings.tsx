import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Site settings — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminSettings,
});

type Row = {
  id: string;
  key: string;
  label: string | null;
  group: string | null;
  value: unknown;
  sort_order: number | null;
};

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function AdminSettings() {
  const [rows, setRows] = useState<Row[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase.from("cms_settings").select("*").order("sort_order");
    if (error) setErr(error.message);
    const list = (data ?? []) as unknown as Row[];
    setRows(list);
    setDrafts(Object.fromEntries(list.map((r) => [r.id, JSON.stringify(r.value ?? {}, null, 2)])));
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const saveAll = async () => {
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      for (const row of rows) {
        let parsed: unknown;
        try {
          parsed = JSON.parse(drafts[row.id] || "{}");
        } catch {
          throw new Error(`Invalid JSON in "${row.key}"`);
        }
        const { error } = await supabase
          .from("cms_settings")
          .update({ value: parsed } as never)
          .eq("id", row.id);
        if (error) throw new Error(error.message);
      }
      setMsg("Settings saved.");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const addSetting = async () => {
    const key = window.prompt("New setting key (e.g. footer_note)");
    if (!key) return;
    const { error } = await supabase
      .from("cms_settings")
      .insert({ key, label: key, group: "custom", value: { text: "" }, sort_order: rows.length + 1 } as never);
    if (error) setErr(error.message);
    else void load();
  };

  const removeSetting = async (id: string) => {
    if (!window.confirm("Delete this setting?")) return;
    const { error } = await supabase.from("cms_settings").delete().eq("id", id);
    if (error) setErr(error.message);
    else void load();
  };

  const groups = Array.from(new Set(rows.map((r) => r.group ?? "general")));

  return (
    <div>
      <AdminPageHeader
        title="Site settings"
        titleBn="সাইট সেটিংস"
        description="Company info, contact details, social links, SEO defaults and branding — all editable here."
        actions={
          <>
            <button
              onClick={addSetting}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
            >
              <Plus className="h-4 w-4" /> New setting
            </button>
            <button
              onClick={saveAll}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save all
            </button>
          </>
        }
      />

      {err && <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}
      {msg && <p className="mb-4 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">{msg}</p>}
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{g}</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {rows
                .filter((r) => (r.group ?? "general") === g)
                .map((r) => (
                  <div key={r.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold">{r.label || r.key}</div>
                        <div className="font-mono text-[11px] text-muted-foreground">{r.key}</div>
                      </div>
                      <button
                        onClick={() => removeSetting(r.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Delete setting"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={drafts[r.id] ?? ""}
                      onChange={(e) => setDrafts((d) => ({ ...d, [r.id]: e.target.value }))}
                      className={`${inputCls} font-mono text-xs`}
                      spellCheck={false}
                    />
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
