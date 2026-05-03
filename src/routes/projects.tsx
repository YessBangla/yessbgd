import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Code2, Tv, PlayCircle, Newspaper, Leaf, Wrench, Server, CalendarHeart, Sparkles, UtensilsCrossed, LayoutGrid } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

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

const ventures = [
  { title: "Yess Soft", category: "Software & IT Solutions", desc: "Custom software, web & mobile applications, ERP and enterprise systems built for modern businesses.", icon: Code2, color: "from-primary to-primary-glow" },
  { title: "Akash TV", category: "Satellite Television", desc: "A modern broadcast channel delivering news, entertainment and cultural programs across the nation.", icon: Tv, color: "from-accent to-primary" },
  { title: "Akash OTT", category: "Streaming Platform", desc: "On-demand streaming with films, originals, live TV and exclusive premieres on every screen.", icon: PlayCircle, color: "from-primary-glow to-accent" },
  { title: "The Daily Akash", category: "Digital Newspaper", desc: "Trusted journalism — breaking news, in-depth analysis and stories that matter, every day.", icon: Newspaper, color: "from-primary to-accent" },
  { title: "Yess Organic Haat", category: "Organic Marketplace", desc: "Farm-to-table organic food and lifestyle products sourced directly from verified local producers.", icon: Leaf, color: "from-accent to-primary-glow" },
  { title: "Yess Service", category: "Home & Professional Services", desc: "On-demand professional services — from home maintenance to expert consultations, just a tap away.", icon: Wrench, color: "from-primary to-primary-glow" },
  { title: "Yess Host", category: "Hosting & Cloud", desc: "Reliable web hosting, domains, cloud servers and managed infrastructure for businesses of all sizes.", icon: Server, color: "from-primary-glow to-primary" },
  { title: "Yess Event", category: "Event Management", desc: "End-to-end event planning, production and management for corporate, cultural and private occasions.", icon: CalendarHeart, color: "from-accent to-primary" },
  { title: "Yess Model", category: "Modeling & Talent Agency", desc: "Discovering and nurturing fresh talent — connecting models and creators with leading brands.", icon: Sparkles, color: "from-primary to-accent" },
  { title: "Yess Food", category: "Food & Beverage", desc: "Authentic, quality-driven food experiences — from cloud kitchens to signature dining concepts.", icon: UtensilsCrossed, color: "from-primary-glow to-accent" },
  { title: "Yess All in One Solution", category: "Integrated Business Solutions", desc: "A unified platform bringing together every YESS service for seamless business and lifestyle needs.", icon: LayoutGrid, color: "from-primary to-primary-glow" },
];

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
              <Reveal key={v.title} delay={i * 0.05}>
                <article className="group h-full overflow-hidden rounded-2xl glass-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-elegant">
                  <div className={`relative h-40 bg-gradient-to-br ${v.color}`}>
                    <div className="absolute inset-0 grid-pattern opacity-30" />
                    <div className="absolute inset-0 grid place-items-center">
                      <Icon className="h-14 w-14 text-primary-foreground/95" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">{v.category}</p>
                    <h3 className="mt-2 font-display text-xl font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                    <Link to="/contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                      Learn more <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
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
