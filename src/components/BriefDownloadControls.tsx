import { useEffect, useState } from "react";
import {
  Download,
  Settings2,
  FlaskConical,
  Loader2,
  FileText,
  Building2,
  AlertTriangle,
  X,
  FileDown,
  ImageIcon,
} from "lucide-react";
import {
  downloadVentureBrief,
  DEFAULT_WATERMARK,
  type WatermarkOptions,
  type PageFormat,
  type PageOrientation,
  type IntegrityReport,
} from "@/lib/ventureBrief";
import { downloadVentureBriefDocx } from "@/lib/ventureBriefDocx";
import {
  loadBranding,
  saveBranding,
  DEFAULT_BRANDING,
  type BriefBranding,
} from "@/lib/briefBranding";
import {
  runQaPreview,
  disposeQaRun,
  type QaRunResult,
} from "@/lib/briefQaPreview";
import type { Venture } from "@/data/ventures";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  venture: Venture;
  className?: string;
  variant?: "primary" | "ghost";
}

export function BriefDownloadControls({
  venture,
  className = "",
  variant = "primary",
}: Props) {
  const [opacity, setOpacity] = useState(DEFAULT_WATERMARK.opacity);
  const [sizeFraction, setSizeFraction] = useState(
    DEFAULT_WATERMARK.sizeFraction,
  );
  const [forceFallback, setForceFallback] = useState(false);
  const [format, setFormat] = useState<PageFormat>("a4");
  const [orientation, setOrientation] = useState<PageOrientation>("portrait");
  const [busy, setBusy] = useState<null | "pdf" | "docx" | "samples">(null);
  const [branding, setBranding] = useState<BriefBranding>(() => loadBranding());
  const [integrityWarn, setIntegrityWarn] = useState<IntegrityReport | null>(
    null,
  );

  const watermark: WatermarkOptions = { opacity, sizeFraction, forceFallback };

  const handleDownloadPdf = async () => {
    setBusy("pdf");
    setIntegrityWarn(null);
    try {
      const { integrity } = await downloadVentureBrief(venture, {
        format,
        orientation,
        watermark,
        branding,
      });
      if (!integrity.ok) setIntegrityWarn(integrity);
    } finally {
      setBusy(null);
    }
  };

  const handleDownloadDocx = async () => {
    setBusy("docx");
    try {
      await downloadVentureBriefDocx(venture, {
        branding,
        watermarkOpacity: opacity,
      });
    } finally {
      setBusy(null);
    }
  };

  const handleGenerateSamples = async () => {
    setBusy("samples");
    setIntegrityWarn(null);
    try {
      const variants = [
        { label: "gstate", watermark: { opacity, sizeFraction, forceFallback: false } },
        { label: "fallback-raster", watermark: { opacity, sizeFraction, forceFallback: true } },
        {
          label: "high-contrast",
          watermark: {
            opacity: Math.min(0.18, opacity * 2),
            sizeFraction,
            forceFallback: false,
          },
        },
      ];
      let lastBad: IntegrityReport | null = null;
      for (const v of variants) {
        const { integrity } = await downloadVentureBrief(venture, {
          format,
          orientation,
          watermark: v.watermark,
          branding,
          fileName: `${venture.slug}-brief-sample-${v.label}`,
        });
        if (!integrity.ok) lastBad = integrity;
        await new Promise((r) => setTimeout(r, 250));
      }
      if (lastBad) setIntegrityWarn(lastBad);
    } finally {
      setBusy(null);
    }
  };

  const updateBrand = <K extends keyof BriefBranding>(k: K, val: BriefBranding[K]) => {
    const next = { ...branding, [k]: val };
    setBranding(next);
    saveBranding(next);
  };

  const primaryClass =
    variant === "primary"
      ? "inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      : "inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 text-sm font-semibold backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-background disabled:opacity-60";

  return (
    <div className={`flex w-full flex-col gap-3 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={busy !== null}
          className={primaryClass}
        >
          {busy === "pdf" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download brief (PDF)
        </button>

        <button
          type="button"
          onClick={handleDownloadDocx}
          disabled={busy !== null}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 text-sm font-semibold backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-background disabled:opacity-60"
        >
          {busy === "docx" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          Download (DOCX)
        </button>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Branding"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-2.5 text-sm font-semibold backdrop-blur hover:bg-background"
            >
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Branding</span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-96 max-w-[90vw] space-y-3 p-4 text-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Custom branding</p>
              <button
                type="button"
                onClick={() => {
                  setBranding(DEFAULT_BRANDING);
                  saveBranding(DEFAULT_BRANDING);
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Reset
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Saved locally — applied to every PDF & DOCX you generate from this
              browser.
            </p>
            {([
              ["companyName", "Company name"],
              ["tagline", "Tagline"],
              ["address", "Address"],
              ["phone", "Phone"],
              ["email", "Email"],
              ["web", "Website"],
              ["copyrightHolder", "Copyright holder"],
              ["documentLabel", "Document label"],
              ["confidentialityNote", "Confidentiality note"],
            ] as Array<[keyof BriefBranding, string]>).map(([k, label]) => (
              <label key={k} className="block">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <input
                  type="text"
                  value={branding[k]}
                  onChange={(e) => updateBrand(k, e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                />
              </label>
            ))}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="PDF settings"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-2.5 text-sm font-semibold backdrop-blur hover:bg-background"
            >
              <Settings2 className="h-4 w-4" />
              <span className="hidden sm:inline">PDF settings</span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80 space-y-4 p-4 text-sm">
            <div>
              <div className="mb-2 font-semibold">Page</div>
              <div className="flex gap-2">
                {(["a4", "letter"] as PageFormat[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={`flex-1 rounded-md border px-2 py-1 text-xs uppercase ${
                      format === f ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                {(["portrait", "landscape"] as PageOrientation[]).map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setOrientation(o)}
                    className={`flex-1 rounded-md border px-2 py-1 text-xs capitalize ${
                      orientation === o ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="wm-opacity" className="font-semibold">
                  Watermark opacity
                </label>
                <span className="tabular-nums text-muted-foreground">
                  {Math.round(opacity * 100)}%
                </span>
              </div>
              <input
                id="wm-opacity"
                type="range"
                min={0.02}
                max={0.4}
                step={0.01}
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="wm-size" className="font-semibold">
                  Watermark size
                </label>
                <span className="tabular-nums text-muted-foreground">
                  {Math.round(sizeFraction * 100)}%
                </span>
              </div>
              <input
                id="wm-size"
                type="range"
                min={0.2}
                max={0.95}
                step={0.05}
                value={sizeFraction}
                onChange={(e) => setSizeFraction(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={forceFallback}
                onChange={(e) => setForceFallback(e.target.checked)}
                className="mt-1 accent-primary"
              />
              <span>
                <span className="font-semibold">Force raster fallback</span>
                <span className="block text-xs text-muted-foreground">
                  Required for some Android Chrome and WPS Office viewers.
                </span>
              </span>
            </label>

            <button
              type="button"
              onClick={handleGenerateSamples}
              disabled={busy !== null}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-60"
            >
              {busy === "samples" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FlaskConical className="h-4 w-4" />
              )}
              Generate 3 QA sample PDFs
            </button>
          </PopoverContent>
        </Popover>
      </div>

      {integrityWarn && !integrityWarn.ok && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">
              Some pages in your downloaded PDF are missing branding.
            </p>
            <p className="mt-1 text-xs opacity-90">
              The file was still saved, but the following pages didn't render
              the full letterhead / watermark / footer:
            </p>
            <ul className="mt-2 list-disc space-y-0.5 pl-5 text-xs">
              {integrityWarn.failures.map((f) => (
                <li key={f.page}>
                  Page {f.page} — missing{" "}
                  {[
                    !f.letterhead && "letterhead",
                    !f.watermark && "watermark",
                    !f.footer && "footer",
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs opacity-80">
              Try regenerating; if the issue persists, switch on{" "}
              <strong>Force raster fallback</strong> in PDF settings.
            </p>
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setIntegrityWarn(null)}
            className="rounded-md p-1 hover:bg-destructive/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
