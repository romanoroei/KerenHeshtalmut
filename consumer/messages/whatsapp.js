import { SITE_CONFIG } from '../config.js';
import { getAttribution, referrerDisplayName } from '../analytics/attribution.js';

const money = (value) => new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 }).format(Math.round(value));

function naturalList(items) {
  if (items.length < 2) return items[0] || '';
  return `${items.slice(0, -1).join(', ')} ו${items.at(-1)}`;
}

export function buildWhatsAppMessage(result, profile = {}, attribution = getAttribution()) {
  const goalLabels = {
    tax: 'לנצל את הטבת המס',
    saving: 'להגדיל את החיסכון',
    monthly: 'לבנות הוראת קבע',
    check: 'לבדוק אם אני בדרך הנכונה',
  };
  const goals = naturalList((profile.goals ?? String(profile.goal ?? '').split(',').map((goal) => goal.trim()).filter(Boolean))
    .map((goal) => goalLabels[goal] ?? goal));
  const referrerName = referrerDisplayName(attribution.referrerCode);
  const details = [
    `הכנסה שנתית חייבת משוערת: ${money(result.income)} ₪`,
    ...(profile.hasExistingBalance && result.existingBalance > 0 ? [`צבירה נוכחית בקרן: ${money(result.existingBalance)} ₪`] : []),
    ...(result.depositedToDate > 0 ? [`הפקדה שביצעתי השנה: ${money(result.depositedToDate)} ₪`] : []),
    result.remaining > 0
      ? `סכום מומלץ להפקדה עד סוף ${result.taxYear ?? 2026}: ${money(result.remaining)} ₪`
      : `ניצלתי את מלוא תקרת ההפקדה המוטבת לשנת ${result.taxYear ?? 2026}.`,
  ];
  return [
    'היי רועי, ביצעתי את בדיקת קרן ההשתלמות לעצמאים באתר.',
    '',
    ...details,
    '',
    'הכי חשוב לי:',
    `${goals || 'לבדוק מה נכון למצב שלי'}.`,
    '',
    ...(referrerName ? [`הגעתי לבדיקה דרך ${referrerName}.`, ''] : []),
    'אשמח שתבדוק איתי מה הצעד הבא שמתאים למצב שלי.',
  ].join('\n');
}

export function buildWhatsAppUrl(result, profile) {
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage(result, profile))}`;
}

export function buildShareMessage(url = SITE_CONFIG.publicBaseUrl) {
  return `עצמאי? מצאתי בדיקה קצרה שעוזרת להבין כמה כדאי לך להפקיד לקרן ההשתלמות השנה ומה שווי הטבות המס האפשריות.\n\nהבדיקה ללא הרשמה וללא התחייבות:\n${url}`;
}

export function buildConsumerShareUrl(url = SITE_CONFIG.publicBaseUrl) {
  const message = buildShareMessage(url);
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
