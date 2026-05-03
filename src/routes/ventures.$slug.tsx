import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { getVenture, ventures } from "@/data/ventures";

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
