const ATTRIBUTION_KEY = 'consumer_attribution';
const MAX_VALUE_LENGTH = 80;
const PARAMETER_MAP = {
  utm_source: 'source', utm_medium: 'medium', utm_campaign: 'campaign',
  utm_content: 'content', utm_term: 'term', ref: 'referrerCode',
};

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
    if (existing) return JSON.parse(existing);
    const attribution = readAttribution(url, referrer);
    storage?.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
    return attribution;
  } catch { return readAttribution(url, referrer); }
}

export function getAttribution(storage = globalThis.sessionStorage) {
  try { return JSON.parse(storage?.getItem(ATTRIBUTION_KEY) || 'null') || saveInitialAttribution({ storage }); }
  catch { return readAttribution(); }
}

export function attributionLabel(attribution = {}) {
  const labels = { whatsapp: 'WhatsApp', tiktok: 'TikTok', facebook: 'Facebook', accountant: 'רואה חשבון', direct: 'ישיר', google: 'Google', referral: 'אתר מפנה' };
  if (attribution.referrerCode?.toLowerCase().includes('accountant')) return 'רואה חשבון';
  return labels[String(attribution.source || '').toLowerCase()] || sanitizeAttributionValue(attribution.source) || 'ישיר';
}

export { ATTRIBUTION_KEY, MAX_VALUE_LENGTH };
