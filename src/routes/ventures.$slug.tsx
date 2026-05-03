import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, CheckCircle2, Target, Lightbulb, Layers, Cpu } from "lucide-react";
import { PageHero } from "@/components/PageHero";
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
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-tight py-32 text-center">
      <h1 className="font-display text-3xl font-bold">Venture not found</h1>
      <Link to="/projects" className="mt-6 inline-flex items-center gap-1.5 text-primary">
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
      <PageHero eyebrow={v.category} title={v.tagline} subtitle={v.desc} />

      <section className="py-16">
        <div className="container-tight grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="glass-card rounded-3xl p-8 md:p-10">
              <div className={`inline-grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${v.color} text-primary-foreground shadow-elegant`}>
                <Icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h2 className="mt-6 font-display text-3xl font-bold">{v.title}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{v.desc}</p>

              <h3 className="mt-8 font-display text-lg font-semibold">What we offer</h3>
              <ul className="mt-4 space-y-3">
                {v.highlights.map((h: string) => (
                  <li key={h} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground/80">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Services</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {v.services.map((s: string) => (
                    <span key={s} className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-3xl p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Who it's for</p>
                <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{v.audience}</p>
              </div>

              <div className="glass-card rounded-3xl p-7">
                <p className="font-display text-lg font-semibold">Interested in {v.title}?</p>
                <p className="mt-2 text-sm text-muted-foreground">Talk to our team to learn how we can support your goals.</p>
                <Link
                  to="/contact"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-all hover:-translate-y-0.5"
                >
                  Get in touch <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-4">
        <div className="container-tight">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cs.results.map((r) => (
              <div key={r.label} className="rounded-2xl glass-card p-5 text-center">
                <div className="font-display text-3xl font-semibold text-primary">{r.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-tight grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl glass-card p-8">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">The challenge</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cs.challenge}</p>
          </div>
          <div className="rounded-3xl glass-card p-8">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Lightbulb className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">Our solution</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cs.solution}</p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container-tight">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Layers className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Delivery phases</h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cs.phases.map((p, i) => (
              <div key={p.title} className="relative rounded-2xl glass-card p-6">
                <span className="absolute right-4 top-4 text-xs font-semibold text-primary/60">0{i + 1}</span>
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container-tight">
          <div className="rounded-3xl glass-card p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Cpu className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-semibold">Tech stack</h2>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {cs.techStack.map((t) => (
                <span key={t} className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-tight">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold">Explore other ventures</h2>
            <Link to="/projects" className="text-sm font-semibold text-primary inline-flex items-center gap-1.5">
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
                  className="group glass-card rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-elegant"
                >
                  <div className={`inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${o.color} text-primary-foreground`}>
                    <OIcon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{o.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-wider text-primary">{o.category}</p>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{o.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
