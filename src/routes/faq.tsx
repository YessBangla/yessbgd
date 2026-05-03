import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — YESS Bangla Private Limited" },
      { name: "description", content: "Answers to the most common questions about YESS Bangla's services, engagement model, pricing and support." },
      { property: "og:title", content: "Frequently Asked Questions — YESS Bangla" },
      { property: "og:description", content: "Everything you need to know about working with us." },
    ],
  }),
  component: FAQ,
});

const faqs = [
  { q: "What services does YESS Bangla offer?", a: "We provide business consulting, web and software development, OTT and media platforms, e-commerce, IT support and One Stop Solution services across Bangladesh." },
  { q: "How do engagements typically start?", a: "We begin with a free discovery call to understand your goals, then share a written proposal with scope, timeline and pricing within one to three business days." },
  { q: "Do you work with clients outside Dhaka?", a: "Yes — we serve clients in all 64 districts of Bangladesh and run remote engagements with international clients as well." },
  { q: "What is your pricing model?", a: "We offer fixed-price project quotes, monthly retainers and dedicated team models. The right model depends on the scope and how mature the requirements are." },
  { q: "Do you provide post-launch support?", a: "Yes. Every project ships with a defined warranty period, and most clients continue with a monthly support and improvement retainer afterwards." },
  { q: "How do you handle data security and confidentiality?", a: "We sign NDAs by default, follow industry security best practices, and keep all client data isolated. For regulated industries we can align to your internal compliance policies." },
  { q: "Can you take over an existing project?", a: "Absolutely. We frequently audit and rescue in-flight projects, then either stabilise them or rebuild from a clean foundation depending on what's most cost-effective." },
];

function FAQ() {
  return (
    <>
      <section className="relative overflow-hidden py-24">
        <div className="container-tight max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Help center</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Frequently asked questions.
          </h1>
          <p className="mt-5 text-muted-foreground">
            Can't find what you're looking for? <Link to="/contact" className="underline underline-offset-4 hover:text-accent">Get in touch</Link> — we usually reply within one business day.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-tight max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-display text-base font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
