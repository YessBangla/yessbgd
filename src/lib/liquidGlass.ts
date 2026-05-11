/**
 * Liquid Glass background settings.
 * - Intensity: off | subtle | standard | vivid
 * - Persisted in localStorage; applied as data-glass attribute on <html>.
 * - Fires a "liquidglass:change" event so the WaterBackground canvas can
 *   re-read its tuning vars without a full re-mount.
 *
 * Performance hint: detectLowEnd() returns true on devices with low core
 * count, low memory, or saveData enabled. The canvas uses this to lower
 * DPR, FPS and effect cost — and the default intensity falls back to
 * "subtle" instead of "standard" on such devices.
 */
export type GlassIntensity = "off" | "subtle" | "standard" | "vivid";

const STORE_KEY = "yess-liquid-glass-v1";
const EVENT = "liquidglass:change";

export function detectLowEnd(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const cores = nav.hardwareConcurrency ?? 8;
  const mem = nav.deviceMemory ?? 8;
  const saveData = nav.connection?.saveData ?? false;
  return saveData || cores <= 4 || mem <= 4;
}

export function loadIntensity(): GlassIntensity {
  if (typeof window === "undefined") return "standard";
  try {
    const v = localStorage.getItem(STORE_KEY) as GlassIntensity | null;
    if (v === "off" || v === "subtle" || v === "standard" || v === "vivid") return v;
  } catch { /* quota / privacy */ }
  return detectLowEnd() ? "subtle" : "standard";
}

export function applyIntensity(value: GlassIntensity) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-glass", value);
}

export function saveIntensity(value: GlassIntensity) {
  applyIntensity(value);
  try { localStorage.setItem(STORE_KEY, value); } catch { /* quota */ }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<GlassIntensity>(EVENT, { detail: value }));
  }
}

export function onIntensityChange(cb: (v: GlassIntensity) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => cb((e as CustomEvent<GlassIntensity>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

/**
 * Per-intensity tuning consumed by WaterBackground.
 * blob.alpha   — peak alpha at gradient center
 * blob.radius  — gradient radius as a multiple of max(viewport)
 * blob.speed   — drift-time multiplier (lower = calmer)
 * blob.count   — how many caustic blobs to draw per frame
 * fpsCap       — frame budget hint
 */
export interface GlassTuning {
  alphaLight: number;
  alphaDark: number;
  radiusMul: number;
  speed: number;
  blobCount: number;
  fpsCap: number;
  rippleAlpha: number;
  enabled: boolean;
}

export function tuningFor(level: GlassIntensity, lowEnd: boolean): GlassTuning {
  const base: Record<GlassIntensity, GlassTuning> = {
    off:      { alphaLight: 0,    alphaDark: 0,    radiusMul: 0.6, speed: 0.0,    blobCount: 0, fpsCap: 0,  rippleAlpha: 0,    enabled: false },
    subtle:   { alphaLight: 0.18, alphaDark: 0.14, radiusMul: 0.7, speed: 0.00025, blobCount: 3, fpsCap: 30, rippleAlpha: 0.15, enabled: true  },
    standard: { alphaLight: 0.30, alphaDark: 0.22, radiusMul: 0.6, speed: 0.0004,  blobCount: 4, fpsCap: 60, rippleAlpha: 0.24, enabled: true  },
    vivid:    { alphaLight: 0.42, alphaDark: 0.32, radiusMul: 0.55, speed: 0.0006, blobCount: 5, fpsCap: 60, rippleAlpha: 0.32, enabled: true  },
  };
  const t = { ...base[level] };
  if (lowEnd && t.enabled) {
    t.fpsCap = Math.min(t.fpsCap, 24);
    t.blobCount = Math.max(2, t.blobCount - 1);
    t.alphaLight *= 0.85;
    t.alphaDark *= 0.85;
  }
  return t;
}

/**
 * Refined editorial Liquid Glass palettes — ivory, sage, slate, linen.
 * Cool-neutral and painterly. No warm red/terracotta tones.
 */
export const LIGHT_PALETTE = [
  { hue: 110, sat: 0.025, l: 0.88 }, // ivory
  { hue: 175, sat: 0.035, l: 0.84 }, // pale sage
  { hue: 230, sat: 0.040, l: 0.80 }, // dusty linen blue
  { hue: 250, sat: 0.025, l: 0.82 }, // soft slate
  { hue: 200, sat: 0.030, l: 0.86 }, // misty cyan
];

export const DARK_PALETTE = [
  { hue: 110, sat: 0.025, l: 0.40 }, // muted moss
  { hue: 175, sat: 0.045, l: 0.42 }, // deep sage
  { hue: 230, sat: 0.050, l: 0.36 }, // midnight slate
  { hue: 250, sat: 0.040, l: 0.30 }, // ink
  { hue: 200, sat: 0.035, l: 0.34 }, // teal shadow
];
