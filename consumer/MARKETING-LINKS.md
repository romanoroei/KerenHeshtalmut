# קישורי שיווק למחשבון

מחולל הקישורים הפנימי נמצא ב־`consumer/admin/link-builder.html`. הוא יוצר קישור בלבד: הוא לא טוען Analytics, לא שומר מידע בשרת ואין להזין בו שמות או מידע אישי של לקוחות.

## הפרמטרים

| פרמטר | משמעות | דוגמה |
|---|---|---|
| `utm_source` | הערוץ או השותף שהביא את המבקר | `whatsapp`, `google`, `accountant` |
| `utm_medium` | סוג התנועה | `organic`, `paid_social`, `cpc`, `email`, `referral` |
| `utm_campaign` | שם הקמפיין | `launch-2026` |
| `utm_content` | המודעה, הסרטון או מיקום הקישור | `status-1` |
| `utm_term` | מילת חיפוש או וריאציה | `independent-fund` |
| `ref` | קוד מפנה שאינו שם לקוח | `accountant-david` |

## כללי שמות

- משתמשים באנגלית קטנה, מספרים, מקף או קו תחתון בלבד.
- מפרידים מילים במקף ושומרים על אותו שם לאורך הקמפיין.
- לא מכניסים שמות לקוחות, טלפונים, סכומים או מידע אישי.
- כל ערך מוגבל ל־80 תווים.

## דוגמאות

- WhatsApp אישי: `?utm_source=whatsapp&utm_medium=organic&utm_campaign=launch-2026&utm_content=personal-message`
- סטטוס WhatsApp: `?utm_source=whatsapp&utm_medium=organic&utm_campaign=launch-2026&utm_content=status-1`
- TikTok: `?utm_source=tiktok&utm_medium=organic&utm_campaign=launch-2026&utm_content=video-1`
- Facebook אורגני: `?utm_source=facebook&utm_medium=organic&utm_campaign=launch-2026&utm_content=post-1`
- Meta ממומן: `?utm_source=meta&utm_medium=paid_social&utm_campaign=independent-fund-2026&utm_content=ad-video-1`
- Google Ads: `?utm_source=google&utm_medium=cpc&utm_campaign=hishtalmut-independent&utm_content=search-ad-1`
- Email: `?utm_source=email&utm_medium=email&utm_campaign=launch-2026&utm_content=newsletter-1`
- רואה חשבון: `?utm_source=accountant&utm_medium=referral&utm_campaign=partners-2026&ref=accountant-name`
- מנהל/ת חשבונות: `?utm_source=bookkeeper&utm_medium=referral&utm_campaign=partners-2026&ref=bookkeeper-name`

את כל הדוגמאות יש להוסיף אחרי כתובת הבסיס: `https://romanoroei.github.io/KerenHeshtalmut/consumer/`.

## בדיקת קישור מקצה לקצה

1. פותחים את הקישור בחלון גלישה בסתר ומאשרים Analytics.
2. עוברים מעמוד הנחיתה לשאלון ומשלימים את הבדיקה.
3. פותחים את הודעת WhatsApp ומוודאים שמופיעים מקור, קמפיין, תוכן וקוד מפנה שהוגדרו.
4. ב־GA4 DebugView מוודאים שבאירועים `landing_view`, `calculator_started`, `calculator_completed` ו־`whatsapp_clicked` מופיעים `source` ו־`campaign` הנכונים.
