#!/usr/bin/env node
/**
 * Homepage typography token guard.
 *
 * Scans `src/routes/index.tsx` for inline style declarations of
 * `fontSize`, `lineHeight`, or `letterSpacing` and asserts that they
 * either:
 *   • use a CSS variable token (var(--text-*), var(--hero-rhythm-*)), OR
 *   • use a clamp()-based fluid expression (acceptable for the hero
 *     headline + lede, which are governed by the stricter
 *     check-hero-typography.mjs contract).
 *
 * Hard-coded px / rem values for these three properties are rejected
 * — they break the international fluid type scale.
 *
 * Run via `node scripts/check-homepage-typography.mjs`. Pair it with
 * `scripts/check-hero-typography.mjs` in CI.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = resolve(__dirname, "../src/routes/index.tsx");
const src = readFileSync(file, "utf8");

const PROPS = ["fontSize", "lineHeight", "letterSpacing"];
const failures = [];

for (const prop of PROPS) {
  // Match `prop: "value"` or `prop: value,` inside style={{ ... }} blocks.
  const re = new RegExp(`${prop}\\s*:\\s*"([^"]+)"`, "g");
  let m;
  while ((m = re.exec(src)) !== null) {
    const value = m[1].trim();
    const lineNo = src.slice(0, m.index).split("\n").length;

    const isToken = /var\(--/.test(value);
    const isClamp = /^clamp\(/.test(value);
    const isEmOnly = prop === "letterSpacing" && /^-?\d*\.?\d+em$/.test(value);
    const isUnitlessLh = prop === "lineHeight" && /^\d*\.?\d+$/.test(value);
    const isNormal = value === "normal";

    if (isToken || isClamp || isEmOnly || isUnitlessLh || isNormal) continue;

    failures.push(
      `  • [line ${lineNo}] ${prop}: "${value}" — use a design token (var(--text-*) / var(--hero-rhythm-*)) or clamp() instead of a hard-coded value.`,
    );
  }
}

if (failures.length) {
  console.error("\n✗ Hard-coded typography detected on homepage:\n");
  for (const f of failures) console.error(f);
  console.error(
    "\nReplace with the global type tokens defined in src/styles.css, or wrap in clamp() for fluid behaviour.\n",
  );
  process.exit(1);
}

console.log("✓ Homepage typography uses design tokens (no hard-coded fontSize/lineHeight/letterSpacing).");
