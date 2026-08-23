/**
 * Consent and Tracking Utility for PortfolioAI
 * Respects user preferences for Google Analytics (GA4) and Meta Pixel (Facebook Pixel).
 */

const CONSENT_STORAGE_KEY = 'portfolio_ai_cookie_consent';

export const DEFAULT_CONSENT = {
  necessary: true,   // Always required (Session, auth tokens)
  analytics: false,  // Google Analytics
  marketing: false,  // Meta Pixel & Remarketing
  timestamp: null,
  configured: false  // Has user made a choice yet?
};

/**
 * Get current saved consent or default
 */
export function getSavedConsent() {
  try {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Could not read cookie consent from localStorage', e);
  }
  return DEFAULT_CONSENT;
}

/**
 * Save user consent and apply tracking scripts
 */
export function saveConsent(consent) {
  const finalConsent = {
    necessary: true,
    analytics: Boolean(consent.analytics),
    marketing: Boolean(consent.marketing),
    timestamp: new Date().toISOString(),
    configured: true
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(finalConsent));
  } catch (e) {
    console.warn('Could not write cookie consent to localStorage', e);
  }

  // Dispatch event so other components know consent changed
  window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: finalConsent }));

  // Apply tracking scripts according to consent
  applyTracking(finalConsent);

  return finalConsent;
}

/**
 * Conditionally load and configure Google Analytics and Meta Pixel
 */
export function applyTracking(consent = getSavedConsent()) {
  if (typeof window === 'undefined') return;

  // 1. Google Analytics (GA4)
  if (consent.analytics) {
    enableGoogleAnalytics();
  } else {
    disableGoogleAnalytics();
  }

  // 2. Meta Pixel (Facebook Pixel)
  if (consent.marketing) {
    enableMetaPixel();
  } else {
    disableMetaPixel();
  }
}

/**
 * Initialize Google Analytics (GA4)
 */
function enableGoogleAnalytics() {
  const GA_ID = window.__GA_MEASUREMENT_ID__ || 'G-PORTFOLIOAI01'; // Can be set via env or window

  if (window[`ga-disable-${GA_ID}`]) {
    window[`ga-disable-${GA_ID}`] = false;
  }

  if (!document.getElementById('ga-script')) {
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }
}

/**
 * Disable Google Analytics
 */
function disableGoogleAnalytics() {
  const GA_ID = window.__GA_MEASUREMENT_ID__ || 'G-PORTFOLIOAI01';
  window[`ga-disable-${GA_ID}`] = true;
}

/**
 * Initialize Meta Pixel
 */
function enableMetaPixel() {
  const PIXEL_ID = window.__META_PIXEL_ID__ || '123456789012345'; // Can be set via env or window

  if (!document.getElementById('meta-pixel-script')) {
    /* eslint-disable */
    (function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.id='meta-pixel-script';
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)})(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    if (window.fbq) {
      window.fbq('init', PIXEL_ID);
      window.fbq('track', 'PageView');
    }
  }
}

/**
 * Disable Meta Pixel
 */
function disableMetaPixel() {
  if (window.fbq) {
    window.fbq('consent', 'revoke');
  }
}

/**
 * Track custom event with consent verification
 */
export function trackEvent(eventName, params = {}) {
  const consent = getSavedConsent();

  // If analytics is permitted and gtag is available
  if (consent.analytics && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  // If marketing is permitted and fbq is available
  if (consent.marketing && typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, params);
  }
}
