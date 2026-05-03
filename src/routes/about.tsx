import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Target, Eye, Heart } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — YESS Bangla Private Limited" },
      { name: "description", content: "Learn about YESS Bangla — our mission, vision and the team behind Bangladesh's trusted consulting and IT partner." },
      { property: "og:title", content: "About YESS Bangla" },
      { property: "og:description", content: "Trusted business consulting and IT partner in Bangladesh." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title="Building Bangladesh's most trusted consulting & IT partner."
        subtitle="For over 11 years, YESS Bangla Private Limited has helped businesses convert data into strategy and ideas into world-class digital experiences."
      />

      <section className="py-20">
        <div className="container-tight grid gap-10 lg:grid-cols-3">
          {[
            { icon: Target, title: "Our Mission", desc: "Empower organisations across Bangladesh with strategic consulting and technology that drives measurable growth." },
            { icon: Eye, title: "Our Vision", desc: "To become the most trusted partner for businesses transitioning into the digital era — locally and globally." },
            { icon: Heart, title: "Our Values", desc: "Integrity, craftsmanship, customer focus and a relentless pursuit of quality in every engagement." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl glass-card p-8 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container-tight grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why choose us</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Customer-centric. Tech-driven. Results-focused.
            </h2>
            <p className="mt-4 text-muted-foreground">
              When you work with YESS Bangla, you get a partner that adapts to your process. We
              build long-term relationships through transparency, accountability and consistently
              high-quality delivery.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Senior consultants with deep industry expertise",
                "Long-term guarantees on every deliverable",
                "Adoption of modern technologies and frameworks",
                "Nation-wide presence across all 64 districts",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl glass-strong p-8 shadow-elegant">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-primary font-display text-xl font-bold text-primary-foreground">
                EH
              </div>
              <div>
                <div className="font-display text-lg font-semibold">Md Enamul Hayder</div>
                <div className="text-sm text-muted-foreground">Managing Director</div>
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              "Our promise is simple — we treat every client's business as if it were our own.
              That's how we've earned trust across Bangladesh for more than a decade, and that's
              how we plan to keep growing alongside the businesses we serve."
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Talk to our team
            </Link>
          </div>
        </div>
      </section>

      {/* LEADERSHIP TEAM */}
      <section className="py-20">
        <div className="container-tight">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Leadership</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Meet the people behind YESS Bangla</h2>
            <p className="mt-4 text-muted-foreground">A multidisciplinary team of strategists, engineers and designers united by craft.</p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Md Enamul Hayder", role: "Managing Director", initials: "EH" },
              { name: "Sadia Rahman", role: "Chief Operating Officer", initials: "SR" },
              { name: "Arif Khan", role: "Head of Engineering", initials: "AK" },
              { name: "Mahfuza Akter", role: "Head of Design", initials: "MA" },
            ].map((m) => (
              <div key={m.name} className="rounded-2xl glass-card p-6 text-center shadow-sm transition-transform hover:-translate-y-1">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-primary font-display text-2xl font-bold text-primary-foreground shadow-glow">
                  {m.initials}
                </div>
                <div className="mt-5 font-display text-base font-semibold">{m.name}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MILESTONES */}
      <section className="py-20">
        <div className="container-tight">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our journey</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Milestones along the way</h2>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="relative space-y-8 border-l-2 border-border pl-8">
              {[
                { year: "2014", title: "YESS Bangla founded", desc: "Started as a small consulting firm in Dhaka with a focus on SME modernisation." },
                { year: "2018", title: "IT services division launched", desc: "Expanded into web, mobile and software engineering for enterprise clients." },
                { year: "2021", title: "Akash TV partnership", desc: "Launched media operations powering Akash News and digital streaming." },
                { year: "2024", title: "Akash OTT goes live", desc: "Bangladesh's new digital streaming platform — built and operated by our team." },
                { year: "2026", title: "Nation-wide footprint", desc: "Active engagements across all 64 districts, with 250+ delivered projects." },
              ].map((m) => (
                <div key={m.year} className="relative">
                  <span className="absolute -left-[42px] grid h-6 w-6 place-items-center rounded-full bg-gradient-primary text-[10px] font-bold text-primary-foreground shadow-glow">●</span>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{m.year}</div>
                  <h3 className="mt-1 font-display text-lg font-semibold">{m.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
