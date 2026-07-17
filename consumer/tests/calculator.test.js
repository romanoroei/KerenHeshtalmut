import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateConsumerResult, capitalGainsExemptionValue, futureValueOfMonthlyDeposits, monthsRemainingInTaxYear, nationalInsuranceDue, normalizeMoney, projectedAnnualDeposits, totalDeposited } from '../engine/calculator.js';
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
test('הפקדה חד־פעמית, הוראת קבע ושילוב מחושבים נכון', () => {
  assert.equal(totalDeposited({ lumpSum: 5000 }), 5000);
  assert.equal(totalDeposited({ monthlyDeposit: 1000, monthsDeposited: 6 }), 6000);
  assert.equal(totalDeposited({ lumpSum: 5000, monthlyDeposit: 1000, monthsDeposited: 6 }), 11000);
});

test('הוראת קבע ממשיכה עד סוף השנה ומופרדת מהסכום שהופקד עד היום', () => {
  assert.equal(projectedAnnualDeposits({ monthlyDeposit: 500, monthsDeposited: 7 }), 6000);
  const result = calculateConsumerResult({ income: 200000, monthlyDeposit: 500, monthsDeposited: 7 });
  assert.equal(result.depositedToDate, 3500);
  assert.equal(result.projectedAnnualDeposited, 6000);
  assert.equal(result.futureScheduledDeposits, 2500);
  assert.equal(result.remaining, 20566 - 6000);
});
test('חודשים שנותרו עד סוף שנת המס 2026', () => {
  assert.equal(monthsRemainingInTaxYear(new Date('2026-07-15T12:00:00')), 6);
  assert.equal(monthsRemainingInTaxYear(new Date('2025-07-15T12:00:00')), 12);
  assert.equal(monthsRemainingInTaxYear(new Date('2027-01-01T12:00:00')), 0);
});
test('הטבת מס כוללת ונוספת מופרדות', () => {
  const result = calculateConsumerResult({ income: 200000, deposited: 5000, today: new Date('2026-07-15') });
  assert.ok(result.estimatedTotalTaxBenefit > result.estimatedAdditionalTaxBenefit);
  assert.ok(result.estimatedAdditionalTaxBenefit >= 0);
});
test('אומדן ביטוח לאומי ובריאות מחושב לפי אותן מדרגות של האתר המקצועי', () => {
  assert.equal(nationalInsuranceDue(7703 * 12), 7703 * 12 * 0.077);
  assert.ok(nationalInsuranceDue(200000) > nationalInsuranceDue(100000));
});
test('שווי הפטור ממס רווחי הון משתמש בהנחת 8% ל-6 שנים ומס 25%', () => {
  const expected = 20566 * (Math.pow(1.08, 6) - 1) * 0.25;
  assert.equal(capitalGainsExemptionValue(20566), expected);
});
test('השווי הכולל מפריד מס הכנסה, ביטוח לאומי ושווי עתידי', () => {
  const result = calculateConsumerResult({ income: 200000, deposited: 10000 });
  assert.equal(result.estimatedCombinedBenefitAdditional,
    result.estimatedAdditionalTaxBenefit + result.estimatedNationalInsuranceBenefitAdditional + result.estimatedCapitalGainsExemptionValueAdditional);
  assert.ok(result.estimatedCombinedBenefitTotal >= result.estimatedCombinedBenefitAdditional);
});
test('תקופות תחזית 6, 10, 15 ו-20 שנים', () => {
  for (const years of [6, 10, 15, 20]) assert.equal(calculateConsumerResult({ income: 200000, deposited: 0, projectionYears: years }).projections[0].years, years);
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
  const profile = { depositMethod:'monthly', completionPreference:'monthly', fundStatus:'liquid', goal:'tax', score:72 };
  const message = buildWhatsAppMessage(result, profile);
  for (const label of ['הכנסה', 'הפקדות', 'יתרה לניצול', 'דרך ההפקדה', 'העדפת תזרים', 'מצב הקרן', 'המטרה המרכזית', 'הוראת קבע', 'הערכת הטבת המס', 'ביטוח לאומי', 'רווחי הון', 'הטבות המס הכולל', 'ציון ניצול']) assert.match(message, new RegExp(label));
  assert.match(buildWhatsAppUrl(result), /^https:\/\/wa\.me\/972528089808\?text=/);
});
