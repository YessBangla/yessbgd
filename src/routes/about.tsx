import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Target, Eye, Heart } from "lucide-react";

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
      <section className="bg-gradient-hero py-20 text-primary-foreground">
        <div className="container-tight max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Who we are</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Building Bangladesh's most trusted consulting & IT partner.
          </h1>
          <p className="mt-5 text-primary-foreground/80">
            For over 11 years, YESS Bangla Private Limited has helped businesses convert data into
            strategy and ideas into world-class digital experiences.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-tight grid gap-10 lg:grid-cols-3">
          {[
            { icon: Target, title: "Our Mission", desc: "Empower organisations across Bangladesh with strategic consulting and technology that drives measurable growth." },
            { icon: Eye, title: "Our Vision", desc: "To become the most trusted partner for businesses transitioning into the digital era — locally and globally." },
            { icon: Heart, title: "Our Values", desc: "Integrity, craftsmanship, customer focus and a relentless pursuit of quality in every engagement." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface/50 py-20">
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

          <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant">
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
    </>
  );
}
