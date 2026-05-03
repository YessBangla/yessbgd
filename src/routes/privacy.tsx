import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — YESS Bangla" },
      { name: "description", content: "How YESS Bangla Private Limited collects, uses and protects your information." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <section className="py-20">
      <div className="container-tight max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: May 2026</p>

        <div className="prose mt-10 space-y-6 text-sm leading-relaxed text-foreground/90">
          <p>YESS Bangla Private Limited ("we", "our") respects your privacy. This policy explains what information we collect, how we use it, and the choices you have.</p>

          <h2 className="font-display text-xl font-semibold">Information we collect</h2>
          <p>We collect contact details you provide via forms (name, email, phone, company), and standard analytics data (pages visited, device, approximate location) when you use our website.</p>

          <h2 className="font-display text-xl font-semibold">How we use information</h2>
          <p>To respond to enquiries, deliver services, send service updates, improve our website and comply with legal obligations.</p>

          <h2 className="font-display text-xl font-semibold">Sharing</h2>
          <p>We do not sell your data. We share information only with trusted processors (e.g. email and analytics providers) under confidentiality, or where required by law.</p>

          <h2 className="font-display text-xl font-semibold">Data retention</h2>
          <p>We keep personal data only as long as needed to fulfil the purpose it was collected for, then delete or anonymise it.</p>

          <h2 className="font-display text-xl font-semibold">Your rights</h2>
          <p>You may request access, correction or deletion of your personal data at any time by emailing <a className="text-primary underline underline-offset-4" href="mailto:yessbangla.bd@gmail.com">yessbangla.bd@gmail.com</a>.</p>

          <h2 className="font-display text-xl font-semibold">Contact</h2>
          <p>YESS Bangla Private Limited, Block A, Road 3, House 127 (Green View), 1st Floor, Mirpur 12, Dhaka 1216, Bangladesh.</p>
        </div>
      </div>
    </section>
  );
}
