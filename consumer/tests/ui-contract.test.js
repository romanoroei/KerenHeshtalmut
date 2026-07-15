import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('כפתור הפתיחה אינו submit ויכול לפתוח את הטופס לפני טעינת המודולים', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="start" type="button"/);
  assert.match(html, /getElementById\('consumer-form'\)\.hidden=false/);
  assert.match(html, /script type="module" src="\.\/ui\/app\.js"/);
});
