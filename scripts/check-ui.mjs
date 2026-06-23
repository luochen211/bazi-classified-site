import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";

const baseUrl = "http://127.0.0.1:5173/bazi-classified-site";
const failures = [];

const waitForServer = async (url, timeoutMs = 30_000) => {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await delay(300);
  }
  throw new Error(`Timed out waiting for ${url}`);
};

const visibleTexts = async (locator) => {
  const texts = [];
  const count = await locator.count();
  for (let index = 0; index < count; index += 1) {
    const item = locator.nth(index);
    if (await item.isVisible()) {
      texts.push((await item.innerText()).trim());
    }
  }
  return texts;
};

const checkMobileDirectoryActiveParent = async (browser) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/advanced/day-hour-classics`, { waitUntil: "networkidle" });

  const activeItems = await visibleTexts(page.locator(".side-directory a.is-active"));
  if (!activeItems.includes("古法实务")) {
    failures.push(`Expected mobile directory parent "古法实务" to be visibly active; got [${activeItems.join(", ")}].`);
  }

  await context.close();
};

const checkModalFocus = async (browser) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/cases`, { waitUntil: "networkidle" });

  const trigger = page.locator(".case-images button").first();
  await trigger.focus();
  await trigger.click();
  await page.waitForSelector('[role="dialog"]');

  const activeClass = await page.evaluate(() => document.activeElement?.className || "");
  if (!String(activeClass).includes("image-modal-close")) {
    failures.push(`Expected image modal close button to receive focus; active class was "${activeClass}".`);
  }

  for (let index = 0; index < 4; index += 1) {
    await page.keyboard.press("Tab");
    const focusInsideDialog = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return Boolean(dialog?.contains(document.activeElement));
    });
    if (!focusInsideDialog) {
      failures.push("Expected Tab focus to stay inside the image modal dialog.");
      break;
    }
  }

  await page.keyboard.press("Escape");
  await page.waitForSelector('[role="dialog"]', { state: "detached" });
  const restoredFocus = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") || "");
  if (!restoredFocus.startsWith("查看案例 1 原图")) {
    failures.push(`Expected focus to return to the triggering case image button; active label was "${restoredFocus}".`);
  }

  await context.close();
};

const checkMobileNavOverflowStrategy = async (browser) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 740 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const navOverflowX = await page.locator(".nav").evaluate((node) => getComputedStyle(node).overflowX);

  if (overflow > 0) {
    failures.push(`Expected no page-level horizontal overflow at 320px; got ${overflow}px.`);
  }

  if (!["auto", "scroll"].includes(navOverflowX)) {
    failures.push(`Expected mobile .nav to have an overflow strategy; overflow-x was "${navOverflowX}".`);
  }

  await context.close();
};

const checkSourceLinkSpacing = async (browser) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/cases`, { waitUntil: "networkidle" });

  const styles = await page.locator(".case-lead").evaluate((node) => {
    const style = getComputedStyle(node);
    return { columnGap: style.columnGap, display: style.display, rowGap: style.rowGap };
  });

  if (styles.display !== "flex") {
    failures.push(`Expected .case-lead to lay out adjacent source links with flex; display was "${styles.display}".`);
  }

  if (Number.parseFloat(styles.columnGap) <= 0 || Number.parseFloat(styles.rowGap) <= 0) {
    failures.push(`Expected .case-lead source links to have row/column gaps; got ${JSON.stringify(styles)}.`);
  }

  await context.close();
};

const main = async () => {
  const server = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1"], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  const serverOutput = [];
  server.stdout.on("data", (chunk) => serverOutput.push(chunk.toString()));
  server.stderr.on("data", (chunk) => serverOutput.push(chunk.toString()));

  try {
    await waitForServer(`${baseUrl}/`);
    const browser = await chromium.launch({ headless: true });

    try {
      await checkMobileDirectoryActiveParent(browser);
      await checkModalFocus(browser);
      await checkMobileNavOverflowStrategy(browser);
      await checkSourceLinkSpacing(browser);
    } finally {
      await browser.close();
    }
  } finally {
    server.kill("SIGTERM");
    await delay(500);
  }

  if (failures.length > 0) {
    console.error("UI checks failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    console.error(serverOutput.join(""));
    process.exit(1);
  }

  console.log("UI checks passed.");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
