import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('הכפתורים נטענים מ-bundle רגיל ללא script inline', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="start" type="button"/);
  assert.match(html, /script defer src="\.\/ui\/app\.bundle\.js"/);
  assert.doesNotMatch(html, /script type="module"/);
  assert.doesNotMatch(html, /<script>(?!\s*<\/script>)/);
});

test('ה-bundle כולל את בקרי הכפתורים ללא import חיצוני', async () => {
  const bundle = await readFile(new URL('../ui/app.bundle.js', import.meta.url), 'utf8');
  assert.match(bundle, /data-next/);
  assert.match(bundle, /data-back/);
  assert.match(bundle, /data-years/);
  assert.doesNotMatch(bundle, /^\s*import\s/m);
});
