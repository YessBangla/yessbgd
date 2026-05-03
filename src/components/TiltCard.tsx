import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees on each axis. */
  max?: number;
  /** Perspective distance in px. Smaller = stronger 3D. */
  perspective?: number;
  /** Scale on hover. */
  scale?: number;
  /** When false, tilt is disabled and the card renders static. */
  enabled?: boolean;
};

/**
 * Subtle pointer-tracking 3D tilt wrapper.
 * - Honors prefers-reduced-motion (renders static).
 * - Can be disabled via `enabled` prop (user preference).
 * - Pointer events only — touch scrolling is preserved (no preventDefault).
 * - GPU-friendly: writes transforms inside rAF, will-change hint.
 * - No layout shift: only transforms, no size change.
 */
export function TiltCard({
  children,
  className,
  max = 8,
  perspective = 1100,
  scale = 1.015,
  enabled = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) {
      el.style.transform = "";
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // Reduce intensity on touch so the effect feels subtle and predictable.
    const touchMax = max * 0.6;
    const clamp = (v: number, m: number) => (v > m ? m : v < -m ? -m : v);

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let curScale = 1;
    let targetScale = 1;
    let active = false;
    // Inertia state (used after touch release)
    let inertia = false;
    let velX = 0; // deg per frame on rotateY
    let velY = 0; // deg per frame on rotateX
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;

    const apply = () => {
      const limit = active && coarse ? touchMax : max;
      if (inertia) {
        // Spring-back with damped velocity → eases to 0,0.
        const spring = 0.08; // pull toward center
        const damping = 0.88; // velocity decay
        velX = velX * damping + (0 - curX) * spring;
        velY = velY * damping + (0 - curY) * spring;
        curX = clamp(curX + velX, limit);
        curY = clamp(curY + velY, limit);
        curScale += (targetScale - curScale) * 0.12;
        if (
          Math.abs(velX) < 0.02 &&
          Math.abs(velY) < 0.02 &&
          Math.abs(curX) < 0.05 &&
          Math.abs(curY) < 0.05
        ) {
          inertia = false;
          curX = 0;
          curY = 0;
        }
      } else {
        // Lerp toward target for smooth motion.
        const ease = coarse ? 0.18 : 0.12;
        curX += (clamp(targetX, limit) - curX) * ease;
        curY += (clamp(targetY, limit) - curY) * ease;
        curScale += (targetScale - curScale) * 0.12;
      }
      el.style.transform = `perspective(${perspective}px) rotateX(${curY.toFixed(
        2
      )}deg) rotateY(${curX.toFixed(2)}deg) scale(${curScale.toFixed(3)})`;
      if (
        active ||
        inertia ||
        Math.abs(targetX - curX) > 0.05 ||
        Math.abs(targetY - curY) > 0.05 ||
        Math.abs(targetScale - curScale) > 0.001
      ) {
        raf = requestAnimationFrame(apply);
      } else {
        raf = 0;
      }
    };

    const setFromPoint = (clientX: number, clientY: number, isTouch: boolean) => {
      const rect = el.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;
      const m = isTouch ? touchMax : max;
      const nx = clamp((px - 0.5) * 2 * m, m);
      const ny = clamp(-(py - 0.5) * 2 * m, m);
      // Track velocity for inertia handoff on touch release.
      const now = performance.now();
      const dt = Math.max(8, now - lastT);
      // Convert delta to per-frame (~16ms) velocity.
      velX = ((nx - lastX) / dt) * 16;
      velY = ((ny - lastY) / dt) * 16;
      lastX = nx;
      lastY = ny;
      lastT = now;
      targetX = nx;
      targetY = ny;
      inertia = false;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" && !active) return;
      setFromPoint(e.clientX, e.clientY, e.pointerType === "touch");
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      active = true;
      targetScale = scale;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const releaseTouch = () => {
      active = false;
      targetScale = 1;
      // Hand off remaining velocity to inertia spring-back.
      const limit = touchMax;
      velX = clamp(velX, limit * 0.5);
      velY = clamp(velY, limit * 0.5);
      inertia = true;
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const releaseMouse = () => {
      active = false;
      targetX = 0;
      targetY = 0;
      targetScale = 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onPointerEnd = (e: PointerEvent) => {
      if (e.pointerType === "touch") releaseTouch();
      else releaseMouse();
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      releaseMouse();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      // Do NOT preventDefault or setPointerCapture — preserves vertical scroll.
      active = true;
      inertia = false;
      targetScale = scale;
      const rect = el.getBoundingClientRect();
      lastX = ((e.clientX - rect.left) / rect.width - 0.5) * 2 * touchMax;
      lastY = -((e.clientY - rect.top) / rect.height - 0.5) * 2 * touchMax;
      lastT = performance.now();
      velX = 0;
      velY = 0;
      setFromPoint(e.clientX, e.clientY, true);
    };

    el.style.transformStyle = "preserve-3d";
    el.style.willChange = "transform";
    el.style.touchAction = "pan-y";

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onPointerEnd);
    el.addEventListener("pointercancel", onPointerEnd);

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onPointerEnd);
      el.removeEventListener("pointercancel", onPointerEnd);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
      el.style.willChange = "";
      el.style.touchAction = "";
    };
  }, [max, perspective, scale, enabled]);

  return (
    <div ref={ref} className={className} style={{ transition: "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)" }}>
      {children}
    </div>
  );
}
