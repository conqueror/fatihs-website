/** @type {import('./$types').PageLoad} */
export function load({ url }) {
  const query = url.searchParams.get('query') || '';
  const type = url.searchParams.get('type') || 'all'; // e.g., 'all', 'blog', 'publications'

  // For a static site, the actual filtering will likely happen client-side,
  // but we pass the parameters through load for consistency and potential future use.
  return {
    searchQuery: query,
    searchType: type
  };
}

// Changed to enable prerendering for static site generation
export const prerender = true;

// Removed duplicate imports and load function below that were causing the error 