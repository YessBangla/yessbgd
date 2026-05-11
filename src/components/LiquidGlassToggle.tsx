import { useEffect, useState } from "react";
import { Droplets, Check } from "lucide-react";
import {
  type GlassIntensity,
  loadIntensity,
  saveIntensity,
} from "@/lib/liquidGlass";

/**
 * Floating Liquid Glass intensity toggle.
 * - Bottom-left, safe-area aware, never overlaps the right-edge scroll FAB.
 * - Cycles through 4 tiers via popover; persists choice in localStorage.
 * - Hidden until first interaction with the page (avoids visual noise on load).
 */
const TIERS: { value: GlassIntensity; label: string; hint: string }[] = [
  { value: "off",      label: "Off",      hint: "No background animation" },
  { value: "subtle",   label: "Subtle",   hint: "Minimal motion, calm" },
  { value: "standard", label: "Standard", hint: "Balanced (recommended)" },
  { value: "vivid",    label: "Vivid",    hint: "Rich, cinematic" },
];

export function LiquidGlassToggle() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<GlassIntensity>("standard");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setValue(loadIntensity());
  }, []);

  if (!mounted) return null;

  const pick = (v: GlassIntensity) => {
    setValue(v);
    saveIntensity(v);
    setOpen(false);
  };

  return (
    <div
      className="fixed bottom-4 left-4 z-40"
      style={{ paddingLeft: "env(safe-area-inset-left)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="relative">
        {open && (
          <div
            role="menu"
            aria-label="Liquid Glass intensity"
            className="absolute bottom-12 left-0 w-56 rounded-2xl border border-border bg-card/95 p-1.5 shadow-xl backdrop-blur"
          >
            <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Liquid Glass
            </p>
            {TIERS.map((t) => {
              const active = value === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => pick(t.value)}
                  className={`flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    active ? "bg-secondary text-foreground" : "text-foreground/80 hover:bg-secondary/60"
                  }`}
                >
                  <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center">
                    {active && <Check className="h-3.5 w-3.5 text-primary" aria-hidden />}
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium">{t.label}</span>
                    <span className="block text-xs text-muted-foreground">{t.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
        <button
          type="button"
          aria-label="Background settings"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card/80 text-foreground shadow-md backdrop-blur transition-colors hover:bg-card"
        >
          <Droplets className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
