import { getConsentStatus, setConsentStatus } from './consumer/analytics/consent.js';
import { loadAnalytics, trackEvent, trackOnce } from './consumer/analytics/tracking.js';

const notice = document.getElementById('cookieNotice');
const arrivedFromConsumer = new URLSearchParams(location.search).get('from') === 'consumer';

function showConsent() {
  notice?.classList.toggle('is-visible', getConsentStatus() === 'unknown');
}

function trackEntry() {
  trackOnce('professional_calculator_view', {
    page_type: 'professional_calculator',
    entry_source: arrivedFromConsumer ? 'consumer_calculator' : 'direct_or_other',
  });
  if (arrivedFromConsumer) {
    trackOnce('professional_arrived_from_consumer', { source_calculator: 'consumer' });
  }
}

function chooseConsent(status) {
  setConsentStatus(status);
  showConsent();
  if (status === 'accepted') {
    loadAnalytics();
    trackEntry();
  }
}

showConsent();
if (getConsentStatus() === 'accepted') {
  loadAnalytics();
  trackEntry();
}

document.getElementById('acceptCookies')?.addEventListener('click', () => chooseConsent('accepted'));
document.getElementById('closeCookies')?.addEventListener('click', () => chooseConsent('essential_only'));

document.getElementById('tabCalcBtn')?.addEventListener('click', () => trackEvent('professional_tool_selected', { tool_type: 'growth' }));
document.getElementById('tabTaxBtn')?.addEventListener('click', () => trackEvent('professional_tool_selected', { tool_type: 'tax_benefits' }));
document.getElementById('btnCalc')?.addEventListener('click', () => trackEvent('professional_calculation_completed', { calculator_type: 'growth' }));
document.getElementById('btnCalcTax')?.addEventListener('click', () => trackEvent('professional_calculation_requested', { calculator_type: 'tax_benefits' }));
document.getElementById('btnToggleTable')?.addEventListener('click', () => trackEvent('professional_results_table_toggled'));
document.getElementById('btnReset')?.addEventListener('click', () => trackEvent('professional_calculator_reset'));
document.getElementById('shareCalculator')?.addEventListener('click', () => trackEvent('professional_calculator_shared'));
document.getElementById('taxShareWhatsApp')?.addEventListener('click', () => trackEvent('professional_whatsapp_lead_clicked', { placement: 'tax_result' }));
document.getElementById('floatingWhatsApp')?.addEventListener('click', () => trackEvent('professional_whatsapp_lead_clicked', { placement: 'floating' }));
document.querySelector('.advisor-card a[href*="wa.me"]')?.addEventListener('click', () => trackEvent('professional_whatsapp_lead_clicked', { placement: 'advisor_card' }));
