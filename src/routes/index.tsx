import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-business.jpg";
import {
  ArrowRight,
  Tv,
  Newspaper,
  LayoutGrid,
  Code2,
  Palette,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YESS Bangla — Business Consulting & IT Solutions" },
      { name: "description", content: "International-grade business consulting, IT, OTT, e-commerce and web solutions in Bangladesh." },
      { property: "og:title", content: "YESS Bangla — Business Consulting & IT Solutions" },
      { property: "og:description", content: "We help businesses across Bangladesh reach the next level." },
    ],
  }),
  component: Index,
});

const services = [
  { icon: Tv, title: "Akash OTT", desc: "Bangladesh's new digital streaming platform launched under Akash TV by YESS Bangla." },
  { icon: Newspaper, title: "Akash News", desc: "A modern Bangladeshi digital news platform powered by YESS Bangla Communications." },
  { icon: LayoutGrid, title: "One Stop Solution", desc: "Centralised technology, IT support and home services — all under one trusted roof." },
  { icon: Code2, title: "Web Development", desc: "Frontend & backend development with modern stacks — responsive, scalable, secure." },
  { icon: Palette, title: "Web Design", desc: "Visually stunning, user-centric design that elevates your brand experience." },
  { icon: ShoppingBag, title: "Yess Bangla Shop", desc: "End-to-end e-commerce — websites, mobile apps, payments and doorstep delivery." },
];

const stats = [
  { value: "250+", label: "Projects Delivered" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "64", label: "Districts Covered" },
  { value: "11+", label: "Years of Experience" },
];

const features = [
  { icon: ShieldCheck, title: "Trusted & Reliable", desc: "Long-term guarantees and a proven track record across industries." },
  { icon: Sparkles, title: "Industry Experts", desc: "A team of consultants and engineers with deep domain expertise." },
  { icon: Users, title: "Customer-Centric", desc: "We design every engagement around your goals and your customers." },
  { icon: TrendingUp, title: "Scalable Solutions", desc: "From startup MVPs to enterprise platforms — built to grow with you." },
];

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-primary-glow/30 blur-3xl" />

        <div className="container-tight relative grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Experts in Business & IT Solutions
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Business consulting that turns data into{" "}
              <span className="bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent">
                strategic growth.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
              YESS Bangla helps organisations across Bangladesh modernise, scale and lead — with a
              full suite of consulting, IT, OTT and e-commerce solutions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-accent transition-transform hover:scale-105"
              >
                Start a project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/10"
              >
                Explore services
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {stats.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-bold text-accent sm:text-3xl">{s.value}</div>
                  <div className="mt-1 text-xs text-primary-foreground/70">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-accent/40 to-primary-glow/40 opacity-50 blur-2xl" />
            <img
              src={heroImg}
              alt="YESS Bangla consulting team meeting"
              width={1600}
              height={1024}
              className="relative rounded-2xl border border-white/10 shadow-elegant"
            />
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-4 shadow-lg sm:block">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-primary-foreground">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">11+ years</div>
                  <div className="text-xs text-muted-foreground">of trusted expertise</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="border-b border-border bg-surface/50 py-16">
        <div className="container-tight grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Simply know about us</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              We help people take their businesses to the next level.
            </h2>
            <p className="mt-4 text-muted-foreground">
              We cope with tasks of various complexity levels, provide long-term guarantees, and
              continuously master new technologies for the industries we serve. Our portfolio
              spans dozens of successful engagements across Bangladesh.
            </p>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
            >
              Read more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-1">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20">
        <div className="container-tight">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">What we offer</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Effective, wide-area business solutions
            </h2>
            <p className="mt-4 text-muted-foreground">
              From media platforms to enterprise software — a portfolio of services built for
              ambitious organisations.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <article
                key={s.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 transition-transform group-hover:scale-125" />
                <div className="relative">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <Link
                    to="/services"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gradient-hero py-16 text-primary-foreground">
        <div className="container-tight grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl font-bold text-accent sm:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm text-primary-foreground/80">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-tight">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-elegant md:p-16">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent opacity-20 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Offering the best experience of business and IT services.
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Tell us about your goals — we'll respond within one business day with a tailored
                  proposal.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <a
                  href="tel:+8801805464340"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
                >
                  Request a free call
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  Send a message
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PlaceholderIndex() { return null; }
void PlaceholderIndex;
