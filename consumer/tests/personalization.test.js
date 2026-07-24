import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildAdvisorChecks, buildGoalContext, buildGoalHighlights } from '../personalization.js';

const result = { taxYear: 2026, remaining: 10000, overCeiling: 0 };
const profile = (goals, fundStatus = 'existing') => ({ goals, fundStatus });

test('מטרת מס מתמקדת ביתרה ובהטבות', () => {
  assert.match(buildGoalContext(result, profile(['tax'])), /סכום שנשאר.*הטבות המס/);
});

test('מטרת חיסכון מתמקדת בטווח הארוך', () => {
  assert.match(buildGoalContext(result, profile(['saving'])), /לאורך זמן/);
});

test('מטרת הוראת קבע מתמקדת בחלוקה ובהיערכות', () => {
  assert.match(buildGoalContext(result, profile(['monthly'])), /לחלק.*שנה הבאה/);
});

test('מטרת בדיקת דרך מתמקדת בקרן, במסלול ובדמי הניהול', () => {
  assert.match(buildGoalContext(result, profile(['check'])), /קרן, במסלול, בדמי הניהול/);
});

test('כמה מטרות מחזירות פסקה אחת ללא קודים טכניים', () => {
  const copy = buildGoalContext(result, profile(['tax', 'saving', 'check']));
  assert.equal(copy.split('\n').length, 1);
  assert.doesNotMatch(copy, /\btax\b|\bsaving\b|\bmonthly\b|\bcheck\b/);
});

test('ללא מטרה האזור אינו מקבל תוכן', () => {
  assert.equal(buildGoalContext(result, profile([])), '');
});

test('המטרות שנבחרו הופכות לתגיות קצרות עם אייקונים', () => {
  assert.deepEqual(buildGoalHighlights(profile(['tax', 'saving', 'tax', 'unknown'])), [
    { icon: 'fa-receipt', label: 'הטבת המס' },
    { icon: 'fa-chart-line', label: 'הגדלת החיסכון' },
  ]);
});

test('הוראת קבע לאחר ניצול מלא מתייחסת לשנה הבאה', () => {
  assert.match(buildGoalContext({ ...result, remaining: 0 }, profile(['monthly'])), /שנת המס הבאה/);
});

test('מטרת מס מעל התקרה אינה מעודדת הפקדה נוספת', () => {
  const copy = buildGoalContext({ ...result, remaining: 0, overCeiling: 1500 }, profile(['tax']));
  assert.match(copy, /מעל התקרה/);
  assert.match(copy, /לבדוק לפני שמפקידים/);
});

test('מטרת חיסכון ללא קרן מתחילה בפתיחת קרן מתאימה', () => {
  assert.match(buildGoalContext(result, profile(['saving'], 'none')), /פתיחת קרן מתאימה/);
});

test('אזור הבדיקה מציג לכל היותר ארבע נקודות ומשתנה לפי המצב', () => {
  const noFund = buildAdvisorChecks(result, profile(['saving', 'check'], 'none'));
  assert.ok(noFund.length <= 4);
  assert.match(noFund.join(' '), /גוף מנהל/);
  assert.doesNotMatch(noFund.join(' '), /קרן נוספת או ישנה/);
  const over = buildAdvisorChecks({ ...result, overCeiling: 1000 }, profile(['tax']));
  assert.match(over.join(' '), /חלופות.*מעל התקרה/);
});

test('כרטיס השיחה מבהיר במדויק מה ללא עלות', async () => {
  const html = await readFile(new URL('../check.html', import.meta.url), 'utf8');
  assert.match(html, /המעבר על התוצאה והשיחה הראשונית עם רועי הם ללא עלות וללא התחייבות/);
  assert.match(html, /אין חובה לפתוח מוצר, להעביר קרן או לבצע שינוי/);
  assert.match(html, /אם בהמשך יוצע שירות אחר בתשלום, הוא יוצג ויוסכם מראש לפני ביצוע פעולה/);
  assert.match(html, /שליחת התוצאה ובקשת שיחה ללא עלות/);
  assert.doesNotMatch(html, /כל השירותים ללא עלות/);
});
