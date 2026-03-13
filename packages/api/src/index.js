/**
 * Sandbox Hotel API worker
 * Handles backend API endpoints
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Example API routes
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (url.pathname === '/api/rooms') {
      // Brochure placeholder only. Live availability belongs in sandbox-pms.
      return new Response(
        JSON.stringify({ rooms: [] }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response('Not found', { status: 404 });
  },
};
