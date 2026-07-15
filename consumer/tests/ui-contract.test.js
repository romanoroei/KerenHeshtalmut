import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('הכפתורים נטענים מ-bundle רגיל וכפתור הפתיחה זמין מיד', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="start" type="button"/);
  assert.match(html, /getElementById\('consumer-form'\)\.hidden=false/);
  assert.match(html, /script defer src="\.\/ui\/app\.bundle\.js"/);
  assert.doesNotMatch(html, /script type="module"/);
});

test('ה-bundle כולל את בקרי הכפתורים ללא import חיצוני', async () => {
  const bundle = await readFile(new URL('../ui/app.bundle.js', import.meta.url), 'utf8');
  assert.match(bundle, /data-next/);
  assert.match(bundle, /data-back/);
  assert.match(bundle, /projection-years/);
  assert.doesNotMatch(bundle, /^\s*import\s/m);
});
