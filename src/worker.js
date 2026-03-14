/**
 * Cloudflare Worker for the brochure site.
 *
 * This worker serves static marketing assets and provides convenience redirects
 * into the canonical booking and staff applications. It does not proxy PMS
 * traffic or host operational logic.
 */

const BOOKING_DIRECT_PATH_PREFIXES = ["/availability", "/booking", "/payments"];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/site-config.js") {
      return buildPublicSiteConfigResponse(env);
    }
    const redirectTarget = resolveCanonicalRedirect(url, env);
    if (redirectTarget) {
      return Response.redirect(redirectTarget, 308);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const response = new Response(assetResponse.body, assetResponse);

    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    applySeoGuardrails(response, url, env);

    return response;
  },
};

function resolveCanonicalRedirect(url, env) {
  const bookingBaseUrl = normalizeBaseUrl(env.BOOKING_ENGINE_URL);
  const staffBaseUrl = normalizeBaseUrl(env.STAFF_APP_URL);
  const pathname = url.pathname || "/";

  if (pathname === "/book" || pathname.startsWith("/book/")) {
    if (!bookingBaseUrl) {
      return null;
    }
    const forwardedPath = pathname === "/book" ? "/" : pathname.slice("/book".length);
    return joinUrl(bookingBaseUrl, forwardedPath || "/", url.search);
  }

  if (pathname === "/staff" || pathname.startsWith("/staff/")) {
    if (!staffBaseUrl) {
      return null;
    }
    return joinUrl(staffBaseUrl, pathname, url.search);
  }

  if (BOOKING_DIRECT_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    if (!bookingBaseUrl) {
      return null;
    }
    return joinUrl(bookingBaseUrl, pathname, url.search);
  }

  return null;
}

function normalizeBaseUrl(value) {
  const cleaned = String(value || "").trim();
  if (!cleaned) {
    return null;
  }
  return cleaned.replace(/\/+$/, "");
}

function buildPublicSiteConfigResponse(env) {
  const config = {
    MARKETING_SITE_URL: normalizeBaseUrl(env.MARKETING_SITE_URL) || "",
    BOOKING_ENGINE_URL: normalizeBaseUrl(env.BOOKING_ENGINE_URL) || "",
    STAFF_APP_URL: normalizeBaseUrl(env.STAFF_APP_URL) || "",
  };
  const body = `window.__SBX_PUBLIC_CONFIG__ = Object.freeze(${JSON.stringify(config)});\n`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function joinUrl(baseUrl, path, search = "") {
  const normalizedPath = `/${String(path || "/").replace(/^\/+/, "")}`;
  const normalizedSearch = String(search || "");
  return `${baseUrl}${normalizedPath}${normalizedSearch}`;
}

function applySeoGuardrails(response, url, env) {
  const marketingBaseUrl = normalizeBaseUrl(env.MARKETING_SITE_URL);
  if (!marketingBaseUrl) {
    return;
  }
  const canonicalHost = new URL(marketingBaseUrl).host.toLowerCase();
  if (url.host.toLowerCase() !== canonicalHost) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
}
