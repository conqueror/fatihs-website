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
  
  // Improved mobile detection - check for common mobile keywords and screen characteristics
  const userAgent = event.request.headers.get('user-agent') || '';
  const isMobile = /mobile|android|iphone|ipod|ipad|windows phone/i.test(userAgent);
  
  // Set appropriate caching headers based on resource type
  const response = await resolve(event, {
    // Control how responses are transformed
    transformPageChunk: ({ html }) => {
      // Add HTML level optimization
      const optimizedHtml = html
        // Add defer to non-critical scripts
        .replace(/<script\b(?!.*\bfetchpriority=["']high["'])/g, '<script defer')
        // Add high priority to critical scripts
        .replace(/ type="module"/g, ' type="module" fetchpriority="high"')
        // Optimize images
        .replace(/<img\b(?!.*\bfetchpriority=["']high["'])/g, '<img loading="lazy" decoding="async"')
        // Add priority to critical headings for faster LCP
        .replace(/<h1 class="[^"]*critical-content[^"]*"/g, '<h1 class="critical-content" fetchpriority="high"');
        
      return optimizedHtml;
    },
    
    // Configure preloading of critical assets
    preload: ({ type, path }) => {
      // Always preload fonts
      if (type === 'font') {
        return true;
      }
      
      // Preload global styles
      if (type === 'css' && path.includes('global.css')) {
        return true;
      }
      
      // Preload main route entry point
      if (path.includes('_app/immutable/entry/start')) {
        return true;
      }
      
      // Preload important components for all devices (not just mobile)
      if ((path.includes('route-blog') || path.includes('components'))) {
        return true;
      }
      
      return false;
    }
  });

  // Set security headers - more permissive for mobile browsers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // High priority for all devices
  response.headers.set('Priority', 'high');
  
  // Debug header to help identify device type detection
  response.headers.set('X-Device-Type', isMobile ? 'mobile' : 'desktop');
  
  // Set caching headers for static assets - more permissive for mobile
  if (isAsset) {
    // Cache immutable assets - prefer revalidation on mobile
    if (url.pathname.includes('_app/immutable/')) {
      if (isMobile) {
        // Make mobile cache much shorter with revalidation to prevent issues
        response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400, must-revalidate');
      } else {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
    // Cache images - shorter time for mobile with revalidation
    else if (isImage) {
      if (isMobile) {
        response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      } else {
        response.headers.set('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
      }
    }
    // Cache fonts - still long but not immutable for mobile with revalidation
    else if (isFont) {
      if (isMobile) {
        response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
      } else {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
    // Cache JS and CSS - shorter for mobile with revalidation
    else if (isJs || isCss) {
      if (isMobile) {
        response.headers.set('Cache-Control', 'public, max-age=600, stale-while-revalidate=3600');
      } else {
        response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
      }
    }
  } else {
    // Set shorter cache for HTML with more frequent revalidation
    if (isMobile) {
      // For mobile, prefer fresh content with short max-age
      response.headers.set('Cache-Control', 'public, max-age=0, stale-while-revalidate=60, must-revalidate');
    } else {
      response.headers.set('Cache-Control', 'public, max-age=600, stale-while-revalidate=30');
    }
  }
  
  // Set a more permissive Content Security Policy
  // Much more permissive for mobile browsers which may handle CSP differently
  const cspDirectives = [
    "default-src 'self'",
    isMobile 
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.googleapis.com https://www.gstatic.com"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    isMobile
      ? "connect-src 'self' https://www.google-analytics.com https://*.googleapis.com https://*.gstatic.com"
      : "connect-src 'self' https://www.google-analytics.com https://*.googleapis.com",
    "img-src 'self' data: https://www.google-analytics.com https://*.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests"
  ];
  
  response.headers.set('Content-Security-Policy', cspDirectives.join('; '));
  
  // Use a shorter max-age for HSTS on mobile to prevent lockout
  if (isMobile) {
    // Completely remove preload directive for mobile to prevent permanent HTTPS issues
    response.headers.set('Strict-Transport-Security', 'max-age=86400'); // 1 day
  } else {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Add mobile-friendly headers
  if (isMobile) {
    // Enable view-transition API for smoother page transitions on mobile
    response.headers.set('View-Transition', 'same-origin');
    
    // Suggest to browsers that we support connection keep-alive
    response.headers.set('Connection', 'keep-alive');
    
    // Set device-specific picture preference
    response.headers.set('Device-Memory', '1');
    response.headers.set('Content-DPR', '2.0');
    
    // Add Vary header to properly handle caching based on User-Agent
    response.headers.set('Vary', 'User-Agent');
    
    // Allow cross-origin resource sharing for mobile
    response.headers.set('Access-Control-Allow-Origin', '*');
    
    // Ensure resources load via modern protocols
    response.headers.set('Alt-Svc', 'h3=":443"; ma=86400');
  }
  
  // Return the response with all headers set
  return response;
}

/**
 * This handle server errors for appropriate error responses
 * @type {import('@sveltejs/kit').HandleServerError}
 */
export function handleError({ error, event }) {
  // Get the client's user agent
  const userAgent = event.request.headers.get('user-agent') || '';
  const isMobile = /mobile|android|iphone|ipod|ipad|windows phone/i.test(userAgent);
  
  // Log server errors for monitoring
  console.error('Server error:', error, 'Device type:', isMobile ? 'mobile' : 'desktop');
  
  // Return structured error for client - more detailed for non-mobile users
  return {
    message: 'An unexpected error occurred. Our team has been notified.',
    code: error?.code || 'UNKNOWN',
    deviceType: isMobile ? 'mobile' : 'desktop',
    // Include more debugging info that might help troubleshoot
    userAgent: userAgent.substring(0, 100) // Truncate for security
  };
} 