export function buildRecommendation(result, profile) {
  if (profile.fundStatus === 'none') return 'עדיין אין לך קרן השתלמות. לפני פתיחה כדאי לבדוק זכאות, מסלול השקעה ודמי ניהול.';
  if (result.overCeiling > 0) return 'חלק מההפקדה שלך נמצא מעל התקרה המוטבת. לפני שמפקידים סכומים נוספים, כדאי לבדוק אם קיימת חלופה מתאימה יותר.';
  if (result.remaining === 0) return 'כבר ניצלת את מלוא התקרה המוטבת השנה. עכשיו כדאי לבדוק שהמסלול ודמי הניהול בקרן מתאימים לך ולהיערך להפקדות של השנה הבאה.';
  if (result.deposited === 0) return 'לפי הנתונים שהזנת, ניתן לשקול להתחיל בהפקדה השנה. אם התזרים מאפשר, אפשר להפקיד סכום חד־פעמי או להתחיל הוראת קבע ולבחון השלמה לקראת סוף השנה.';
  if (profile.completionPreference === 'lump') return `כדי לנצל את מלוא התקרה המוטבת, ניתן לשקול להשלים השנה הפקדה חד־פעמית של ${Math.round(result.remaining).toLocaleString('he-IL')} ₪.`;
  if (profile.completionPreference === 'monthly') return `כדי להשלים את התקרה עד סוף השנה, ניתן לשקול לעדכן את הוראת הקבע לכ־${Math.round(result.suggestedMonthlyToYearEnd).toLocaleString('he-IL')} ₪ בחודש.`;
  return 'נשארה יתרה לניצול השנה. אפשר לשקול שילוב בין הפקדה חד־פעמית להפקדה חודשית, בהתאם לתזרים שלך.';
}

export function buildCta(result, profile) {
  if (profile.fundStatus === 'none') return 'רוצה לבדוק איך לפתוח קרן בצורה נכונה?';
  if (result.overCeiling > 0) return 'רוצה לבדוק מה אפשר לעשות עם הסכום שמעל התקרה?';
  if (result.remaining === 0) return 'רוצה לבדוק אם הקרן והמסלול שלך עדיין מתאימים?';
  return 'רוצה לבדוק איך להשלים את ההפקדה בלי להכביד על התזרים?';
}
