import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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

export function Header() {
  const [open, setOpen] = useState(false);
  const [venturesOpen, setVenturesOpen] = useState(false);
  const [mobileVenturesOpen, setMobileVenturesOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="container-tight flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={logo}
            alt="YESS Bangla logo"
            className="h-11 w-11 rounded-lg object-contain bg-white p-0.5 shadow-sm"
          />
          <div className="leading-tight">
            <div className="font-display text-base font-bold tracking-tight">YESS Bangla</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Private Limited
            </div>
          </div>
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

          {/* Ventures dropdown */}
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

          <Link
            to="/industries"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "text-primary bg-secondary" }}
          >
            Industries
          </Link>
          <Link
            to="/insights"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "text-primary bg-secondary" }}
          >
            Insights
          </Link>
          <Link
            to="/careers"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "text-primary bg-secondary" }}
          >
            Careers
          </Link>
          <Link
            to="/contact"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "text-primary bg-secondary" }}
          >
            Contact
          </Link>
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
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative grid h-10 w-10 place-items-center rounded-md border border-border lg:hidden overflow-hidden"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={open ? "x" : "menu"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute inset-0 grid place-items-center"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="glass-strong border-t border-glass-border lg:hidden overflow-hidden will-change-[height,opacity]"
          >
            <div className="container-tight flex flex-col gap-1 py-3">
              {nav.slice(0, 3).map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                  activeProps={{ className: "text-primary bg-secondary" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ))}

              {/* Mobile Ventures collapsible */}
              <button
                onClick={() => setMobileVenturesOpen((v) => !v)}
                aria-expanded={mobileVenturesOpen}
                className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <span>Ventures</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileVenturesOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {mobileVenturesOpen && (
                  <motion.div
                    key="mobile-ventures"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="ml-2 flex flex-col gap-0.5 border-l border-border pl-3">
                      {ventures.map((v) => (
                        <Link
                          key={v.slug}
                          to="/ventures/$slug"
                          params={{ slug: v.slug }}
                          onClick={() => setOpen(false)}
                          className="rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary"
                        >
                          {v.title}
                        </Link>
                      ))}
                      <Link
                        to="/projects"
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
                      >
                        View all ventures →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {nav.slice(3).map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                  activeProps={{ className: "text-primary bg-secondary" }}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-foreground px-5 py-2.5 text-center text-sm font-semibold text-background transition-transform active:scale-[0.98]"
              >
                Let's Talk
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
