import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — YESS Bangla" },
      { name: "description", content: "Terms governing the use of YESS Bangla's website and services." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <section className="py-20">
      <div className="container-tight max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: May 2026</p>

        <div className="mt-10 space-y-6 text-sm leading-relaxed text-foreground/90">
          <h2 className="font-display text-xl font-semibold">Acceptance</h2>
          <p>By accessing yessbd.com or engaging YESS Bangla Private Limited for services, you agree to these terms.</p>

          <h2 className="font-display text-xl font-semibold">Services</h2>
          <p>Specific scope, deliverables, timeline and fees for paid engagements are governed by a separate written agreement or statement of work.</p>

          <h2 className="font-display text-xl font-semibold">Intellectual property</h2>
          <p>Website content, brand and designs are the property of YESS Bangla Private Limited. Project deliverables transfer to the client per the terms of each engagement once paid in full.</p>

          <h2 className="font-display text-xl font-semibold">Acceptable use</h2>
          <p>You agree not to misuse the site, attempt to gain unauthorised access, or interfere with its operation.</p>

          <h2 className="font-display text-xl font-semibold">Liability</h2>
          <p>Information on this website is provided "as is". We are not liable for indirect or consequential damages arising from your use of the site.</p>

          <h2 className="font-display text-xl font-semibold">Governing law</h2>
          <p>These terms are governed by the laws of the People's Republic of Bangladesh.</p>

          <h2 className="font-display text-xl font-semibold">Contact</h2>
          <p>For questions about these terms, write to <a className="text-primary underline underline-offset-4" href="mailto:yessbangla.bd@gmail.com">yessbangla.bd@gmail.com</a>.</p>
        </div>
      </div>
    </section>
  );
}
