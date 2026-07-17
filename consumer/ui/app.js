import { calculateConsumerResult, normalizeMoney } from '../engine/calculator.js';
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
  none: 'עדיין אין קרן', locked: 'קרן לא נזילה', liquid: 'קרן נזילה', unknown: 'לא בטוח',
};
let currentStep = 0;
let lastProfile;
let advanceTimer;
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
  $('#summary-fund').textContent = labels[form.elements.fundStatus.value] || 'טרם נבחר';
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
  const accents = ['#2563eb', '#7c3aed', '#10b981'];
  $('#scenario-list').innerHTML = result.projections.map((item, index) => `
    <article class="scenario-card" style="--accent:${accents[index]};--bar:${55 + index * 20}%">
      <span>${item.label}<b>${Math.round(item.annualRate * 100)}%</b></span>
      <strong>${money(item.nominalValue)}</strong>
      <small>לאחר ${item.years} שנים · סכום נומינלי</small>
    </article>`).join('');
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
    ['מצב הקרן ידוע', profile.fundStatus !== 'unknown'],
    ['הוגדרו מטרות', profile.goals.length > 0],
  ];
  $('#score-components').innerHTML = components.map(([label, done]) => `<li><i class="fas fa-${done ? 'circle-check' : 'circle'}"></i>${label}</li>`).join('');
}

function renderRecommendationSteps(result, profile) {
  const stepsForUser = [buildRecommendation(result, profile)];
  if (profile.fundStatus === 'none') {
    stepsForUser.push('להשוות בין מסלולי השקעה ודמי ניהול לפני פתיחת הקרן.');
    stepsForUser.push(`לאחר פתיחת הקרן, לבחון הפקדה שנתית עד ${money(result.ceiling)} בהתאם להכנסה ולתזרים.`);
  } else {
    if (result.remaining > 0) stepsForUser.push(`לבחור כיצד לנצל את היתרה של ${money(result.remaining)} עד סוף שנת המס.`);
    stepsForUser.push(`להיערך לשנה הבאה עם הוראת קבע של כ־${money(result.suggestedMonthly)} בחודש, ולעדכן אותה כשהתקרה משתנה.`);
    stepsForUser.push('לבדוק אחת לשנה שהמסלול ודמי הניהול עדיין מתאימים למטרות שבחרת.');
  }
  $('#recommendation-steps').innerHTML = stepsForUser.map((step, index) => `<li><span>${index + 1}</span><p>${step}</p></li>`).join('');
}

function renderResult(result, profile) {
  lastProfile = profile;
  const hero = $('#result-hero');
  hero.classList.toggle('is-attention', result.overCeiling > 0);
  let headline = 'נשאר לך מקום לנצל השנה';
  let detail = 'זהו הסכום שניתן לשקול להפקיד עד לתקרה המוטבת לשנת 2026.';
  let mainValue = result.remaining;
  if (result.overCeiling > 0) {
    headline = 'חלק מההפקדה שלך נמצא מעל התקרה המוטבת';
    detail = 'הסכום שמעל התקרה לא צפוי ליהנות מהפטור על הרווחים.';
    mainValue = result.overCeiling;
  } else if (result.remaining === 0) {
    headline = 'ניצלת את מלוא התקרה המוטבת לשנת 2026';
    detail = 'אפשר להתמקד בהתאמת המסלול ולהיערך לשנה הבאה.';
  }
  $('#headline').textContent = headline;
  $('#headline-detail').textContent = detail;
  countUp($('#hero-remaining'), mainValue, money);
  countUp($('#remaining'), result.remaining, money);
  countUp($('#tax-benefit'), result.estimatedCombinedBenefitTotal, money);
  countUp($('#monthly'), result.suggestedMonthly, (value) => `${money(value)} בחודש`);
  countUp($('#deposited-to-date'), result.depositedToDate, money);
  countUp($('#projected-annual'), result.projectedAnnualDeposited, money);
  $('#future-scheduled').textContent = result.futureScheduledDeposits > 0 ? `מתוכם ${money(result.futureScheduledDeposits)} צפויים בהוראת הקבע עד סוף השנה` : 'לא הוזנו הפקדות חודשיות עתידיות';
  countUp($('#income-tax-benefit'), result.estimatedTotalTaxBenefit, money);
  countUp($('#insurance-benefit'), result.estimatedNationalInsuranceBenefitTotal, money);
  countUp($('#capital-gains-benefit'), result.estimatedCapitalGainsExemptionValueTotal, money);
  $('#dynamic-cta').textContent = buildCta(result, profile);
  renderScore(result, profile);
  renderRecommendationSteps(result, profile);
  renderScenarios(result);
  $('.growth-notice').textContent = `החישוב מניח הפקדה חודשית קבועה של ${money(result.suggestedMonthly)} (תקרת 2026 חלקי 12), ללא יתרה התחלתית וללא הפקדה חד־פעמית, ולפני דמי ניהול. הוא אינו מבוסס על ההפקדות שהזנת. המחשה בלבד, ללא התחייבות לתשואה; הסכומים נומינליים ובהנחת תשואה קבועה.`;
  $('#whatsapp').href = buildWhatsAppUrl(result, profile);
  $('#calculation-details').innerHTML = `<p><strong>תקרת 2026:</strong> ${money(result.ceiling)} · <strong>הכנסה:</strong> ${money(result.income)} · <strong>הופקד עד היום:</strong> ${money(result.depositedToDate)} · <strong>צפי עד סוף השנה:</strong> ${money(result.projectedAnnualDeposited)}</p><p>אומדן ההטבות מחושב בהנחה של מיקסום ההפקדה השנתית עד התקרה, ולכן כולל גם את ההפקדות שכבר בוצעו ואת הוראת הקבע הצפויה עד סוף השנה — ולא רק את יתרת ההשלמה.</p><p><strong>מדרגת מס משוערת:</strong> ${result.taxRate * 100}% · <strong>שיעור ניכוי:</strong> ${result.deductibleRate * 100}%</p><p><strong>הטבה מיידית משוערת:</strong> מס הכנסה ${money(result.estimatedTotalTaxBenefit)} + ביטוח לאומי/בריאות ${money(result.estimatedNationalInsuranceBenefitTotal)}.</p><p><strong>שווי עתידי משוער:</strong> פטור ממס רווחי הון ${money(result.estimatedCapitalGainsExemptionValueTotal)}, בהנחת 8% לשנה ל־6 שנים ומס של 25% על הרווח.</p><p>מקורות: ספר הניכויים 2026 ושיעורי ביטוח לאומי לעצמאי 2026 כפי שתועדו באתר המקצועי. אימות: 15.07.2026. כל הרכיבים הם אומדן הדורש אימות אישי.</p>`;
}

form.addEventListener('click', (event) => {
  const amount = event.target.closest('[data-amount]')?.dataset.amount;
  if (amount) { $('#income').value = Number(amount).toLocaleString('he-IL'); updateSummary(); return; }
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
  if (event.target.name === 'depositMethod') updateDepositFields();
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

$('#restart').addEventListener('click', () => location.reload());
renderStep(0, false);
