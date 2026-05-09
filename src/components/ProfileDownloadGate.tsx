/**
 * ProfileDownloadGate — premium PIN-protected download dialog for the
 * Yess Bangla company profile PDF. International data-room feel with:
 *
 *   1. Confirm step  → user explicitly sees which language/edition they're
 *                       about to request before being asked for the PIN.
 *   2. PIN step      → 4-digit segmented input with live "X more digits
 *                       needed" hint, shake on incorrect.
 *   3. Verifying     → brief loading state after the 4th digit lands.
 *   4. Ready/Success → success state with download CTA, then auto-close.
 *
 * Access PIN: 7007.
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check, Download, FileText, KeyRound, Languages, Loader2, Lock, ShieldCheck, X } from "lucide-react";

const ACCESS_PIN = "7007";
const DEFAULT_HREF = "/yess-bangla-company-profile.pdf";
const DEFAULT_FILENAME = "yess-bangla-company-profile.pdf";

type Step = "confirm" | "pin" | "verifying" | "ready";
type Edition = "en" | "bn";

interface ProfileDownloadGateProps {
  trigger: (props: { open: () => void }) => React.ReactNode;
  versionLabel: string;
  metaLabel: string;
  /** PDF URL (defaults to English edition). */
  href?: string;
  /** Suggested filename. */
  filename?: string;
  /** Edition label shown in dialog header. */
  editionLabel?: string;
  /** Which edition is being downloaded — drives flag, badge, and tinting. */
  edition?: Edition;
}

const EDITIONS: Record<Edition, { flag: string; code: string; name: string; nameLocal: string }> = {
  en: { flag: "🇬🇧", code: "EN", name: "English", nameLocal: "English" },
  bn: { flag: "🇧🇩", code: "BN", name: "Bangla", nameLocal: "বাংলা" },
};

export function ProfileDownloadGate({
  trigger,
  versionLabel,
  metaLabel,
  href = DEFAULT_HREF,
  filename = DEFAULT_FILENAME,
  editionLabel,
  edition = "en",
}: ProfileDownloadGateProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("confirm");
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const headingId = useId();
  const descId = useId();

  const editionMeta = EDITIONS[edition];
  const editionDisplayName = editionLabel ?? `${editionMeta.name} Edition`;

  const pin = digits.join("");
  const filledCount = digits.filter((d) => d !== "").length;
  const remaining = 4 - filledCount;
  const filled = remaining === 0;

  // Auto-focus the first PIN cell once we transition to the PIN step.
  useEffect(() => {
    if (!open || step !== "pin") return;
    const idx = digits.findIndex((d) => d === "");
    inputs.current[idx === -1 ? 0 : idx]?.focus();
  }, [open, step, digits]);

  // Esc to close + scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAndReset();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const closeAndReset = () => {
    setOpen(false);
    // delay state reset so exit animation feels clean
    setTimeout(() => {
      setStep("confirm");
      setDigits(["", "", "", ""]);
      setError(null);
    }, 220);
  };

  const tryUnlock = (candidate: string) => {
    if (candidate.length < 4) return;
    setStep("verifying");
    // Brief delay so the user perceives "verification" rather than instant flip.
    window.setTimeout(() => {
      if (candidate === ACCESS_PIN) {
        setError(null);
        setStep("ready");
      } else {
        setShake(true);
        setError(t("gate.incorrect"));
        setStep("pin");
        setTimeout(() => {
          setShake(false);
          setDigits(["", "", "", ""]);
          inputs.current[0]?.focus();
        }, 320);
      }
    }, 480);
  };

  const handleChange = (i: number, raw: string) => {
    const v = raw.replace(/\D/g, "").slice(0, 1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    setError(null);
    if (v && i < 3) inputs.current[i + 1]?.focus();
    if (next.every((d) => d !== "")) tryUnlock(next.join(""));
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < 3) {
      inputs.current[i + 1]?.focus();
    } else if (e.key === "Enter") {
      tryUnlock(pin);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const data = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!data) return;
    e.preventDefault();
    const next = ["", "", "", ""];
    for (let i = 0; i < data.length; i++) next[i] = data[i];
    setDigits(next);
    if (data.length === 4) tryUnlock(data);
    else inputs.current[data.length]?.focus();
  };

  const downloadHref = useMemo(() => href, [href]);

  // ----- Headline + sub copy per step ---------------------------------------
  const heading =
    step === "ready"
      ? t("gate.readyTitle")
      : step === "verifying"
        ? t("gate.verifying")
        : step === "pin"
          ? t("gate.pinTitle")
          : t("gate.confirmTitle");

  const sub =
    step === "ready"
      ? t("gate.readySubtitle", { edition: editionDisplayName })
      : step === "verifying"
        ? t("gate.preparing")
        : step === "pin"
          ? t("gate.pinSubtitle", { edition: editionDisplayName })
          : t("gate.confirmSubtitle");

  const kicker =
    step === "ready"
      ? t("gate.accessGranted")
      : t("gate.confidential");

  return (
    <>
      {trigger({ open: () => setOpen(true) })}

      {open && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6 sm:px-6"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeAndReset();
          }}
        >
          {/* Backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 bg-foreground/55 backdrop-blur-md animate-fade-in"
          />

          {/* Dialog */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            aria-describedby={descId}
            lang={edition}
            className={[
              "relative w-full max-w-md overflow-hidden rounded-3xl border border-border/60",
              "bg-background/95 shadow-[0_30px_80px_-20px_rgba(2,8,23,0.45)]",
              "animate-scale-in",
              shake ? "animate-[shake_0.32s_ease-in-out]" : "",
            ].join(" ")}
            style={{ animationDuration: "240ms" }}
          >
            {/* Decorative top band */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-primary/25 to-accent/25 blur-3xl"
            />

            <button
              type="button"
              onClick={closeAndReset}
              aria-label={t("gate.close")}
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            <div className="relative px-6 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-9">
              {/* Header — seal + edition flag chip always visible so the user
                   can never lose track of which file they're getting. */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div
                    aria-hidden
                    className="absolute inset-0 -m-1 rounded-2xl bg-gradient-to-br from-primary/40 to-accent/40 blur-md"
                  />
                  <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                    {step === "ready" ? (
                      <Check className="h-5 w-5" aria-hidden />
                    ) : step === "verifying" ? (
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    ) : (
                      <Lock className="h-5 w-5" aria-hidden />
                    )}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                    {kicker}
                  </p>
                  <h2
                    id={headingId}
                    className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
                  >
                    {heading}
                  </h2>
                  <p id={descId} className="mt-1 text-sm text-muted-foreground">
                    {sub}
                  </p>
                </div>
                {/* Persistent edition flag chip in the corner */}
                <span
                  className="ml-1 inline-flex shrink-0 items-center gap-1 self-start rounded-full border border-border/70 bg-background/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/85 shadow-sm"
                  aria-label={`${editionMeta.name} edition`}
                >
                  <span aria-hidden className="text-base leading-none">{editionMeta.flag}</span>
                  {editionMeta.code}
                </span>
              </div>

              {/* ============ STEP: CONFIRM ============ */}
              {step === "confirm" && (
                <div className="mt-6">
                  <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/30">
                    <div className="flex items-center gap-3 border-b border-border/60 bg-background/60 px-4 py-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                        <FileText className="h-5 w-5" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-sm font-semibold text-foreground">
                          Yess Bangla — Company Profile
                        </p>
                        <p className="mt-0.5 break-words text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                          {versionLabel}
                        </p>
                      </div>
                    </div>
                    <dl className="grid grid-cols-2 gap-px bg-border/60 text-sm">
                      <ConfirmRow
                        label={t("gate.language")}
                        value={
                          <span className="inline-flex items-center gap-1.5">
                            <span aria-hidden className="text-base leading-none">{editionMeta.flag}</span>
                            <span className="font-semibold">{editionMeta.code}</span>
                            <span className="text-muted-foreground">· {editionMeta.nameLocal}</span>
                          </span>
                        }
                        icon={<Languages className="h-3.5 w-3.5" aria-hidden />}
                      />
                      <ConfirmRow
                        label={t("gate.edition")}
                        value={<span className="font-semibold">{editionDisplayName}</span>}
                      />
                      <ConfirmRow
                        label={t("gate.format")}
                        value="PDF · A4"
                      />
                      <ConfirmRow
                        label={t("gate.pages")}
                        value={metaLabel}
                      />
                    </dl>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>{t("gate.confidentialNote")}</span>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={closeAndReset}
                      className="inline-flex flex-1 items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      {t("gate.cancel")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep("pin")}
                      className="inline-flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      {t("gate.continue")} <ArrowRight className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>
              )}

              {/* ============ STEP: PIN ============ */}
              {step === "pin" && (
                <div className="mt-6">
                  <label
                    htmlFor={`${headingId}-pin-0`}
                    className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {t("gate.pinLabel")}
                  </label>
                  <div
                    role="group"
                    aria-label={t("gate.pinLabel")}
                    className="mt-2 flex items-center justify-between gap-2 sm:gap-3"
                  >
                    {digits.map((d, i) => (
                      <input
                        key={i}
                        id={i === 0 ? `${headingId}-pin-0` : undefined}
                        ref={(el) => { inputs.current[i] = el; }}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={handlePaste}
                        aria-label={`PIN digit ${i + 1}`}
                        aria-invalid={Boolean(error)}
                        className={[
                          "h-14 w-full rounded-2xl border bg-background text-center font-display text-2xl font-semibold tabular-nums tracking-tight",
                          "transition-all focus:outline-none focus:ring-2 focus:ring-primary/40",
                          d ? "border-primary/60 shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_8%,transparent)]" : "border-border",
                          error ? "border-destructive/70 text-destructive" : "",
                        ].join(" ")}
                      />
                    ))}
                  </div>

                  {/* Live status: remaining digit count OR error */}
                  <div className="mt-3 min-h-[1.5rem] text-sm" aria-live="polite">
                    {error ? (
                      <p className="font-medium text-destructive">{error}</p>
                    ) : remaining > 0 ? (
                      <p className="text-muted-foreground">
                        {remaining === 1
                          ? t("gate.remainingOne", { count: remaining })
                          : t("gate.remainingOther", { count: remaining })}
                      </p>
                    ) : (
                      <p className="text-muted-foreground">·</p>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {t("gate.noPin")}{" "}
                    <a
                      href="mailto:info@yessbangla.com"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      info@yessbangla.com
                    </a>
                    .
                  </p>

                  <div className="mt-5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setStep("confirm"); setDigits(["", "", "", ""]); setError(null); }}
                      className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      {t("gate.back")}
                    </button>
                    <button
                      type="button"
                      onClick={() => tryUnlock(pin)}
                      disabled={!filled}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                    >
                      <KeyRound className="h-4 w-4" aria-hidden />
                      {t("gate.unlock")}
                    </button>
                  </div>

                  <div className="mt-5 flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>{t("gate.confidentialNote")}</span>
                  </div>
                </div>
              )}

              {/* ============ STEP: VERIFYING ============ */}
              {step === "verifying" && (
                <div className="mt-8 grid place-items-center gap-3 py-8 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                    <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
                  </div>
                  <p className="font-display text-base font-semibold text-foreground">
                    {t("gate.verifying")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("gate.preparing")}
                  </p>
                </div>
              )}

              {/* ============ STEP: READY ============ */}
              {step === "ready" && (
                <div className="mt-6">
                  <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-display text-sm font-semibold text-foreground">
                          {editionDisplayName} · PDF
                        </p>
                        <p className="mt-0.5 break-words text-xs text-muted-foreground">{metaLabel}</p>
                        <p className="mt-0.5 break-words text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                          {versionLabel}
                        </p>
                      </div>
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                        <Download className="h-5 w-5" aria-hidden />
                      </div>
                    </div>
                  </div>

                  <a
                    href={downloadHref}
                    download={filename}
                    onClick={() => setTimeout(closeAndReset, 600)}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {t("gate.downloadPdf")} <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>

                  <p className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {t("gate.footer")}
                  </p>
                </div>
              )}
            </div>
          </div>

          <style>{`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              20% { transform: translateX(-6px); }
              40% { transform: translateX(6px); }
              60% { transform: translateX(-4px); }
              80% { transform: translateX(4px); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

function ConfirmRow({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 bg-background/80 px-4 py-3">
      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
        {icon}
        {label}
      </dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}
