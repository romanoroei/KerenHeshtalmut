import { calculateConsumerResult, normalizeMoney } from '../engine/calculator.js';
import { buildWhatsAppUrl } from '../messages/whatsapp.js';

const form = document.querySelector('#consumer-form');
const steps = [...document.querySelectorAll('.step')];
const progress = document.querySelector('#progress');
const error = document.querySelector('#form-error');
const resultSection = document.querySelector('#results');
let currentStep = 0;

const money = (value) => new Intl.NumberFormat('he-IL', {
  style: 'currency', currency: 'ILS', maximumFractionDigits: 0,
}).format(Math.round(value));

function showStep(index) {
  currentStep = Math.max(0, Math.min(index, steps.length - 1));
  steps.forEach((step, i) => { step.hidden = i !== currentStep; });
  progress.value = currentStep + 1;
  progress.setAttribute('aria-valuetext', `שלב ${currentStep + 1} מתוך 4`);
  error.textContent = '';
  steps[currentStep].querySelector('input')?.focus();
}

function validateCurrentStep() {
  const required = steps[currentStep].querySelectorAll('[required]');
  for (const field of required) {
    if (field.type === 'radio') {
      if (!form.querySelector(`[name="${field.name}"]:checked`)) return false;
    } else if (!Number.isFinite(normalizeMoney(field.value)) || (field.name === 'income' && normalizeMoney(field.value) <= 0)) return false;
  }
  return true;
}

form.addEventListener('click', (event) => {
  const next = event.target.closest('[data-next]');
  const back = event.target.closest('[data-back]');
  if (back) showStep(currentStep - 1);
  if (next) {
    if (!validateCurrentStep()) {
      error.textContent = 'כדי להמשיך, יש למלא תשובה תקינה.';
      return;
    }
    showStep(currentStep + 1);
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateCurrentStep()) return;
  try {
    const values = new FormData(form);
    const result = calculateConsumerResult({ income: values.get('income'), deposited: values.get('deposited') });
    document.querySelector('#remaining').textContent = money(result.remaining);
    document.querySelector('#tax-benefit').textContent = money(result.estimatedTaxBenefit);
    document.querySelector('#monthly').textContent = `${money(result.suggestedMonthly)} בחודש`;
    document.querySelector('#scenario-list').innerHTML = result.projections.map((item) =>
      `<li><span>${item.label} · ${Math.round(item.annualRate * 100)}%</span><strong>${money(item.nominalValue)}</strong></li>`).join('');
    const cta = result.remaining === 0
      ? 'ניצלת את התקרה השנה — אפשר לתכנן את השנה הבאה.'
      : result.remaining < 3000
        ? 'כמעט סיימת — אפשר לבדוק איך להשלים את היתרה.'
        : 'יש עוד מקום לנצל השנה — אפשר לבדוק את הדרך המתאימה לך.';
    document.querySelector('#dynamic-cta').textContent = cta;
    document.querySelector('#whatsapp').href = buildWhatsAppUrl(result);
    form.hidden = true;
    resultSection.hidden = false;
    resultSection.focus();
  } catch {
    error.textContent = 'לא הצלחנו לחשב. בדקו שהסכומים תקינים ונסו שוב.';
  }
});

document.querySelector('#restart').addEventListener('click', () => {
  resultSection.hidden = true;
  form.hidden = false;
  showStep(0);
});

showStep(0);
