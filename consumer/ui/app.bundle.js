(() => {
  // consumer/data/tax-data.js
  var TAX_DATA_2026 = Object.freeze({
    taxYear: 2026,
    verifiedAt: "2026-07-19",
    contributionCeiling: {
      value: 20566,
      taxYear: 2026,
      verifiedAt: "2026-07-19",
      source: "\u05E4\u05E7\u05D5\u05D3\u05EA \u05DE\u05E1 \u05D4\u05DB\u05E0\u05E1\u05D4 \u05D4\u05DE\u05E2\u05D5\u05D3\u05DB\u05E0\u05EA \u05DC-2026, \u05E1\u05E2\u05D9\u05E3 9(16\u05D1), \u05E8\u05E9\u05D5\u05EA \u05D4\u05DE\u05E1\u05D9\u05DD",
      status: "official"
    },
    qualifyingIncomeCeiling: {
      value: 293397,
      taxYear: 2026,
      verifiedAt: "2026-07-19",
      source: "\u05DC\u05D5\u05D7 \u05D4\u05E0\u05D9\u05DB\u05D5\u05D9\u05D9\u05DD \u05D5\u05DE\u05D3\u05E8\u05D9\u05DA \u05D3\u05E2 \u05D6\u05DB\u05D5\u05D9\u05D5\u05EA\u05D9\u05DA, \u05E8\u05E9\u05D5\u05EA \u05D4\u05DE\u05E1\u05D9\u05DD",
      status: "official"
    },
    maxDeductibleContribution: {
      value: 13203,
      taxYear: 2026,
      verifiedAt: "2026-07-19",
      source: "4.5% \u05DE\u05EA\u05E7\u05E8\u05EA \u05D4\u05DB\u05E0\u05E1\u05D4 \u05E7\u05D5\u05D1\u05E2\u05EA \u05E9\u05DC 293,397 \u20AA, \u05E8\u05E9\u05D5\u05EA \u05D4\u05DE\u05E1\u05D9\u05DD",
      status: "official"
    },
    deductibleRate: {
      value: 0.045,
      taxYear: 2026,
      verifiedAt: "2026-07-19",
      source: "\u05E1\u05E2\u05D9\u05E3 17(5\u05D0) \u05DC\u05E4\u05E7\u05D5\u05D3\u05EA \u05DE\u05E1 \u05D4\u05DB\u05E0\u05E1\u05D4 \u05D5\u05DE\u05D3\u05E8\u05D9\u05DA \u05D3\u05E2 \u05D6\u05DB\u05D5\u05D9\u05D5\u05EA\u05D9\u05DA, \u05E8\u05E9\u05D5\u05EA \u05D4\u05DE\u05E1\u05D9\u05DD",
      status: "official"
    },
    taxBrackets: {
      value: [
        [84120, 0.1],
        [120720, 0.14],
        [228e3, 0.2],
        [301200, 0.31],
        [560280, 0.35],
        [721560, 0.47],
        [Infinity, 0.5]
      ],
      taxYear: 2026,
      verifiedAt: "2026-07-19",
      source: "\u05DC\u05D5\u05D7 \u05D4\u05E0\u05D9\u05DB\u05D5\u05D9\u05D9\u05DD 2026, \u05E8\u05E9\u05D5\u05EA \u05D4\u05DE\u05E1\u05D9\u05DD; \u05EA\u05D9\u05E7\u05D5\u05DF \u05E1\u05E2\u05D9\u05E3 121 \u05DE\u05D9\u05D5\u05DD 31.3.2026",
      status: "official"
    },
    nationalInsurance: {
      value: { reducedMonthly: 7703, maxMonthly: 51910, reducedRate: 0.077, regularRate: 0.18 },
      taxYear: 2026,
      verifiedAt: "2026-07-19",
      source: "\u05D1\u05D9\u05D8\u05D5\u05D7 \u05DC\u05D0\u05D5\u05DE\u05D9, \u05E9\u05D9\u05E2\u05D5\u05E8\u05D9 \u05D3\u05DE\u05D9 \u05D4\u05D1\u05D9\u05D8\u05D5\u05D7 \u05DC\u05E2\u05D5\u05D1\u05D3 \u05E2\u05E6\u05DE\u05D0\u05D9 \u05D4\u05D7\u05DC \u05DE-1.1.2026",
      status: "official"
    },
    capitalGainsExemption: {
      value: { annualReturn: 0.08, years: 6, capitalGainsTaxRate: 0.25 },
      taxYear: 2026,
      verifiedAt: "2026-07-19",
      source: "\u05D4\u05E0\u05D7\u05EA \u05D4\u05D4\u05DE\u05D7\u05E9\u05D4 \u05D1\u05DE\u05D7\u05E9\u05D1\u05D5\u05DF \u05D4\u05DE\u05E7\u05E6\u05D5\u05E2\u05D9: 8% \u05DC\u05E9\u05E0\u05D4, 6 \u05E9\u05E0\u05D9\u05DD \u05D5\u05DE\u05E1 \u05E8\u05D5\u05D5\u05D7\u05D9 \u05D4\u05D5\u05DF \u05E9\u05DC 25%",
      status: "estimate"
    }
  });
  var TAX_DATA_BY_YEAR = Object.freeze({
    2026: TAX_DATA_2026
  });
  function getTaxDataContext(date = /* @__PURE__ */ new Date(), registry = TAX_DATA_BY_YEAR) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) throw new TypeError("Invalid date");
    const requestedYear = date.getFullYear();
    const verifiedYears = Object.entries(registry).filter(([, data2]) => (data2 == null ? void 0 : data2.taxYear) && Object.values(data2).filter((value) => value && typeof value === "object" && "status" in value).every((value) => value.status === "official" || value.status === "estimate")).map(([year]) => Number(year)).filter((year) => year <= requestedYear).sort((a, b) => b - a);
    if (!verifiedYears.length) throw new Error("No verified tax data available");
    const dataYear = verifiedYears.includes(requestedYear) ? requestedYear : verifiedYears[0];
    const data = registry[dataYear];
    const isFallback = dataYear !== requestedYear;
    return Object.freeze({
      requestedYear,
      dataYear,
      data,
      isFallback,
      message: isFallback ? `\u05E0\u05EA\u05D5\u05E0\u05D9 ${requestedYear} \u05D8\u05E8\u05DD \u05D0\u05D5\u05DE\u05EA\u05D5. \u05D4\u05D7\u05D9\u05E9\u05D5\u05D1 \u05DE\u05D1\u05D5\u05E1\u05E1 \u05E2\u05DC \u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05D4\u05E8\u05E9\u05DE\u05D9\u05D9\u05DD \u05D4\u05D0\u05D7\u05E8\u05D5\u05E0\u05D9\u05DD \u05E9\u05D0\u05D5\u05DE\u05EA\u05D5 \u05DC\u05E9\u05E0\u05EA ${dataYear}.` : ""
    });
  }
  var RETURN_SCENARIOS = Object.freeze([
    { id: "conservative", label: "\u05E9\u05DE\u05E8\u05E0\u05D9", annualRate: 0.04 },
    { id: "middle", label: "\u05D1\u05D9\u05E0\u05D9\u05D9\u05DD", annualRate: 0.07 },
    { id: "high", label: "\u05D2\u05D1\u05D5\u05D4", annualRate: 0.09 }
  ]);

  // consumer/engine/calculator.js
  function normalizeMoney(value) {
    if (typeof value === "string") value = value.replace(/[₪,\s]/g, "");
    if (value === "" || value === null || value === void 0) return NaN;
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : NaN;
  }
  function marginalTaxRate(income, brackets = TAX_DATA_2026.taxBrackets.value) {
    var _a, _b;
    if (!Number.isFinite(income) || income < 0) return 0;
    return (_b = (_a = brackets.find(([limit]) => income <= limit)) == null ? void 0 : _a[1]) != null ? _b : 0;
  }
  function progressiveIncomeTax(income, brackets = TAX_DATA_2026.taxBrackets.value) {
    if (!Number.isFinite(income) || income <= 0) return 0;
    let previousLimit = 0;
    let tax = 0;
    for (const [limit, rate] of brackets) {
      const taxableInBracket = Math.max(0, Math.min(income, limit) - previousLimit);
      tax += taxableInBracket * rate;
      if (income <= limit) break;
      previousLimit = limit;
    }
    return tax;
  }
  function incomeTaxBenefitFromDeduction(income, deduction, brackets = TAX_DATA_2026.taxBrackets.value) {
    if (![income, deduction].every(Number.isFinite) || income < 0 || deduction < 0) {
      throw new TypeError("Invalid tax benefit input");
    }
    return progressiveIncomeTax(income, brackets) - progressiveIncomeTax(Math.max(0, income - deduction), brackets);
  }
  function taxRatesForDeduction(income, deduction, brackets = TAX_DATA_2026.taxBrackets.value) {
    if (![income, deduction].every(Number.isFinite) || income < 0 || deduction < 0) return [];
    const after = Math.max(0, income - deduction);
    let previousLimit = 0;
    const rates = [];
    for (const [limit, rate] of brackets) {
      if (Math.min(income, limit) > Math.max(after, previousLimit)) rates.push(rate);
      if (income <= limit) break;
      previousLimit = limit;
    }
    return rates.reverse();
  }
  function nationalInsuranceDue(income, config = TAX_DATA_2026.nationalInsurance.value) {
    if (!Number.isFinite(income) || income < 0) return 0;
    const threshold = config.reducedMonthly * 12;
    const maximum = config.maxMonthly * 12;
    const insuredIncome = Math.min(income, maximum);
    const reducedPart = Math.min(insuredIncome, threshold);
    const regularPart = Math.max(0, insuredIncome - threshold);
    return reducedPart * config.reducedRate + regularPart * config.regularRate;
  }
  function capitalGainsExemptionValue(contribution, config = TAX_DATA_2026.capitalGainsExemption.value) {
    if (!Number.isFinite(contribution) || contribution < 0) throw new TypeError("Invalid contribution");
    const gain = contribution * (Math.pow(1 + config.annualReturn, config.years) - 1);
    return gain * config.capitalGainsTaxRate;
  }
  function futureValueOfMonthlyDeposits(monthlyDeposit, annualRate, years = 6) {
    if (![monthlyDeposit, annualRate, years].every(Number.isFinite) || monthlyDeposit < 0 || annualRate < 0 || years < 0) {
      throw new TypeError("Invalid forecast input");
    }
    const months = Math.round(years * 12);
    if (annualRate === 0) return monthlyDeposit * months;
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
    return monthlyDeposit * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  }
  function buildGrowthSchedule(existingBalance, monthlyDeposit, annualRate, years) {
    if (![existingBalance, monthlyDeposit, annualRate, years].every(Number.isFinite) || existingBalance < 0 || monthlyDeposit < 0 || annualRate < 0 || years < 1) {
      throw new TypeError("Invalid growth schedule input");
    }
    return Array.from({ length: Math.round(years) + 1 }, (_, year) => {
      const contributions = monthlyDeposit * 12 * year;
      const nominalValue = existingBalance * Math.pow(1 + annualRate, year) + futureValueOfMonthlyDeposits(monthlyDeposit, annualRate, year);
      return {
        year,
        openingBalance: existingBalance,
        contributions,
        estimatedGrowth: Math.max(0, nominalValue - existingBalance - contributions),
        nominalValue
      };
    });
  }
  function monthsRemainingInTaxYear(date = /* @__PURE__ */ new Date(), taxYear = 2026) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) throw new TypeError("Invalid date");
    if (date.getFullYear() < taxYear) return 12;
    if (date.getFullYear() > taxYear) return 0;
    return Math.max(0, 12 - date.getMonth());
  }
  function totalDeposited(input) {
    var _a, _b, _c;
    const lumpSum = normalizeMoney((_a = input.lumpSum) != null ? _a : 0);
    const monthlyDeposit = normalizeMoney((_b = input.monthlyDeposit) != null ? _b : 0);
    const monthsDeposited = normalizeMoney((_c = input.monthsDeposited) != null ? _c : 0);
    if (![lumpSum, monthlyDeposit, monthsDeposited].every(Number.isFinite) || !Number.isInteger(monthsDeposited) || monthsDeposited > 12) {
      throw new TypeError("Invalid deposit details");
    }
    return lumpSum + monthlyDeposit * monthsDeposited;
  }
  function projectedAnnualDeposits(input, date = ((_a) => (_a = input.today) != null ? _a : /* @__PURE__ */ new Date())(), taxYear = getTaxDataContext(date).dataYear) {
    var _a2, _b, _c;
    const lumpSum = normalizeMoney((_a2 = input.lumpSum) != null ? _a2 : 0);
    const monthlyDeposit = normalizeMoney((_b = input.monthlyDeposit) != null ? _b : 0);
    const monthsDeposited = normalizeMoney((_c = input.monthsDeposited) != null ? _c : 0);
    if (![lumpSum, monthlyDeposit, monthsDeposited].every(Number.isFinite) || !Number.isInteger(monthsDeposited) || monthsDeposited > 12) {
      throw new TypeError("Invalid deposit details");
    }
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) throw new TypeError("Invalid date");
    const futurePayments = date.getFullYear() === taxYear ? Math.max(0, 11 - date.getMonth()) : date.getFullYear() < taxYear ? 12 : 0;
    return lumpSum + monthlyDeposit * Math.min(12, monthsDeposited + futurePayments);
  }
  function calculateConsumerResult(input, data = getTaxDataContext(((_a) => (_a = input.today) != null ? _a : /* @__PURE__ */ new Date())()).data) {
    var _a2, _b, _c, _d;
    const calculationDate = (_a2 = input.today) != null ? _a2 : /* @__PURE__ */ new Date();
    const income = normalizeMoney(input.income);
    const lumpSumDeposit = normalizeMoney((_b = input.lumpSum) != null ? _b : 0);
    const depositedToDate = input.deposited === void 0 ? totalDeposited(input) : normalizeMoney(input.deposited);
    const projectedDeposited = input.deposited === void 0 ? projectedAnnualDeposits(input, calculationDate, data.taxYear) : depositedToDate;
    const enteredExistingBalance = normalizeMoney(input.existingBalance);
    const existingBalance = input.existingBalance === "" || input.existingBalance === null || input.existingBalance === void 0 || enteredExistingBalance === 0 ? depositedToDate : enteredExistingBalance;
    if (!Number.isFinite(income) || income <= 0) throw new TypeError("Income must be greater than zero");
    if (![depositedToDate, projectedDeposited, existingBalance].every(Number.isFinite)) throw new TypeError("Deposited amount must be zero or greater");
    const ceiling = data.contributionCeiling.value;
    const remaining = Math.max(0, ceiling - projectedDeposited);
    const eligibleIncome = Math.min(income, data.qualifyingIncomeCeiling.value);
    const annualDeductible = Math.min(
      eligibleIncome * data.deductibleRate.value,
      data.maxDeductibleContribution.value
    );
    const deductibleAlreadyUsed = Math.min(projectedDeposited, annualDeductible);
    const additionalDeductible = Math.min(remaining, Math.max(0, annualDeductible - deductibleAlreadyUsed));
    const taxRate = marginalTaxRate(income, data.taxBrackets.value);
    const totalDeductible = Math.min(projectedDeposited + remaining, annualDeductible);
    const deductibleAlreadyDeposited = Math.min(projectedDeposited, annualDeductible);
    const estimatedTotalTaxBenefit = incomeTaxBenefitFromDeduction(income, totalDeductible, data.taxBrackets.value);
    const estimatedAdditionalTaxBenefit = progressiveIncomeTax(Math.max(0, income - deductibleAlreadyDeposited), data.taxBrackets.value) - progressiveIncomeTax(Math.max(0, income - totalDeductible), data.taxBrackets.value);
    const taxBenefitUsesMultipleBrackets = totalDeductible > 0 && marginalTaxRate(income, data.taxBrackets.value) !== marginalTaxRate(Math.max(0, income - totalDeductible), data.taxBrackets.value);
    const taxRatesUsed = taxRatesForDeduction(income, totalDeductible, data.taxBrackets.value);
    const estimatedNationalInsuranceBenefitTotal = Math.max(
      0,
      nationalInsuranceDue(income, data.nationalInsurance.value) - nationalInsuranceDue(Math.max(0, income - totalDeductible), data.nationalInsurance.value)
    );
    const estimatedNationalInsuranceBenefitAdditional = Math.max(
      0,
      nationalInsuranceDue(Math.max(0, income - deductibleAlreadyDeposited), data.nationalInsurance.value) - nationalInsuranceDue(Math.max(0, income - totalDeductible), data.nationalInsurance.value)
    );
    const protectedTotal = Math.min(ceiling, projectedDeposited + remaining);
    const protectedAdditional = Math.min(remaining, ceiling);
    const estimatedCapitalGainsExemptionValueTotal = capitalGainsExemptionValue(protectedTotal, data.capitalGainsExemption.value);
    const estimatedCapitalGainsExemptionValueAdditional = capitalGainsExemptionValue(protectedAdditional, data.capitalGainsExemption.value);
    const estimatedCombinedBenefitTotal = estimatedTotalTaxBenefit + estimatedNationalInsuranceBenefitTotal + estimatedCapitalGainsExemptionValueTotal;
    const estimatedCombinedBenefitAdditional = estimatedAdditionalTaxBenefit + estimatedNationalInsuranceBenefitAdditional + estimatedCapitalGainsExemptionValueAdditional;
    const monthsRemaining = monthsRemainingInTaxYear(calculationDate, data.taxYear);
    const monthlyDeposit = normalizeMoney((_c = input.monthlyDeposit) != null ? _c : 0);
    const monthsDeposited = normalizeMoney((_d = input.monthsDeposited) != null ? _d : 0);
    const scheduledMonthsRemaining = calculationDate.getFullYear() === data.taxYear ? Math.max(0, 11 - calculationDate.getMonth()) : calculationDate.getFullYear() < data.taxYear ? 12 : 0;
    const suggestedMonthlyToYearEnd = remaining > 0 && scheduledMonthsRemaining > 0 ? Math.ceil(remaining / scheduledMonthsRemaining) : 0;
    const suggestedTotalMonthlyToYearEnd = monthlyDeposit + suggestedMonthlyToYearEnd;
    const suggestedMonthly = Math.ceil(ceiling / 12);
    const capacityFromToday = Math.max(0, ceiling - depositedToDate);
    let nextYearRatePayments = 0;
    if (monthlyDeposit > 0 && suggestedMonthly > monthlyDeposit) {
      for (let payments = 1; payments <= scheduledMonthsRemaining; payments += 1) {
        const oldRatePayments = scheduledMonthsRemaining - payments;
        if (oldRatePayments * monthlyDeposit + payments * suggestedMonthly <= capacityFromToday) nextYearRatePayments = payments;
      }
    }
    const oldRatePaymentsBeforeChange = scheduledMonthsRemaining - nextYearRatePayments;
    const nextYearRateLumpSum = nextYearRatePayments > 0 ? Math.max(0, capacityFromToday - oldRatePaymentsBeforeChange * monthlyDeposit - nextYearRatePayments * suggestedMonthly) : 0;
    const nextYearRateStartMonthIndex = nextYearRatePayments > 0 ? Math.min(11, calculationDate.getMonth() + 1 + oldRatePaymentsBeforeChange) : null;
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
      taxBenefitUsesMultipleBrackets,
      taxRatesUsed,
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
      projections
    };
  }

  // consumer/engine/score.js
  function calculateUtilizationScore({ deposited, ceiling, hasMonthlyPlan, fundStatus, completionPreference }) {
    const values = [deposited, ceiling];
    if (!values.every(Number.isFinite) || deposited < 0 || ceiling <= 0) throw new TypeError("Invalid score input");
    const utilization = Math.min(deposited / ceiling, 1) * 60;
    const monthly = hasMonthlyPlan ? 20 : 0;
    const knowsFund = fundStatus && fundStatus !== "unknown" ? 10 : 0;
    const clearCompletion = completionPreference && completionPreference !== "unknown" ? 10 : 0;
    return Math.min(100, Math.round(utilization + monthly + knowsFund + clearCompletion));
  }

  // consumer/engine/recommendations.js
  function buildRecommendation(result, profile) {
    if (profile.fundStatus === "none") return "\u05E2\u05D3\u05D9\u05D9\u05DF \u05D0\u05D9\u05DF \u05DC\u05DA \u05E7\u05E8\u05DF \u05D4\u05E9\u05EA\u05DC\u05DE\u05D5\u05EA. \u05DC\u05E4\u05E0\u05D9 \u05E4\u05EA\u05D9\u05D7\u05D4 \u05DB\u05D3\u05D0\u05D9 \u05DC\u05D1\u05D3\u05D5\u05E7 \u05D6\u05DB\u05D0\u05D5\u05EA, \u05DE\u05E1\u05DC\u05D5\u05DC \u05D4\u05E9\u05E7\u05E2\u05D4 \u05D5\u05D3\u05DE\u05D9 \u05E0\u05D9\u05D4\u05D5\u05DC.";
    if (result.overCeiling > 0) return "\u05D7\u05DC\u05E7 \u05DE\u05D4\u05D4\u05E4\u05E7\u05D3\u05D4 \u05E9\u05DC\u05DA \u05E0\u05DE\u05E6\u05D0 \u05DE\u05E2\u05DC \u05D4\u05EA\u05E7\u05E8\u05D4 \u05D4\u05DE\u05D5\u05D8\u05D1\u05EA. \u05DC\u05E4\u05E0\u05D9 \u05E9\u05DE\u05E4\u05E7\u05D9\u05D3\u05D9\u05DD \u05E1\u05DB\u05D5\u05DE\u05D9\u05DD \u05E0\u05D5\u05E1\u05E4\u05D9\u05DD, \u05DB\u05D3\u05D0\u05D9 \u05DC\u05D1\u05D3\u05D5\u05E7 \u05D0\u05DD \u05E7\u05D9\u05D9\u05DE\u05EA \u05D7\u05DC\u05D5\u05E4\u05D4 \u05DE\u05EA\u05D0\u05D9\u05DE\u05D4 \u05D9\u05D5\u05EA\u05E8.";
    if (result.remaining === 0) return "\u05DB\u05D1\u05E8 \u05E0\u05D9\u05E6\u05DC\u05EA \u05D0\u05EA \u05DE\u05DC\u05D5\u05D0 \u05D4\u05EA\u05E7\u05E8\u05D4 \u05D4\u05DE\u05D5\u05D8\u05D1\u05EA \u05D4\u05E9\u05E0\u05D4. \u05E2\u05DB\u05E9\u05D9\u05D5 \u05DB\u05D3\u05D0\u05D9 \u05DC\u05D1\u05D3\u05D5\u05E7 \u05E9\u05D4\u05DE\u05E1\u05DC\u05D5\u05DC \u05D5\u05D3\u05DE\u05D9 \u05D4\u05E0\u05D9\u05D4\u05D5\u05DC \u05D1\u05E7\u05E8\u05DF \u05DE\u05EA\u05D0\u05D9\u05DE\u05D9\u05DD \u05DC\u05DA \u05D5\u05DC\u05D4\u05D9\u05E2\u05E8\u05DA \u05DC\u05D4\u05E4\u05E7\u05D3\u05D5\u05EA \u05E9\u05DC \u05D4\u05E9\u05E0\u05D4 \u05D4\u05D1\u05D0\u05D4.";
    if (result.deposited === 0) return "\u05DC\u05E4\u05D9 \u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05E9\u05D4\u05D6\u05E0\u05EA, \u05E0\u05D9\u05EA\u05DF \u05DC\u05E9\u05E7\u05D5\u05DC \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC \u05D1\u05D4\u05E4\u05E7\u05D3\u05D4 \u05D4\u05E9\u05E0\u05D4. \u05D0\u05DD \u05D4\u05EA\u05D6\u05E8\u05D9\u05DD \u05DE\u05D0\u05E4\u05E9\u05E8, \u05D0\u05E4\u05E9\u05E8 \u05DC\u05D4\u05E4\u05E7\u05D9\u05D3 \u05E1\u05DB\u05D5\u05DD \u05D7\u05D3\u05BE\u05E4\u05E2\u05DE\u05D9 \u05D0\u05D5 \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC \u05D4\u05D5\u05E8\u05D0\u05EA \u05E7\u05D1\u05E2 \u05D5\u05DC\u05D1\u05D7\u05D5\u05DF \u05D4\u05E9\u05DC\u05DE\u05D4 \u05DC\u05E7\u05E8\u05D0\u05EA \u05E1\u05D5\u05E3 \u05D4\u05E9\u05E0\u05D4.";
    if (profile.completionPreference === "lump") return `\u05DB\u05D3\u05D9 \u05DC\u05E0\u05E6\u05DC \u05D0\u05EA \u05DE\u05DC\u05D5\u05D0 \u05D4\u05EA\u05E7\u05E8\u05D4 \u05D4\u05DE\u05D5\u05D8\u05D1\u05EA, \u05E0\u05D9\u05EA\u05DF \u05DC\u05E9\u05E7\u05D5\u05DC \u05DC\u05D4\u05E9\u05DC\u05D9\u05DD \u05D4\u05E9\u05E0\u05D4 \u05D4\u05E4\u05E7\u05D3\u05D4 \u05D7\u05D3\u05BE\u05E4\u05E2\u05DE\u05D9\u05EA \u05E9\u05DC ${Math.round(result.remaining).toLocaleString("he-IL")} \u20AA.`;
    if (profile.completionPreference === "monthly" && result.currentMonthlyDeposit > 0) return `\u05DB\u05D3\u05D9 \u05DC\u05D4\u05E9\u05DC\u05D9\u05DD \u05D0\u05EA \u05D4\u05EA\u05E7\u05E8\u05D4 \u05E2\u05D3 \u05E1\u05D5\u05E3 \u05D4\u05E9\u05E0\u05D4, \u05E0\u05D9\u05EA\u05DF \u05DC\u05E9\u05E7\u05D5\u05DC \u05DC\u05D4\u05D5\u05E1\u05D9\u05E3 \u05DB\u05BE${Math.round(result.suggestedMonthlyToYearEnd).toLocaleString("he-IL")} \u20AA \u05DC\u05DB\u05DC \u05D4\u05E4\u05E7\u05D3\u05D4 \u05E9\u05E0\u05D5\u05EA\u05E8\u05D4 \u05D5\u05DC\u05D4\u05D2\u05D3\u05D9\u05DC \u05D0\u05EA \u05D4\u05D5\u05E8\u05D0\u05EA \u05D4\u05E7\u05D1\u05E2 \u05DC\u05DB\u05BE${Math.round(result.suggestedTotalMonthlyToYearEnd).toLocaleString("he-IL")} \u20AA \u05D1\u05D7\u05D5\u05D3\u05E9.`;
    if (profile.completionPreference === "monthly") return `\u05DB\u05D3\u05D9 \u05DC\u05D4\u05E9\u05DC\u05D9\u05DD \u05D0\u05EA \u05D4\u05EA\u05E7\u05E8\u05D4 \u05E2\u05D3 \u05E1\u05D5\u05E3 \u05D4\u05E9\u05E0\u05D4, \u05E0\u05D9\u05EA\u05DF \u05DC\u05E9\u05E7\u05D5\u05DC \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC \u05D4\u05E4\u05E7\u05D3\u05D4 \u05D7\u05D5\u05D3\u05E9\u05D9\u05EA \u05E9\u05DC \u05DB\u05BE${Math.round(result.suggestedMonthlyToYearEnd).toLocaleString("he-IL")} \u20AA \u05D1\u05D7\u05D5\u05D3\u05E9.`;
    return "\u05E0\u05E9\u05D0\u05E8\u05D4 \u05D9\u05EA\u05E8\u05D4 \u05DC\u05E0\u05D9\u05E6\u05D5\u05DC \u05D4\u05E9\u05E0\u05D4. \u05D0\u05E4\u05E9\u05E8 \u05DC\u05E9\u05E7\u05D5\u05DC \u05E9\u05D9\u05DC\u05D5\u05D1 \u05D1\u05D9\u05DF \u05D4\u05E4\u05E7\u05D3\u05D4 \u05D7\u05D3\u05BE\u05E4\u05E2\u05DE\u05D9\u05EA \u05DC\u05D4\u05E4\u05E7\u05D3\u05D4 \u05D7\u05D5\u05D3\u05E9\u05D9\u05EA, \u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05EA\u05D6\u05E8\u05D9\u05DD \u05E9\u05DC\u05DA.";
  }
  function buildCta(result, profile) {
    if (profile.fundStatus === "none") return "\u05E8\u05D5\u05E6\u05D4 \u05DC\u05D1\u05D3\u05D5\u05E7 \u05D0\u05D9\u05DA \u05DC\u05E4\u05EA\u05D5\u05D7 \u05E7\u05E8\u05DF \u05D1\u05E6\u05D5\u05E8\u05D4 \u05E0\u05DB\u05D5\u05E0\u05D4?";
    if (result.overCeiling > 0) return "\u05E8\u05D5\u05E6\u05D4 \u05DC\u05D1\u05D3\u05D5\u05E7 \u05DE\u05D4 \u05D0\u05E4\u05E9\u05E8 \u05DC\u05E2\u05E9\u05D5\u05EA \u05E2\u05DD \u05D4\u05E1\u05DB\u05D5\u05DD \u05E9\u05DE\u05E2\u05DC \u05D4\u05EA\u05E7\u05E8\u05D4?";
    if (result.remaining === 0) return "\u05E8\u05D5\u05E6\u05D4 \u05DC\u05D1\u05D3\u05D5\u05E7 \u05D0\u05DD \u05D4\u05E7\u05E8\u05DF \u05D5\u05D4\u05DE\u05E1\u05DC\u05D5\u05DC \u05E9\u05DC\u05DA \u05E2\u05D3\u05D9\u05D9\u05DF \u05DE\u05EA\u05D0\u05D9\u05DE\u05D9\u05DD?";
    if (result.remaining < 5e3) return "\u05E8\u05D5\u05E6\u05D4 \u05DC\u05D5\u05D5\u05D3\u05D0 \u05E9\u05D4\u05E7\u05E8\u05DF \u05E9\u05DC\u05DA \u05DE\u05E0\u05D5\u05D4\u05DC\u05EA \u05E0\u05DB\u05D5\u05DF \u05D2\u05DD \u05D0\u05D7\u05E8\u05D9 \u05D4\u05E9\u05DC\u05DE\u05EA \u05D4\u05D4\u05E4\u05E7\u05D3\u05D4?";
    return "\u05E8\u05D5\u05E6\u05D4 \u05DC\u05D1\u05D3\u05D5\u05E7 \u05D0\u05D9\u05DA \u05DC\u05D4\u05E9\u05DC\u05D9\u05DD \u05D0\u05EA \u05D4\u05D4\u05E4\u05E7\u05D3\u05D4 \u05D1\u05DC\u05D9 \u05DC\u05D4\u05DB\u05D1\u05D9\u05D3 \u05E2\u05DC \u05D4\u05EA\u05D6\u05E8\u05D9\u05DD?";
  }

  // consumer/config.js
  var SITE_CONFIG = Object.freeze({
    publicBaseUrl: "https://romanoroei.github.io/KerenHeshtalmut/consumer/",
    professionalCalculatorUrl: "../index.html?from=consumer",
    whatsappNumber: "972528089808",
    gaMeasurementId: "G-XF5X2QLB8L",
    analyticsDebug: false
  });

  // consumer/analytics/attribution.js
  var ATTRIBUTION_KEY = "consumer_attribution";
  var MAX_VALUE_LENGTH = 80;
  var PARAMETER_MAP = {
    utm_source: "source",
    utm_medium: "medium",
    utm_campaign: "campaign",
    utm_content: "content",
    utm_term: "term",
    ref: "referrerCode"
  };
  var DEFAULT_ATTRIBUTION_VALUES = /* @__PURE__ */ new Set(["", "direct", "none", "unknown"]);
  var REFERRER_DISPLAY_NAMES = Object.freeze({
    roynetanel: "\u05E8\u05D5\u05E2\u05D9 \u05E0\u05EA\u05E0\u05D0\u05DC"
  });
  function sanitizeAttributionValue(value, maxLength = MAX_VALUE_LENGTH) {
    return String(value != null ? value : "").normalize("NFKC").replace(/[^\p{L}\p{N}_. -]/gu, "").trim().slice(0, maxLength);
  }
  function generalReferrer(referrer = "") {
    if (!referrer) return "direct";
    try {
      const host = new URL(referrer).hostname.toLowerCase();
      if (host.includes("whatsapp")) return "whatsapp";
      if (host.includes("tiktok")) return "tiktok";
      if (host.includes("facebook") || host.includes("instagram")) return "facebook";
      if (host.includes("google")) return "google";
      return "referral";
    } catch (e) {
      return "direct";
    }
  }
  function readAttribution(url = ((_b) => (_b = ((_a) => (_a = globalThis.location) == null ? void 0 : _a.href)()) != null ? _b : "")(), referrer = ((_d) => (_d = ((_c) => (_c = globalThis.document) == null ? void 0 : _c.referrer)()) != null ? _d : "")()) {
    let params;
    try {
      params = new URL(url, "https://example.invalid").searchParams;
    } catch (e) {
      params = new URLSearchParams();
    }
    const result = {};
    for (const [parameter, key] of Object.entries(PARAMETER_MAP)) {
      const value = sanitizeAttributionValue(params.get(parameter));
      if (value) result[key] = value;
    }
    if (!result.source) result.source = generalReferrer(referrer);
    if (!result.medium) result.medium = result.source === "direct" ? "none" : "organic";
    return result;
  }
  function saveInitialAttribution({ storage = globalThis.sessionStorage, url, referrer } = {}) {
    try {
      const existing = storage == null ? void 0 : storage.getItem(ATTRIBUTION_KEY);
      const attribution2 = readAttribution(url, referrer);
      if (existing) {
        const saved = JSON.parse(existing);
        const hasSavedAttribution = Object.values(saved || {}).some((value) => !DEFAULT_ATTRIBUTION_VALUES.has(String(value || "").toLowerCase()));
        const hasIncomingAttribution = Object.values(attribution2).some((value) => !DEFAULT_ATTRIBUTION_VALUES.has(String(value || "").toLowerCase()));
        if (hasSavedAttribution || !hasIncomingAttribution) return saved;
      }
      storage == null ? void 0 : storage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution2));
      return attribution2;
    } catch (e) {
      return readAttribution(url, referrer);
    }
  }
  function referrerDisplayName(referrerCode) {
    return REFERRER_DISPLAY_NAMES[String(referrerCode || "").toLowerCase()] || "";
  }
  function getAttribution(storage = globalThis.sessionStorage) {
    try {
      return JSON.parse((storage == null ? void 0 : storage.getItem(ATTRIBUTION_KEY)) || "null") || saveInitialAttribution({ storage });
    } catch (e) {
      return readAttribution();
    }
  }
  function attributionEventParameters(attribution2 = getAttribution()) {
    return {
      source: attribution2.source || "direct",
      medium: attribution2.medium || "none",
      campaign: attribution2.campaign || "",
      content: attribution2.content || "",
      term: attribution2.term || "",
      referrer_code: attribution2.referrerCode || ""
    };
  }

  // consumer/messages/whatsapp.js
  var money = (value) => new Intl.NumberFormat("he-IL", { maximumFractionDigits: 0 }).format(Math.round(value));
  function naturalList(items) {
    if (items.length < 2) return items[0] || "";
    return `${items.slice(0, -1).join(", ")} \u05D5${items.at(-1)}`;
  }
  function buildWhatsAppMessage(result, profile = {}, attribution2 = getAttribution()) {
    var _a, _b, _c, _d;
    const goalLabels = {
      tax: "\u05DC\u05E0\u05E6\u05DC \u05D0\u05EA \u05D4\u05D8\u05D1\u05EA \u05D4\u05DE\u05E1",
      saving: "\u05DC\u05D4\u05D2\u05D3\u05D9\u05DC \u05D0\u05EA \u05D4\u05D7\u05D9\u05E1\u05DB\u05D5\u05DF",
      monthly: "\u05DC\u05D1\u05E0\u05D5\u05EA \u05D4\u05D5\u05E8\u05D0\u05EA \u05E7\u05D1\u05E2",
      check: "\u05DC\u05D1\u05D3\u05D5\u05E7 \u05D0\u05DD \u05D0\u05E0\u05D9 \u05D1\u05D3\u05E8\u05DA \u05D4\u05E0\u05DB\u05D5\u05E0\u05D4"
    };
    const goals = naturalList(((_b = profile.goals) != null ? _b : String((_a = profile.goal) != null ? _a : "").split(",").map((goal) => goal.trim()).filter(Boolean)).map((goal) => {
      var _a2;
      return (_a2 = goalLabels[goal]) != null ? _a2 : goal;
    }));
    const referrerName = referrerDisplayName(attribution2.referrerCode);
    const details = [
      `\u05D4\u05DB\u05E0\u05E1\u05D4 \u05E9\u05E0\u05EA\u05D9\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DE\u05E9\u05D5\u05E2\u05E8\u05EA: ${money(result.income)} \u20AA`,
      ...profile.hasExistingBalance && result.existingBalance > 0 ? [`\u05E6\u05D1\u05D9\u05E8\u05D4 \u05E0\u05D5\u05DB\u05D7\u05D9\u05EA \u05D1\u05E7\u05E8\u05DF: ${money(result.existingBalance)} \u20AA`] : [],
      ...result.depositedToDate > 0 ? [`\u05D4\u05E4\u05E7\u05D3\u05D4 \u05E9\u05D1\u05D9\u05E6\u05E2\u05EA\u05D9 \u05D4\u05E9\u05E0\u05D4: ${money(result.depositedToDate)} \u20AA`] : [],
      result.remaining > 0 ? `\u05E1\u05DB\u05D5\u05DD \u05DE\u05D5\u05DE\u05DC\u05E5 \u05DC\u05D4\u05E4\u05E7\u05D3\u05D4 \u05E2\u05D3 \u05E1\u05D5\u05E3 ${(_c = result.taxYear) != null ? _c : 2026}: ${money(result.remaining)} \u20AA` : `\u05E0\u05D9\u05E6\u05DC\u05EA\u05D9 \u05D0\u05EA \u05DE\u05DC\u05D5\u05D0 \u05EA\u05E7\u05E8\u05EA \u05D4\u05D4\u05E4\u05E7\u05D3\u05D4 \u05D4\u05DE\u05D5\u05D8\u05D1\u05EA \u05DC\u05E9\u05E0\u05EA ${(_d = result.taxYear) != null ? _d : 2026}.`
    ];
    return [
      "\u05D4\u05D9\u05D9 \u05E8\u05D5\u05E2\u05D9, \u05D1\u05D9\u05E6\u05E2\u05EA\u05D9 \u05D0\u05EA \u05D1\u05D3\u05D9\u05E7\u05EA \u05E7\u05E8\u05DF \u05D4\u05D4\u05E9\u05EA\u05DC\u05DE\u05D5\u05EA \u05DC\u05E2\u05E6\u05DE\u05D0\u05D9\u05DD \u05D1\u05D0\u05EA\u05E8.",
      "",
      ...details,
      "",
      "\u05D4\u05DB\u05D9 \u05D7\u05E9\u05D5\u05D1 \u05DC\u05D9:",
      `${goals || "\u05DC\u05D1\u05D3\u05D5\u05E7 \u05DE\u05D4 \u05E0\u05DB\u05D5\u05DF \u05DC\u05DE\u05E6\u05D1 \u05E9\u05DC\u05D9"}.`,
      "",
      ...referrerName ? [`\u05D4\u05D2\u05E2\u05EA\u05D9 \u05DC\u05D1\u05D3\u05D9\u05E7\u05D4 \u05D3\u05E8\u05DA ${referrerName}.`, ""] : [],
      "\u05D0\u05E9\u05DE\u05D7 \u05E9\u05EA\u05D1\u05D3\u05D5\u05E7 \u05D0\u05D9\u05EA\u05D9 \u05DE\u05D4 \u05D4\u05E6\u05E2\u05D3 \u05D4\u05D1\u05D0 \u05E9\u05DE\u05EA\u05D0\u05D9\u05DD \u05DC\u05DE\u05E6\u05D1 \u05E9\u05DC\u05D9."
    ].join("\n");
  }
  function buildWhatsAppUrl(result, profile) {
    return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage(result, profile))}`;
  }
  function buildShareMessage(url = SITE_CONFIG.publicBaseUrl) {
    return `\u05E2\u05E6\u05DE\u05D0\u05D9? \u05DE\u05E6\u05D0\u05EA\u05D9 \u05D1\u05D3\u05D9\u05E7\u05D4 \u05E7\u05E6\u05E8\u05D4 \u05E9\u05E2\u05D5\u05D6\u05E8\u05EA \u05DC\u05D4\u05D1\u05D9\u05DF \u05DB\u05DE\u05D4 \u05E0\u05D9\u05EA\u05DF \u05DC\u05E9\u05E7\u05D5\u05DC \u05DC\u05D4\u05E4\u05E7\u05D9\u05D3 \u05DC\u05E7\u05E8\u05DF \u05D4\u05D4\u05E9\u05EA\u05DC\u05DE\u05D5\u05EA \u05D4\u05E9\u05E0\u05D4 \u05D5\u05DE\u05D4 \u05E9\u05D5\u05D5\u05D9 \u05D4\u05D8\u05D1\u05D5\u05EA \u05D4\u05DE\u05E1 \u05D4\u05D0\u05E4\u05E9\u05E8\u05D9\u05D5\u05EA.

\u05D4\u05D1\u05D3\u05D9\u05E7\u05D4 \u05DC\u05DC\u05D0 \u05D4\u05E8\u05E9\u05DE\u05D4 \u05D5\u05DC\u05DC\u05D0 \u05D4\u05EA\u05D7\u05D9\u05D9\u05D1\u05D5\u05EA:
${url}`;
  }
  function buildConsumerShareUrl(url = SITE_CONFIG.publicBaseUrl) {
    const message = buildShareMessage(url);
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }

  // consumer/analytics/consent.js
  var CONSENT_KEY = "consumer_analytics_consent";
  var VALID_STATUSES = /* @__PURE__ */ new Set(["accepted", "essential_only"]);
  function getConsentStatus(storage = globalThis.localStorage) {
    try {
      const value = storage == null ? void 0 : storage.getItem(CONSENT_KEY);
      return VALID_STATUSES.has(value) ? value : "unknown";
    } catch (e) {
      return "unknown";
    }
  }
  function canUseAnalytics(storage = globalThis.localStorage) {
    return getConsentStatus(storage) === "accepted";
  }

  // consumer/analytics/tracking.js
  var FORBIDDEN_KEYS = /income|amount|balance|recommended|tax_benefit|phone|whatsapp_message|message_content|content_text|^message$/i;
  var CORE_EVENT_PARAMETERS = Object.freeze({
    landing_view: /* @__PURE__ */ new Set(["page_type", "source", "medium", "campaign", "content", "term", "referrer_code"]),
    calculator_started: /* @__PURE__ */ new Set(["source", "medium", "campaign", "content", "term", "referrer_code"]),
    calculator_completed: /* @__PURE__ */ new Set(["fund_status", "deposit_method", "goals", "result_status", "source", "medium", "campaign", "content", "term", "referrer_code"]),
    whatsapp_clicked: /* @__PURE__ */ new Set(["fund_status", "result_status", "source", "medium", "campaign", "content", "term", "referrer_code", "button_location"])
  });
  var PENDING_EVENTS_KEY = "consumer_pending_analytics_events";
  var QUEUEABLE_EVENTS = /* @__PURE__ */ new Set(["landing_view", "calculator_started"]);
  var gaLoadingPromise;
  function sanitizeEventParameters(parameters = {}, eventName = "") {
    const allowlist = CORE_EVENT_PARAMETERS[eventName];
    return Object.fromEntries(Object.entries(parameters).filter(([key, value]) => {
      if (allowlist && !allowlist.has(key)) return false;
      if (key !== "deposit_method" && (FORBIDDEN_KEYS.test(key) || /(?:^|_)deposit(?:$|_(?:amount|total|value))/i.test(key))) return false;
      return ["string", "number", "boolean"].includes(typeof value);
    }));
  }
  function loadAnalytics({ measurementId = SITE_CONFIG.gaMeasurementId, documentRef = globalThis.document } = {}) {
    if (!measurementId || !canUseAnalytics() || !documentRef) return Promise.resolve(false);
    if (gaLoadingPromise) return gaLoadingPromise;
    globalThis.dataLayer = globalThis.dataLayer || [];
    globalThis.gtag = globalThis.gtag || function gtag() {
      globalThis.dataLayer.push(arguments);
    };
    globalThis.gtag("js", /* @__PURE__ */ new Date());
    globalThis.gtag("config", measurementId, { anonymize_ip: true });
    gaLoadingPromise = new Promise((resolve) => {
      const script = documentRef.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      documentRef.head.append(script);
    });
    return gaLoadingPromise;
  }
  function trackEvent(eventName, parameters = {}) {
    var _a;
    const safeParameters = sanitizeEventParameters(parameters, eventName);
    if (SITE_CONFIG.analyticsDebug) console.debug("[consumer analytics]", eventName, safeParameters);
    if (!canUseAnalytics() || !SITE_CONFIG.gaMeasurementId) return false;
    loadAnalytics();
    (_a = globalThis.gtag) == null ? void 0 : _a.call(globalThis, "event", eventName, safeParameters);
    return true;
  }
  function trackOnce(eventName, parameters = {}, storage = globalThis.sessionStorage) {
    const key = `consumer_event_${eventName}`;
    try {
      if (storage == null ? void 0 : storage.getItem(key)) return false;
    } catch (e) {
    }
    const sent = trackEvent(eventName, parameters);
    if (sent) {
      try {
        storage == null ? void 0 : storage.setItem(key, "1");
      } catch (e) {
      }
    }
    return sent;
  }
  function readPendingEvents(storage = globalThis.sessionStorage) {
    try {
      const pending = JSON.parse((storage == null ? void 0 : storage.getItem(PENDING_EVENTS_KEY)) || "[]");
      return Array.isArray(pending) ? pending.filter((item) => QUEUEABLE_EVENTS.has(item == null ? void 0 : item.eventName)) : [];
    } catch (e) {
      return [];
    }
  }
  function queueAnalyticsEvent(eventName, parameters = {}, storage = globalThis.sessionStorage) {
    if (!QUEUEABLE_EVENTS.has(eventName) || getConsentStatus() !== "unknown") return false;
    const eventKey = `consumer_event_${eventName}`;
    try {
      if (storage == null ? void 0 : storage.getItem(eventKey)) return false;
      const pending = readPendingEvents(storage);
      if (pending.some((item) => item.eventName === eventName)) return false;
      pending.push({ eventName, parameters: sanitizeEventParameters(parameters, eventName) });
      storage == null ? void 0 : storage.setItem(PENDING_EVENTS_KEY, JSON.stringify(pending));
      return true;
    } catch (e) {
      return false;
    }
  }
  function trackOnceOrQueue(eventName, parameters = {}, storage = globalThis.sessionStorage) {
    return canUseAnalytics() ? trackOnce(eventName, parameters, storage) : queueAnalyticsEvent(eventName, parameters, storage);
  }

  // consumer/ui/animations.js
  var reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  function countUp(element, value, formatter) {
    if (reducedMotion()) {
      element.textContent = formatter(value);
      return;
    }
    const start = performance.now();
    const duration = 650;
    const frame = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      element.textContent = formatter(value * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  // consumer/ui/app.js
  var $ = (selector, root = document) => root.querySelector(selector);
  var $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  var form = $("#consumer-form");
  var steps = $$(".step");
  var money2 = (value) => new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0
  }).format(Math.round(value));
  var labels = {
    none: "\u05E2\u05D3\u05D9\u05D9\u05DF \u05D0\u05D9\u05DF \u05E7\u05E8\u05DF",
    existing: "\u05D9\u05E9 \u05E7\u05E8\u05DF \u05D4\u05E9\u05EA\u05DC\u05DE\u05D5\u05EA"
  };
  var currentStep = 0;
  var lastProfile;
  var lastResult;
  var advanceTimer;
  var countdownTimer;
  var isTransitioning = false;
  var isSubmitting = false;
  var stepHistory = [0];
  var FORM_STATE_KEY = "consumer_calculator_state";
  var attribution = getAttribution();
  var attributionParameters = attributionEventParameters(attribution);
  function saveFormState() {
    try {
      const values = {};
      new FormData(form).forEach((value, key) => {
        values[key] = key === "goal" ? [...values[key] || [], value] : value;
      });
      sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify({ currentStep, stepHistory, values }));
    } catch (e) {
    }
  }
  function restoreFormState() {
    try {
      const state = JSON.parse(sessionStorage.getItem(FORM_STATE_KEY) || "null");
      if (!(state == null ? void 0 : state.values)) return false;
      for (const [name, value] of Object.entries(state.values)) {
        const fields = $$(`[name="${name}"]`, form);
        fields.forEach((field) => {
          if (field.type === "radio" || field.type === "checkbox") field.checked = (Array.isArray(value) ? value : [value]).includes(field.value);
          else field.value = value;
        });
      }
      stepHistory.splice(0, stepHistory.length, ...Array.isArray(state.stepHistory) ? state.stepHistory : [0]);
      currentStep = Number.isInteger(state.currentStep) ? state.currentStep : 0;
      updateDepositFields();
      updateSelectedCards();
      updateSummary();
      return true;
    } catch (e) {
      return false;
    }
  }
  function resultStatus(result) {
    return result.overCeiling > 0 ? "over_ceiling" : result.remaining === 0 ? "ceiling_reached" : "remaining";
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
    if (Number.isFinite(value)) input.value = Math.round(value).toLocaleString("he-IL");
  }
  function updateSelectedCards() {
    $$(".choice-card").forEach((card) => card.classList.toggle("is-selected", $("input", card).checked));
  }
  function depositTotalFromForm() {
    const method = form.elements.depositMethod.value;
    const lump = ["lump", "both"].includes(method) ? normalizeMoney(form.elements.lumpSum.value) || 0 : 0;
    const monthly = ["monthly", "both"].includes(method) ? normalizeMoney(form.elements.monthlyDeposit.value) || 0 : 0;
    const months = ["monthly", "both"].includes(method) ? Number(form.elements.monthsDeposited.value) : 0;
    if (["monthly", "both"].includes(method) && (!Number.isInteger(months) || months < 1 || months > 12)) return NaN;
    return lump + monthly * months;
  }
  function validateMonthsDeposited(showError = true) {
    const method = form.elements.depositMethod.value;
    const field = form.elements.monthsDeposited;
    const relevant = ["monthly", "both"].includes(method);
    const months = Number(field.value);
    const valid = !relevant || Number.isInteger(months) && months >= 1 && months <= 12;
    field.setAttribute("aria-invalid", String(!valid));
    if (showError) $("#months-deposited-error").textContent = valid ? "" : "\u05D9\u05E9 \u05DC\u05D4\u05D6\u05D9\u05DF \u05DE\u05E1\u05E4\u05E8 \u05D7\u05D5\u05D3\u05E9\u05D9\u05DD \u05E9\u05DC\u05DD \u05D1\u05D9\u05DF 1 \u05DC\u05BE12.";
    return valid;
  }
  function updateSummary() {
    const income = normalizeMoney(form.elements.income.value);
    $("#summary-income").textContent = Number.isFinite(income) && income > 0 ? money2(income) : "\u05D8\u05E8\u05DD \u05D4\u05D5\u05D6\u05E0\u05D4";
    const depositMethod = form.elements.depositMethod.value;
    const depositedTotal = depositTotalFromForm();
    $("#summary-deposited").textContent = depositMethod ? Number.isFinite(depositedTotal) ? money2(depositedTotal) : "\u05D9\u05E9 \u05DC\u05EA\u05E7\u05DF \u05D0\u05EA \u05DE\u05E1\u05E4\u05E8 \u05D4\u05D7\u05D5\u05D3\u05E9\u05D9\u05DD" : "\u05D8\u05E8\u05DD \u05D4\u05D5\u05D6\u05DF";
    const balance = normalizeMoney(form.elements.existingBalance.value);
    const fundStatus = form.elements.fundStatus.value;
    $("#summary-balance").textContent = fundStatus === "none" ? "\u05DC\u05D0 \u05E8\u05DC\u05D5\u05D5\u05E0\u05D8\u05D9" : fundStatus && Number.isFinite(balance) ? money2(balance) : "\u05D8\u05E8\u05DD \u05D4\u05D5\u05D6\u05E0\u05D4";
    $("#summary-fund").textContent = labels[fundStatus] || "\u05D8\u05E8\u05DD \u05E0\u05D1\u05D7\u05E8";
    const preview = $("#deposit-preview");
    if (depositMethod) {
      preview.hidden = false;
      preview.classList.toggle("is-error", !Number.isFinite(depositedTotal));
      const includesStandingOrder = ["monthly", "both"].includes(depositMethod);
      $("span", preview).textContent = Number.isFinite(depositedTotal) ? `\u05E2\u05D3 \u05DB\u05D4 \u05D4\u05D5\u05D6\u05E0\u05D5 \u05D4\u05E4\u05E7\u05D3\u05D5\u05EA \u05D1\u05E1\u05DA ${money2(depositedTotal)}${includesStandingOrder ? ", \u05DB\u05D5\u05DC\u05DC \u05D4\u05D5\u05E8\u05D0\u05EA \u05E7\u05D1\u05E2" : ""}.` : "\u05DE\u05E1\u05E4\u05E8 \u05D4\u05D7\u05D5\u05D3\u05E9\u05D9\u05DD \u05D0\u05D9\u05E0\u05D5 \u05D4\u05D2\u05D9\u05D5\u05E0\u05D9. \u05D9\u05E9 \u05DC\u05D4\u05D6\u05D9\u05DF \u05DE\u05E1\u05E4\u05E8 \u05E9\u05DC\u05DD \u05D1\u05D9\u05DF 1 \u05DC\u05BE12.";
    }
  }
  function updateDepositFields() {
    const method = form.elements.depositMethod.value;
    $("#lump-fields").hidden = !["lump", "both"].includes(method);
    $("#monthly-fields").hidden = !["monthly", "both"].includes(method);
    updateSummary();
  }
  function depositDetailsComplete() {
    const method = form.elements.depositMethod.value;
    const lump = normalizeMoney(form.elements.lumpSum.value);
    const monthly = normalizeMoney(form.elements.monthlyDeposit.value);
    const months = Number(form.elements.monthsDeposited.value);
    if (method === "none") return true;
    if (method === "lump") return lump > 0;
    if (method === "monthly") return monthly > 0 && validateMonthsDeposited();
    if (method === "both") return lump > 0 && monthly > 0 && validateMonthsDeposited();
    return false;
  }
  function renderStep(index, animate = true) {
    var _a;
    clearTimeout(advanceTimer);
    isTransitioning = false;
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, i) => {
      step.hidden = i !== currentStep;
      step.classList.remove("is-leaving");
    });
    $("#step-copy").textContent = `\u05E9\u05DC\u05D1 ${currentStep + 1} \u05DE\u05EA\u05D5\u05DA 4`;
    $("#step-title").textContent = steps[currentStep].dataset.title;
    $("#progress-fill").style.width = `${(currentStep + 1) * 25}%`;
    $(".progress-track").setAttribute("aria-valuenow", String(currentStep + 1));
    $("[data-back]").hidden = stepHistory.length === 1;
    $("[data-next]").hidden = ![0, 2].includes(currentStep);
    $("#submit-check").hidden = currentStep !== 3;
    $("#form-error").textContent = "";
    if (animate) steps[currentStep].classList.add("is-entering");
    (_a = steps[currentStep].querySelector('input:not([type="radio"]):not([type="checkbox"])')) == null ? void 0 : _a.focus({ preventScroll: true });
    if (innerWidth <= 640 && currentStep > 0) form.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    saveFormState();
  }
  function validateStep() {
    const active = steps[currentStep];
    if (currentStep === 2 && !validateMonthsDeposited()) {
      $("#form-error").textContent = "\u05D9\u05E9 \u05DC\u05EA\u05E7\u05DF \u05D0\u05EA \u05DE\u05E1\u05E4\u05E8 \u05D4\u05D7\u05D5\u05D3\u05E9\u05D9\u05DD: \u05DE\u05E1\u05E4\u05E8 \u05E9\u05DC\u05DD \u05D1\u05D9\u05DF 1 \u05DC\u05BE12.";
      form.elements.monthsDeposited.focus();
      return false;
    }
    if (currentStep === 2 && !depositDetailsComplete()) {
      $("#form-error").textContent = "\u05D9\u05E9 \u05DC\u05D4\u05E9\u05DC\u05D9\u05DD \u05D0\u05EA \u05E4\u05E8\u05D8\u05D9 \u05D4\u05D4\u05E4\u05E7\u05D3\u05D4 \u05D1\u05E1\u05DB\u05D5\u05DD \u05D2\u05D3\u05D5\u05DC \u05DE\u05D0\u05E4\u05E1.";
      return false;
    }
    if (currentStep === 3 && !form.querySelector('[name="goal"]:checked')) {
      $("#form-error").textContent = "\u05DB\u05D3\u05D9 \u05DC\u05D4\u05E6\u05D9\u05D2 \u05EA\u05D5\u05E6\u05D0\u05D4, \u05D9\u05E9 \u05DC\u05D1\u05D7\u05D5\u05E8 \u05DC\u05E4\u05D7\u05D5\u05EA \u05DE\u05D8\u05E8\u05D4 \u05D0\u05D7\u05EA.";
      return false;
    }
    const required = $$("[required]", active);
    for (const field of required) {
      if (field.type === "radio" && !form.querySelector(`[name="${field.name}"]:checked`)) {
        $("#form-error").textContent = "\u05DB\u05D3\u05D9 \u05DC\u05D4\u05DE\u05E9\u05D9\u05DA, \u05D9\u05E9 \u05DC\u05D1\u05D7\u05D5\u05E8 \u05D0\u05D7\u05EA \u05DE\u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA.";
        return false;
      }
      if (field.type !== "radio") {
        const value = normalizeMoney(field.value);
        if (!Number.isFinite(value) || field.name === "income" && value <= 0) {
          $("#form-error").textContent = "\u05D9\u05E9 \u05DC\u05D4\u05D6\u05D9\u05DF \u05E1\u05DB\u05D5\u05DD \u05EA\u05E7\u05D9\u05DF \u05D5\u05D2\u05D3\u05D5\u05DC \u05DE\u05D0\u05E4\u05E1.";
          if (field.name === "income") $("#income-error").textContent = "\u05D4\u05E1\u05DB\u05D5\u05DD \u05E0\u05D3\u05E8\u05E9 \u05DB\u05D3\u05D9 \u05DC\u05D4\u05DE\u05E9\u05D9\u05DA.";
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
    trackEvent("step_completed", { step_number: currentStep + 1, step_name: steps[currentStep].dataset.title, ...currentStep === 1 ? { fund_status: profile.fundStatus } : {}, ...currentStep === 2 ? { deposit_method: profile.depositMethod } : {} });
    const current = steps[currentStep];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      renderStep(index, false);
      return;
    }
    current.classList.add("is-leaving");
    setTimeout(() => renderStep(index), 160);
  }
  function collect(years = 10) {
    const data = new FormData(form);
    const method = data.get("depositMethod");
    return {
      input: {
        income: data.get("income"),
        lumpSum: ["lump", "both"].includes(method) ? data.get("lumpSum") : 0,
        monthlyDeposit: ["monthly", "both"].includes(method) ? data.get("monthlyDeposit") : 0,
        monthsDeposited: ["monthly", "both"].includes(method) ? data.get("monthsDeposited") : 0,
        existingBalance: data.get("existingBalance"),
        projectionYears: years
      },
      profile: {
        depositMethod: method,
        fundStatus: data.get("fundStatus"),
        hasExistingBalance: data.get("fundStatus") === "existing" && String(data.get("existingBalance") || "").trim() !== "" && normalizeMoney(data.get("existingBalance")) > 0,
        completionPreference: ["monthly", "both"].includes(method) ? "monthly" : method === "lump" ? "lump" : "unknown",
        goals: data.getAll("goal"),
        goal: data.getAll("goal").join(", ")
      }
    };
  }
  function renderScenarios(result) {
    lastResult = result;
    const accents = ["#2563eb", "#7c3aed", "#10b981"];
    $("#scenario-list").innerHTML = result.projections.map((item, index) => `
    <button type="button" class="scenario-card" data-scenario-index="${index}" style="--accent:${accents[index]};--bar:${55 + index * 20}%" aria-expanded="false">
      <span>${item.label}<b>${Math.round(item.annualRate * 100)}%</b></span>
      <strong>${money2(item.nominalValue)}</strong>
      <small>\u05DC\u05D0\u05D7\u05E8 ${item.years} \u05E9\u05E0\u05D9\u05DD \xB7 \u05DC\u05D7\u05E6\u05D5 \u05DC\u05D2\u05E8\u05E3 \u05D5\u05D8\u05D1\u05DC\u05D4</small>
    </button>`).join("");
    $("#growth-detail").hidden = true;
  }
  function renderGrowthDetail(result, scenarioIndex) {
    const scenario = result.projections[scenarioIndex];
    const schedule = buildGrowthSchedule(result.existingBalance, result.suggestedMonthly, scenario.annualRate, scenario.years);
    const maxValue = Math.max(...schedule.map((row) => row.nominalValue), 1) * 1.08;
    $$("#scenario-list .scenario-card").forEach((card, index) => {
      const selected = index === scenarioIndex;
      card.classList.toggle("is-selected", selected);
      card.setAttribute("aria-expanded", String(selected));
    });
    $("#growth-detail-title").textContent = `${scenario.label} \xB7 ${Math.round(scenario.annualRate * 100)}% \u05DC\u05E9\u05E0\u05D4`;
    const chart = { left: 76, right: 730, top: 24, bottom: 220 };
    const points = schedule.map((row, index) => ({
      x: chart.left + index / Math.max(1, schedule.length - 1) * (chart.right - chart.left),
      y: chart.bottom - row.nominalValue / maxValue * (chart.bottom - chart.top)
    }));
    const compactMoney = (value) => `${new Intl.NumberFormat("he-IL", { notation: "compact", maximumFractionDigits: 1 }).format(value)} \u20AA`;
    const yTicks = Array.from({ length: 5 }, (_, index) => {
      const value = maxValue * index / 4;
      const y = chart.bottom - index / 4 * (chart.bottom - chart.top);
      return `<line x1="${chart.left}" y1="${y}" x2="${chart.right}" y2="${y}" class="chart-grid"/><text x="${chart.left - 10}" y="${y + 4}" class="chart-label chart-label--y">${compactMoney(value)}</text>`;
    }).join("");
    const xEvery = Math.max(1, Math.ceil(scenario.years / 5));
    const xLabels = schedule.filter((row) => row.year % xEvery === 0 || row.year === scenario.years).map((row) => {
      const x = chart.left + row.year / scenario.years * (chart.right - chart.left);
      return `<line x1="${x}" y1="${chart.bottom}" x2="${x}" y2="${chart.bottom + 5}" class="chart-axis"/><text x="${x}" y="${chart.bottom + 22}" class="chart-label chart-label--x">${row.year}</text>`;
    }).join("");
    const pointString = points.map((point) => `${point.x},${point.y}`).join(" ");
    const areaString = `${chart.left},${chart.bottom} ${pointString} ${chart.right},${chart.bottom}`;
    $("#growth-chart").innerHTML = `${yTicks}<line x1="${chart.left}" y1="${chart.top}" x2="${chart.left}" y2="${chart.bottom}" class="chart-axis"/><line x1="${chart.left}" y1="${chart.bottom}" x2="${chart.right}" y2="${chart.bottom}" class="chart-axis"/>${xLabels}<polygon points="${areaString}" class="chart-area"/><polyline points="${pointString}" class="chart-line"/>${points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="3.5" class="chart-point"/>`).join("")}<text x="${(chart.left + chart.right) / 2}" y="262" class="chart-axis-title">\u05E9\u05E0\u05D9\u05DD</text><text x="18" y="${(chart.top + chart.bottom) / 2}" class="chart-axis-title chart-axis-title--y">\u05E9\u05D5\u05D5\u05D9 \u05DE\u05E9\u05D5\u05E2\u05E8</text>`;
    $("#growth-table-body").innerHTML = schedule.map((row) => `<tr><th scope="row">${row.year === 0 ? "\u05D4\u05D9\u05D5\u05DD" : `\u05E9\u05E0\u05D4 ${row.year}`}</th><td>${money2(row.openingBalance)}</td><td>${money2(row.contributions)}</td><td>${money2(row.estimatedGrowth)}</td><td><strong>${money2(row.nominalValue)}</strong></td></tr>`).join("");
    $("#growth-detail").hidden = false;
    $("#growth-detail").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
  }
  function renderScore(result, profile) {
    const score = calculateUtilizationScore({
      deposited: result.deposited,
      ceiling: result.ceiling,
      hasMonthlyPlan: ["monthly", "both"].includes(profile.depositMethod),
      fundStatus: profile.fundStatus,
      completionPreference: profile.completionPreference
    });
    profile.score = score;
    countUp($("#score"), score, (value) => Math.round(value));
    $("#score-gauge").style.setProperty("--score-angle", `${score * 3.6}deg`);
    $("#score-meaning").textContent = score >= 80 ? "\u05D4\u05D4\u05D9\u05E2\u05E8\u05DB\u05D5\u05EA \u05E9\u05DC\u05DA \u05DC\u05E9\u05E0\u05EA \u05D4\u05DE\u05E1 \u05DE\u05EA\u05E7\u05D3\u05DE\u05EA \u05DE\u05D0\u05D5\u05D3." : score >= 50 ? "\u05D9\u05E9 \u05D1\u05E1\u05D9\u05E1 \u05D8\u05D5\u05D1, \u05D5\u05E0\u05E9\u05D0\u05E8\u05D5 \u05DB\u05DE\u05D4 \u05E6\u05E2\u05D3\u05D9\u05DD \u05DC\u05D4\u05E9\u05DC\u05DE\u05D4." : "\u05D9\u05E9 \u05DE\u05E7\u05D5\u05DD \u05DC\u05D1\u05E0\u05D5\u05EA \u05EA\u05D5\u05DB\u05E0\u05D9\u05EA \u05D4\u05E4\u05E7\u05D3\u05D4 \u05DE\u05E1\u05D5\u05D3\u05E8\u05EA \u05D9\u05D5\u05EA\u05E8.";
    const components = [
      ["\u05E0\u05D9\u05E6\u05D5\u05DC \u05EA\u05E7\u05E8\u05D4", Math.min(result.deposited / result.ceiling, 1) > 0],
      ["\u05EA\u05D5\u05DB\u05E0\u05D9\u05EA \u05D7\u05D5\u05D3\u05E9\u05D9\u05EA", ["monthly", "both"].includes(profile.depositMethod)],
      ["\u05D4\u05D5\u05D2\u05D3\u05E8\u05D5 \u05DE\u05D8\u05E8\u05D5\u05EA", profile.goals.length > 0]
    ].sort((a, b) => Number(b[1]) - Number(a[1]));
    $("#score-components").innerHTML = components.map(([label, done]) => `<li><i class="fas fa-${done ? "circle-check" : "circle"}"></i>${label}</li>`).join("");
  }
  function renderRecommendationSteps(result, profile) {
    const monthNames = ["\u05D9\u05E0\u05D5\u05D0\u05E8", "\u05E4\u05D1\u05E8\u05D5\u05D0\u05E8", "\u05DE\u05E8\u05E5", "\u05D0\u05E4\u05E8\u05D9\u05DC", "\u05DE\u05D0\u05D9", "\u05D9\u05D5\u05E0\u05D9", "\u05D9\u05D5\u05DC\u05D9", "\u05D0\u05D5\u05D2\u05D5\u05E1\u05D8", "\u05E1\u05E4\u05D8\u05DE\u05D1\u05E8", "\u05D0\u05D5\u05E7\u05D8\u05D5\u05D1\u05E8", "\u05E0\u05D5\u05D1\u05DE\u05D1\u05E8", "\u05D3\u05E6\u05DE\u05D1\u05E8"];
    const stepsForUser = [];
    if (profile.fundStatus === "none") {
      stepsForUser.push(buildRecommendation(result, profile));
      stepsForUser.push("\u05DC\u05D4\u05E9\u05D5\u05D5\u05EA \u05D1\u05D9\u05DF \u05DE\u05E1\u05DC\u05D5\u05DC\u05D9 \u05D4\u05E9\u05E7\u05E2\u05D4 \u05D5\u05D3\u05DE\u05D9 \u05E0\u05D9\u05D4\u05D5\u05DC \u05DC\u05E4\u05E0\u05D9 \u05E4\u05EA\u05D9\u05D7\u05EA \u05D4\u05E7\u05E8\u05DF.");
      if (profile.goals.includes("monthly")) {
        const targetPayments = Math.min(result.scheduledMonthsRemaining, Math.floor(result.remaining / result.suggestedMonthly));
        const setupLumpSum = result.remaining - targetPayments * result.suggestedMonthly;
        const setupMonth = targetPayments > 0 ? monthNames[12 - targetPayments] : `\u05D9\u05E0\u05D5\u05D0\u05E8 ${result.taxYear + 1}`;
        const lumpCopy = setupLumpSum > 0 ? `\u05DC\u05D4\u05E4\u05E7\u05D9\u05D3 ${money2(setupLumpSum)} \u05D1\u05D4\u05E4\u05E7\u05D3\u05D4 \u05D7\u05D3\u05BE\u05E4\u05E2\u05DE\u05D9\u05EA, \u05D5\u05D1\u05DE\u05E7\u05D1\u05D9\u05DC ` : "";
        stepsForUser.push(`\u05DC\u05D0\u05D7\u05E8 \u05E4\u05EA\u05D9\u05D7\u05EA \u05D4\u05E7\u05E8\u05DF: ${lumpCopy}\u05DC\u05D4\u05D2\u05D3\u05D9\u05E8 \u05D4\u05D5\u05E8\u05D0\u05EA \u05E7\u05D1\u05E2 \u05E9\u05DC ${money2(result.suggestedMonthly)} \u05D4\u05D7\u05DC \u05DE\u05D7\u05D5\u05D3\u05E9 ${setupMonth}, \u05D5\u05DC\u05D4\u05DE\u05E9\u05D9\u05DA \u05D0\u05D9\u05EA\u05D4 \u05D2\u05DD \u05D1\u05E9\u05E0\u05EA ${result.taxYear + 1}.`);
        stepsForUser.push(`\u05D7\u05DC\u05D5\u05E4\u05D4 \u05E0\u05D5\u05E1\u05E4\u05EA: \u05DC\u05D0\u05D7\u05E8 \u05E4\u05EA\u05D9\u05D7\u05EA \u05D4\u05E7\u05E8\u05DF, \u05DC\u05D4\u05E4\u05E7\u05D9\u05D3 \u05D4\u05E9\u05E0\u05D4 \u05D0\u05EA \u05DE\u05DC\u05D5\u05D0 \u05D4\u05EA\u05E7\u05E8\u05D4, ${money2(result.remaining)}, \u05D1\u05D4\u05E4\u05E7\u05D3\u05D4 \u05D7\u05D3\u05BE\u05E4\u05E2\u05DE\u05D9\u05EA; \u05D5\u05DE\u05BE1.1.${result.taxYear + 1} \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC \u05D4\u05D5\u05E8\u05D0\u05EA \u05E7\u05D1\u05E2 \u05E9\u05D5\u05D8\u05E4\u05EA \u05E9\u05DC \u05DB\u05BE${money2(result.suggestedMonthly)} \u05D1\u05D7\u05D5\u05D3\u05E9. \u05D4\u05E1\u05DB\u05D5\u05DD \u05D4\u05D7\u05D5\u05D3\u05E9\u05D9 \u05DE\u05D1\u05D5\u05E1\u05E1 \u05E2\u05DC \u05EA\u05E7\u05E8\u05EA ${result.taxYear} \u05D5\u05D9\u05E9 \u05DC\u05E2\u05D3\u05DB\u05E0\u05D5 \u05DC\u05D0\u05D7\u05E8 \u05E4\u05E8\u05E1\u05D5\u05DD \u05D4\u05EA\u05E7\u05E8\u05D4 \u05D4\u05D7\u05D3\u05E9\u05D4.`);
      } else {
        stepsForUser.push(`\u05DC\u05D0\u05D7\u05E8 \u05E4\u05EA\u05D9\u05D7\u05EA \u05D4\u05E7\u05E8\u05DF, \u05DC\u05D1\u05D7\u05D5\u05DF \u05D4\u05E4\u05E7\u05D3\u05D4 \u05E9\u05E0\u05EA\u05D9\u05EA \u05E2\u05D3 ${money2(result.ceiling)} \u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05D4\u05DB\u05E0\u05E1\u05D4 \u05D5\u05DC\u05EA\u05D6\u05E8\u05D9\u05DD.`);
      }
    } else {
      if (result.remaining > 0) {
        const keepMonthly = result.currentMonthlyDeposit > 0 ? `, \u05DC\u05DC\u05D0 \u05E9\u05D9\u05E0\u05D5\u05D9 \u05D4\u05D5\u05E8\u05D0\u05EA \u05D4\u05E7\u05D1\u05E2 \u05D4\u05E7\u05D9\u05D9\u05DE\u05EA \u05D1\u05E1\u05DA ${money2(result.currentMonthlyDeposit)}` : "";
        stepsForUser.push(`\u05D0\u05E4\u05E9\u05E8\u05D5\u05EA \u05E8\u05D0\u05E9\u05D5\u05E0\u05D4: \u05DC\u05D4\u05E4\u05E7\u05D9\u05D3 ${money2(result.remaining)} \u05D1\u05D4\u05E4\u05E7\u05D3\u05D4 \u05D7\u05D3\u05BE\u05E4\u05E2\u05DE\u05D9\u05EA${keepMonthly}.`);
        if (result.currentMonthlyDeposit > 0) {
          stepsForUser.push(`\u05D0\u05E4\u05E9\u05E8\u05D5\u05EA \u05E9\u05E0\u05D9\u05D9\u05D4: \u05DC\u05E2\u05D3\u05DB\u05DF \u05D0\u05EA \u05D4\u05D5\u05E8\u05D0\u05EA \u05D4\u05E7\u05D1\u05E2 \u05DC\u05BE${money2(result.suggestedTotalMonthlyToYearEnd)} \u05D1\u05D7\u05D5\u05D3\u05E9, \u05DC\u05DB\u05DC \u05D0\u05D7\u05EA \u05DE\u05BE${result.scheduledMonthsRemaining} \u05D4\u05D4\u05E4\u05E7\u05D3\u05D5\u05EA \u05E9\u05E0\u05D5\u05EA\u05E8\u05D5 \u05D4\u05E9\u05E0\u05D4.`);
          if (result.nextYearRatePayments > 0) {
            const lumpPart = result.nextYearRateLumpSum > 0 ? `, \u05D5\u05D1\u05E0\u05D5\u05E1\u05E3 \u05DC\u05D4\u05E4\u05E7\u05D9\u05D3 ${money2(result.nextYearRateLumpSum)} \u05D1\u05D4\u05E4\u05E7\u05D3\u05D4 \u05D7\u05D3\u05BE\u05E4\u05E2\u05DE\u05D9\u05EA` : "";
            stepsForUser.push(`\u05D0\u05E4\u05E9\u05E8\u05D5\u05EA \u05E9\u05DC\u05D9\u05E9\u05D9\u05EA: \u05DC\u05D4\u05E9\u05D0\u05D9\u05E8 \u05D0\u05EA \u05D4\u05D5\u05E8\u05D0\u05EA \u05D4\u05E7\u05D1\u05E2 \u05D4\u05E7\u05D9\u05D9\u05DE\u05EA \u05E2\u05D3 \u05D7\u05D5\u05D3\u05E9 ${monthNames[result.nextYearRateStartMonthIndex - 1]}, \u05D5\u05DC\u05E2\u05D3\u05DB\u05DF \u05D0\u05D5\u05EA\u05D4 \u05DC\u05BE${money2(result.suggestedMonthly)} \u05D4\u05D7\u05DC \u05DE\u05D7\u05D5\u05D3\u05E9 ${monthNames[result.nextYearRateStartMonthIndex]}${lumpPart}. \u05DB\u05DA \u05D4\u05D5\u05E8\u05D0\u05EA \u05D4\u05E7\u05D1\u05E2 \u05DB\u05D1\u05E8 \u05EA\u05D4\u05D9\u05D4 \u05DE\u05D5\u05EA\u05D0\u05DE\u05EA \u05D1\u05E7\u05D9\u05E8\u05D5\u05D1 \u05DC\u05EA\u05E7\u05E8\u05EA \u05D4\u05E9\u05E0\u05D4 \u05D4\u05D1\u05D0\u05D4.`);
          }
        } else {
          stepsForUser.push(`\u05D0\u05D5 \u05DC\u05D7\u05DC\u05D5\u05E4\u05D9\u05DF: \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC \u05D4\u05E4\u05E7\u05D3\u05D4 \u05D7\u05D5\u05D3\u05E9\u05D9\u05EA \u05E9\u05DC \u05DB\u05BE${money2(result.suggestedMonthlyToYearEnd)} \u05E2\u05D3 \u05E1\u05D5\u05E3 \u05D4\u05E9\u05E0\u05D4.`);
          if (profile.goals.includes("monthly")) {
            const targetPayments = Math.min(result.scheduledMonthsRemaining, Math.floor(result.remaining / result.suggestedMonthly));
            const setupLumpSum = result.remaining - targetPayments * result.suggestedMonthly;
            const setupMonth = targetPayments > 0 ? monthNames[12 - targetPayments] : `\u05D9\u05E0\u05D5\u05D0\u05E8 ${result.taxYear + 1}`;
            const lumpCopy = setupLumpSum > 0 ? `\u05DC\u05D4\u05E4\u05E7\u05D9\u05D3 ${money2(setupLumpSum)} \u05D1\u05D4\u05E4\u05E7\u05D3\u05D4 \u05D7\u05D3\u05BE\u05E4\u05E2\u05DE\u05D9\u05EA, \u05D5\u05D1\u05DE\u05E7\u05D1\u05D9\u05DC ` : "";
            stepsForUser.push(`\u05D0\u05E4\u05E9\u05E8\u05D5\u05EA \u05E0\u05D5\u05E1\u05E4\u05EA \u05DC\u05D1\u05E0\u05D9\u05D9\u05EA \u05D4\u05D5\u05E8\u05D0\u05EA \u05E7\u05D1\u05E2: ${lumpCopy}\u05DC\u05E2\u05D3\u05DB\u05DF \u05D0\u05EA \u05D4\u05D5\u05E8\u05D0\u05EA \u05D4\u05E7\u05D1\u05E2 \u05DC\u05BE${money2(result.suggestedMonthly)} \u05D4\u05D7\u05DC \u05DE\u05D7\u05D5\u05D3\u05E9 ${setupMonth}, \u05D5\u05DC\u05D4\u05DE\u05E9\u05D9\u05DA \u05D0\u05D9\u05EA\u05D4 \u05D2\u05DD \u05D1\u05E9\u05E0\u05EA ${result.taxYear + 1}.`);
          }
        }
      } else stepsForUser.push(buildRecommendation(result, profile));
      const wantsMonthlyPlan = profile.goals.includes("monthly");
      if (result.overCeiling > 0) {
        stepsForUser.push(`\u05DC\u05E7\u05D1\u05D5\u05E2 \u05EA\u05D6\u05DB\u05D5\u05E8\u05EA \u05DC\u05BE1.1.${result.taxYear + 1}: \u05DC\u05D0\u05D7\u05E8 \u05E4\u05E8\u05E1\u05D5\u05DD \u05D4\u05EA\u05E7\u05E8\u05D4 \u05D4\u05DE\u05E2\u05D5\u05D3\u05DB\u05E0\u05EA, \u05DC\u05D4\u05E4\u05E7\u05D9\u05D3 \u05D0\u05EA \u05DE\u05DC\u05D5\u05D0 \u05D4\u05EA\u05E7\u05E8\u05D4 \u05DB\u05D1\u05E8 \u05D1\u05EA\u05D7\u05D9\u05DC\u05EA \u05D4\u05E9\u05E0\u05D4, \u05DB\u05D3\u05D9 \u05E9\u05D4\u05DB\u05E1\u05E3 \u05D9\u05D5\u05DB\u05DC \u05DC\u05E2\u05D1\u05D5\u05D3 \u05DC\u05D0\u05D5\u05E8\u05DA \u05DB\u05DC \u05D4\u05E9\u05E0\u05D4.`);
      }
      if (wantsMonthlyPlan && result.remaining > 0) {
        stepsForUser.push(`\u05D7\u05DC\u05D5\u05E4\u05D4 \u05E0\u05D5\u05E1\u05E4\u05EA: \u05DC\u05D4\u05E9\u05DC\u05D9\u05DD \u05D4\u05E9\u05E0\u05D4 \u05D0\u05EA \u05DE\u05DC\u05D5\u05D0 \u05D4\u05D9\u05EA\u05E8\u05D4, ${money2(result.remaining)}, \u05D1\u05D4\u05E4\u05E7\u05D3\u05D4 \u05D7\u05D3\u05BE\u05E4\u05E2\u05DE\u05D9\u05EA; \u05D5\u05DE\u05BE1.1.${result.taxYear + 1} \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC \u05D4\u05D5\u05E8\u05D0\u05EA \u05E7\u05D1\u05E2 \u05E9\u05D5\u05D8\u05E4\u05EA \u05E9\u05DC \u05DB\u05BE${money2(result.suggestedMonthly)} \u05D1\u05D7\u05D5\u05D3\u05E9. \u05D4\u05E1\u05DB\u05D5\u05DD \u05D4\u05D7\u05D5\u05D3\u05E9\u05D9 \u05DE\u05D1\u05D5\u05E1\u05E1 \u05E2\u05DC \u05EA\u05E7\u05E8\u05EA ${result.taxYear} \u05D5\u05D9\u05E9 \u05DC\u05E2\u05D3\u05DB\u05E0\u05D5 \u05DC\u05D0\u05D7\u05E8 \u05E4\u05E8\u05E1\u05D5\u05DD \u05D4\u05EA\u05E7\u05E8\u05D4 \u05D4\u05D7\u05D3\u05E9\u05D4.`);
      }
      if (profile.completionPreference === "lump" && !wantsMonthlyPlan && result.overCeiling === 0) {
        stepsForUser.push(`\u05DC\u05E7\u05D1\u05D5\u05E2 \u05DB\u05D1\u05E8 \u05E2\u05DB\u05E9\u05D9\u05D5 \u05EA\u05D6\u05DB\u05D5\u05E8\u05EA \u05DC\u05BE1.1.${result.taxYear + 1}. \u05DC\u05D0\u05D7\u05E8 \u05E4\u05E8\u05E1\u05D5\u05DD \u05D4\u05EA\u05E7\u05E8\u05D4 \u05D4\u05DE\u05E2\u05D5\u05D3\u05DB\u05E0\u05EA \u05DC\u05E9\u05E0\u05D4 \u05D4\u05D1\u05D0\u05D4, \u05E0\u05D9\u05EA\u05DF \u05DC\u05E9\u05E7\u05D5\u05DC \u05DC\u05D4\u05E4\u05E7\u05D9\u05D3 \u05D0\u05D5\u05EA\u05D4 \u05D1\u05EA\u05D7\u05D9\u05DC\u05EA \u05D4\u05E9\u05E0\u05D4 \u2014 \u05DB\u05DA \u05D4\u05DB\u05E1\u05E3 \u05D9\u05D5\u05DB\u05DC \u05DC\u05D4\u05D9\u05D5\u05EA \u05DE\u05D5\u05E9\u05E7\u05E2 \u05D5\u05DC\u05E2\u05D1\u05D5\u05D3 \u05DC\u05D0\u05D5\u05E8\u05DA \u05DB\u05DC \u05D4\u05E9\u05E0\u05D4.`);
      } else if (result.nextYearRatePayments === 0 && (result.overCeiling === 0 || wantsMonthlyPlan) && !(wantsMonthlyPlan && result.remaining > 0 && result.currentMonthlyDeposit === 0)) {
        const alternativePrefix = result.overCeiling > 0 ? "\u05DC\u05D7\u05D9\u05DC\u05D5\u05E4\u05D9\u05DF, " : "";
        stepsForUser.push(`${alternativePrefix}\u05DC\u05D4\u05D9\u05E2\u05E8\u05DA \u05DC\u05E9\u05E0\u05D4 \u05D4\u05D1\u05D0\u05D4 \u05E2\u05DD \u05D4\u05D5\u05E8\u05D0\u05EA \u05E7\u05D1\u05E2 \u05E9\u05DC \u05DB\u05BE${money2(result.suggestedMonthly)} \u05D1\u05D7\u05D5\u05D3\u05E9, \u05D5\u05DC\u05E2\u05D3\u05DB\u05DF \u05D0\u05D5\u05EA\u05D4 \u05DB\u05E9\u05D4\u05EA\u05E7\u05E8\u05D4 \u05DE\u05E9\u05EA\u05E0\u05D4.`);
      }
      stepsForUser.push("\u05DC\u05D1\u05D3\u05D5\u05E7 \u05D0\u05D7\u05EA \u05DC\u05E9\u05E0\u05D4 \u05E9\u05D4\u05DE\u05E1\u05DC\u05D5\u05DC \u05D5\u05D3\u05DE\u05D9 \u05D4\u05E0\u05D9\u05D4\u05D5\u05DC \u05E2\u05D3\u05D9\u05D9\u05DF \u05DE\u05EA\u05D0\u05D9\u05DE\u05D9\u05DD \u05DC\u05DE\u05D8\u05E8\u05D5\u05EA \u05E9\u05D1\u05D7\u05E8\u05EA.");
      stepsForUser.push("\u05DC\u05D1\u05D3\u05D5\u05E7 \u05E9\u05DE\u05E0\u05D4\u05DC \u05D4\u05D4\u05E9\u05E7\u05E2\u05D5\u05EA \u05DE\u05D9\u05D9\u05E6\u05E8 \u05EA\u05E9\u05D5\u05D0\u05D4 \u05D8\u05D5\u05D1\u05D4 \u05D5\u05E2\u05E7\u05D1\u05D9\u05EA \u05D1\u05D9\u05D7\u05E1 \u05DC\u05DE\u05EA\u05D7\u05E8\u05D9\u05DD \u05DC\u05D0\u05D5\u05E8\u05DA \u05EA\u05E7\u05D5\u05E4\u05D5\u05EA \u05D6\u05DE\u05DF \u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA.");
    }
    const itemHtml = (step, index) => {
      const isWarning = result.overCeiling > 0 && index === 0;
      return `<li${isWarning ? ' class="is-warning"' : ""}><span>${index + 1}</span><p>${isWarning ? '<i class="fas fa-triangle-exclamation" aria-hidden="true"></i>' : ""}${step}</p></li>`;
    };
    $("#recommendation-steps").innerHTML = stepsForUser.slice(0, 2).map(itemHtml).join("");
    const additional = stepsForUser.slice(2);
    $("#additional-recommendation-steps").innerHTML = additional.map((step, index) => itemHtml(step, index + 2)).join("");
    $("#more-recommendations").hidden = additional.length === 0;
  }
  function renderLiveCountdown(taxYear) {
    clearInterval(countdownTimer);
    const target = new Date(taxYear, 11, 31, 23, 59, 59, 999);
    const update = () => {
      const remainingMilliseconds = Math.max(0, target.getTime() - Date.now());
      const totalSeconds = Math.floor(remainingMilliseconds / 1e3);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor(totalSeconds % 86400 / 3600);
      const minutes = Math.floor(totalSeconds % 3600 / 60);
      const seconds = totalSeconds % 60;
      $("#countdown-days").textContent = days.toLocaleString("he-IL");
      $("#countdown-hours").textContent = String(hours).padStart(2, "0");
      $("#countdown-minutes").textContent = String(minutes).padStart(2, "0");
      $("#countdown-seconds").textContent = String(seconds).padStart(2, "0");
      $("#tax-countdown").hidden = remainingMilliseconds === 0;
      if (remainingMilliseconds === 0) clearInterval(countdownTimer);
    };
    update();
    countdownTimer = setInterval(update, 1e3);
  }
  function buildSecondaryCta(result, profile) {
    if (profile.fundStatus === "none") return "\u05E8\u05D5\u05E6\u05D4 \u05DC\u05D1\u05D3\u05D5\u05E7 \u05D0\u05D9\u05DA \u05E4\u05D5\u05EA\u05D7\u05D9\u05DD \u05E7\u05E8\u05DF \u05E9\u05DE\u05EA\u05D0\u05D9\u05DE\u05D4 \u05DC\u05DA?";
    if (result.remaining > 0) return "\u05E8\u05D5\u05E6\u05D4 \u05DC\u05D5\u05D5\u05D3\u05D0 \u05E9\u05D4\u05D3\u05E8\u05DA \u05DC\u05E0\u05E6\u05DC \u05D0\u05EA \u05D4\u05D9\u05EA\u05E8\u05D4 \u05D1\u05D0\u05DE\u05EA \u05DE\u05EA\u05D0\u05D9\u05DE\u05D4 \u05DC\u05DA?";
    return "\u05E8\u05D5\u05E6\u05D4 \u05DC\u05D1\u05D3\u05D5\u05E7 \u05E9\u05D4\u05E7\u05E8\u05DF \u05D4\u05E7\u05D9\u05D9\u05DE\u05EA \u05E2\u05D3\u05D9\u05D9\u05DF \u05E2\u05D5\u05D1\u05D3\u05EA \u05E0\u05DB\u05D5\u05DF \u05E2\u05D1\u05D5\u05E8\u05DA?";
  }
  function renderResultIntro(result) {
    clearInterval(countdownTimer);
    const countdown = $("#tax-countdown");
    const intro = $("#result-intro");
    const message = $("#result-message");
    intro.classList.toggle("is-over-ceiling", result.overCeiling > 0);
    if (result.overCeiling > 0) {
      const isProjectedOverage = result.depositedToDate <= result.ceiling && result.futureScheduledDeposits > 0;
      $("#result-title").textContent = isProjectedOverage ? "\u05D4\u05D4\u05E4\u05E7\u05D3\u05D5\u05EA \u05D4\u05E6\u05E4\u05D5\u05D9\u05D5\u05EA \u05D4\u05E9\u05E0\u05D4 \u05D2\u05D1\u05D5\u05D4\u05D5\u05EA \u05DE\u05D4\u05EA\u05E7\u05E8\u05D4 \u05D4\u05DE\u05D5\u05D8\u05D1\u05EA" : "\u05D4\u05D4\u05E4\u05E7\u05D3\u05D5\u05EA \u05D4\u05E9\u05E0\u05D4 \u05D2\u05D1\u05D5\u05D4\u05D5\u05EA \u05DE\u05D4\u05EA\u05E7\u05E8\u05D4 \u05D4\u05DE\u05D5\u05D8\u05D1\u05EA";
      message.textContent = isProjectedOverage ? `\u05D4\u05E1\u05DB\u05D5\u05DD \u05D4\u05E6\u05E4\u05D5\u05D9 \u05E9\u05DE\u05E2\u05DC \u05D4\u05EA\u05E7\u05E8\u05D4 \u05D4\u05D5\u05D0 ${money2(result.overCeiling)}. \u05DB\u05D3\u05D0\u05D9 \u05DC\u05D1\u05D3\u05D5\u05E7 \u05D0\u05D5\u05EA\u05D5 \u05DC\u05E4\u05E0\u05D9 \u05D1\u05D9\u05E6\u05D5\u05E2 \u05D4\u05E4\u05E7\u05D3\u05D5\u05EA \u05E0\u05D5\u05E1\u05E4\u05D5\u05EA.` : `\u05D4\u05E1\u05DB\u05D5\u05DD \u05E9\u05DE\u05E2\u05DC \u05D4\u05EA\u05E7\u05E8\u05D4 \u05D4\u05D5\u05D0 ${money2(result.overCeiling)}. \u05DB\u05D3\u05D0\u05D9 \u05DC\u05D1\u05D3\u05D5\u05E7 \u05D0\u05D5\u05EA\u05D5 \u05DC\u05E4\u05E0\u05D9 \u05D1\u05D9\u05E6\u05D5\u05E2 \u05D4\u05E4\u05E7\u05D3\u05D5\u05EA \u05E0\u05D5\u05E1\u05E4\u05D5\u05EA.`;
      message.hidden = false;
      countdown.hidden = true;
      return;
    }
    if (result.remaining === 0) {
      $("#result-title").textContent = `\u05E0\u05D9\u05E6\u05DC\u05EA \u05D0\u05EA \u05DE\u05DC\u05D5\u05D0 \u05D4\u05EA\u05E7\u05E8\u05D4 \u05D4\u05DE\u05D5\u05D8\u05D1\u05EA \u05DC\u05E9\u05E0\u05EA ${result.taxYear}`;
      message.textContent = "\u05D0\u05D9\u05DF \u05E6\u05D5\u05E8\u05DA \u05DC\u05D1\u05E6\u05E2 \u05D4\u05E4\u05E7\u05D3\u05D4 \u05E0\u05D5\u05E1\u05E4\u05EA \u05DB\u05D3\u05D9 \u05DC\u05E0\u05E6\u05DC \u05D0\u05EA \u05D4\u05EA\u05E7\u05E8\u05D4 \u05D4\u05E9\u05E0\u05D4.";
      message.hidden = false;
      countdown.hidden = true;
      return;
    }
    $("#result-title").textContent = "\u05D4\u05D4\u05D6\u05D3\u05DE\u05E0\u05D5\u05EA \u05DC\u05E0\u05E6\u05DC \u05D0\u05EA \u05D4\u05D4\u05D8\u05D1\u05D4 \u05DE\u05E1\u05EA\u05D9\u05D9\u05DE\u05EA \u05D1\u05E1\u05D5\u05E3 \u05D4\u05E9\u05E0\u05D4";
    message.hidden = true;
    renderLiveCountdown(result.taxYear);
  }
  function renderResult(result, profile) {
    lastProfile = profile;
    countUp($("#remaining"), result.remaining, money2);
    countUp($("#tax-benefit"), result.estimatedCombinedBenefitTotal, money2);
    renderResultIntro(result);
    countUp($("#deposited-to-date"), result.depositedToDate, money2);
    countUp($("#projected-annual"), result.projectedAnnualDeposited, money2);
    const hasFutureProjection = result.projectedAnnualDeposited > result.depositedToDate;
    $("#projected-deposit-row").hidden = !hasFutureProjection;
    $("#future-scheduled").hidden = !hasFutureProjection;
    $("#deposit-mini").classList.toggle("is-single", !hasFutureProjection);
    $("#future-scheduled").textContent = hasFutureProjection ? `\u05DE\u05EA\u05D5\u05DB\u05DD ${money2(result.futureScheduledDeposits)} \u05E6\u05E4\u05D5\u05D9\u05D9\u05DD \u05D1\u05D4\u05D5\u05E8\u05D0\u05EA \u05D4\u05E7\u05D1\u05E2 \u05E2\u05D3 \u05E1\u05D5\u05E3 \u05D4\u05E9\u05E0\u05D4` : "";
    countUp($("#income-tax-benefit"), result.estimatedTotalTaxBenefit, money2);
    const taxRatesCopy = result.taxRatesUsed.map((rate) => `${rate * 100}%`).join(" \u05D5\u05BE");
    $("#income-tax-note").textContent = result.taxBenefitUsesMultipleBrackets ? `\u05D4\u05E0\u05D9\u05DB\u05D5\u05D9 \u05D7\u05D5\u05E6\u05D4 \u05DE\u05D3\u05E8\u05D2\u05D5\u05EA \u05DE\u05E1; \u05D4\u05D0\u05D5\u05DE\u05D3\u05DF \u05D7\u05D5\u05E9\u05D1 \u05DC\u05E4\u05D9 \u05D4\u05DE\u05D3\u05E8\u05D2\u05D5\u05EA ${taxRatesCopy}.` : `\u05E2\u05DC \u05D4\u05D4\u05E4\u05E7\u05D3\u05D4 \u05D4\u05E9\u05E0\u05EA\u05D9\u05EA \u05D4\u05DE\u05D5\u05DB\u05E8\u05EA, \u05DC\u05E4\u05D9 \u05DE\u05E1 \u05E9\u05D5\u05DC\u05D9 \u05DE\u05E9\u05D5\u05E2\u05E8 \u05E9\u05DC ${taxRatesCopy || `${result.taxRate * 100}%`}.`;
    countUp($("#insurance-benefit"), result.estimatedNationalInsuranceBenefitTotal, money2);
    countUp($("#capital-gains-benefit"), result.estimatedCapitalGainsExemptionValueTotal, money2);
    const ctaCopy = buildCta(result, profile);
    $("#dynamic-cta").textContent = ctaCopy;
    $("#dynamic-cta-secondary").textContent = buildSecondaryCta(result, profile);
    renderScore(result, profile);
    renderRecommendationSteps(result, profile);
    renderScenarios(result);
    $(".growth-notice").textContent = `\u05D4\u05D7\u05D9\u05E9\u05D5\u05D1 \u05DE\u05EA\u05D7\u05D9\u05DC \u05DE\u05D4\u05E6\u05D1\u05D9\u05E8\u05D4 \u05E9\u05D4\u05D6\u05E0\u05EA, ${money2(result.existingBalance)}, \u05D5\u05DE\u05D5\u05E1\u05D9\u05E3 \u05D4\u05E4\u05E7\u05D3\u05D4 \u05D7\u05D5\u05D3\u05E9\u05D9\u05EA \u05E7\u05D1\u05D5\u05E2\u05D4 \u05E9\u05DC ${money2(result.suggestedMonthly)} (\u05EA\u05E7\u05E8\u05EA ${result.taxYear} \u05D7\u05DC\u05E7\u05D9 12), \u05DC\u05DC\u05D0 \u05D4\u05E4\u05E7\u05D3\u05D4 \u05D7\u05D3\u05BE\u05E4\u05E2\u05DE\u05D9\u05EA \u05D5\u05DC\u05E4\u05E0\u05D9 \u05D3\u05DE\u05D9 \u05E0\u05D9\u05D4\u05D5\u05DC. \u05D4\u05DE\u05D7\u05E9\u05D4 \u05D1\u05DC\u05D1\u05D3, \u05DC\u05DC\u05D0 \u05D4\u05EA\u05D7\u05D9\u05D9\u05D1\u05D5\u05EA \u05DC\u05EA\u05E9\u05D5\u05D0\u05D4; \u05D4\u05E1\u05DB\u05D5\u05DE\u05D9\u05DD \u05E0\u05D5\u05DE\u05D9\u05E0\u05DC\u05D9\u05D9\u05DD \u05D5\u05D1\u05D4\u05E0\u05D7\u05EA \u05EA\u05E9\u05D5\u05D0\u05D4 \u05E7\u05D1\u05D5\u05E2\u05D4.`;
    const whatsappUrl = buildWhatsAppUrl(result, profile);
    $("#whatsapp").href = whatsappUrl;
    $("#whatsapp-secondary").href = whatsappUrl;
    $("#share-benefits").href = buildConsumerShareUrl();
    const bracketNote = result.taxBenefitUsesMultipleBrackets ? "<p><strong>\u05DC\u05EA\u05E9\u05D5\u05DE\u05EA \u05DC\u05D1:</strong> \u05D4\u05E0\u05D9\u05DB\u05D5\u05D9 \u05D7\u05D5\u05E6\u05D4 \u05DE\u05D3\u05E8\u05D2\u05EA \u05DE\u05E1, \u05D5\u05DC\u05DB\u05DF \u05D4\u05D8\u05D1\u05EA \u05DE\u05E1 \u05D4\u05D4\u05DB\u05E0\u05E1\u05D4 \u05D7\u05D5\u05E9\u05D1\u05D4 \u05DC\u05E4\u05D9 \u05D4\u05DE\u05E1 \u05DC\u05E4\u05E0\u05D9 \u05D5\u05D0\u05D7\u05E8\u05D9 \u05D4\u05E0\u05D9\u05DB\u05D5\u05D9 \u05D5\u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05DB\u05DC \u05DE\u05D3\u05E8\u05D2\u05D5\u05EA \u05D4\u05DE\u05E1 \u05D4\u05E8\u05DC\u05D5\u05D5\u05E0\u05D8\u05D9\u05D5\u05EA \u2014 \u05D5\u05DC\u05D0 \u05DC\u05E4\u05D9 \u05E9\u05D9\u05E2\u05D5\u05E8 \u05E9\u05D5\u05DC\u05D9 \u05D9\u05D7\u05D9\u05D3.</p>" : "";
    $("#calculation-details").innerHTML = `<p><strong>\u05EA\u05E7\u05E8\u05EA 2026:</strong> ${money2(result.ceiling)} \xB7 <strong>\u05D4\u05DB\u05E0\u05E1\u05D4:</strong> ${money2(result.income)} \xB7 <strong>\u05D4\u05D5\u05E4\u05E7\u05D3 \u05D4\u05E9\u05E0\u05D4:</strong> ${money2(result.depositedToDate)}${hasFutureProjection ? ` \xB7 <strong>\u05E6\u05E4\u05D5\u05D9 \u05E2\u05D3 \u05E1\u05D5\u05E3 \u05D4\u05E9\u05E0\u05D4 \u05DB\u05D5\u05DC\u05DC \u05D4\u05D5\u05E8\u05D0\u05EA \u05E7\u05D1\u05E2:</strong> ${money2(result.projectedAnnualDeposited)}` : ""}</p><p>\u05D0\u05D5\u05DE\u05D3\u05DF \u05D4\u05D4\u05D8\u05D1\u05D5\u05EA \u05DE\u05D7\u05D5\u05E9\u05D1 \u05D1\u05D4\u05E0\u05D7\u05D4 \u05E9\u05DC \u05DE\u05D9\u05E7\u05E1\u05D5\u05DD \u05D4\u05D4\u05E4\u05E7\u05D3\u05D4 \u05D4\u05E9\u05E0\u05EA\u05D9\u05EA \u05E2\u05D3 \u05D4\u05EA\u05E7\u05E8\u05D4, \u05D5\u05DC\u05DB\u05DF \u05DB\u05D5\u05DC\u05DC \u05D2\u05DD \u05D0\u05EA \u05D4\u05D4\u05E4\u05E7\u05D3\u05D5\u05EA \u05E9\u05DB\u05D1\u05E8 \u05D1\u05D5\u05E6\u05E2\u05D5 \u05D5\u05D0\u05EA \u05D4\u05D5\u05E8\u05D0\u05EA \u05D4\u05E7\u05D1\u05E2 \u05D4\u05E6\u05E4\u05D5\u05D9\u05D4 \u05E2\u05D3 \u05E1\u05D5\u05E3 \u05D4\u05E9\u05E0\u05D4 \u2014 \u05D5\u05DC\u05D0 \u05E8\u05E7 \u05D0\u05EA \u05D9\u05EA\u05E8\u05EA \u05D4\u05D4\u05E9\u05DC\u05DE\u05D4.</p><p><strong>\u05DE\u05D3\u05E8\u05D2\u05EA \u05DE\u05E1 \u05E9\u05D5\u05DC\u05D9\u05EA \u05DE\u05E9\u05D5\u05E2\u05E8\u05EA \u05DC\u05E4\u05E0\u05D9 \u05D4\u05E0\u05D9\u05DB\u05D5\u05D9:</strong> ${result.taxRate * 100}% \xB7 <strong>\u05E9\u05D9\u05E2\u05D5\u05E8 \u05E0\u05D9\u05DB\u05D5\u05D9:</strong> ${result.deductibleRate * 100}%</p>${bracketNote}<p><strong>\u05D4\u05D8\u05D1\u05D4 \u05DE\u05D9\u05D9\u05D3\u05D9\u05EA \u05DE\u05E9\u05D5\u05E2\u05E8\u05EA:</strong> \u05DE\u05E1 \u05D4\u05DB\u05E0\u05E1\u05D4 ${money2(result.estimatedTotalTaxBenefit)} + \u05D1\u05D9\u05D8\u05D5\u05D7 \u05DC\u05D0\u05D5\u05DE\u05D9/\u05D1\u05E8\u05D9\u05D0\u05D5\u05EA ${money2(result.estimatedNationalInsuranceBenefitTotal)}.</p><p><strong>\u05E9\u05D5\u05D5\u05D9 \u05E2\u05EA\u05D9\u05D3\u05D9 \u05DE\u05E9\u05D5\u05E2\u05E8:</strong> \u05E4\u05D8\u05D5\u05E8 \u05DE\u05DE\u05E1 \u05E8\u05D5\u05D5\u05D7\u05D9 \u05D4\u05D5\u05DF ${money2(result.estimatedCapitalGainsExemptionValueTotal)}, \u05D1\u05D4\u05E0\u05D7\u05EA 8% \u05DC\u05E9\u05E0\u05D4 \u05DC\u05BE6 \u05E9\u05E0\u05D9\u05DD \u05D5\u05DE\u05E1 \u05E9\u05DC 25% \u05E2\u05DC \u05D4\u05E8\u05D5\u05D5\u05D7.</p><p>\u05DE\u05E7\u05D5\u05E8\u05D5\u05EA: \u05DC\u05D5\u05D7 \u05D4\u05E0\u05D9\u05DB\u05D5\u05D9\u05D9\u05DD 2026 \u05E9\u05DC \u05E8\u05E9\u05D5\u05EA \u05D4\u05DE\u05E1\u05D9\u05DD \u05D5\u05E9\u05D9\u05E2\u05D5\u05E8\u05D9 \u05D1\u05D9\u05D8\u05D5\u05D7 \u05DC\u05D0\u05D5\u05DE\u05D9 \u05DC\u05E2\u05E6\u05DE\u05D0\u05D9 \u05D4\u05D7\u05DC \u05DE\u05BE1.1.2026. \u05D0\u05D9\u05DE\u05D5\u05EA: 19.07.2026. \u05DB\u05DC \u05D4\u05E8\u05DB\u05D9\u05D1\u05D9\u05DD \u05D4\u05DD \u05D0\u05D5\u05DE\u05D3\u05DF \u05D4\u05D3\u05D5\u05E8\u05E9 \u05D0\u05D9\u05DE\u05D5\u05EA \u05D0\u05D9\u05E9\u05D9.</p>`;
  }
  form.addEventListener("click", (event) => {
    var _a;
    const amount = (_a = event.target.closest("[data-amount]")) == null ? void 0 : _a.dataset.amount;
    if (amount) {
      $("#income").value = Number(amount).toLocaleString("he-IL");
      updateSummary();
      scheduleAdvance(() => transitionTo(1));
      return;
    }
    if (event.target.closest("[data-back]")) {
      clearTimeout(advanceTimer);
      if (stepHistory.length > 1) {
        stepHistory.pop();
        trackEvent("step_back_clicked", { from_step: currentStep + 1, to_step: stepHistory[stepHistory.length - 1] + 1 });
        transitionTo(stepHistory[stepHistory.length - 1], false);
      }
      return;
    }
    if (event.target.closest("[data-next]") && validateStep()) transitionTo(currentStep === 0 ? 1 : 3);
  });
  form.addEventListener("change", (event) => {
    if (event.target.matches('input[type="radio"], input[type="checkbox"]')) updateSelectedCards();
    if (event.target.name === "depositMethod") {
      updateDepositFields();
      const target = ["lump", "both"].includes(event.target.value) ? $("#lumpSum") : ["monthly"].includes(event.target.value) ? $("#monthlyDeposit") : $("#existingBalance");
      if (target && normalizeMoney(target.value) === 0) target.value = "";
      target == null ? void 0 : target.focus({ preventScroll: true });
      requestAnimationFrame(() => {
        var _a;
        (_a = target == null ? void 0 : target.closest(".conditional-fields")) == null ? void 0 : _a.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      });
    }
    updateSummary();
    saveFormState();
    if (event.target.name === "fundStatus") {
      const destination = event.target.value === "none" ? 3 : 2;
      scheduleAdvance(() => transitionTo(destination));
    }
  });
  form.addEventListener("input", (event) => {
    if (event.target.name === "monthsDeposited") validateMonthsDeposited();
    if (event.target.matches('[inputmode="numeric"], input[type="number"]')) updateSummary();
    saveFormState();
  });
  form.addEventListener("focusout", (event) => {
    if (event.target.matches('[inputmode="numeric"]')) formatMoneyInput(event.target);
  });
  form.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.isComposing || currentStep === steps.length - 1) return;
    if (!event.target.matches('input:not([type="radio"]):not([type="checkbox"])')) return;
    event.preventDefault();
    if (!validateStep()) return;
    if (currentStep === 0) transitionTo(1);
    else if (currentStep === 2) transitionTo(3);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!validateStep()) return;
    isSubmitting = true;
    clearTimeout(advanceTimer);
    try {
      const { input, profile } = collect();
      const result = calculateConsumerResult(input);
      trackOnce("calculator_completed", { fund_status: profile.fundStatus, deposit_method: profile.depositMethod, goals: profile.goals.join("|"), result_status: resultStatus(result), ...attributionParameters });
      $(".wizard-layout").hidden = true;
      $(".check-heading").hidden = true;
      $("#loading").hidden = false;
      const loadingSteps = $$("#loading li");
      let active = 0;
      const timer = setInterval(() => {
        loadingSteps.forEach((item, i) => item.classList.toggle("is-active", i === ++active));
      }, 260);
      setTimeout(() => {
        clearInterval(timer);
        $("#loading").hidden = true;
        renderResult(result, profile);
        $("#results").hidden = false;
        $("#results").focus();
      }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 850);
    } catch (e) {
      isSubmitting = false;
      $("#form-error").textContent = "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05E0\u05D5 \u05DC\u05D7\u05E9\u05D1. \u05D1\u05D3\u05E7\u05D5 \u05E9\u05D4\u05E1\u05DB\u05D5\u05DE\u05D9\u05DD \u05EA\u05E7\u05D9\u05E0\u05D9\u05DD \u05D5\u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1.";
    }
  });
  $$("[data-years]").forEach((button) => button.addEventListener("click", () => {
    $$("[data-years]").forEach((item) => item.classList.toggle("is-active", item === button));
    if (!lastProfile) return;
    const { input } = collect(Number(button.dataset.years));
    renderScenarios(calculateConsumerResult(input));
  }));
  $("#scenario-list").addEventListener("click", (event) => {
    const card = event.target.closest("[data-scenario-index]");
    if (!card || !lastResult) return;
    renderGrowthDetail(lastResult, Number(card.dataset.scenarioIndex));
    trackEvent("details_opened", { details_type: "growth_scenario" });
  });
  $$(".calculation-details, #more-recommendations").forEach((details) => details.addEventListener("toggle", () => {
    if (details.open) trackEvent("details_opened", { details_type: details.classList.contains("calculation-details") ? "calculation_method" : "additional_actions" });
  }));
  $$("#whatsapp, #whatsapp-secondary").forEach((link) => link.addEventListener("click", () => {
    trackEvent("whatsapp_clicked", {
      result_status: resultStatus(lastResult),
      fund_status: (lastProfile == null ? void 0 : lastProfile.fundStatus) || "",
      button_location: link.id === "whatsapp-secondary" ? "secondary" : "primary",
      ...attributionParameters
    });
    const notice = $("#whatsapp-status");
    if (notice) notice.textContent = "WhatsApp \u05E0\u05E4\u05EA\u05D7 \u05D1\u05D7\u05DC\u05D5\u05DF \u05D7\u05D3\u05E9. \u05DC\u05D0\u05D7\u05E8 \u05E9\u05DC\u05D9\u05D7\u05EA \u05D4\u05D4\u05D5\u05D3\u05E2\u05D4 \u05E8\u05D5\u05E2\u05D9 \u05D9\u05D5\u05DB\u05DC \u05DC\u05D7\u05D6\u05D5\u05E8 \u05D0\u05DC\u05D9\u05DA.";
  }));
  $("#share-benefits").addEventListener("click", () => trackEvent("share_clicked", { share_method: "whatsapp", entry_source: attribution.source }));
  $("#copy-share-link").addEventListener("click", async () => {
    await navigator.clipboard.writeText(SITE_CONFIG.publicBaseUrl);
    $("#share-feedback").textContent = "\u05D4\u05E7\u05D9\u05E9\u05D5\u05E8 \u05D4\u05D5\u05E2\u05EA\u05E7";
    trackEvent("share_clicked", { share_method: "copy_link", entry_source: attribution.source });
  });
  var nativeShare = $("#native-share");
  nativeShare.hidden = typeof navigator.share !== "function";
  nativeShare.addEventListener("click", async () => {
    try {
      await navigator.share({ title: "\u05D1\u05D3\u05D9\u05E7\u05EA \u05E7\u05E8\u05DF \u05D4\u05E9\u05EA\u05DC\u05DE\u05D5\u05EA \u05DC\u05E2\u05E6\u05DE\u05D0\u05D9\u05DD", text: buildShareMessage(""), url: SITE_CONFIG.publicBaseUrl });
      trackEvent("share_clicked", { share_method: "native_share", entry_source: attribution.source });
    } catch (e) {
    }
  });
  function restartCalculator() {
    try {
      sessionStorage.removeItem(FORM_STATE_KEY);
      sessionStorage.removeItem("consumer_event_calculator_completed");
      sessionStorage.removeItem("consumer_event_calculator_started");
    } catch (e) {
    }
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    location.assign("./check.html?restart=1");
  }
  $("#restart").addEventListener("click", restartCalculator);
  $("#stage-restart").addEventListener("click", restartCalculator);
  if (new URLSearchParams(location.search).has("restart")) {
    try {
      sessionStorage.removeItem(FORM_STATE_KEY);
    } catch (e) {
    }
    history.replaceState(null, "", "./check.html");
    scrollTo(0, 0);
  }
  trackOnceOrQueue("calculator_started", attributionParameters);
  restoreFormState();
  renderStep(currentStep, false);
})();
