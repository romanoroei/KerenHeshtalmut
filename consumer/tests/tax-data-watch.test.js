import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('הבדיקה השנתית מתריעה בלבד ואינה מפרסמת נתונים', async () => {
  const workflow = await readFile(new URL('../../.github/workflows/tax-data-watch.yml', import.meta.url), 'utf8');
  assert.match(workflow, /schedule:/);
  assert.match(workflow, /latestVerifiedYear \+ 1/);
  assert.match(workflow, /issues: write/);
  assert.match(workflow, /github\.rest\.issues\.create/);
  assert.match(workflow, /לא שינה ולא פרסם אף מספר באתר/);
  assert.doesNotMatch(workflow, /contents: write/);
  assert.doesNotMatch(workflow, /git push|git commit/);
});
