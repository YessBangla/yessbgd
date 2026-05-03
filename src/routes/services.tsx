import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Tv, Newspaper, LayoutGrid, Code2, Palette, ShoppingBag, ArrowRight,
  Search, PenTool, Rocket, LifeBuoy, CheckCircle2, Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — YESS Bangla" },
      { name: "description", content: "Explore the full range of business consulting, IT, OTT, web development and e-commerce services from YESS Bangla." },
      { property: "og:title", content: "Services — YESS Bangla" },
      { property: "og:description", content: "Consulting, IT, OTT, web and e-commerce — built for ambitious businesses." },
    ],
  }),
  component: Services,
});

const services = [
  {
    icon: Tv,
    title: "Akash OTT",
    desc: "Bangladesh's new digital streaming platform launched by YESS Bangla Communications under Akash TV.",
    bullets: ["Multi-device streaming (web, iOS, Android, TV)", "Subscription & ad-supported monetisation", "Content management & DRM"],
  },
  {
    icon: Newspaper,
    title: "Akash News",
    desc: "A modern Bangladeshi digital news platform delivering real-time stories with a robust editorial CMS.",
    bullets: ["Editorial workflow & approvals", "Real-time publishing", "SEO & social distribution"],
  },
  {
    icon: LayoutGrid,
    title: "YESS One Stop Solution",
    desc: "Centralised technology services, IT support and home services like cleaning and maintenance — under one trusted roof.",
    bullets: ["Managed IT services", "On-site technicians", "Vendor consolidation"],
  },
  {
    icon: Code2,
    title: "Web Development",
    desc: "Frontend (HTML, CSS, JavaScript) and backend (PHP, Laravel, Node) engineering with responsive design.",
    bullets: ["Custom web applications", "API & system integrations", "Performance & accessibility audits"],
  },
  {
    icon: Palette,
    title: "Web Design",
    desc: "Visually appealing, functional websites combining layout, colour, typography and user experience.",
    bullets: ["Brand-aligned UI design", "UX research & prototyping", "Design systems"],
  },
  {
    icon: ShoppingBag,
    title: "Yess Bangla Shop",
    desc: "End-to-end e-commerce — websites, mobile apps, secure payments and doorstep delivery for retailers across Bangladesh.",
    bullets: ["Storefront + mobile apps", "Local payment gateways", "Inventory & logistics"],
  },
];

const process = [
  { icon: Search, title: "Discover", desc: "Free discovery call to map your goals, constraints and success metrics." },
  { icon: PenTool, title: "Design", desc: "Architecture, UX flows and a written proposal with scope, timeline and price." },
  { icon: Rocket, title: "Deliver", desc: "Iterative sprints with weekly demos so you see progress, not promises." },
  { icon: LifeBuoy, title: "Support", desc: "Warranty period, monitoring and a long-term improvement retainer." },
];

function Services() {
  return (
    <>
      <PageHero
        eyebrow="What we offer"
        title="A full portfolio of business & IT services."
        subtitle="From media platforms to web engineering — we deliver the full spectrum of digital and consulting services your business needs."
      />

      <section className="py-20">
        <div className="container-tight grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <article
              key={s.title}
              className="group rounded-2xl glass-card p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
            >
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <ul className="mt-5 space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-foreground/85">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5"
              >
                Get a quote <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container-tight">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">How we work</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">A proven 4-step delivery model.</h2>
            <p className="mt-4 text-muted-foreground">Predictable outcomes, transparent communication and a partner that stays after launch.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <div key={p.title} className="relative rounded-2xl glass-card p-6">
                <span className="absolute right-4 top-4 text-xs font-semibold text-primary/60">0{i + 1}</span>
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-tight">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-10 text-center text-primary-foreground shadow-glow md:p-16">
            <Sparkles className="mx-auto h-8 w-8 opacity-90" />
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Have a project in mind?</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
              Tell us your goals — we'll send back a written proposal with scope, timeline and pricing within 1–3 business days.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-elegant transition-all hover:-translate-y-0.5">
                Start a project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/projects" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10">
                See our ventures
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
