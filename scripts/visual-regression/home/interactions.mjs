/**
 * Exercises every interaction on the Home screen and captures a screenshot of
 * each state into shots/interactions/.
 *
 *   node scripts/visual-regression/home/interactions.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const URL = process.env.URL ?? "http://localhost:3000";
const OUT = "shots/interactions";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  ...(process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {}),
});
const page = await browser.newPage({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 2,
});
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(400);

const shot = (name) => page.locator(".screen").screenshot({ path: `${OUT}/${name}.png` });
const ok = [];
const fail = [];

async function check(label, fn) {
  try {
    await fn();
    ok.push(label);
  } catch (e) {
    fail.push(`${label}: ${e.message.split("\n")[0]}`);
  }
}

await check("eye toggles the balance mask", async () => {
  const before = await page.locator(".balance__value").count();
  await page.getByRole("button", { name: "Hide balance" }).click();
  await page.waitForTimeout(250);
  if ((await page.locator(".balance__value").count()) !== 0) throw new Error("value still visible");
  if ((await page.locator(".balance__mask").count()) !== 1) throw new Error("mask missing");
  await shot("01-balance-hidden");
  await page.getByRole("button", { name: "Show balance" }).click();
  await page.waitForTimeout(250);
  if ((await page.locator(".balance__value").count()) !== before) throw new Error("not restored");
});

await check("Deposit opens the deposit sheet", async () => {
  await page.getByRole("button", { name: "Deposit", exact: true }).first().click();
  await page.waitForSelector('[role="dialog"]');
  const title = await page.locator(".modal__title").innerText();
  if (!/deposit/i.test(title)) throw new Error(`unexpected title ${title}`);
  await shot("02-deposit-sheet");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
});

await check("Send opens the spend sheet", async () => {
  await page.getByRole("button", { name: "Send", exact: true }).first().click();
  await page.waitForSelector('[role="dialog"]');
  await shot("03-spend-sheet");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
});

await check("Spend FAB opens the spend sheet", async () => {
  await page.getByRole("button", { name: "Spend", exact: true }).click();
  await page.waitForSelector('[role="dialog"]');
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
});

await check("a transaction row opens its detail sheet", async () => {
  await page.locator(".tx").first().click();
  await page.waitForSelector('[role="dialog"]');
  const title = await page.locator(".modal__title").innerText();
  if (!/received/i.test(title)) throw new Error(`unexpected title ${title}`);
  await shot("04-tx-detail");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
});

await check("the bell opens notifications", async () => {
  await page.getByRole("button", { name: /^Notifications/ }).click();
  await page.waitForSelector('[role="dialog"]');
  await shot("05-notifications");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
});

await check("View all opens the full list", async () => {
  await page.getByRole("button", { name: /View all/ }).click();
  await page.waitForSelector('[role="dialog"]');
  const rows = await page.locator('[role="dialog"] .tx').count();
  if (rows < 5) throw new Error(`only ${rows} rows`);
  await shot("06-all-transactions");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
});

await check("the Account tab opens the account sheet", async () => {
  await page.getByRole("button", { name: "Account", exact: true }).click();
  await page.waitForSelector('[role="dialog"]');
  await shot("07-account-sheet");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
});

await check("pull to refresh runs and toasts", async () => {
  const box = await page.locator(".sheet__scroll").boundingBox();
  await page.mouse.move(box.x + 180, box.y + 20);
  await page.mouse.down();
  for (let i = 0; i < 12; i++) {
    await page.mouse.move(box.x + 180, box.y + 20 + i * 12);
    await page.waitForTimeout(16);
  }
  await page.mouse.up();
  await page.waitForSelector(".toast", { timeout: 4000 });
  await shot("08-pull-to-refresh");
  await page.waitForTimeout(2200);
});

await check("the list scrolls under the nav", async () => {
  const can = await page.locator(".sheet__scroll").evaluate((el) => el.scrollHeight > el.clientHeight + 4);
  if (!can) throw new Error("sheet is not scrollable");
  await page.locator(".sheet__scroll").evaluate((el) => {
    el.scrollTop = 200;
  });
  await page.waitForTimeout(400);
  const top = await page.locator(".sheet__scroll").evaluate((el) => el.scrollTop);
  if (top < 100) throw new Error(`scrollTop stayed at ${top}`);
  await shot("09-scrolled");
  await page.locator(".sheet__scroll").evaluate((el) => {
    el.scrollTop = 0;
  });
});

await check("keyboard: Escape closes, focus returns", async () => {
  const trigger = page.locator(".tx").first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector('[role="dialog"]');
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  if ((await page.locator('[role="dialog"]').count()) !== 0) throw new Error("dialog stayed open");
  if (!(await trigger.evaluate((element) => element === document.activeElement))) {
    throw new Error("focus did not return to the trigger");
  }
});

await browser.close();

console.log(`\npassed (${ok.length}):`);
for (const o of ok) console.log("  ✓ " + o);
if (fail.length) {
  console.log(`\nFAILED (${fail.length}):`);
  for (const f of fail) console.log("  ✗ " + f);
  process.exitCode = 1;
} else {
  console.log("\nall interactions OK — screenshots in " + OUT);
}
