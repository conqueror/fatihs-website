// We no longer need server-side search since we're doing it client-side
// We'll just provide initial data structure

/**
 * Initial page load handler - provides structure for search results
 */
export function load({ url }) {
  // Handle direct access to search page with query params in URL
  // In a prerendering context, url.searchParams may not be available
  let query = '';
  let type = 'all';
  
  try {
    // Only try to access searchParams if it's available
    query = url.searchParams?.get('query') || '';
    type = url.searchParams?.get('type') || 'all';
  } catch (error) {
    // If searchParams is not available, use default values
    console.log('Search params not available during prerendering');
  }
  
  return {
    query,
    type,
    results: [],
    blogResults: [],
    publicationResults: []
  };
} 