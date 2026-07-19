import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('professional calculator uses consent-aware GA4 without financial parameters', async () => {
  const root = new URL('../../', import.meta.url);
  const html = await readFile(new URL('index.html', root), 'utf8');
  const analytics = await readFile(new URL('professional-analytics.js', root), 'utf8');

  assert.match(html, /script type="module" src="professional-analytics\.js"/);
  assert.match(analytics, /getConsentStatus/);
  assert.match(analytics, /setConsentStatus/);
  assert.match(analytics, /professional_calculator_view/);
  assert.match(analytics, /professional_arrived_from_consumer/);
  assert.match(analytics, /professional_calculation_completed/);
  assert.match(analytics, /professional_whatsapp_lead_clicked/);
  assert.doesNotMatch(analytics, /annualIncome|lumpSum|monthlyDeposit|message|phone/);
});

test('consumer links identify confirmed arrivals at the professional calculator', async () => {
  const landing = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const check = await readFile(new URL('../check.html', import.meta.url), 'utf8');
  for (const html of [landing, check]) {
    assert.match(html, /href="\.\.\/index\.html\?from=consumer" data-professional-link/);
  }
});
