export const TAX_DATA_2026 = Object.freeze({
  taxYear: 2026,
  verifiedAt: '2026-07-15',
  contributionCeiling: {
    value: 20566,
    taxYear: 2026,
    verifiedAt: '2026-07-15',
    source: 'ספר הניכויים 2026, רשות המסים (כפי שתועד באתר המקצועי הקיים)',
    status: 'official',
  },
  qualifyingIncomeCeiling: {
    value: 293397,
    taxYear: 2026,
    verifiedAt: '2026-07-15',
    source: 'ספר הניכויים 2026, רשות המסים (כפי שתועד באתר המקצועי הקיים)',
    status: 'official',
  },
  maxDeductibleContribution: {
    value: 13203,
    taxYear: 2026,
    verifiedAt: '2026-07-15',
    source: 'ספר הניכויים 2026, רשות המסים (כפי שתועד באתר המקצועי הקיים)',
    status: 'official',
  },
  deductibleRate: {
    value: 0.045,
    taxYear: 2026,
    verifiedAt: '2026-07-15',
    source: 'סעיף 17(5א) לפקודת מס הכנסה; נדרש אימות מקצועי לנסיבות המשתמש',
    status: 'estimate',
  },
  taxBrackets: {
    value: [
      [84120, 0.10], [120720, 0.14], [193800, 0.20], [269280, 0.31],
      [560280, 0.35], [721560, 0.47], [Infinity, 0.50],
    ],
    taxYear: 2026,
    verifiedAt: '2026-07-15',
    source: 'מדרגות המס 2026 שבאתר המקצועי הקיים; יש לאמת מול פרסום רשות המסים',
    status: 'estimate',
  },
  nationalInsurance: {
    value: { reducedMonthly: 7703, maxMonthly: 51910, reducedRate: 0.077, regularRate: 0.18 },
    taxYear: 2026,
    verifiedAt: '2026-07-15',
    source: 'ביטוח לאומי, שיעורי דמי הביטוח לעובד עצמאי 2026 (כפי שתועד באתר המקצועי הקיים)',
    status: 'estimate',
  },
  capitalGainsExemption: {
    value: { annualReturn: 0.08, years: 6, capitalGainsTaxRate: 0.25 },
    taxYear: 2026,
    verifiedAt: '2026-07-15',
    source: 'הנחת ההמחשה במחשבון המקצועי: 8% לשנה, 6 שנים ומס רווחי הון של 25%',
    status: 'estimate',
  },
});

export const RETURN_SCENARIOS = Object.freeze([
  { id: 'conservative', label: 'שמרני', annualRate: 0.04 },
  { id: 'middle', label: 'ביניים', annualRate: 0.07 },
  { id: 'high', label: 'גבוה', annualRate: 0.09 },
]);
