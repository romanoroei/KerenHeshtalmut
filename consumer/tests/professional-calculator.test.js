import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('מחשבון הצבירה המקצועי מתחיל מצפי תשואה של 8%', async () => {
  const html = await readFile(new URL('../../index.html', import.meta.url), 'utf8');
  for (const id of ['annualReturnSlider', 'annualReturn', 'annualReturn2Slider', 'annualReturn2']) {
    assert.match(html, new RegExp(`id="${id}"[^>]*value="8"`));
  }
  assert.match(html, /set\('annualReturn',8\); set\('annualReturnSlider',8\)/);
  assert.match(html, /set\('annualReturn2',8\); set\('annualReturn2Slider',8\)/);
});

test('פירוט הטבת המס המקצועי מציג את שתי המדרגות כאשר הניכוי חוצה מדרגה', async () => {
  const html = await readFile(new URL('../../index.html', import.meta.url), 'utf8');
  assert.match(html, /const marginalAfterDeduction=getMarginalRate\(incomeAfterDeduction,year\)/);
  assert.match(html, /ההטבה חושבה לפי מדרגות מס של/);
  assert.match(html, /fmtPct\(marginalAfterDeduction\)/);
});
