import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-business.jpg";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
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
  Tv2,
  Globe,
  Smartphone,
  Megaphone,
  GraduationCap,
  Briefcase,
  Building2,
  HeartHandshake,
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

type Venture = {
  icon: typeof Tv;
  name: string;
  tag: string;
  desc: string;
  long: string;
  highlights: string[];
  cta: { label: string; to?: string; href?: string };
};

const ventures: Venture[] = [
  { icon: Tv, name: "Akash TV", tag: "Broadcast", desc: "Flagship satellite & digital television channel reaching millions across Bangladesh.", long: "Akash TV is YESS Bangla's flagship broadcast channel, delivering news, entertainment and lifestyle programming to millions of households across Bangladesh through satellite and digital distribution.", highlights: ["Nationwide satellite reach", "24/7 original programming", "Premium ad inventory"], cta: { label: "Partner with Akash TV", to: "/contact" } },
  { icon: Tv2, name: "Akash OTT", tag: "Streaming", desc: "Premium on-demand streaming platform with original Bangla entertainment.", long: "Akash OTT brings Bangla cinema, drama, sports and originals to mobile, web and smart TV — built on a scalable streaming stack with subscription and ad-supported tiers.", highlights: ["Mobile, web & smart TV apps", "Originals & licensed catalogue", "SVOD + AVOD monetisation"], cta: { label: "Explore OTT solutions", to: "/services" } },
  { icon: Newspaper, name: "Akash News", tag: "Digital Media", desc: "Modern, mobile-first Bangladeshi digital news platform.", long: "Akash News is a modern, mobile-first newsroom platform delivering breaking news, analysis and multimedia journalism with a fast, accessible reader experience.", highlights: ["Mobile-first newsroom CMS", "Live & multimedia coverage", "High-performance delivery"], cta: { label: "Advertise with us", to: "/contact" } },
  { icon: ShoppingBag, name: "Yess Bangla Shop", tag: "E-commerce", desc: "End-to-end commerce — websites, apps, payments and last-mile delivery.", long: "Yess Bangla Shop is a full-stack commerce venture covering storefronts, mobile apps, payments, fulfilment and doorstep delivery — for brands and marketplaces alike.", highlights: ["Storefront + mobile apps", "Local payments & COD", "Last-mile delivery network"], cta: { label: "Launch your store", to: "/services" } },
  { icon: Code2, name: "Yess Tech Labs", tag: "Software", desc: "Custom web & enterprise software engineering for ambitious teams.", long: "Yess Tech Labs builds custom web platforms, internal tools and enterprise software with modern stacks — from MVP to scale, with security and performance baked in.", highlights: ["Web & backend engineering", "Cloud-native architecture", "DevOps & observability"], cta: { label: "Discuss a project", to: "/contact" } },
  { icon: Palette, name: "Yess Studio", tag: "Design", desc: "Brand, product and motion design for digital-first companies.", long: "Yess Studio is our in-house design practice — brand identity, product UI/UX and motion design for digital-first companies that care about craft.", highlights: ["Brand & identity systems", "Product UI/UX design", "Motion & 3D"], cta: { label: "Start a design sprint", to: "/contact" } },
  { icon: Smartphone, name: "Yess Mobile", tag: "Apps", desc: "Native and cross-platform mobile apps engineered for scale.", long: "Yess Mobile delivers native iOS, Android and cross-platform apps engineered for performance, offline-first experiences and seamless release pipelines.", highlights: ["iOS, Android & cross-platform", "Offline-first architecture", "Push, payments & analytics"], cta: { label: "Build your app", to: "/services" } },
  { icon: Megaphone, name: "Yess Marketing", tag: "Growth", desc: "Performance marketing, SEO and paid media that compound.", long: "Yess Marketing runs performance marketing, SEO, content and paid media campaigns engineered to compound — with transparent reporting and clear ROAS targets.", highlights: ["Paid search & social", "SEO & content engines", "Analytics & attribution"], cta: { label: "Grow with us", to: "/contact" } },
  { icon: GraduationCap, name: "Yess Academy", tag: "Education", desc: "Industry-led training in tech, design and digital business.", long: "Yess Academy trains the next generation of Bangladeshi technologists, designers and digital operators with industry-led, project-based programmes.", highlights: ["Tech, design & business tracks", "Industry mentors", "Job-ready portfolios"], cta: { label: "View programmes", to: "/services" } },
  { icon: Briefcase, name: "Yess Consulting", tag: "Strategy", desc: "Management & digital consulting for enterprises and SMEs.", long: "Yess Consulting partners with enterprises and SMEs on strategy, digital transformation and operating-model design — turning ambition into measurable outcomes.", highlights: ["Strategy & transformation", "Operating-model design", "Change & enablement"], cta: { label: "Book a consultation", to: "/contact" } },
  { icon: LayoutGrid, name: "One Stop Solution", tag: "Services", desc: "Centralised IT support and home services under one trusted roof.", long: "One Stop Solution centralises IT support, smart-home installations and trusted home services — one number, one team, one accountable partner.", highlights: ["IT & device support", "Smart-home installations", "Trusted technicians"], cta: { label: "Request a service", to: "/contact" } },
];

const impactMetrics = [
  { icon: Briefcase, value: "250+", label: "Projects delivered", note: "Across 12 industries" },
  { icon: Users, value: "180K+", label: "End users served", note: "Monthly active reach" },
  { icon: Building2, value: "120+", label: "Enterprise clients", note: "From startups to groups" },
  { icon: Globe, value: "64", label: "Districts covered", note: "Nationwide footprint" },
  { icon: Award, value: "11+", label: "Years of expertise", note: "Trusted since 2014" },
  { icon: HeartHandshake, value: "98%", label: "Client retention", note: "Long-term partnerships" },
];

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
              initial={false}
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

      {/* VENTURES SHOWCASE — 11 ventures */}
      <section className="py-20">
        <div className="container-tight">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our ventures</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Eleven ventures. One ecosystem.
            </h2>
            <p className="mt-4 text-muted-foreground">
              A connected portfolio of media, technology, commerce and education brands — each
              built to lead its category in Bangladesh.
            </p>
          </Reveal>

          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ventures.map((v) => (
              <StaggerItem key={v.name}>
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className="group relative h-full overflow-hidden rounded-2xl glass-card p-6"
                >
                  <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-accent/8 transition-transform group-hover:scale-125" />
                  <div className="relative flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                      <v.icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-lg font-semibold leading-tight">{v.name}</h3>
                        <span className="shrink-0 rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {v.tag}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                    </div>
                  </div>
                </motion.article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* IMPACT & METRICS */}
      <section className="py-20">
        <div className="container-tight">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Impact & metrics</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Numbers that tell our story
            </h2>
            <p className="mt-4 text-muted-foreground">
              A decade of measurable impact for businesses, partners and communities across Bangladesh.
            </p>
          </Reveal>

          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {impactMetrics.map((m) => (
              <StaggerItem key={m.label}>
                <div className="relative h-full rounded-2xl glass-card p-6">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-accent text-accent-foreground shadow-accent">
                      <m.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-display text-3xl font-semibold leading-none text-foreground">
                        <CountUp value={m.value} />
                      </div>
                      <div className="mt-1 text-sm font-medium text-foreground/80">{m.label}</div>
                    </div>
                  </div>
                  <p className="mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">{m.note}</p>
                </div>
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
