import test from 'node:test';
import assert from 'node:assert/strict';
import { getConsentStatus, setConsentStatus, canUseAnalytics } from '../analytics/consent.js';
import { readAttribution, sanitizeAttributionValue, attributionEventParameters, saveInitialAttribution, getAttribution, referrerDisplayName } from '../analytics/attribution.js';
import { PENDING_EVENTS_KEY, clearPendingAnalyticsEvents, flushPendingAnalyticsEvents, queueAnalyticsEvent, sanitizeEventParameters, trackEvent, trackOnce } from '../analytics/tracking.js';
import { buildShareMessage, buildWhatsAppMessage } from '../messages/whatsapp.js';

const storage = () => { const data = new Map(); return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: (k) => data.delete(k) }; };

test('consent defaults to unknown and distinguishes accepted from essential only', () => {
  const store = storage();
  assert.equal(getConsentStatus(store), 'unknown');
  setConsentStatus('essential_only', store); assert.equal(canUseAnalytics(store), false);
  setConsentStatus('accepted', store); assert.equal(canUseAnalytics(store), true);
});

test('trackEvent is safe without GA4 and strips financial parameters', () => {
  assert.doesNotThrow(() => trackEvent('calculator_started'));
  assert.deepEqual(sanitizeEventParameters({ income: 100000, deposit_amount: 5, step_number: 2, fund_status: 'existing' }), { step_number: 2, fund_status: 'existing' });
});

test('trackOnce does not mark an event before analytics consent', () => {
  const store = storage();
  globalThis.localStorage = storage();
  assert.equal(trackOnce('landing_view', { page_type: 'consumer_landing' }, store), false);
  assert.equal(store.getItem('consumer_event_landing_view'), null);
});

test('pending analytics queues safe events once and clears for essential-only', () => {
  const store = storage();
  globalThis.localStorage = storage();
  assert.equal(queueAnalyticsEvent('landing_view', { source: 'whatsapp', income: 250000 }, store), true);
  assert.equal(queueAnalyticsEvent('landing_view', { source: 'whatsapp' }, store), false);
  assert.equal(queueAnalyticsEvent('whatsapp_clicked', {}, store), false);
  const pending = JSON.parse(store.getItem(PENDING_EVENTS_KEY));
  assert.deepEqual(pending, [{ eventName: 'landing_view', parameters: { source: 'whatsapp' } }]);
  clearPendingAnalyticsEvents(store);
  assert.equal(store.getItem(PENDING_EVENTS_KEY), null);
  setConsentStatus('essential_only', globalThis.localStorage);
  assert.equal(queueAnalyticsEvent('calculator_started', { source: 'direct' }, store), false);
  assert.equal(store.getItem(PENDING_EVENTS_KEY), null);
});

test('late consent flushes landing and calculator start exactly once', async () => {
  const consentStore = storage(); const sessionStore = storage();
  globalThis.localStorage = consentStore; globalThis.sessionStorage = sessionStore;
  queueAnalyticsEvent('landing_view', { page_type: 'consumer_landing', source: 'whatsapp' }, sessionStore);
  queueAnalyticsEvent('calculator_started', { source: 'whatsapp' }, sessionStore);
  setConsentStatus('accepted', consentStore);
  const scripts = [];
  const documentRef = { head: { append(script) { scripts.push(script); queueMicrotask(() => script.onload()); } }, createElement() { return {}; } };
  globalThis.dataLayer = []; delete globalThis.gtag;
  assert.equal(await flushPendingAnalyticsEvents({ storage: sessionStore, documentRef }), true);
  assert.equal(sessionStore.getItem(PENDING_EVENTS_KEY), null);
  assert.equal(sessionStore.getItem('consumer_event_landing_view'), '1');
  assert.equal(sessionStore.getItem('consumer_event_calculator_started'), '1');
  const eventNames = globalThis.dataLayer.filter((args) => args[0] === 'event').map((args) => args[1]);
  assert.deepEqual(eventNames, ['landing_view', 'calculator_started']);
  await flushPendingAnalyticsEvents({ storage: sessionStore, documentRef });
  assert.deepEqual(globalThis.dataLayer.filter((args) => args[0] === 'event').map((args) => args[1]), eventNames);
  assert.equal(scripts.length, 1);
});

test('attribution reads UTM and ref, sanitizes and limits values', () => {
  const result = readAttribution('https://site.test/?utm_source=whatsapp&utm_medium=organic&utm_campaign=launch-2026&utm_content=status-1&utm_term=fund&ref=accountant-test<script>');
  assert.equal(result.source, 'whatsapp'); assert.equal(result.medium, 'organic'); assert.equal(result.referrerCode, 'accountant-testscript');
  assert.equal(result.campaign, 'launch-2026'); assert.equal(result.content, 'status-1'); assert.equal(result.term, 'fund');
  assert.equal(sanitizeAttributionValue('x'.repeat(200)).length, 80);
  assert.equal(readAttribution('https://site.test/').source, 'direct');
});

test('initial attribution persists across landing and check pages', () => {
  const store = storage();
  const initial = saveInitialAttribution({ storage: store, url: 'https://site.test/consumer/?utm_source=tiktok&utm_campaign=launch-2026&ref=creator-1' });
  const next = saveInitialAttribution({ storage: store, url: 'https://site.test/consumer/check.html' });
  assert.deepEqual(next, initial);
  assert.deepEqual(getAttribution(store), initial);
  assert.deepEqual(attributionEventParameters(initial), { source: 'tiktok', medium: 'organic', campaign: 'launch-2026', content: '', term: '', referrer_code: 'creator-1' });
});

test('real UTM replaces only a stored direct default and remains first-touch afterwards', () => {
  const store = storage();
  saveInitialAttribution({ storage: store, url: 'https://site.test/consumer/check.html' });
  const campaign = saveInitialAttribution({ storage: store, url: 'https://site.test/consumer/?utm_source=accountant&utm_medium=referral&utm_campaign=partners-2026&utm_content=personal&ref=roynetanel' });
  assert.deepEqual(campaign, { source: 'accountant', medium: 'referral', campaign: 'partners-2026', content: 'personal', referrerCode: 'roynetanel' });
  assert.deepEqual(saveInitialAttribution({ storage: store, url: 'https://site.test/consumer/check.html' }), campaign);
  assert.deepEqual(saveInitialAttribution({ storage: store, url: 'https://site.test/?utm_source=email&utm_campaign=other' }), campaign);
});

test('WhatsApp keeps campaign codes private and shows only a known referrer name', () => {
  const result = { income: 250000, depositedToDate: 8000, existingBalance: 8000, remaining: 12566, taxYear: 2026 };
  const message = buildWhatsAppMessage(result, { goals: ['tax', 'saving', 'check'], hasExistingBalance: true }, { source: 'accountant', medium: 'referral', campaign: 'partners-2026', content: 'personal', referrerCode: 'roynetanel' });
  assert.match(message, /הכנסה שנתית חייבת משוערת: 250,000 ₪/);
  assert.match(message, /צבירה נוכחית בקרן: 8,000 ₪/);
  assert.match(message, /הפקדה שביצעתי השנה: 8,000 ₪/);
  assert.match(message, /סכום מומלץ להפקדה עד סוף 2026: 12,566 ₪/);
  assert.match(message, /לנצל את הטבת המס, להגדיל את החיסכון ולבדוק אם אני בדרך הנכונה\./);
  assert.match(message, /הגעתי לבדיקה דרך רועי נתנאל\./);
  assert.equal(referrerDisplayName('roynetanel'), 'רועי נתנאל');
  assert.doesNotMatch(message, /accountant|referral|partners-2026|personal|roynetanel|מקור ההגעה|קוד מפנה|שווי הטבות המס|הוראת קבע|לשקול/);
  const share = buildShareMessage('https://example.test/');
  assert.doesNotMatch(share, /250,000|2,500|8,000|הכנסה שנתית/); assert.match(share, /ללא הרשמה וללא התחייבות/);
});

test('WhatsApp omits zero, missing and unknown-referrer details', () => {
  const message = buildWhatsAppMessage({ income: 180000, depositedToDate: 0, existingBalance: 0, remaining: 20566, taxYear: 2026 }, { goals: ['tax'], hasExistingBalance: false }, { source: 'direct', medium: 'none', referrerCode: 'unknown-code' });
  assert.doesNotMatch(message, /צבירה נוכחית|הפקדה שביצעתי|הגעתי לבדיקה דרך|unknown-code|: 0 ₪/);
  const full = buildWhatsAppMessage({ income: 250000, depositedToDate: 20566, existingBalance: 80000, remaining: 0, taxYear: 2026 }, { goals: ['check'], hasExistingBalance: true }, {});
  assert.match(full, /ניצלתי את מלוא תקרת ההפקדה המוטבת לשנת 2026\./);
  assert.doesNotMatch(full, /סכום מומלץ.*0 ₪/);
});
