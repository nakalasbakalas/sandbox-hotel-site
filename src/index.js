/**
 * Cloudflare Workers script for serving static assets
 */
export default {
  async fetch(request, env) {
    // Use the ASSETS binding to serve files from the public directory
    const response = await env.ASSETS.fetch(request);
    const securedResponse = new Response(response.body, response);
    
    // Add security headers
    securedResponse.headers.set('X-Frame-Options', 'SAMEORIGIN');
    securedResponse.headers.set('X-Content-Type-Options', 'nosniff');
    securedResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    securedResponse.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    securedResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    securedResponse.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
    securedResponse.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com; img-src 'self' data: https://www.sandboxhotel.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; frame-src https://www.google.com; font-src 'self' data:; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests");
    
    return securedResponse;
  },
};
