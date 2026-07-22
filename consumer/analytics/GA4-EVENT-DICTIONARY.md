# מילון אירועי GA4 — המחשבון הצרכני

מזהה המדידה: `G-XF5X2QLB8L`. כל האירועים נשלחים רק לאחר הסכמה ל־Analytics. ה־Attribution נשמר מקומית ב־sessionStorage גם ללא הסכמה, אך אינו נשלח לפני הסכמה.

| אירוע | מתי מופעל | תדירות | פרמטרים מותרים | משמעות עסקית | אירוע מרכזי | מידע שאסור לשלוח |
| --- | --- | --- | --- | --- | --- | --- |
| `landing_view` | טעינת עמוד נחיתה או שאלון | פעם אחת בכל Session | `page_type`, `source`, `medium`, `campaign`, `content`, `term`, `referrer_code` | כניסה למשפך | לא | סכומים, פרטי לקוח, טלפון, תוכן הודעה |
| `calculator_started` | תחילת הבדיקה בעמוד הנחיתה או טעינת השאלון | פעם אחת בכל Session | `source`, `medium`, `campaign`, `content`, `term`, `referrer_code` | התחלת שימוש | לא | סכומים, מצב הטופס המלא, פרטי לקוח, תוכן הודעה |
| `calculator_completed` | השלמת השאלון וחישוב תוצאה תקינה | פעם אחת בכל Session | `fund_status`, `deposit_method`, `goals`, `result_status`, `source`, `medium`, `campaign`, `content`, `term`, `referrer_code` | השלמת בדיקה | כן | הכנסה, הפקדה, הוראת קבע, צבירה, סכום מומלץ, הטבת מס, טלפון, הודעה |
| `whatsapp_clicked` | לחיצה על אחד מכפתורי WhatsApp במסך התוצאה | בכל לחיצה אמיתית | `fund_status`, `result_status`, `source`, `medium`, `campaign`, `content`, `term`, `referrer_code`, `button_location` | ליד פוטנציאלי; אינו מעיד על שליחה | כן | תוכן הודעה, מספר טלפון, סכומים, `deposit_method` ומידע אישי |

## ערכים מקובלים

- `page_type`: `consumer_landing` או `consumer_check`.
- `button_location`: `primary` או `secondary`.
- `result_status`: `remaining`, `ceiling_reached` או `over_ceiling`.
- `fund_status`: הערך הטכני של מצב הקרן שנבחר בטופס.
- `deposit_method`: הערך הטכני של שיטת ההפקדה; מותר רק ב־`calculator_completed`.
- `goals`: קודי המטרות שנבחרו, מופרדים באמצעות `|`; אין טקסט חופשי.
- `referrer_code`: קוד שיווקי טכני כגון `roynetanel`, לא שם לקוח.

## כללי פרטיות

ארבעת אירועי הליבה מוגנים באמצעות רשימת פרמטרים מורשים. בנוסף נחסמים שמות פרמטרים המעידים על הכנסה, סכום, הפקדה כספית, צבירה, המלצה, הטבת מס, טלפון או תוכן הודעה. `content` מותר משום שהוא מייצג `utm_content`; `message_content`, `content_text` ו־`whatsapp_message` אסורים.

אין להוסיף פרמטר חדש לאירוע ליבה בלי לעדכן יחד את רשימת ההרשאה, המילון, מדריך הדוחות והבדיקות האוטומטיות.
