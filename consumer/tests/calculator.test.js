import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateConsumerResult, futureValueOfMonthlyDeposits, normalizeMoney } from '../engine/calculator.js';
import { TAX_DATA_2026 } from '../data/tax-data.js';
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../messages/whatsapp.js';

test('ללא הפקדות', () => assert.equal(calculateConsumerResult({ income: 200000, deposited: 0 }).remaining, 20566));
test('הפקדה חלקית', () => assert.equal(calculateConsumerResult({ income: 200000, deposited: 10000 }).remaining, 10566));
test('ניצול מלא של התקרה', () => assert.equal(calculateConsumerResult({ income: 200000, deposited: 20566 }).remaining, 0));
test('הפקדה מעל התקרה', () => {
  const result = calculateConsumerResult({ income: 200000, deposited: 25000 });
  assert.equal(result.remaining, 0); assert.equal(result.overCeiling, 4434);
});
test('הוראת קבע מעוגלת כלפי מעלה', () => assert.equal(calculateConsumerResult({ income: 200000, deposited: 0 }).suggestedMonthly, 1714));
test('הכנסה נמוכה מגבילה את הניכוי האפשרי', () => {
  const result = calculateConsumerResult({ income: 50000, deposited: 0 });
  assert.equal(result.estimatedTaxBenefit, 225);
});
test('הכנסה מעל התקרה מוגבלת לבסיס המזכה', () => {
  const result = calculateConsumerResult({ income: 500000, deposited: 0 });
  assert.ok(result.estimatedTaxBenefit <= 13203 * 0.35);
});
test('תשואה 0%', () => assert.equal(futureValueOfMonthlyDeposits(1000, 0, 6), 72000));
test('תרחישי 4%, 7% ו-9%', () => {
  const rates = calculateConsumerResult({ income: 200000, deposited: 0 }).projections.map((x) => x.annualRate);
  assert.deepEqual(rates, [0.04, 0.07, 0.09]);
});
test('קלט ריק או לא תקין', () => {
  assert.ok(Number.isNaN(normalizeMoney('')));
  assert.throws(() => calculateConsumerResult({ income: '', deposited: 0 }), TypeError);
  assert.throws(() => calculateConsumerResult({ income: 100000, deposited: '-1' }), TypeError);
});
test('לכל נתון מס יש מקור, שנת מס, תאריך אימות וסטטוס', () => {
  for (const datum of Object.values(TAX_DATA_2026).filter((value) => value && typeof value === 'object')) {
    assert.ok(datum.source); assert.equal(datum.taxYear, 2026); assert.ok(datum.verifiedAt);
    assert.match(datum.status, /^(official|estimate)$/);
  }
});
test('הודעת WhatsApp כוללת את כל נתוני החובה ונשלחת למספר הנכון', () => {
  const result = calculateConsumerResult({ income: 200000, deposited: 10000 });
  const message = buildWhatsAppMessage(result);
  for (const label of ['הכנסה', 'הופקד', 'יתרה לניצול', 'הוראת קבע', 'הערכת הטבת המס']) assert.match(message, new RegExp(label));
  assert.match(buildWhatsAppUrl(result), /^https:\/\/wa\.me\/972528089808\?text=/);
});
