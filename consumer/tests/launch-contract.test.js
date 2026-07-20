import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('SEO metadata and valid JSON-LD exist on both pages', async () => {
  const landing = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const check = await readFile(new URL('../check.html', import.meta.url), 'utf8');
  for (const html of [landing, check]) {
    assert.match(html, /rel="canonical"/); assert.match(html, /property="og:image"/);
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) assert.doesNotThrow(() => JSON.parse(match[1]));
  }
  assert.notEqual(landing.match(/<title>(.*?)<\/title>/)?.[1], check.match(/<title>(.*?)<\/title>/)?.[1]);
  const faq = [...landing.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])).find((item) => item['@type'] === 'FAQPage');
  assert.equal(faq.mainEntity.length, 6);
  faq.mainEntity.forEach((item) => assert.match(landing, new RegExp(item.name.replace(/[?]/g, '\\?'))));
});

test('questionnaire storage is session-only and result shows at most two primary actions', async () => {
  const source = await readFile(new URL('../ui/app.js', import.meta.url), 'utf8');
  const html = await readFile(new URL('../check.html', import.meta.url), 'utf8');
  assert.match(source, /sessionStorage\.setItem\(FORM_STATE_KEY/); assert.doesNotMatch(source, /localStorage\.setItem\(FORM_STATE_KEY/);
  assert.match(source, /stepsForUser\.slice\(0, 2\)/); assert.match(html, /id="more-recommendations"/);
  assert.match(html, /class="optional-balance" open/);
  assert.doesNotMatch(html, /אופציונלי|אפשר להשאיר ריק|לא חובה/);
  assert.match(source, /sessionStorage\.removeItem\(FORM_STATE_KEY\)/);
});
