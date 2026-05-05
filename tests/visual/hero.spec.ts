/**
 * Hero visual regression — mobile / tablet / desktop.
 *
 * Captures a pixel snapshot of the homepage hero `<section>` at three
 * canonical breakpoints. Baselines are stored alongside this file under
 * `__screenshots__/`. The first run records baselines; subsequent runs
 * fail on any visual diff above the configured threshold.
 *
 * Run:
 *   bunx playwright install chromium   # one-time
 *   bunx playwright test tests/visual  # compare
 *   bunx playwright test tests/visual --update-snapshots  # accept new baseline
 *
 * Requires Playwright. Install with:  bun add -d @playwright/test
 */
import { test, expect, devices } from "@playwright/test";

const BASE_URL = process.env.PREVIEW_URL ?? "http://localhost:3000";

const VIEWPORTS = [
  { name: "mobile",  width: 390,  height: 844  }, // iPhone 13
  { name: "tablet",  width: 820,  height: 1180 }, // iPad Air
  { name: "desktop", width: 1440, height: 900  }, // standard laptop
] as const;

for (const vp of VIEWPORTS) {
  test(`hero @ ${vp.name} (${vp.width}×${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(BASE_URL, { waitUntil: "networkidle" });

    // Disable animations so snapshots are stable across runs.
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
        }
      `,
    });

    const hero = page.locator("section.hero-section").first();
    await expect(hero).toBeVisible();

    // Wait for hero image to finish loading.
    await page.waitForLoadState("networkidle");

    await expect(hero).toHaveScreenshot(`hero-${vp.name}.png`, {
      maxDiffPixelRatio: 0.01, // tolerate ≤1 % drift (font hinting, etc.)
      animations: "disabled",
      caret: "hide",
    });
  });
}
