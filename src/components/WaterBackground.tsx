import { useEffect, useRef, useState } from "react";

/**
 * Lightweight water simulation background.
 * - Fixed, full-viewport canvas behind all content (z-index: -10).
 * - Animated caustic gradients + interactive ripples on pointer/touch move.
 * - GPU-friendly: 2D canvas, capped DPR, paused when tab hidden.
 * - Honors prefers-reduced-motion (renders a static gradient).
 * - pointer-events: none — never blocks UI.
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
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

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

    type Ripple = { x: number; y: number; t: number; r: number; hue: number };
    const ripples: Ripple[] = [];
    const MAX_RIPPLES = 24;

    const isDark = () => document.documentElement.classList.contains("dark");

    const addRipple = (x: number, y: number) => {
      if (ripples.length >= MAX_RIPPLES) ripples.shift();
      ripples.push({ x, y, t: performance.now(), r: 0, hue: Math.random() < 0.5 ? 188 : 28 });
    };

    let lastMove = 0;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastMove < 40) return; // throttle
      lastMove = now;
      addRipple(e.clientX, e.clientY);
    };
    const onDown = (e: PointerEvent) => addRipple(e.clientX, e.clientY);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    let raf = 0;
    let visible = true;
    const onVis = () => {
      visible = !document.hidden;
      if (visible && !raf && !reduce) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      const dark = isDark();
      const a = dark ? 0.18 : 0.22;
      const g1 = ctx.createRadialGradient(w * 0.2, h * 0.3, 0, w * 0.2, h * 0.3, Math.max(w, h) * 0.6);
      g1.addColorStop(0, `oklch(0.78 0.12 188 / ${a})`);
      g1.addColorStop(1, "oklch(0.78 0.12 188 / 0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);
      const g2 = ctx.createRadialGradient(w * 0.85, h * 0.7, 0, w * 0.85, h * 0.7, Math.max(w, h) * 0.55);
      g2.addColorStop(0, `oklch(0.8 0.16 28 / ${a * 0.85})`);
      g2.addColorStop(1, "oklch(0.8 0.16 28 / 0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dark = isDark();
      ctx.clearRect(0, 0, w, h);

      // Sophisticated, low-saturation liquid-glass palette — pearl, slate, champagne.
      const t = now * 0.0004;
      const blobs = [
        { x: 0.20 + Math.sin(t) * 0.08, y: 0.25 + Math.cos(t * 0.9) * 0.06, hue: 230, sat: 0.04, l: 0.92 },
        { x: 0.82 + Math.cos(t * 0.7) * 0.07, y: 0.70 + Math.sin(t * 1.1) * 0.06, hue: 70,  sat: 0.05, l: 0.93 },
        { x: 0.55 + Math.sin(t * 1.2) * 0.10, y: 0.10 + Math.cos(t) * 0.05,    hue: 250, sat: 0.03, l: 0.94 },
        { x: 0.12 + Math.cos(t * 0.6) * 0.06, y: 0.90 + Math.sin(t * 0.8) * 0.05, hue: 210, sat: 0.04, l: 0.91 },
      ];
      const baseAlpha = dark ? 0.22 : 0.30;
      for (const b of blobs) {
        const cx = b.x * w;
        const cy = b.y * h;
        const r = Math.max(w, h) * 0.6;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `oklch(${b.l} ${b.sat} ${b.hue} / ${baseAlpha})`);
        g.addColorStop(1, `oklch(${b.l} ${b.sat} ${b.hue} / 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // Ripples
      ctx.globalCompositeOperation = "lighter";
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        const age = (now - rp.t) / 1400; // 0..1 over 1.4s
        if (age >= 1) {
          ripples.splice(i, 1);
          continue;
        }
        const radius = 20 + age * 220;
        const alpha = (1 - age) * (dark ? 0.18 : 0.28);
        const grad = ctx.createRadialGradient(rp.x, rp.y, radius * 0.4, rp.x, rp.y, radius);
        grad.addColorStop(0, `oklch(0.85 0.14 ${rp.hue} / 0)`);
        grad.addColorStop(0.7, `oklch(0.85 0.14 ${rp.hue} / ${alpha})`);
        grad.addColorStop(1, `oklch(0.85 0.14 ${rp.hue} / 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(frame);
    };

    if (reduce) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVis);
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
