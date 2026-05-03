import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/yess-bangla-logo.jpeg";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Industries" },
  { to: "/projects", label: "Projects" },
  { to: "/insights", label: "Insights" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
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
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-primary bg-secondary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            className="inline-flex items-center rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
          >
            Let's Talk
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md border border-border lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-tight flex flex-col gap-1 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                activeProps={{ className: "text-primary bg-secondary" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-gradient-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Let's Talk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
