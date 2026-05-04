import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

/**
 * Editorial section header — single source of truth for eyebrow + h2 + lede
 * across the home page. Keeps visual hierarchy consistent across all sections.
 *
 * Variants:
 *  - align="center" (default) — for full-width feature sections
 *  - align="left"             — for two-column / asymmetric sections
 *
 * Tokens:
 *  - eyebrow uses --primary, uppercase tracking [0.2em], 11–12px
 *  - h2 uses font-display, 600 weight, fluid clamp from base styles
 *  - lede uses --muted-foreground, 14–16px, max-w-2xl
 */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "center",
  className = "",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "center" | "left";
  className?: string;
  children?: ReactNode;
}) {
  const alignCls =
    align === "center"
      ? "mx-auto max-w-2xl text-center"
      : "max-w-2xl text-left";
  return (
    <Reveal className={`${alignCls} ${className}`}>
      <div
        className={`flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span aria-hidden className="h-px w-6 bg-primary/40" />
        {eyebrow}
        <span aria-hidden className="h-px w-6 bg-primary/40" />
      </div>
      <h2 className="mt-3 font-display font-semibold tracking-tight text-balance">
        {title}
      </h2>
      {lede && (
        <p
          className={`mt-3 text-muted-foreground ${
            align === "center" ? "mx-auto max-w-xl" : "max-w-xl"
          }`}
        >
          {lede}
        </p>
      )}
      {children}
    </Reveal>
  );
}

/**
 * Hairline gradient divider — subtle visual transition between sections.
 * Render BETWEEN sections (not inside) so it doesn't affect section padding.
 * Width-constrained via container-tight so it never stretches edge-to-edge.
 */
export function SectionDivider() {
  return (
    <div aria-hidden className="container-tight">
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
