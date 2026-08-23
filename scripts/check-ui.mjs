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

const checkWorkbenchFlow = async (browser) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();

  try {
    await page.goto(`${baseUrl}/workbench`, { waitUntil: "networkidle" });

    const emptyState = page.locator(".workbench-empty-state");
    if (!(await emptyState.isVisible())) {
      failures.push("Expected a fresh workbench browser context to open in the empty state.");
      return;
    }

    if (!(await emptyState.getByText("从一个真实问题开始", { exact: true }).isVisible())) {
      failures.push('Expected the workbench empty state to explain "从一个真实问题开始".');
    }

    await emptyState.getByRole("button", { name: "新建第一个命例" }).click();
    await page.waitForSelector('.case-workspace[aria-label="命例编辑区"]');

    const caseName = "UI 验收命例";
    const pillars = ["甲子", "乙丑", "丙寅", "丁卯"];
    const question = "未来一年的事业重心在哪里？";
    const stageFacts = "月令丑土，日主丙火，原局子丑相合。";
    const stageJudgment = "先核对根气和透藏，再判断格局是否成立。";

    await page.getByLabel("命例名称").fill(caseName);
    const pillarInputs = page.locator(".pillar-fields input");
    if ((await pillarInputs.count()) !== pillars.length) {
      failures.push(`Expected four pillar inputs; got ${await pillarInputs.count()}.`);
    } else {
      for (let index = 0; index < pillars.length; index += 1) {
        await pillarInputs.nth(index).fill(pillars[index]);
      }
    }
    await page.locator('.case-identity-fields input[placeholder="只写一个主要问题"]').fill(question);

    await page.locator(".stage-nav button").filter({ hasText: "02" }).click();
    await page.getByRole("heading", { name: "定格局与取用" }).waitFor();
    const stageFields = page.locator(".stage-fields textarea");
    await stageFields.nth(0).fill(stageFacts);
    await stageFields.nth(1).fill(stageJudgment);

    await page.waitForFunction(
      ({ storageKey, caseName, pillars, question, stageFacts, stageJudgment }) => {
        const cases = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
        const saved = cases.find((item) => item.name === caseName);
        return Boolean(
          saved
          && pillars.every((pillar, index) => saved.pillars?.[["year", "month", "day", "hour"][index]] === pillar)
          && saved.question === question
          && saved.stages?.pattern?.facts === stageFacts
          && saved.stages?.pattern?.judgment === stageJudgment
        );
      },
      {
        storageKey: "bazi-personal-workbench.v1",
        caseName,
        pillars,
        question,
        stageFacts,
        stageJudgment,
      },
    );

    await page.reload({ waitUntil: "networkidle" });
    await page.getByLabel("命例名称").waitFor();

    if ((await page.getByLabel("命例名称").inputValue()) !== caseName) {
      failures.push("Expected the case name to persist after refreshing the workbench.");
    }

    const reloadedPillars = await page.locator(".pillar-fields input").evaluateAll((inputs) => inputs.map((input) => input.value));
    if (JSON.stringify(reloadedPillars) !== JSON.stringify(pillars)) {
      failures.push(`Expected all four pillars to persist after refresh; got ${JSON.stringify(reloadedPillars)}.`);
    }

    const reloadedQuestion = await page.locator('.case-identity-fields input[placeholder="只写一个主要问题"]').inputValue();
    if (reloadedQuestion !== question) {
      failures.push(`Expected the question to persist after refresh; got "${reloadedQuestion}".`);
    }

    await page.locator(".stage-nav button").filter({ hasText: "02" }).click();
    await page.getByRole("heading", { name: "定格局与取用" }).waitFor();
    const reloadedStageValues = await page.locator(".stage-fields textarea").evaluateAll((fields) => fields.map((field) => field.value));
    if (reloadedStageValues[0] !== stageFacts || reloadedStageValues[1] !== stageJudgment) {
      failures.push(`Expected stage notes to persist after refresh; got ${JSON.stringify(reloadedStageValues.slice(0, 2))}.`);
    }

    await page.getByRole("button", { name: "标记本步完成" }).click();
    await page.getByRole("button", { name: "已完成，点击重开" }).waitFor();

    const progressText = (await page.locator(".progress-readout").innerText()).replace(/\s+/g, " ").trim();
    if (!progressText.includes("14%") || !progressText.includes("1 / 7 步完成")) {
      failures.push(`Expected completion to advance to 14% and 1 / 7 steps; got "${progressText}".`);
    }

    const savedCompletion = await page.evaluate((storageKey) => {
      const cases = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      return cases[0]?.stages?.pattern?.completed;
    }, "bazi-personal-workbench.v1");
    if (savedCompletion !== true) {
      failures.push("Expected the completed stage to be saved to localStorage.");
    }

    await page.setViewportSize({ width: 320, height: 740 });
    await page.waitForTimeout(100);
    const mobileOverflow = await page.evaluate(() => ({
      body: document.body.scrollWidth - document.body.clientWidth,
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    if (mobileOverflow.body > 0 || mobileOverflow.document > 0) {
      failures.push(`Expected no workbench page-level horizontal overflow at 320px; got ${JSON.stringify(mobileOverflow)}.`);
    }
  } finally {
    await context.close();
  }
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
      await checkWorkbenchFlow(browser);
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
