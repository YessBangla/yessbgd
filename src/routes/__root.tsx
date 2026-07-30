import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
// Debug overlay removed for cleaner preview
import { WaterBackground } from "@/components/WaterBackground";
import { ScrollUpDown } from "@/components/ScrollUpDown";
import { LiquidGlassToggle } from "@/components/LiquidGlassToggle";
import { MobileTabBar } from "@/components/MobileTabBar";
import { RouteTransition } from "@/components/RouteTransition";
import { applyHeaderFooterCssVars, loadLogoSettings } from "@/lib/logoSettings";
import { applyIntensity, loadIntensity, applyPalette, loadPalette } from "@/lib/liquidGlass";
import { useTranslation } from "react-i18next";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "YESS Bangla — Business Consulting & IT Solutions in Bangladesh" },
      { name: "description", content: "YESS Bangla Private Limited — international-grade business consulting, IT support, web development, OTT and e-commerce solutions in Bangladesh." },
      { name: "author", content: "YESS Bangla" },
      { property: "og:title", content: "YESS Bangla — Business Consulting & IT Solutions in Bangladesh" },
      { property: "og:description", content: "YESS Bangla Private Limited — international-grade business consulting, IT support, web development, OTT and e-commerce solutions in Bangladesh." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "YESS Bangla — Business Consulting & IT Solutions in Bangladesh" },
      { name: "twitter:description", content: "YESS Bangla Private Limited — international-grade business consulting, IT support, web development, OTT and e-commerce solutions in Bangladesh." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ed7b0e70-8f21-4619-800d-49d37f1d5232/id-preview-219278f6--eec5c403-bd67-49f0-93dd-19e983f9e0a8.lovable.app-1777828486098.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ed7b0e70-8f21-4619-800d-49d37f1d5232/id-preview-219278f6--eec5c403-bd67-49f0-93dd-19e983f9e0a8.lovable.app-1777828486098.png" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { i18n } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } }),
  );
  // Apply persisted per-surface logo tuning (scale + opacity) before paint.
  useEffect(() => {
    applyHeaderFooterCssVars(loadLogoSettings());
    applyIntensity(loadIntensity());
    applyPalette(loadPalette());
  }, []);
  // Mirror the active language onto <html lang> for assistive tech and SEO.
  useEffect(() => {
    const lang = i18n.resolvedLanguage || i18n.language || "en";
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [i18n.resolvedLanguage, i18n.language]);
  return (
    <QueryClientProvider client={queryClient}>
      {isAdmin ? (
        <div className="relative min-h-screen">
          <Outlet />
        </div>
      ) : (
        <div className="relative flex min-h-screen flex-col app-shell">
          <WaterBackground />
          <Header />
          <main className="flex-1">
            <RouteTransition>
              <Outlet />
            </RouteTransition>
          </main>
          <Footer />
          <ScrollUpDown />
          <LiquidGlassToggle />
          <MobileTabBar />
        </div>
      )}
    </QueryClientProvider>
  );

}
