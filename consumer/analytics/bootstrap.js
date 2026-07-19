import { getAttribution, saveInitialAttribution } from './attribution.js';
import { getConsentStatus, setConsentStatus } from './consent.js';
import { loadAnalytics, trackOnce } from './tracking.js';

const notice = document.getElementById('cookieNotice');
const showConsent = () => notice?.classList.toggle('is-visible', getConsentStatus() === 'unknown');
const choose = (status) => { setConsentStatus(status); showConsent(); if (status === 'accepted') loadAnalytics(); };

saveInitialAttribution();
showConsent();
if (getConsentStatus() === 'accepted') loadAnalytics();
document.getElementById('acceptCookies')?.addEventListener('click', () => choose('accepted'));
document.getElementById('essentialCookies')?.addEventListener('click', () => choose('essential_only'));
document.querySelectorAll('[data-cookie-settings]').forEach((button) => button.addEventListener('click', () => {
  try { localStorage.removeItem('consumer_analytics_consent'); } catch { /* Ignore unavailable storage. */ }
  showConsent();
  notice?.focus();
}));

const attribution = getAttribution();
trackOnce('landing_view', {
  page_type: location.pathname.endsWith('check.html') ? 'consumer_check' : 'consumer_landing',
  source: attribution.source, medium: attribution.medium, campaign: attribution.campaign || '',
  referrer_code: attribution.referrerCode || '',
});
document.querySelector('.btn-landing')?.addEventListener('click', () => trackOnce('calculator_started', { entry_source: attribution.source, referrer_code: attribution.referrerCode || '' }));
document.querySelectorAll('[data-professional-link]').forEach((link) => link.addEventListener('click', () => trackOnce('professional_calculator_clicked')));
document.querySelectorAll('.legal-card').forEach((details) => details.addEventListener('toggle', () => {
  if (details.open) trackOnce(`details_${details.id || 'disclaimer'}`, { details_type: details.id || 'disclaimer' });
}));
document.querySelectorAll('a[href="#disclaimer"]').forEach((link) => link.addEventListener('click', () => {
  trackOnce('details_disclaimer', { details_type: 'disclaimer' });
}));
