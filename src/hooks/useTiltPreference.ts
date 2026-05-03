import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "yb:tilt-enabled";

/**
 * Persisted user preference for the hero 3D tilt interaction.
 * Defaults to enabled. Safe for SSR (returns default until mounted).
 */
export function useTiltPreference() {
  const [enabled, setEnabled] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "0") setEnabled(false);
      else if (raw === "1") setEnabled(true);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { enabled, toggle, hydrated };
}
