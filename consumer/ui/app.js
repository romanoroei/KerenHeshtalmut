import { buildGrowthSchedule, calculateConsumerResult, normalizeMoney } from '../engine/calculator.js';
import { calculateUtilizationScore } from '../engine/score.js';
import { buildCta, buildRecommendation } from '../engine/recommendations.js';
import { buildWhatsAppUrl } from '../messages/whatsapp.js';
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
  const months = ['monthly', 'both'].includes(method) ? Number(form.elements.monthsDeposited.value) || 0 : 0;
  return lump + monthly * months;
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
  $('#summary-deposited').textContent = depositMethod ? money(depositTotalFromForm()) : 'טרם הוזן';
  const balance = normalizeMoney(form.elements.existingBalance.value);
  const fundStatus = form.elements.fundStatus.value;
  $('#summary-balance').textContent = fundStatus === 'none' ? 'לא רלוונטי' : fundStatus && Number.isFinite(balance) ? money(balance) : 'טרם הוזנה';
  $('#summary-fund').textContent = labels[fundStatus] || 'טרם נבחר';
  const preview = $('#deposit-preview');
  if (depositMethod) {
    preview.hidden = false;
    $('span', preview).textContent = `עד כה הוזנו הפקדות בסך ${money(depositTotalFromForm())}.`;
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
  if (method === 'monthly') return monthly > 0 && months > 0;
  if (method === 'both') return lump > 0 && monthly > 0 && months > 0;
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
  steps[currentStep].querySelector('input')?.focus({ preventScroll: true });
  if (innerWidth <= 640) form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

function validateStep() {
  const active = steps[currentStep];
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
      existingBalance: data.get('existingBalance') || 0,
      projectionYears: years,
    },
    profile: {
      depositMethod: method,
      fundStatus: data.get('fundStatus'),
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
  ];
  $('#score-components').innerHTML = components.map(([label, done]) => `<li><i class="fas fa-${done ? 'circle-check' : 'circle'}"></i>${label}</li>`).join('');
}

function renderRecommendationSteps(result, profile) {
  const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  const stepsForUser = [];
  if (profile.fundStatus === 'none') {
    stepsForUser.push(buildRecommendation(result, profile));
    stepsForUser.push('להשוות בין מסלולי השקעה ודמי ניהול לפני פתיחת הקרן.');
    stepsForUser.push(`לאחר פתיחת הקרן, לבחון הפקדה שנתית עד ${money(result.ceiling)} בהתאם להכנסה ולתזרים.`);
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
      }
    } else stepsForUser.push(buildRecommendation(result, profile));
    if (result.nextYearRatePayments === 0) stepsForUser.push(`להיערך לשנה הבאה עם הוראת קבע של כ־${money(result.suggestedMonthly)} בחודש, ולעדכן אותה כשהתקרה משתנה.`);
    stepsForUser.push('לבדוק אחת לשנה שהמסלול ודמי הניהול עדיין מתאימים למטרות שבחרת.');
    stepsForUser.push('לבדוק שמנהל ההשקעות מייצר תשואה טובה ועקבית ביחס למתחרים לאורך תקופות זמן מתאימות.');
  }
  $('#recommendation-steps').innerHTML = stepsForUser.map((step, index) => {
    const isWarning = result.overCeiling > 0 && index === 0;
    return `<li${isWarning ? ' class="is-warning"' : ''}><span>${index + 1}</span><p>${isWarning ? '<i class="fas fa-triangle-exclamation" aria-hidden="true"></i>' : ''}${step}</p></li>`;
  }).join('');
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
    $('#result-title').textContent = 'ההפקדות הצפויות השנה גבוהות מהתקרה המוטבת';
    message.textContent = `הסכום הצפוי שמעל התקרה הוא ${money(result.overCeiling)}. כדאי לבדוק אותו לפני ביצוע הפקדות נוספות.`;
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
  countUp($('#insurance-benefit'), result.estimatedNationalInsuranceBenefitTotal, money);
  countUp($('#capital-gains-benefit'), result.estimatedCapitalGainsExemptionValueTotal, money);
  const ctaCopy = buildCta(result, profile);
  $('#dynamic-cta').textContent = ctaCopy;
  $('#dynamic-cta-secondary').textContent = buildSecondaryCta(result, profile);
  renderScore(result, profile);
  renderRecommendationSteps(result, profile);
  renderScenarios(result);
  $('.growth-notice').textContent = `החישוב מתחיל מהצבירה שהזנת, ${money(result.existingBalance)}, ומוסיף הפקדה חודשית קבועה של ${money(result.suggestedMonthly)} (תקרת 2026 חלקי 12), ללא הפקדה חד־פעמית ולפני דמי ניהול. המחשה בלבד, ללא התחייבות לתשואה; הסכומים נומינליים ובהנחת תשואה קבועה.`;
  const whatsappUrl = buildWhatsAppUrl(result, profile);
  $('#whatsapp').href = whatsappUrl;
  $('#whatsapp-secondary').href = whatsappUrl;
  $('#calculation-details').innerHTML = `<p><strong>תקרת 2026:</strong> ${money(result.ceiling)} · <strong>הכנסה:</strong> ${money(result.income)} · <strong>הופקד השנה:</strong> ${money(result.depositedToDate)}${hasFutureProjection ? ` · <strong>צפוי עד סוף השנה כולל הוראת קבע:</strong> ${money(result.projectedAnnualDeposited)}` : ''}</p><p>אומדן ההטבות מחושב בהנחה של מיקסום ההפקדה השנתית עד התקרה, ולכן כולל גם את ההפקדות שכבר בוצעו ואת הוראת הקבע הצפויה עד סוף השנה — ולא רק את יתרת ההשלמה.</p><p><strong>מדרגת מס משוערת:</strong> ${result.taxRate * 100}% · <strong>שיעור ניכוי:</strong> ${result.deductibleRate * 100}%</p><p><strong>הטבה מיידית משוערת:</strong> מס הכנסה ${money(result.estimatedTotalTaxBenefit)} + ביטוח לאומי/בריאות ${money(result.estimatedNationalInsuranceBenefitTotal)}.</p><p><strong>שווי עתידי משוער:</strong> פטור ממס רווחי הון ${money(result.estimatedCapitalGainsExemptionValueTotal)}, בהנחת 8% לשנה ל־6 שנים ומס של 25% על הרווח.</p><p>מקורות: ספר הניכויים 2026 ושיעורי ביטוח לאומי לעצמאי 2026 כפי שתועדו באתר המקצועי. אימות: 15.07.2026. כל הרכיבים הם אומדן הדורש אימות אישי.</p>`;
}

form.addEventListener('click', (event) => {
  const amount = event.target.closest('[data-amount]')?.dataset.amount;
  if (amount) { $('#income').value = Number(amount).toLocaleString('he-IL'); updateSummary(); scheduleAdvance(() => transitionTo(1)); return; }
  if (event.target.closest('[data-back]')) {
    clearTimeout(advanceTimer);
    if (stepHistory.length > 1) {
      stepHistory.pop();
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
    requestAnimationFrame(() => {
      const target = ['lump', 'both'].includes(event.target.value) ? $('#lumpSum')
        : ['monthly'].includes(event.target.value) ? $('#monthlyDeposit') : $('#existingBalance');
      target?.focus({ preventScroll: true });
      target?.closest('.conditional-fields')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    });
  }
  updateSummary();
  if (event.target.name === 'fundStatus') {
    const destination = event.target.value === 'none' ? 3 : 2;
    scheduleAdvance(() => transitionTo(destination));
  }
});

form.addEventListener('input', (event) => {
  if (event.target.matches('[inputmode="numeric"], input[type="number"]')) updateSummary();
});

form.addEventListener('focusout', (event) => {
  if (event.target.matches('[inputmode="numeric"]')) formatMoneyInput(event.target);
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
});

$('#restart').addEventListener('click', () => location.reload());
renderStep(0, false);
