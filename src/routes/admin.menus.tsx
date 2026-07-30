import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { buildMenuTree, type MenuItem, type MenuNode } from "@/lib/siteContent";
import {
  Plus,
  Save,
  Trash2,
  Loader2,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  CornerDownRight,
  Pencil,
  X,
} from "lucide-react";

export const Route = createFileRoute("/admin/menus")({
  head: () => ({
    meta: [
      { title: "Menus — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminMenus,
});

const inputCls =
  "w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus:border-primary";
const labelCls = "mb-1 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground";

const MAX_DEPTH = 2; // 0 = menu, 1 = submenu, 2 = sub-submenu

function AdminMenus() {
  const [rows, setRows] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("cms_menu_items")
      .select("*")
      .order("location")
      .order("sort_order");
    if (error) setErr(error.message);
    setRows((data ?? []) as unknown as MenuItem[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const patch = (id: string, key: keyof MenuItem, value: unknown) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const saveAll = async () => {
    setSaving(true);
    setErr(null);
    setMsg(null);
    for (const row of rows) {
      const { id, created_at, updated_at, ...rest } = row as MenuItem & {
        created_at?: string;
        updated_at?: string;
      };
      const { error } = await supabase.from("cms_menu_items").update(rest as never).eq("id", id);
      if (error) {
        setErr(error.message);
        setSaving(false);
        return;
      }
    }
    setMsg("Menu structure saved.");
    setSaving(false);
  };

  const addItem = async (location: "header" | "footer", parent?: MenuItem) => {
    const depth = parent ? (parent.depth ?? 0) + 1 : 0;
    const siblings = rows.filter(
      (r) => r.location === location && (r.parent_id ?? null) === (parent?.id ?? null),
    );
    const { error } = await supabase.from("cms_menu_items").insert({
      location,
      label: depth === 0 ? "New menu" : depth === 1 ? "New submenu" : "New sub-item",
      href: "/",
      parent_id: parent?.id ?? null,
      depth,
      sort_order: siblings.length + 1,
      is_published: true,
    } as never);
    if (error) setErr(error.message);
    else {
      if (parent) setCollapsed((c) => ({ ...c, [parent.id]: false }));
      await load();
    }
  };

  const remove = async (node: MenuNode) => {
    const n = countDescendants(node);
    if (
      !window.confirm(
        n > 0
          ? `Delete "${node.label}" and its ${n} sub-item(s)?`
          : `Delete "${node.label}"?`,
      )
    )
      return;
    const { error } = await supabase.from("cms_menu_items").delete().eq("id", node.id);
    if (error) setErr(error.message);
    else await load();
  };

  /** Reorder within siblings (persisted immediately). */
  const move = async (node: MenuNode, siblings: MenuNode[], dir: -1 | 1) => {
    const idx = siblings.findIndex((s) => s.id === node.id);
    const target = siblings[idx + dir];
    if (!target) return;
    const a = node.sort_order ?? idx + 1;
    const b = target.sort_order ?? idx + 1 + dir;
    setRows((rs) =>
      rs.map((r) =>
        r.id === node.id ? { ...r, sort_order: b } : r.id === target.id ? { ...r, sort_order: a } : r,
      ),
    );
    await supabase.from("cms_menu_items").update({ sort_order: b } as never).eq("id", node.id);
    await supabase.from("cms_menu_items").update({ sort_order: a } as never).eq("id", target.id);
  };

  /** Indent: become a child of the previous sibling. Outdent: move up a level. */
  const reparent = async (node: MenuNode, siblings: MenuNode[], dir: "in" | "out", parent?: MenuNode) => {
    let newParentId: string | null;
    let newDepth: number;
    if (dir === "in") {
      const idx = siblings.findIndex((s) => s.id === node.id);
      const prev = siblings[idx - 1];
      if (!prev) return;
      if ((prev.depth ?? 0) + 1 > MAX_DEPTH) return;
      newParentId = prev.id;
      newDepth = (prev.depth ?? 0) + 1;
      setCollapsed((c) => ({ ...c, [prev.id]: false }));
    } else {
      if (!parent) return;
      newParentId = parent.parent_id ?? null;
      newDepth = Math.max(0, (parent.depth ?? 0));
    }
    const shift = newDepth - (node.depth ?? 0);
    const ids = collectIds(node);
    setRows((rs) =>
      rs.map((r) =>
        r.id === node.id
          ? { ...r, parent_id: newParentId, depth: newDepth }
          : ids.includes(r.id)
            ? { ...r, depth: Math.max(0, (r.depth ?? 0) + shift) }
            : r,
      ),
    );
    const { error } = await supabase
      .from("cms_menu_items")
      .update({ parent_id: newParentId, depth: newDepth } as never)
      .eq("id", node.id);
    if (error) setErr(error.message);
    for (const id of ids.filter((i) => i !== node.id)) {
      const r = rows.find((x) => x.id === id);
      await supabase
        .from("cms_menu_items")
        .update({ depth: Math.max(0, (r?.depth ?? 0) + shift) } as never)
        .eq("id", id);
    }
  };

  const trees = useMemo(
    () => ({
      header: buildMenuTree(rows.filter((r) => r.location === "header")),
      footer: buildMenuTree(rows.filter((r) => r.location === "footer")),
    }),
    [rows],
  );

  const renderNode = (
    node: MenuNode,
    siblings: MenuNode[],
    location: "header" | "footer",
    parent?: MenuNode,
  ) => {
    const depth = node.depth ?? 0;
    const hasKids = node.children.length > 0;
    const isCollapsed = collapsed[node.id];
    const isEditing = editingId === node.id;
    const idx = siblings.findIndex((s) => s.id === node.id);

    return (
      <li key={node.id}>
        <div
          className="flex flex-wrap items-center gap-2 border-b border-border/50 px-3 py-2 hover:bg-secondary/40"
          style={{ paddingLeft: 12 + depth * 26 }}
        >
          <button
            type="button"
            onClick={() => setCollapsed((c) => ({ ...c, [node.id]: !c[node.id] }))}
            className={`rounded p-0.5 text-muted-foreground ${hasKids ? "hover:bg-secondary" : "invisible"}`}
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <span
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
              depth === 0
                ? "bg-primary/10 text-primary"
                : depth === 1
                  ? "bg-secondary text-muted-foreground"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {depth === 0 ? "Menu" : depth === 1 ? "Sub" : "Sub·2"}
          </span>

          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {node.label}
            {node.label_bn ? <span className="ml-2 text-muted-foreground">/ {node.label_bn}</span> : null}
            <span className="ml-2 truncate text-xs text-muted-foreground">{node.href}</span>
          </span>

          {!node.is_published && (
            <span className="rounded-md bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-destructive">
              Hidden
            </span>
          )}

          <div className="flex items-center gap-1">
            <IconBtn label="Move up" disabled={idx === 0} onClick={() => void move(node, siblings, -1)}>
              <ArrowUp className="h-3.5 w-3.5" />
            </IconBtn>
            <IconBtn
              label="Move down"
              disabled={idx === siblings.length - 1}
              onClick={() => void move(node, siblings, 1)}
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </IconBtn>
            <IconBtn
              label="Make submenu of item above"
              disabled={idx === 0 || depth >= MAX_DEPTH}
              onClick={() => void reparent(node, siblings, "in", parent)}
            >
              <CornerDownRight className="h-3.5 w-3.5" />
            </IconBtn>
            <IconBtn
              label="Move one level up"
              disabled={!parent}
              onClick={() => void reparent(node, siblings, "out", parent)}
            >
              <CornerDownRight className="h-3.5 w-3.5 -scale-x-100" />
            </IconBtn>
            <IconBtn
              label="Add submenu"
              disabled={depth >= MAX_DEPTH}
              onClick={() => void addItem(location, node)}
            >
              <Plus className="h-3.5 w-3.5" />
            </IconBtn>
            <IconBtn label={isEditing ? "Close" : "Edit"} onClick={() => setEditingId(isEditing ? null : node.id)}>
              {isEditing ? <X className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
            </IconBtn>
            <IconBtn label="Delete" danger onClick={() => void remove(node)}>
              <Trash2 className="h-3.5 w-3.5" />
            </IconBtn>
          </div>
        </div>

        {isEditing && (
          <div
            className="grid gap-3 border-b border-border/50 bg-secondary/30 px-3 py-3 sm:grid-cols-2 lg:grid-cols-3"
            style={{ paddingLeft: 12 + depth * 26 }}
          >
            <div>
              <label className={labelCls}>Label (EN)</label>
              <input className={inputCls} value={node.label} onChange={(e) => patch(node.id, "label", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Label (BN)</label>
              <input
                className={inputCls}
                value={node.label_bn ?? ""}
                onChange={(e) => patch(node.id, "label_bn", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Link</label>
              <input className={inputCls} value={node.href} onChange={(e) => patch(node.id, "href", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Description (EN)</label>
              <input
                className={inputCls}
                value={node.description ?? ""}
                onChange={(e) => patch(node.id, "description", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Description (BN)</label>
              <input
                className={inputCls}
                value={node.description_bn ?? ""}
                onChange={(e) => patch(node.id, "description_bn", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Group label (mega-menu column)</label>
              <input
                className={inputCls}
                value={node.group_label ?? ""}
                onChange={(e) => patch(node.id, "group_label", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Icon (lucide name)</label>
              <input
                className={inputCls}
                value={node.icon ?? ""}
                onChange={(e) => patch(node.id, "icon", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Order</label>
              <input
                type="number"
                className={inputCls}
                value={node.sort_order ?? 0}
                onChange={(e) => patch(node.id, "sort_order", Number(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!node.is_published}
                  onChange={(e) => patch(node.id, "is_published", e.target.checked)}
                />
                Live
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!node.is_external}
                  onChange={(e) => patch(node.id, "is_external", e.target.checked)}
                />
                External
              </label>
            </div>
          </div>
        )}

        {hasKids && !isCollapsed && (
          <ul>{node.children.map((c) => renderNode(c, node.children, location, node))}</ul>
        )}
      </li>
    );
  };

  const section = (location: "header" | "footer", title: string, titleBn: string) => {
    const tree = trees[location];
    return (
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {title} <span className="font-normal normal-case tracking-normal">— {titleBn}</span>
          </h2>
          <button
            onClick={() => void addItem(location)}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-secondary"
          >
            <Plus className="h-3.5 w-3.5" /> Add top-level menu
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {tree.length ? (
            <ul>{tree.map((n) => renderNode(n, tree, location))}</ul>
          ) : (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No links yet.</p>
          )}
        </div>
      </section>
    );
  };

  return (
    <div>
      <AdminPageHeader
        title="Menus"
        titleBn="মেনু, সাব-মেনু ও ফুটার"
        description="Drag-free tree editor — reorder with arrows, indent to make a submenu (up to 3 levels), and edit labels in EN/BN."
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
      {section("header", "Header navigation", "হেডার মেনু")}
      {section("footer", "Footer links", "ফুটার লিংক")}
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md border border-transparent p-1.5 text-muted-foreground transition hover:bg-secondary disabled:opacity-30 ${
        danger ? "hover:bg-destructive/10 hover:text-destructive" : "hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function collectIds(node: MenuNode): string[] {
  return [node.id, ...node.children.flatMap(collectIds)];
}
function countDescendants(node: MenuNode): number {
  return node.children.reduce((n, c) => n + 1 + countDescendants(c), 0);
}
