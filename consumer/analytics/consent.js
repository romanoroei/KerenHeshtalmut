const CONSENT_KEY = 'consumer_analytics_consent';
const VALID_STATUSES = new Set(['accepted', 'essential_only']);

export function getConsentStatus(storage = globalThis.localStorage) {
  try {
    const value = storage?.getItem(CONSENT_KEY);
    return VALID_STATUSES.has(value) ? value : 'unknown';
  } catch {
    return 'unknown';
  }
}

export function setConsentStatus(status, storage = globalThis.localStorage) {
  if (!VALID_STATUSES.has(status)) throw new TypeError('Invalid consent status');
  try { storage?.setItem(CONSENT_KEY, status); } catch { /* The site remains usable. */ }
  globalThis.dispatchEvent?.(new CustomEvent('consumer-consent-changed', { detail: { status } }));
  return status;
}

export function canUseAnalytics(storage = globalThis.localStorage) {
  return getConsentStatus(storage) === 'accepted';
}

export { CONSENT_KEY };
