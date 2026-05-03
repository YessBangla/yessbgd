import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Calendar } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights & Blog — YESS Bangla" },
      { name: "description", content: "Articles, case studies and industry insights from YESS Bangla's consultants and engineers." },
      { property: "og:title", content: "Insights — YESS Bangla" },
      { property: "og:description", content: "Latest thinking on business strategy and technology in Bangladesh." },
    ],
  }),
  component: Insights,
});

const posts = [
  { tag: "Strategy", date: "April 28, 2026", title: "Digital transformation roadmap for SMEs in Bangladesh", excerpt: "A practical framework Bangladeshi small and mid-sized businesses can use to digitise operations without overspending." },
  { tag: "Technology", date: "April 14, 2026", title: "Building OTT platforms for emerging markets", excerpt: "Lessons from launching Akash OTT — infrastructure, content, and the user experience that matters." },
  { tag: "E-commerce", date: "March 30, 2026", title: "Scaling last-mile delivery across all 64 districts", excerpt: "How a hybrid logistics model unlocked nationwide e-commerce reach for our retail clients." },
  { tag: "Leadership", date: "March 12, 2026", title: "Why customer-centricity beats every other strategy", excerpt: "Our managing director on the operating principles behind a decade of repeat clients." },
  { tag: "IT Services", date: "February 22, 2026", title: "When to build, buy or integrate enterprise software", excerpt: "A decision framework for CTOs evaluating the make-vs-buy question in regulated industries." },
  { tag: "Design", date: "February 5, 2026", title: "Designing trust into financial products", excerpt: "Visual and interaction patterns that drive higher conversion in fintech apps." },
];

function Insights() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Thinking, research & stories from the field."
        subtitle="Practical perspectives on strategy, technology and design from our consultants and engineers."
      />

      <section className="py-20">
        <div className="container-tight grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.title} className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant">
              <div className="flex items-center justify-between text-xs">
                <span className="rounded-full bg-secondary px-3 py-1 font-medium text-primary">{p.tag}</span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {p.date}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold leading-snug">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                Read article <ArrowRight className="h-4 w-4" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
