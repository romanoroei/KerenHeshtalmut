import { SITE_CONFIG } from '../config.js';

export const MAX_LINK_VALUE_LENGTH = 80;

export function sanitizeLinkValue(value, maxLength = MAX_LINK_VALUE_LENGTH) {
  return String(value ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
    .slice(0, maxLength);
}

export function buildMarketingUrl(values = {}, baseUrl = SITE_CONFIG.publicBaseUrl) {
  const url = new URL(baseUrl);
  const mapping = {
    source: 'utm_source', medium: 'utm_medium', campaign: 'utm_campaign',
    content: 'utm_content', term: 'utm_term', ref: 'ref',
  };
  for (const [field, parameter] of Object.entries(mapping)) {
    const value = sanitizeLinkValue(values[field]);
    if (value) url.searchParams.set(parameter, value);
  }
  return url.toString();
}

export const LINK_TEMPLATES = Object.freeze({
  whatsapp_status: { source: 'whatsapp', medium: 'organic', campaign: 'launch-2026', content: 'status-1' },
  whatsapp_personal: { source: 'whatsapp', medium: 'organic', campaign: 'launch-2026', content: 'personal-message' },
  tiktok: { source: 'tiktok', medium: 'organic', campaign: 'launch-2026', content: 'video-1' },
  meta_paid: { source: 'meta', medium: 'paid_social', campaign: 'independent-fund-2026', content: 'ad-video-1' },
  google_ads: { source: 'google', medium: 'cpc', campaign: 'hishtalmut-independent', content: 'search-ad-1' },
  accountant: { source: 'accountant', medium: 'referral', campaign: 'partners-2026', ref: 'accountant-name' },
  bookkeeper: { source: 'bookkeeper', medium: 'referral', campaign: 'partners-2026', ref: 'bookkeeper-name' },
});

export function summarizeLink(values = {}) {
  return ['source', 'medium', 'campaign', 'content', 'term', 'ref']
    .map((key) => [key, sanitizeLinkValue(values[key])])
    .filter(([, value]) => value);
}

if (globalThis.document) {
  const form = document.getElementById('link-builder-form');
  const output = document.getElementById('generated-url');
  const feedback = document.getElementById('link-feedback');
  const summary = document.getElementById('link-summary');
  const openLink = document.getElementById('open-link');
  const readValues = () => Object.fromEntries(new FormData(form));
  const render = () => {
    const values = readValues();
    const url = buildMarketingUrl(values);
    output.value = url;
    openLink.href = url;
    summary.replaceChildren(...summarizeLink(values).map(([key, value]) => {
      const item = document.createElement('li');
      item.textContent = `${key}: ${value}`;
      return item;
    }));
    feedback.textContent = 'הקישור מוכן.';
  };
  form.addEventListener('submit', (event) => { event.preventDefault(); render(); });
  form.addEventListener('input', (event) => {
    if (event.target.matches('input')) event.target.value = sanitizeLinkValue(event.target.value);
  });
  document.getElementById('copy-link').addEventListener('click', async () => {
    if (!output.value) render();
    try { await navigator.clipboard.writeText(output.value); feedback.textContent = 'הקישור הועתק.'; }
    catch { feedback.textContent = 'לא הצלחנו להעתיק. אפשר לסמן ולהעתיק ידנית.'; }
  });
  document.querySelectorAll('[data-template]').forEach((button) => button.addEventListener('click', () => {
    const template = LINK_TEMPLATES[button.dataset.template];
    for (const [key, value] of Object.entries(template)) form.elements[key].value = value;
    render();
  }));
  render();
}
