import { attributionEventParameters, getAttribution, saveInitialAttribution } from './attribution.js';
import { getConsentStatus, setConsentStatus } from './consent.js';
import { clearPendingAnalyticsEvents, flushPendingAnalyticsEvents, loadAnalytics, trackOnce, trackOnceOrQueue } from './tracking.js';

const notice = document.getElementById('cookieNotice');
const showConsent = () => notice?.classList.toggle('is-visible', getConsentStatus() === 'unknown');
const choose = async (status) => {
  setConsentStatus(status);
  showConsent();
  if (status === 'accepted') {
    await loadAnalytics();
    await flushPendingAnalyticsEvents();
  } else clearPendingAnalyticsEvents();
};

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
trackOnceOrQueue('landing_view', {
  page_type: location.pathname.endsWith('check.html') ? 'consumer_check' : 'consumer_landing',
  ...attributionEventParameters(attribution),
});
document.querySelector('.btn-landing')?.addEventListener('click', () => trackOnceOrQueue('calculator_started', attributionEventParameters(attribution)));
document.querySelectorAll('[data-professional-link]').forEach((link) => link.addEventListener('click', () => trackOnce('professional_calculator_clicked')));
document.querySelectorAll('.legal-card').forEach((details) => details.addEventListener('toggle', () => {
  if (details.open) trackOnce(`details_${details.id || 'disclaimer'}`, { details_type: details.id || 'disclaimer' });
}));
document.querySelectorAll('a[href="#disclaimer"]').forEach((link) => link.addEventListener('click', () => {
  trackOnce('details_disclaimer', { details_type: 'disclaimer' });
}));
