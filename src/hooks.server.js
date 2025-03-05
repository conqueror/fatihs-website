/**
 * Server hooks for response header management and asset optimization
 */

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Set appropriate caching headers based on resource type
  const response = await resolve(event, {
    // Configure preloading of fonts in resource headers
    preload: ({ type, path }) => {
      // Always preload primary font files
      if (type === 'font' && 
          (path.includes('inter-var.woff2') || path.includes('fira-code-var.woff2'))) {
        return true;
      }
      
      // Preload critical styles and scripts
      if (type === 'css' || path.includes('_app/immutable/entry')) {
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
  
  // Set Content Security Policy for added security
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'"
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