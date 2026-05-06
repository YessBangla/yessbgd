import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import {
  Building2, ShoppingCart, GraduationCap, HeartPulse, Landmark,
  Factory, Tv, Truck, ArrowRight, CheckCircle2, Sparkles,
  ShieldCheck, Award, Users, Globe2, Zap, Heart,
} from "lucide-react";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries — YESS Bangla Private Limited" },
      { name: "description", content: "Industries we serve: media, retail, education, healthcare, finance, manufacturing, logistics and government in Bangladesh." },
      { property: "og:title", content: "Industries we serve — YESS Bangla" },
      { property: "og:description", content: "Cross-industry consulting and IT solutions delivered nation-wide." },
    ],
  }),
  component: Industries,
});

const industries = [
  { icon: Tv, title: "Media & Broadcasting", desc: "OTT platforms, digital news and content distribution at national scale.", outcomes: ["Akash OTT launch", "Editorial CMS", "Live streaming infra"] },
  { icon: ShoppingCart, title: "Retail & E-commerce", desc: "Storefronts, marketplaces, payments and last-mile delivery integrations.", outcomes: ["Multi-vendor stores", "bKash / Nagad / cards", "Nationwide delivery"] },
  { icon: GraduationCap, title: "Education", desc: "Learning management, school ERPs and digital classroom solutions.", outcomes: ["LMS platforms", "Student portals", "Online assessment"] },
  { icon: HeartPulse, title: "Healthcare", desc: "Clinic management, telemedicine and patient engagement platforms.", outcomes: ["Clinic ERP", "Telemedicine apps", "Patient portals"] },
  { icon: Landmark, title: "Banking & Finance", desc: "Secure portals, dashboards and fintech integrations.", outcomes: ["Customer portals", "Internal dashboards", "API integrations"] },
  { icon: Factory, title: "Manufacturing", desc: "ERP, inventory and operations digitisation for factories.", outcomes: ["Production tracking", "Inventory control", "Quality reporting"] },
  { icon: Truck, title: "Logistics & Supply Chain", desc: "Tracking, dispatch and fleet management systems.", outcomes: ["Live tracking", "Dispatch ops", "Driver apps"] },
  { icon: Building2, title: "Government & NGOs", desc: "Public-sector portals, citizen services and reporting tools.", outcomes: ["Citizen portals", "Reporting dashboards", "Survey tools"] },
];

const stats = [
  { value: "10+", label: "Years of experience" },
  { value: "64", label: "Districts served" },
  { value: "200+", label: "Projects delivered" },
  { value: "98%", label: "Client retention" },
];

function Industries() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Deep expertise across the industries that shape Bangladesh."
        subtitle="From media and retail to government and healthcare — our team brings sector-specific knowledge to every engagement."
      />

      <section className="pb-10">
        <div className="container-tight grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl glass-card p-6 text-center">
              <div className="font-display text-3xl font-semibold text-primary">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container-tight grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {industries.map((i) => (
            <div key={i.title} className="rounded-2xl glass-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <i.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{i.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.desc}</p>
              <ul className="mt-4 space-y-1.5">
                {i.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-xs text-foreground/80">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="container-tight mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-10 text-center text-primary-foreground shadow-glow md:p-14">
            <Sparkles className="mx-auto h-8 w-8 opacity-90" />
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Don't see your industry?</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
              We've worked across more sectors than we can list. Tell us about yours — we adapt fast.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-elegant transition-all hover:-translate-y-0.5">
                Discuss your industry <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10">
                Explore services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
