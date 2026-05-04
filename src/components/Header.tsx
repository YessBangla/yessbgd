import { Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef, memo } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import logo from "@/assets/yess-bangla-logo.jpeg";
import { ventures } from "@/data/ventures";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Industries" },
  { to: "/insights", label: "Insights" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

// ---- Memoized mobile panel ----------------------------------------------
interface MobilePanelProps {
  onClose: () => void;
  mobileVenturesOpen: boolean;
  toggleMobileVentures: () => void;
  reduceMotion: boolean;
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
}: MobilePanelProps) {
  return (
    <motion.div
      key="mobile-menu"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={panelTransition(reduceMotion)}
      style={{ transformOrigin: "top", willChange: "transform, opacity" }}
      id="mobile-nav-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      className="absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto glass-strong border-t border-glass-border lg:hidden"
    >
      <div className="container-tight flex flex-col gap-1 py-3">
        {nav.slice(0, 3).map((n) => (
          <Link
            key={n.to}
            to={n.to}
            preload="intent"
            onClick={onClose}
            className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary active:bg-secondary"
            activeProps={{ className: "text-primary bg-secondary" }}
            activeOptions={{ exact: n.to === "/" }}
          >
            {n.label}
          </Link>
        ))}

        <button
          type="button"
          onClick={toggleMobileVentures}
          aria-expanded={mobileVenturesOpen}
          className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
        >
          <span>Ventures</span>
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
              {ventures.map((v) => (
                <Link
                  key={v.slug}
                  to="/ventures/$slug"
                  params={{ slug: v.slug }}
                  preload="intent"
                  onClick={onClose}
                  tabIndex={mobileVenturesOpen ? 0 : -1}
                  className="rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary"
                >
                  {v.title}
                </Link>
              ))}
              <Link
                to="/projects"
                preload="intent"
                onClick={onClose}
                tabIndex={mobileVenturesOpen ? 0 : -1}
                className="rounded-md px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
              >
                View all ventures →
              </Link>
            </div>
          </div>
        </div>

        {nav.slice(3).map((n) => (
          <Link
            key={n.to}
            to={n.to}
            preload="intent"
            onClick={onClose}
            className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            activeProps={{ className: "text-primary bg-secondary" }}
          >
            {n.label}
          </Link>
        ))}
        <Link
          to="/contact"
          preload="intent"
          onClick={onClose}
          className="mt-2 rounded-full bg-foreground px-5 py-2.5 text-center text-sm font-semibold text-background transition-transform active:scale-[0.98]"
        >
          Let's Talk
        </Link>
      </div>
    </motion.div>
  );
});

export function Header() {
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

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="container-tight relative flex h-16 items-center justify-between">
        <Link
          to="/"
          className="group relative flex items-center"
          aria-label="YESS Bangla — home"
        >
          <span className="logo-halo pointer-events-none absolute inset-0 -z-10 rounded-2xl" aria-hidden />
          <img
            src={logo}
            alt="YESS Bangla logo"
            width={48}
            height={48}
            decoding="async"
            fetchPriority="high"
            className="logo-mark h-12 w-12 rounded-2xl bg-white object-contain p-1 ring-1 ring-border shadow-md transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "text-primary bg-secondary" }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "text-primary bg-secondary" }}
          >
            About
          </Link>
          <Link
            to="/services"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "text-primary bg-secondary" }}
          >
            Services
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setVenturesOpen(true)}
            onMouseLeave={() => setVenturesOpen(false)}
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-primary bg-secondary" }}
            >
              Ventures <ChevronDown className="h-3.5 w-3.5" />
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
                    View all ventures →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link to="/industries" className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground" activeProps={{ className: "text-primary bg-secondary" }}>Industries</Link>
          <Link to="/insights" className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground" activeProps={{ className: "text-primary bg-secondary" }}>Insights</Link>
          <Link to="/careers" className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground" activeProps={{ className: "text-primary bg-secondary" }}>Careers</Link>
          <Link to="/contact" className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground" activeProps={{ className: "text-primary bg-secondary" }}>Contact</Link>
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-sm transition-all hover:scale-[1.03] hover:shadow-md"
          >
            Let's Talk
          </Link>
        </div>

        <button
          ref={toggleBtnRef}
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          aria-haspopup="menu"
          onClick={toggleMenu}
          className="relative grid h-10 w-10 place-items-center rounded-md border border-border lg:hidden overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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

        <AnimatePresence initial={false}>
          {open && (
            <MobilePanel
              onClose={closeMenu}
              mobileVenturesOpen={mobileVenturesOpen}
              toggleMobileVentures={toggleMobileVentures}
              reduceMotion={reduceMotion}
            />
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
