// Service Worker — Sandbox Hotel
// Bump CACHE_VERSION to invalidate all caches on next deploy.
const CACHE_VERSION = 'v1';
const STATIC_CACHE  = `sandbox-hotel-static-${CACHE_VERSION}`;
const IMAGE_CACHE   = `sandbox-hotel-images-${CACHE_VERSION}`;

// Resources fetched and stored during SW install.
// Keep this list small — only shell + critical above-fold assets.
const PRECACHE_URLS = [
  '/',
  '/404.html',
  '/site.webmanifest',
  '/images/Sandbox-Hotel-Hero-Banner.webp',
  '/images/Sandbox-Hotel-Hero-Banner-720.webp',
];

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const KEEP = new Set([STATIC_CACHE, IMAGE_CACHE]);
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => !KEEP.has(k)).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  // Only handle GET requests over http(s).
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  // API routes — network-only, never cache.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Images — cache-first; store on first fetch for subsequent visits.
  if (
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/assets/images/')
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  // Everything else (HTML, fonts, manifests) — network-first;
  // fall back to cache, then to precached '/' as last resort.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          caches.open(STATIC_CACHE)
            .then((cache) => cache.put(event.request, response.clone()));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request)
          .then((cached) => cached || caches.match('/'))
      )
  );
});
