/**
 * Safely format an external URL to ensure it includes the https:// protocol
 */
export function formatExternalUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^(?:https?|mailto|tel|sms):/i.test(trimmed) || trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
