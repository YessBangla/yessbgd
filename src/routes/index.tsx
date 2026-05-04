import { useEffect, useState } from "react";
import { useOffscreenPause } from "@/hooks/useOffscreenPause";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-business.jpg";
import aboutImg from "@/assets/about-team-bd.jpg";
import servicesImg from "@/assets/services-tech-bd.jpg";
import venturesImg from "@/assets/ventures-dhaka-bd.jpg";
import trustImg from "@/assets/trust-handshake-bd.jpg";
import contactImg from "@/assets/contact-welcome-bd.jpg";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { HeroOverlays } from "@/components/HeroOverlays";
import { CountUp, CountUpSkeleton } from "@/components/CountUp";
import { SectionHeader, SectionDivider } from "@/components/SectionHeader";
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
  // Pause water-ripple shimmer when the headline scrolls offscreen
  const headlineRef = useOffscreenPause<HTMLHeadingElement>();
  useEffect(() => {
    setHydrated(true);
  }, []);
  return (
    <>
      {/* HERO — international editorial, full-bleed cinematic */}
      <section
        className="hero-section relative isolate grid overflow-hidden bg-foreground text-background"
        style={{ minHeight: "clamp(192px, 27vh, 294px)" }}
      >
        {/* Background image */}
        <img
          src={heroImg}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1200}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center sm:object-[60%_center]"
        />
        {/* Overlay stack — tokens in styles.css, parallax + auto-contrast */}
        <HeroOverlays imageSrc={heroImg} />

        <div className="container-tight relative grid gap-3 py-2 sm:gap-5 sm:py-4 lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-5">
          {/* LEFT — Headline column */}
          <div className="lg:col-span-7 xl:col-span-7">
            {/* Eyebrow chip */}
            {/* Eyebrow chip — flex-wraps gracefully on ≤360px viewports
                so the trust signals never overflow the container. */}
            <div className="hero-fade inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-background/20 bg-background/5 px-3.5 py-1.5 text-[10.5px] sm:text-[11px] font-medium uppercase tracking-[0.22em] text-background/85 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="whitespace-nowrap">Bangladesh · Est. 2014</span>
              <span aria-hidden className="hidden h-3 w-px bg-background/25 sm:inline" />
              <span className="inline-flex items-center gap-1 whitespace-nowrap text-background/70">
                <Star className="h-3 w-3 fill-accent text-accent" /> 4.9 / 5
              </span>
            </div>

            {/* Section label — international editorial eyebrow */}
            <div
              className="hero-fade mt-5 flex items-center gap-3 text-[10px] sm:text-[11px] font-semibold uppercase text-background/65"
              style={{
                animationDelay: "40ms",
                letterSpacing: "0.32em",
                wordSpacing: "normal",
              }}
            >
              <span aria-hidden className="h-px w-8 bg-background/45" />
              <span>A Bangladesh-built consultancy</span>
              <span aria-hidden className="hidden sm:inline h-px w-8 bg-background/45" />
            </div>

            {/* Headline — three-line editorial cadence with water shimmer.
                Typography contract (see scripts/check-hero-typography.mjs):
                  • fontSize: clamp(rem, expr, rem) — editorial ceiling 3.5rem
                  • lineHeight: unitless clamp — tighter as size grows
                  • letterSpacing: em-only — script-safe (Latin/Bangla/RTL)
                  • wordSpacing: normal — international parity */}
            <h1
              ref={headlineRef}
              className="hero-fade mt-4 sm:mt-5 lg:mt-6 font-display font-semibold text-balance text-background"
              style={{
                animationDelay: "80ms",
                /* Refined editorial scale: 28px mobile → 56px desktop */
                /* Floor 1.625rem (26px) keeps 320px viewports safe; preferred
                   slope tuned so 360–430px lands cleanly between 27–32px. */
                fontSize: "clamp(1.625rem, 0.85rem + 3.6vw, 3.5rem)",
                /* Premium leading: tighter as type grows */
                lineHeight: "clamp(1.04, 1.2 - 0.7vw, 1.14)",
                /* Em-based optical tracking — auto-scales with font-size */
                letterSpacing: "-0.022em",
                wordSpacing: "normal",
              }}
            >
              <span className="water-text block">Strategy, software</span>
              <span
                className="block text-background/95"
                style={{ marginTop: "0.06em", letterSpacing: "-0.018em" }}
              >
                &amp;{" "}
                <span
                  className="italic font-light text-background/90"
                  style={{ letterSpacing: "-0.008em" }}
                >
                  storytelling
                </span>
              </span>
              <span
                className="water-text-accent block"
                style={{ marginTop: "0.06em", letterSpacing: "-0.024em" }}
              >
                built for{" "}
                <span className="whitespace-nowrap">global ambition.</span>
              </span>
            </h1>

            {/* Lede paragraph — fluid type, premium leading & tracking.
                Slightly higher contrast (/80) and wider max-width on desktop
                for editorial readability without losing the airy feel. */}
            <p
              className="hero-fade mt-5 sm:mt-6 lg:mt-7 max-w-xl lg:max-w-2xl text-background/80"
              style={{
                animationDelay: "160ms",
                /* 13px mobile → 17px desktop — editorial body scale */
                fontSize: "clamp(0.8125rem, 0.7rem + 0.5vw, 1.0625rem)",
                /* Slightly tighter leading on desktop for elegance */
                lineHeight: "clamp(1.55, 1.72 - 0.18vw, 1.7)",
                /* Subtle em-based optical tracking — script-safe */
                letterSpacing: "-0.005em",
                wordSpacing: "normal",
              }}
            >
              <span className="font-medium text-background/95">YESS Bangla</span>{" "}
              partners with ambitious organisations to deliver consulting,
              technology, media and commerce solutions —
              {/* nowrap only ≥sm; on narrow phones these long phrases must wrap */}
              <span className="sm:whitespace-nowrap"> engineered to international standards,</span>
              <span className="sm:whitespace-nowrap"> shipped from Dhaka.</span>
            </p>

            {/* CTA row */}
            <div
              className="hero-fade mt-6 sm:mt-7 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "220ms" }}
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm font-semibold text-foreground shadow-xl ring-1 ring-background/10 transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-2xl hover:bg-background/95 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-foreground motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                Start a project
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" />
              </Link>
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/5 px-7 py-3.5 text-sm font-semibold text-background backdrop-blur transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-background/50 hover:bg-background/10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                Explore services
                <ArrowRight className="h-4 w-4 opacity-70 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" />
              </Link>
            </div>

            {/* Trust signals — divider + caps label for editorial weight */}
            <div
              className="hero-fade mt-7 flex items-center gap-4"
              style={{ animationDelay: "320ms" }}
            >
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.3em] text-background/45 sm:inline">
                Why teams choose us
              </span>
              <span className="hidden h-px flex-1 bg-background/15 sm:block" />
            </div>
            <div
              className="hero-fade mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-background/70"
              style={{ animationDelay: "360ms" }}
            >
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> ISO-grade processes</span>
              <span className="inline-flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-accent" /> 11+ years expertise</span>
              <span className="inline-flex items-center gap-1.5"><HeartHandshake className="h-3.5 w-3.5 text-accent" /> 98% client retention</span>
            </div>
          </div>

          {/* RIGHT — Floating editorial cards */}
          <div className="relative lg:col-span-5 xl:col-span-5">
            <div
              className="hero-fade ml-auto max-w-sm space-y-3"
              style={{ animationDelay: "240ms" }}
            >
              <div className="hero-float rounded-2xl border border-background/15 bg-background/8 p-5 backdrop-blur-xl" style={{ animationDelay: "0s" }}>
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground shadow-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-background/60">Average client outcome</div>
                    <div className="font-display text-2xl font-semibold leading-none text-background">3× growth</div>
                  </div>
                </div>
              </div>

              <div className="hero-float rounded-2xl border border-background/15 bg-background/8 p-5 backdrop-blur-xl" style={{ animationDelay: "-2.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-background text-foreground shadow-lg">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-background/60">Trusted by</div>
                    <div className="font-display text-base font-semibold leading-tight text-background">120+ enterprise clients across 64 districts</div>
                  </div>
                </div>
              </div>

              <div className="hero-float rounded-2xl border border-background/15 bg-background/8 p-5 backdrop-blur-xl" style={{ animationDelay: "-5s" }}>
                <div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-background/85">
                  &ldquo;The most strategic technology partner we&rsquo;ve worked with in the region.&rdquo;
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-wider text-background/55">
                  CEO · Retail Group
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom KPI strip */}
        <div className="relative border-t border-background/10 bg-foreground/40 backdrop-blur-md">
          <div className="container-tight grid grid-cols-2 gap-y-4 py-4 sm:grid-cols-4">
            {[
              { target: 250, label: "Projects delivered", format: { plus: true } as const },
              { target: 120, label: "Enterprise clients", format: { plus: true } as const },
              { target: 64,  label: "Districts covered" },
              { target: 11,  label: "Years of expertise", format: { plus: true } as const },
            ].map((s, i) => (
              <div
                key={s.label}
                className={"min-w-0 px-4 sm:px-6 " + (i > 0 ? "sm:border-l sm:border-background/10" : "")}
              >
                <div className="flex h-8 items-baseline font-display text-2xl font-semibold leading-none tracking-tight text-background tabular-nums sm:text-3xl">
                  {hydrated ? <CountUp target={s.target} format={s.format} /> : <CountUpSkeleton />}
                </div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-background/55 sm:text-[11px]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK CTA STRIP */}
      <section className="relative -mt-px border-y border-border/60 bg-gradient-to-br from-primary/8 via-background to-accent/8">
        <div className="container-tight py-12 sm:py-14">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_2fr] lg:items-center">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Ready when you are
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Let&rsquo;s build what&rsquo;s next — together.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Talk to our team, browse what we deliver, or take our profile with you.
              </p>
            </Reveal>

            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                to="/contact"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-background/70 p-5 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                    <Mail className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <div className="mt-6">
                  <div className="font-display text-base font-semibold">Contact us</div>
                  <div className="mt-1 text-xs text-muted-foreground">Reply within one business day</div>
                </div>
              </Link>

              <Link
                to="/services"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-background/70 p-5 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-accent text-accent-foreground shadow-glow">
                    <Layers className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <div className="mt-6">
                  <div className="font-display text-base font-semibold">Explore services</div>
                  <div className="mt-1 text-xs text-muted-foreground">Consulting, IT, OTT &amp; commerce</div>
                </div>
              </Link>

              <a
                href="/yess-bangla-company-profile.pdf"
                download
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-foreground/80 bg-foreground p-5 text-background transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-background/15 text-background">
                    <Download className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-70 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </div>
                <div className="mt-6">
                  <div className="font-display text-base font-semibold">Company profile</div>
                  <div className="mt-1 text-xs opacity-75">Download PDF · ~80 KB</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENTS — early trust signal, animated marquee
          Surfaces social proof immediately after CTA so visitors see who
          trusts us before any pitch. Reduced vertical padding keeps it
          feeling like a thin trust ribbon, not a full section. */}
      <section className="py-8 sm:py-10">
        <div className="container-tight">
          <Reveal>
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/80">
              Trusted by leading organisations across Bangladesh
            </p>
          </Reveal>
          <div className="marquee-mask mt-5 overflow-hidden sm:mt-6">
            <div className="marquee gap-10 pr-10 sm:gap-12 sm:pr-12">
              {[...clients, ...clients].map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="shrink-0 font-display text-[15px] font-semibold tracking-tight text-muted-foreground/65 transition-colors hover:text-primary sm:text-base lg:text-lg"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ABOUT STRIP — who we are */}
      <section className="py-12 sm:py-20 lg:py-24">
        <div className="container-tight grid gap-8 sm:gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto max-w-xs sm:max-w-sm lg:max-w-none">
              <div aria-hidden className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-primary/15 to-accent/15 blur-2xl sm:-inset-4 sm:rounded-3xl" />
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-1 shadow-xl backdrop-blur sm:rounded-3xl sm:p-1.5">
                <img
                  src={aboutImg}
                  alt="YESS Bangla consultants collaborating in a Dhaka office"
                  width={1280}
                  height={960}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-[4/3] w-full rounded-xl object-cover sm:rounded-[1.35rem]"
                />
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7">
            <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              <span aria-hidden className="h-px w-6 bg-primary/40" />
              Simply know about us
            </div>
            <h2 className="mt-3 font-display font-semibold tracking-tight text-balance">
              We help people take their businesses to the next level.
            </h2>
            <p className="mt-3 text-muted-foreground">
              We cope with tasks of various complexity levels, provide long-term guarantees, and
              continuously master new technologies for the industries we serve. Our portfolio
              spans dozens of successful engagements across Bangladesh.
            </p>

            <Stagger className="mt-7 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4">
              {features.map((f) => (
                <StaggerItem key={f.title}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card h-full rounded-2xl p-4 sm:p-5"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 font-display text-[15px] font-semibold sm:mt-4 sm:text-base">{f.title}</h3>
                    <p className="mt-1 text-[13px] text-muted-foreground sm:text-sm">{f.desc}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </Stagger>

            <Link
              to="/about"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      <SectionDivider />

      {/* SERVICES — what we offer */}
      <section className="py-12 sm:py-20 lg:py-24">
        <div className="container-tight">
          <SectionHeader
            eyebrow="What we offer"
            title="Effective, wide-area business solutions"
            lede="From media platforms to enterprise software — a portfolio of services built for ambitious organisations."
          />

          <Reveal className="mt-8 sm:mt-12">
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl border border-border/60 shadow-xl sm:max-w-none sm:rounded-3xl">
              <img
                src={servicesImg}
                alt="Bangladeshi engineers building software in a modern Dhaka studio"
                width={1280}
                height={960}
                loading="lazy"
                decoding="async"
                className="block aspect-[4/3] w-full object-cover sm:aspect-[21/6]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
                <p className="max-w-xl text-xs font-medium text-foreground sm:text-base">
                  Engineering, design and consulting — delivered to international standards from Bangladesh.
                </p>
              </div>
            </div>
          </Reveal>

          <Stagger className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <StaggerItem key={s.title}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className="group relative h-full overflow-hidden rounded-2xl glass-card p-5 sm:p-7"
                >
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/8 transition-transform group-hover:scale-125" />
                  <div className="relative">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                      <s.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold sm:mt-5 sm:text-xl">{s.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">{s.desc}</p>
                    <Link
                      to="/services"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5 sm:mt-5"
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

      <SectionDivider />

      {/* IMPACT & METRICS — proof, placed right after capability pitch */}
      <section className="py-12 sm:py-20 lg:py-24">
        <div className="container-tight">
          <SectionHeader
            eyebrow="Impact & metrics"
            title="Numbers that tell our story"
            lede="A decade of measurable impact for businesses, partners and communities across Bangladesh."
          />

          <Stagger className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {impactMetrics.map((m) => (
              <StaggerItem key={m.id}>
                <div className="relative h-full rounded-2xl glass-card p-5 sm:p-6">
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

      <SectionDivider />

      {/* PROCESS — how we work, before showcasing breadth */}
      <section className="py-12 sm:py-20 lg:py-24">
        <div className="container-tight">
          <SectionHeader
            eyebrow="How we work"
            title="A proven, four-step delivery process"
            lede="Clarity at every stage — from first conversation to long-term growth."
          />
          <Stagger className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <StaggerItem key={p.title}>
                <div className="relative h-full rounded-2xl glass-card p-5 sm:p-6">
                  <div className="absolute right-5 top-5 font-display text-4xl font-semibold text-primary/10">0{i + 1}</div>
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-[13px] text-muted-foreground sm:text-sm">{p.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <SectionDivider />

      {/* VENTURES SHOWCASE — 11 ventures, breadth of ecosystem */}
      <section className="py-12 sm:py-20 lg:py-24">
        <div className="container-tight">
          <SectionHeader
            eyebrow="Our ventures"
            title="Eleven ventures. One ecosystem."
            lede="A connected portfolio of media, technology, commerce and education brands — each built to lead its category in Bangladesh."
          />

          <Reveal className="mt-8 sm:mt-12">
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl border border-border/60 shadow-xl sm:max-w-none sm:rounded-3xl">
              <img
                src={venturesImg}
                alt="Modern Dhaka skyline at golden hour — home to YESS Bangla ventures"
                width={1280}
                height={720}
                loading="lazy"
                decoding="async"
                className="block aspect-[4/3] w-full object-cover sm:aspect-[16/5]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent sm:bg-gradient-to-r sm:from-background/85 sm:via-background/40 sm:to-transparent" />
              <div className="absolute inset-0 flex items-end p-4 sm:items-center sm:p-10">
                <div className="max-w-md">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">From Dhaka, for Bangladesh</p>
                  <p className="mt-1.5 font-display text-base font-semibold leading-tight sm:mt-2 sm:text-2xl">
                    A connected portfolio reaching every corner of the country.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Stagger className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ventures.map((v) => (
              <StaggerItem key={v.name}>
                <motion.button
                  type="button"
                  onClick={() => setOpenVenture(v)}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className="group relative h-full w-full overflow-hidden rounded-2xl glass-card p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-6"
                  aria-label={`Open details for ${v.name}`}
                >
                  <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-accent/8 transition-transform group-hover:scale-125" />
                  <div className="relative flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                      <v.icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-base font-semibold leading-tight sm:text-lg">{v.name}</h3>
                        <span className="shrink-0 rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {v.tag}
                        </span>
                      </div>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">{v.desc}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-all group-hover:gap-2.5 sm:mt-4">
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

      <SectionDivider />

      {/* TESTIMONIALS — voice of the customer */}
      <section className="py-12 sm:py-20 lg:py-24">
        <div className="container-tight">
          <SectionHeader
            eyebrow="Client stories"
            title="Loved by ambitious teams"
            lede="Honest words from leaders who chose us to ship the work that mattered."
          />
          <Stagger className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <figure className="relative h-full rounded-2xl glass-card p-5 sm:p-7">
                  <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/15" />
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <blockquote className="mt-4 text-[13px] leading-relaxed text-foreground/90 sm:text-sm">"{t.quote}"</blockquote>
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

      {/* FINAL CTA */}
      <section className="py-12 sm:py-20 lg:py-24">
        <div className="container-tight">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-10 md:p-16">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary opacity-20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent opacity-20 blur-3xl" />
              <div className="relative grid gap-6 sm:gap-8 md:grid-cols-2 md:items-center">
                <div>
                  <h2 className="font-display font-semibold tracking-tight">
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
