/*
 * Sandbox Hotel GA4 setup
 *
 * Measurement ID:
 * - Default production Measurement ID is set below for the existing
 *   "Sandbox Hotel" GA4 property.
 * - You can still override it by defining window.SBX_GA_MEASUREMENT_ID before
 *   this file loads.
 *
 * Events tracked:
 * - book_now_click
 * - contact_call_click
 * - contact_line_click
 * - contact_whatsapp_click
 * - map_directions_click
 *
 * Selectors used:
 * - Explicit [data-analytics] hooks on booking/contact/map CTAs
 * - form[data-analytics-submit] for the booking form LINE submit path
 * - href fallbacks for tel:, line.me, wa.me, and Google Maps links
 *
 * Verification:
 * - Replace the Measurement ID, open the live site, then use GA4 Realtime or
 *   DebugView while clicking each CTA once.
 *
 * Consent:
 * - If a consent banner is added later, set
 *   window.SBX_ANALYTICS_CONSENT_GRANTED before this file loads, or call
 *   window.SandboxAnalytics.updateConsent(true/false) when consent changes.
 */
(function () {
  if (window.__SBX_ANALYTICS_INITIALIZED__) {
    return;
  }
  window.__SBX_ANALYTICS_INITIALIZED__ = true;

  const PLACEHOLDER_MEASUREMENT_ID = "G-2B2SGREN1Z";
  const MEASUREMENT_ID = String(
    window.SBX_GA_MEASUREMENT_ID || PLACEHOLDER_MEASUREMENT_ID
  ).trim();

  const EVENT_NAMES = {
    "book-now": "book_now_click",
    call: "contact_call_click",
    line: "contact_line_click",
    whatsapp: "contact_whatsapp_click",
    map: "map_directions_click",
  };

  const CLICK_SELECTOR = [
    "[data-analytics]",
    "a[href^='tel:']",
    "a[href*='line.me']",
    "a[href*='wa.me']",
    "a[href*='whatsapp']",
    "a[href*='maps.app.goo.gl']",
    "a[href*='google.com/maps']",
    "a[href='#book']",
  ].join(",");

  const recentInteractions = new WeakMap();
  const consentDefined = typeof window.SBX_ANALYTICS_CONSENT_GRANTED === "boolean";
  let consentGranted = consentDefined ? window.SBX_ANALYTICS_CONSENT_GRANTED : true;
  let consentModeInitialized = consentDefined;
  let analyticsConfigured = false;
  let googleTagInjected = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  if (consentDefined) {
    window.gtag("consent", "default", {
      analytics_storage: consentGranted ? "granted" : "denied",
    });
  }

  function hasRealMeasurementId(id) {
    return /^G-[A-Z0-9]+$/i.test(id) && id.toUpperCase() !== PLACEHOLDER_MEASUREMENT_ID;
  }

  function getGoogleTagUrl() {
    return "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
  }

  function injectGoogleTag() {
    if (googleTagInjected) {
      return;
    }

    const googleTagUrl = getGoogleTagUrl();
    const existingScript = Array.from(document.scripts || []).some(function (script) {
      return script.src === googleTagUrl;
    });

    if (existingScript) {
      googleTagInjected = true;
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = googleTagUrl;
    (document.head || document.documentElement).appendChild(script);
    googleTagInjected = true;
  }

  function ensureAnalyticsConfigured() {
    if (analyticsConfigured) {
      return true;
    }
    if (!hasRealMeasurementId(MEASUREMENT_ID) || !consentGranted) {
      return false;
    }

    injectGoogleTag();
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
      send_page_view: true,
    });
    analyticsConfigured = true;
    return true;
  }

  function normalizeKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  function toAbsoluteUrl(value) {
    if (!value) {
      return "";
    }

    try {
      return new URL(value, window.location.href).href;
    } catch (_error) {
      return String(value);
    }
  }

  function collapseWhitespace(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function slugify(value) {
    return collapseWhitespace(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getTrackingKey(element) {
    if (!element) {
      return "";
    }

    const explicitKey = normalizeKey(element.getAttribute("data-analytics"));
    if (EVENT_NAMES[explicitKey]) {
      return explicitKey;
    }

    const href = normalizeKey(element.getAttribute("href"));
    if (href === "#book" || href.endsWith("#book")) {
      return "book-now";
    }
    if (href.indexOf("tel:") === 0) {
      return "call";
    }
    if (href.indexOf("line.me") !== -1) {
      return "line";
    }
    if (href.indexOf("wa.me") !== -1 || href.indexOf("whatsapp") !== -1) {
      return "whatsapp";
    }
    if (href.indexOf("maps.app.goo.gl") !== -1 || href.indexOf("google.com/maps") !== -1) {
      return "map";
    }

    return "";
  }

  function getSectionName(element) {
    if (!element || !(element instanceof Element)) {
      return "";
    }

    const explicit = element.closest("[data-analytics-section]");
    if (explicit) {
      return explicit.getAttribute("data-analytics-section") || "";
    }

    const section = element.closest("section[id], section[aria-label], header, footer, .sticky, main, body");
    if (!section) {
      return "";
    }
    if (section.classList && section.classList.contains("sticky")) {
      return "sticky";
    }
    if (section.id) {
      return section.id;
    }
    if (section.getAttribute("aria-label")) {
      return slugify(section.getAttribute("aria-label"));
    }

    return section.tagName.toLowerCase();
  }

  function getLinkText(element) {
    if (!element || !(element instanceof Element)) {
      return "";
    }

    const ariaLabel = collapseWhitespace(element.getAttribute("aria-label"));
    if (ariaLabel) {
      return ariaLabel;
    }

    if ("value" in element && typeof element.value === "string") {
      const value = collapseWhitespace(element.value);
      if (value) {
        return value;
      }
    }

    return collapseWhitespace(element.textContent);
  }

  function getLinkUrl(element) {
    if (!element || !(element instanceof Element)) {
      return "";
    }

    const explicitUrl = collapseWhitespace(element.getAttribute("data-analytics-url"));
    if (explicitUrl) {
      return toAbsoluteUrl(explicitUrl);
    }

    if (typeof element.href === "string" && element.href) {
      return element.href;
    }

    const href = collapseWhitespace(element.getAttribute("href"));
    if (href) {
      return toAbsoluteUrl(href);
    }

    return "";
  }

  function shouldTrack(sourceElement, eventName) {
    if (!sourceElement || typeof eventName !== "string") {
      return false;
    }

    const now = Date.now();
    const lastEvent = recentInteractions.get(sourceElement);
    if (lastEvent && lastEvent.name === eventName && now - lastEvent.time < 750) {
      return false;
    }

    recentInteractions.set(sourceElement, {
      name: eventName,
      time: now,
    });
    return true;
  }

  function buildEventParams(contextElement, actionElement) {
    const params = {
      page_location: window.location.href,
      page_title: document.title,
      language: document.documentElement.lang || navigator.language || "und",
    };

    const linkUrl = getLinkUrl(actionElement);
    if (linkUrl) {
      params.link_url = linkUrl;
    }

    const linkText = getLinkText(actionElement);
    if (linkText) {
      params.link_text = linkText;
    }

    const section = getSectionName(contextElement || actionElement);
    if (section) {
      params.section = section;
    }

    return params;
  }

  function trackInteraction(eventName, contextElement, actionElement) {
    if (!eventName || !shouldTrack(contextElement, eventName)) {
      return false;
    }
    if (!ensureAnalyticsConfigured()) {
      return false;
    }

    window.gtag("event", eventName, buildEventParams(contextElement, actionElement || contextElement));
    return true;
  }

  function handleTrackedClick(event) {
    if (event.isTrusted === false || !(event.target instanceof Element)) {
      return;
    }

    const element = event.target.closest(CLICK_SELECTOR);
    if (!element) {
      return;
    }

    const trackingKey = getTrackingKey(element);
    const eventName = EVENT_NAMES[trackingKey];
    if (!eventName) {
      return;
    }

    trackInteraction(eventName, element, element);
  }

  function handleTrackedSubmit(event) {
    if (
      event.isTrusted === false ||
      !(event.target instanceof HTMLFormElement) ||
      !event.target.matches("form[data-analytics-submit]")
    ) {
      return;
    }

    const trackingKey = normalizeKey(event.target.getAttribute("data-analytics-submit"));
    const eventName = EVENT_NAMES[trackingKey];
    if (!eventName) {
      return;
    }

    const actionElement = event.submitter instanceof Element ? event.submitter : event.target;
    trackInteraction(eventName, event.target, actionElement);
  }

  function updateConsent(granted) {
    consentGranted = !!granted;
    window.SBX_ANALYTICS_CONSENT_GRANTED = consentGranted;
    window.gtag("consent", consentModeInitialized || analyticsConfigured ? "update" : "default", {
      analytics_storage: consentGranted ? "granted" : "denied",
    });
    consentModeInitialized = true;

    if (consentGranted) {
      ensureAnalyticsConfigured();
    }
  }

  window.SandboxAnalytics = Object.assign(window.SandboxAnalytics || {}, {
    measurementId: MEASUREMENT_ID,
    updateConsent: updateConsent,
    trackEvent: function (eventName, params) {
      if (!ensureAnalyticsConfigured()) {
        return false;
      }
      window.gtag("event", eventName, params || {});
      return true;
    },
  });

  document.addEventListener("click", handleTrackedClick, true);
  document.addEventListener("submit", handleTrackedSubmit, true);

  ensureAnalyticsConfigured();
})();
