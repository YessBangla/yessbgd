import { useState } from "react";
import { Download, Settings2, FlaskConical, Loader2 } from "lucide-react";
import {
  downloadVentureBrief,
  DEFAULT_WATERMARK,
  type WatermarkOptions,
  type PageFormat,
  type PageOrientation,
} from "@/lib/ventureBrief";
import type { Venture } from "@/data/ventures";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  venture: Venture;
  /** Optional className for outer wrapper */
  className?: string;
  /** Visual variant for the primary download button */
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
  const [busy, setBusy] = useState<null | "main" | "samples">(null);

  const watermark: WatermarkOptions = { opacity, sizeFraction, forceFallback };

  const handleDownload = async () => {
    setBusy("main");
    try {
      await downloadVentureBrief(venture, {
        format,
        orientation,
        watermark,
      });
    } finally {
      setBusy(null);
    }
  };

  // Generates 3 sample PDFs covering the watermark rendering matrix:
  //   1. GState alpha (modern viewers — Adobe, Preview, Chrome desktop)
  //   2. Pre-faded raster (mobile-safe fallback — iOS Quick Look, WPS)
  //   3. Higher-contrast (denser branding — verifies upper opacity bound)
  const handleGenerateSamples = async () => {
    setBusy("samples");
    try {
      const variants = [
        {
          label: "gstate",
          watermark: { opacity, sizeFraction, forceFallback: false },
        },
        {
          label: "fallback-raster",
          watermark: { opacity, sizeFraction, forceFallback: true },
        },
        {
          label: "high-contrast",
          watermark: {
            opacity: Math.min(0.18, opacity * 2),
            sizeFraction,
            forceFallback: false,
          },
        },
      ];
      for (const variant of variants) {
        await downloadVentureBrief(venture, {
          format,
          orientation,
          watermark: variant.watermark,
          fileName: `${venture.slug}-brief-sample-${variant.label}`,
        });
        // Small gap so browsers don't coalesce the downloads
        await new Promise((r) => setTimeout(r, 250));
      }
    } finally {
      setBusy(null);
    }
  };

  const primaryClass =
    variant === "primary"
      ? "inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      : "inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 text-sm font-semibold backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-background disabled:opacity-60";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleDownload}
        disabled={busy !== null}
        className={primaryClass}
      >
        {busy === "main" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Download enterprise brief (PDF)
      </button>

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
        <PopoverContent
          align="start"
          className="w-80 space-y-4 p-4 text-sm"
        >
          <div>
            <div className="mb-2 font-semibold">Page</div>
            <div className="flex gap-2">
              {(["a4", "letter"] as PageFormat[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`flex-1 rounded-md border px-2 py-1 text-xs uppercase ${
                    format === f
                      ? "border-primary bg-primary/10"
                      : "border-border"
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
                    orientation === o
                      ? "border-primary bg-primary/10"
                      : "border-border"
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
            <p className="mt-1 text-xs text-muted-foreground">
              Recommended 6–12% for body-text legibility on mobile screens.
            </p>
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
                Bake watermark into a faded JPEG. Required for some Android
                Chrome and WPS Office viewers that ignore PDF transparency.
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
          <p className="text-xs text-muted-foreground">
            Downloads 3 variants — GState alpha, raster fallback, and a
            higher-contrast build. Open each in your target mobile viewer
            (iOS Quick Look, Android Chrome, WPS Office) to compare watermark
            placement.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
