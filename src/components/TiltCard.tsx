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
};

/**
 * Subtle pointer-tracking 3D tilt wrapper.
 * - Honors prefers-reduced-motion (renders static).
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
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // Reduce intensity on touch so the effect feels subtle and predictable.
    const touchMax = max * 0.6;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let curScale = 1;
    let targetScale = 1;
    let active = false;

    const apply = () => {
      // Lerp toward target for smooth motion.
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      curScale += (targetScale - curScale) * 0.12;
      el.style.transform = `perspective(${perspective}px) rotateX(${curY.toFixed(
        2
      )}deg) rotateY(${curX.toFixed(2)}deg) scale(${curScale.toFixed(3)})`;
      if (
        active ||
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
      targetX = (px - 0.5) * 2 * m;
      targetY = -(py - 0.5) * 2 * m;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" && !active) return;
      setFromPoint(e.clientX, e.clientY, e.pointerType === "touch");
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // touch uses pointerdown
      active = true;
      targetScale = scale;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const reset = () => {
      active = false;
      targetX = 0;
      targetY = 0;
      targetScale = 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      // Do NOT preventDefault or setPointerCapture — preserves vertical scroll.
      active = true;
      targetScale = scale;
      setFromPoint(e.clientX, e.clientY, true);
    };

    el.style.transformStyle = "preserve-3d";
    el.style.willChange = "transform";
    // Allow the browser to handle vertical scrolling natively.
    el.style.touchAction = "pan-y";

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", reset);
    el.addEventListener("pointercancel", reset);

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", reset);
      el.removeEventListener("pointercancel", reset);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
      el.style.willChange = "";
      el.style.touchAction = "";
    };
  }, [max, perspective, scale]);

  return (
    <div ref={ref} className={className} style={{ transition: "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)" }}>
      {children}
    </div>
  );
}
