// Enhanced Service Worker for fatihnayebi.com
// Improves performance through intelligent caching strategies

const CACHE_NAME = 'fatih-nayebi-cache-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/404.html',
  '/favicon.ico',
  '/manifest.json',
  '/fonts/inter-var.woff2',
  '/_app/immutable/entry/app.509e9c41.js',
  '/_app/immutable/entry/start.9da6d18c.js',
  '/_app/immutable/assets/0.8fc21b4e.css'
];

// Cache strategies
const STRATEGIES = {
  // Cache first, then network
  CACHE_FIRST: async (request) => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    try {
      const networkResponse = await fetch(request);
      // Store fresh response in cache for next time
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      // If offline and no cache, return fallback
      return new Response('Network error happened', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  },
  
  // Network first, falling back to cache
  NETWORK_FIRST: async (request) => {
    try {
      const networkResponse = await fetch(request);
      // Store fresh response in cache for next time
      if (networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      // Fall back to cache if network fails
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // If no cached response, return error
      return new Response('Network error happened', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  },
  
  // Network only
  NETWORK_ONLY: async (request) => {
    return fetch(request);
  },
  
  // Cache only
  CACHE_ONLY: async (request) => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Not found in cache', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  },
  
  // Stale-while-revalidate
  STALE_WHILE_REVALIDATE: async (request) => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Clone the request for the network call
    const fetchPromise = fetch(request)
      .then(networkResponse => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      })
      .catch(error => {
        console.error('Error fetching resource:', error);
      });
    
    // Return cached response immediately if available
    return cachedResponse || fetchPromise;
  }
};

// Select strategy based on URL
const getStrategy = (url) => {
  const { pathname } = new URL(url, location.origin);
  
  // Immutable assets - aggressive caching
  if (pathname.includes('/_app/immutable/') || 
      pathname.endsWith('.woff2') || 
      pathname.endsWith('.jpg') || 
      pathname.endsWith('.png') ||
      pathname.endsWith('.webp')) {
    return STRATEGIES.CACHE_FIRST;
  }
  
  // API endpoints - always fresh
  if (pathname.startsWith('/api/')) {
    return STRATEGIES.NETWORK_ONLY;
  }
  
  // HTML pages - network first for latest content
  if (pathname.endsWith('/') || pathname.endsWith('.html')) {
    return STRATEGIES.NETWORK_FIRST;
  }
  
  // Default strategy for other resources
  return STRATEGIES.STALE_WHILE_REVALIDATE;
};

// Install event - precache important resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - apply strategy based on request
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  // Apply the appropriate caching strategy
  const strategy = getStrategy(event.request.url);
  event.respondWith(strategy(event.request));
}); 