/**
 * Service Worker for fatihnayebi.com
 * Implements modern caching strategies for assets and provides offline functionality
 * with special handling for mobile devices
 */

// Cache names with versioning for better updates
const CACHE_NAMES = {
  static: 'static-cache-v2', // Increment cache version
  images: 'images-cache-v2',
  pages: 'pages-cache-v2',
  fonts: 'fonts-cache-v2',
  mobile: 'mobile-cache-v2' // Specific cache for mobile devices
};

// Assets to pre-cache for offline use
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/404.html',
  '/offline.html', // Create this page for better offline experience
  '/manifest.json',
  '/images/optimized/profile-320.webp', // Small version of profile for offline
  '/images/optimized/profile-placeholder.webp'
];

// Max age for different types of cached content
const MAX_AGE = {
  static: 30 * 24 * 60 * 60, // 30 days for static assets (desktop)
  images: 7 * 24 * 60 * 60,  // 7 days for images
  pages: 24 * 60 * 60,       // 1 day for pages
  fonts: 365 * 24 * 60 * 60, // 1 year for fonts
  mobile: {
    static: 7 * 24 * 60 * 60,  // 7 days for static assets on mobile
    images: 3 * 24 * 60 * 60,  // 3 days for images on mobile
    pages: 12 * 60 * 60,       // 12 hours for pages on mobile
    fonts: 30 * 24 * 60 * 60   // 30 days for fonts on mobile
  }
};

// Check if client is likely a mobile device
function isMobileClient() {
  return self.navigator?.userAgent?.toLowerCase().includes('mobile') || false;
}

// Install event - cache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAMES.static)
      .then(cache => {
        console.log('Precaching critical assets...');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            // Delete caches that start with our name but aren't current
            return Object.values(CACHE_NAMES).indexOf(cacheName) === -1 &&
                  (cacheName.startsWith('static-cache') || 
                   cacheName.startsWith('images-cache') ||
                   cacheName.startsWith('pages-cache') ||
                   cacheName.startsWith('fonts-cache') ||
                   cacheName.startsWith('mobile-cache'));
          })
          .map(cacheName => {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Function to determine which cache to use
function getCacheForUrl(url, isMobile = false) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  
  // For mobile devices, use mobile-specific cache
  if (isMobile) {
    return CACHE_NAMES.mobile;
  }
  
  // Logic to determine the appropriate cache for desktop
  if (pathname.match(/\.(jpe?g|png|gif|svg|webp|avif)$/i)) {
    return CACHE_NAMES.images;
  } else if (pathname.match(/\.(woff2?|ttf|otf|eot)$/i)) {
    return CACHE_NAMES.fonts;
  } else if (pathname.startsWith('/_app/') || 
             pathname.match(/\.(js|css)$/i)) {
    return CACHE_NAMES.static;
  } else {
    return CACHE_NAMES.pages;
  }
}

// Fetch event - implement stale-while-revalidate strategy
self.addEventListener('fetch', event => {
  // Skip non-GET requests and requests to other domains
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Detect if request is from mobile
  const isMobile = event.clientId ? 
    clients.get(event.clientId).then(client => client?.url?.toLowerCase().includes('mobile')) : 
    isMobileClient();
  
  // Use different strategies based on URL patterns
  const url = new URL(event.request.url);
  
  // For API endpoints - network only
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // For asset files - Cache First with network fallback and update
  if (url.pathname.match(/\.(js|css|woff2?|jpe?g|png|gif|svg|webp|avif|ico)$/i)) {
    event.respondWith(
      Promise.resolve(isMobile).then(mobileClient => {
        return caches.open(getCacheForUrl(event.request.url, mobileClient))
          .then(cache => {
            return cache.match(event.request)
              .then(cachedResponse => {
                // For mobile clients, always try network first for fresher content
                if (mobileClient) {
                  const fetchPromise = fetch(event.request)
                    .then(networkResponse => {
                      // Update cache with fresh response if we get it
                      if (networkResponse.ok) {
                        cache.put(event.request, networkResponse.clone());
                      }
                      return networkResponse;
                    })
                    .catch(() => {
                      // Network failed, return cached version
                      console.log('Network fetch failed for mobile asset:', event.request.url);
                      return cachedResponse || caches.match('/offline.html');
                    });
                  
                  // For mobile, use network first but fall back to cache
                  return fetchPromise.catch(() => cachedResponse);
                } else {
                  // For desktop, use cache first with background update
                  const fetchPromise = fetch(event.request)
                    .then(networkResponse => {
                      if (networkResponse.ok) {
                        cache.put(event.request, networkResponse.clone());
                      }
                      return networkResponse;
                    })
                    .catch(() => {
                      console.log('Network fetch failed for asset:', event.request.url);
                    });
                  
                  // Return the cached response right away if we have it
                  return cachedResponse || fetchPromise;
                }
              });
          });
      })
    );
    return;
  }
  
  // For HTML pages - Network First for mobile, Stale While Revalidate for desktop
  event.respondWith(
    Promise.resolve(isMobile).then(mobileClient => {
      return caches.open(CACHE_NAMES.pages)
        .then(cache => {
          if (mobileClient) {
            // Network First strategy for mobile devices
            return fetch(event.request)
              .then(networkResponse => {
                if (networkResponse.ok) {
                  // Update cache with the new version
                  cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
              })
              .catch(() => {
                // If network fails, try cache
                return cache.match(event.request)
                  .then(cachedResponse => {
                    return cachedResponse || caches.match('/offline.html');
                  });
              });
          } else {
            // Stale While Revalidate for desktop
            return cache.match(event.request)
              .then(cachedResponse => {
                const fetchPromise = fetch(event.request)
                  .then(networkResponse => {
                    if (networkResponse.ok) {
                      cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                  })
                  .catch(() => {
                    console.log('Network fetch failed for page:', event.request.url);
                    if (!cachedResponse) {
                      return caches.match('/offline.html');
                    }
                    return cachedResponse;
                  });
                
                return cachedResponse || fetchPromise;
              });
          }
        });
    })
  );
});

// Handle background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form-submission') {
    event.waitUntil(
      // Logic to resend stored form submissions when back online
      syncContactForms()
    );
  }
});

// Function to resync contact forms
async function syncContactForms() {
  try {
    const db = await openDatabase();
    const forms = await getAllStoredForms(db);
    
    for (const form of forms) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form.data)
        });
        
        if (response.ok) {
          await deleteStoredForm(db, form.id);
        }
      } catch (error) {
        console.error('Failed to sync form:', error);
      }
    }
  } catch (error) {
    console.error('Error syncing forms:', error);
  }
}

// Basic IndexedDB functions for form storage
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('contact-forms', 1);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('forms')) {
        db.createObjectStore('forms', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllStoredForms(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('forms', 'readonly');
    const store = transaction.objectStore('forms');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deleteStoredForm(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('forms', 'readwrite');
    const store = transaction.objectStore('forms');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
} 