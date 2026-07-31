// Site-wide data backup helpers — daily export (download) and restore (upload).
//
// Everything runs through the signed-in dashboard session, so RLS keeps
// enforcing who may read or write each table. The UI only decides what to ask for.
import { supabase } from "@/integrations/supabase/client";

export type BackupTable = {
  name: string;
  label: string;
  labelBn: string;
  /** Column used for the daily date filter. */
  dateColumn: string;
  /** Primary key used when restoring rows. */
  conflictKey: string;
  group: "content" | "operations" | "system";
};

export const BACKUP_TABLES: BackupTable[] = [
  { name: "cms_site_pages", label: "Site pages", labelBn: "সাইট পেইজ", dateColumn: "updated_at", conflictKey: "id", group: "content" },
  { name: "cms_pages", label: "Page blocks", labelBn: "পেইজ ব্লক", dateColumn: "updated_at", conflictKey: "id", group: "content" },
  { name: "cms_ventures", label: "Ventures", labelBn: "ভেঞ্চার", dateColumn: "updated_at", conflictKey: "id", group: "content" },
  { name: "cms_services", label: "Services", labelBn: "সার্ভিস", dateColumn: "updated_at", conflictKey: "id", group: "content" },
  { name: "cms_industries", label: "Industries", labelBn: "ইন্ডাস্ট্রি", dateColumn: "updated_at", conflictKey: "id", group: "content" },
  { name: "cms_insights", label: "Insights", labelBn: "ইনসাইট", dateColumn: "updated_at", conflictKey: "id", group: "content" },
  { name: "cms_menu_items", label: "Menus", labelBn: "মেনু", dateColumn: "updated_at", conflictKey: "id", group: "content" },
  { name: "cms_media", label: "Media library", labelBn: "ইমেজ গ্যালারি", dateColumn: "updated_at", conflictKey: "id", group: "content" },
  { name: "cms_settings", label: "Site settings", labelBn: "সাইট সেটিংস", dateColumn: "updated_at", conflictKey: "id", group: "content" },
  { name: "job_applications", label: "Job applications", labelBn: "চাকরির আবেদন", dateColumn: "created_at", conflictKey: "id", group: "operations" },
  { name: "contact_messages", label: "Contact messages", labelBn: "যোগাযোগ বার্তা", dateColumn: "created_at", conflictKey: "id", group: "operations" },
  { name: "audit_logs", label: "Audit log", labelBn: "অডিট লগ", dateColumn: "created_at", conflictKey: "id", group: "system" },
];

export type DateRange = { from: string | null; to: string | null };

export type BackupFile = {
  format: "yess-site-backup";
  version: 1;
  exported_at: string;
  range: DateRange;
  tables: Record<string, Record<string, unknown>[]>;
};

export type TableResult = { table: string; count: number; error?: string };

/* ------------------------------ date helpers ------------------------------ */

export function isoDay(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayRange(): DateRange {
  const t = isoDay(new Date());
  return { from: t, to: t };
}

export function shiftDays(days: number): DateRange {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return { from: isoDay(from), to: isoDay(to) };
}

/** Inclusive day bounds as ISO timestamps. */
function bounds(range: DateRange) {
  const start = range.from ? new Date(`${range.from}T00:00:00`) : null;
  const end = range.to ? new Date(`${range.to}T23:59:59.999`) : null;
  return { start: start?.toISOString() ?? null, end: end?.toISOString() ?? null };
}

/* --------------------------------- export --------------------------------- */

export async function fetchTable(table: BackupTable, range: DateRange) {
  const { start, end } = bounds(range);
  let q = supabase.from(table.name as never).select("*");
  if (start) q = (q as never as { gte: (c: string, v: string) => typeof q }).gte(table.dateColumn, start);
  if (end) q = (q as never as { lte: (c: string, v: string) => typeof q }).lte(table.dateColumn, end);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Record<string, unknown>[];
}

export async function buildBackup(
  tables: BackupTable[],
  range: DateRange,
  onProgress?: (table: string) => void,
): Promise<{ file: BackupFile; results: TableResult[] }> {
  const out: BackupFile = {
    format: "yess-site-backup",
    version: 1,
    exported_at: new Date().toISOString(),
    range,
    tables: {},
  };
  const results: TableResult[] = [];
  for (const t of tables) {
    onProgress?.(t.name);
    try {
      const rows = await fetchTable(t, range);
      out.tables[t.name] = rows;
      results.push({ table: t.name, count: rows.length });
    } catch (e) {
      out.tables[t.name] = [];
      results.push({ table: t.name, count: 0, error: e instanceof Error ? e.message : String(e) });
    }
  }
  return { file: out, results };
}

export function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const cell = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n");
}

export function backupFilename(range: DateRange, ext: string) {
  const tag = range.from && range.to ? (range.from === range.to ? range.from : `${range.from}_${range.to}`) : "all";
  return `yess-data-${tag}.${ext}`;
}

/* --------------------------------- import --------------------------------- */

export function parseBackup(text: string): BackupFile {
  const json = JSON.parse(text) as Partial<BackupFile>;
  if (!json || typeof json !== "object" || !json.tables || typeof json.tables !== "object") {
    throw new Error("ফাইলটি সঠিক ব্যাকআপ ফাইল নয়।");
  }
  return {
    format: "yess-site-backup",
    version: 1,
    exported_at: json.exported_at ?? new Date().toISOString(),
    range: json.range ?? { from: null, to: null },
    tables: json.tables as Record<string, Record<string, unknown>[]>,
  };
}

export async function restoreBackup(
  file: BackupFile,
  tableNames: string[],
  onProgress?: (table: string) => void,
): Promise<TableResult[]> {
  const results: TableResult[] = [];
  for (const name of tableNames) {
    const meta = BACKUP_TABLES.find((t) => t.name === name);
    const rows = file.tables[name] ?? [];
    if (!meta || !rows.length) {
      results.push({ table: name, count: 0 });
      continue;
    }
    onProgress?.(name);
    try {
      // Chunked upsert keeps large restores within request limits.
      let done = 0;
      for (let i = 0; i < rows.length; i += 100) {
        const chunk = rows.slice(i, i + 100);
        const { error } = await supabase
          .from(name as never)
          .upsert(chunk as never, { onConflict: meta.conflictKey });
        if (error) throw new Error(error.message);
        done += chunk.length;
      }
      results.push({ table: name, count: done });
    } catch (e) {
      results.push({ table: name, count: 0, error: e instanceof Error ? e.message : String(e) });
    }
  }
  return results;
}
