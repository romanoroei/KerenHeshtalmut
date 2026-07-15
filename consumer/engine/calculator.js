import { RETURN_SCENARIOS, TAX_DATA_2026 } from '../data/tax-data.js';

export function normalizeMoney(value) {
  if (typeof value === 'string') value = value.replace(/[₪,\s]/g, '');
  if (value === '' || value === null || value === undefined) return NaN;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : NaN;
}

export function marginalTaxRate(income, brackets = TAX_DATA_2026.taxBrackets.value) {
  if (!Number.isFinite(income) || income < 0) return 0;
  return brackets.find(([limit]) => income <= limit)?.[1] ?? 0;
}

export function futureValueOfMonthlyDeposits(monthlyDeposit, annualRate, years = 6) {
  if (![monthlyDeposit, annualRate, years].every(Number.isFinite) || monthlyDeposit < 0 || annualRate < 0 || years < 0) {
    throw new TypeError('Invalid forecast input');
  }
  const months = Math.round(years * 12);
  if (annualRate === 0) return monthlyDeposit * months;
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  return monthlyDeposit * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

export function calculateConsumerResult(input, data = TAX_DATA_2026) {
  const income = normalizeMoney(input.income);
  const deposited = normalizeMoney(input.deposited);
  if (!Number.isFinite(income) || income <= 0) throw new TypeError('Income must be greater than zero');
  if (!Number.isFinite(deposited)) throw new TypeError('Deposited amount must be zero or greater');

  const ceiling = data.contributionCeiling.value;
  const remaining = Math.max(0, ceiling - deposited);
  const eligibleIncome = Math.min(income, data.qualifyingIncomeCeiling.value);
  const annualDeductible = Math.min(
    eligibleIncome * data.deductibleRate.value,
    data.maxDeductibleContribution.value,
  );
  const deductibleAlreadyUsed = Math.min(deposited, annualDeductible);
  const additionalDeductible = Math.min(remaining, Math.max(0, annualDeductible - deductibleAlreadyUsed));
  const estimatedTaxBenefit = additionalDeductible * marginalTaxRate(income, data.taxBrackets.value);
  const suggestedMonthly = Math.ceil(ceiling / 12);
  const projections = RETURN_SCENARIOS.map((scenario) => ({
    ...scenario,
    years: 6,
    nominalValue: futureValueOfMonthlyDeposits(suggestedMonthly, scenario.annualRate, 6),
  }));

  return {
    taxYear: data.taxYear,
    income,
    deposited,
    ceiling,
    remaining,
    overCeiling: Math.max(0, deposited - ceiling),
    estimatedTaxBenefit,
    suggestedMonthly,
    projections,
  };
}
