import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, MapPin, Clock, ArrowRight, Sparkles, Users, GraduationCap, Heart } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { openings } from "@/data/openings";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Join YESS Bangla" },
      { name: "description", content: "Build the future of business and technology in Bangladesh. Explore open roles at YESS Bangla Private Limited." },
      { property: "og:title", content: "Careers at YESS Bangla" },
      { property: "og:description", content: "Open roles in engineering, design, consulting and operations." },
    ],
  }),
  component: Careers,
});

const perks = [
  { icon: Heart, title: "Health & wellness", desc: "Comprehensive medical coverage for you and your family." },
  { icon: GraduationCap, title: "Learning budget", desc: "Annual stipend for courses, certifications and conferences." },
  { icon: Users, title: "Inclusive culture", desc: "A diverse, collaborative team that values every voice." },
  { icon: Sparkles, title: "Modern tooling", desc: "The best hardware and software to do your best work." },
];

function Careers() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build a career that builds Bangladesh."
        subtitle="Join a team of consultants, engineers and creators shaping the next decade of business and technology in South Asia."
      />

      <section className="py-20">
        <div className="container-tight">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why YESS Bangla</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              A workplace built for ambition.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {perks.map((p) => (
              <div key={p.title} className="rounded-2xl glass-card p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="container-tight">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Open positions</h2>
          <p className="mt-3 text-muted-foreground">We're hiring across multiple teams. Don't see your role? Send us your CV.</p>

          <div className="mt-10 divide-y divide-border overflow-hidden rounded-2xl glass-card">
            {openings.map((o) => (
              <div key={o.title} className="flex flex-col gap-4 p-6 transition-colors hover:bg-secondary/40 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
                    <Briefcase className="h-3.5 w-3.5" />
                    {o.dept}
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold">{o.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {o.location}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {o.type}</span>
                  </div>
                </div>
                <Link
                  to="/careers/$slug"
                  params={{ slug: o.slug }}
                  className="inline-flex items-center gap-2 self-start rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-primary hover:text-primary-foreground sm:self-center"
                >
                  Apply <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
