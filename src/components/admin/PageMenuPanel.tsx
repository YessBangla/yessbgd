// Lets an editor attach a page to the site navigation directly from the page
// editor: pick header/footer, choose a parent menu item (so it becomes a
// submenu) and set bilingual labels. Writes to cms_menu_items.
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { buildMenuTree, type MenuItem, type MenuNode } from "@/lib/siteContent";
import { Loader2, Plus, Save, Trash2, CornerDownRight } from "lucide-react";

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const labelCls = "mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

const MAX_DEPTH = 2; // 0 = menu, 1 = submenu, 2 = sub-submenu

type Location = "header" | "footer";

function flatten(nodes: MenuNode[], out: { node: MenuNode; depth: number }[] = [], depth = 0) {
  for (const n of nodes) {
    out.push({ node: n, depth });
    flatten(n.children, out, depth + 1);
  }
  return out;
}

export function PageMenuPanel({
  path,
  nameEn,
  nameBn,
}: {
  path: string;
  nameEn: string;
  nameBn?: string | null;
}) {
  const qc = useQueryClient();
  const [rows, setRows] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // form state for adding this page to a menu
  const [location, setLocation] = useState<Location>("header");
  const [parentId, setParentId] = useState<string>("");
  const [label, setLabel] = useState(nameEn);
  const [labelBn, setLabelBn] = useState(nameBn ?? "");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("cms_menu_items").select("*").order("sort_order");
    if (error) setErr(error.message);
    setRows((data ?? []) as unknown as MenuItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setLabel(nameEn);
    setLabelBn(nameBn ?? "");
  }, [nameEn, nameBn]);

  const treeFor = useCallback(
    (loc: Location) => buildMenuTree(rows.filter((r) => r.location === loc)),
    [rows],
  );

  /** Existing menu entries that already point at this page. */
  const linked = useMemo(() => rows.filter((r) => (r.href ?? "").trim() === path.trim()), [rows, path]);

  const parentOptions = useMemo(
    () => flatten(treeFor(location)).filter((f) => f.depth < MAX_DEPTH),
    [treeFor, location],
  );

  useEffect(() => {
    // reset parent when switching location if it no longer exists there
    if (parentId && !parentOptions.some((o) => o.node.id === parentId)) setParentId("");
  }, [parentOptions, parentId]);

  const refreshSite = async () => {
    await qc.invalidateQueries({ queryKey: ["cms", "menu", "header"] });
    await qc.invalidateQueries({ queryKey: ["cms", "menu", "footer"] });
  };

  const addToMenu = async () => {
    setBusy(true);
    setErr(null);
    setMsg(null);
    const parent = parentId ? rows.find((r) => r.id === parentId) : undefined;
    const depth = parent ? (parent.depth ?? 0) + 1 : 0;
    const siblings = rows.filter(
      (r) => r.location === location && (r.parent_id ?? null) === (parent?.id ?? null),
    );
    const { error } = await supabase.from("cms_menu_items").insert({
      location,
      label: label.trim() || nameEn,
      label_bn: labelBn.trim() || null,
      href: path,
      parent_id: parent?.id ?? null,
      depth,
      sort_order: siblings.length + 1,
      is_published: true,
    } as never);
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setMsg(
      parent
        ? `Added as a submenu of “${parent.label}” · সাবমেনু যোগ হয়েছে`
        : "Added to the menu · মেনুতে যোগ হয়েছে",
    );
    await load();
    await refreshSite();
  };

  const updateEntry = async (item: MenuItem, patch: Partial<MenuItem>) => {
    setBusy(true);
    setErr(null);
    const { error } = await supabase.from("cms_menu_items").update(patch as never).eq("id", item.id);
    setBusy(false);
    if (error) setErr(error.message);
    else {
      setMsg("Menu entry updated · আপডেট হয়েছে");
      await load();
      await refreshSite();
    }
  };

  const removeEntry = async (item: MenuItem) => {
    if (!window.confirm(`Remove “${item.label}” from the ${item.location} menu?`)) return;
    setBusy(true);
    const { error } = await supabase.from("cms_menu_items").delete().eq("id", item.id);
    setBusy(false);
    if (error) setErr(error.message);
    else {
      setMsg("Removed from the menu · মেনু থেকে সরানো হয়েছে");
      await load();
      await refreshSite();
    }
  };

  const parentLabel = (item: MenuItem) => {
    const p = item.parent_id ? rows.find((r) => r.id === item.parent_id) : undefined;
    return p ? p.label : "Top level";
  };

  return (
    <div className="space-y-5">
      {err && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}
      {msg && <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">{msg}</p>}

      {/* existing links */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold">
          In navigation <span className="font-normal text-muted-foreground">· নেভিগেশনে</span>
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Menu entries pointing to <code className="font-mono">{path}</code>.
        </p>

        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : linked.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
            This page is not in any menu yet — এই পেইজটি এখনো কোনো মেনুতে নেই। Use the form below to add it as a
            menu or submenu item.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {linked.map((item) => {
              const depth = item.depth ?? 0;
              const options = flatten(treeFor(item.location as Location)).filter(
                (o) => o.depth < MAX_DEPTH && o.node.id !== item.id,
              );
              return (
                <li key={item.id} className="rounded-xl border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {item.location}
                    </span>
                    <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {depth === 0 ? "Menu" : depth === 1 ? "Sub" : "Sub·2"}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      <CornerDownRight className="mr-1 inline h-3 w-3" />
                      {parentLabel(item)}
                    </span>
                    <button
                      type="button"
                      onClick={() => void removeEntry(item)}
                      disabled={busy}
                      className="ml-auto inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-60"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelCls}>Parent · প্যারেন্ট</span>
                      <select
                        className={inputCls}
                        value={item.parent_id ?? ""}
                        onChange={(e) => {
                          const pid = e.target.value || null;
                          const p = pid ? rows.find((r) => r.id === pid) : undefined;
                          void updateEntry(item, {
                            parent_id: pid,
                            depth: p ? (p.depth ?? 0) + 1 : 0,
                          });
                        }}
                      >
                        <option value="">Top level · টপ লেভেল</option>
                        {options.map((o) => (
                          <option key={o.node.id} value={o.node.id}>
                            {"— ".repeat(o.depth)}
                            {o.node.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelCls}>Visibility · ভিজিবিলিটি</span>
                      <select
                        className={inputCls}
                        value={item.is_published === false ? "hidden" : "visible"}
                        onChange={(e) =>
                          void updateEntry(item, { is_published: e.target.value === "visible" })
                        }
                      >
                        <option value="visible">Visible · দৃশ্যমান</option>
                        <option value="hidden">Hidden · লুকানো</option>
                      </select>
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* add form */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold">
          Add to menu / submenu <span className="font-normal text-muted-foreground">· মেনু বা সাবমেনুতে যোগ করুন</span>
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className={labelCls}>Menu location · অবস্থান</span>
            <select
              className={inputCls}
              value={location}
              onChange={(e) => setLocation(e.target.value as Location)}
            >
              <option value="header">Header · হেডার</option>
              <option value="footer">Footer · ফুটার</option>
            </select>
          </label>

          <label className="block">
            <span className={labelCls}>Place under · কার নিচে</span>
            <select className={inputCls} value={parentId} onChange={(e) => setParentId(e.target.value)}>
              <option value="">Top level menu · টপ লেভেল</option>
              {parentOptions.map((o) => (
                <option key={o.node.id} value={o.node.id}>
                  {"— ".repeat(o.depth)}
                  {o.node.label} {o.depth === 0 ? "(submenu)" : "(sub-submenu)"}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={labelCls}>Label (EN)</span>
            <input className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} />
          </label>
          <label className="block">
            <span className={labelCls}>লেবেল (BN)</span>
            <input className={inputCls} value={labelBn} onChange={(e) => setLabelBn(e.target.value)} />
          </label>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Link · লিংক: <code className="font-mono">{path}</code>
        </p>

        <button
          type="button"
          onClick={() => void addToMenu()}
          disabled={busy || !path.trim()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {parentId ? "Add as submenu" : "Add to menu"}
        </button>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Save className="h-3.5 w-3.5" /> Menu changes apply to the live site immediately.
        </p>
      </div>
    </div>
  );
}
