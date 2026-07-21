import { chromium } from 'file:///C:/Users/roei1/.codex/visualizations/2026/07/15/019f6731-9b9d-7b32-8856-34c323382bb4/playwright-runtime/node_modules/playwright/index.mjs';
import { writeFile } from 'node:fs/promises';

const base = 'http://127.0.0.1:8010/consumer/';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const results = [];

async function runFlow(page, options = {}) {
  const { fund = 'existing', method = 'none', lump = 0, monthly = 0, months = 1, balance, income = 200000 } = options;
  await page.goto(`${base}check.html?restart=1`, { waitUntil: 'domcontentloaded' });
  await page.locator('#income').fill(String(income)); await page.locator('[data-next]').click();
  await page.waitForTimeout(240);
  await page.locator(`input[name="fundStatus"][value="${fund}"]`).check({ force: true }); await page.waitForTimeout(450);
  if (fund === 'existing') {
    await page.locator(`input[name="depositMethod"][value="${method}"]`).check({ force: true });
    if (['lump', 'both'].includes(method)) await page.locator('#lumpSum').fill(String(lump));
    if (['monthly', 'both'].includes(method)) { await page.locator('#monthlyDeposit').fill(String(monthly)); await page.locator('#monthsDeposited').fill(String(months)); }
    if (balance !== undefined) await page.locator('#existingBalance').fill(String(balance));
    await page.locator('[data-next]').click();
    await page.waitForTimeout(220);
  }
  await page.locator('input[name="goal"][value="tax"]').check({ force: true });
  await page.locator('#submit-check').click(); await page.locator('#results:not([hidden])').waitFor({ timeout: 5000 });
  return {
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
    primaryActions: await page.locator('#recommendation-steps > li').count(),
    resultTitle: await page.locator('#result-title').textContent(),
  };
}

const scenarios = [
  ['ללא קרן וללא הפקדות', { fund: 'none' }], ['קרן והפקדה חד פעמית', { method: 'lump', lump: 8000 }],
  ['הוראת קבע', { method: 'monthly', monthly: 500, months: 7 }], ['שילוב', { method: 'both', lump: 5000, monthly: 500, months: 7 }],
  ['ניצול מלא', { method: 'lump', lump: 20566 }], ['מעל התקרה', { method: 'lump', lump: 25000 }],
  ['ללא צבירה', { method: 'lump', lump: 3000 }], ['עם צבירה', { method: 'lump', lump: 3000, balance: 100000 }],
];
for (const [name, options] of scenarios) {
  console.log(`START ${name}`);
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } }); const errors = [];
  page.on('pageerror', (error) => errors.push(error.message)); page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  try { results.push({ name, ...(await runFlow(page, options)), errors }); } catch (error) { results.push({ name, error: error.message, errors }); }
  await page.close();
  console.log(`DONE ${name}`);
}
for (const viewport of [{ width: 768, height: 1024 }, { width: 1440, height: 1000 }]) {
  console.log(`START viewport-${viewport.width}`);
  const page = await browser.newPage({ viewport }); results.push({ name: `viewport-${viewport.width}`, ...(await runFlow(page, { method: 'monthly', monthly: 500, months: 7 })) }); await page.close();
  console.log(`DONE viewport-${viewport.width}`);
}

const utility = await browser.newPage({ viewport: { width: 390, height: 844 } });
await utility.goto(`${base}?utm_source=accountant&utm_medium=referral&utm_campaign=partners-2026&utm_content=personal&ref=roynetanel`, { waitUntil: 'domcontentloaded' });
const exactAttribution = JSON.parse(await utility.evaluate(() => sessionStorage.getItem('consumer_attribution')));
await utility.locator('.btn-landing').click({ force: true });
await utility.locator('#income').fill('250000'); await utility.locator('[data-next]').click(); await utility.waitForTimeout(240);
await utility.locator('input[name="fundStatus"][value="existing"]').check({ force: true }); await utility.waitForTimeout(450);
await utility.locator('input[name="depositMethod"][value="lump"]').check({ force: true });
await utility.locator('#lumpSum').fill('8000'); await utility.locator('#existingBalance').fill('8000'); await utility.locator('[data-next]').click(); await utility.waitForTimeout(220);
for (const goal of ['tax', 'saving', 'check']) await utility.locator(`input[name="goal"][value="${goal}"]`).check({ force: true });
await utility.locator('#submit-check').click(); await utility.locator('#results:not([hidden])').waitFor({ timeout: 5000 });
const exactMessage = await utility.locator('#whatsapp').evaluate((link) => new URL(link.href).searchParams.get('text'));
const requiredMessageParts = ['הכנסה שנתית חייבת משוערת: 250,000 ₪', 'צבירה נוכחית בקרן: 8,000 ₪', 'הפקדה שביצעתי השנה: 8,000 ₪', 'סכום מומלץ להפקדה עד סוף 2026: 12,566 ₪', 'הגעתי לבדיקה דרך רועי נתנאל.'];
const forbiddenMessageParts = ['מקור ההגעה', 'accountant', 'referral', 'partners-2026', 'personal', 'roynetanel', 'שווי הטבות המס הכולל', 'הוראת קבע', 'לשקול'];
results.push({ name: 'exact-utm-whatsapp', attribution: exactAttribution, valid: requiredMessageParts.every((part) => exactMessage.includes(part)) && forbiddenMessageParts.every((part) => !exactMessage.includes(part)) });
await utility.evaluate(() => sessionStorage.clear());
await utility.goto(`${base}?utm_source=whatsapp&utm_medium=organic&utm_campaign=launch-2026&ref=accountant-test`, { waitUntil: 'domcontentloaded' });
results.push({ name: 'attribution', value: await utility.evaluate(() => sessionStorage.getItem('consumer_attribution')) });
await utility.locator('#essentialCookies').click(); results.push({ name: 'essential-only', value: await utility.evaluate(() => localStorage.getItem('consumer_analytics_consent')), gaLoaded: await utility.locator('script[src*="googletagmanager"]').count() });
await utility.evaluate(() => { localStorage.removeItem('consumer_analytics_consent'); sessionStorage.clear(); });
await utility.goto(`${base}?utm_source=tiktok&utm_medium=organic&utm_campaign=launch-2026&utm_content=video-1`, { waitUntil: 'domcontentloaded' });
const queuedBeforeConsent = await utility.evaluate(() => sessionStorage.getItem('consumer_pending_analytics_events'));
await utility.locator('.btn-landing').click({ force: true });
await utility.locator('#acceptCookies').click();
await utility.waitForFunction(() => sessionStorage.getItem('consumer_event_landing_view') && sessionStorage.getItem('consumer_event_calculator_started'));
results.push({ name: 'late-consent', queuedBeforeConsent, attribution: await utility.evaluate(() => sessionStorage.getItem('consumer_attribution')), pendingAfterConsent: await utility.evaluate(() => sessionStorage.getItem('consumer_pending_analytics_events')), gaLoaded: await utility.locator('script[src*="googletagmanager"]').count() });
await utility.goto(`${base}check.html?restart=1`); await utility.locator('#income').fill('200000'); await utility.locator('[data-next]').click(); await utility.waitForTimeout(240); await utility.reload(); results.push({ name: 'refresh-restore', restoredIncome: await utility.locator('#income').inputValue(), restoredStep: await utility.locator('#step-copy').textContent() });
for (const query of ['', '?utm_source=whatsapp&utm_medium=organic&utm_campaign=launch-2026&utm_content=status-1', '?utm_source=tiktok&utm_medium=organic&utm_campaign=launch-2026&utm_content=video-1', '?utm_source=accountant&utm_medium=referral&utm_campaign=partners-2026&ref=accountant-test']) {
  await utility.evaluate(() => sessionStorage.clear()); await utility.goto(`${base}${query}`);
  results.push({ name: `marketing-${query || 'direct'}`, overflow: await utility.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), attribution: await utility.evaluate(() => sessionStorage.getItem('consumer_attribution')) });
}
await utility.goto(`${base}admin/link-builder.html`); await utility.locator('[data-template="whatsapp_status"]').click();
const generatedLink = await utility.locator('#generated-url').inputValue(); await utility.locator('#copy-link').click();
results.push({ name: 'link-builder', generatedLink, copied: await utility.locator('#link-feedback').textContent(), openHref: await utility.locator('#open-link').getAttribute('href'), overflow: await utility.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth) });
await utility.locator('#restart').count().catch(() => 0);
await utility.close();
await writeFile(new URL('./launch-qa-report.json', import.meta.url), JSON.stringify(results, null, 2));
await Promise.race([browser.close(), new Promise((resolve) => setTimeout(resolve, 5000))]);
const failures = results.filter((item) => item.error || item.overflow || item.primaryActions > 2 || item.errors?.length || item.name === 'exact-utm-whatsapp' && !item.valid || item.name === 'essential-only' && item.gaLoaded > 0 || item.name === 'late-consent' && (item.gaLoaded !== 1 || item.pendingAfterConsent));
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log(JSON.stringify(results, null, 2));
process.exit(0);
