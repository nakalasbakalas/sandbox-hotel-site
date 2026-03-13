/**
 * Google Analytics 4 Integration for @sandbox-hotel/web
 * 
 * To add tracking to your HTML:
 * Include the tracking code in your base template before closing </head> tag
 */

export const GATrackingId = 'G-13776473901';

/**
 * Initialize Google Analytics 4
 */
export function initializeGA4() {
  if (typeof window === 'undefined') return;
  
  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GATrackingId}`;
  document.head.appendChild(script);
  
  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GATrackingId, {
    'anonymize_ip': true,
    'currency': 'USD'
  });
}

/**
 * Track page view
 * @param {string} pagePath - The page path
 * @param {string} pageTitle - The page title
 */
export function trackPageView(pagePath, pageTitle) {
  if (!window.gtag) return;
  window.gtag('config', GATrackingId, {
    'page_path': pagePath,
    'page_title': pageTitle
  });
}

/**
 * Track event
 * @param {string} eventName - Name of the event
 * @param {object} parameters - Event parameters
 */
export function trackEvent(eventName, parameters = {}) {
  if (!window.gtag) return;
  window.gtag('event', eventName, parameters);
}

/**
 * Track book reservation event
 */
export function trackBookReservation(reservationValue, rooms, nights) {
  trackEvent('book_hotel', {
    'value': reservationValue,
    'currency': 'USD',
    'rooms': rooms,
    'nights': nights
  });
}

/**
 * Track form submission
 */
export function trackFormSubmission(formName) {
  trackEvent('form_submission', {
    'form_name': formName
  });
}

/**
 * Track search
 */
export function trackSearch(searchTerm) {
  trackEvent('search', {
    'search_term': searchTerm
  });
}
