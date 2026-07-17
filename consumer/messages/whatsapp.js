const PHONE = '972528089808';
const money = (value) => new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 }).format(Math.round(value));

export function buildWhatsAppMessage(result, profile = {}) {
  return [
    'היי רועי, ביצעתי את בדיקת קרן ההשתלמות באתר.',
    `הכנסה שנתית חייבת משוערת: ${money(result.income)} ₪`,
    `סך הפקדות שבוצעו עד היום: ${money(result.depositedToDate ?? result.deposited)} ₪`,
    `צפי הפקדות עד סוף השנה: ${money(result.projectedAnnualDeposited ?? result.deposited)} ₪`,
    `צבירה קיימת בקרן: ${money(result.existingBalance ?? 0)} ₪`,
    `יתרה לניצול: ${money(result.remaining)} ₪`,
    ...(result.overCeiling ? [`סכום מעל התקרה: ${money(result.overCeiling)} ₪`] : []),
    `דרך ההפקדה שנבחרה: ${profile.depositMethod ?? 'לא צוינה'}`,
    `העדפת תזרים: ${profile.completionPreference ?? 'לא צוינה'}`,
    `מצב הקרן: ${profile.fundStatus ?? 'לא צוין'}`,
    `המטרה המרכזית: ${profile.goal ?? 'לא צוינה'}`,
    `הוראת קבע מוצעת: ${money(result.suggestedMonthly)} ₪ לחודש`,
    `הערכת הטבת המס במס הכנסה במיקסום ההפקדה: ${money(result.estimatedTotalTaxBenefit)} ₪`,
    `אומדן חיסכון בביטוח לאומי/בריאות במיקסום ההפקדה: ${money(result.estimatedNationalInsuranceBenefitTotal ?? 0)} ₪`,
    `שווי עתידי משוער של הפטור ממס רווחי הון: ${money(result.estimatedCapitalGainsExemptionValueTotal ?? 0)} ₪`,
    `שווי הטבות המס הכולל (אומדן): ${money(result.estimatedCombinedBenefitTotal ?? result.estimatedTotalTaxBenefit)} ₪`,
    `ציון ניצול קרן ההשתלמות: ${profile.score ?? 0}/100`,
    'אשמח שתבדוק איתי אם התוצאה מתאימה למצב שלי.',
  ].join('\n');
}

export function buildWhatsAppUrl(result, profile) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(buildWhatsAppMessage(result, profile))}`;
}
