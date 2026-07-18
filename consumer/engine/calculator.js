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

export function nationalInsuranceDue(income, config = TAX_DATA_2026.nationalInsurance.value) {
  if (!Number.isFinite(income) || income < 0) return 0;
  const threshold = config.reducedMonthly * 12;
  const maximum = config.maxMonthly * 12;
  const insuredIncome = Math.min(income, maximum);
  const reducedPart = Math.min(insuredIncome, threshold);
  const regularPart = Math.max(0, insuredIncome - threshold);
  return reducedPart * config.reducedRate + regularPart * config.regularRate;
}

export function capitalGainsExemptionValue(contribution, config = TAX_DATA_2026.capitalGainsExemption.value) {
  if (!Number.isFinite(contribution) || contribution < 0) throw new TypeError('Invalid contribution');
  const gain = contribution * (Math.pow(1 + config.annualReturn, config.years) - 1);
  return gain * config.capitalGainsTaxRate;
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

export function buildGrowthSchedule(existingBalance, monthlyDeposit, annualRate, years) {
  if (![existingBalance, monthlyDeposit, annualRate, years].every(Number.isFinite)
    || existingBalance < 0 || monthlyDeposit < 0 || annualRate < 0 || years < 1) {
    throw new TypeError('Invalid growth schedule input');
  }
  return Array.from({ length: Math.round(years) + 1 }, (_, year) => {
    const contributions = monthlyDeposit * 12 * year;
    const nominalValue = (existingBalance * Math.pow(1 + annualRate, year))
      + futureValueOfMonthlyDeposits(monthlyDeposit, annualRate, year);
    return {
      year,
      openingBalance: existingBalance,
      contributions,
      estimatedGrowth: Math.max(0, nominalValue - existingBalance - contributions),
      nominalValue,
    };
  });
}

export function monthsRemainingInTaxYear(date = new Date(), taxYear = 2026) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) throw new TypeError('Invalid date');
  if (date.getFullYear() < taxYear) return 12;
  if (date.getFullYear() > taxYear) return 0;
  return Math.max(0, 12 - date.getMonth());
}

export function daysRemainingInTaxYear(date = new Date(), taxYear = 2026) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) throw new TypeError('Invalid date');
  const end = new Date(taxYear, 11, 31, 23, 59, 59, 999);
  if (date > end) return 0;
  return Math.max(0, Math.ceil((end.getTime() - date.getTime()) / 86400000));
}

export function totalDeposited(input) {
  const lumpSum = normalizeMoney(input.lumpSum ?? 0);
  const monthlyDeposit = normalizeMoney(input.monthlyDeposit ?? 0);
  const monthsDeposited = normalizeMoney(input.monthsDeposited ?? 0);
  if (![lumpSum, monthlyDeposit, monthsDeposited].every(Number.isFinite) || !Number.isInteger(monthsDeposited) || monthsDeposited > 12) {
    throw new TypeError('Invalid deposit details');
  }
  return lumpSum + (monthlyDeposit * monthsDeposited);
}

export function projectedAnnualDeposits(input) {
  const lumpSum = normalizeMoney(input.lumpSum ?? 0);
  const monthlyDeposit = normalizeMoney(input.monthlyDeposit ?? 0);
  const monthsDeposited = normalizeMoney(input.monthsDeposited ?? 0);
  if (![lumpSum, monthlyDeposit, monthsDeposited].every(Number.isFinite) || !Number.isInteger(monthsDeposited) || monthsDeposited > 12) {
    throw new TypeError('Invalid deposit details');
  }
  return lumpSum + (monthlyDeposit * 12);
}

export function calculateConsumerResult(input, data = TAX_DATA_2026) {
  const income = normalizeMoney(input.income);
  const lumpSumDeposit = normalizeMoney(input.lumpSum ?? 0);
  const depositedToDate = input.deposited === undefined ? totalDeposited(input) : normalizeMoney(input.deposited);
  const projectedDeposited = input.deposited === undefined ? projectedAnnualDeposits(input) : depositedToDate;
  const enteredExistingBalance = normalizeMoney(input.existingBalance);
  const existingBalance = input.existingBalance === '' || input.existingBalance === null || input.existingBalance === undefined || enteredExistingBalance === 0
    ? depositedToDate
    : enteredExistingBalance;
  if (!Number.isFinite(income) || income <= 0) throw new TypeError('Income must be greater than zero');
  if (![depositedToDate, projectedDeposited, existingBalance].every(Number.isFinite)) throw new TypeError('Deposited amount must be zero or greater');

  const ceiling = data.contributionCeiling.value;
  const remaining = Math.max(0, ceiling - projectedDeposited);
  const eligibleIncome = Math.min(income, data.qualifyingIncomeCeiling.value);
  const annualDeductible = Math.min(
    eligibleIncome * data.deductibleRate.value,
    data.maxDeductibleContribution.value,
  );
  const deductibleAlreadyUsed = Math.min(projectedDeposited, annualDeductible);
  const additionalDeductible = Math.min(remaining, Math.max(0, annualDeductible - deductibleAlreadyUsed));
  const taxRate = marginalTaxRate(income, data.taxBrackets.value);
  const totalDeductible = Math.min(projectedDeposited + remaining, annualDeductible);
  const estimatedTotalTaxBenefit = totalDeductible * taxRate;
  const estimatedAdditionalTaxBenefit = additionalDeductible * taxRate;
  const deductibleAlreadyDeposited = Math.min(projectedDeposited, annualDeductible);
  const estimatedNationalInsuranceBenefitTotal = Math.max(0,
    nationalInsuranceDue(income, data.nationalInsurance.value)
      - nationalInsuranceDue(Math.max(0, income - totalDeductible), data.nationalInsurance.value));
  const estimatedNationalInsuranceBenefitAdditional = Math.max(0,
    nationalInsuranceDue(Math.max(0, income - deductibleAlreadyDeposited), data.nationalInsurance.value)
      - nationalInsuranceDue(Math.max(0, income - totalDeductible), data.nationalInsurance.value));
  const protectedTotal = Math.min(ceiling, projectedDeposited + remaining);
  const protectedAdditional = Math.min(remaining, ceiling);
  const estimatedCapitalGainsExemptionValueTotal = capitalGainsExemptionValue(protectedTotal, data.capitalGainsExemption.value);
  const estimatedCapitalGainsExemptionValueAdditional = capitalGainsExemptionValue(protectedAdditional, data.capitalGainsExemption.value);
  const estimatedCombinedBenefitTotal = estimatedTotalTaxBenefit
    + estimatedNationalInsuranceBenefitTotal + estimatedCapitalGainsExemptionValueTotal;
  const estimatedCombinedBenefitAdditional = estimatedAdditionalTaxBenefit
    + estimatedNationalInsuranceBenefitAdditional + estimatedCapitalGainsExemptionValueAdditional;
  const calculationDate = input.today ?? new Date();
  const monthsRemaining = monthsRemainingInTaxYear(calculationDate, data.taxYear);
  const monthlyDeposit = normalizeMoney(input.monthlyDeposit ?? 0);
  const monthsDeposited = normalizeMoney(input.monthsDeposited ?? 0);
  const scheduledMonthsRemaining = input.deposited === undefined && monthlyDeposit > 0
    ? Math.max(0, 12 - monthsDeposited)
    : calculationDate.getFullYear() === data.taxYear ? Math.max(0, 11 - calculationDate.getMonth()) : monthsRemaining;
  const suggestedMonthlyToYearEnd = remaining > 0 && scheduledMonthsRemaining > 0
    ? Math.ceil(remaining / scheduledMonthsRemaining)
    : 0;
  const suggestedTotalMonthlyToYearEnd = monthlyDeposit + suggestedMonthlyToYearEnd;
  const suggestedMonthly = Math.ceil(ceiling / 12);
  const capacityFromToday = Math.max(0, ceiling - depositedToDate);
  let nextYearRatePayments = 0;
  if (monthlyDeposit > 0 && suggestedMonthly > monthlyDeposit) {
    for (let payments = 1; payments <= scheduledMonthsRemaining; payments += 1) {
      const oldRatePayments = scheduledMonthsRemaining - payments;
      if ((oldRatePayments * monthlyDeposit) + (payments * suggestedMonthly) <= capacityFromToday) nextYearRatePayments = payments;
    }
  }
  const oldRatePaymentsBeforeChange = scheduledMonthsRemaining - nextYearRatePayments;
  const nextYearRateLumpSum = nextYearRatePayments > 0 ? Math.max(0, capacityFromToday - (oldRatePaymentsBeforeChange * monthlyDeposit) - (nextYearRatePayments * suggestedMonthly)) : 0;
  const nextYearRateStartMonthIndex = nextYearRatePayments > 0 ? Math.min(11, monthsDeposited + oldRatePaymentsBeforeChange) : null;
  const projectionYears = [6, 10, 15, 20].includes(Number(input.projectionYears)) ? Number(input.projectionYears) : 10;
  const projections = RETURN_SCENARIOS.map((scenario) => {
    const schedule = buildGrowthSchedule(existingBalance, suggestedMonthly, scenario.annualRate, projectionYears);
    return { ...scenario, years: projectionYears, nominalValue: schedule[schedule.length - 1].nominalValue };
  });

  return {
    taxYear: data.taxYear,
    income,
    existingBalance,
    deposited: depositedToDate,
    depositedToDate,
    projectedAnnualDeposited: projectedDeposited,
    futureScheduledDeposits: Math.max(0, projectedDeposited - depositedToDate),
    ceiling,
    remaining,
    overCeiling: Math.max(0, projectedDeposited - ceiling),
    taxRate,
    deductibleRate: data.deductibleRate.value,
    estimatedTaxBenefit: estimatedAdditionalTaxBenefit,
    estimatedTotalTaxBenefit,
    estimatedAdditionalTaxBenefit,
    estimatedNationalInsuranceBenefitTotal,
    estimatedNationalInsuranceBenefitAdditional,
    estimatedCapitalGainsExemptionValueTotal,
    estimatedCapitalGainsExemptionValueAdditional,
    estimatedCombinedBenefitTotal,
    estimatedCombinedBenefitAdditional,
    monthsRemaining,
    scheduledMonthsRemaining,
    currentMonthlyDeposit: monthlyDeposit,
    currentLumpSumDeposit: lumpSumDeposit,
    suggestedMonthlyToYearEnd,
    suggestedTotalMonthlyToYearEnd,
    suggestedMonthly,
    nextYearRatePayments,
    nextYearRateLumpSum,
    nextYearRateStartMonthIndex,
    projections,
  };
}
