/**
 * FooterLivePreview — renders the real site <Footer /> with an in-memory
 * config override so the dashboard shows edits in realtime, with a
 * desktop / mobile viewport switch.
 */
import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { Footer } from "@/components/Footer";
import type { FooterConfig } from "@/lib/footerConfig";

/** Approximate the phone rendering: apply the mobile column/alignment rules. */
function toMobileConfig(cfg: FooterConfig): FooterConfig {
  return {
    ...cfg,
    style: {
      ...cfg.style,
      columns: Math.min(cfg.style.columns, cfg.style.mobile_columns) as FooterConfig["style"]["columns"],
      align_center: cfg.style.mobile_align === "center",
    },
  };
}

export function FooterLivePreview({ cfg }: { cfg: FooterConfig }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const mobile = device === "mobile";
  const preview = mobile ? toMobileConfig(cfg) : cfg;

  const btn = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold ${
      active ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"
    }`;

  return (
    <div className="rounded-lg border border-border bg-background/60 p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Live preview <span className="font-normal normal-case tracking-normal">· লাইভ প্রিভিউ</span>
        </p>
        <div className="ml-auto flex items-center gap-1.5">
          <button type="button" onClick={() => setDevice("desktop")} className={btn(!mobile)} aria-pressed={!mobile}>
            <Monitor className="h-3.5 w-3.5" /> Desktop
          </button>
          <button type="button" onClick={() => setDevice("mobile")} className={btn(mobile)} aria-pressed={mobile}>
            <Smartphone className="h-3.5 w-3.5" /> Mobile
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className={mobile ? "mx-auto w-[390px] max-w-full" : "w-full"}>
          <div
            className="pointer-events-none origin-top"
            style={{ transform: "scale(0.72)", width: "138.9%", marginBottom: "-28%" }}
          >
            <Footer configOverride={preview} />
          </div>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        এখানে সব পরিবর্তন সাথে সাথেই দেখা যাচ্ছে — সেভ করলে সাইটে প্রয়োগ হবে।
      </p>
    </div>
  );
}
