(function () {
  if (window.__SBX_ANALYTICS_INITIALIZED__) {
    return;
  }
  window.__SBX_ANALYTICS_INITIALIZED__ = true;

  const GA4_MEASUREMENT_ID = "G-2B2SGREN1Z";
  const MEASUREMENT_ID = String(window.SBX_GA_MEASUREMENT_ID ?? GA4_MEASUREMENT_ID).trim();
  const ATTRIBUTION_STORAGE_KEY = "sbx_attribution";
  const ATTRIBUTION_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
  const ATTRIBUTION_MAX_VALUE_LENGTH = 180;
  const ATTRIBUTION_KEYS = [
    "gclid",
    "gbraid",
    "wbraid",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content"
  ];
  const CLICK_SELECTOR = [
    "[data-analytics]",
    "a[href^='tel:']",
    "a[href*='line.me']",
    "a[href*='wa.me']",
    "a[href*='whatsapp']",
    "a[href^='mailto:']",
    "a[href*='maps.app.goo.gl']",
    "a[href*='google.com/maps']",
    "a[href*='facebook.com']",
    "a[href*='fb.com']",
    "a[href='#book']"
  ].join(",");
  const EVENT_NAMES = {
    "book-now": "book_cta_click",
    call: "contact_call_click",
    line: "contact_line_click",
    whatsapp: "contact_whatsapp_click",
    email: "contact_email_click",
    map: "map_directions_click",
    social: "social_outbound_click"
  };
  const EVENT_CATEGORIES = {
    book_cta_click: "booking",
    booking_submit_attempt: "booking",
    booking_send_success: "booking",
    sticky_cta_click: "booking",
    language_switch: "navigation",
    contact_call_click: "contact",
    contact_line_click: "contact",
    contact_whatsapp_click: "contact",
    contact_email_click: "contact",
    map_directions_click: "location",
    social_outbound_click: "social"
  };
  const recentInteractions = new WeakMap();
  let analyticsConfigured = Boolean(window.SBX_GA_CONFIGURED);
  let googleTagInjected = false;
  let cachedAttribution = null;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  function hasMeasurementId(id) {
    return /^G-[A-Z0-9]+$/i.test(id);
  }

  function hasGtmContainer() {
    return Boolean(
      document.querySelector("script[src*='googletagmanager.com/gtm.js']") ||
        document.querySelector("iframe[src*='googletagmanager.com/ns.html']")
    );
  }

  function getGoogleTagUrl() {
    return "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
  }

  function injectGoogleTag() {
    if (googleTagInjected || !hasMeasurementId(MEASUREMENT_ID)) {
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
    if (!hasMeasurementId(MEASUREMENT_ID) || hasGtmContainer()) {
      return false;
    }

    injectGoogleTag();
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
      send_page_view: false,
      page_path: getPagePath(),
      page_title: document.title
    });
    analyticsConfigured = true;
    return true;
  }

  function collapseWhitespace(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function normalizeKey(value) {
    return collapseWhitespace(value).toLowerCase();
  }

  function slugify(value) {
    return collapseWhitespace(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function toAbsoluteUrl(value) {
    if (!value) {
      return "";
    }

    try {
      return new URL(value, window.location.href).href;
    } catch (_error) {
      return String(value || "");
    }
  }

  function getCanonicalUrl() {
    const canonical = document.querySelector("link[rel='canonical']");
    return canonical ? canonical.href : window.location.href;
  }

  function getPagePath() {
    return window.location.pathname + window.location.search;
  }

  function getLanguage() {
    return document.documentElement.lang || navigator.language || "und";
  }

  function getBookingForm() {
    return document.getElementById("bookingForm");
  }

  function getStorage() {
    try {
      return window.localStorage || window.sessionStorage || null;
    } catch (_error) {
      return null;
    }
  }

  function sanitizeAttributionValue(value) {
    return String(value || "")
      .replace(/[\u0000-\u001f\u007f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, ATTRIBUTION_MAX_VALUE_LENGTH);
  }

  function sanitizeAttributionPayload(value) {
    const source = value && typeof value === "object" ? value : {};
    const attribution = {};

    ATTRIBUTION_KEYS.forEach(function (key) {
      const cleanValue = sanitizeAttributionValue(source[key]);
      if (cleanValue) {
        attribution[key] = cleanValue;
      }
    });

    const capturedAt = sanitizeAttributionValue(source.captured_at);
    if (capturedAt && !Number.isNaN(Date.parse(capturedAt))) {
      attribution.captured_at = capturedAt;
    }

    const landingPagePath = sanitizeAttributionValue(source.landing_page_path);
    if (landingPagePath && landingPagePath.charAt(0) === "/") {
      attribution.landing_page_path = landingPagePath;
    }

    return attribution;
  }

  function hasAttributionParams(value) {
    return ATTRIBUTION_KEYS.some(function (key) {
      return Boolean(value && value[key]);
    });
  }

  function readAttributionFromUrl() {
    const searchParams = new URLSearchParams(window.location.search);
    const attribution = {};

    ATTRIBUTION_KEYS.forEach(function (key) {
      const cleanValue = sanitizeAttributionValue(searchParams.get(key));
      if (cleanValue) {
        attribution[key] = cleanValue;
      }
    });

    if (!hasAttributionParams(attribution)) {
      return {};
    }

    attribution.captured_at = new Date().toISOString();
    attribution.landing_page_path = window.location.pathname || "/";
    return attribution;
  }

  function readStoredAttribution() {
    const storage = getStorage();
    if (!storage) {
      return {};
    }

    try {
      const parsed = JSON.parse(storage.getItem(ATTRIBUTION_STORAGE_KEY) || "{}");
      const attribution = sanitizeAttributionPayload(parsed);
      const capturedAtMs = Date.parse(attribution.captured_at || "");
      if (!Number.isFinite(capturedAtMs) || Date.now() - capturedAtMs > ATTRIBUTION_MAX_AGE_MS) {
        storage.removeItem(ATTRIBUTION_STORAGE_KEY);
        return {};
      }
      return attribution;
    } catch (_error) {
      storage.removeItem(ATTRIBUTION_STORAGE_KEY);
      return {};
    }
  }

  function writeStoredAttribution(attribution) {
    const storage = getStorage();
    if (!storage || !hasAttributionParams(attribution)) {
      return;
    }

    try {
      storage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
    } catch (_error) {}
  }

  function initAttribution() {
    const urlAttribution = readAttributionFromUrl();
    if (hasAttributionParams(urlAttribution)) {
      cachedAttribution = urlAttribution;
      writeStoredAttribution(urlAttribution);
      return cachedAttribution;
    }

    cachedAttribution = readStoredAttribution();
    return cachedAttribution;
  }

  function getAttribution() {
    if (cachedAttribution === null) {
      initAttribution();
    }
    return sanitizeAttributionPayload(cachedAttribution || {});
  }

  function getAttributionEventParams() {
    const attribution = getAttribution();
    const params = {};

    ATTRIBUTION_KEYS.forEach(function (key) {
      if (attribution[key]) {
        params[key] = attribution[key];
      }
    });

    if (attribution.captured_at) {
      params.attribution_captured_at = attribution.captured_at;
    }
    if (attribution.landing_page_path) {
      params.attribution_landing_page_path = attribution.landing_page_path;
    }

    return params;
  }

  function getFieldValue(id) {
    const field = document.getElementById(id);
    if (!field || typeof field.value !== "string") {
      return "";
    }
    return collapseWhitespace(field.value);
  }

  function getBookingContext(actionElement) {
    return {
      room_type: collapseWhitespace(
        (actionElement && actionElement.getAttribute && actionElement.getAttribute("data-room")) || getFieldValue("room")
      ),
      guests: getFieldValue("guests"),
      checkin: getFieldValue("checkin"),
      checkout: getFieldValue("checkout")
    };
  }

  function getSectionName(element) {
    if (!element || !(element instanceof Element)) {
      return "page";
    }

    const explicit = collapseWhitespace(element.getAttribute("data-cta-location"));
    if (explicit) {
      return explicit;
    }

    const trackedSection = element.closest("[data-analytics-section]");
    if (trackedSection) {
      return collapseWhitespace(trackedSection.getAttribute("data-analytics-section"));
    }

    const section = element.closest("section[id], header, footer, main, body");
    if (!section) {
      return "page";
    }
    if (section.id) {
      return slugify(section.id);
    }
    return slugify(section.tagName.toLowerCase()) || "page";
  }

  function getLinkText(element) {
    if (!element || !(element instanceof Element)) {
      return "";
    }

    const ariaLabel = collapseWhitespace(element.getAttribute("aria-label"));
    if (ariaLabel) {
      return ariaLabel;
    }
    if (typeof element.value === "string") {
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
    return toAbsoluteUrl(element.getAttribute("href"));
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
    if (href.indexOf("mailto:") === 0) {
      return "email";
    }
    if (href.indexOf("maps.app.goo.gl") !== -1 || href.indexOf("google.com/maps") !== -1) {
      return "map";
    }
    if (href.indexOf("facebook.com") !== -1 || href.indexOf("fb.com") !== -1) {
      return "social";
    }

    return "";
  }

  function shouldTrack(sourceElement, eventName) {
    if (!sourceElement || !eventName) {
      return false;
    }

    const now = Date.now();
    const lastEvent = recentInteractions.get(sourceElement);
    if (lastEvent && lastEvent.name === eventName && now - lastEvent.time < 750) {
      return false;
    }

    recentInteractions.set(sourceElement, {
      name: eventName,
      time: now
    });
    return true;
  }

  function buildEventParams(eventName, contextElement, actionElement, extraParams) {
    const action = actionElement || contextElement;
    const params = Object.assign(
      {
        event_category: EVENT_CATEGORIES[eventName] || "engagement",
        event_label: getLinkText(action),
        cta_location: getSectionName(contextElement || action),
        language: getLanguage(),
        page_path: getPagePath(),
        page_title: document.title
      },
      getBookingContext(action),
      getAttributionEventParams(),
      extraParams || {}
    );

    const linkUrl = getLinkUrl(action);
    if (linkUrl) {
      params.link_url = linkUrl;
    }

    Object.keys(params).forEach(function (key) {
      if (params[key] === "" || params[key] == null) {
        delete params[key];
      }
    });

    return params;
  }

  function pushToDataLayer(eventName, params) {
    const payload = Object.assign({ event: eventName }, params || {});
    window.dataLayer.push(payload);
    return payload;
  }

  function trackStructuredEvent(eventName, contextElement, actionElement, extraParams) {
    if (!eventName) {
      return false;
    }

    const params = buildEventParams(eventName, contextElement, actionElement, extraParams);
    pushToDataLayer(eventName, params);

    if (!window.SBX_GA_CONFIGURED && ensureAnalyticsConfigured()) {
      window.gtag("event", eventName, params);
    }

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
    if (!eventName || !shouldTrack(element, eventName)) {
      return;
    }

    trackStructuredEvent(eventName, element, element);
    const stickyContainer = element.closest("#stickyBottom, [data-analytics-section='sticky-bottom']");
    if (stickyContainer && shouldTrack(element, "sticky_cta_click")) {
      trackStructuredEvent("sticky_cta_click", stickyContainer, element, {
        sticky_action: trackingKey || "unknown"
      });
    }
  }

  function handleTrackedSubmit(event) {
    if (
      event.isTrusted === false ||
      !(event.target instanceof HTMLFormElement) ||
      !event.target.matches("form[data-analytics-submit]") ||
      !shouldTrack(event.target, "booking_submit_attempt")
    ) {
      return;
    }

    const actionElement = event.submitter instanceof Element ? event.submitter : event.target;
    trackStructuredEvent("booking_submit_attempt", event.target, actionElement, {
      event_label: getLinkText(actionElement) || "Booking form submit"
    });
  }

  function pushPageContext() {
    pushToDataLayer(
      "page_context",
      Object.assign(
        {
          page_type: "hotel_landing_page",
          language: getLanguage(),
          page_title: document.title,
          page_path: getPagePath(),
          canonical_url: getCanonicalUrl()
        },
        getAttributionEventParams()
      )
    );
  }

  function updateConsent(granted) {
    window.SBX_ANALYTICS_CONSENT_GRANTED = !!granted;
    if (granted) {
      ensureAnalyticsConfigured();
    }
  }

  function getSafeBookingEventData(bookingData) {
    const source = bookingData && typeof bookingData === "object" ? bookingData : {};
    return {
      room_type: collapseWhitespace(source.room_type || source.room),
      guests: collapseWhitespace(source.guests),
      checkin: collapseWhitespace(source.checkin),
      checkout: collapseWhitespace(source.checkout)
    };
  }

  function getBookingChannelParams(channel, bookingData) {
    const channelKey = collapseWhitespace(channel).toLowerCase() || "booking_send";
    return Object.assign(getSafeBookingEventData(bookingData), {
      event_label: channelKey,
      send_channel: channelKey
    });
  }

  window.SandboxAnalytics = Object.assign(window.SandboxAnalytics || {}, {
    measurementId: MEASUREMENT_ID,
    attributionKeys: ATTRIBUTION_KEYS.slice(),
    getAttribution: getAttribution,
    pushEvent: function (eventName, params) {
      return pushToDataLayer(eventName, params || {});
    },
    trackEvent: function (eventName, params) {
      return trackStructuredEvent(eventName, null, null, params || {});
    },
    trackBookingAttempt: function (channel, bookingData, contextElement) {
      return trackStructuredEvent(
        "booking_submit_attempt",
        contextElement || getBookingForm() || document.body,
        contextElement || getBookingForm(),
        getBookingChannelParams(channel, bookingData)
      );
    },
    trackBookingSuccess: function (channel, bookingData, contextElement) {
      return trackStructuredEvent(
        "booking_send_success",
        contextElement || getBookingForm() || document.body,
        contextElement || getBookingForm(),
        getBookingChannelParams(channel, bookingData)
      );
    },
    updateConsent: updateConsent
  });

  initAttribution();
  pushPageContext();
  document.addEventListener("click", handleTrackedClick, true);
  document.addEventListener("submit", handleTrackedSubmit, true);
  ensureAnalyticsConfigured();
})();
