import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Loader2, Navigation, Building2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { PageHero } from "@/components/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { COMPANY_CONTACT, phoneHref } from "@/lib/companyContact";

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

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[0-9+\-\s()]*$/, "Use digits, spaces, +, -, ( and ) only")
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(5000, "Please keep it under 5000 characters"),
});

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

type Errors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;

function Contact() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus({ kind: "submitting" });
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    });

    if (error) {
      console.error("Contact submission failed:", error);
      setStatus({
        kind: "error",
        message:
          "We couldn't send your message right now. Please try again or email us directly at yessbangla.bd@gmail.com.",
      });
      return;
    }
    setStatus({ kind: "success" });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <>
      <PageHero
        eyebrow={t("pages.contact.eyebrow")}
        title={t("pages.contact.title")}
        subtitle={t("pages.contact.subtitle")}
      />

      <section className="py-20">
        <div className="container-tight grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: MapPin, title: "Office Address", value: COMPANY_CONTACT.office },
              { icon: Phone, title: "Phone", value: COMPANY_CONTACT.phone.display, href: phoneHref, ariaLabel: `Call ${COMPANY_CONTACT.phone.display}`, tabular: true },
              { icon: Mail, title: "Email", value: COMPANY_CONTACT.email, href: `mailto:${COMPANY_CONTACT.email}` },
              { icon: Clock, title: "Working Hours", value: "Sat – Thu, 10:00 AM – 6:00 PM" },
            ].map((c) => (
              <div key={c.title} className="flex gap-4 rounded-2xl glass-card p-5 shadow-sm">
                <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.title}</div>
                  {c.href ? (
                    <a
                      href={c.href}
                      aria-label={c.ariaLabel}
                      className={`mt-1 block text-sm font-medium hover:text-primary ${c.tabular ? "tabular-nums" : ""}`}
                    >
                      {c.value}
                    </a>
                  ) : (
                    <div className="mt-1 text-sm font-medium">{c.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            className="lg:col-span-3 rounded-2xl glass-card p-8 shadow-elegant"
          >
            <h2 className="font-display text-2xl font-semibold">Request a callback</h2>
            <p className="mt-1 text-sm text-muted-foreground">Fill in the form and we'll be in touch shortly.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full name *" name="name" required error={errors.name} maxLength={100} autoComplete="name" />
              <Field label="Email *" name="email" type="email" required error={errors.email} maxLength={255} autoComplete="email" />
              <Field label="Phone" name="phone" type="tel" error={errors.phone} maxLength={30} autoComplete="tel" />
              <Field label="Subject" name="subject" error={errors.subject} maxLength={150} />
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium" htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                maxLength={5000}
                placeholder="Tell us about your project…"
                className={inputClass(!!errors.message) + " mt-1.5 min-h-[140px] resize-y"}
              />
              {errors.message && (
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status.kind === "submitting"}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-md transition-transform hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100"
            >
              {status.kind === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send message
                </>
              )}
            </button>

            {status.kind === "success" && (
              <p
                role="status"
                className="mt-4 inline-flex items-start gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                Thank you — your message has been received. We'll respond within one business day.
              </p>
            )}
            {status.kind === "error" && (
              <p
                role="alert"
                className="mt-4 inline-flex items-start gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {status.message}
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  maxLength,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  maxLength?: number;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={inputClass(!!error) + " mt-1.5"}
      />
      {error && (
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return (
    "w-full rounded-lg border bg-white/60 backdrop-blur px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 dark:bg-white/5 " +
    (hasError
      ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20"
      : "border-glass-border focus:border-primary focus:ring-primary/20")
  );
}
