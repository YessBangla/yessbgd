import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { useMediaLibrary, uploadMedia, deleteMedia, signedMediaUrl, type MediaRow } from "@/lib/siteContent";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2, Copy, Loader2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/admin/media")({
  head: () => ({
    meta: [
      { title: "Media library — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminMedia,
});

function AdminMedia() {
  const { data, isLoading, refetch } = useMediaLibrary();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [folder, setFolder] = useState("general");

  const onPick = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      for (const file of Array.from(files)) await uploadMedia(file, folder);
      setMsg(`${files.length} file(s) uploaded.`);
      await refetch();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onDelete = async (row: MediaRow) => {
    if (!window.confirm(`Delete ${row.file_name}?`)) return;
    try {
      await deleteMedia(row);
      await refetch();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const refreshLink = async (row: MediaRow) => {
    if (!row.path) return;
    const url = await signedMediaUrl(row.path);
    await supabase.from("cms_media").update({ url } as never).eq("id", row.id);
    await navigator.clipboard.writeText(url).catch(() => {});
    setMsg("Fresh link copied to clipboard.");
    await refetch();
  };

  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url).catch(() => {});
    setMsg("Link copied.");
  };

  return (
    <div>
      <AdminPageHeader
        title="Media library"
        titleBn="মিডিয়া লাইব্রেরি"
        description="Upload images once and reuse their links anywhere on the site."
        actions={
          <>
            <input
              value={folder}
              onChange={(e) => setFolder(e.target.value.replace(/[^a-z0-9-]/gi, "-").toLowerCase())}
              className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              aria-label="Folder"
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => onPick(e.target.files)}
            />
          </>
        }
      />

      {err && <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}
      {msg && <p className="mb-4 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">{msg}</p>}
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {(data ?? []).map((row) => (
          <figure key={row.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="aspect-[4/3] bg-secondary/50">
              {row.url && (
                <img src={row.url} alt={row.alt_text || row.file_name} className="h-full w-full object-cover" loading="lazy" />
              )}
            </div>
            <figcaption className="p-3">
              <div className="truncate text-xs font-medium" title={row.file_name}>
                {row.file_name}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {row.folder} · {Math.round((row.size_bytes ?? 0) / 1024)} KB
              </div>
              <div className="mt-2 flex gap-1">
                <button onClick={() => copy(row.url)} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-secondary" aria-label="Copy link">
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => refreshLink(row)} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-secondary" aria-label="Refresh link">
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => onDelete(row)} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {!isLoading && (data ?? []).length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No media yet — upload your first image.
        </p>
      )}
    </div>
  );
}
