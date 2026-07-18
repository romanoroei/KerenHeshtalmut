import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('הכפתורים נטענים מ-bundle רגיל ללא script inline', async () => {
  const landing = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const check = await readFile(new URL('../check.html', import.meta.url), 'utf8');
  assert.match(landing, /href="\.\/check\.html"/);
  assert.doesNotMatch(landing, /href="\.\.\/index\.html"/);
  assert.match(check, /script defer src="\.\/ui\/app\.bundle\.js\?v=\d+-\d+"/);
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
  assert.equal((html.match(/type="radio" name="fundStatus"/g) || []).length, 2);
  assert.match(html, /value="existing"/);
  assert.doesNotMatch(html, /לא נזילה|נזילה|לא בטוח אם היא נזילה/);
  assert.match(html, /כמה הפקדת לקרן שלך השנה/);
  assert.match(html, /מה הצבירה הנוכחית בקרן\? \(כולל הפקדות השנה\)/);
  assert.equal((html.match(/type="checkbox" name="goal"/g) || []).length, 4);
  assert.match(html, /id="recommendation-steps"/);
  assert.match(html, /id="existingBalance"/);
  assert.match(html, /class="deposit-mini"/);
  assert.match(html, /הופקד השנה/);
  assert.match(html, /צפוי עד סוף השנה כולל הוראת קבע/);
  assert.doesNotMatch(html, /הפקדה חודשית להמחשה/);
  assert.match(html, /id="growth-detail"/);
  assert.match(html, /id="growth-chart"/);
  assert.doesNotMatch(html, /id="growth-bars"/);
  assert.ok(html.indexOf('class="whatsapp-card"') < html.indexOf('class="support-grid"'));
  assert.match(html, /id="countdown-days"/);
  assert.match(html, /id="whatsapp-secondary"/);
});

test('מסך הפתיחה אינו מציג תגית צפה ליד תמונת היועץ', async () => {
  const landing = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(landing, /landing-result-chip/);
  assert.match(landing, /landing-assurance/);
});

test('רכיבי הציות של האתר המקצועי זמינים בשני מסכי המחשבון', async () => {
  const landing = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const check = await readFile(new URL('../check.html', import.meta.url), 'utf8');
  const compliance = await readFile(new URL('../ui/compliance.js', import.meta.url), 'utf8');

  for (const html of [landing, check]) {
    assert.match(html, /id="cookieNotice"/);
    assert.match(html, /הודעה על עוגיות/);
    assert.match(html, /id="disclaimer"/);
    assert.match(html, /גילוי נאות/);
    assert.match(html, /href="\.\.\/privacy\.html\?from=consumer"/);
    assert.match(html, /href="\.\.\/accessibility\.html\?from=consumer"/);
    assert.match(html, /script defer src="\.\/ui\/compliance\.js"/);
  }

  assert.match(compliance, /cookieNoticeAccepted/);
  assert.match(compliance, /acceptCookies/);
  assert.match(compliance, /closeCookies/);
});

test('מסך התוצאה מציג יתרה פעם אחת, טיימר חי ו-CTA שני שונה', async () => {
  const html = await readFile(new URL('../check.html', import.meta.url), 'utf8');
  const source = await readFile(new URL('../ui/app.js', import.meta.url), 'utf8');

  assert.equal((html.match(/זה הסכום שעוד ניתן להפקיד עד סוף 2026/g) || []).length, 1);
  assert.doesNotMatch(html, /זהו הסכום שניתן לשקול להפקיד/);
  assert.match(html, /id="countdown-seconds"/);
  assert.ok(html.indexOf('id="countdown-seconds"') < html.indexOf('id="countdown-days"'));
  assert.match(source, /setInterval\(update, 1000\)/);
  assert.match(source, /ההפקדות הצפויות השנה גבוהות מהתקרה המוטבת/);
  assert.match(source, /ניצלת את מלוא התקרה המוטבת לשנת/);
  assert.match(source, /countdown\.hidden = true/);
  assert.match(source, /buildSecondaryCta/);
  assert.match(source, /hasFutureProjection/);
  assert.match(html, /כמה חודשים הופקדו מתחילת השנה\?/);
  assert.match(html, /id="months-deposited-error"/);
  assert.match(source, /מספר חודשים שלם בין 1 ל־12/);
  assert.match(source, /יש לתקן את מספר החודשים/);
  assert.match(source, /תזכורת ל־1\.1\./);
  assert.match(source, /לאחר פרסום התקרה המעודכנת/);
  assert.match(source, /מנהל ההשקעות מייצר תשואה טובה ועקבית ביחס למתחרים/);
  assert.doesNotMatch(source, /מצב הקרן ידוע/);
  assert.doesNotMatch(source, /dynamic-cta-secondary'\)\.textContent = ctaCopy/);
});

test('דפי המדיניות מחזירים למחשבון שממנו הגיע המשתמש', async () => {
  const privacy = await readFile(new URL('../../privacy.html', import.meta.url), 'utf8');
  const accessibility = await readFile(new URL('../../accessibility.html', import.meta.url), 'utf8');
  const returnScript = await readFile(new URL('../../legal-return.js', import.meta.url), 'utf8');

  for (const html of [privacy, accessibility]) {
    assert.match(html, /data-calculator-back/);
    assert.match(html, /script defer src="legal-return\.js"/);
  }
  assert.match(returnScript, /from.*consumer/);
  assert.match(returnScript, /consumer\/index\.html/);
});
