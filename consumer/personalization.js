const VALID_GOALS = ['tax', 'saving', 'monthly', 'check'];

function selectedGoals(profile = {}) {
  const goals = Array.isArray(profile.goals) ? profile.goals : [];
  return [...new Set(goals.filter((goal) => VALID_GOALS.includes(goal)))];
}

export function buildGoalContext(result, profile = {}) {
  const goals = selectedGoals(profile);
  if (!goals.length) return '';
  const has = (goal) => goals.includes(goal);

  if (goals.length === 1) {
    const goal = goals[0];
    if (goal === 'tax' && result.overCeiling > 0) return 'בחרת להתמקד בהטבת המס. לפי הנתונים שהזנת, חלק מההפקדה כבר נמצא מעל התקרה המוטבת, ולכן כדאי לבדוק לפני שמפקידים סכום נוסף.';
    if (goal === 'monthly' && result.remaining === 0) return 'בחרת לבנות הוראת קבע. מכיוון שכבר ניצלת את מלוא התקרה השנה, כדאי להשתמש בהוראת הקבע בעיקר כהיערכות מסודרת לשנת המס הבאה.';
    if (goal === 'saving' && profile.fundStatus === 'none') return 'בחרת להגדיל את החיסכון. לכן כדאי להתמקד קודם בפתיחת קרן מתאימה, בבחירת מסלול ובקביעת סכום הפקדה שמתאים לתזרים שלך.';
    if (goal === 'tax') return `בחרת שהכי חשוב לך לנצל את הטבת המס. לכן התמקדנו בסכום שנשאר לך להפקדה ובהטבות המס האפשריות לשנת ${result.taxYear}.`;
    if (goal === 'saving') return 'בחרת שהכי חשוב לך להגדיל את החיסכון. לכן התמקדנו בהשפעה האפשרית של ההפקדה על החיסכון לאורך זמן.';
    if (goal === 'monthly') return 'בחרת שהכי חשוב לך לבנות הוראת קבע. לכן התמקדנו בדרך אפשרית לחלק את ההפקדה בין החודשים שנותרו ולהיערך גם לשנה הבאה.';
    return 'בחרת שהכי חשוב לך לבדוק אם אתה בדרך הנכונה. לכן התמקדנו לא רק בסכום ההפקדה, אלא גם בקרן, במסלול, בדמי הניהול ובהתאמה לתכנון הכולל.';
  }

  let copy;
  if (goals.length >= 3) {
    copy = 'בחרת להתמקד בהטבת המס, בחיסכון ובהתאמה של הקרן למצב שלך. לכן התוצאה משלבת בין הסכום שנשאר להפקדה, ההשפעה לטווח ארוך והבדיקות שכדאי לבצע לפני שמחליטים.';
  } else if (has('tax') && has('saving')) {
    copy = 'בחרת לנצל את הטבת המס וגם להגדיל את החיסכון. לכן התמקדנו גם בסכום שנשאר לך להפקדה השנה וגם בהשפעה האפשרית שלו לאורך זמן.';
  } else if (has('tax') && has('monthly')) {
    copy = 'בחרת לנצל את הטבת המס ולבנות הוראת קבע. לכן התמקדנו בסכום שנותר ובדרך אפשרית לחלק אותו בין החודשים שנותרו השנה.';
  } else if (has('saving') && has('check')) {
    copy = 'בחרת להגדיל את החיסכון ולבדוק אם אתה בדרך הנכונה. לכן התמקדנו גם בתרחיש לטווח ארוך וגם בבדיקות שכדאי לבצע בקרן הקיימת.';
  } else if (has('tax') && has('check')) {
    copy = 'בחרת לנצל את הטבת המס ולבדוק אם אתה בדרך הנכונה. לכן התמקדנו גם בסכום שנשאר להפקדה וגם במה שחשוב לבדוק לפני שמבצעים פעולה.';
  } else {
    copy = 'בחרת להתמקד בחיסכון ובהיערכות מסודרת. לכן התוצאה משלבת בין ההשפעה לטווח ארוך לבין הצעדים שכדאי לבדוק לפני שמחליטים.';
  }

  if (result.overCeiling > 0 && has('tax')) return `${copy.split(' לכן ')[0]} לפי הנתונים שהזנת, חלק מההפקדה כבר נמצא מעל התקרה המוטבת, ולכן כדאי לבדוק לפני שמפקידים סכום נוסף.`;
  if (result.remaining === 0 && has('monthly')) return `${copy.split(' לכן ')[0]} מכיוון שכבר ניצלת את מלוא התקרה השנה, הדגש הוא על היערכות מסודרת לשנת המס הבאה.`;
  if (profile.fundStatus === 'none' && has('saving')) return `${copy.split(' לכן ')[0]} כדאי להתמקד קודם בפתיחת קרן מתאימה, בבחירת גוף מנהל ומסלול ובהתאמה לתזרים.`;
  return copy;
}

export function buildAdvisorChecks(result, profile = {}) {
  const goals = selectedGoals(profile);
  const candidates = [];
  const add = (key, text) => {
    if (!candidates.some((item) => item.key === key || item.text === text)) candidates.push({ key, text });
  };

  goals.forEach((goal) => {
    if (goal === 'tax') add('deposit', result.overCeiling > 0
      ? 'אילו חלופות אפשר לבדוק עבור הסכום שמעל התקרה המוטבת.'
      : result.remaining === 0
        ? 'איך להיערך מראש להפקדות של שנת המס הבאה.'
        : 'האם נכון להשלים את מלוא ההפקדה השנה, חלק ממנה או להמתין.');
    if (goal === 'saving') add('track', 'האם מסלול ההשקעה מתאים לטווח ולמטרות החיסכון שלך.');
    if (goal === 'monthly') add('monthly', result.remaining === 0
      ? 'איזו הוראת קבע מתאימה לתזרים ולהיערכות לשנה הבאה.'
      : 'איזו הוראת קבע מתאימה לתזרים ולחודשים שנותרו השנה.');
    if (goal === 'check') add('fund', profile.fundStatus === 'none'
      ? 'איזה גוף מנהל, מסלול ודמי ניהול כדאי לבדוק לפני פתיחת הקרן.'
      : 'האם הקרן, המסלול ודמי הניהול מתאימים לך.');
  });

  if (result.overCeiling > 0) add('over', 'אילו חלופות אפשר לבדוק עבור הסכום שמעל התקרה המוטבת.');
  if (result.remaining === 0) add('next-year', 'איך להיערך מראש להפקדות של שנת המס הבאה.');
  add('track', 'האם הקרן ומסלול ההשקעה מתאימים לגיל, לטווח ולמטרות שלך.');
  add('fees', 'האם דמי הניהול שקיבלת סבירים.');
  add('deposit', 'האם נכון להשלים את ההפקדה עכשיו, בהדרגה או לא להפקיד את מלוא הסכום.');
  add('other-fund', profile.fundStatus === 'none'
    ? 'איזה גוף מנהל, מסלול ודמי ניהול כדאי לבדוק לפני פתיחת הקרן.'
    : 'האם קיימת קרן נוספת או ישנה שכדאי לבדוק.');
  return candidates.slice(0, 4).map((item) => item.text);
}
