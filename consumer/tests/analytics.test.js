import test from 'node:test';
import assert from 'node:assert/strict';
import { getConsentStatus, setConsentStatus, canUseAnalytics } from '../analytics/consent.js';
import { readAttribution, sanitizeAttributionValue, attributionLabel } from '../analytics/attribution.js';
import { sanitizeEventParameters, trackEvent } from '../analytics/tracking.js';
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

test('attribution reads UTM and ref, sanitizes and limits values', () => {
  const result = readAttribution('https://site.test/?utm_source=whatsapp&utm_medium=organic&ref=accountant-test<script>');
  assert.equal(result.source, 'whatsapp'); assert.equal(result.medium, 'organic'); assert.equal(result.referrerCode, 'accountant-testscript');
  assert.equal(sanitizeAttributionValue('x'.repeat(200)).length, 80);
  assert.equal(readAttribution('https://site.test/').source, 'direct');
});

test('WhatsApp includes general attribution while sharing excludes personal data', () => {
  const result = { income: 250000, currentLumpSumDeposit: 1000, currentMonthlyDeposit: 500, existingBalance: 100000, remaining: 2500, taxYear: 2026, estimatedCombinedBenefitTotal: 8000 };
  const message = buildWhatsAppMessage(result, { goals: ['tax'] }, { source: 'whatsapp', referrerCode: 'accountant-test' });
  assert.match(message, /מקור ההגעה: רואה חשבון/); assert.match(message, /קוד מפנה: accountant-test/); assert.equal(attributionLabel({ referrerCode: 'accountant-test' }), 'רואה חשבון');
  const share = buildShareMessage('https://example.test/');
  assert.doesNotMatch(share, /250,000|2,500|8,000|הכנסה שנתית/); assert.match(share, /ללא הרשמה וללא התחייבות/);
});
