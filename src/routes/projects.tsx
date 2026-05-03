import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ventures } from "@/data/ventures";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Our Ventures — YESS Bangla" },
      { name: "description", content: "Explore the ventures of Yess Bangla Private Limited — Yess Soft, Akash TV, Akash OTT, The Daily Akash, Yess Organic Haat, Yess Service, Yess Host, Yess Event, Yess Model, Yess Food and Yess All in One Solution." },
      { property: "og:title", content: "Our Ventures — YESS Bangla" },
      { property: "og:description", content: "A diversified portfolio of technology, media, lifestyle and service ventures." },
    ],
  }),
  component: Projects,
});

function Projects() {
  return (
    <>
      <PageHero
        eyebrow="Our ventures"
        title="A diversified portfolio building Bangladesh's future."
        subtitle="From technology and media to lifestyle and services — Yess Bangla Private Limited operates a growing family of ventures committed to quality, innovation and impact."
      />

      <section className="py-20">
        <div className="container-tight grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ventures.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.slug} delay={i * 0.05}>
                <Link
                  to="/ventures/$slug"
                  params={{ slug: v.slug }}
                  className="group block h-full overflow-hidden rounded-2xl glass-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-elegant"
                >
                  <div className={`relative h-40 bg-gradient-to-br ${v.color}`}>
                    <div className="absolute inset-0 grid-pattern opacity-30" />
                    <div className="absolute inset-0 grid place-items-center">
                      <Icon className="h-14 w-14 text-primary-foreground/95" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">{v.category}</p>
                    <h3 className="mt-2 font-display text-xl font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{v.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                      Learn more <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="py-16">
        <div className="container-tight grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { v: "11", l: "Active ventures" },
            { v: "10+", l: "Years in market" },
            { v: "64", l: "Districts reached" },
            { v: "1M+", l: "End users served" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl glass-card p-6 text-center">
              <div className="font-display text-3xl font-semibold text-primary">{s.v}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="container-tight">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-10 text-center text-primary-foreground shadow-glow md:p-14">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Want to build the next venture with us?</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
              We partner with founders, investors and corporates to launch and scale ambitious products. Let's talk.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-elegant transition-all hover:-translate-y-0.5">
                Partner with us <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10">
                See our services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
