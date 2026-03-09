/**
 * Cloudflare Workers script for serving static hotel site
 * Static assets are served automatically via wrangler assets configuration
 */
export default {
  async fetch(request) {
    // All requests are handled by the static asset serving
    // If a route doesn't match, return 404
    return new Response('Page not found', {
      status: 404,
      statusText: 'Not Found',
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  },
};
