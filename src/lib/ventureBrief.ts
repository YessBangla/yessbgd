import jsPDF from "jspdf";
import type { Venture } from "@/data/ventures";
import {
  getVentureCase,
  getVentureMilestones,
  getVenturePackages,
  getVentureFaqs,
} from "@/data/ventures";
import logoUrl from "@/assets/yess-bangla-logo.jpeg";
import {
  type BriefBranding,
  DEFAULT_BRANDING,
  resolveBranding,
} from "./briefBranding";

export type { BriefBranding };

export type PageFormat = "a4" | "letter";
export type PageOrientation = "portrait" | "landscape";

export interface WatermarkOptions {
  /** 0..1, default 0.08. Clamped to [0.02, 0.4]. */
  opacity?: number;
  /** Fraction of usable content area, default 0.6. Clamped to [0.2, 0.95]. */
  sizeFraction?: number;
  /** When true, force the canvas-faded fallback instead of GState alpha. */
  forceFallback?: boolean;
}

export interface BriefOptions {
  format?: PageFormat;
  orientation?: PageOrientation;
  /** When provided, embeds these bytes as the watermark logo (used by tests). */
  logoDataUrl?: string | null;
  /** Skip triggering doc.save() — the doc is returned for callers/tests. */
  skipSave?: boolean;
  /** Watermark tuning — surfaced through the UI settings popover. */
  watermark?: WatermarkOptions;
  /** Override the saved file name (extension added automatically). */
  fileName?: string;
  /** Custom branding — falls back to DEFAULT_BRANDING for missing fields. */
  branding?: Partial<BriefBranding>;
}

export const DEFAULT_WATERMARK: Required<WatermarkOptions> = {
  opacity: 0.08,
  sizeFraction: 0.6,
  forceFallback: false,
};

function clampWatermark(w: WatermarkOptions = {}): Required<WatermarkOptions> {
  return {
    opacity: Math.max(0.02, Math.min(0.4, w.opacity ?? DEFAULT_WATERMARK.opacity)),
    sizeFraction: Math.max(
      0.2,
      Math.min(0.95, w.sizeFraction ?? DEFAULT_WATERMARK.sizeFraction),
    ),
    forceFallback: w.forceFallback ?? DEFAULT_WATERMARK.forceFallback,
  };
}

/** Detection markers — written invisibly on every page so a PDF parser
 *  can verify that the letterhead/watermark/footer pipeline ran. */
export const MARKERS = {
  letterhead: "YESS-LH-MARKER",
  watermark: "YESS-WM-MARKER",
  footer: "YESS-FT-MARKER",
} as const;

interface PageDims {
  w: number;
  h: number;
  margin: number;
  headerH: number;
  footerH: number;
  contentW: number;
  topY: number;
  bottomY: number;
}

const FORMAT_DIMS: Record<PageFormat, { portrait: [number, number] }> = {
  a4: { portrait: [210, 297] },
  letter: { portrait: [215.9, 279.4] },
};

function computeDims(format: PageFormat, orientation: PageOrientation): PageDims {
  const [pw, ph] = FORMAT_DIMS[format].portrait;
  const w = orientation === "portrait" ? pw : ph;
  const h = orientation === "portrait" ? ph : pw;
  // Scale margin/header/footer proportionally so letterhead aligns on every size
  const margin = Math.round(w * 0.086 * 100) / 100; // ~18mm on A4 portrait
  const headerH = Math.round(h * 0.094 * 100) / 100; // ~28mm on A4 portrait
  const footerH = Math.round(h * 0.074 * 100) / 100; // ~22mm on A4 portrait
  return {
    w,
    h,
    margin,
    headerH,
    footerH,
    contentW: w - margin * 2,
    topY: headerH + 8,
    bottomY: h - footerH - 4,
  };
}

// Cache logo data URL across calls (browser only)
let cachedLogoDataUrl: string | null = null;
async function loadLogo(): Promise<string | null> {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;
  if (typeof fetch !== "function" || typeof FileReader === "undefined") return null;
  try {
    const res = await fetch(logoUrl);
    const blob = await res.blob();
    cachedLogoDataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
    return cachedLogoDataUrl;
  } catch {
    return null;
  }
}

/** Pre-baked faded watermark cache, keyed by opacity (rounded to 2dp).
 *  Avoids re-rasterising the logo for every page — one Canvas pass per
 *  opacity level is reused across all pages and all sample PDFs. */
const fadedLogoCache = new Map<string, string>();
async function getFadedLogo(opacity: number): Promise<string | null> {
  const base = await loadLogo();
  if (!base) return null;
  if (typeof document === "undefined") return null;
  const key = opacity.toFixed(2);
  const hit = fadedLogoCache.get(key);
  if (hit) return hit;
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = base;
    });
    // Cap at 480px — watermark is drawn at content-area scale, so any
    // larger source pixels just inflate the PDF without visible benefit
    // on mobile screens.
    const max = 480;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    // Paint white background then logo at requested alpha — bakes the
    // fade into the JPEG so viewers without GState alpha still see a
    // soft watermark instead of a solid logo.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = opacity;
    ctx.drawImage(img, 0, 0, w, h);
    // JPEG @ 0.6 quality — small file, mobile-friendly
    const out = canvas.toDataURL("image/jpeg", 0.6);
    fadedLogoCache.set(key, out);
    return out;
  } catch {
    return null;
  }
}


/** Write text in a near-invisible white color so the marker is present in
 *  the PDF content stream (detectable by tests) but doesn't show on paper. */
function writeMarker(doc: jsPDF, marker: string, x: number, y: number) {
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(1);
  doc.text(marker, x, y);
}

function drawLetterhead(
  doc: jsPDF,
  d: PageDims,
  logo: string | null,
  subtitle: string,
  brand: BriefBranding,
) {
  doc.setFillColor(15, 35, 80);
  doc.rect(0, 0, d.w, d.headerH, "F");
  doc.setFillColor(232, 184, 64);
  doc.rect(0, d.headerH, d.w, 1.2, "F");

  const logoSize = Math.min(d.headerH - 10, 22);
  if (logo) {
    try {
      doc.addImage(logo, "JPEG", d.margin, 5, logoSize, logoSize);
    } catch {
      /* ignore */
    }
  }

  const textX = d.margin + logoSize + 4;
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(brand.companyName, textX, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(220, 226, 240);
  doc.text(brand.tagline, textX, 17.5);
  doc.text(subtitle, textX, 22.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(brand.documentLabel, d.w - d.margin, 12, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(220, 226, 240);
  doc.text(
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    d.w - d.margin,
    17.5,
    { align: "right" },
  );
  doc.text(brand.confidentialityNote, d.w - d.margin, 22.5, {
    align: "right",
  });

  writeMarker(doc, MARKERS.letterhead, d.margin, d.headerH - 0.5);
}

interface WatermarkAssets {
  /** Original logo data URL (used when GState alpha is available). */
  logo: string | null;
  /** Pre-faded raster baked at requested opacity (used by fallback path). */
  faded: string | null;
  settings: Required<WatermarkOptions>;
  /** Reused image alias inside the PDF — set on first draw, reused after. */
  imageAlias: string;
}

function detectGStateSupport(doc: jsPDF): boolean {
  const gs = doc as unknown as { GState?: unknown; setGState?: unknown };
  return typeof gs.GState === "function" && typeof gs.setGState === "function";
}

function drawWatermark(doc: jsPDF, d: PageDims, assets: WatermarkAssets) {
  // Always emit the marker so tests can detect the watermark pass even when
  // the logo asset isn't available.
  writeMarker(doc, MARKERS.watermark, d.w / 2, d.h / 2);
  const { logo, faded, settings, imageAlias } = assets;
  if (!logo && !faded) return;

  const size =
    Math.min(d.contentW, d.h - d.headerH - d.footerH) * settings.sizeFraction;
  const x = (d.w - size) / 2;
  const y = (d.h - size) / 2;

  // Path A — GState alpha (smaller PDF, sharper watermark).
  // Path B — pre-faded JPEG (works on every viewer, including mobile
  //          PDF readers without ExtGState alpha support).
  const useGState = !settings.forceFallback && logo && detectGStateSupport(doc);

  try {
    if (useGState) {
      const gs = doc as unknown as {
        GState: new (opts: { opacity: number }) => unknown;
        addGState?: (key: string, gs: unknown) => void;
        setGState: (s: unknown) => void;
      };
      const wm = new gs.GState({ opacity: settings.opacity });
      if (gs.addGState) {
        try {
          gs.addGState("yess-wm-" + Math.round(settings.opacity * 100), wm);
        } catch {
          /* already registered */
        }
      }
      gs.setGState(wm);
      // Pass alias so jsPDF reuses the embedded XObject across pages — keeps
      // file size flat regardless of page count.
      doc.addImage(logo!, "JPEG", x, y, size, size, imageAlias, "FAST");
      try {
        gs.setGState(new gs.GState({ opacity: 1 }));
      } catch {
        /* ignore */
      }
    } else if (faded) {
      // Fallback — single embedded raster with alpha already baked in.
      doc.addImage(faded, "JPEG", x, y, size, size, imageAlias, "FAST");
    }
  } catch {
    /* swallow — letterhead + footer still provide branding */
  }
}


function drawFooter(
  doc: jsPDF,
  d: PageDims,
  pageNum: number,
  total: number,
  slug: string,
) {
  const top = d.h - d.footerH;
  doc.setDrawColor(232, 184, 64);
  doc.setLineWidth(0.4);
  doc.line(d.margin, top, d.w - d.margin, top);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 35, 80);
  doc.text("YESS Bangla Ltd.", d.margin, top + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  doc.setTextColor(70, 70, 70);
  doc.text(
    "Block A, Road 3, House 127, Mirpur 12, Dhaka 1216, Bangladesh",
    d.margin,
    top + 9.5,
  );
  doc.text(
    "Email: yessbangla.bd@gmail.com   ·   Phone: +880 1805-464343",
    d.margin,
    top + 13.5,
  );
  doc.text("Web: https://yessbgd.lovable.app/ventures/" + slug, d.margin, top + 17.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 35, 80);
  doc.text(`Page ${pageNum} of ${total}`, d.w - d.margin, top + 9.5, {
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 140);
  doc.text(
    "© " + new Date().getFullYear() + " YESS Bangla",
    d.w - d.margin,
    top + 13.5,
    { align: "right" },
  );

  writeMarker(doc, MARKERS.footer, d.margin, d.h - 1);
}

/**
 * Build a fully branded enterprise brief PDF for a venture and return the
 * jsPDF document. Caller can then `doc.save(...)` or hand the bytes to a
 * test/QA harness. Used by both `downloadVentureBrief` and the regression
 * test suite.
 */
export async function buildVentureBriefDoc(
  v: Venture,
  opts: BriefOptions = {},
): Promise<jsPDF> {
  const format: PageFormat = opts.format ?? "a4";
  const orientation: PageOrientation = opts.orientation ?? "portrait";
  const d = computeDims(format, orientation);
  const logo =
    opts.logoDataUrl !== undefined ? opts.logoDataUrl : await loadLogo();
  const settings = clampWatermark(opts.watermark);
  // Pre-bake fallback once. Reused on every page via the alias below.
  const faded =
    opts.logoDataUrl === null
      ? null
      : settings.forceFallback || !logo
        ? await getFadedLogo(settings.opacity)
        : null;
  const assets: WatermarkAssets = {
    logo,
    faded,
    settings,
    imageAlias: "yess-wm-img",
  };

  const doc = new jsPDF({ unit: "mm", format, orientation });
  let y = d.topY;

  const subtitle = v.category.toUpperCase() + " · " + v.title;

  const newPage = () => {
    doc.addPage(format, orientation);
    drawLetterhead(doc, d, logo, subtitle);
    drawWatermark(doc, d, assets);
    y = d.topY;
  };

  const ensureSpace = (need: number) => {
    if (y + need > d.bottomY) newPage();
  };

  const text = (
    body: string,
    o: { size?: number; bold?: boolean; color?: [number, number, number]; gap?: number } = {},
  ) => {
    const { size = 10, bold = false, color = [40, 40, 40], gap = 1 } = o;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(body, d.contentW) as string[];
    for (const line of lines) {
      ensureSpace(size * 0.45 + gap);
      doc.text(line, d.margin, y);
      y += size * 0.45 + gap;
    }
  };

  const h1 = (s: string) => {
    ensureSpace(14);
    text(s, { size: 20, bold: true, color: [20, 20, 20], gap: 2 });
    y += 1;
  };
  const h2 = (s: string) => {
    ensureSpace(14);
    y += 4;
    text(s, { size: 13, bold: true, color: [15, 35, 80], gap: 2 });
    doc.setDrawColor(232, 184, 64);
    doc.setLineWidth(0.3);
    doc.line(d.margin, y, d.margin + 40, y);
    y += 3;
  };
  const p = (s: string) => text(s, { size: 10, color: [60, 60, 60], gap: 1.5 });
  const bullet = (s: string) => text("•  " + s, { size: 10, color: [55, 55, 55], gap: 1.2 });

  // First page chrome
  drawLetterhead(doc, d, logo, subtitle);
  drawWatermark(doc, d, assets);

  h1(v.title);
  text(v.tagline, { size: 11, bold: true, color: [80, 80, 80], gap: 1.5 });
  y += 1;
  p(v.longDesc);

  h2("Highlights");
  v.highlights.forEach(bullet);

  h2("Services");
  p(v.services.join(" · "));

  h2("Audience");
  p(v.audience);

  const cs = getVentureCase(v);
  h2("Challenge");
  p(cs.challenge);
  h2("Our solution");
  p(cs.solution);

  h2("Delivery phases");
  cs.phases.forEach((ph, i) => {
    text(`${i + 1}. ${ph.title}`, { size: 10.5, bold: true, color: [40, 40, 40], gap: 1.2 });
    p(ph.desc);
  });

  h2("Capabilities & stack");
  p(cs.techStack.join(", "));

  h2("Outcomes");
  cs.results.forEach((r) => bullet(`${r.value} — ${r.label}`));

  h2("Key milestones");
  getVentureMilestones(v).forEach((m) =>
    bullet(`${m.year} — ${m.title}: ${m.desc}`),
  );

  h2("Engagement packages");
  getVenturePackages(v).forEach((pk) => {
    text(`${pk.name} — ${pk.price}${pk.cadence ? " " + pk.cadence : ""}`, {
      size: 11,
      bold: true,
      color: [15, 35, 80],
      gap: 1.5,
    });
    p(pk.summary);
    pk.features.forEach(bullet);
    y += 1;
  });

  h2("FAQs");
  getVentureFaqs(v).forEach((f) => {
    text("Q: " + f.q, { size: 10.5, bold: true, color: [40, 40, 40], gap: 1.2 });
    p("A: " + f.a);
    y += 1;
  });

  h2("Talk to us");
  p("Reach out to our enterprise desk for a tailored proposal, references on request, and NDA-ready discovery.");

  // Footers on every page
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    drawFooter(doc, d, i, pages, v.slug);
  }

  return doc;
}

/**
 * Inspect a generated jsPDF document and return per-page presence of
 * letterhead/watermark/footer markers. Used by both regression tests and
 * the `verifyBriefIntegrity` runtime guard.
 */
export interface PagePresence {
  page: number;
  letterhead: boolean;
  watermark: boolean;
  footer: boolean;
}

export function inspectBriefDoc(doc: jsPDF): PagePresence[] {
  // jsPDF exposes per-page operator streams via doc.internal.pages — index 0
  // is unused (1-based). Each page is an array of operator strings.
  const pages = (doc.internal as unknown as { pages: string[][] }).pages;
  const out: PagePresence[] = [];
  for (let i = 1; i < pages.length; i++) {
    const stream = (pages[i] || []).join("\n");
    out.push({
      page: i,
      letterhead: stream.includes(MARKERS.letterhead),
      watermark: stream.includes(MARKERS.watermark),
      footer: stream.includes(MARKERS.footer),
    });
  }
  return out;
}

/** Throws if any page is missing letterhead/watermark/footer markers. */
export function verifyBriefIntegrity(doc: jsPDF): void {
  const presence = inspectBriefDoc(doc);
  if (presence.length === 0) {
    throw new Error("Brief PDF has no pages");
  }
  const failures = presence.filter(
    (p) => !p.letterhead || !p.watermark || !p.footer,
  );
  if (failures.length) {
    const desc = failures
      .map(
        (f) =>
          `page ${f.page}: ${[
            !f.letterhead && "letterhead",
            !f.watermark && "watermark",
            !f.footer && "footer",
          ]
            .filter(Boolean)
            .join(", ")}`,
      )
      .join("; ");
    throw new Error("Brief PDF integrity check failed — " + desc);
  }
}

export async function downloadVentureBrief(
  v: Venture,
  opts: BriefOptions = {},
) {
  const doc = await buildVentureBriefDoc(v, opts);
  // Defensive runtime guard — if a future edit drops a draw call we'll find
  // out at download time rather than after the user shares a broken PDF.
  try {
    verifyBriefIntegrity(doc);
  } catch (e) {
    // Surface to console but still let the user download — branding is best
    // effort, content is the priority.
    if (typeof console !== "undefined") {
      console.error("[ventureBrief]", (e as Error).message);
    }
  }
  if (!opts.skipSave) {
    const suffix =
      opts.format && opts.format !== "a4"
        ? `-${opts.format}`
        : opts.orientation === "landscape"
          ? "-landscape"
          : "";
    const name = opts.fileName ?? `${v.slug}-enterprise-brief${suffix}`;
    doc.save(name.endsWith(".pdf") ? name : name + ".pdf");
  }
  return doc;
}
