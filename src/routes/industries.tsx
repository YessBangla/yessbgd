import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2, ShoppingCart, GraduationCap, HeartPulse, Landmark,
  Factory, Tv, Truck, ArrowRight,
} from "lucide-react";

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
  { icon: Tv, title: "Media & Broadcasting", desc: "OTT platforms, digital news and content distribution at national scale." },
  { icon: ShoppingCart, title: "Retail & E-commerce", desc: "Storefronts, marketplaces, payments and last-mile delivery integrations." },
  { icon: GraduationCap, title: "Education", desc: "Learning management, school ERPs and digital classroom solutions." },
  { icon: HeartPulse, title: "Healthcare", desc: "Clinic management, telemedicine and patient engagement platforms." },
  { icon: Landmark, title: "Banking & Finance", desc: "Secure portals, dashboards and fintech integrations." },
  { icon: Factory, title: "Manufacturing", desc: "ERP, inventory and operations digitisation for factories." },
  { icon: Truck, title: "Logistics & Supply Chain", desc: "Tracking, dispatch and fleet management systems." },
  { icon: Building2, title: "Government & NGOs", desc: "Public-sector portals, citizen services and reporting tools." },
];

function Industries() {
  return (
    <>
      <section className="bg-gradient-hero py-20 text-primary-foreground">
        <div className="container-tight max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Industries</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Deep expertise across the industries that shape Bangladesh.
          </h1>
          <p className="mt-5 text-primary-foreground/80">
            From media and retail to government and healthcare — our team brings sector-specific
            knowledge to every engagement.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-tight grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {industries.map((i) => (
            <div key={i.title} className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <i.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{i.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.desc}</p>
            </div>
          ))}
        </div>

        <div className="container-tight mt-16 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
            Discuss your industry <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
