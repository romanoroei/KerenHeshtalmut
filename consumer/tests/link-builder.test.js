import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMarketingUrl, LINK_TEMPLATES, MAX_LINK_VALUE_LENGTH, sanitizeLinkValue, summarizeLink } from '../admin/link-builder.js';

test('link value sanitizer normalizes spaces, case and unsafe characters', () => {
  assert.equal(sanitizeLinkValue('  Launch Test 2026! <script> '), 'launch-test-2026-script');
  assert.equal(sanitizeLinkValue('javascript:alert(1)'), 'javascriptalert1');
  assert.equal(sanitizeLinkValue('x'.repeat(100)).length, MAX_LINK_VALUE_LENGTH);
  assert.equal(sanitizeLinkValue('שם לקוח'), '');
});

test('marketing URL uses the configured base and URLSearchParams encoding', () => {
  const url = new URL(buildMarketingUrl({ source: 'WhatsApp', medium: 'organic', campaign: 'Launch 2026', content: 'Status 1', term: 'Fund', ref: 'Accountant David' }, 'https://example.test/consumer/'));
  assert.equal(url.origin + url.pathname, 'https://example.test/consumer/');
  assert.deepEqual(Object.fromEntries(url.searchParams), { utm_source: 'whatsapp', utm_medium: 'organic', utm_campaign: 'launch-2026', utm_content: 'status-1', utm_term: 'fund', ref: 'accountant-david' });
});

test('marketing URL omits optional empty parameters and rejects URL injection', () => {
  const url = new URL(buildMarketingUrl({ source: 'https://evil.test/?x=1', medium: 'organic', campaign: 'launch-2026', content: '', ref: '' }, 'https://example.test/consumer/'));
  assert.equal(url.origin, 'https://example.test');
  assert.equal(url.searchParams.get('utm_source'), 'httpseviltestx1');
  assert.equal(url.searchParams.has('utm_content'), false);
  assert.equal(url.searchParams.has('ref'), false);
});

test('all required marketing templates build the expected parameters', () => {
  assert.equal(Object.keys(LINK_TEMPLATES).length, 7);
  for (const [name, template] of Object.entries(LINK_TEMPLATES)) {
    const url = new URL(buildMarketingUrl(template, 'https://example.test/consumer/'));
    assert.equal(url.searchParams.get('utm_source'), template.source, name);
    assert.equal(url.searchParams.get('utm_medium'), template.medium, name);
    assert.equal(url.searchParams.get('utm_campaign'), template.campaign, name);
  }
  assert.equal(LINK_TEMPLATES.whatsapp_status.content, 'status-1');
  assert.equal(LINK_TEMPLATES.whatsapp_personal.content, 'personal-message');
  assert.equal(LINK_TEMPLATES.accountant.ref, 'accountant-name');
  assert.equal(LINK_TEMPLATES.bookkeeper.ref, 'bookkeeper-name');
});

test('link summary contains only non-empty sanitized fields', () => {
  assert.deepEqual(summarizeLink({ source: 'WhatsApp', medium: 'organic', campaign: 'Launch 2026', content: '', ref: 'Partner 1' }), [['source', 'whatsapp'], ['medium', 'organic'], ['campaign', 'launch-2026'], ['ref', 'partner-1']]);
});
