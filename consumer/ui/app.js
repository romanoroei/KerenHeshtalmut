import { buildGrowthSchedule, calculateConsumerResult, normalizeMoney } from '../engine/calculator.js';
import { calculateUtilizationScore } from '../engine/score.js';
import { buildCta, buildRecommendation } from '../engine/recommendations.js';
import { buildConsumerShareUrl, buildShareMessage, buildWhatsAppUrl } from '../messages/whatsapp.js';
import { SITE_CONFIG } from '../config.js';
import { attributionEventParameters, getAttribution } from '../analytics/attribution.js';
import { trackEvent, trackOnce, trackOnceOrQueue } from '../analytics/tracking.js';
import { countUp } from './animations.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const form = $('#consumer-form');
const steps = $$('.step');
const money = (value) => new Intl.NumberFormat('he-IL', {
  style: 'currency', currency: 'ILS', maximumFractionDigits: 0,
}).format(Math.round(value));
const labels = {
  none: 'עדיין אין קרן', existing: 'יש קרן השתלמות',
};
let currentStep = 0;
let lastProfile;
let lastResult;
let advanceTimer;
let countdownTimer;
let isTransitioning = false;
let isSubmitting = false;
const stepHistory = [0];
const FORM_STATE_KEY = 'consumer_calculator_state';
const attribution = getAttribution();
const attributionParameters = attributionEventParameters(attribution);

function saveFormState() {
  try {
    const values = {};
    new FormData(form).forEach((value, key) => { values[key] = key === 'goal' ? [...(values[key] || []), value] : value; });
    sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify({ currentStep, stepHistory, values }));
  } catch { /* The calculator still works when storage is unavailable. */ }
}

function restoreFormState() {
  try {
    const state = JSON.parse(sessionStorage.getItem(FORM_STATE_KEY) || 'null');
    if (!state?.values) return false;
    for (const [name, value] of Object.entries(state.values)) {
      const fields = $$(`[name="${name}"]`, form);
      fields.forEach((field) => {
        if (field.type === 'radio' || field.type === 'checkbox') field.checked = (Array.isArray(value) ? value : [value]).includes(field.value);
        else field.value = value;
      });
    }
    stepHistory.splice(0, stepHistory.length, ...(Array.isArray(state.stepHistory) ? state.stepHistory : [0]));
    currentStep = Number.isInteger(state.currentStep) ? state.currentStep : 0;
    updateDepositFields(); updateSelectedCards(); updateSummary();
    return true;
  } catch { return false; }
}

function resultStatus(result) {
  return result.overCeiling > 0 ? 'over_ceiling' : result.remaining === 0 ? 'ceiling_reached' : 'remaining';
}

function scheduleAdvance(action, expectedStep = currentStep, delay = 220) {
  clearTimeout(advanceTimer);
  advanceTimer = setTimeout(() => {
    if (currentStep !== expectedStep || isTransitioning || isSubmitting) return;
    action();
  }, delay);
}

function formatMoneyInput(input) {
  const value = normalizeMoney(input.value);
  if (Number.isFinite(value)) input.value = Math.round(value).toLocaleString('he-IL');
}

function updateSelectedCards() {
  $$('.choice-card').forEach((card) => card.classList.toggle('is-selected', $('input', card).checked));
}

function depositTotalFromForm() {
  const method = form.elements.depositMethod.value;
  const lump = ['lump', 'both'].includes(method) ? normalizeMoney(form.elements.lumpSum.value) || 0 : 0;
  const monthly = ['monthly', 'both'].includes(method) ? normalizeMoney(form.elements.monthlyDeposit.value) || 0 : 0;
  const months = ['monthly', 'both'].includes(method) ? Number(form.elements.monthsDeposited.value) : 0;
  if (['monthly', 'both'].includes(method) && (!Number.isInteger(months) || months < 1 || months > 12)) return NaN;
  return lump + monthly * months;
}

function validateMonthsDeposited(showError = true) {
  const method = form.elements.depositMethod.value;
  const field = form.elements.monthsDeposited;
  const relevant = ['monthly', 'both'].includes(method);
  const months = Number(field.value);
  const valid = !relevant || (Number.isInteger(months) && months >= 1 && months <= 12);
  field.setAttribute('aria-invalid', String(!valid));
  if (showError) $('#months-deposited-error').textContent = valid ? '' : 'יש להזין מספר חודשים שלם בין 1 ל־12.';
  return valid;
}

function projectedDepositFromForm() {
  const method = form.elements.depositMethod.value;
  const lump = ['lump', 'both'].includes(method) ? normalizeMoney(form.elements.lumpSum.value) || 0 : 0;
  const monthly = ['monthly', 'both'].includes(method) ? normalizeMoney(form.elements.monthlyDeposit.value) || 0 : 0;
  return lump + monthly * 12;
}

function updateSummary() {
  const income = normalizeMoney(form.elements.income.value);
  $('#summary-income').textContent = Number.isFinite(income) && income > 0 ? money(income) : 'טרם הוזנה';
  const depositMethod = form.elements.depositMethod.value;
  const depositedTotal = depositTotalFromForm();
  $('#summary-deposited').textContent = depositMethod ? (Number.isFinite(depositedTotal) ? money(depositedTotal) : 'יש לתקן את מספר החודשים') : 'טרם הוזן';
  const balance = normalizeMoney(form.elements.existingBalance.value);
  const fundStatus = form.elements.fundStatus.value;
  $('#summary-balance').textContent = fundStatus === 'none' ? 'לא רלוונטי' : fundStatus && Number.isFinite(balance) ? money(balance) : 'טרם הוזנה';
  $('#summary-fund').textContent = labels[fundStatus] || 'טרם נבחר';
  const preview = $('#deposit-preview');
  if (depositMethod) {
    preview.hidden = false;
    preview.classList.toggle('is-error', !Number.isFinite(depositedTotal));
    const includesStandingOrder = ['monthly', 'both'].includes(depositMethod);
    $('span', preview).textContent = Number.isFinite(depositedTotal) ? `עד כה הוזנו הפקדות בסך ${money(depositedTotal)}${includesStandingOrder ? ', כולל הוראת קבע' : ''}.` : 'מספר החודשים אינו הגיוני. יש להזין מספר שלם בין 1 ל־12.';
  }
}

function updateDepositFields() {
  const method = form.elements.depositMethod.value;
  $('#lump-fields').hidden = !['lump', 'both'].includes(method);
  $('#monthly-fields').hidden = !['monthly', 'both'].includes(method);
  updateSummary();
}

function depositDetailsComplete() {
  const method = form.elements.depositMethod.value;
  const lump = normalizeMoney(form.elements.lumpSum.value);
  const monthly = normalizeMoney(form.elements.monthlyDeposit.value);
  const months = Number(form.elements.monthsDeposited.value);
  if (method === 'none') return true;
  if (method === 'lump') return lump > 0;
  if (method === 'monthly') return monthly > 0 && validateMonthsDeposited();
  if (method === 'both') return lump > 0 && monthly > 0 && validateMonthsDeposited();
  return false;
}

function renderStep(index, animate = true) {
  clearTimeout(advanceTimer);
  isTransitioning = false;
  currentStep = Math.max(0, Math.min(index, steps.length - 1));
  steps.forEach((step, i) => { step.hidden = i !== currentStep; step.classList.remove('is-leaving'); });
  $('#step-copy').textContent = `שלב ${currentStep + 1} מתוך 4`;
  $('#step-title').textContent = steps[currentStep].dataset.title;
  $('#progress-fill').style.width = `${(currentStep + 1) * 25}%`;
  $('.progress-track').setAttribute('aria-valuenow', String(currentStep + 1));
  $('[data-back]').hidden = stepHistory.length === 1;
  $('[data-next]').hidden = ![0, 2].includes(currentStep);
  $('#submit-check').hidden = currentStep !== 3;
  $('#form-error').textContent = '';
  if (animate) steps[currentStep].classList.add('is-entering');
  steps[currentStep].querySelector('input:not([type="radio"]):not([type="checkbox"])')?.focus({ preventScroll: true });
  if (innerWidth <= 640 && currentStep > 0) form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  saveFormState();
}

function validateStep() {
  const active = steps[currentStep];
  if (currentStep === 2 && !validateMonthsDeposited()) {
    $('#form-error').textContent = 'יש לתקן את מספר החודשים: מספר שלם בין 1 ל־12.';
    form.elements.monthsDeposited.focus();
    return false;
  }
  if (currentStep === 2 && !depositDetailsComplete()) {
    $('#form-error').textContent = 'יש להשלים את פרטי ההפקדה בסכום גדול מאפס.';
    return false;
  }
  if (currentStep === 3 && !form.querySelector('[name="goal"]:checked')) {
    $('#form-error').textContent = 'כדי להציג תוצאה, יש לבחור לפחות מטרה אחת.';
    return false;
  }
  const required = $$('[required]', active);
  for (const field of required) {
    if (field.type === 'radio' && !form.querySelector(`[name="${field.name}"]:checked`)) {
      $('#form-error').textContent = 'כדי להמשיך, יש לבחור אחת מהאפשרויות.';
      return false;
    }
    if (field.type !== 'radio') {
      const value = normalizeMoney(field.value);
      if (!Number.isFinite(value) || (field.name === 'income' && value <= 0)) {
        $('#form-error').textContent = 'יש להזין סכום תקין וגדול מאפס.';
        if (field.name === 'income') $('#income-error').textContent = 'הסכום נדרש כדי להמשיך.';
        field.focus();
        return false;
      }
    }
  }
  return true;
}

function transitionTo(index, recordHistory = true) {
  if (isTransitioning || index === currentStep || index < 0 || index >= steps.length) return;
  isTransitioning = true;
  if (recordHistory) stepHistory.push(index);
  const profile = collect().profile;
  trackEvent('step_completed', { step_number: currentStep + 1, step_name: steps[currentStep].dataset.title, ...(currentStep === 1 ? { fund_status: profile.fundStatus } : {}), ...(currentStep === 2 ? { deposit_method: profile.depositMethod } : {}) });
  const current = steps[currentStep];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { renderStep(index, false); return; }
  current.classList.add('is-leaving');
  setTimeout(() => renderStep(index), 160);
}

function collect(years = 10) {
  const data = new FormData(form);
  const method = data.get('depositMethod');
  return {
    input: {
      income: data.get('income'),
      lumpSum: ['lump', 'both'].includes(method) ? data.get('lumpSum') : 0,
      monthlyDeposit: ['monthly', 'both'].includes(method) ? data.get('monthlyDeposit') : 0,
      monthsDeposited: ['monthly', 'both'].includes(method) ? data.get('monthsDeposited') : 0,
      existingBalance: data.get('existingBalance'),
      projectionYears: years,
    },
    profile: {
      depositMethod: method,
      fundStatus: data.get('fundStatus'),
      hasExistingBalance: data.get('fundStatus') === 'existing' && String(data.get('existingBalance') || '').trim() !== '' && normalizeMoney(data.get('existingBalance')) > 0,
      completionPreference: ['monthly', 'both'].includes(method) ? 'monthly' : method === 'lump' ? 'lump' : 'unknown',
      goals: data.getAll('goal'),
      goal: data.getAll('goal').join(', '),
    },
  };
}

function renderScenarios(result) {
  lastResult = result;
  const accents = ['#2563eb', '#7c3aed', '#10b981'];
  $('#scenario-list').innerHTML = result.projections.map((item, index) => `
    <button type="button" class="scenario-card" data-scenario-index="${index}" style="--accent:${accents[index]};--bar:${55 + index * 20}%" aria-expanded="false">
      <span>${item.label}<b>${Math.round(item.annualRate * 100)}%</b></span>
      <strong>${money(item.nominalValue)}</strong>
      <small>לאחר ${item.years} שנים · לחצו לגרף וטבלה</small>
    </button>`).join('');
  $('#growth-detail').hidden = true;
}

function renderGrowthDetail(result, scenarioIndex) {
  const scenario = result.projections[scenarioIndex];
  const schedule = buildGrowthSchedule(result.existingBalance, result.suggestedMonthly, scenario.annualRate, scenario.years);
  const maxValue = Math.max(...schedule.map((row) => row.nominalValue), 1) * 1.08;
  $$('#scenario-list .scenario-card').forEach((card, index) => {
    const selected = index === scenarioIndex;
    card.classList.toggle('is-selected', selected);
    card.setAttribute('aria-expanded', String(selected));
  });
  $('#growth-detail-title').textContent = `${scenario.label} · ${Math.round(scenario.annualRate * 100)}% לשנה`;
  const chart = { left: 76, right: 730, top: 24, bottom: 220 };
  const points = schedule.map((row, index) => ({
    x: chart.left + (index / Math.max(1, schedule.length - 1)) * (chart.right - chart.left),
    y: chart.bottom - (row.nominalValue / maxValue) * (chart.bottom - chart.top),
  }));
  const compactMoney = (value) => `${new Intl.NumberFormat('he-IL', { notation: 'compact', maximumFractionDigits: 1 }).format(value)} ₪`;
  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const value = maxValue * index / 4;
    const y = chart.bottom - (index / 4) * (chart.bottom - chart.top);
    return `<line x1="${chart.left}" y1="${y}" x2="${chart.right}" y2="${y}" class="chart-grid"/><text x="${chart.left - 10}" y="${y + 4}" class="chart-label chart-label--y">${compactMoney(value)}</text>`;
  }).join('');
  const xEvery = Math.max(1, Math.ceil(scenario.years / 5));
  const xLabels = schedule.filter((row) => row.year % xEvery === 0 || row.year === scenario.years).map((row) => {
    const x = chart.left + (row.year / scenario.years) * (chart.right - chart.left);
    return `<line x1="${x}" y1="${chart.bottom}" x2="${x}" y2="${chart.bottom + 5}" class="chart-axis"/><text x="${x}" y="${chart.bottom + 22}" class="chart-label chart-label--x">${row.year}</text>`;
  }).join('');
  const pointString = points.map((point) => `${point.x},${point.y}`).join(' ');
  const areaString = `${chart.left},${chart.bottom} ${pointString} ${chart.right},${chart.bottom}`;
  $('#growth-chart').innerHTML = `${yTicks}<line x1="${chart.left}" y1="${chart.top}" x2="${chart.left}" y2="${chart.bottom}" class="chart-axis"/><line x1="${chart.left}" y1="${chart.bottom}" x2="${chart.right}" y2="${chart.bottom}" class="chart-axis"/>${xLabels}<polygon points="${areaString}" class="chart-area"/><polyline points="${pointString}" class="chart-line"/>${points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="3.5" class="chart-point"/>`).join('')}<text x="${(chart.left + chart.right) / 2}" y="262" class="chart-axis-title">שנים</text><text x="18" y="${(chart.top + chart.bottom) / 2}" class="chart-axis-title chart-axis-title--y">שווי משוער</text>`;
  $('#growth-table-body').innerHTML = schedule.map((row) => `<tr><th scope="row">${row.year === 0 ? 'היום' : `שנה ${row.year}`}</th><td>${money(row.openingBalance)}</td><td>${money(row.contributions)}</td><td>${money(row.estimatedGrowth)}</td><td><strong>${money(row.nominalValue)}</strong></td></tr>`).join('');
  $('#growth-detail').hidden = false;
  $('#growth-detail').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
}

function renderScore(result, profile) {
  const score = calculateUtilizationScore({
    deposited: result.deposited, ceiling: result.ceiling,
    hasMonthlyPlan: ['monthly', 'both'].includes(profile.depositMethod),
    fundStatus: profile.fundStatus, completionPreference: profile.completionPreference,
  });
  profile.score = score;
  countUp($('#score'), score, (value) => Math.round(value));
  $('#score-gauge').style.setProperty('--score-angle', `${score * 3.6}deg`);
  $('#score-meaning').textContent = score >= 80 ? 'ההיערכות שלך לשנת המס מתקדמת מאוד.' : score >= 50 ? 'יש בסיס טוב, ונשארו כמה צעדים להשלמה.' : 'יש מקום לבנות תוכנית הפקדה מסודרת יותר.';
  const components = [
    ['ניצול תקרה', Math.min(result.deposited / result.ceiling, 1) > 0],
    ['תוכנית חודשית', ['monthly', 'both'].includes(profile.depositMethod)],
    ['הוגדרו מטרות', profile.goals.length > 0],
  ].sort((a, b) => Number(b[1]) - Number(a[1]));
  $('#score-components').innerHTML = components.map(([label, done]) => `<li><i class="fas fa-${done ? 'circle-check' : 'circle'}"></i>${label}</li>`).join('');
}

function renderRecommendationSteps(result, profile) {
  const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  const stepsForUser = [];
  if (profile.fundStatus === 'none') {
    stepsForUser.push(buildRecommendation(result, profile));
    stepsForUser.push('להשוות בין מסלולי השקעה ודמי ניהול לפני פתיחת הקרן.');
    if (profile.goals.includes('monthly')) {
      const targetPayments = Math.min(result.scheduledMonthsRemaining, Math.floor(result.remaining / result.suggestedMonthly));
      const setupLumpSum = result.remaining - (targetPayments * result.suggestedMonthly);
      const setupMonth = targetPayments > 0 ? monthNames[12 - targetPayments] : `ינואר ${result.taxYear + 1}`;
      const lumpCopy = setupLumpSum > 0 ? `להפקיד ${money(setupLumpSum)} בהפקדה חד־פעמית, ובמקביל ` : '';
      stepsForUser.push(`לאחר פתיחת הקרן: ${lumpCopy}להגדיר הוראת קבע של ${money(result.suggestedMonthly)} החל מחודש ${setupMonth}, ולהמשיך איתה גם בשנת ${result.taxYear + 1}.`);
      stepsForUser.push(`חלופה נוספת: לאחר פתיחת הקרן, להפקיד השנה את מלוא התקרה, ${money(result.remaining)}, בהפקדה חד־פעמית; ומ־1.1.${result.taxYear + 1} להתחיל הוראת קבע שוטפת של כ־${money(result.suggestedMonthly)} בחודש. הסכום החודשי מבוסס על תקרת ${result.taxYear} ויש לעדכנו לאחר פרסום התקרה החדשה.`);
    } else {
      stepsForUser.push(`לאחר פתיחת הקרן, לבחון הפקדה שנתית עד ${money(result.ceiling)} בהתאם להכנסה ולתזרים.`);
    }
  } else {
    if (result.remaining > 0) {
      const keepMonthly = result.currentMonthlyDeposit > 0 ? `, ללא שינוי הוראת הקבע הקיימת בסך ${money(result.currentMonthlyDeposit)}` : '';
      stepsForUser.push(`אפשרות ראשונה: להפקיד ${money(result.remaining)} בהפקדה חד־פעמית${keepMonthly}.`);
      if (result.currentMonthlyDeposit > 0) {
        stepsForUser.push(`אפשרות שנייה: לעדכן את הוראת הקבע ל־${money(result.suggestedTotalMonthlyToYearEnd)} בחודש, לכל אחת מ־${result.scheduledMonthsRemaining} ההפקדות שנותרו השנה.`);
        if (result.nextYearRatePayments > 0) {
          const lumpPart = result.nextYearRateLumpSum > 0 ? `, ובנוסף להפקיד ${money(result.nextYearRateLumpSum)} בהפקדה חד־פעמית` : '';
          stepsForUser.push(`אפשרות שלישית: להשאיר את הוראת הקבע הקיימת עד חודש ${monthNames[result.nextYearRateStartMonthIndex - 1]}, ולעדכן אותה ל־${money(result.suggestedMonthly)} החל מחודש ${monthNames[result.nextYearRateStartMonthIndex]}${lumpPart}. כך הוראת הקבע כבר תהיה מותאמת בקירוב לתקרת השנה הבאה.`);
        }
      } else {
        stepsForUser.push(`או לחלופין: להתחיל הפקדה חודשית של כ־${money(result.suggestedMonthlyToYearEnd)} עד סוף השנה.`);
        if (profile.goals.includes('monthly')) {
          const targetPayments = Math.min(result.scheduledMonthsRemaining, Math.floor(result.remaining / result.suggestedMonthly));
          const setupLumpSum = result.remaining - (targetPayments * result.suggestedMonthly);
          const setupMonth = targetPayments > 0 ? monthNames[12 - targetPayments] : `ינואר ${result.taxYear + 1}`;
          const lumpCopy = setupLumpSum > 0 ? `להפקיד ${money(setupLumpSum)} בהפקדה חד־פעמית, ובמקביל ` : '';
          stepsForUser.push(`אפשרות נוספת לבניית הוראת קבע: ${lumpCopy}לעדכן את הוראת הקבע ל־${money(result.suggestedMonthly)} החל מחודש ${setupMonth}, ולהמשיך איתה גם בשנת ${result.taxYear + 1}.`);
        }
      }
    } else stepsForUser.push(buildRecommendation(result, profile));
    const wantsMonthlyPlan = profile.goals.includes('monthly');
    if (result.overCeiling > 0) {
      stepsForUser.push(`לקבוע תזכורת ל־1.1.${result.taxYear + 1}: לאחר פרסום התקרה המעודכנת, להפקיד את מלוא התקרה כבר בתחילת השנה, כדי שהכסף יוכל לעבוד לאורך כל השנה.`);
    }
    if (wantsMonthlyPlan && result.remaining > 0) {
      stepsForUser.push(`חלופה נוספת: להשלים השנה את מלוא היתרה, ${money(result.remaining)}, בהפקדה חד־פעמית; ומ־1.1.${result.taxYear + 1} להתחיל הוראת קבע שוטפת של כ־${money(result.suggestedMonthly)} בחודש. הסכום החודשי מבוסס על תקרת ${result.taxYear} ויש לעדכנו לאחר פרסום התקרה החדשה.`);
    }
    if (profile.completionPreference === 'lump' && !wantsMonthlyPlan && result.overCeiling === 0) {
      stepsForUser.push(`לקבוע כבר עכשיו תזכורת ל־1.1.${result.taxYear + 1}. לאחר פרסום התקרה המעודכנת לשנה הבאה, ניתן לשקול להפקיד אותה בתחילת השנה — כך הכסף יוכל להיות מושקע ולעבוד לאורך כל השנה.`);
    } else if (result.nextYearRatePayments === 0 && (result.overCeiling === 0 || wantsMonthlyPlan) && !(wantsMonthlyPlan && result.remaining > 0 && result.currentMonthlyDeposit === 0)) {
      const alternativePrefix = result.overCeiling > 0 ? 'לחילופין, ' : '';
      stepsForUser.push(`${alternativePrefix}להיערך לשנה הבאה עם הוראת קבע של כ־${money(result.suggestedMonthly)} בחודש, ולעדכן אותה כשהתקרה משתנה.`);
    }
    stepsForUser.push('לבדוק אחת לשנה שהמסלול ודמי הניהול עדיין מתאימים למטרות שבחרת.');
    stepsForUser.push('לבדוק שמנהל ההשקעות מייצר תשואה טובה ועקבית ביחס למתחרים לאורך תקופות זמן מתאימות.');
  }
  const itemHtml = (step, index) => {
    const isWarning = result.overCeiling > 0 && index === 0;
    return `<li${isWarning ? ' class="is-warning"' : ''}><span>${index + 1}</span><p>${isWarning ? '<i class="fas fa-triangle-exclamation" aria-hidden="true"></i>' : ''}${step}</p></li>`;
  };
  $('#recommendation-steps').innerHTML = stepsForUser.slice(0, 2).map(itemHtml).join('');
  const additional = stepsForUser.slice(2);
  $('#additional-recommendation-steps').innerHTML = additional.map((step, index) => itemHtml(step, index + 2)).join('');
  $('#more-recommendations').hidden = additional.length === 0;
}

function renderLiveCountdown(taxYear) {
  clearInterval(countdownTimer);
  const target = new Date(taxYear, 11, 31, 23, 59, 59, 999);
  const update = () => {
    const remainingMilliseconds = Math.max(0, target.getTime() - Date.now());
    const totalSeconds = Math.floor(remainingMilliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    $('#countdown-days').textContent = days.toLocaleString('he-IL');
    $('#countdown-hours').textContent = String(hours).padStart(2, '0');
    $('#countdown-minutes').textContent = String(minutes).padStart(2, '0');
    $('#countdown-seconds').textContent = String(seconds).padStart(2, '0');
    $('#tax-countdown').hidden = remainingMilliseconds === 0;
    if (remainingMilliseconds === 0) clearInterval(countdownTimer);
  };
  update();
  countdownTimer = setInterval(update, 1000);
}

function buildSecondaryCta(result, profile) {
  if (profile.fundStatus === 'none') return 'רוצה לבדוק איך פותחים קרן שמתאימה לך?';
  if (result.remaining > 0) return 'רוצה לוודא שהדרך לנצל את היתרה באמת מתאימה לך?';
  return 'רוצה לבדוק שהקרן הקיימת עדיין עובדת נכון עבורך?';
}

function renderResultIntro(result) {
  clearInterval(countdownTimer);
  const countdown = $('#tax-countdown');
  const intro = $('#result-intro');
  const message = $('#result-message');
  intro.classList.toggle('is-over-ceiling', result.overCeiling > 0);
  if (result.overCeiling > 0) {
    const isProjectedOverage = result.depositedToDate <= result.ceiling && result.futureScheduledDeposits > 0;
    $('#result-title').textContent = isProjectedOverage
      ? 'ההפקדות הצפויות השנה גבוהות מהתקרה המוטבת'
      : 'ההפקדות השנה גבוהות מהתקרה המוטבת';
    message.textContent = isProjectedOverage
      ? `הסכום הצפוי שמעל התקרה הוא ${money(result.overCeiling)}. כדאי לבדוק אותו לפני ביצוע הפקדות נוספות.`
      : `הסכום שמעל התקרה הוא ${money(result.overCeiling)}. כדאי לבדוק אותו לפני ביצוע הפקדות נוספות.`;
    message.hidden = false;
    countdown.hidden = true;
    return;
  }
  if (result.remaining === 0) {
    $('#result-title').textContent = `ניצלת את מלוא התקרה המוטבת לשנת ${result.taxYear}`;
    message.textContent = 'אין צורך לבצע הפקדה נוספת כדי לנצל את התקרה השנה.';
    message.hidden = false;
    countdown.hidden = true;
    return;
  }
  $('#result-title').textContent = 'ההזדמנות לנצל את ההטבה מסתיימת בסוף השנה';
  message.hidden = true;
  renderLiveCountdown(result.taxYear);
}

function renderResult(result, profile) {
  lastProfile = profile;
  countUp($('#remaining'), result.remaining, money);
  countUp($('#tax-benefit'), result.estimatedCombinedBenefitTotal, money);
  renderResultIntro(result);
  countUp($('#deposited-to-date'), result.depositedToDate, money);
  countUp($('#projected-annual'), result.projectedAnnualDeposited, money);
  const hasFutureProjection = result.projectedAnnualDeposited > result.depositedToDate;
  $('#projected-deposit-row').hidden = !hasFutureProjection;
  $('#future-scheduled').hidden = !hasFutureProjection;
  $('#deposit-mini').classList.toggle('is-single', !hasFutureProjection);
  $('#future-scheduled').textContent = hasFutureProjection ? `מתוכם ${money(result.futureScheduledDeposits)} צפויים בהוראת הקבע עד סוף השנה` : '';
  countUp($('#income-tax-benefit'), result.estimatedTotalTaxBenefit, money);
  const taxRatesCopy = result.taxRatesUsed.map((rate) => `${rate * 100}%`).join(' ו־');
  $('#income-tax-note').textContent = result.taxBenefitUsesMultipleBrackets
    ? `הניכוי חוצה מדרגות מס; האומדן חושב לפי המדרגות ${taxRatesCopy}.`
    : `על ההפקדה השנתית המוכרת, לפי מס שולי משוער של ${taxRatesCopy || `${result.taxRate * 100}%`}.`;
  countUp($('#insurance-benefit'), result.estimatedNationalInsuranceBenefitTotal, money);
  countUp($('#capital-gains-benefit'), result.estimatedCapitalGainsExemptionValueTotal, money);
  const ctaCopy = buildCta(result, profile);
  $('#dynamic-cta').textContent = ctaCopy;
  $('#dynamic-cta-secondary').textContent = buildSecondaryCta(result, profile);
  renderScore(result, profile);
  renderRecommendationSteps(result, profile);
  renderScenarios(result);
  $('.growth-notice').textContent = `החישוב מתחיל מהצבירה שהזנת, ${money(result.existingBalance)}, ומוסיף הפקדה חודשית קבועה של ${money(result.suggestedMonthly)} (תקרת ${result.taxYear} חלקי 12), ללא הפקדה חד־פעמית ולפני דמי ניהול. המחשה בלבד, ללא התחייבות לתשואה; הסכומים נומינליים ובהנחת תשואה קבועה.`;
  const whatsappUrl = buildWhatsAppUrl(result, profile);
  $('#whatsapp').href = whatsappUrl;
  $('#whatsapp-secondary').href = whatsappUrl;
  $('#share-benefits').href = buildConsumerShareUrl();
  const bracketNote = result.taxBenefitUsesMultipleBrackets
    ? '<p><strong>לתשומת לב:</strong> הניכוי חוצה מדרגת מס, ולכן הטבת מס ההכנסה חושבה לפי המס לפני ואחרי הניכוי ובהתאם לכל מדרגות המס הרלוונטיות — ולא לפי שיעור שולי יחיד.</p>'
    : '';
  $('#calculation-details').innerHTML = `<p><strong>תקרת 2026:</strong> ${money(result.ceiling)} · <strong>הכנסה:</strong> ${money(result.income)} · <strong>הופקד השנה:</strong> ${money(result.depositedToDate)}${hasFutureProjection ? ` · <strong>צפוי עד סוף השנה כולל הוראת קבע:</strong> ${money(result.projectedAnnualDeposited)}` : ''}</p><p>אומדן ההטבות מחושב בהנחה של מיקסום ההפקדה השנתית עד התקרה, ולכן כולל גם את ההפקדות שכבר בוצעו ואת הוראת הקבע הצפויה עד סוף השנה — ולא רק את יתרת ההשלמה.</p><p><strong>מדרגת מס שולית משוערת לפני הניכוי:</strong> ${result.taxRate * 100}% · <strong>שיעור ניכוי:</strong> ${result.deductibleRate * 100}%</p>${bracketNote}<p><strong>הטבה מיידית משוערת:</strong> מס הכנסה ${money(result.estimatedTotalTaxBenefit)} + ביטוח לאומי/בריאות ${money(result.estimatedNationalInsuranceBenefitTotal)}.</p><p><strong>שווי עתידי משוער:</strong> פטור ממס רווחי הון ${money(result.estimatedCapitalGainsExemptionValueTotal)}, בהנחת 8% לשנה ל־6 שנים ומס של 25% על הרווח.</p><p>מקורות: לוח הניכויים 2026 של רשות המסים ושיעורי ביטוח לאומי לעצמאי החל מ־1.1.2026. אימות: 19.07.2026. כל הרכיבים הם אומדן הדורש אימות אישי.</p>`;
}

form.addEventListener('click', (event) => {
  const amount = event.target.closest('[data-amount]')?.dataset.amount;
  if (amount) { $('#income').value = Number(amount).toLocaleString('he-IL'); updateSummary(); scheduleAdvance(() => transitionTo(1)); return; }
  if (event.target.closest('[data-back]')) {
    clearTimeout(advanceTimer);
    if (stepHistory.length > 1) {
      stepHistory.pop();
      trackEvent('step_back_clicked', { from_step: currentStep + 1, to_step: stepHistory[stepHistory.length - 1] + 1 });
      transitionTo(stepHistory[stepHistory.length - 1], false);
    }
    return;
  }
  if (event.target.closest('[data-next]') && validateStep()) transitionTo(currentStep === 0 ? 1 : 3);
});

form.addEventListener('change', (event) => {
  if (event.target.matches('input[type="radio"], input[type="checkbox"]')) updateSelectedCards();
  if (event.target.name === 'depositMethod') {
    updateDepositFields();
    const target = ['lump', 'both'].includes(event.target.value) ? $('#lumpSum')
      : ['monthly'].includes(event.target.value) ? $('#monthlyDeposit') : $('#existingBalance');
    if (target && normalizeMoney(target.value) === 0) target.value = '';
    target?.focus({ preventScroll: true });
    requestAnimationFrame(() => {
      target?.closest('.conditional-fields')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    });
  }
  updateSummary();
  saveFormState();
  if (event.target.name === 'fundStatus') {
    const destination = event.target.value === 'none' ? 3 : 2;
    scheduleAdvance(() => transitionTo(destination));
  }
});

form.addEventListener('input', (event) => {
  if (event.target.name === 'monthsDeposited') validateMonthsDeposited();
  if (event.target.matches('[inputmode="numeric"], input[type="number"]')) updateSummary();
  saveFormState();
});

form.addEventListener('focusout', (event) => {
  if (event.target.matches('[inputmode="numeric"]')) formatMoneyInput(event.target);
});

form.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || event.isComposing || currentStep === steps.length - 1) return;
  if (!event.target.matches('input:not([type="radio"]):not([type="checkbox"])')) return;
  event.preventDefault();
  if (!validateStep()) return;
  if (currentStep === 0) transitionTo(1);
  else if (currentStep === 2) transitionTo(3);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (isSubmitting) return;
  if (!validateStep()) return;
  isSubmitting = true;
  clearTimeout(advanceTimer);
  try {
    const { input, profile } = collect();
    const result = calculateConsumerResult(input);
    trackOnce('calculator_completed', { fund_status: profile.fundStatus, deposit_method: profile.depositMethod, goals: profile.goals.join('|'), result_status: resultStatus(result), ...attributionParameters });
    $('.wizard-layout').hidden = true;
    $('.check-heading').hidden = true;
    $('#loading').hidden = false;
    const loadingSteps = $$('#loading li');
    let active = 0;
    const timer = setInterval(() => { loadingSteps.forEach((item, i) => item.classList.toggle('is-active', i === ++active)); }, 260);
    setTimeout(() => {
      clearInterval(timer);
      $('#loading').hidden = true;
      renderResult(result, profile);
      $('#results').hidden = false;
      $('#results').focus();
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 850);
  } catch {
    isSubmitting = false;
    $('#form-error').textContent = 'לא הצלחנו לחשב. בדקו שהסכומים תקינים ונסו שוב.';
  }
});

$$('[data-years]').forEach((button) => button.addEventListener('click', () => {
  $$('[data-years]').forEach((item) => item.classList.toggle('is-active', item === button));
  if (!lastProfile) return;
  const { input } = collect(Number(button.dataset.years));
  renderScenarios(calculateConsumerResult(input));
}));

$('#scenario-list').addEventListener('click', (event) => {
  const card = event.target.closest('[data-scenario-index]');
  if (!card || !lastResult) return;
  renderGrowthDetail(lastResult, Number(card.dataset.scenarioIndex));
  trackEvent('details_opened', { details_type: 'growth_scenario' });
});

$$('.calculation-details, #more-recommendations').forEach((details) => details.addEventListener('toggle', () => {
  if (details.open) trackEvent('details_opened', { details_type: details.classList.contains('calculation-details') ? 'calculation_method' : 'additional_actions' });
}));

$$('#whatsapp, #whatsapp-secondary').forEach((link) => link.addEventListener('click', () => {
  trackEvent('whatsapp_clicked', { result_status: resultStatus(lastResult), fund_status: lastProfile?.fundStatus || '', ...attributionParameters });
  const notice = $('#whatsapp-status');
  if (notice) notice.textContent = 'WhatsApp נפתח בחלון חדש. לאחר שליחת ההודעה רועי יוכל לחזור אליך.';
}));

$('#share-benefits').addEventListener('click', () => trackEvent('share_clicked', { share_method: 'whatsapp', entry_source: attribution.source }));
$('#copy-share-link').addEventListener('click', async () => {
  await navigator.clipboard.writeText(SITE_CONFIG.publicBaseUrl);
  $('#share-feedback').textContent = 'הקישור הועתק';
  trackEvent('share_clicked', { share_method: 'copy_link', entry_source: attribution.source });
});
const nativeShare = $('#native-share');
nativeShare.hidden = typeof navigator.share !== 'function';
nativeShare.addEventListener('click', async () => {
  try { await navigator.share({ title: 'בדיקת קרן השתלמות לעצמאים', text: buildShareMessage(''), url: SITE_CONFIG.publicBaseUrl }); trackEvent('share_clicked', { share_method: 'native_share', entry_source: attribution.source }); } catch { /* Cancellation is not an error. */ }
});

function restartCalculator() {
  try { sessionStorage.removeItem(FORM_STATE_KEY); sessionStorage.removeItem('consumer_event_calculator_completed'); sessionStorage.removeItem('consumer_event_calculator_started'); } catch { /* Ignore unavailable storage. */ }
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  location.assign('./check.html?restart=1');
}
$('#restart').addEventListener('click', restartCalculator);
$('#stage-restart').addEventListener('click', restartCalculator);
if (new URLSearchParams(location.search).has('restart')) {
  try { sessionStorage.removeItem(FORM_STATE_KEY); } catch { /* Ignore unavailable storage. */ }
  history.replaceState(null, '', './check.html');
  scrollTo(0, 0);
}
trackOnceOrQueue('calculator_started', attributionParameters);
restoreFormState();
renderStep(currentStep, false);
