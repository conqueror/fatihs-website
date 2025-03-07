// Enable prerendering
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export function load({ url }) {
  // Get query parameters
  const query = url.searchParams.get('query') || '';
  const type = url.searchParams.get('type') || 'all';
  
  // Initial empty state for search
  return {
    query,
    type,
    results: [],
    blogResults: [],
    publicationResults: [],
    eventResults: []
  };
} 