import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-business.jpg";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { CountUp, CountUpSkeleton } from "@/components/CountUp";
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
  Download,
  Mail,
  Layers,

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

type ImpactMetric = {
  id: string;
  icon: typeof Briefcase;
  /** Raw numeric target — drives the counter. */
  target: number;
  label: string;
  note: string;
  format?: import("@/components/CountUp").CountFormat;
};

const impactMetrics: ImpactMetric[] = [
  { id: "projects",  icon: Briefcase,      target: 250,    label: "Projects delivered",  note: "Across 12 industries",     format: { plus: true } },
  { id: "users",     icon: Users,          target: 180000, label: "End users served",    note: "Monthly active reach",     format: { compact: true, plus: true } },
  { id: "clients",   icon: Building2,      target: 120,    label: "Enterprise clients",  note: "From startups to groups",  format: { plus: true } },
  { id: "districts", icon: Globe,          target: 64,     label: "Districts covered",   note: "Nationwide footprint" },
  { id: "years",     icon: Award,          target: 11,     label: "Years of expertise",  note: "Trusted since 2014",       format: { plus: true } },
  { id: "retention", icon: HeartHandshake, target: 98,     label: "Client retention",    note: "Long-term partnerships",   format: { percent: true } },
];

function Index() {
  const [openVenture, setOpenVenture] = useState<Venture | null>(null);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return (
    <>
      {/* HERO — professional, editorial */}
      <section className="relative overflow-hidden border-b border-border/60">
        {/* Subtle ambient backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute top-24 -right-20 h-[360px] w-[360px] rounded-full bg-accent/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        </div>

        <div className="container-tight relative grid gap-14 py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20 lg:py-28">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/80 backdrop-blur"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Trusted since 2014
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 font-display font-semibold leading-[1.04] tracking-tight text-balance"
            >
              Consulting & technology that{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                move your business forward
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              YESS Bangla partners with ambitious organisations across Bangladesh — delivering
              strategy, software, media and commerce solutions built to international standards.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Start a project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-all hover:bg-background"
              >
                Explore services
              </Link>
            </motion.div>

            {/* Trust signals */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> ISO-grade processes</span>
              <span className="inline-flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-primary" /> 11+ years expertise</span>
              <span className="inline-flex items-center gap-1.5"><HeartHandshake className="h-3.5 w-3.5 text-primary" /> 98% client retention</span>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border/60 pt-8 sm:gap-8">
              {[
                { target: 250, label: "Projects delivered", format: { plus: true } as const },
                { target: 120, label: "Enterprise clients", format: { plus: true } as const },
                { target: 64,  label: "Districts covered" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={"min-w-0 " + (i > 0 ? "border-l border-border/60 pl-4 sm:pl-8" : "")}
                >
                  <div className="flex h-8 items-baseline font-display text-2xl font-semibold leading-none tracking-tight text-foreground tabular-nums sm:h-10 sm:text-3xl">
                    {hydrated ? <CountUp target={s.target} format={s.format} /> : <CountUpSkeleton />}
                  </div>
                  <div className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground sm:text-xs">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/60 p-1.5 shadow-2xl backdrop-blur">
              <img
                src={heroImg}
                alt="YESS Bangla consulting team meeting"
                width={1600}
                height={1024}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="block aspect-[4/3] w-full rounded-[1.35rem] object-cover"
              />
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-border/60 bg-background/85 p-4 shadow-xl backdrop-blur sm:block">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">11+ years</div>
                  <div className="text-xs text-muted-foreground">of trusted expertise</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-5 -right-4 hidden rounded-2xl border border-border/60 bg-background/85 p-3 shadow-xl backdrop-blur lg:block">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-accent text-accent-foreground">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">3× growth</div>
                  <div className="text-[10px] text-muted-foreground">avg. client outcome</div>
                </div>
              </div>
            </div>
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
                <motion.button
                  type="button"
                  onClick={() => setOpenVenture(v)}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className="group relative h-full w-full overflow-hidden rounded-2xl glass-card p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Open details for ${v.name}`}
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
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-all group-hover:gap-2.5">
                        View details <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.button>
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
              <StaggerItem key={m.id}>
                <div className="relative h-full rounded-2xl glass-card p-6">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-accent text-accent-foreground shadow-accent">
                      <m.icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      {/* Fixed-height numeric slot prevents layout shift between skeleton ↔ counter */}
                      <div className="flex h-9 items-baseline font-display text-3xl font-semibold leading-none tracking-tight text-foreground tabular-nums">
                        {hydrated ? (
                          <CountUp target={m.target} format={m.format} />
                        ) : (
                          <CountUpSkeleton />
                        )}
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

      {/* CLIENTS — animated marquee */}
      <section className="py-14">
        <div className="container-tight">
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Trusted by leading organisations across Bangladesh
            </p>
          </Reveal>
          <div className="marquee-mask mt-8 overflow-hidden">
            <div className="marquee gap-12 pr-12">
              {[...clients, ...clients].map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="shrink-0 font-display text-base font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-primary sm:text-lg"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
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

      {/* VENTURE DETAILS DIALOG */}
      <Dialog open={!!openVenture} onOpenChange={(o) => !o && setOpenVenture(null)}>
        <DialogContent className="max-w-lg overflow-hidden p-0">
          {openVenture && (
            <div>
              <div className="relative bg-gradient-primary px-6 pb-6 pt-8 text-primary-foreground">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="relative flex items-start gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                    <openVenture.icon className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                      {openVenture.tag}
                    </span>
                    <DialogHeader className="mt-2 space-y-1 text-left">
                      <DialogTitle className="font-display text-2xl font-semibold leading-tight text-primary-foreground">
                        {openVenture.name}
                      </DialogTitle>
                      <DialogDescription className="text-sm text-primary-foreground/85">
                        {openVenture.desc}
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6">
                <p className="text-sm leading-relaxed text-muted-foreground">{openVenture.long}</p>

                <ul className="mt-5 space-y-2.5">
                  {openVenture.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-foreground/90">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3 w-3" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  {openVenture.cta.to ? (
                    <Link
                      to={openVenture.cta.to}
                      onClick={() => setOpenVenture(null)}
                      className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-md transition-transform hover:scale-[1.02]"
                    >
                      {openVenture.cta.label}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ) : (
                    <a
                      href={openVenture.cta.href}
                      className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-md transition-transform hover:scale-[1.02]"
                    >
                      {openVenture.cta.label}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpenVenture(null)}
                    className="inline-flex flex-1 items-center justify-center rounded-full glass px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
