import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Target,
  Lightbulb,
  Layers,
  Cpu,
  Sparkles,
  CalendarDays,
  Globe2,
  Quote,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { getVenture, getVentureCase, ventures } from "@/data/ventures";

export const Route = createFileRoute("/ventures/$slug")({
  loader: ({ params }) => {
    const v = getVenture(params.slug);
    if (!v) throw notFound();
    return { venture: v };
  },
  head: ({ loaderData }) => {
    const v = loaderData?.venture;
    if (!v) return { meta: [{ title: "Venture — YESS Bangla" }] };
    return {
      meta: [
        { title: `${v.title} — YESS Bangla` },
        { name: "description", content: v.desc },
        { property: "og:title", content: `${v.title} — YESS Bangla` },
        { property: "og:description", content: v.desc },
        { property: "og:image", content: v.image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: v.image },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-tight py-32 text-center">
      <h1 className="font-display text-3xl font-bold">Venture not found</h1>
      <Link to="/ventures" className="mt-6 inline-flex items-center gap-1.5 text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to all ventures
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-tight py-32 text-center">
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: VenturePage,
});

function VenturePage() {
  const { venture: v } = Route.useLoaderData();
  const Icon = v.icon;
  const cs = getVentureCase(v);
  const others = ventures.filter((x) => x.slug !== v.slug).slice(0, 3);

  return (
    <>
      {/* Cinematic hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={v.image}
            alt={`${v.title} — ${v.category}`}
            width={1536}
            height={864}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>

        <div className="container-tight relative pt-24 pb-20 sm:pt-28 sm:pb-28">
          <Link
            to="/ventures"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All ventures
          </Link>

          <div className="mt-8 flex items-center gap-3">
            <span
              className={`inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${v.color} text-primary-foreground shadow-elegant`}
            >
              <Icon className="h-6 w-6" strokeWidth={1.5} />
            </span>
            <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur">
              {v.category}
            </span>
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {v.title}
          </h1>
          <p className="mt-4 max-w-2xl font-display text-lg text-foreground/85 sm:text-xl">
            {v.tagline}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {v.longDesc}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              Work with {v.title} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/ventures"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 text-sm font-semibold backdrop-blur hover:bg-background"
            >
              Explore portfolio
            </Link>
          </div>

          {(v.founded || v.reach) && (
            <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
              {v.founded && (
                <FactPill icon={CalendarDays} label="Founded" value={v.founded} />
              )}
              {v.reach && (
                <FactPill icon={Globe2} label="Reach" value={v.reach} />
              )}
              <FactPill icon={Sparkles} label="Part of" value="YESS Bangla" />
            </dl>
          )}
        </div>
      </section>

      {/* Highlights + sidebar */}
      <section className="py-16">
        <div className="container-tight grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="glass-card rounded-3xl p-8 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                What we offer
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold">
                Built around quality, every step of the way.
              </h2>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {v.highlights.map((h: string) => (
                  <li
                    key={h}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-background/40 p-4 text-sm"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground/85">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Services
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {v.services.map((s: string) => (
                    <span
                      key={s}
                      className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-3xl p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Who it's for
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">{v.audience}</p>
              </div>

              <div
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${v.color} p-7 text-primary-foreground shadow-elegant`}
              >
                <Quote className="absolute right-4 top-4 h-8 w-8 opacity-20" />
                <p className="font-display text-lg font-semibold leading-snug">
                  Interested in {v.title}?
                </p>
                <p className="mt-2 text-sm opacity-90">
                  Talk to our team to learn how we can support your goals.
                </p>
                <Link
                  to="/contact"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-background/95 px-5 py-2.5 text-sm font-semibold text-foreground shadow transition-transform hover:-translate-y-0.5"
                >
                  Get in touch <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Signature features */}
      {v.features.length > 0 && (
        <section className="py-12">
          <div className="container-tight">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Signature features
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
              Why partners choose {v.title}.
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {v.features.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.05}>
                  <article className="group h-full rounded-3xl border border-border bg-secondary/20 p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-secondary/40">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                      <span className="font-mono text-sm font-bold">{i + 1}</span>
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results metrics */}
      <section className="py-12">
        <div className="container-tight">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cs.results.map((r) => (
              <div
                key={r.label}
                className="rounded-2xl border border-border bg-gradient-to-br from-background to-secondary/40 p-6 text-center shadow-sm"
              >
                <div className="font-display text-3xl font-bold text-primary sm:text-4xl">
                  {r.value}
                </div>
                <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {r.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge / solution */}
      <section className="py-12">
        <div className="container-tight grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-secondary/20 p-8">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-destructive/15 text-destructive">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">The challenge</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cs.challenge}</p>
          </div>
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Lightbulb className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">Our solution</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cs.solution}</p>
          </div>
        </div>
      </section>

      {/* Delivery phases */}
      <section className="py-12">
        <div className="container-tight">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Layers className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Delivery phases</h2>
          </div>
          <ol className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cs.phases.map((p, i) => (
              <li
                key={p.title}
                className="relative rounded-2xl border border-border bg-background/60 p-6 backdrop-blur"
              >
                <span className="absolute right-4 top-4 font-mono text-xs font-bold text-primary/60">
                  0{i + 1}
                </span>
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Tech / capabilities stack */}
      <section className="py-12">
        <div className="container-tight">
          <div className="rounded-3xl border border-border bg-secondary/20 p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Cpu className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-semibold">Capabilities & stack</h2>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {cs.techStack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container-tight">
          <div
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${v.color} p-10 text-center text-primary-foreground shadow-elegant md:p-14`}
          >
            <Sparkles className="mx-auto h-8 w-8 opacity-80" />
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              Ready to build with {v.title}?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm opacity-90 sm:text-base">
              Tell us about your goals and we'll come back within one business day with a clear next
              step.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-background/95 px-6 py-3 text-sm font-semibold text-foreground shadow"
              >
                Start a conversation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/ventures"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-semibold"
              >
                See all ventures
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Other ventures */}
      <section className="pb-20">
        <div className="container-tight">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold">Explore other ventures</h2>
            <Link
              to="/ventures"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {others.map((o) => {
              const OIcon = o.icon;
              return (
                <Link
                  key={o.slug}
                  to="/ventures/$slug"
                  params={{ slug: o.slug }}
                  className="group overflow-hidden rounded-2xl border border-border bg-background/60 transition-all hover:-translate-y-1 hover:shadow-elegant"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={o.image}
                      alt={o.title}
                      width={1536}
                      height={864}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent" />
                    <span
                      className={`absolute left-4 top-4 inline-grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${o.color} text-primary-foreground shadow`}
                    >
                      <OIcon className="h-4.5 w-4.5" strokeWidth={1.5} />
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {o.category}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold">{o.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{o.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function FactPill({
  icon: I,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-3 backdrop-blur">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <I className="h-3.5 w-3.5" /> {label}
      </div>
      <p className="mt-1 font-display text-sm font-semibold">{value}</p>
    </div>
  );
}
