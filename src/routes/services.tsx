import { createFileRoute, Link } from "@tanstack/react-router";
import { Tv, Newspaper, LayoutGrid, Code2, Palette, ShoppingBag, ArrowRight } from "lucide-react";

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
  { icon: Tv, title: "Akash OTT", desc: "Bangladesh's new digital streaming platform launched by YESS Bangla Communications under Akash TV. Full content management, multi-device delivery and monetisation." },
  { icon: Newspaper, title: "Akash News", desc: "A modern Bangladeshi digital news platform delivering real-time stories with a robust editorial CMS." },
  { icon: LayoutGrid, title: "YESS One Stop Solution", desc: "Centralised technology services, IT support and home services like cleaning and maintenance — under one trusted roof." },
  { icon: Code2, title: "Web Development", desc: "Frontend (HTML, CSS, JavaScript) and backend (PHP, Laravel, Node) development. Full-stack engineering with responsive design across all devices." },
  { icon: Palette, title: "Web Design", desc: "Visually appealing, functional websites combining layout, colour, typography and user experience that performs across devices." },
  { icon: ShoppingBag, title: "Yess Bangla Shop", desc: "End-to-end e-commerce — websites, mobile apps, secure payments and doorstep delivery for retailers across Bangladesh." },
];

function Services() {
  return (
    <>
      <section className="bg-gradient-hero py-20 text-primary-foreground">
        <div className="container-tight max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">What we offer</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            A full portfolio of business & IT services.
          </h1>
          <p className="mt-5 text-primary-foreground/80">
            From media platforms to web engineering — we deliver the full spectrum of digital and
            consulting services your business needs.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-tight grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <article
              key={s.title}
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
            >
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
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
    </>
  );
}
