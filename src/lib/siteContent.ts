// Site-wide dynamic content: settings, page sections, menus and media.
// Every hook falls back to sensible defaults so the site never breaks
// when a row is missing.
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const STALE = 60_000;

/* --------------------------------- settings -------------------------------- */

export type SettingRow = {
  id: string;
  key: string;
  label: string | null;
  group: string | null;
  value: Record<string, unknown> | null;
  sort_order: number | null;
};

export function useSettings() {
  const { data } = useQuery({
    queryKey: ["cms", "settings"],
    staleTime: STALE,
    queryFn: async () => {
      const { data } = await supabase.from("cms_settings").select("*").order("sort_order");
      return (data ?? []) as unknown as SettingRow[];
    },
  });
  const map: Record<string, Record<string, unknown>> = {};
  for (const row of data ?? []) map[row.key] = (row.value ?? {}) as Record<string, unknown>;
  return { rows: data ?? [], map };
}

/** Read a single text setting (`{ "text": "..." }` shape) with fallback. */
export function useSettingText(key: string, fallback = ""): string {
  const { map } = useSettings();
  const v = map[key]?.text;
  return typeof v === "string" && v.trim() ? v : fallback;
}

export function useSettingObject(key: string): Record<string, unknown> {
  const { map } = useSettings();
  return map[key] ?? {};
}

/* ------------------------------- page sections ------------------------------ */

export type PageSection = {
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
  data: Record<string, unknown> | null;
  is_published: boolean | null;
};

export function usePageSections(page: string) {
  const { data } = useQuery({
    queryKey: ["cms", "pages", page],
    staleTime: STALE,
    queryFn: async () => {
      const { data } = await supabase
        .from("cms_pages")
        .select("*")
        .eq("page", page)
        .eq("is_published", true)
        .order("sort_order");
      return (data ?? []) as unknown as PageSection[];
    },
  });
  const rows = data ?? [];
  const bySection = new Map(rows.map((r) => [r.section_key, r]));
  return {
    sections: rows,
    section: (key: string) => bySection.get(key),
  };
}

/* ----------------------------------- menus ---------------------------------- */

export type MenuItem = {
  id: string;
  location: string;
  label: string;
  label_bn: string | null;
  href: string;
  group_label: string | null;
  sort_order: number | null;
  is_external: boolean | null;
};

export function useMenu(location: "header" | "footer") {
  const { data } = useQuery({
    queryKey: ["cms", "menu", location],
    staleTime: STALE,
    queryFn: async () => {
      const { data } = await supabase
        .from("cms_menu_items")
        .select("*")
        .eq("location", location)
        .eq("is_published", true)
        .order("sort_order");
      return (data ?? []) as unknown as MenuItem[];
    },
  });
  return data ?? [];
}

/* ----------------------------------- media ---------------------------------- */

export type MediaRow = {
  id: string;
  file_name: string;
  url: string;
  path: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string | null;
  folder: string | null;
  created_at: string;
};

export const MEDIA_BUCKET = "media";
const SIGNED_TTL = 60 * 60 * 24 * 7; // 7 days

export async function signedMediaUrl(path: string): Promise<string> {
  const { data } = await supabase.storage.from(MEDIA_BUCKET).createSignedUrl(path, SIGNED_TTL);
  return data?.signedUrl ?? "";
}

export function useMediaLibrary() {
  return useQuery({
    queryKey: ["cms", "media"],
    staleTime: 10_000,
    queryFn: async () => {
      const { data } = await supabase
        .from("cms_media")
        .select("*")
        .order("created_at", { ascending: false });
      return (data ?? []) as unknown as MediaRow[];
    },
  });
}

/** Uploads a file to the media bucket and records it in cms_media. */
export async function uploadMedia(file: File, folder = "general", alt = "") {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const path = `${folder}/${Date.now()}-${safe}`;
  const up = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (up.error) throw new Error(up.error.message);
  const url = await signedMediaUrl(path);
  const { error } = await supabase.from("cms_media").insert({
    file_name: file.name,
    url,
    path,
    mime_type: file.type,
    size_bytes: file.size,
    alt_text: alt,
    folder,
  } as never);
  if (error) throw new Error(error.message);
  return { path, url };
}

export async function deleteMedia(row: MediaRow) {
  if (row.path) await supabase.storage.from(MEDIA_BUCKET).remove([row.path]);
  const { error } = await supabase.from("cms_media").delete().eq("id", row.id);
  if (error) throw new Error(error.message);
}
