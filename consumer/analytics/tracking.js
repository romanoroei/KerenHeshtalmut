import { SITE_CONFIG } from '../config.js';
import { canUseAnalytics } from './consent.js';

const FORBIDDEN_KEYS = /income|amount|deposit|balance|phone|whatsapp.*(?:message|content)|message|content_text/i;
let gaLoadingPromise;

export function sanitizeEventParameters(parameters = {}) {
  return Object.fromEntries(Object.entries(parameters).filter(([key, value]) => !FORBIDDEN_KEYS.test(key) && ['string', 'number', 'boolean'].includes(typeof value)));
}

export function loadAnalytics({ measurementId = SITE_CONFIG.gaMeasurementId, documentRef = globalThis.document } = {}) {
  if (!measurementId || !canUseAnalytics() || !documentRef) return Promise.resolve(false);
  if (gaLoadingPromise) return gaLoadingPromise;
  globalThis.dataLayer = globalThis.dataLayer || [];
  globalThis.gtag = globalThis.gtag || function gtag() { globalThis.dataLayer.push(arguments); };
  globalThis.gtag('js', new Date());
  globalThis.gtag('config', measurementId, { anonymize_ip: true });
  gaLoadingPromise = new Promise((resolve) => {
    const script = documentRef.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    documentRef.head.append(script);
  });
  return gaLoadingPromise;
}

export function trackEvent(eventName, parameters = {}) {
  const safeParameters = sanitizeEventParameters(parameters);
  if (SITE_CONFIG.analyticsDebug) console.debug('[consumer analytics]', eventName, safeParameters);
  if (!canUseAnalytics() || !SITE_CONFIG.gaMeasurementId) return false;
  loadAnalytics();
  globalThis.gtag?.('event', eventName, safeParameters);
  return true;
}

export function trackOnce(eventName, parameters = {}, storage = globalThis.sessionStorage) {
  const key = `consumer_event_${eventName}`;
  try {
    if (storage?.getItem(key)) return false;
    storage?.setItem(key, '1');
  } catch { /* Event can still be sent without deduplication storage. */ }
  return trackEvent(eventName, parameters);
}
