/**
 * Renders the Home screen at exactly 393×852 and diffs it against the Figma
 * export, so layout drift is caught numerically instead of by eye.
 *
 *   node scripts/visual-regression/home/diff.mjs            # write shots + report
 *   node scripts/visual-regression/home/diff.mjs --open     # also open the diff image
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { readFileSync } from "node:fs";

const URL = process.env.URL ?? "http://localhost:3000";
const OUT = path.resolve("shots");
const REF = path.resolve("reference/home/v1/node-1671-3913.png");

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  // re-use whichever Chromium build is already in the Playwright cache
  ...(process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {}),
});
const page = await browser.newPage({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 1,
});
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(600);

const screen = page.locator(".screen");
await screen.screenshot({ path: path.join(OUT, "home-v1.png") });

await browser.close();

const actual = PNG.sync.read(readFileSync(path.join(OUT, "home-v1.png")));
const expected = PNG.sync.read(readFileSync(REF));

const { width, height } = actual;
const diff = new PNG({ width, height });
const mismatched = pixelmatch(
  actual.data,
  expected.data,
  diff.data,
  width,
  height,
  { threshold: 0.1, includeAA: false, diffColor: [255, 0, 128] },
);

await writeFile(path.join(OUT, "home-v1.diff.png"), PNG.sync.write(diff));

/* --- region report: mean absolute error per band, so we know what to fix --- */
const bands = [
  ["status bar", 0, 54],
  ["header", 54, 108],
  ["card top", 108, 180],
  ["card mid", 180, 300],
  ["card bottom", 300, 369],
  ["sheet head", 369, 424],
  ["list row 1", 424, 500],
  ["list row 2", 500, 575],
  ["list row 3", 575, 640],
  ["list row 4", 640, 712],
  ["nav band", 712, 852],
];

function mae(y0, y1) {
  let sum = 0;
  let n = 0;
  for (let y = y0; y < Math.min(y1, height); y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) {
        sum += Math.abs(actual.data[i + c] - expected.data[i + c]);
        n++;
      }
    }
  }
  return sum / n;
}

const rows = bands.map(([name, y0, y1]) => ({
  region: name,
  meanAbsError: +mae(y0, y1).toFixed(2),
}));

const pct = ((mismatched / (width * height)) * 100).toFixed(2);
console.log(`\nMismatched pixels: ${mismatched} / ${width * height}  (${pct}%)\n`);
console.table(rows);
console.log(`\nshots: ${OUT}/home-v1.png, home-v1.diff.png`);
