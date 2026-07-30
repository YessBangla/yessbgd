import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CMS_TYPES } from "@/lib/cmsSchema";
import {
  LayoutDashboard,
  Briefcase,
  Mail,
  ShieldCheck,
  Database,
  Layers,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  UserRound,
  ListTree,
  Image as ImageIcon,
  Settings,
} from "lucide-react";


type NavLeaf = {
  label: string;
  labelBn: string;
  to: string;
  params?: Record<string, string>;
  icon: typeof LayoutDashboard;
};

type NavGroup = { title: string; items: NavLeaf[] };

const CMS_ICONS: Record<string, typeof Database> = {
  ventures: Briefcase,
  services: Layers,
  industries: Database,
  insights: FileText,
};

function buildNav(): NavGroup[] {
  return [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", labelBn: "ড্যাশবোর্ড", to: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      title: "Content",
      items: [
        { label: "All content", labelBn: "সব কনটেন্ট", to: "/admin/cms", icon: Database },
        ...Object.entries(CMS_TYPES).map(([key, cfg]) => ({
          label: cfg.label,
          labelBn: cfg.labelBn,
          to: "/admin/cms/$type",
          params: { type: key },
          icon: CMS_ICONS[key] ?? Database,
        })),
      ],
    },
    {
      title: "Appearance",
      items: [
        { label: "Pages", labelBn: "সব পেইজ ও নতুন পেইজ", to: "/admin/pages", icon: FileText },
        { label: "Menus", labelBn: "মেনু ও ফুটার", to: "/admin/menus", icon: ListTree },
        { label: "Image gallery", labelBn: "ইমেজ গ্যালারি", to: "/admin/media", icon: ImageIcon },
      ],
    },
    {
      title: "Operations",
      items: [
        { label: "Job applications", labelBn: "চাকরির আবেদন", to: "/admin/applications", icon: Briefcase },
        { label: "Contact messages", labelBn: "যোগাযোগ বার্তা", to: "/admin/messages", icon: Mail },
      ],
    },
    {
      title: "System",
      items: [
        { label: "Site settings", labelBn: "সাইট সেটিংস", to: "/admin/settings", icon: Settings },
        { label: "Audit log", labelBn: "অডিট লগ", to: "/admin/audit", icon: ShieldCheck },
      ],
    },
  ];
}


function useActivePath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

function breadcrumbs(pathname: string): string[] {
  const parts = pathname.replace(/^\/+|\/+$/g, "").split("/");
  return parts.map((p) => (p === "admin" ? "Admin" : p.replace(/-/g, " ")));
}

export function AdminShell({ children, email }: { children: ReactNode; email?: string | null }) {
  const navigate = useNavigate();
  const pathname = useActivePath();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = buildNav();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("admin-sidebar-collapsed") : null;
    if (saved === "1") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      if (typeof window !== "undefined") localStorage.setItem("admin-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const isActive = (item: NavLeaf) => {
    if (item.params?.type) return pathname.startsWith(`/admin/cms/${item.params.type}`);
    if (item.to === "/admin") return pathname === "/admin" || pathname === "/admin/";
    if (item.to === "/admin/cms") return pathname === "/admin/cms";
    return pathname.startsWith(item.to);
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-border/60 px-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
          <LayoutDashboard className="h-4.5 w-4.5" />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate font-display text-sm font-semibold leading-tight">YESS Bangla</div>
            <div className="truncate text-[11px] text-muted-foreground">Control Panel</div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {nav.map((group) => (
          <div key={group.title} className="mb-5">
            {!collapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {group.title}
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <li key={`${item.to}-${item.params?.type ?? ""}`}>
                    <Link
                      to={item.to}
                      params={item.params}
                      title={collapsed ? item.label : undefined}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? "bg-primary/12 font-semibold text-primary"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : ""}`} />
                      {!collapsed && (
                        <span className="min-w-0 flex-1 truncate">
                          {item.label}
                          <span className="block text-[10px] font-normal text-muted-foreground/70">
                            {item.labelBn}
                          </span>
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border/60 p-2">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {!collapsed && <span>View site</span>}
        </Link>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
        <button
          onClick={toggleCollapsed}
          className="mt-1 hidden w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground lg:flex"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background/60">
      {/* Desktop sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 border-r border-border/60 bg-card/70 backdrop-blur-xl transition-all lg:block ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-border/60 bg-card shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border/60 bg-card/70 px-4 backdrop-blur-xl sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <ol className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
              {breadcrumbs(pathname).map((crumb, i, all) => (
                <li key={`${crumb}-${i}`} className="flex items-center gap-1.5 capitalize">
                  {i > 0 && <span className="text-muted-foreground/50">/</span>}
                  <span className={i === all.length - 1 ? "font-semibold text-foreground" : ""}>{crumb}</span>
                </li>
              ))}
            </ol>
          </nav>
          <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/60 py-1 pl-1 pr-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/12 text-primary">
              <UserRound className="h-4 w-4" />
            </span>
            <span className="hidden max-w-[180px] truncate text-xs text-muted-foreground sm:block">
              {email ?? "admin"}
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  titleBn,
  description,
  actions,
}: {
  title: string;
  titleBn?: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
        {titleBn && <p className="text-sm text-muted-foreground">{titleBn}</p>}
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
