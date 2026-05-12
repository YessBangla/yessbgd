import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/PageHero";
import { getCmsConfig, type CmsField } from "@/lib/cmsSchema";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/cms/$type/$id")({
  head: () => ({
    meta: [
      { title: "Edit content — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminCmsEdit,
});

type FormState = Record<string, unknown>;

function defaultsFor(fields: CmsField[]): FormState {
  const out: FormState = {};
  for (const f of fields) {
    if (f.type === "boolean") out[f.key] = f.key === "is_published" ? true : false;
    else if (f.type === "number") out[f.key] = 0;
    else if (f.type === "json") out[f.key] = "";
    else out[f.key] = "";
  }
  return out;
}

function AdminCmsEdit() {
  const { type, id } = useParams({ from: "/admin/cms/$type/$id" });
  const navigate = useNavigate();
  const cfg = useMemo(() => getCmsConfig(type), [type]);
  const isNew = id === "new";

  const [form, setForm] = useState<FormState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        navigate({ to: "/admin/login" });
        return;
      }
      if (!cfg) {
        setLoading(false);
        return;
      }
      if (isNew) {
        setForm(defaultsFor(cfg.fields));
        setLoading(false);
        return;
      }
      const { data, error: e } = await supabase.from(cfg.table).select("*").eq("id", id).maybeSingle();
      if (e || !data) {
        setError(e?.message || "Not found");
        setLoading(false);
        return;
      }
      const next: FormState = {};
      for (const f of cfg.fields) {
        const v = (data as Record<string, unknown>)[f.key];
        if (f.type === "json") {
          next[f.key] = v == null ? "" : JSON.stringify(v, null, 2);
        } else if (f.type === "boolean") {
          next[f.key] = Boolean(v);
        } else if (f.type === "number") {
          next[f.key] = v == null ? 0 : Number(v);
        } else {
          next[f.key] = v == null ? "" : String(v);
        }
      }
      setForm(next);
      setLoading(false);
    })();
  }, [cfg, id, isNew, navigate]);

  if (!cfg) {
    return (
      <section className="pb-24 pt-12">
        <div className="container-tight">
          <p className="text-sm text-destructive">Unknown CMS type: {type}</p>
          <Link to="/admin/cms" className="mt-4 inline-block text-sm text-primary">
            ← Back
          </Link>
        </div>
      </section>
    );
  }

  const setField = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const payload: Record<string, unknown> = {};
    for (const f of cfg.fields) {
      const raw = form[f.key];
      if (f.type === "json") {
        const s = String(raw ?? "").trim();
        if (!s) {
          payload[f.key] = null;
        } else {
          try {
            payload[f.key] = JSON.parse(s);
          } catch {
            setError(`Invalid JSON in field "${f.label}"`);
            setSaving(false);
            return;
          }
        }
      } else if (f.type === "boolean") {
        payload[f.key] = Boolean(raw);
      } else if (f.type === "number") {
        const n = Number(raw);
        payload[f.key] = Number.isFinite(n) ? n : 0;
      } else {
        const s = String(raw ?? "").trim();
        payload[f.key] = s === "" ? null : s;
      }
    }
    if (cfg.fields.find((f) => f.key === "slug" && f.required) && !payload.slug) {
      setError("Slug is required");
      setSaving(false);
      return;
    }

    const { error: e2 } = isNew
      ? await supabase.from(cfg.table).insert(payload as never)
      : await supabase.from(cfg.table).update(payload as never).eq("id", id);
    setSaving(false);
    if (e2) {
      setError(e2.message);
      return;
    }
    navigate({ to: "/admin/cms/$type", params: { type } });
  };

  return (
    <>
      <PageHero
        eyebrow={`Admin · ${cfg.label}`}
        title={isNew ? `New ${cfg.label.slice(0, -1)}` : "Edit entry"}
        subtitle={cfg.description}
      />
      <section className="pb-24">
        <div className="container-tight max-w-3xl">
          <Link
            to="/admin/cms/$type"
            params={{ type }}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to list
          </Link>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <form onSubmit={onSubmit} className="rounded-2xl glass-card p-6 sm:p-8 space-y-5">
              {cfg.fields.map((f) => (
                <FieldInput key={f.key} field={f} value={form[f.key]} onChange={(v) => setField(f.key, v)} />
              ))}
              {error && (
                <p className="inline-flex items-center gap-1.5 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" /> {error}
                </p>
              )}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
                >
                  <Save className="h-4 w-4" /> {saving ? "Saving…" : isNew ? "Create" : "Save changes"}
                </button>
                <Link
                  to="/admin/cms/$type"
                  params={{ type }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: CmsField;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const baseInput =
    "mt-1.5 w-full rounded-lg border border-glass-border bg-white/60 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-white/5";

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-glass-border text-primary focus:ring-primary"
        />
        <span className="font-medium">{field.label}</span>
        {field.help && <span className="text-xs text-muted-foreground">— {field.help}</span>}
      </label>
    );
  }

  return (
    <div>
      <label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </label>
      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
      {field.type === "textarea" || field.type === "markdown" || field.type === "json" ? (
        <textarea
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={field.type === "markdown" ? 12 : field.type === "json" ? 8 : 4}
          className={`${baseInput} font-${field.type === "json" ? "mono" : "sans"}`}
          spellCheck={field.type !== "json"}
        />
      ) : field.type === "number" ? (
        <input
          type="number"
          value={Number(value ?? 0)}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className={baseInput}
        />
      ) : (
        <input
          type="text"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseInput}
        />
      )}
    </div>
  );
}
