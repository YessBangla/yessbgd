import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — YESS Bangla" },
      { name: "description", content: "Recent projects delivered by YESS Bangla — innovation hubs, leadership programs, accelerators and marketing platforms." },
      { property: "og:title", content: "Projects — YESS Bangla" },
      { property: "og:description", content: "Selected client work and case studies." },
    ],
  }),
  component: Projects,
});

const projects = [
  { title: "Innovation Hub: Navigating the Future", category: "Financing Management", color: "from-primary to-primary-glow" },
  { title: "Leadership Excellence Initiative", category: "Inventory Tracking", color: "from-accent to-primary" },
  { title: "Startup Accelerator Program", category: "Business Strategy", color: "from-primary-glow to-accent" },
  { title: "Marketing Mastery Series", category: "Inventory Tracking", color: "from-primary to-accent" },
];

function Projects() {
  return (
    <>
      <section className="relative overflow-hidden py-24">
        <div className="container-tight max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our projects</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Recent client work that drove real outcomes.
          </h1>
          <p className="mt-5 text-muted-foreground">
            Discover a selection of engagements where strategy met execution — and our clients
            achieved measurable growth.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-tight grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <article key={p.title} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-elegant">
              <div className={`relative h-56 bg-gradient-to-br ${p.color}`}>
                <div className="absolute inset-0 grid-pattern opacity-30" />
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-display text-2xl font-bold text-primary-foreground/90 px-6 text-center">{p.title}</span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{p.category}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{p.title}</h3>
                <Link to="/contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                  View details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="container-tight mt-12 text-center">
          <p className="text-muted-foreground">We successfully cope with tasks of varying complexity and provide long-term guarantees.</p>
        </div>
      </section>
    </>
  );
}
