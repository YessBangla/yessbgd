import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/PageHero";
import { LogOut, Mail, Phone, RefreshCw, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({
    meta: [
      { title: "Contact messages — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminMessages,
});

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
};

function AdminMessages() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [query, setQuery] = useState("");

  const load = async () => {
    setError(null);
    const { data, error: e } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (e) {
      setError(e.message);
      setItems([]);
      return;
    }
    setItems((data ?? []) as Message[]);
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({ to: "/admin/login" });
        return;
      }
      setAuthChecked(true);
      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const removeItem = async (m: Message) => {
    if (!confirm(`Delete message from ${m.name}?`)) return;
    const { error: e } = await supabase.from("contact_messages").delete().eq("id", m.id);
    if (e) {
      alert(e.message);
      return;
    }
    setItems((prev) => prev?.filter((x) => x.id !== m.id) ?? null);
  };

  if (!authChecked) {
    return (
      <section className="py-24">
        <div className="container-tight">Loading…</div>
      </section>
    );
  }

  const q = query.trim().toLowerCase();
  const filtered = (items ?? []).filter((m) => {
    if (!q) return true;
    return `${m.name} ${m.email} ${m.subject ?? ""} ${m.message}`.toLowerCase().includes(q);
  });

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Contact messages"
        subtitle="All inbound messages from the contact form."
      />
      <section className="pb-24">
        <div className="container-tight">
          <div className="mb-4 flex flex-wrap gap-2 text-sm">
            <Link to="/admin/applications" className="rounded-full border border-border px-3 py-1.5 font-semibold hover:bg-secondary">
              Applications
            </Link>
            <Link to="/admin/messages" className="rounded-full border border-primary bg-primary/10 px-3 py-1.5 font-semibold text-primary">
              Messages
            </Link>
            <Link to="/admin/audit" className="rounded-full border border-border px-3 py-1.5 font-semibold hover:bg-secondary">
              Audit log
            </Link>
            <Link to="/admin/cms" className="rounded-full border border-border px-3 py-1.5 font-semibold hover:bg-secondary">
              Content (CMS)
            </Link>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              {items ? `${filtered.length} of ${items.length} message${items.length === 1 ? "" : "s"}` : "Loading…"}
            </div>
            <div className="flex gap-2">
              <button onClick={load} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold">
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
              <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, subject, body…"
            className="mb-6 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />

          {error && (
            <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {items && items.length === 0 && !error && (
            <div className="rounded-2xl glass-card p-10 text-center text-sm text-muted-foreground">
              No messages yet.
            </div>
          )}

          <div className="grid gap-4">
            {filtered.map((m) => (
              <article key={m.id} className="rounded-2xl glass-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{m.name}</h3>
                    {m.subject && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {m.subject}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(m.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(m)}
                    className="inline-flex items-center gap-2 rounded-full border border-destructive/40 px-4 py-2 text-xs font-semibold text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    <Mail className="h-3.5 w-3.5" /> {m.email}
                  </a>
                  {m.phone && (
                    <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                      <Phone className="h-3.5 w-3.5" /> {m.phone}
                    </a>
                  )}
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm text-foreground/85">{m.message}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
