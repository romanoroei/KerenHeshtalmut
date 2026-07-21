import { SITE_CONFIG } from '../config.js';
import { canUseAnalytics, getConsentStatus } from './consent.js';

const FORBIDDEN_KEYS = /income|amount|deposit|balance|phone|whatsapp.*(?:message|content)|message|content_text/i;
const PENDING_EVENTS_KEY = 'consumer_pending_analytics_events';
const QUEUEABLE_EVENTS = new Set(['landing_view', 'calculator_started']);
let gaLoadingPromise;
let flushPromise;

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
  } catch { /* Event can still be sent without deduplication storage. */ }
  const sent = trackEvent(eventName, parameters);
  if (sent) {
    try { storage?.setItem(key, '1'); } catch { /* Event was sent; storage is optional. */ }
  }
  return sent;
}

function readPendingEvents(storage = globalThis.sessionStorage) {
  try {
    const pending = JSON.parse(storage?.getItem(PENDING_EVENTS_KEY) || '[]');
    return Array.isArray(pending) ? pending.filter((item) => QUEUEABLE_EVENTS.has(item?.eventName)) : [];
  } catch { return []; }
}

export function queueAnalyticsEvent(eventName, parameters = {}, storage = globalThis.sessionStorage) {
  if (!QUEUEABLE_EVENTS.has(eventName) || getConsentStatus() !== 'unknown') return false;
  const eventKey = `consumer_event_${eventName}`;
  try {
    if (storage?.getItem(eventKey)) return false;
    const pending = readPendingEvents(storage);
    if (pending.some((item) => item.eventName === eventName)) return false;
    pending.push({ eventName, parameters: sanitizeEventParameters(parameters) });
    storage?.setItem(PENDING_EVENTS_KEY, JSON.stringify(pending));
    return true;
  } catch { return false; }
}

export function clearPendingAnalyticsEvents(storage = globalThis.sessionStorage) {
  try { storage?.removeItem(PENDING_EVENTS_KEY); } catch { /* Storage is optional. */ }
}

export function trackOnceOrQueue(eventName, parameters = {}, storage = globalThis.sessionStorage) {
  return canUseAnalytics() ? trackOnce(eventName, parameters, storage) : queueAnalyticsEvent(eventName, parameters, storage);
}

export function flushPendingAnalyticsEvents({ storage = globalThis.sessionStorage, documentRef = globalThis.document } = {}) {
  if (!canUseAnalytics()) return Promise.resolve(false);
  if (flushPromise) return flushPromise;
  flushPromise = (async () => {
    const loaded = await loadAnalytics({ documentRef });
    if (!loaded) return false;
    const pending = readPendingEvents(storage);
    const unsent = pending.filter(({ eventName, parameters }) => {
      try { if (storage?.getItem(`consumer_event_${eventName}`)) return false; } catch { /* Continue without storage. */ }
      return !trackOnce(eventName, parameters, storage);
    });
    try {
      if (unsent.length) storage?.setItem(PENDING_EVENTS_KEY, JSON.stringify(unsent));
      else storage?.removeItem(PENDING_EVENTS_KEY);
    } catch { /* Storage is optional. */ }
    return unsent.length === 0;
  })().finally(() => { flushPromise = undefined; });
  return flushPromise;
}

export { PENDING_EVENTS_KEY };
