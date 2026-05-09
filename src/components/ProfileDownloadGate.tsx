/**
 * ProfileDownloadGate — premium PIN-protected download dialog for the
 * Yess Bangla company profile PDF. Designed to feel like an international
 * data-room handoff: monogrammed seal, classification chip, segmented PIN
 * input, and a quietly confident success state.
 *
 * Access PIN: 7007 (see docs).
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Download, KeyRound, Lock, ShieldCheck, X } from "lucide-react";

const ACCESS_PIN = "7007";
const PDF_HREF = "/yess-bangla-company-profile.pdf";
const PDF_FILENAME = "yess-bangla-company-profile.pdf";

interface ProfileDownloadGateProps {
  /** Triggering button content. Receives an `open` callback. */
  trigger: (props: { open: () => void }) => React.ReactNode;
  /** Display version label, e.g. "v1.1 · Generated 09 May 2026". */
  versionLabel: string;
  /** Page count + size hint, e.g. "17 pages · ~150 KB". */
  metaLabel: string;
}

export function ProfileDownloadGate({
  trigger,
  versionLabel,
  metaLabel,
}: ProfileDownloadGateProps) {
  const [open, setOpen] = useState(false);
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [shake, setShake] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const headingId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const pin = digits.join("");
  const filled = digits.every((d) => d !== "");

  useEffect(() => {
    if (!open) return;
    // Focus first empty cell when opening / after reset
    const idx = digits.findIndex((d) => d === "");
    inputs.current[idx === -1 ? 0 : idx]?.focus();
  }, [open, digits]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAndReset();
    };
    document.addEventListener("keydown", onKey);
    // Lock background scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const closeAndReset = () => {
    setOpen(false);
    setTimeout(() => {
      setDigits(["", "", "", ""]);
      setError(null);
      setUnlocked(false);
    }, 220);
  };

  const tryUnlock = (candidate: string) => {
    if (candidate.length < 4) return;
    if (candidate === ACCESS_PIN) {
      setUnlocked(true);
      setError(null);
    } else {
      setShake(true);
      setError("Incorrect access PIN. Please try again.");
      setTimeout(() => {
        setShake(false);
        setDigits(["", "", "", ""]);
        inputs.current[0]?.focus();
      }, 320);
    }
  };

  const handleChange = (i: number, raw: string) => {
    // Accept only digits; pasting handled separately
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

  const downloadHref = useMemo(() => PDF_HREF, []);

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
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            aria-describedby={descId}
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

            {/* Close */}
            <button
              type="button"
              onClick={closeAndReset}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            <div className="relative px-6 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-9">
              {/* Seal */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div
                    aria-hidden
                    className="absolute inset-0 -m-1 rounded-2xl bg-gradient-to-br from-primary/40 to-accent/40 blur-md"
                  />
                  <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                    {unlocked ? (
                      <Check className="h-5 w-5" aria-hidden />
                    ) : (
                      <Lock className="h-5 w-5" aria-hidden />
                    )}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                    {unlocked ? "Access granted" : "Confidential document"}
                  </p>
                  <h2
                    id={headingId}
                    className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
                  >
                    {unlocked ? "Your download is ready" : "Enter access PIN"}
                  </h2>
                  <p id={descId} className="mt-1 text-sm text-muted-foreground">
                    {unlocked
                      ? "Yess Bangla — Company Profile is now released for download."
                      : "Yess Bangla — Company Profile is shared on a need-to-know basis."}
                  </p>
                </div>
              </div>

              {/* Body */}
              {!unlocked ? (
                <div className="mt-6">
                  <label
                    htmlFor={`${headingId}-pin-0`}
                    className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    4-digit PIN
                  </label>
                  <div
                    role="group"
                    aria-label="Enter 4-digit access PIN"
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

                  <div className="mt-4 min-h-[1.25rem] text-sm" aria-live="polite">
                    {error ? (
                      <p className="text-destructive">{error}</p>
                    ) : (
                      <p className="text-muted-foreground">
                        Don&rsquo;t have a PIN? Email{" "}
                        <a
                          href="mailto:info@yessbangla.com"
                          className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                          info@yessbangla.com
                        </a>
                        .
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => tryUnlock(pin)}
                    disabled={!filled}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    <KeyRound className="h-4 w-4" aria-hidden />
                    Unlock download
                  </button>

                  <div className="mt-5 flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>
                      This document is confidential and provided for evaluation purposes only.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-display text-sm font-semibold text-foreground">
                          Company profile · PDF
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{metaLabel}</p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
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
                    download={PDF_FILENAME}
                    onClick={() => setTimeout(closeAndReset, 600)}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Download PDF <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>

                  <p className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Yess Bangla Private Limited · Dhaka
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tiny shake keyframes scoped via global */}
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
