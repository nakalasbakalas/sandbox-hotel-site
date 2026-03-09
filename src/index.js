/**
 * Cloudflare Workers script for serving static assets
 */
export default {
  async fetch(request, env) {
    // Use the ASSETS binding to serve files from the public directory
    let response = env.ASSETS.fetch(request);
    
    // Add security headers
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    return response;
  },
};
