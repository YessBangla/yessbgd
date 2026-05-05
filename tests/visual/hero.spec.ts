/**
 * Hero visual regression — sub-section snapshots.
 *
 * Captures pixel snapshots of distinct hero sub-regions (headline,
 * lede, button group, trust area + its row/divider/list children) at
 * three canonical breakpoints so a rhythm regression in one block
 * doesn't smear diffs across the whole hero.
 *
 * Stable selectors (data-testid):
 *   • hero-headline
 *   • hero-lede
 *   • hero-buttons
 *   • hero-trust-area
 *   • hero-trust-row
 *   • hero-trust-divider
 *   • hero-trust-list
 *
 * Run:
 *   bunx playwright install chromium
 *   bunx playwright test tests/visual
 *   bunx playwright test tests/visual --update-snapshots
 */
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.PREVIEW_URL ?? "http://localhost:3000";

const VIEWPORTS = [
  { name: "mobile",  width: 390,  height: 844  },
  { name: "tablet",  width: 820,  height: 1180 },
  { name: "desktop", width: 1440, height: 900  },
] as const;

const TARGETS = [
  { id: "hero-section",       selector: "section.hero-section" },
  { id: "hero-headline",      selector: '[data-testid="hero-headline"]' },
  { id: "hero-lede",          selector: '[data-testid="hero-lede"]' },
  { id: "hero-buttons",       selector: '[data-testid="hero-buttons"]' },
  { id: "hero-trust-area",    selector: '[data-testid="hero-trust-area"]' },
  { id: "hero-trust-row",     selector: '[data-testid="hero-trust-row"]' },
  { id: "hero-trust-divider", selector: '[data-testid="hero-trust-divider"]' },
  { id: "hero-trust-list",    selector: '[data-testid="hero-trust-list"]' },
] as const;

for (const vp of VIEWPORTS) {
  test.describe(`hero @ ${vp.name} (${vp.width}×${vp.height})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.addStyleTag({
        content: `*, *::before, *::after { animation: none !important; transition: none !important; }`,
      });
      await page.waitForLoadState("networkidle");
    });

    for (const target of TARGETS) {
      test(`${target.id}`, async ({ page }) => {
        const el = page.locator(target.selector).first();

        // Trust divider is hidden on mobile (sm:block) — skip cleanly.
        if (target.id === "hero-trust-divider" && vp.name === "mobile") {
          await expect(el).toBeHidden();
          return;
        }

        await expect(el).toBeVisible();
        await expect(el).toHaveScreenshot(`${target.id}-${vp.name}.png`, {
          maxDiffPixelRatio: 0.01,
          animations: "disabled",
          caret: "hide",
        });
      });
    }
  });
}
