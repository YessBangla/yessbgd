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
                  className="group rounded-2xl glass-card p-6 transition-all hover:-translate-y-1 hover:shadow-glow"
                >
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${v.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {v.category}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
