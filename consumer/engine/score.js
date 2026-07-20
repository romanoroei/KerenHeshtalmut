export function calculateUtilizationScore({ deposited, ceiling, hasMonthlyPlan, fundStatus, completionPreference }) {
  const values = [deposited, ceiling];
  if (!values.every(Number.isFinite) || deposited < 0 || ceiling <= 0) throw new TypeError('Invalid score input');
  const utilization = Math.min(deposited / ceiling, 1) * 60;
  const monthly = hasMonthlyPlan ? 20 : 0;
  const knowsFund = fundStatus && fundStatus !== 'unknown' ? 10 : 0;
  const clearCompletion = completionPreference && completionPreference !== 'unknown' ? 10 : 0;
  return Math.min(100, Math.round(utilization + monthly + knowsFund + clearCompletion));
}
