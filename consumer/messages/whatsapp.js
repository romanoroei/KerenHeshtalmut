const PHONE = '972528089808';
const money = (value) => new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 }).format(Math.round(value));

export function buildWhatsAppMessage(result) {
  return [
    'היי רועי, מילאתי את מחשבון קרן ההשתלמות:',
    `הכנסה שנתית חייבת משוערת: ${money(result.income)} ₪`,
    `הופקד השנה: ${money(result.deposited)} ₪`,
    `יתרה לניצול: ${money(result.remaining)} ₪`,
    `הוראת קבע מוצעת: ${money(result.suggestedMonthly)} ₪ לחודש`,
    `הערכת הטבת המס האפשרית: ${money(result.estimatedTaxBenefit)} ₪`,
  ].join('\n');
}

export function buildWhatsAppUrl(result) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(buildWhatsAppMessage(result))}`;
}
