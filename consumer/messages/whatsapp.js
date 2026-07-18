const PHONE = '972528089808';
const CONSUMER_URL = 'https://romanoroei.github.io/KerenHeshtalmut/consumer/?share=20260718-2';
const money = (value) => new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 }).format(Math.round(value));

export function buildWhatsAppMessage(result, profile = {}) {
  const goalLabels = {
    tax: 'לנצל את הטבת המס',
    saving: 'להגדיל את החיסכון',
    monthly: 'לבנות הוראת קבע',
    check: 'לבדוק אם אני בדרך הנכונה',
  };
  const goals = (profile.goals ?? String(profile.goal ?? '').split(',').map((goal) => goal.trim()).filter(Boolean))
    .map((goal) => goalLabels[goal] ?? goal)
    .join(', ');
  return [
    'היי רועי, ביצעתי את בדיקת קרן ההשתלמות לעצמאים באתר:',
    `הכנסה שנתית חייבת משוערת: ${money(result.income)} ₪`,
    `סך הפקדה חד־פעמית שביצעתי השנה: ${money(result.currentLumpSumDeposit ?? 0)} ₪`,
    `הוראת קבע קיימת: ${money(result.currentMonthlyDeposit ?? 0)} ₪`,
    `צבירה נוכחית בקרן: ${money(result.existingBalance ?? 0)} ₪`,
    `סכום מומלץ להפקדה עד סוף ${result.taxYear ?? 2026}: ${money(result.remaining)} ₪`,
    '',
    `הכי חשוב לי: ${goals || 'לא צוין'}`,
    '',
    `שווי הטבות המס הכולל (אומדן): ${money(result.estimatedCombinedBenefitTotal ?? result.estimatedTotalTaxBenefit)} ₪`,
    '',
    'אשמח שתבדוק איתי מה הצעד הבא שמתאים למצב שלי',
  ].join('\n');
}

export function buildWhatsAppUrl(result, profile) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(buildWhatsAppMessage(result, profile))}`;
}

export function buildConsumerShareUrl() {
  const message = `בדקתי כמה כדאי להפקיד לקרן השתלמות ומה שווי הטבות המס האפשריות. אפשר לבצע כאן בדיקה אישית וקצרה:\n${CONSUMER_URL}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
