import { SITE_CONFIG } from '../config.js';
import { attributionLabel, getAttribution } from '../analytics/attribution.js';

const money = (value) => new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 }).format(Math.round(value));

export function buildWhatsAppMessage(result, profile = {}, attribution = getAttribution()) {
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
    `מקור ההגעה: ${attributionLabel(attribution)}`,
    ...(attribution.referrerCode ? [`קוד מפנה: ${attribution.referrerCode}`] : []),
    '',
    'אשמח שתבדוק איתי מה הצעד הבא שמתאים למצב שלי',
  ].join('\n');
}

export function buildWhatsAppUrl(result, profile) {
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage(result, profile))}`;
}

export function buildShareMessage(url = SITE_CONFIG.publicBaseUrl) {
  return `עצמאי? מצאתי בדיקה קצרה שעוזרת להבין כמה ניתן לשקול להפקיד לקרן ההשתלמות השנה ומה שווי הטבות המס האפשריות.\n\nהבדיקה ללא הרשמה וללא התחייבות:\n${url}`;
}

export function buildConsumerShareUrl(url = SITE_CONFIG.publicBaseUrl) {
  const message = buildShareMessage(url);
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
