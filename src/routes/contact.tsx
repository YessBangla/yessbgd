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

      <section className="py-16 md:py-20">
        <div className="container-tight grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl glass-card p-5 shadow-sm">
              <div className="flex gap-4">
                <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Head Office</div>
                  <div className="mt-1 text-sm font-medium leading-relaxed">{COMPANY_CONTACT.office}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("YESS Bangla, Green View, House 127, Road 3, Block A, Mirpur 12, Dhaka 1216, Bangladesh")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15"
                    >
                      <Navigation className="h-3.5 w-3.5" /> Get directions
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Green View House 127 Road 3 Block A Mirpur 12 Dhaka 1216")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary"
                    >
                      Open in Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl glass-card p-5 shadow-sm">
              <div className="flex gap-4">
                <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Corporate Office</div>
                  <div className="mt-1 text-sm font-medium leading-relaxed">{COMPANY_CONTACT.corporateOffice}</div>
                  <div className="mt-3">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("Section 11, Block A, Road 3, Plot 10, Pallabi, Mirpur, Dhaka 1216, Bangladesh")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15"
                    >
                      <Navigation className="h-3.5 w-3.5" /> Get directions
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {[
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
            className="lg:col-span-3 rounded-2xl glass-card p-6 sm:p-8 shadow-elegant"
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

        <div className="container-tight mt-14 md:mt-20">
          <ContactMap />
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

type OfficeKey = "head" | "corporate";

const OFFICES: Record<
  OfficeKey,
  { label: string; address: string; coords: string; embedSrc: string; directions: string }
> = {
  head: {
    label: "Head Office",
    address: COMPANY_CONTACT.office,
    coords: "23.8249° N, 90.3654° E",
    embedSrc:
      "https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d1335.1806239809775!2d90.36537864883196!3d23.824855996977362!3m2!1i1024!2i768!4f13.1!2m1!1syess%20bangla%20private%20limited!5e1!3m2!1sen!2sbd!4v1778393025429!5m2!1sen!2sbd",
    directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      "Yess Bangla Private Limited, Green View, House 127, Road 3, Block A, Mirpur 12, Dhaka 1216"
    )}`,
  },
  corporate: {
    label: "Corporate Office",
    address: COMPANY_CONTACT.corporateOffice,
    coords: "23.8268° N, 90.3640° E",
    embedSrc: `https://www.google.com/maps?q=${encodeURIComponent(
      "Section 11, Block A, Road 3, Plot 10, Pallabi, Mirpur, Dhaka 1216"
    )}&z=17&output=embed`,
    directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      "Section 11, Block A, Road 3, Plot 10, Pallabi, Mirpur, Dhaka 1216"
    )}`,
  },
};

function ContactMap() {
  const [active, setActive] = useState<OfficeKey>("head");
  const office = OFFICES[active];

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Visit us</div>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Find our offices on the map</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Toggle between our Head Office and Corporate Office in Mirpur, Dhaka — both verified on Google Maps.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Select office to view on map"
          className="inline-flex self-start rounded-full border border-glass-border bg-white/60 p-1 shadow-sm backdrop-blur dark:bg-white/5"
        >
          {(Object.keys(OFFICES) as OfficeKey[]).map((key) => {
            const selected = key === active;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(key)}
                className={
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors " +
                  (selected
                    ? "bg-gradient-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-primary")
                }
              >
                {OFFICES[key].label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-glass-border shadow-elegant">
        <iframe
          key={active}
          title={`YESS Bangla — ${office.label}, Mirpur, Dhaka`}
          src={office.embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[360px] w-full md:h-[460px]"
          style={{ border: 0 }}
          allowFullScreen
        />

        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute left-3 top-3 max-w-[calc(100%-1.5rem)] sm:left-4 sm:top-4 sm:max-w-sm"
        >
          <div className="pointer-events-auto flex items-start gap-2.5 rounded-xl border border-glass-border bg-white/95 px-3 py-2.5 shadow-elegant backdrop-blur-md dark:bg-background/90">
            <span className="relative mt-0.5 flex h-2.5 w-2.5 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Navigation className="h-3 w-3" /> Now viewing
              </div>
              <div className="mt-0.5 text-sm font-semibold leading-tight">{office.label}</div>
              <div className="mt-0.5 truncate text-[11px] text-muted-foreground" title={office.address}>
                {office.address}
              </div>
              <div className="mt-0.5 font-mono text-[10px] tabular-nums text-muted-foreground/80">
                GPS · {office.coords}
              </div>
            </div>
          </div>
        </div>

        <a
          href={office.directions}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-lg transition-transform hover:scale-[1.03] sm:bottom-4 sm:right-4"
        >
          <Navigation className="h-3.5 w-3.5" /> Get directions
        </a>
      </div>
    </>
  );
}
