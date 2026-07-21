export const TAX_DATA_2026 = Object.freeze({
  taxYear: 2026,
  verifiedAt: '2026-07-19',
  contributionCeiling: {
    value: 20566,
    taxYear: 2026,
    verifiedAt: '2026-07-19',
    source: 'פקודת מס הכנסה המעודכנת ל-2026, סעיף 9(16ב), רשות המסים',
    status: 'official',
  },
  qualifyingIncomeCeiling: {
    value: 293397,
    taxYear: 2026,
    verifiedAt: '2026-07-19',
    source: 'לוח הניכויים ומדריך דע זכויותיך, רשות המסים',
    status: 'official',
  },
  maxDeductibleContribution: {
    value: 13203,
    taxYear: 2026,
    verifiedAt: '2026-07-19',
    source: '4.5% מתקרת הכנסה קובעת של 293,397 ₪, רשות המסים',
    status: 'official',
  },
  deductibleRate: {
    value: 0.045,
    taxYear: 2026,
    verifiedAt: '2026-07-19',
    source: 'סעיף 17(5א) לפקודת מס הכנסה ומדריך דע זכויותיך, רשות המסים',
    status: 'official',
  },
  taxBrackets: {
    value: [
      [84120, 0.10], [120720, 0.14], [228000, 0.20], [301200, 0.31],
      [560280, 0.35], [721560, 0.47], [Infinity, 0.50],
    ],
    taxYear: 2026,
    verifiedAt: '2026-07-19',
    source: 'לוח הניכויים 2026, רשות המסים; תיקון סעיף 121 מיום 31.3.2026',
    status: 'official',
  },
  nationalInsurance: {
    value: { reducedMonthly: 7703, maxMonthly: 51910, reducedRate: 0.077, regularRate: 0.18 },
    taxYear: 2026,
    verifiedAt: '2026-07-19',
    source: 'ביטוח לאומי, שיעורי דמי הביטוח לעובד עצמאי החל מ-1.1.2026',
    status: 'official',
  },
  capitalGainsExemption: {
    value: { annualReturn: 0.08, years: 6, capitalGainsTaxRate: 0.25 },
    taxYear: 2026,
    verifiedAt: '2026-07-19',
    source: 'הנחת ההמחשה במחשבון המקצועי: 8% לשנה, 6 שנים ומס רווחי הון של 25%',
    status: 'estimate',
  },
});

export const TAX_DATA_BY_YEAR = Object.freeze({
  2026: TAX_DATA_2026,
});

export function getTaxDataContext(date = new Date(), registry = TAX_DATA_BY_YEAR) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) throw new TypeError('Invalid date');
  const requestedYear = date.getFullYear();
  const verifiedYears = Object.entries(registry)
    .filter(([, data]) => data?.taxYear && Object.values(data)
      .filter((value) => value && typeof value === 'object' && 'status' in value)
      .every((value) => value.status === 'official' || value.status === 'estimate'))
    .map(([year]) => Number(year))
    .filter((year) => year <= requestedYear)
    .sort((a, b) => b - a);
  if (!verifiedYears.length) throw new Error('No verified tax data available');
  const dataYear = verifiedYears.includes(requestedYear) ? requestedYear : verifiedYears[0];
  const data = registry[dataYear];
  const isFallback = dataYear !== requestedYear;
  return Object.freeze({
    requestedYear,
    dataYear,
    data,
    isFallback,
    message: isFallback
      ? `נתוני ${requestedYear} טרם אומתו. החישוב מבוסס על הנתונים הרשמיים האחרונים שאומתו לשנת ${dataYear}.`
      : '',
  });
}

export const RETURN_SCENARIOS = Object.freeze([
  { id: 'conservative', label: 'שמרני', annualRate: 0.04 },
  { id: 'middle', label: 'ביניים', annualRate: 0.07 },
  { id: 'high', label: 'גבוה', annualRate: 0.09 },
]);
