import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('הכפתורים נטענים מ-bundle רגיל ללא script inline', async () => {
  const landing = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const check = await readFile(new URL('../check.html', import.meta.url), 'utf8');
  assert.match(landing, /href="\.\/check\.html"/);
  assert.match(landing, /href="\.\.\/index\.html\?from=consumer" data-professional-link>המחשבון המקצועי<\/a>/);
  assert.match(check, /script defer src="\.\/ui\/app\.bundle\.js\?v=\d+-\d+"/);
  assert.doesNotMatch(check, /script type="module" src="\.\/ui\/app\.js"/);
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
  assert.match(source, /event\.key !== 'Enter'/);
  assert.match(source, /currentStep === 0\) transitionTo\(1\)/);
  assert.match(source, /currentStep === 2\) transitionTo\(3\)/);
});

test('השאלון בנוי מארבעה שלבים עם הסתעפות ובחירת מטרות מרובה', async () => {
  const html = await readFile(new URL('../check.html', import.meta.url), 'utf8');
  assert.match(html, /שלב 1 מתוך 4/);
  assert.match(html, /האם יש לך קרן השתלמות/);
  assert.equal((html.match(/type="radio" name="fundStatus"/g) || []).length, 2);
  assert.match(html, /value="existing"/);
  assert.doesNotMatch(html, /לא נזילה|נזילה|לא בטוח אם היא נזילה/);
  assert.match(html, /כמה הפקדת לקרן שלך השנה/);
  assert.match(html, /מה הצבירה הנוכחית בקרן\? <span>\(כולל מה שכבר הופקד השנה\)<\/span>/);
  assert.match(html, /class="balance-forecast-card"/);
  assert.match(html, /רוצה לראות תחזית על הצבירה הקיימת\?/);
  assert.doesNotMatch(html, /תחזית אישית מדויקת יותר|הוספת הצבירה הקיימת תאפשר/);
  assert.doesNotMatch(html, /class="optional-balance"/);
  assert.match(html, /id="stage-restart"[^>]*>.*נקה והתחל מחדש/);
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
  assert.ok(html.indexOf('class="benefit-breakdown"') < html.indexOf('class="whatsapp-card"'));
  assert.ok(html.indexOf('class="whatsapp-card"') < html.indexOf('class="action-plan-card"'));
  assert.match(html, /id="countdown-days"/);
  assert.match(html, /id="whatsapp-secondary"/);
});

test('סטטוס שנת המס מוצג רק כאשר השנה הנוכחית טרם אומתה', async () => {
  const landing = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const check = await readFile(new URL('../check.html', import.meta.url), 'utf8');
  const status = await readFile(new URL('../ui/tax-year-status.js', import.meta.url), 'utf8');
  for (const html of [landing, check]) assert.match(html, /data-tax-year-status hidden/);
  assert.match(status, /banner\.hidden = !context\.isFallback/);
  assert.match(status, /context\.message/);
});

test('מסך הפתיחה אינו מציג תגית צפה ליד תמונת היועץ', async () => {
  const landing = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(landing, /landing-result-chip/);
  assert.match(landing, /landing-assurance/);
});

test('רכיבי הציות של האתר המקצועי זמינים בשני מסכי המחשבון', async () => {
  const landing = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const check = await readFile(new URL('../check.html', import.meta.url), 'utf8');
  const compliance = await readFile(new URL('../analytics/consent.js', import.meta.url), 'utf8');

  for (const html of [landing, check]) {
    assert.match(html, /id="cookieNotice"/);
    assert.match(html, /אפשר לשפר את החוויה\?/);
    assert.match(html, /id="disclaimer"/);
    assert.match(html, /class="disclosure-modal"/);
    assert.match(html, /aria-modal="false"/);
    assert.doesNotMatch(html, /disclosure-modal__backdrop/);
    assert.doesNotMatch(html, /class="legal-sections"/);
    assert.doesNotMatch(html, /class="legal-card"/);
    assert.match(html, /גילוי נאות/);
    assert.match(html, /href="\.\.\/privacy\.html\?from=consumer"/);
    assert.match(html, /href="\.\.\/accessibility\.html\?from=consumer"/);
    assert.match(html, /script type="module" src="\.\/analytics\/bootstrap\.js"/);
  }

  assert.match(compliance, /getConsentStatus/);
  assert.match(compliance, /setConsentStatus/);
  assert.match(compliance, /canUseAnalytics/);
  assert.match(landing, /id="essentialCookies"/);
  assert.match(landing, /landing-advisor-tag[\s\S]*?href="#disclaimer">גילוי נאות/);
  assert.match(check, /heading-disclosure-link" href="#disclaimer">גילוי נאות/);
  assert.doesNotMatch(await readFile(new URL('../styles.css', import.meta.url), 'utf8'), /choice-card:focus-within \{ outline: 3px solid #fbbf24/);
});

test('מסך התוצאה מציג יתרה פעם אחת, טיימר חי ו-CTA שני שונה', async () => {
  const html = await readFile(new URL('../check.html', import.meta.url), 'utf8');
  const source = await readFile(new URL('../ui/app.js', import.meta.url), 'utf8');

  assert.equal((html.match(/זה הסכום שעוד ניתן להפקיד עד סוף <span data-tax-data-year>2026<\/span>/g) || []).length, 1);
  assert.doesNotMatch(html, /זהו הסכום שניתן לשקול להפקיד/);
  assert.match(html, /id="countdown-seconds"/);
  assert.ok(html.indexOf('id="countdown-seconds"') < html.indexOf('id="countdown-days"'));
  assert.match(source, /setInterval\(update, 1000\)/);
  assert.match(source, /ההפקדות הצפויות השנה גבוהות מהתקרה המוטבת/);
  assert.match(source, /ההפקדות השנה גבוהות מהתקרה המוטבת/);
  assert.match(source, /isProjectedOverage/);
  assert.match(source, /taxRatesCopy/);
  assert.match(source, /\.sort\(\(a, b\) => Number\(b\[1\]\) - Number\(a\[1\]\)\)/);
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
  assert.match(source, /אפשרות נוספת לבניית הוראת קבע/);
  assert.match(source, /profile\.goals\.includes\('monthly'\)/);
  assert.match(source, /לאחר פתיחת הקרן:/);
  assert.match(source, /חלופה נוספת: להשלים השנה את מלוא היתרה/);
  assert.match(source, /חלופה נוספת: לאחר פתיחת הקרן/);
  assert.match(source, /result\.overCeiling > 0/);
  assert.match(source, /להפקיד את מלוא התקרה כבר בתחילת השנה/);
  assert.match(source, /לחילופין, /);
  assert.match(source, /מנהל ההשקעות מייצר תשואה טובה ועקבית ביחס למתחרים/);
  assert.doesNotMatch(source, /מצב הקרן ידוע/);
  assert.doesNotMatch(source, /dynamic-cta-secondary'\)\.textContent = ctaCopy/);
});

test('מסך התוצאה מציע שיתוף ב-WhatsApp עם תצוגה מקדימה של המחשבון', async () => {
  const check = await readFile(new URL('../check.html', import.meta.url), 'utf8');
  const landing = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const source = await readFile(new URL('../ui/app.js', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(check, /id="share-benefits"/);
  assert.match(check, /מכירים עצמאי שהבדיקה יכולה לעזור לו\?/);
  assert.match(check, /שתפו את האתר/);
  assert.match(check, /class="restart-link"/);
  assert.doesNotMatch(check, /class="btn btn-share"/);
  assert.doesNotMatch(check, /name="(?:lumpSum|monthlyDeposit|monthsDeposited)"[^>]*value="0"/);
  assert.match(check, /name="monthlyDeposit"[\s\S]*?<p class="field-error" aria-hidden="true"><\/p>[\s\S]*?name="monthsDeposited"/);
  assert.match(source, /כולל הוראת קבע/);
  assert.match(source, /location\.assign\('\.\/check\.html\?restart=1'\)/);
  assert.match(source, /currentStep > 0/);
  assert.doesNotMatch(source, /is-floating/);
  assert.match(styles, /\.tax-countdown \{ position: sticky;/);
  assert.match(styles, /\.tax-countdown \{ border-radius: 13px;/);
  assert.match(styles, /\.whatsapp-card \+ \.action-plan-card \{ margin-top: 30px;/);
  assert.match(styles, /\.recommendation-disclaimer \{ color: var\(--slate-900\)/);
  assert.match(landing, /לחצו כאן ומתחילים בדיקה/);
  assert.match(landing, /תכנית עבודה ברורה/);
  assert.match(landing, /ליווי פיננסי של בעל מקצוע/);
  assert.doesNotMatch(landing, /תוצאה ברורה/);
  assert.doesNotMatch(`${landing}\n${check}\n${source}`, /מחשבון פשוט/);
  assert.match(check, /data-cookie-settings/);
  assert.match(check, /<i class="fab fa-whatsapp"><\/i> WhatsApp/);
  assert.match(source, /button_location: link\.id === 'whatsapp-secondary' \? 'secondary' : 'primary'/);
  assert.doesNotMatch(check, />למחשבון המקצועי/);
  assert.match(landing, /property="og:image" content="https:\/\/romanoroei\.github\.io\/KerenHeshtalmut\/consumer-og-share\.jpg/);
  assert.match(landing, /property="og:image:secure_url"/);
  assert.match(landing, /property="og:image:type" content="image\/jpeg"/);
});

test('דפי המדיניות מחזירים למחשבון שממנו הגיע המשתמש', async () => {
  const privacy = await readFile(new URL('../../privacy.html', import.meta.url), 'utf8');
  const accessibility = await readFile(new URL('../../accessibility.html', import.meta.url), 'utf8');
  const returnScript = await readFile(new URL('../../legal-return.js', import.meta.url), 'utf8');

  for (const html of [privacy, accessibility]) {
    assert.match(html, /data-calculator-back/);
    assert.match(html, /script defer src="legal-return\.js"/);
  }
  assert.match(returnScript, /חזרה למחשבון'/);
  assert.doesNotMatch(returnScript, /מחשבון פשוט/);
  assert.match(returnScript, /from.*consumer/);
  assert.match(returnScript, /consumer\/index\.html/);
});
