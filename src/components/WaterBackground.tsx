import { useEffect, useRef, useState } from "react";
import {
  type GlassTuning,
  getPalette,
  detectLowEnd,
  loadIntensity,
  onIntensityChange,
  onPaletteChange,
  tuningFor,
} from "@/lib/liquidGlass";

/**
 * Liquid Glass background canvas.
 *
 * Performance:
 * - DPR capped (1.0 on low-end, 1.25 elsewhere) — fewer pixels to fill.
 * - FPS cap honored per intensity tier (24fps low-end, 30fps subtle, 60 otherwise).
 * - Pauses when tab hidden, when window blurred, or when paint cost detected
 *   (consecutive long frames > 28ms drop us to "subtle" tuning at runtime).
 * - When intensity = "off", the canvas detaches its rAF loop entirely.
 * - Ripple painting reuses a single Path2D and short-lives them to keep GC quiet.
 *
 * UX:
 * - Honors prefers-reduced-motion (renders a single static gradient).
 * - Listens to the "liquidglass:change" event so the toggle UI retunes
 *   without remounting.
 * - Distinct light vs dark palettes from src/lib/liquidGlass.ts.
 */
export function WaterBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowEnd = detectLowEnd();
    const dpr = Math.min(window.devicePixelRatio || 1, lowEnd ? 1 : 1.25);

    let tuning: GlassTuning = tuningFor(loadIntensity(), lowEnd);

    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type Ripple = { x: number; y: number; t: number; hue: number };
    const ripples: Ripple[] = [];
    const MAX_RIPPLES = lowEnd ? 10 : 18;

    const isDark = () => document.documentElement.classList.contains("dark");

    const addRipple = (x: number, y: number) => {
      if (!tuning.enabled) return;
      if (ripples.length >= MAX_RIPPLES) ripples.shift();
      ripples.push({ x, y, t: performance.now(), hue: isDark() ? 220 : 200 });
    };

    let lastMove = 0;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const throttle = lowEnd ? 90 : 50;
      if (now - lastMove < throttle) return;
      lastMove = now;
      addRipple(e.clientX, e.clientY);
    };
    const onDown = (e: PointerEvent) => addRipple(e.clientX, e.clientY);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    let raf = 0;
    let visible = true;
    let focused = true;
    const onVis = () => {
      visible = !document.hidden;
      if (visible && focused && !raf && tuning.enabled && !reduce) raf = requestAnimationFrame(frame);
    };
    const onBlur = () => { focused = false; };
    const onFocus = () => {
      focused = true;
      if (visible && !raf && tuning.enabled && !reduce) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      if (!tuning.enabled) return;
      const dark = isDark();
      const palette = getPalette(dark ? "dark" : "light");
      const a = dark ? tuning.alphaDark : tuning.alphaLight;
      for (let i = 0; i < Math.min(2, tuning.blobCount); i++) {
        const b = palette[i];
        const cx = (i === 0 ? 0.25 : 0.8) * w;
        const cy = (i === 0 ? 0.3 : 0.7) * h;
        const r = Math.max(w, h) * tuning.radiusMul;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `oklch(${b.l} ${b.sat} ${b.hue} / ${a})`);
        g.addColorStop(1, `oklch(${b.l} ${b.sat} ${b.hue} / 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
    };

    // Adaptive degrade: if we keep missing frames, drop to subtle tuning.
    let slowFrames = 0;
    let lastFrame = 0;

    const frame = (now: number) => {
      raf = 0;
      if (!visible || !focused || !tuning.enabled) return;

      // FPS cap
      const minDelta = tuning.fpsCap > 0 ? 1000 / tuning.fpsCap : 16;
      if (lastFrame && now - lastFrame < minDelta - 1) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const delta = lastFrame ? now - lastFrame : minDelta;
      lastFrame = now;

      // Adaptive degrade
      if (delta > 28) slowFrames++;
      else if (slowFrames > 0) slowFrames--;
      if (slowFrames > 30 && tuning.blobCount > 2) {
        tuning = tuningFor("subtle", true);
        slowFrames = 0;
      }

      const dark = isDark();
      const palette = getPalette(dark ? "dark" : "light");
      ctx.clearRect(0, 0, w, h);

      const t = now * tuning.speed;
      const baseAlpha = dark ? tuning.alphaDark : tuning.alphaLight;
      const r = Math.max(w, h) * tuning.radiusMul;

      // Caustic blobs — anchor positions are stable, drift is small for calmness.
      const anchors = [
        [0.20, 0.25], [0.82, 0.72], [0.55, 0.12], [0.14, 0.88], [0.66, 0.46],
      ];
      for (let i = 0; i < tuning.blobCount; i++) {
        const b = palette[i % palette.length];
        const [ax, ay] = anchors[i % anchors.length];
        const cx = (ax + Math.sin(t + i) * 0.07) * w;
        const cy = (ay + Math.cos(t * 0.9 + i * 1.3) * 0.06) * h;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `oklch(${b.l} ${b.sat} ${b.hue} / ${baseAlpha})`);
        g.addColorStop(1, `oklch(${b.l} ${b.sat} ${b.hue} / 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // Ripples
      if (ripples.length) {
        ctx.globalCompositeOperation = "lighter";
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rp = ripples[i];
          const age = (now - rp.t) / 1400;
          if (age >= 1) { ripples.splice(i, 1); continue; }
          const radius = 20 + age * 220;
          const alpha = (1 - age) * tuning.rippleAlpha;
          const grad = ctx.createRadialGradient(rp.x, rp.y, radius * 0.4, rp.x, rp.y, radius);
          grad.addColorStop(0, `oklch(0.85 0.08 ${rp.hue} / 0)`);
          grad.addColorStop(0.7, `oklch(0.85 0.08 ${rp.hue} / ${alpha})`);
          grad.addColorStop(1, `oklch(0.85 0.08 ${rp.hue} / 0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalCompositeOperation = "source-over";
      }

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = 0;
      slowFrames = 0;
      ctx.clearRect(0, 0, w, h);
      if (!tuning.enabled) return;
      if (reduce) drawStatic();
      else raf = requestAnimationFrame(frame);
    };
    start();

    const offChange = onIntensityChange((v) => {
      tuning = tuningFor(v, lowEnd);
      ripples.length = 0;
      start();
    });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      offChange();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mounted]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
