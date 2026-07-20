import { chromium } from 'file:///C:/Users/roei1/.codex/visualizations/2026/07/15/019f6731-9b9d-7b32-8856-34c323382bb4/playwright-runtime/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const baseUrl = 'http://127.0.0.1:8010/consumer/';
const checkUrl = `${baseUrl}check.html`;
const outputDir = new URL('./', import.meta.url);
await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});
const report = [];

async function completeFlow(page) {
  await page.goto(`${checkUrl}?restart=1`, { waitUntil: 'networkidle' });
  await page.locator('[data-amount="200000"]').click();
  await page.locator('[data-next]').click();
  await page.waitForTimeout(300);
  await page.locator('input[name="fundStatus"][value="existing"]').check({ force: true });
  await page.waitForTimeout(400);
  await page.locator('input[name="depositMethod"][value="monthly"]').check({ force: true });
  await page.locator('#monthlyDeposit').fill('500');
  await page.locator('#monthsDeposited').fill('7');
  await page.locator('.optional-balance').evaluate((element) => { element.open = true; });
  await page.locator('#existingBalance').fill('85000');
  await page.locator('[data-next]').click();
  await page.waitForTimeout(300);
  await page.locator('input[name="goal"][value="tax"]').check({ force: true });
  await page.locator('input[name="goal"][value="saving"]').check({ force: true });
  await page.locator('#submit-check').click();
  await page.locator('#results:not([hidden])').waitFor({ timeout: 5000 });
  await page.waitForTimeout(900);
}

for (const viewport of [{ name: 'mobile', width: 390, height: 844 }, { name: 'tablet', width: 768, height: 1024 }, { name: 'desktop', width: 1440, height: 1000 }]) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (viewport.name !== 'tablet') await page.locator('.landing-hero').screenshot({ path: fileURLToPath(new URL(`${viewport.name}-hero.png`, outputDir)) });
  await page.goto(checkUrl, { waitUntil: 'networkidle' });
  await page.locator('[data-amount="200000"]').click();
  await page.locator('[data-next]').click();
  await page.waitForTimeout(300);
  await page.locator('input[name="fundStatus"][value="existing"]').check({ force: true });
  await page.waitForTimeout(400);
  await page.locator('input[name="depositMethod"][value="lump"]').check({ force: true });
  await page.locator('#lumpSum').fill('12000');
  await page.locator('.optional-balance').evaluate((element) => { element.open = true; });
  await page.locator('#existingBalance').fill('85000');
  if (viewport.name !== 'tablet') await page.locator('.wizard-layout').screenshot({ path: fileURLToPath(new URL(`${viewport.name}-question.png`, outputDir)) });
  await page.reload({ waitUntil: 'networkidle' });
  await completeFlow(page);
  if (viewport.name !== 'tablet') await page.locator('#results').screenshot({ path: fileURLToPath(new URL(`${viewport.name}-result.png`, outputDir)) });
  const finalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  report.push({ viewport, overflow, finalOverflow, consoleErrors });
  await page.close();
}

await writeFile(new URL('qa-report.json', outputDir), JSON.stringify(report, null, 2));
await Promise.race([browser.close(), new Promise((resolve) => setTimeout(resolve, 5000))]);
if (report.some((item) => item.overflow || item.finalOverflow || item.consoleErrors.length)) {
  console.error(JSON.stringify(report, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(report, null, 2));
}
