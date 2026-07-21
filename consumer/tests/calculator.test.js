import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGrowthSchedule, calculateConsumerResult, capitalGainsExemptionValue, daysRemainingInTaxYear, futureValueOfMonthlyDeposits, incomeTaxBenefitFromDeduction, marginalTaxRate, monthsRemainingInTaxYear, nationalInsuranceDue, normalizeMoney, progressiveIncomeTax, projectedAnnualDeposits, taxRatesForDeduction, totalDeposited } from '../engine/calculator.js';
import { getTaxDataContext, TAX_DATA_2026 } from '../data/tax-data.js';
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../messages/whatsapp.js';

test('ללא הפקדות', () => assert.equal(calculateConsumerResult({ income: 200000, deposited: 0 }).remaining, 20566));
test('שנה ללא נתונים מאומתים משתמשת בשנה הרשמית האחרונה בלי לשנות את שנת הנתונים', () => {
  const context2027 = getTaxDataContext(new Date('2027-01-02T12:00:00'));
  assert.equal(context2027.requestedYear, 2027);
  assert.equal(context2027.dataYear, 2026);
  assert.equal(context2027.isFallback, true);
  assert.equal(context2027.message, 'נתוני 2027 טרם אומתו. החישוב מבוסס על הנתונים הרשמיים האחרונים שאומתו לשנת 2026.');
  const context2028 = getTaxDataContext(new Date('2028-01-02T12:00:00'));
  assert.equal(context2028.dataYear, 2026);
  assert.match(context2028.message, /נתוני 2028 טרם אומתו/);
});
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

test('מדרגות מס 2026 משקפות את תיקון סעיף 121 ממרץ 2026', () => {
  assert.equal(marginalTaxRate(120720), 0.14);
  assert.equal(marginalTaxRate(120721), 0.20);
  assert.equal(marginalTaxRate(228000), 0.20);
  assert.equal(marginalTaxRate(228001), 0.31);
  assert.equal(marginalTaxRate(301200), 0.31);
  assert.equal(marginalTaxRate(301201), 0.35);
});
test('מס הכנסה מחושב לפני ואחרי הניכוי לפי כל המדרגות', () => {
  assert.equal(progressiveIncomeTax(84120), 8412);
  assert.equal(incomeTaxBenefitFromDeduction(230000, 10000), 2220);
  assert.deepEqual(taxRatesForDeduction(230000, 10000), [0.31, 0.20]);
  const result = calculateConsumerResult({ income: 230000, deposited: 0 });
  assert.equal(result.taxBenefitUsesMultipleBrackets, true);
  assert.ok(result.estimatedTotalTaxBenefit < 10350 * 0.31);
});
test('תשואה 0%', () => assert.equal(futureValueOfMonthlyDeposits(1000, 0, 6), 72000));
test('תרחישי 4%, 7% ו-9%', () => {
  const rates = calculateConsumerResult({ income: 200000, deposited: 0 }).projections.map((x) => x.annualRate);
  assert.deepEqual(rates, [0.04, 0.07, 0.09]);
});

test('תרחישי הצמיחה כוללים את הצבירה הקיימת', () => {
  const withoutBalance = calculateConsumerResult({ income: 200000, deposited: 0, existingBalance: 0, projectionYears: 10 });
  const withBalance = calculateConsumerResult({ income: 200000, deposited: 0, existingBalance: 100000, projectionYears: 10 });
  withBalance.projections.forEach((scenario, index) => {
    const expectedExistingValue = 100000 * Math.pow(1 + scenario.annualRate, 10);
    assert.ok(Math.abs((scenario.nominalValue - withoutBalance.projections[index].nominalValue) - expectedExistingValue) < 0.01);
  });
});

test('טבלת הצמיחה מפרידה צבירה, הפקדות ורווחים לכל שנה', () => {
  const schedule = buildGrowthSchedule(100000, 1000, 0.07, 10);
  assert.equal(schedule.length, 11);
  assert.deepEqual(schedule[0], { year: 0, openingBalance: 100000, contributions: 0, estimatedGrowth: 0, nominalValue: 100000 });
  assert.equal(schedule[10].contributions, 120000);
  assert.ok(schedule[10].estimatedGrowth > 0);
  assert.ok(schedule[10].nominalValue > 220000);
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

test('ספירה לאחור עד סוף שנת המס 2026', () => {
  assert.equal(daysRemainingInTaxYear(new Date(2026, 11, 31, 12), 2026), 1);
  assert.equal(daysRemainingInTaxYear(new Date(2027, 0, 1), 2026), 0);
  assert.ok(daysRemainingInTaxYear(new Date(2026, 6, 18), 2026) > 0);
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
test('השלמה חודשית מתחשבת בחודשים הקלנדריים שנותרו החל מהחודש הבא', () => {
  const result = calculateConsumerResult({
    income: 200000,
    lumpSum: 12000,
    monthlyDeposit: 500,
    monthsDeposited: 7,
    today: new Date('2026-07-18'),
  });
  assert.equal(result.depositedToDate, 15500);
  assert.equal(result.projectedAnnualDeposited, 18000);
  assert.equal(result.futureScheduledDeposits, 2500);
  assert.equal(result.remaining, 2566);
  assert.equal(result.scheduledMonthsRemaining, 5);
  assert.equal(result.suggestedMonthlyToYearEnd, 514);
  assert.equal(result.suggestedTotalMonthlyToYearEnd, 1014);
});
test('מספר הפקדות קטן אינו יוצר הפקדות עתידיות מעבר לסוף השנה', () => {
  const result = calculateConsumerResult({
    income: 200000,
    monthlyDeposit: 500,
    monthsDeposited: 1,
    today: new Date('2026-07-18'),
  });
  assert.equal(result.depositedToDate, 500);
  assert.equal(result.scheduledMonthsRemaining, 5);
  assert.equal(result.projectedAnnualDeposited, 3000);
  assert.equal(result.futureScheduledDeposits, 2500);
  assert.equal(result.remaining, 17566);
  assert.equal(result.suggestedMonthlyToYearEnd, Math.ceil(17566 / 5));
  assert.equal(result.suggestedTotalMonthlyToYearEnd, 500 + Math.ceil(17566 / 5));
});
test('חלופת מעבר השנה להוראת הקבע של השנה הבאה משלימה בדיוק את התקרה', () => {
  const result = calculateConsumerResult({ income: 200000, lumpSum: 10000, monthlyDeposit: 500, monthsDeposited: 7, today: new Date('2026-07-18') });
  assert.equal(result.depositedToDate, 13500);
  assert.equal(result.remaining, 4566);
  assert.equal(result.suggestedTotalMonthlyToYearEnd, 1414);
  assert.equal(result.suggestedMonthly, 1714);
  assert.equal(result.nextYearRatePayments, 3);
  assert.equal(result.nextYearRateStartMonthIndex, 9);
  assert.equal(result.nextYearRateLumpSum, 924);
  assert.equal(result.depositedToDate + (2 * 500) + (3 * 1714) + 924, result.ceiling);
});
test('תוכנית חדשה מתחילה בחודש הבא ואינה כוללת את החודש הנוכחי', () => {
  const result = calculateConsumerResult({ income: 200000, deposited: 0, today: new Date('2026-07-18') });
  assert.equal(result.scheduledMonthsRemaining, 5);
  assert.equal(result.suggestedMonthlyToYearEnd, Math.ceil(20566 / 5));
});
test('לכל נתון מס יש מקור, שנת מס, תאריך אימות וסטטוס', () => {
  for (const datum of Object.values(TAX_DATA_2026).filter((value) => value && typeof value === 'object')) {
    assert.ok(datum.source); assert.equal(datum.taxYear, 2026); assert.ok(datum.verifiedAt);
    assert.match(datum.status, /^(official|estimate)$/);
  }
});
test('הודעת WhatsApp כוללת את כל נתוני החובה ונשלחת למספר הנכון', () => {
  const result = calculateConsumerResult({ income: 200000, lumpSum: 10000, monthlyDeposit: 500, monthsDeposited: 7 });
  const profile = { goals:['tax', 'saving'] };
  const message = buildWhatsAppMessage(result, profile);
  for (const label of ['הכנסה שנתית', 'הפקדה שביצעתי השנה', 'סכום מומלץ להפקדה', 'הכי חשוב לי']) assert.match(message, new RegExp(label));
  assert.match(message, /13,500 ₪/);
  assert.match(message, /לנצל את הטבת המס ולהגדיל את החיסכון/);
  assert.doesNotMatch(message, /הוראת קבע|צבירה נוכחית|שווי הטבות המס הכולל/);
  for (const removed of ['both', 'monthly', 'מצב הקרן', 'ציון ניצול', 'ביטוח לאומי', 'רווחי הון']) assert.doesNotMatch(message, new RegExp(removed));
  assert.match(buildWhatsAppUrl(result), /^https:\/\/wa\.me\/972528089808\?text=/);
});

test('בהיעדר צבירה מוזנת ההפקדות השנה משמשות כצבירה לתרחישים ול-WhatsApp', () => {
  const result = calculateConsumerResult({ income: 200000, lumpSum: 10000, monthlyDeposit: 500, monthsDeposited: 4, existingBalance: '' });
  assert.equal(result.depositedToDate, 12000);
  assert.equal(result.existingBalance, 12000);
  assert.equal(result.projections[0].nominalValue > 12000, true);
  assert.match(buildWhatsAppMessage(result), /12,000 ₪/);
});
