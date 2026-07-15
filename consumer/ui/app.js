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

function renderStep(index, animate = true) {
  currentStep = Math.max(0, Math.min(index, steps.length - 1));
  steps.forEach((step, i) => { step.hidden = i !== currentStep; step.classList.remove('is-leaving'); });
  $('#step-copy').textContent = `שלב ${currentStep + 1} מתוך 5`;
  $('#step-title').textContent = steps[currentStep].dataset.title;
  $('#progress-fill').style.width = `${(currentStep + 1) * 20}%`;
  $('.progress-track').setAttribute('aria-valuenow', String(currentStep + 1));
  $('[data-back]').hidden = currentStep === 0;
  $('[data-next]').hidden = currentStep === steps.length - 1;
  $('#submit-check').hidden = currentStep !== steps.length - 1;
  $('#form-error').textContent = '';
  if (animate) steps[currentStep].classList.add('is-entering');
  steps[currentStep].querySelector('input')?.focus({ preventScroll: true });
  if (innerWidth <= 640) form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

function validateStep() {
  const active = steps[currentStep];
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

function transitionTo(index) {
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
      completionPreference: data.get('completionPreference'),
      goal: data.get('goal'),
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
    ['דרך השלמה נבחרה', profile.completionPreference !== 'unknown'],
  ];
  $('#score-components').innerHTML = components.map(([label, done]) => `<li><i class="fas fa-${done ? 'circle-check' : 'circle'}"></i>${label}</li>`).join('');
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
  countUp($('#tax-benefit'), result.estimatedAdditionalTaxBenefit, money);
  countUp($('#monthly'), result.suggestedMonthly, (value) => `${money(value)} בחודש`);
  $('#total-tax-benefit').textContent = `סך ההטבה המשוערת על ההפקדות המזכות: ${money(result.estimatedTotalTaxBenefit)}`;
  $('#recommendation').textContent = buildRecommendation(result, profile);
  $('#dynamic-cta').textContent = buildCta(result, profile);
  renderScore(result, profile);
  renderScenarios(result);
  $('#whatsapp').href = buildWhatsAppUrl(result, profile);
  $('#calculation-details').innerHTML = `<p><strong>תקרת 2026:</strong> ${money(result.ceiling)} · <strong>הכנסה:</strong> ${money(result.income)} · <strong>הופקד:</strong> ${money(result.deposited)}</p><p><strong>מדרגת מס משוערת:</strong> ${result.taxRate * 100}% · <strong>שיעור ניכוי:</strong> ${result.deductibleRate * 100}%</p><p>מקור: ספר הניכויים 2026 כפי שתועד באתר המקצועי. אימות: 15.07.2026. מדרגות המס ושיעור הניכוי הם אומדן הדורש אימות.</p>`;
}

$('#start').addEventListener('click', () => $('#check').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));

form.addEventListener('click', (event) => {
  const amount = event.target.closest('[data-amount]')?.dataset.amount;
  if (amount) { $('#income').value = Number(amount).toLocaleString('he-IL'); updateSummary(); return; }
  if (event.target.closest('[data-back]')) transitionTo(currentStep - 1);
  if (event.target.closest('[data-next]') && validateStep()) transitionTo(currentStep + 1);
});

form.addEventListener('change', (event) => {
  if (event.target.matches('input[type="radio"]')) updateSelectedCards();
  if (event.target.name === 'depositMethod') updateDepositFields();
  updateSummary();
});

form.addEventListener('input', (event) => {
  if (event.target.matches('[inputmode="numeric"], input[type="number"]')) updateSummary();
});

form.addEventListener('focusout', (event) => {
  if (event.target.matches('[inputmode="numeric"]')) formatMoneyInput(event.target);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateStep()) return;
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
