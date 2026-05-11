import { useEffect, useId, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Mode = "light" | "dark";
const STORE_KEY = "yess-theme-preview-v1";

function apply(mode: Mode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.classList.toggle("light", mode === "light");
}

function readInitial(): Mode {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    if (saved === "system" || !saved) {
      return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
  } catch { /* ignore */ }
  return "light";
}

interface ThemeToggleProps {
  variant?: "pill" | "compact";
  className?: string;
}

const LONG_PRESS_MS = 450;

export function ThemeToggle({ variant = "pill", className = "" }: ThemeToggleProps) {
  const [mode, setMode] = useState<Mode>("light");
  const [mounted, setMounted] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const tipId = useId();
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const initial = readInitial();
    setMode(initial);
    apply(initial);
    setMounted(true);
  }, []);

  // Hide tooltip on Escape, on scroll, on touch swipe, and on outside pointer activity.
  useEffect(() => {
    if (!tipOpen) return;
    const close = () => setTipOpen(false);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, { passive: true, capture: true });
    window.addEventListener("touchmove", close, { passive: true });
    window.addEventListener("wheel", close, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("touchmove", close);
      window.removeEventListener("wheel", close);
    };
  }, [tipOpen]);

  const isDark = mode === "dark";
  const currentLabel = isDark ? "Dark mode" : "Light mode";
  const switchLabel = isDark ? "Switch to light mode" : "Switch to dark mode";
  const tipText = mounted
    ? `${currentLabel} · ${switchLabel}`
    : "Theme";

  const toggle = () => {
    const next: Mode = isDark ? "light" : "dark";
    setMode(next);
    try { localStorage.setItem(STORE_KEY, next); } catch { /* quota */ }
    apply(next);
  };

  const clearLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Pointer handlers — desktop hover + mobile long-press both reveal the tooltip
  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setTipOpen(true);
  };
  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setTipOpen(false);
    clearLongPress();
  };
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") {
      clearLongPress();
      longPressTimer.current = setTimeout(() => setTipOpen(true), LONG_PRESS_MS);
    }
  };
  const handlePointerUp = () => clearLongPress();
  const handlePointerCancel = () => { clearLongPress(); setTipOpen(false); };

  const baseBtn =
    "relative inline-flex items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground/85 backdrop-blur transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  const sizeCls = variant === "compact"
    ? "h-9 w-9"
    : "h-9 gap-1.5 px-3 text-xs font-semibold";

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-pressed={isDark}
        aria-label={switchLabel}
        aria-describedby={tipId}
        title={tipText}
        suppressHydrationWarning
        onClick={toggle}
        onFocus={() => setTipOpen(true)}
        onBlur={() => setTipOpen(false)}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className={`${baseBtn} ${sizeCls}`}
      >
        {mounted && isDark ? (
          <Sun className={variant === "compact" ? "h-4 w-4" : "h-3.5 w-3.5"} aria-hidden />
        ) : (
          <Moon className={variant === "compact" ? "h-4 w-4" : "h-3.5 w-3.5"} aria-hidden />
        )}
        {variant === "pill" && (
          <span className="hidden md:inline">{mounted && isDark ? "Light" : "Dark"}</span>
        )}
        <span className="sr-only">
          {mounted ? `Current theme: ${currentLabel}. Activate to ${switchLabel.toLowerCase()}.` : "Theme toggle"}
        </span>
      </button>

      {/* Tooltip — shown on hover, focus, or long-press. role=tooltip, linked via aria-describedby */}
      <span
        id={tipId}
        role="tooltip"
        aria-hidden={!tipOpen}
        className={`pointer-events-none absolute right-0 top-full z-[60] mt-3 max-w-[min(80vw,18rem)] truncate whitespace-nowrap rounded-md border border-border/70 bg-foreground px-2.5 py-1.5 text-[11px] font-medium text-background shadow-elegant transition-opacity duration-150 sm:mt-2 ${tipOpen ? "opacity-100" : "opacity-0"}`}
      >
        {tipText}
      </span>
    </span>
  );
}
