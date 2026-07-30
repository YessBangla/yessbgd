import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef, memo } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import { useTranslation } from "react-i18next";
import logo from "@/assets/yess-bangla-logo.png";
import { useVentures } from "@/lib/dynamicContent";
import { useMenu } from "@/lib/siteContent";
import { MenuIcon, menuItemAppearance } from "@/lib/menuStyles";

import { LanguageSwitch } from "@/components/LanguageSwitch";
import { ThemePreviewSwitch } from "@/components/ThemePreviewSwitch";

// Nav items reference i18n keys; labels are resolved at render time so they
// re-render when the user toggles language without remounting the header.
const nav = [
  { to: "/", key: "home" },
  { to: "/about", key: "about" },
  { to: "/services", key: "services" },
  { to: "/industries", key: "industries" },
  { to: "/insights", key: "insights" },
  { to: "/careers", key: "careers" },
  { to: "/contact", key: "contact" },
] as const;

// ---- Memoized mobile panel ----------------------------------------------
interface MobilePanelProps {
  onClose: () => void;
  mobileVenturesOpen: boolean;
  toggleMobileVentures: () => void;
  reduceMotion: boolean;
  venturesActive: boolean;
}

const panelTransition = (reduce: boolean): Transition =>
  reduce
    ? { duration: 0 }
    : { duration: 0.26, ease: [0.32, 0.72, 0, 1] };

const MobilePanel = memo(function MobilePanel({
  onClose,
  mobileVenturesOpen,
  toggleMobileVentures,
  reduceMotion,
  venturesActive,
}: MobilePanelProps) {
  const { t } = useTranslation();
  const ventures = useVentures();
  return (
    <motion.div
      key="mobile-menu"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={panelTransition(reduceMotion)}
      style={{ transformOrigin: "top", willChange: "transform, opacity", paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      id="mobile-nav-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain glass-strong border-t border-glass-border shadow-elegant lg:hidden"
    >
      <div className="container-tight flex flex-col gap-1 py-3">
        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t("nav.explore")}
        </p>
        {nav.slice(0, 3).map((n) => (
          <Link
            key={n.to}
            to={n.to}
            preload="intent"
            onClick={onClose}
            className="flex min-h-11 items-center rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors hover:bg-secondary active:bg-secondary"
            activeProps={{ className: "text-primary bg-secondary" }}
            activeOptions={{ exact: n.to === "/" }}
          >
            {t(`nav.${n.key}`)}
          </Link>
        ))}

        <button
          type="button"
          onClick={toggleMobileVentures}
          aria-expanded={mobileVenturesOpen}
          className={`flex min-h-11 items-center justify-between rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors hover:bg-secondary ${venturesActive ? "text-primary bg-secondary" : ""}`}
        >
          <span>{t("nav.ventures")}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${mobileVenturesOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Pre-rendered list — no height:auto measure; uses CSS grid 0fr→1fr trick + transform for GPU-friendly anim */}
        <div
          className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out"
          style={{
            gridTemplateRows: mobileVenturesOpen ? "1fr" : "0fr",
            opacity: mobileVenturesOpen ? 1 : 0,
          }}
          aria-hidden={!mobileVenturesOpen}
        >
          <div className="min-h-0">
            <div className="ml-2 flex flex-col gap-0.5 border-l border-border pl-3 py-1">
              {ventures.map((v) => {
                const Icon = v.icon;
                return (
                  <Link
                    key={v.slug}
                    to="/ventures/$slug"
                    params={{ slug: v.slug }}
                    preload="intent"
                    onClick={onClose}
                    tabIndex={mobileVenturesOpen ? 0 : -1}
                    className="flex min-h-11 items-center gap-3 rounded-xl px-2 py-2 text-[14px] text-foreground/85 transition-colors hover:bg-secondary"
                  >
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${v.color} text-primary-foreground`}>
                      <Icon className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium">{v.title}</span>
                      <span className="block text-[11px] text-muted-foreground truncate">{v.category}</span>
                    </span>
                  </Link>
                );
              })}
              <Link
                to="/projects"
                preload="intent"
                onClick={onClose}
                tabIndex={mobileVenturesOpen ? 0 : -1}
                className="mt-1 rounded-xl px-2 py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-secondary"
              >
                {t("nav.viewAllVentures")}
              </Link>
            </div>
          </div>
        </div>

        <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t("nav.company")}
        </p>
        {nav.slice(3).map((n) => (
          <Link
            key={n.to}
            to={n.to}
            preload="intent"
            onClick={onClose}
            className="flex min-h-11 items-center rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors hover:bg-secondary"
            activeProps={{ className: "text-primary bg-secondary" }}
          >
            {t(`nav.${n.key}`)}
          </Link>
        ))}

        {/* Mobile language switch — kept inside the panel for reachability */}
        <div className="mt-3 flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-3 py-2.5">
          <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t("nav.explore")} · EN / BN
          </span>
          <LanguageSwitch variant="pill" />
        </div>

        <Link
          to="/contact"
          preload="intent"
          onClick={onClose}
          className="mt-3 inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-5 py-3 text-center text-sm font-semibold text-background shadow-sm transition-transform active:scale-[0.98]"
        >
          {t("nav.letsTalk")} →
        </Link>
      </div>
    </motion.div>
  );
});

export function Header() {
  const ventures = useVentures();
  const { t, i18n } = useTranslation();
  const menu = useMenu("header");
  const bn = i18n.language?.startsWith("bn");
  const navLinks: {
    id: string;
    label: string;
    href: string;
    icon?: string | null;
    accent?: string | null;
    itemStyle?: string | null;
    badge?: string | null;
  }[] = menu.length
    ? menu
        .filter((m) => !m.parent_id)
        .map((m) => ({
          id: m.id,
          label: (bn && m.label_bn) || m.label,
          href: m.href,
          icon: m.icon,
          accent: m.accent,
          itemStyle: m.item_style,
          badge: (bn && m.badge_bn) || m.badge,
        }))
    : nav.map((n) => ({ id: n.to, label: t(`nav.${n.key}`), href: n.to }));

  const [open, setOpen] = useState(false);
  const [venturesOpen, setVenturesOpen] = useState(false);
  const [mobileVenturesOpen, setMobileVenturesOpen] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape and restore focus to the toggle
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleBtnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => setOpen((v) => !v), []);
  const toggleMobileVentures = useCallback(() => setMobileVenturesOpen((v) => !v), []);

  const pathname = useLocation({ select: (l) => l.pathname });
  const venturesActive = pathname === "/ventures" || pathname.startsWith("/ventures/") || pathname === "/projects";

  return (
    <header data-on-dark className="sticky top-0 z-50 glass-nav">
      <div className="container-tight relative flex h-16 items-center justify-between">
        <Link
          to="/"
          className="group relative flex items-center"
          aria-label={t("nav.homeAria")}
        >
          <span className="logo-halo pointer-events-none absolute inset-0 -z-10 rounded-2xl" aria-hidden />
          <span className="logo-plate" role="img" aria-label={t("nav.homeAria")}>
            <img
              src={logo}
              srcSet={`${logo} 1x, ${logo} 2x, ${logo} 3x`}
              alt="YESS Bangla — Enterprise Solutions, Media & Technology"
              width={279}
              height={153}
              decoding="async"
              fetchPriority="high"
              data-surface="header"
              style={{ imageRendering: "auto" }}
              className="logo-mark h-8 w-auto max-w-[44vw] bg-transparent object-contain transition-transform duration-300 group-hover:scale-[1.04] [@media(min-width:380px)]:h-9 sm:h-10 lg:h-11 [@media(min-width:1440px)]:h-12"
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((item) =>
            item.href === "/ventures" ? (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setVenturesOpen(true)}
                onMouseLeave={() => setVenturesOpen(false)}
              >
                <Link
                  to="/ventures"
                  className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground ${venturesActive ? "text-primary bg-secondary" : "text-foreground/80"}`}
                >
                  {item.label} <ChevronDown className="h-3.5 w-3.5" />
                </Link>
                {venturesOpen && (
                  <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2">
                    <div className="glass-strong w-[640px] rounded-2xl border border-glass-border p-3 shadow-elegant">
                      <div className="grid grid-cols-2 gap-1">
                        {ventures.map((v) => {
                          const Icon = v.icon;
                          return (
                            <Link
                              key={v.slug}
                              to="/ventures/$slug"
                              params={{ slug: v.slug }}
                              preload="intent"
                              onClick={() => setVenturesOpen(false)}
                              className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-secondary"
                            >
                              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${v.color} text-primary-foreground`}>
                                <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-sm font-semibold">{v.title}</span>
                                <span className="block text-xs text-muted-foreground truncate">{v.category}</span>
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                      <Link
                        to="/projects"
                        onClick={() => setVenturesOpen(false)}
                        className="mt-2 block rounded-xl bg-secondary px-4 py-2.5 text-center text-sm font-semibold text-primary"
                      >
                        {t("nav.viewAllVentures")}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.id}
                to={item.href}
                className={`${menuItemAppearance(item.itemStyle, item.accent).className} hover:bg-secondary hover:text-foreground ${item.accent && item.accent !== "default" ? "" : "text-foreground/80"}`}
                style={menuItemAppearance(item.itemStyle, item.accent).style}
                activeProps={{ className: "text-primary bg-secondary" }}
                activeOptions={item.href === "/" ? { exact: true } : undefined}
              >
                <MenuIcon name={item.icon} className="h-4 w-4" />
                {item.label}
                {item.badge ? (
                  <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ),
          )}
        </nav>


        {/* Right cluster — language + CTA on desktop, compact toggle + hamburger on mobile.
            Keeping the hamburger inside this cluster prevents `justify-between`
            from stranding the language switch in the middle of the bar. */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:inline-flex">
            <LanguageSwitch variant="pill" />
          </div>
          <div className="sm:hidden">
            <LanguageSwitch variant="compact" />
          </div>
          {/* Theme tri-switch (Light / Dark / System) — visible on both mobile top bar and desktop menubar */}
          <ThemePreviewSwitch />
          <div className="hidden lg:block">
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-sm transition-all hover:scale-[1.03] hover:shadow-md"
            >
              {t("nav.letsTalk")}
            </Link>
          </div>

          <button
            ref={toggleBtnRef}
            type="button"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            aria-haspopup="menu"
            onClick={toggleMenu}
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-border/70 bg-background/60 backdrop-blur lg:hidden overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={open ? "x" : "menu"}
              initial={reduceMotion ? { opacity: 0 } : { rotate: -90, opacity: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { rotate: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { rotate: 90, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.16, ease: "easeOut" }}
              className="absolute inset-0 grid place-items-center"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.span>
          </AnimatePresence>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <MobilePanel
              onClose={closeMenu}
              mobileVenturesOpen={mobileVenturesOpen}
              toggleMobileVentures={toggleMobileVentures}
              reduceMotion={reduceMotion}
              venturesActive={venturesActive}
            />
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
