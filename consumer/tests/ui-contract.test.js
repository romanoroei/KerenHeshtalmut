import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('הכפתורים נטענים מ-bundle רגיל ללא script inline', async () => {
  const landing = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const check = await readFile(new URL('../check.html', import.meta.url), 'utf8');
  assert.match(landing, /href="\.\/check\.html"/);
  assert.doesNotMatch(landing, /href="\.\.\/index\.html"/);
  assert.match(check, /script defer src="\.\/ui\/app\.bundle\.js"/);
  assert.doesNotMatch(check, /script type="module"/);
  assert.doesNotMatch(check, /<script>(?!\s*<\/script>)/);
});

test('ה-bundle כולל את בקרי הכפתורים ללא import חיצוני', async () => {
  const bundle = await readFile(new URL('../ui/app.bundle.js', import.meta.url), 'utf8');
  assert.match(bundle, /data-next/);
  assert.match(bundle, /data-back/);
  assert.match(bundle, /data-years/);
  assert.doesNotMatch(bundle, /^\s*import\s/m);
});

test('האתר אינו יכול לסגור את חלון הדפדפן ומגן מפני מעברים כפולים', async () => {
  const source = await readFile(new URL('../ui/app.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /window\.close|self\.close/);
  assert.match(source, /clearTimeout\(advanceTimer\)/);
  assert.match(source, /if \(isSubmitting\) return/);
  assert.match(source, /if \(isTransitioning/);
});

test('השאלון בנוי מארבעה שלבים עם הסתעפות ובחירת מטרות מרובה', async () => {
  const html = await readFile(new URL('../check.html', import.meta.url), 'utf8');
  assert.match(html, /שלב 1 מתוך 4/);
  assert.match(html, /האם יש לך קרן השתלמות/);
  assert.match(html, /כמה הפקדת לקרן שלך השנה/);
  assert.equal((html.match(/type="checkbox" name="goal"/g) || []).length, 4);
  assert.match(html, /id="recommendation-steps"/);
});
