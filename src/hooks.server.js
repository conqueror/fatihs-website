/**
 * Server hooks for response header management and asset optimization
 */

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const url = new URL(event.request.url);
  const isAsset = url.pathname.match(/\.(jpe?g|png|gif|svg|webp|avif|woff2?|css|js)$/i);
  const isImage = url.pathname.match(/\.(jpe?g|png|gif|svg|webp|avif)$/i);
  const isFont = url.pathname.match(/\.(woff2?)$/i);
  const isJs = url.pathname.match(/\.(js)$/i);
  const isCss = url.pathname.match(/\.(css)$/i);
  
  // Set appropriate caching headers based on resource type
  const response = await resolve(event, {
    // Control how responses are transformed
    transformPageChunk: ({ html }) => {
      // Add HTML level optimization
      return html
        .replace(/<script/g, '<script defer')
        .replace(/ type="module"/g, ' type="module" fetchpriority="high"');
    },
    // Configure preloading of fonts in resource headers
    preload: ({ type, path }) => {
      // Preload critical paths
      if (type === 'font' || 
          (type === 'css' && path.includes('global.css')) || 
          path.includes('_app/immutable/entry/start')) {
        return true;
      }
      return false;
    }
  });

  // Set security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Set agressive cache headers for static assets
  if (isAsset) {
    // Cache immutable assets for 1 year
    if (url.pathname.includes('_app/immutable/')) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Cache images for 1 week
    else if (isImage) {
      response.headers.set('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    }
    // Cache fonts for 1 year (they rarely change)
    else if (isFont) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Cache JS and CSS for 1 day
    else if (isJs || isCss) {
      response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
    }
  } else {
    // Set short cache for HTML with revalidation
    response.headers.set('Cache-Control', 'public, max-age=600, stale-while-revalidate=30');
  }
  
  // Set Content Security Policy for added security - including Google Fonts
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'"
  );
  
  // Return the response with all headers set
  return response;
}

/**
 * This handle server errors for appropriate error responses
 * @type {import('@sveltejs/kit').HandleServerError}
 */
export function handleError({ error, event }) {
  // Log server errors for monitoring
  console.error('Server error:', error);
  
  // Return structured error for client
  return {
    message: 'An unexpected error occurred. Our team has been notified.',
    code: error?.code || 'UNKNOWN'
  };
} 