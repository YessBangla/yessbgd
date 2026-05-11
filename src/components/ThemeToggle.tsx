import { useEffect, useState } from "react";
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

export function ThemeToggle({ variant = "pill", className = "" }: ThemeToggleProps) {
  const [mode, setMode] = useState<Mode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = readInitial();
    setMode(initial);
    apply(initial);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    try { localStorage.setItem(STORE_KEY, next); } catch { /* quota */ }
    apply(next);
  };

  const isDark = mode === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        aria-pressed={isDark}
        suppressHydrationWarning
        className={`grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-background/60 text-foreground/80 backdrop-blur transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
      >
        {mounted && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={isDark}
      suppressHydrationWarning
      className={`inline-flex h-9 items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 text-xs font-semibold text-foreground/80 backdrop-blur transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      {mounted && isDark ? <Sun className="h-3.5 w-3.5" aria-hidden /> : <Moon className="h-3.5 w-3.5" aria-hidden />}
      <span className="hidden md:inline">{mounted && isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
