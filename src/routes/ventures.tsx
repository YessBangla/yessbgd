import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ventures } from "@/data/ventures";

export const Route = createFileRoute("/ventures")({
  head: () => ({
    meta: [
      { title: "Our Ventures — YESS Bangla" },
      { name: "description", content: "Explore the YESS Bangla family of ventures across software, media, agriculture, hospitality and more." },
      { property: "og:title", content: "Our Ventures — YESS Bangla" },
      { property: "og:description", content: "A portfolio of ventures building Bangladesh's next-generation companies." },
    ],
  }),
  component: VenturesPage,
});

function VenturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Our Ventures"
        subtitle="A growing family of companies — each solving a meaningful problem in its industry."
      />
      <section className="pb-24">
        <div className="container-tight">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ventures.map((v) => {
              const Icon = v.icon;
              return (
                <Link
                  key={v.slug}
                  to="/ventures/$slug"
                  params={{ slug: v.slug }}
                  className="group overflow-hidden rounded-2xl border border-border bg-background/60 transition-all hover:-translate-y-1 hover:shadow-glow"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={v.image}
                      alt={`${v.title} — ${v.category}`}
                      width={1536}
                      height={864}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
                    <span
                      className={`absolute left-4 top-4 inline-grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${v.color} text-primary-foreground shadow-elegant`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <span className="absolute right-4 top-4 rounded-full border border-border bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/80 backdrop-blur">
                      {v.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{v.tagline}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
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
