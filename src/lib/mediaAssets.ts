// Bundled site imagery — makes every image that ships with the codebase
// available to the dashboard media gallery and resolvable at runtime.
const ASSET_MODULES = import.meta.glob("@/assets/**/*.{jpg,jpeg,png,webp,svg,avif}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

/** "/src/assets/ventures/yess-food.jpg" -> hashed build URL */
export const BUNDLED_BY_PATH: Record<string, string> = ASSET_MODULES;

/** "yess-food.jpg" -> hashed build URL */
export const BUNDLED_BY_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(ASSET_MODULES).map(([p, url]) => [(p.split("/").pop() ?? p).toLowerCase(), url]),
);

/** Images served straight from /public. */
export const PUBLIC_IMAGES = [
  "/favicon.png",
  "/letterhead-header.png",
  "/letterhead-footer.png",
  "/letterhead-watermark.png",
  "/yess-bangla-logo.jpeg",
  "/yess-bangla-letterhead.jpeg",
];

export type SiteAsset = { ref: string; name: string; folder: string };

/** Canonical list of every image bundled with the portal. */
export function listSiteAssets(): SiteAsset[] {
  const fromAssets = Object.keys(ASSET_MODULES).map((p) => {
    const name = p.split("/").pop() ?? p;
    const folder = p.includes("/assets/ventures/") ? "ventures" : "site";
    return { ref: p, name, folder };
  });
  const fromPublic = PUBLIC_IMAGES.map((p) => ({
    ref: p,
    name: p.replace(/^\//, ""),
    folder: "public",
  }));
  return [...fromAssets, ...fromPublic].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Resolve any stored image reference to a URL usable in the browser.
 * Handles absolute URLs, data/blob URIs, bundled `/src/assets/...` paths,
 * bare file names and `/public` paths.
 */
export function resolveMediaUrl(value: unknown, fallback = ""): string {
  if (typeof value !== "string" || !value.trim()) return fallback;
  const v = value.trim();
  if (/^(https?:)?\/\//.test(v) || v.startsWith("data:") || v.startsWith("blob:")) return v;
  if (BUNDLED_BY_PATH[v]) return BUNDLED_BY_PATH[v];
  const name = (v.split("?")[0].split("/").pop() ?? v).toLowerCase();
  if (BUNDLED_BY_NAME[name]) return BUNDLED_BY_NAME[name];
  if (v.startsWith("/") && !v.startsWith("/src/")) return v;
  return fallback || v;
}
