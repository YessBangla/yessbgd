import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — YESS Bangla" },
      { name: "description", content: "Get in touch with YESS Bangla Private Limited — Mirpur, Dhaka. Phone, email and inquiry form." },
      { property: "og:title", content: "Contact YESS Bangla" },
      { property: "og:description", content: "Reach our team in Mirpur, Dhaka." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <section className="bg-gradient-hero py-20 text-primary-foreground">
        <div className="container-tight max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Contact us</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Let's build something great together.
          </h1>
          <p className="mt-5 text-primary-foreground/80">
            Tell us about your project and our team will get back to you within one business day.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-tight grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: MapPin, title: "Office Address", value: "Block A, Road 3, House 127 (Green View), 1st Floor, Mirpur 12, Dhaka 1216" },
              { icon: Phone, title: "Phone", value: "+880 1805-464340", href: "tel:+8801805464340" },
              { icon: Mail, title: "Email", value: "yessbangla.bd@gmail.com", href: "mailto:yessbangla.bd@gmail.com" },
              { icon: Clock, title: "Working Hours", value: "Sat – Thu, 10:00 AM – 6:00 PM" },
            ].map((c) => (
              <div key={c.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.title}</div>
                  {c.href ? (
                    <a href={c.href} className="mt-1 block text-sm font-medium hover:text-primary">{c.value}</a>
                  ) : (
                    <div className="mt-1 text-sm font-medium">{c.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            className="lg:col-span-3 rounded-2xl border border-border bg-card p-8 shadow-elegant"
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          >
            <h2 className="font-display text-2xl font-semibold">Request a callback</h2>
            <p className="mt-1 text-sm text-muted-foreground">Fill in the form and we'll be in touch shortly.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" />
              <Field label="Subject" name="subject" />
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium">Message</label>
              <textarea
                required
                rows={5}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Tell us about your project…"
              />
            </div>
            <button
              type="submit"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
            >
              <Send className="h-4 w-4" /> Send message
            </button>
            {sent && (
              <p className="mt-4 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
                Thank you — your message has been sent. We'll respond shortly.
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-medium" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
