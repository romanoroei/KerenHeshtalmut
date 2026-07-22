const ATTRIBUTION_KEY = 'consumer_attribution';
const MAX_VALUE_LENGTH = 80;
const PARAMETER_MAP = {
  utm_source: 'source', utm_medium: 'medium', utm_campaign: 'campaign',
  utm_content: 'content', utm_term: 'term', ref: 'referrerCode',
};
const DEFAULT_ATTRIBUTION_VALUES = new Set(['', 'direct', 'none', 'unknown']);
const REFERRER_DISPLAY_NAMES = Object.freeze({
  roynetanel: 'רועי נתנאל',
});

export function sanitizeAttributionValue(value, maxLength = MAX_VALUE_LENGTH) {
  return String(value ?? '').normalize('NFKC').replace(/[^\p{L}\p{N}_. -]/gu, '').trim().slice(0, maxLength);
}

function generalReferrer(referrer = '') {
  if (!referrer) return 'direct';
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes('whatsapp')) return 'whatsapp';
    if (host.includes('tiktok')) return 'tiktok';
    if (host.includes('facebook') || host.includes('instagram')) return 'facebook';
    if (host.includes('google')) return 'google';
    return 'referral';
  } catch { return 'direct'; }
}

export function readAttribution(url = globalThis.location?.href ?? '', referrer = globalThis.document?.referrer ?? '') {
  let params;
  try { params = new URL(url, 'https://example.invalid').searchParams; } catch { params = new URLSearchParams(); }
  const result = {};
  for (const [parameter, key] of Object.entries(PARAMETER_MAP)) {
    const value = sanitizeAttributionValue(params.get(parameter));
    if (value) result[key] = value;
  }
  if (!result.source) result.source = generalReferrer(referrer);
  if (!result.medium) result.medium = result.source === 'direct' ? 'none' : 'organic';
  return result;
}

export function saveInitialAttribution({ storage = globalThis.sessionStorage, url, referrer } = {}) {
  try {
    const existing = storage?.getItem(ATTRIBUTION_KEY);
    const attribution = readAttribution(url, referrer);
    if (existing) {
      const saved = JSON.parse(existing);
      const hasSavedAttribution = Object.values(saved || {}).some((value) => !DEFAULT_ATTRIBUTION_VALUES.has(String(value || '').toLowerCase()));
      const hasIncomingAttribution = Object.values(attribution).some((value) => !DEFAULT_ATTRIBUTION_VALUES.has(String(value || '').toLowerCase()));
      if (hasSavedAttribution || !hasIncomingAttribution) return saved;
    }
    storage?.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
    return attribution;
  } catch { return readAttribution(url, referrer); }
}

export function referrerDisplayName(referrerCode) {
  return REFERRER_DISPLAY_NAMES[String(referrerCode || '').toLowerCase()] || '';
}

export function getAttribution(storage = globalThis.sessionStorage) {
  try { return JSON.parse(storage?.getItem(ATTRIBUTION_KEY) || 'null') || saveInitialAttribution({ storage }); }
  catch { return readAttribution(); }
}

export function attributionLabel(attribution = {}) {
  const labels = { whatsapp: 'WhatsApp', tiktok: 'TikTok', facebook: 'Facebook', instagram: 'Instagram', meta: 'Meta', accountant: 'רואה חשבון', bookkeeper: 'מנהל/ת חשבונות', email: 'Email', website: 'אתר', direct: 'ישיר', google: 'Google', referral: 'אתר מפנה' };
  return labels[String(attribution.source || '').toLowerCase()] || sanitizeAttributionValue(attribution.source) || 'ישיר';
}

export function attributionEventParameters(attribution = getAttribution()) {
  return {
    source: attribution.source || 'direct',
    medium: attribution.medium || 'none',
    campaign: attribution.campaign || '',
    content: attribution.content || '',
    term: attribution.term || '',
    referrer_code: attribution.referrerCode || '',
  };
}

export { ATTRIBUTION_KEY, MAX_VALUE_LENGTH, REFERRER_DISPLAY_NAMES };
