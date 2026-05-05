import { defineConfig } from "@playwright/test";

/**
 * Visual regression config for hero snapshots.
 * Snapshots live under tests/visual/__screenshots__/.
 */
export default defineConfig({
  testDir: "./tests/visual",
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },
  use: {
    baseURL: process.env.PREVIEW_URL ?? "http://localhost:3000",
  },
  webServer: process.env.PREVIEW_URL
    ? undefined
    : {
        command: "bun run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
