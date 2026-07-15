(() => {
  // consumer/data/tax-data.js
  var TAX_DATA_2026 = Object.freeze({
    taxYear: 2026,
    verifiedAt: "2026-07-15",
    contributionCeiling: {
      value: 20566,
      taxYear: 2026,
      verifiedAt: "2026-07-15",
      source: "\u05E1\u05E4\u05E8 \u05D4\u05E0\u05D9\u05DB\u05D5\u05D9\u05D9\u05DD 2026, \u05E8\u05E9\u05D5\u05EA \u05D4\u05DE\u05E1\u05D9\u05DD (\u05DB\u05E4\u05D9 \u05E9\u05EA\u05D5\u05E2\u05D3 \u05D1\u05D0\u05EA\u05E8 \u05D4\u05DE\u05E7\u05E6\u05D5\u05E2\u05D9 \u05D4\u05E7\u05D9\u05D9\u05DD)",
      status: "official"
    },
    qualifyingIncomeCeiling: {
      value: 293397,
      taxYear: 2026,
      verifiedAt: "2026-07-15",
      source: "\u05E1\u05E4\u05E8 \u05D4\u05E0\u05D9\u05DB\u05D5\u05D9\u05D9\u05DD 2026, \u05E8\u05E9\u05D5\u05EA \u05D4\u05DE\u05E1\u05D9\u05DD (\u05DB\u05E4\u05D9 \u05E9\u05EA\u05D5\u05E2\u05D3 \u05D1\u05D0\u05EA\u05E8 \u05D4\u05DE\u05E7\u05E6\u05D5\u05E2\u05D9 \u05D4\u05E7\u05D9\u05D9\u05DD)",
      status: "official"
    },
    maxDeductibleContribution: {
      value: 13203,
      taxYear: 2026,
      verifiedAt: "2026-07-15",
      source: "\u05E1\u05E4\u05E8 \u05D4\u05E0\u05D9\u05DB\u05D5\u05D9\u05D9\u05DD 2026, \u05E8\u05E9\u05D5\u05EA \u05D4\u05DE\u05E1\u05D9\u05DD (\u05DB\u05E4\u05D9 \u05E9\u05EA\u05D5\u05E2\u05D3 \u05D1\u05D0\u05EA\u05E8 \u05D4\u05DE\u05E7\u05E6\u05D5\u05E2\u05D9 \u05D4\u05E7\u05D9\u05D9\u05DD)",
      status: "official"
    },
    deductibleRate: {
      value: 0.045,
      taxYear: 2026,
      verifiedAt: "2026-07-15",
      source: "\u05E1\u05E2\u05D9\u05E3 17(5\u05D0) \u05DC\u05E4\u05E7\u05D5\u05D3\u05EA \u05DE\u05E1 \u05D4\u05DB\u05E0\u05E1\u05D4; \u05E0\u05D3\u05E8\u05E9 \u05D0\u05D9\u05DE\u05D5\u05EA \u05DE\u05E7\u05E6\u05D5\u05E2\u05D9 \u05DC\u05E0\u05E1\u05D9\u05D1\u05D5\u05EA \u05D4\u05DE\u05E9\u05EA\u05DE\u05E9",
      status: "estimate"
    },
    taxBrackets: {
      value: [
        [84120, 0.1],
        [120720, 0.14],
        [193800, 0.2],
        [269280, 0.31],
        [560280, 0.35],
        [721560, 0.47],
        [Infinity, 0.5]
      ],
      taxYear: 2026,
      verifiedAt: "2026-07-15",
      source: "\u05DE\u05D3\u05E8\u05D2\u05D5\u05EA \u05D4\u05DE\u05E1 2026 \u05E9\u05D1\u05D0\u05EA\u05E8 \u05D4\u05DE\u05E7\u05E6\u05D5\u05E2\u05D9 \u05D4\u05E7\u05D9\u05D9\u05DD; \u05D9\u05E9 \u05DC\u05D0\u05DE\u05EA \u05DE\u05D5\u05DC \u05E4\u05E8\u05E1\u05D5\u05DD \u05E8\u05E9\u05D5\u05EA \u05D4\u05DE\u05E1\u05D9\u05DD",
      status: "estimate"
    }
  });
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
  function futureValueOfMonthlyDeposits(monthlyDeposit, annualRate, years = 6) {
    if (![monthlyDeposit, annualRate, years].every(Number.isFinite) || monthlyDeposit < 0 || annualRate < 0 || years < 0) {
      throw new TypeError("Invalid forecast input");
    }
    const months = Math.round(years * 12);
    if (annualRate === 0) return monthlyDeposit * months;
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
    return monthlyDeposit * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
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
  function calculateConsumerResult(input, data = TAX_DATA_2026) {
    var _a;
    const income = normalizeMoney(input.income);
    const deposited = input.deposited === void 0 ? totalDeposited(input) : normalizeMoney(input.deposited);
    if (!Number.isFinite(income) || income <= 0) throw new TypeError("Income must be greater than zero");
    if (!Number.isFinite(deposited)) throw new TypeError("Deposited amount must be zero or greater");
    const ceiling = data.contributionCeiling.value;
    const remaining = Math.max(0, ceiling - deposited);
    const eligibleIncome = Math.min(income, data.qualifyingIncomeCeiling.value);
    const annualDeductible = Math.min(
      eligibleIncome * data.deductibleRate.value,
      data.maxDeductibleContribution.value
    );
    const deductibleAlreadyUsed = Math.min(deposited, annualDeductible);
    const additionalDeductible = Math.min(remaining, Math.max(0, annualDeductible - deductibleAlreadyUsed));
    const taxRate = marginalTaxRate(income, data.taxBrackets.value);
    const totalDeductible = Math.min(deposited + remaining, annualDeductible);
    const estimatedTotalTaxBenefit = totalDeductible * taxRate;
    const estimatedAdditionalTaxBenefit = additionalDeductible * taxRate;
    const monthsRemaining = monthsRemainingInTaxYear((_a = input.today) != null ? _a : /* @__PURE__ */ new Date(), data.taxYear);
    const suggestedMonthlyToYearEnd = remaining > 0 && monthsRemaining > 0 ? Math.ceil(remaining / monthsRemaining) : 0;
    const suggestedMonthly = Math.ceil(ceiling / 12);
    const projectionYears = [6, 10, 15, 20].includes(Number(input.projectionYears)) ? Number(input.projectionYears) : 10;
    const projections = RETURN_SCENARIOS.map((scenario) => ({
      ...scenario,
      years: projectionYears,
      nominalValue: futureValueOfMonthlyDeposits(suggestedMonthly, scenario.annualRate, projectionYears)
    }));
    return {
      taxYear: data.taxYear,
      income,
      deposited,
      ceiling,
      remaining,
      overCeiling: Math.max(0, deposited - ceiling),
      taxRate,
      deductibleRate: data.deductibleRate.value,
      estimatedTaxBenefit: estimatedAdditionalTaxBenefit,
      estimatedTotalTaxBenefit,
      estimatedAdditionalTaxBenefit,
      monthsRemaining,
      suggestedMonthlyToYearEnd,
      suggestedMonthly,
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
    if (profile.completionPreference === "monthly") return `\u05DB\u05D3\u05D9 \u05DC\u05D4\u05E9\u05DC\u05D9\u05DD \u05D0\u05EA \u05D4\u05EA\u05E7\u05E8\u05D4 \u05E2\u05D3 \u05E1\u05D5\u05E3 \u05D4\u05E9\u05E0\u05D4, \u05E0\u05D9\u05EA\u05DF \u05DC\u05E9\u05E7\u05D5\u05DC \u05DC\u05E2\u05D3\u05DB\u05DF \u05D0\u05EA \u05D4\u05D5\u05E8\u05D0\u05EA \u05D4\u05E7\u05D1\u05E2 \u05DC\u05DB\u05BE${Math.round(result.suggestedMonthlyToYearEnd).toLocaleString("he-IL")} \u20AA \u05D1\u05D7\u05D5\u05D3\u05E9.`;
    return "\u05E0\u05E9\u05D0\u05E8\u05D4 \u05D9\u05EA\u05E8\u05D4 \u05DC\u05E0\u05D9\u05E6\u05D5\u05DC \u05D4\u05E9\u05E0\u05D4. \u05D0\u05E4\u05E9\u05E8 \u05DC\u05E9\u05E7\u05D5\u05DC \u05E9\u05D9\u05DC\u05D5\u05D1 \u05D1\u05D9\u05DF \u05D4\u05E4\u05E7\u05D3\u05D4 \u05D7\u05D3\u05BE\u05E4\u05E2\u05DE\u05D9\u05EA \u05DC\u05D4\u05E4\u05E7\u05D3\u05D4 \u05D7\u05D5\u05D3\u05E9\u05D9\u05EA, \u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05EA\u05D6\u05E8\u05D9\u05DD \u05E9\u05DC\u05DA.";
  }
  function buildCta(result, profile) {
    if (profile.fundStatus === "none") return "\u05E8\u05D5\u05E6\u05D4 \u05DC\u05D1\u05D3\u05D5\u05E7 \u05D0\u05D9\u05DA \u05DC\u05E4\u05EA\u05D5\u05D7 \u05E7\u05E8\u05DF \u05D1\u05E6\u05D5\u05E8\u05D4 \u05E0\u05DB\u05D5\u05E0\u05D4?";
    if (result.overCeiling > 0) return "\u05E8\u05D5\u05E6\u05D4 \u05DC\u05D1\u05D3\u05D5\u05E7 \u05DE\u05D4 \u05D0\u05E4\u05E9\u05E8 \u05DC\u05E2\u05E9\u05D5\u05EA \u05E2\u05DD \u05D4\u05E1\u05DB\u05D5\u05DD \u05E9\u05DE\u05E2\u05DC \u05D4\u05EA\u05E7\u05E8\u05D4?";
    if (result.remaining === 0) return "\u05E8\u05D5\u05E6\u05D4 \u05DC\u05D1\u05D3\u05D5\u05E7 \u05D0\u05DD \u05D4\u05E7\u05E8\u05DF \u05D5\u05D4\u05DE\u05E1\u05DC\u05D5\u05DC \u05E9\u05DC\u05DA \u05E2\u05D3\u05D9\u05D9\u05DF \u05DE\u05EA\u05D0\u05D9\u05DE\u05D9\u05DD?";
    return "\u05E8\u05D5\u05E6\u05D4 \u05DC\u05D1\u05D3\u05D5\u05E7 \u05D0\u05D9\u05DA \u05DC\u05D4\u05E9\u05DC\u05D9\u05DD \u05D0\u05EA \u05D4\u05D4\u05E4\u05E7\u05D3\u05D4 \u05D1\u05DC\u05D9 \u05DC\u05D4\u05DB\u05D1\u05D9\u05D3 \u05E2\u05DC \u05D4\u05EA\u05D6\u05E8\u05D9\u05DD?";
  }

  // consumer/messages/whatsapp.js
  var PHONE = "972528089808";
  var money = (value) => new Intl.NumberFormat("he-IL", { maximumFractionDigits: 0 }).format(Math.round(value));
  function buildWhatsAppMessage(result, profile = {}) {
    var _a, _b, _c, _d, _e;
    return [
      "\u05D4\u05D9\u05D9 \u05E8\u05D5\u05E2\u05D9, \u05D1\u05D9\u05E6\u05E2\u05EA\u05D9 \u05D0\u05EA \u05D1\u05D3\u05D9\u05E7\u05EA \u05E7\u05E8\u05DF \u05D4\u05D4\u05E9\u05EA\u05DC\u05DE\u05D5\u05EA \u05D1\u05D0\u05EA\u05E8.",
      `\u05D4\u05DB\u05E0\u05E1\u05D4 \u05E9\u05E0\u05EA\u05D9\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DE\u05E9\u05D5\u05E2\u05E8\u05EA: ${money(result.income)} \u20AA`,
      `\u05E1\u05DA \u05D4\u05E4\u05E7\u05D3\u05D5\u05EA \u05E9\u05D1\u05D5\u05E6\u05E2\u05D5 \u05D4\u05E9\u05E0\u05D4: ${money(result.deposited)} \u20AA`,
      `\u05D9\u05EA\u05E8\u05D4 \u05DC\u05E0\u05D9\u05E6\u05D5\u05DC: ${money(result.remaining)} \u20AA`,
      ...result.overCeiling ? [`\u05E1\u05DB\u05D5\u05DD \u05DE\u05E2\u05DC \u05D4\u05EA\u05E7\u05E8\u05D4: ${money(result.overCeiling)} \u20AA`] : [],
      `\u05D3\u05E8\u05DA \u05D4\u05D4\u05E4\u05E7\u05D3\u05D4 \u05E9\u05E0\u05D1\u05D7\u05E8\u05D4: ${(_a = profile.depositMethod) != null ? _a : "\u05DC\u05D0 \u05E6\u05D5\u05D9\u05E0\u05D4"}`,
      `\u05D4\u05E2\u05D3\u05E4\u05EA \u05EA\u05D6\u05E8\u05D9\u05DD: ${(_b = profile.completionPreference) != null ? _b : "\u05DC\u05D0 \u05E6\u05D5\u05D9\u05E0\u05D4"}`,
      `\u05DE\u05E6\u05D1 \u05D4\u05E7\u05E8\u05DF: ${(_c = profile.fundStatus) != null ? _c : "\u05DC\u05D0 \u05E6\u05D5\u05D9\u05DF"}`,
      `\u05D4\u05DE\u05D8\u05E8\u05D4 \u05D4\u05DE\u05E8\u05DB\u05D6\u05D9\u05EA: ${(_d = profile.goal) != null ? _d : "\u05DC\u05D0 \u05E6\u05D5\u05D9\u05E0\u05D4"}`,
      `\u05D4\u05D5\u05E8\u05D0\u05EA \u05E7\u05D1\u05E2 \u05DE\u05D5\u05E6\u05E2\u05EA: ${money(result.suggestedMonthly)} \u20AA \u05DC\u05D7\u05D5\u05D3\u05E9`,
      `\u05D4\u05E2\u05E8\u05DB\u05EA \u05D4\u05D8\u05D1\u05EA \u05D4\u05DE\u05E1 \u05D4\u05E0\u05D5\u05E1\u05E4\u05EA: ${money(result.estimatedAdditionalTaxBenefit)} \u20AA`,
      `\u05E6\u05D9\u05D5\u05DF \u05E0\u05D9\u05E6\u05D5\u05DC \u05E7\u05E8\u05DF \u05D4\u05D4\u05E9\u05EA\u05DC\u05DE\u05D5\u05EA: ${(_e = profile.score) != null ? _e : 0}/100`,
      "\u05D0\u05E9\u05DE\u05D7 \u05E9\u05EA\u05D1\u05D3\u05D5\u05E7 \u05D0\u05D9\u05EA\u05D9 \u05D0\u05DD \u05D4\u05EA\u05D5\u05E6\u05D0\u05D4 \u05DE\u05EA\u05D0\u05D9\u05DE\u05D4 \u05DC\u05DE\u05E6\u05D1 \u05E9\u05DC\u05D9."
    ].join("\n");
  }
  function buildWhatsAppUrl(result, profile) {
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(buildWhatsAppMessage(result, profile))}`;
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
  var $ = (selector) => document.querySelector(selector);
  var form = $("#consumer-form");
  var steps = [...document.querySelectorAll(".step")];
  var step = 0;
  var lastProfile;
  var lastResult;
  var money2 = (value) => new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(Math.round(value));
  function showStep(next) {
    var _a;
    step = Math.max(0, Math.min(next, 4));
    steps.forEach((el, i) => el.hidden = i !== step);
    $("#progress").value = step + 1;
    $("#step-copy").textContent = `\u05E9\u05DC\u05D1 ${step + 1} \u05DE\u05EA\u05D5\u05DA 5`;
    $("#form-error").textContent = "";
    (_a = steps[step].querySelector("input")) == null ? void 0 : _a.focus();
  }
  function valid() {
    const required = steps[step].querySelectorAll("[required]");
    for (const field of required) {
      if (field.type === "radio" && !form.querySelector(`[name="${field.name}"]:checked`)) return false;
      if (field.type !== "radio" && (!Number.isFinite(normalizeMoney(field.value)) || field.name === "income" && normalizeMoney(field.value) <= 0)) return false;
    }
    return true;
  }
  function depositFields() {
    const method = form.elements.depositMethod.value;
    $("#lump-fields").hidden = !["lump", "both"].includes(method);
    $("#monthly-fields").hidden = !["monthly", "both"].includes(method);
  }
  $("#start").addEventListener("click", () => showStep(0));
  form.addEventListener("change", (e) => {
    if (e.target.name === "depositMethod") depositFields();
  });
  form.addEventListener("click", (e) => {
    const amount = e.target.dataset.amount;
    if (amount) {
      $("#income").value = Number(amount).toLocaleString("he-IL");
      return;
    }
    if (e.target.closest("[data-back]")) showStep(step - 1);
    if (e.target.closest("[data-next]")) {
      if (!valid()) {
        $("#form-error").textContent = "\u05DB\u05D3\u05D9 \u05DC\u05D4\u05DE\u05E9\u05D9\u05DA, \u05D9\u05E9 \u05DC\u05D1\u05D7\u05D5\u05E8 \u05EA\u05E9\u05D5\u05D1\u05D4 \u05D0\u05D5 \u05DC\u05D4\u05D6\u05D9\u05DF \u05E1\u05DB\u05D5\u05DD \u05EA\u05E7\u05D9\u05DF.";
        return;
      }
      showStep(step + 1);
    }
  });
  function collect(years = 10) {
    const data = new FormData(form);
    const method = data.get("depositMethod");
    return { input: { income: data.get("income"), lumpSum: ["lump", "both"].includes(method) ? data.get("lumpSum") : 0, monthlyDeposit: ["monthly", "both"].includes(method) ? data.get("monthlyDeposit") : 0, monthsDeposited: ["monthly", "both"].includes(method) ? data.get("monthsDeposited") : 0, projectionYears: years }, profile: { depositMethod: method, fundStatus: data.get("fundStatus"), completionPreference: data.get("completionPreference"), goal: data.get("goal") } };
  }
  function renderScenarios(result) {
    $("#scenario-list").innerHTML = result.projections.map((x) => `<li><span>${x.label} \xB7 ${x.annualRate * 100}%</span><strong>${money2(x.nominalValue)}</strong></li>`).join("");
  }
  function render(result, profile) {
    lastResult = result;
    lastProfile = profile;
    profile.hasMonthlyPlan = ["monthly", "both"].includes(profile.depositMethod);
    profile.score = calculateUtilizationScore({ deposited: result.deposited, ceiling: result.ceiling, hasMonthlyPlan: profile.hasMonthlyPlan, fundStatus: profile.fundStatus, completionPreference: profile.completionPreference });
    let headline = "\u05E0\u05E8\u05D0\u05D4 \u05E9\u05E0\u05E9\u05D0\u05E8\u05D5 \u05DC\u05DA \u05E2\u05D5\u05D3", detail = "\u05E9\u05E0\u05D9\u05EA\u05DF \u05DC\u05E9\u05E7\u05D5\u05DC \u05DC\u05D4\u05E4\u05E7\u05D9\u05D3 \u05D4\u05E9\u05E0\u05D4 \u05E2\u05D3 \u05DC\u05EA\u05E7\u05E8\u05D4 \u05D4\u05DE\u05D5\u05D8\u05D1\u05EA.";
    if (result.overCeiling) {
      headline = "\u05D4\u05E4\u05E7\u05D3\u05EA \u05DE\u05E2\u05DC \u05D4\u05EA\u05E7\u05E8\u05D4 \u05D4\u05DE\u05D5\u05D8\u05D1\u05EA \u05D4\u05E9\u05E0\u05D4";
      detail = "\u05D7\u05DC\u05E7 \u05DE\u05D4\u05D4\u05E4\u05E7\u05D3\u05D4 \u05DC\u05D0 \u05E6\u05E4\u05D5\u05D9 \u05DC\u05D9\u05D4\u05E0\u05D5\u05EA \u05DE\u05D4\u05E4\u05D8\u05D5\u05E8 \u05E2\u05DC \u05D4\u05E8\u05D5\u05D5\u05D7\u05D9\u05DD.";
    } else if (result.remaining === 0) {
      headline = "\u05E0\u05E8\u05D0\u05D4 \u05E9\u05DB\u05D1\u05E8 \u05E0\u05D9\u05E6\u05DC\u05EA \u05D0\u05EA \u05DE\u05DC\u05D5\u05D0 \u05D4\u05EA\u05E7\u05E8\u05D4 \u05D4\u05DE\u05D5\u05D8\u05D1\u05EA \u05D4\u05E9\u05E0\u05D4.";
      detail = "\u05D0\u05E4\u05E9\u05E8 \u05DC\u05D4\u05EA\u05DB\u05D5\u05E0\u05DF \u05DC\u05D4\u05E4\u05E7\u05D3\u05D5\u05EA \u05E9\u05DC \u05D4\u05E9\u05E0\u05D4 \u05D4\u05D1\u05D0\u05D4.";
    }
    $("#headline").textContent = headline;
    $("#headline-detail").textContent = detail;
    countUp($("#hero-remaining"), result.overCeiling || result.remaining, money2);
    countUp($("#remaining"), result.remaining, money2);
    countUp($("#tax-benefit"), result.estimatedAdditionalTaxBenefit, money2);
    countUp($("#monthly"), result.suggestedMonthly, (v) => `${money2(v)} \u05D1\u05D7\u05D5\u05D3\u05E9`);
    countUp($("#score"), profile.score, (v) => Math.round(v));
    $("#total-tax-benefit").textContent = `\u05E1\u05DA \u05D4\u05D8\u05D1\u05EA \u05D4\u05DE\u05E1 \u05D4\u05DE\u05E9\u05D5\u05E2\u05E8\u05EA \u05E2\u05DC \u05D4\u05D4\u05E4\u05E7\u05D3\u05D5\u05EA \u05D4\u05DE\u05D6\u05DB\u05D5\u05EA \u05D4\u05E9\u05E0\u05D4: ${money2(result.estimatedTotalTaxBenefit)}`;
    $("#recommendation").textContent = buildRecommendation(result, profile);
    $("#dynamic-cta").textContent = buildCta(result, profile);
    $("#whatsapp").href = buildWhatsAppUrl(result, profile);
    renderScenarios(result);
    $("#calculation-details").innerHTML = `<p>\u05EA\u05E7\u05E8\u05EA \u05D4\u05E4\u05E7\u05D3\u05D4 \u05DE\u05D5\u05D8\u05D1\u05EA \u05DC\u05BE2026: ${money2(result.ceiling)}</p><p>\u05D4\u05DB\u05E0\u05E1\u05D4 \u05E9\u05D4\u05D5\u05D6\u05E0\u05D4: ${money2(result.income)} \xB7 \u05D4\u05E4\u05E7\u05D3\u05D5\u05EA: ${money2(result.deposited)}</p><p>\u05DE\u05D3\u05E8\u05D2\u05EA \u05DE\u05E1 \u05DE\u05E9\u05D5\u05E2\u05E8\u05EA: ${result.taxRate * 100}% \xB7 \u05E9\u05D9\u05E2\u05D5\u05E8 \u05E0\u05D9\u05DB\u05D5\u05D9: ${result.deductibleRate * 100}%</p><p>\u05DE\u05E7\u05D5\u05E8: \u05E1\u05E4\u05E8 \u05D4\u05E0\u05D9\u05DB\u05D5\u05D9\u05D9\u05DD 2026 \u05DB\u05E4\u05D9 \u05E9\u05EA\u05D5\u05E2\u05D3 \u05D1\u05D0\u05EA\u05E8 \u05D4\u05DE\u05E7\u05E6\u05D5\u05E2\u05D9. \u05D0\u05D9\u05DE\u05D5\u05EA: 15.07.2026. \u05DE\u05D3\u05E8\u05D2\u05D5\u05EA \u05D4\u05DE\u05E1 \u05D5\u05E9\u05D9\u05E2\u05D5\u05E8 \u05D4\u05E0\u05D9\u05DB\u05D5\u05D9 \u05D4\u05DD \u05D0\u05D5\u05DE\u05D3\u05DF \u05D4\u05D3\u05D5\u05E8\u05E9 \u05D0\u05D9\u05DE\u05D5\u05EA.</p>`;
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!valid()) return;
    try {
      const { input, profile } = collect();
      const result = calculateConsumerResult(input);
      form.hidden = true;
      $("#loading").hidden = false;
      const messages = ["\u05D1\u05D5\u05D3\u05E7 \u05D0\u05EA \u05D4\u05D4\u05E4\u05E7\u05D3\u05D5\u05EA \u05E9\u05D1\u05D5\u05E6\u05E2\u05D5", "\u05DE\u05D7\u05E9\u05D1 \u05D0\u05EA \u05D4\u05D9\u05EA\u05E8\u05D4 \u05DC\u05E0\u05D9\u05E6\u05D5\u05DC", "\u05D1\u05D5\u05E0\u05D4 \u05EA\u05E8\u05D7\u05D9\u05E9\u05D9 \u05E6\u05DE\u05D9\u05D7\u05D4"];
      let i = 0;
      const timer = setInterval(() => {
        $("#loading-copy").textContent = messages[++i % messages.length];
      }, 250);
      setTimeout(() => {
        clearInterval(timer);
        $("#loading").hidden = true;
        render(result, profile);
        $("#results").hidden = false;
        $("#results").focus();
      }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 850);
    } catch (e2) {
      $("#form-error").textContent = "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05E0\u05D5 \u05DC\u05D7\u05E9\u05D1. \u05D1\u05D3\u05E7\u05D5 \u05E9\u05D4\u05E1\u05DB\u05D5\u05DE\u05D9\u05DD \u05EA\u05E7\u05D9\u05E0\u05D9\u05DD \u05D5\u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1.";
    }
  });
  $("#projection-years").addEventListener("change", (e) => {
    if (!lastProfile) return;
    const { input } = collect(Number(e.target.value));
    lastResult = calculateConsumerResult(input);
    renderScenarios(lastResult);
  });
  $("#restart").addEventListener("click", () => location.reload());
})();
