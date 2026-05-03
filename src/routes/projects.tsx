import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ventures } from "@/data/ventures";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Our Ventures — YESS Bangla" },
      { name: "description", content: "Explore the ventures of Yess Bangla Private Limited — Yess Soft, Akash TV, Akash OTT, The Daily Akash, Yess Organic Haat, Yess Service, Yess Host, Yess Event, Yess Model, Yess Food and Yess All in One Solution." },
      { property: "og:title", content: "Our Ventures — YESS Bangla" },
      { property: "og:description", content: "A diversified portfolio of technology, media, lifestyle and service ventures." },
    ],
  }),
  component: Projects,
});

function Projects() {
  return (
    <>
      <PageHero
        eyebrow="Our ventures"
        title="A diversified portfolio building Bangladesh's future."
        subtitle="From technology and media to lifestyle and services — Yess Bangla Private Limited operates a growing family of ventures committed to quality, innovation and impact."
      />

      <section className="py-20">
        <div className="container-tight grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ventures.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.slug} delay={i * 0.05}>
                <Link
                  to="/ventures/$slug"
                  params={{ slug: v.slug }}
                  className="group block h-full overflow-hidden rounded-2xl glass-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-elegant"
                >
                  <div className={`relative h-40 bg-gradient-to-br ${v.color}`}>
                    <div className="absolute inset-0 grid-pattern opacity-30" />
                    <div className="absolute inset-0 grid place-items-center">
                      <Icon className="h-14 w-14 text-primary-foreground/95" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">{v.category}</p>
                    <h3 className="mt-2 font-display text-xl font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{v.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                      Learn more <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
        <div className="container-tight mt-16 text-center">
          <p className="text-muted-foreground">Eleven ventures. One vision — to deliver world-class quality across every industry we touch.</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-all hover:-translate-y-0.5">
            Partner with us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
