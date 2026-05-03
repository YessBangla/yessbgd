import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-business.jpg";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
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
  Search,
  Lightbulb,
  Rocket,
  LineChart,
  Quote,
  Star,
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

const process = [
  { icon: Search, title: "Discover", desc: "We listen, audit and understand your business, customers and constraints." },
  { icon: Lightbulb, title: "Strategise", desc: "We design a clear, prioritised roadmap with measurable outcomes." },
  { icon: Rocket, title: "Build & Launch", desc: "Our cross-functional team executes with speed, quality and transparency." },
  { icon: LineChart, title: "Grow", desc: "We measure, iterate and scale what works — together with you." },
];

const testimonials = [
  { name: "Tanvir Ahmed", role: "CEO, Retail Group", quote: "YESS Bangla rebuilt our e-commerce platform end-to-end. Sales grew 3x in nine months and our team finally has tools we love using." },
  { name: "Nusrat Jahan", role: "Director, EdTech Startup", quote: "Their consulting clarified our strategy and their engineers shipped faster than any agency we've worked with. Easy partnership." },
  { name: "Rakib Hasan", role: "Head of Operations, Logistics", quote: "From discovery to launch they treated our business as their own. Reliable, transparent and genuinely strategic." },
];

const clients = ["Akash TV", "Akash News", "Akash OTT", "One Stop", "Yess Shop", "Bangla Media", "BD Logistics", "EduConnect"];

function Index() {
  return (
    <>
      {/* HERO — light, airy, Apple-style glass */}
      <section className="relative overflow-hidden">
        {/* Ambient floating orbs */}
        <div className="orb h-[480px] w-[480px] -top-40 -left-32" style={{ background: "oklch(0.78 0.16 188 / 0.55)" }} />
        <div className="orb h-[420px] w-[420px] top-20 right-0" style={{ background: "oklch(0.82 0.18 28 / 0.45)", animationDelay: "-6s" }} />
        <div className="orb h-[360px] w-[360px] bottom-0 left-1/3" style={{ background: "oklch(0.85 0.14 250 / 0.45)", animationDelay: "-12s" }} />

        <div className="container-tight relative grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <motion.div
              initial={false}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-foreground/80"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Experts in Business & IT Solutions
            </motion.div>
            <motion.h1
              initial={false}
              className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              Business consulting that turns data into{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                strategic growth.
              </span>
            </motion.h1>
            <motion.p
              initial={false}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              YESS Bangla helps organisations across Bangladesh modernise, scale and lead — with a
              full suite of consulting, IT, OTT and e-commerce solutions.
            </motion.p>
            <motion.div
              initial={false}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-md transition-all hover:scale-[1.03] hover:shadow-lg"
              >
                Start a project <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold text-foreground transition-all hover:scale-[1.03]"
              >
                Explore services
              </Link>
            </motion.div>

            <motion.div
              initial={false}
              className="mt-10 grid grid-cols-3 gap-6 border-t border-border/60 pt-8"
            >
              {stats.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={false}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/20 to-accent/20 opacity-60 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl glass-strong p-2">
              <img
                src={heroImg}
                alt="YESS Bangla consulting team meeting"
                width={1600}
                height={1024}
                className="rounded-2xl"
              />
            </div>
            <motion.div
              initial={false}
              className="absolute -bottom-6 -left-6 hidden rounded-2xl glass-strong p-4 sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-primary-foreground">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">11+ years</div>
                  <div className="text-xs text-muted-foreground">of trusted expertise</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute -top-4 -right-4 hidden rounded-2xl glass-strong p-3 lg:block"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["EH", "SR", "AK"].map((i) => (
                    <div key={i} className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary text-[10px] font-semibold text-primary-foreground ring-2 ring-white">
                      {i}
                    </div>
                  ))}
                </div>
                <div className="pr-1 text-xs font-medium text-foreground">250+ clients</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="py-20">
        <div className="container-tight grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Simply know about us</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              We help people take their businesses to the next level.
            </h2>
            <p className="mt-4 text-muted-foreground">
              We cope with tasks of various complexity levels, provide long-term guarantees, and
              continuously master new technologies for the industries we serve. Our portfolio
              spans dozens of successful engagements across Bangladesh.
            </p>
            <Link
              to="/about"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Stagger className="grid grid-cols-2 gap-4">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card h-full rounded-2xl p-5"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20">
        <div className="container-tight">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">What we offer</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Effective, wide-area business solutions
            </h2>
            <p className="mt-4 text-muted-foreground">
              From media platforms to enterprise software — a portfolio of services built for
              ambitious organisations.
            </p>
          </Reveal>

          <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <StaggerItem key={s.title}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className="group relative h-full overflow-hidden rounded-2xl glass-card p-7"
                >
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/8 transition-transform group-hover:scale-125" />
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
                </motion.article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20">
        <div className="container-tight">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">How we work</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">A proven, four-step delivery process</h2>
            <p className="mt-4 text-muted-foreground">Clarity at every stage — from first conversation to long-term growth.</p>
          </Reveal>
          <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <StaggerItem key={p.title}>
                <div className="relative h-full rounded-2xl glass-card p-6">
                  <div className="absolute right-5 top-5 font-display text-4xl font-semibold text-primary/10">0{i + 1}</div>
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="container-tight">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Client stories</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Loved by ambitious teams</h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <figure className="relative h-full rounded-2xl glass-card p-7">
                  <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/15" />
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary font-display text-sm font-semibold text-primary-foreground">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="py-12">
        <div className="container-tight">
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Trusted by leading organisations across Bangladesh</p>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-8">
              {clients.map((c) => (
                <div key={c} className="text-center font-display text-sm font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-primary">
                  {c}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS — glass band */}
      <section className="py-12">
        <div className="container-tight">
          <Stagger className="grid gap-px overflow-hidden rounded-3xl glass-strong sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <StaggerItem key={s.label} className="bg-transparent p-8 text-center">
                <div className="bg-gradient-to-br from-primary to-accent bg-clip-text font-display text-4xl font-semibold text-transparent sm:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-tight">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl glass-strong p-10 md:p-16">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary opacity-20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent opacity-20 blur-3xl" />
              <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
                <div>
                  <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                    Offering the best experience of business and IT services.
                  </h2>
                  <p className="mt-3 text-muted-foreground">
                    Tell us about your goals — we'll respond within one business day with a tailored
                    proposal.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                  <a
                    href="tel:+8801805464343"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-md transition-transform hover:scale-[1.03]"
                  >
                    Request a free call
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.03]"
                  >
                    Send a message
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
