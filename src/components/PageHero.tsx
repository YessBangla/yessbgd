import { type ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
      <div className="orb h-[420px] w-[420px] -top-32 -left-24" style={{ background: "oklch(0.82 0.14 188 / 0.5)" }} />
      <div className="orb h-[360px] w-[360px] -top-20 right-0" style={{ background: "oklch(0.85 0.16 28 / 0.4)", animationDelay: "-8s" }} />
      <div className="container-tight relative max-w-3xl text-center">
        {eyebrow && (
          <p className="hero-fade text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1
          className="hero-fade mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl"
          style={{ animationDelay: "60ms" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="hero-fade mt-5 text-muted-foreground"
            style={{ animationDelay: "120ms" }}
          >
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
