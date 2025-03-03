/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
  // This can be used to pass data to every page
  // event.locals.user = await getUser();

  // Special handling for SPA routes to help work with Kinsta static hosting
  const response = await resolve(event);
  
  // Ensure we're sending the right headers for HTML responses
  if (response.headers.get('content-type')?.includes('text/html')) {
    // Add cache control headers if needed
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }

  return response;
}; 