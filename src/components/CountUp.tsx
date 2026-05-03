import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  value: string;
  duration?: number;
  className?: string;
};

/**
 * Animated number counter that parses a string like "250+", "98%", "180K+"
 * and tweens the numeric portion. Honors prefers-reduced-motion.
 */
export function CountUp({ value, duration = 1600, className }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^([^\d-]*)(-?[\d.,]+)([a-zA-Z]*)(.*)$/);
  const prefix = match?.[1] ?? "";
  const numStr = match?.[2] ?? "";
  const unit = match?.[3] ?? "";
  const suffix = match?.[4] ?? "";

  const target = numStr ? parseFloat(numStr.replace(/,/g, "")) : NaN;
  const hasNumber = !Number.isNaN(target);
  const decimals = numStr.includes(".") ? (numStr.split(".")[1]?.length ?? 0) : 0;

  const [display, setDisplay] = useState<string>(() =>
    hasNumber && !reduce ? formatNumber(0, decimals) : numStr
  );
  const [started, setStarted] = useState(false);

  // Trigger when in view
  useEffect(() => {
    if (!hasNumber || reduce || started) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setStarted(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNumber, reduce, started]);

  // Run the tween
  useEffect(() => {
    if (!started || !hasNumber || reduce) return;
    let raf = 0;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const v = target * ease(t);
      setDisplay(formatNumber(v, decimals));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(formatNumber(target, decimals));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, hasNumber, reduce, target, duration, decimals]);

  if (!hasNumber || reduce) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {unit}
      {suffix}
    </span>
  );
}

function formatNumber(n: number, decimals: number): string {
  if (decimals > 0) return n.toFixed(decimals);
  return Math.round(n).toLocaleString("en-US");
}
